import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16" as any,
    });
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Falta session_id" }, { status: 400 });
    }

    // 1. Obtener los detalles de la sesión desde Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const supabaseAdmin = getSupabaseAdmin();
      const metadata = session.metadata;

      if (!metadata || !metadata.usuario_id) {
        return NextResponse.json({ error: "Metadata no encontrada en la sesión" }, { status: 400 });
      }

      // 2. Verificar si es una compra de producto digital (libro o cuaderno)
      if (metadata.tipo === "producto_digital") {
        const { data: existingCompra } = await supabaseAdmin
          .from("compras_productos")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existingCompra) {
          return NextResponse.json({ success: true, message: "Compra digital ya procesada." });
        }

        const emailComprador = metadata.email || session.customer_details?.email || "";
        const nombreComprador = metadata.nombre || session.customer_details?.name || "Estudiante";
        const monto = session.amount_total ? session.amount_total / 100 : 0;
        const divisa = session.currency || metadata.divisa || "eur";
        const prodId = parseInt(metadata.producto_id || "1", 10);

        // Asegurar que el usuario existe en tabla usuarios para que pueda acceder a /alumno
        if (metadata.usuario_id) {
          await supabaseAdmin
            .from("usuarios")
            .upsert({
              id: metadata.usuario_id,
              email: emailComprador,
              nombre: nombreComprador,
              rol: "alumno"
            }, { onConflict: "id" });
        }

        const { error: errorCompra } = await supabaseAdmin
          .from("compras_productos")
          .insert({
            usuario_id: metadata.usuario_id || null,
            producto_id: prodId,
            email_comprador: emailComprador,
            nombre_comprador: nombreComprador,
            monto_pagado: monto,
            divisa: divisa,
            stripe_session_id: session.id
          });

        if (errorCompra) {
          console.error("Error al registrar compra digital:", errorCompra);
        }

        return NextResponse.json({
          success: true,
          message: "Compra de producto digital verificada y registrada exitosamente",
          tipo: "producto_digital"
        });
      }

      // 3. Si es compra de plan de clases: verificar idempotencia
      const { data: existing } = await supabaseAdmin
        .from("inscripciones")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ success: true, message: "Sesión ya procesada." });
      }

      // 4. Registrar la inscripción de clases
      const planId = parseInt(metadata.plan_id, 10);
      const clasesTotales = parseInt(metadata.total_clases, 10);
      const monto = session.amount_total ? session.amount_total / 100 : 0;
      const divisa = session.currency || metadata.divisa;

      const { error: insError } = await supabaseAdmin.from("inscripciones").insert({
        usuario_id: metadata.usuario_id,
        plan_id: planId,
        estado_pago: "pagado",
        clases_restantes: clasesTotales,
        stripe_session_id: session.id,
        monto_pagado: monto,
        divisa: divisa
      });

      if (insError) {
        console.error("Error al insertar inscripción:", insError);
        return NextResponse.json({ error: "Error al registrar en base de datos" }, { status: 500 });
      }

      // 5. Actualizar el rol del usuario a alumno si no lo era
      await supabaseAdmin.from("usuarios").update({ rol: "alumno" }).eq("id", metadata.usuario_id);

      return NextResponse.json({ success: true, message: "Pago de clases verificado y registrado exitosamente" });
    } else {
      return NextResponse.json({ error: "El pago no está completado" }, { status: 400 });
    }

  } catch (err: any) {
    console.error("Error al verificar sesión de Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
