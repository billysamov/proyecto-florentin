import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoRecordatorioClase } from "@/lib/emails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const authHeader = request.headers.get("authorization");

    // Validar token de seguridad (soporta Vercel Cron y servicios externos como cron-job.org)
    const vercelCronSecret = process.env.CRON_SECRET;
    const customToken = "florentin_secret_nurturing_token";

    const isValidToken = 
      token === customToken || 
      (vercelCronSecret && token === vercelCronSecret) || 
      (vercelCronSecret && authHeader === `Bearer ${vercelCronSecret}`);

    if (!isValidToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Consultar estado en la base de datos
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_recordatorio_clase_activo")
      .eq("id", 1)
      .maybeSingle();

    // Si la columna no existe o está en true (por defecto), procedemos
    const estaActivo = config ? config.email_recordatorio_clase_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Recordatorios Clase] El cron de recordatorios de clase está desactivado desde el panel.`);
      return NextResponse.json({ success: true, message: "Aviso de recordatorio de clase desactivado por configuración de usuario" });
    }

    // 2. Obtener clases programadas en las próximas 24 horas a las que no se les haya enviado el aviso
    const ahora = new Date();
    const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const { data: clases, error: errClases } = await supabaseAdmin
      .from("clases")
      .select(`
        id,
        fecha_hora,
        enlace_meet,
        usuario_id,
        usuarios ( email, nombre )
      `)
      .eq("estado", "programada")
      .eq("recordatorio_enviado", false)
      .gt("fecha_hora", ahora.toISOString())
      .lte("fecha_hora", en24Horas.toISOString());

    if (errClases) {
      console.error("Error obteniendo clases para recordatorios:", errClases);
      return NextResponse.json({ error: "Error consultando clases", details: errClases.message }, { status: 500 });
    }

    if (!clases || clases.length === 0) {
      return NextResponse.json({ success: true, message: "No hay clases programadas en las próximas 24h pendientes de recordatorio." });
    }

    // 3. Enviar correos y marcar como enviado
    const resultados = [];
    for (const clase of clases) {
      const usuario = Array.isArray(clase.usuarios) ? clase.usuarios[0] : clase.usuarios;
      if (!usuario || !usuario.email) continue;

      try {
        const cleanIdioma = 'es';
        
        // Formatear la fecha y hora para el correo
        const fechaObj = new Date(clase.fecha_hora);
        const fechaStr = fechaObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const horaStr = fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
        
        const meetLink = clase.enlace_meet && clase.enlace_meet !== 'pendiente'
          ? clase.enlace_meet 
          : `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com'}/alumno`;

        const res = await enviarCorreoRecordatorioClase(
          usuario.email, 
          usuario.nombre || "Estudiante", 
          fechaStr,
          horaStr,
          meetLink,
          cleanIdioma
        );
        
        if (res.success) {
          // Marcar en la base de datos
          await supabaseAdmin
            .from("clases")
            .update({ recordatorio_enviado: true })
            .eq("id", clase.id);
            
          resultados.push({ email: usuario.email, success: true, messageId: res.id });
        } else {
          resultados.push({ email: usuario.email, success: false, error: res.error });
        }
      } catch (errEmail) {
        console.error(`Error enviando recordatorio de clase a ${usuario.email}:`, errEmail);
        resultados.push({ email: usuario.email, success: false, error: errEmail });
      }
    }

    return NextResponse.json({
      success: true,
      alumnosAvisados: resultados.length,
      resultados
    });

  } catch (error: any) {
    console.error("Error en API Route /api/cron/recordatorios-clase:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
