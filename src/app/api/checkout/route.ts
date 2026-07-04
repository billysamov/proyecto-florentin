import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16" as any,
    });
    const { planId, usuarioId, email, nombre, divisa } = await request.json();

    if (!planId || !usuarioId || !email) {
      return NextResponse.json({ error: "Faltan datos requeridos (planId, usuarioId, email)" }, { status: 400 });
    }

    const currency = divisa && divisa.toLowerCase() === "usd" ? "usd" : "eur";

    // 1. Obtener el plan directamente de la base de datos para mantener consistencia
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: planDb, error: planErr } = await supabaseAdmin
      .from("planes_estudio")
      .select("*")
      .eq("id", planId)
      .single();

    if (planErr || !planDb) {
      return NextResponse.json({ error: "ID de plan inválido o no encontrado en la base de datos" }, { status: 400 });
    }

    const planNombre = planDb.nombre;
    const clasesTotales = planDb.total_clases;
    // Usar la misma lógica de conversión que la Landing Page (Math.round(precio * 1.1))
    const precioBase = parseFloat(planDb.precio);
    const precio = currency === "usd" ? Math.round(precioBase * 1.1) : precioBase;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Se eliminó la simulación de desarrollo para forzar la pasarela real de Stripe

    // 2. Crear sesión de pago en Stripe con soporte de SCA y divisa elegida
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: planNombre,
              description: `Paquete educativo de ${clasesTotales} clases de francés en vivo con el profesor nativo Florentin.`,
            },
            unit_amount: Math.round(precio * 100), // En centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        usuario_id: usuarioId,
        plan_id: planId.toString(),
        plan_nombre: planNombre,
        total_clases: clasesTotales.toString(),
        nombre: nombre || "Estudiante de Francés",
        email: email,
        divisa: currency
      },
      success_url: `${appUrl}/alumno?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#planes`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (err: any) {
    console.error("Error al crear sesión de checkout de Stripe:", err);
    return NextResponse.json({ error: `Error en pasarela de pagos: ${err.message}` }, { status: 500 });
  }
}
