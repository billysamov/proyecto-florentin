import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoConfirmacionPago, enviarCorreoNotificacionProfesor } from "@/lib/emails";
import { enviarWhatsAppBienvenida } from "@/lib/whatsapp";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-01-27.accommodations" as never, // Api version estable
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  // 1. Proteger contra suplantaciones (CSRF/Spoofing) validando la firma del webhook
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!webhookSecret || (signature === "simulado" && isDevelopment)) {
    console.warn("STRIPE_WEBHOOK_SECRET no está configurada o se ha detectado simulación en desarrollo. Procesando sin validación de firma.");
    try {
      event = JSON.parse(body);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `Error parseando JSON de prueba: ${errorMessage}` }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`❌ Error en la firma del webhook de Stripe: ${errorMessage}`);
      return NextResponse.json({ error: `Firma inválida: ${errorMessage}` }, { status: 400 });
    }
  }

  // 2. Procesar el evento de checkout completado con éxito
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extraer datos desde los metadatos de la sesión
    const usuarioId = session.metadata?.usuario_id;
    const planId = session.metadata?.plan_id;
    const emailAlumno = session.customer_details?.email || session.metadata?.email;
    const nombreAlumno = session.customer_details?.name || session.metadata?.nombre || "Estudiante de Francés";
    const planNombre = session.metadata?.plan_nombre || "Plan Educativo";
    const totalClases = parseInt(session.metadata?.total_clases || "8", 10);

    if (!usuarioId || !planId) {
      console.error("Faltan metadatos críticos en la sesión de Stripe (usuario_id o plan_id).");
      return NextResponse.json({ error: "Faltan metadatos" }, { status: 400 });
    }

    try {
      const supabaseAdmin = getSupabaseAdmin();

      // Verificar idempotencia: evitar registros duplicados por reintentos de Stripe
      const { data: inscripcionExistente, error: errorCheck } = await supabaseAdmin
        .from("inscripciones")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (errorCheck) {
        console.error("Error al comprobar idempotencia del webhook:", errorCheck);
      }

      if (inscripcionExistente) {
        console.log(`[Stripe Webhook] Sesión de checkout ${session.id} ya fue procesada anteriormente.`);
        return NextResponse.json({ received: true, message: "Webhook ya procesado con éxito" }, { status: 200 });
      }

      // A1. Asegurar la existencia del perfil del usuario en la tabla 'usuarios' para evitar errores de clave foránea
      const { data: usuarioPerfil } = await supabaseAdmin
        .from("usuarios")
        .select("id")
        .eq("id", usuarioId)
        .maybeSingle();

      if (!usuarioPerfil) {
        console.log(`[Stripe Webhook] Creando perfil faltante para el usuario ${usuarioId} en tabla usuarios.`);
        const { error: errorCrearPerfil } = await supabaseAdmin
          .from("usuarios")
          .insert({
            id: usuarioId,
            email: emailAlumno || "",
            nombre: nombreAlumno,
            rol: "alumno"
          });

        if (errorCrearPerfil) {
          console.error("Error al crear perfil en webhook de Stripe:", errorCrearPerfil);
          return NextResponse.json({ error: "Error de consistencia de usuario en base de datos" }, { status: 500 });
        }
      }

      // A2. Registrar la inscripción y pago en la base de datos
      const { error: errorInscripcion } = await supabaseAdmin
        .from("inscripciones")
        .insert({
          usuario_id: usuarioId,
          plan_id: parseInt(planId, 10),
          estado_pago: "pagado",
          clases_restantes: totalClases,
          stripe_session_id: session.id,
          monto_pagado: session.amount_total ? session.amount_total / 100 : null,
          divisa: session.currency || "usd"
        });

      if (errorInscripcion) {
        console.error("Error al guardar inscripción en Supabase:", errorInscripcion);
        return NextResponse.json({ error: "Error en base de datos" }, { status: 500 });
      }

      // B. Actualizar el rol del usuario a 'alumno' si no lo era
      await supabaseAdmin
        .from("usuarios")
        .update({ rol: "alumno" })
        .eq("id", usuarioId);

      // C. Enviar correo de confirmación de pago automatizado al alumno
      try {
        if (emailAlumno) {
          await enviarCorreoConfirmacionPago(emailAlumno, nombreAlumno, planNombre, totalClases);
        }
      } catch (errAlumno) {
        console.error("Error al enviar correo de bienvenida al alumno:", errAlumno);
      }

      // D. Notificar al profesor (Florentin) por correo
      try {
        const { data: configSitio } = await supabaseAdmin
          .from("configuracion_sitio")
          .select("email_notificaciones")
          .eq("id", 1)
          .maybeSingle();

        const emailProfesor = configSitio?.email_notificaciones || process.env.SMTP_USER || "lefrancaisavecflorentin@outlook.com";
        const monto = session.amount_total ? session.amount_total / 100 : 0;
        const divisa = session.currency || "eur";

        if (emailProfesor) {
          await enviarCorreoNotificacionProfesor(
            emailProfesor,
            nombreAlumno,
            emailAlumno || "Estudiante",
            planNombre,
            totalClases,
            monto,
            divisa
          );
        }
      } catch (errProf) {
        console.error("Error al notificar al profesor de la venta:", errProf);
      }

      // E. Enviar WhatsApp de bienvenida al alumno (si tiene teléfono configurado)
      try {
        const { data: usuarioDb } = await supabaseAdmin
          .from("usuarios")
          .select("telefono")
          .eq("id", usuarioId)
          .maybeSingle();

        const telefonoAlumno = usuarioDb?.telefono || session.metadata?.telefono || session.customer_details?.phone;

        if (telefonoAlumno) {
          await enviarWhatsAppBienvenida({
            to: telefonoAlumno,
            nombreAlumno,
            planNombre
          });
        } else {
          console.log(`[Stripe Webhook] No se encontró número de teléfono para el usuario ${usuarioId}. WhatsApp omitido.`);
        }
      } catch (errWa) {
        console.error("[Stripe Webhook] Error al enviar notificación de WhatsApp:", errWa);
      }

      console.log(`✅ Inscripción procesada con éxito para el usuario ${usuarioId}. Plan: ${planNombre}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error interno al procesar el webhook: ${errorMessage}`);
      return NextResponse.json({ error: "Error interno de procesamiento" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
