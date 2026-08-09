import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoRenovacionPlan } from "@/lib/emails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Validar token de seguridad simple para evitar ejecuciones maliciosas externas
    const cronToken = process.env.CRON_SECRET || "florentin_secret_nurturing_token";
    if (token !== cronToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Consultar estado en la base de datos
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_renovacion_activo")
      .eq("id", 1)
      .maybeSingle();

    // Si la columna no existe o está en true (por defecto), procedemos
    const estaActivo = config ? config.email_renovacion_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Renovación Plan] El cron de aviso de renovación está desactivado desde el panel.`);
      return NextResponse.json({ success: true, message: "Aviso de renovación desactivado por configuración de usuario" });
    }

    // 2. Obtener inscripciones con <= 2 clases restantes que no hayan recibido el aviso
    const { data: inscripciones, error: errInsc } = await supabaseAdmin
      .from("inscripciones")
      .select(`
        id,
        clases_restantes,
        usuario_id,
        usuarios ( email, nombre, idioma )
      `)
      .lte("clases_restantes", 2)
      .eq("aviso_renovacion_enviado", false);

    if (errInsc) {
      console.error("Error obteniendo inscripciones para aviso de renovación:", errInsc);
      return NextResponse.json({ error: "Error consultando inscripciones" }, { status: 500 });
    }

    if (!inscripciones || inscripciones.length === 0) {
      return NextResponse.json({ success: true, message: "No hay alumnos pendientes de aviso de renovación." });
    }

    // 3. Enviar correos y marcar como enviado
    const resultados = [];
    for (const inscripcion of inscripciones) {
      const usuario = Array.isArray(inscripcion.usuarios) ? inscripcion.usuarios[0] : inscripcion.usuarios;
      if (!usuario || !usuario.email) continue;

      try {
        const cleanIdioma = (usuario.idioma || 'es').toLowerCase();
        const res = await enviarCorreoRenovacionPlan(usuario.email, usuario.nombre || "Estudiante", inscripcion.clases_restantes || 0, cleanIdioma);
        
        if (res.success) {
          // Marcar en la base de datos
          await supabaseAdmin
            .from("inscripciones")
            .update({ aviso_renovacion_enviado: true })
            .eq("id", inscripcion.id);
            
          resultados.push({ email: usuario.email, success: true, messageId: res.id });
        } else {
          resultados.push({ email: usuario.email, success: false, error: res.error });
        }
      } catch (errEmail) {
        console.error(`Error enviando aviso de renovación a ${usuario.email}:`, errEmail);
        resultados.push({ email: usuario.email, success: false, error: errEmail });
      }
    }

    return NextResponse.json({
      success: true,
      alumnosAvisados: resultados.length,
      resultados
    });

  } catch (error: any) {
    console.error("Error en API Route /api/cron/renovacion-plan:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
