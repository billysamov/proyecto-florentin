import { NextResponse } from "next/server";
import { enviarCorreoBienvenidaLead } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const { email, nombre, idioma } = await request.json();

    if (!email || !nombre) {
      return NextResponse.json({ error: "Faltan datos requeridos (email, nombre)" }, { status: 400 });
    }

    const cleanIdioma = (idioma || 'es').toLowerCase();
    const result = await enviarCorreoBienvenidaLead(email, nombre, cleanIdioma);

    return NextResponse.json({ success: true, message: "Correo de bienvenida enviado", result });
  } catch (error: any) {
    console.error("Error en API Route /api/auth/welcome:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
