import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    // 1. Obtener la sesión y validar que el usuario sea administrador
    const supabaseAdmin = getSupabaseAdmin();
    
    // Obtener el token de autorización de los headers o cookies
    const authHeader = request.headers.get("Authorization");
    let userToken = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      userToken = authHeader.substring(7);
    } else {
      // Intentar obtener de las cookies si no viene en el header
      const cookieHeader = request.headers.get("cookie") || "";
      const tokenMatch = cookieHeader.match(/sb-[a-zA-Z0-9-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const parsed = JSON.parse(decodeURIComponent(tokenMatch[1]));
          userToken = parsed.access_token || "";
        } catch {}
      }
    }

    let user;
    if (userToken) {
      const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(userToken);
      user = authUser;
    } else {
      const { data: { user: sessionUser } } = await supabaseAdmin.auth.getUser();
      user = sessionUser;
    }

    if (!user) {
      return NextResponse.json({ error: "No autorizado. Inicie sesión nuevamente." }, { status: 401 });
    }

    // Verificar rol en la base de datos
    const { data: perfil, error: perfilErr } = await supabaseAdmin
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfilErr || !perfil || perfil.rol !== "admin") {
      return NextResponse.json({ error: "Acceso denegado. Se requieren permisos de administrador." }, { status: 403 });
    }

    // 2. Procesar la entrada del cuerpo
    const { destinatarioId, canal, asunto, mensaje } = await request.json();

    if (!destinatarioId || !canal || !mensaje) {
      return NextResponse.json({ error: "Faltan datos requeridos (destinatarioId, canal, mensaje)" }, { status: 400 });
    }

    if (canal !== "correo") {
      return NextResponse.json({ error: "Canal no soportado en el servidor" }, { status: 400 });
    }

    if (!asunto) {
      return NextResponse.json({ error: "El asunto es requerido para correos electrónicos" }, { status: 400 });
    }

    let emailsEnviados = 0;
    const fallas: string[] = [];

    const buildHtml = (nombre: string, contenido: string) => `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
        <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif;">Bonjour ${nombre}!</h2>
        <p style="font-size: 15px; color: #5a5a5a; line-height: 1.6; white-space: pre-line;">
          ${contenido}
        </p>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="font-size: 12px; color: #9a9a9a; text-align: center;">
          Florentin French. París, Francia.
        </p>
      </div>
    `;

    // 3. Determinar destinatarios y despachar
    if (destinatarioId === "todos") {
      const { data: alumnos, error: errorAlumnos } = await supabaseAdmin
        .from("usuarios")
        .select("nombre, email")
        .eq("rol", "alumno");

      if (errorAlumnos || !alumnos) {
        console.error("Error al obtener alumnos para envío masivo:", errorAlumnos);
        return NextResponse.json({ error: "Error al recuperar la lista de alumnos" }, { status: 500 });
      }

      for (const alumno of alumnos) {
        if (alumno.email) {
          const res = await sendEmail({
            to: alumno.email,
            subject: asunto,
            html: buildHtml(alumno.nombre || "Estudiante", mensaje)
          });
          if (res.success) {
            emailsEnviados++;
          } else {
            fallas.push(alumno.email);
          }
        }
      }
    } else {
      const { data: alumno, error: errorAlumno } = await supabaseAdmin
        .from("usuarios")
        .select("nombre, email")
        .eq("id", destinatarioId)
        .single();

      if (errorAlumno || !alumno) {
        return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
      }

      if (alumno.email) {
        const res = await sendEmail({
          to: alumno.email,
          subject: asunto,
          html: buildHtml(alumno.nombre || "Estudiante", mensaje)
        });
        if (res.success) {
          emailsEnviados++;
        } else {
          fallas.push(alumno.email);
        }
      }
    }

    return NextResponse.json({
      success: true,
      enviados: emailsEnviados,
      fallas: fallas.length > 0 ? fallas : undefined,
      message: `Se enviaron ${emailsEnviados} correos exitosamente.`
    }, { status: 200 });

  } catch (err: any) {
    console.error("Error interno en api/admin/enviar-notificacion:", err);
    return NextResponse.json({ error: `Error interno de servidor: ${err.message}` }, { status: 500 });
  }
}
