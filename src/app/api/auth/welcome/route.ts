import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoBienvenidaLead } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const { email, nombre, idioma } = await request.json();

    if (!email || !nombre) {
      return NextResponse.json({ error: "Faltan datos requeridos (email, nombre)" }, { status: 400 });
    }

    // 1. Consultar estado en la base de datos
    const supabaseAdmin = getSupabaseAdmin();
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_bienvenida_activo")
      .eq("id", 1)
      .maybeSingle();

    // Si la columna no existe o está en true (por defecto), procedemos
    const estaActivo = config ? config.email_bienvenida_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Lead Welcome] El correo de bienvenida automatizado está desactivado desde el panel de control.`);
      return NextResponse.json({ success: true, message: "Correo de bienvenida desactivado por configuración de usuario" });
    }

    const cleanIdioma = (idioma || 'es').toLowerCase();
    const result = await enviarCorreoBienvenidaLead(email, nombre, cleanIdioma);

    return NextResponse.json({ success: true, message: "Correo de bienvenida enviado", result });
  } catch (error: any) {
    console.error("Error en API Route /api/auth/welcome:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
