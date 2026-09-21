import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { productoTitulo, precio, divisa, email, nombre, tipo, id } = await request.json();

    if (!productoTitulo || !precio || !email) {
      return NextResponse.json(
        { error: "Faltan campos requeridos (productoTitulo, precio, email)" },
        { status: 400 }
      );
    }

    const currency = divisa && divisa.toLowerCase() === "usd" ? "usd" : "eur";
    const amountInCents = Math.round(Number(precio) * 100);

    const supabaseAdmin = getSupabaseAdmin();
    const { data: configDb } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("stripe_secret_key")
      .eq("id", 1)
      .single();

    const stripeSecret = configDb?.stripe_secret_key || process.env.STRIPE_SECRET_KEY || "";
    
    // Si no hay clave Stripe configurada en local o sandbox, simular URL de éxito para pruebas
    if (!stripeSecret || stripeSecret.includes("placeholder")) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({
        url: `${appUrl}/recursos/exito?demo=true&titulo=${encodeURIComponent(productoTitulo)}&email=${encodeURIComponent(email)}`
      });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2023-10-16" as any,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productoTitulo,
              description: `Material pedagógico digital de Le Français avec Florentin. Descarga inmediata + acceso permanente.`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        tipo: "producto_digital",
        subtipo: tipo || "documento",
        producto_id: id ? id.toString() : "1",
        producto_titulo: productoTitulo,
        nombre: nombre || "Comprador Digital",
        email: email,
        divisa: currency
      },
      success_url: `${appUrl}/alumno?success=true&session_id={CHECKOUT_SESSION_ID}&tipo=producto_digital&titulo=${encodeURIComponent(productoTitulo)}`,
      cancel_url: `${appUrl}/recursos`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (err: any) {
    console.error("Error en checkout de producto digital:", err);
    return NextResponse.json(
      { error: `Error en pasarela de pagos: ${err.message}` },
      { status: 500 }
    );
  }
}
