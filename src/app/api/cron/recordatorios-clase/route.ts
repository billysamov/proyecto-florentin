import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoRecordatorioClase } from "@/lib/emails";

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

    // 1. Consultar si los recordatorios de clase están activos en la BD
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_recordatorio_clase_activo, enlace_meet_default")
      .eq("id", 1)
      .maybeSingle();

    const estaActivo = config ? config.email_recordatorio_clase_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Recordatorio Clases] El cron de recordatorios está desactivado desde el panel de control.`);
      return NextResponse.json({ success: true, message: "Recordatorios desactivados por configuración" });
    }

    const ahora = new Date();
    // Buscamos clases entre ahora y dentro de 24.5 horas (para tener un margen si el cron se retrasa)
    const en24Horas = new Date(ahora.getTime() + 24.5 * 60 * 60 * 1000).toISOString();

    // 2. Obtener clases programadas para las próximas 24 horas que NO han sido notificadas
    const { data: clases, error: errClases } = await supabaseAdmin
      .from("clases")
      .select(`
        id, 
        fecha_hora, 
        link_reunion,
        usuario_id,
        usuarios!inner (
          email,
          nombre,
          zona_horaria
        )
      `)
      .eq("estado", "programada")
      .eq("recordatorio_enviado", false)
      .gt("fecha_hora", ahora.toISOString())
      .lte("fecha_hora", en24Horas);

    if (errClases) {
      // Es posible que la columna recordatorio_enviado no exista si el usuario no ha corrido el SQL.
      console.error("Error obteniendo clases próximas (¿se corrió el script SQL?):", errClases);
      return NextResponse.json({ error: "Error consultando clases. Asegúrese de haber añadido la columna recordatorio_enviado." }, { status: 500 });
    }

    if (!clases || clases.length === 0) {
      return NextResponse.json({ success: true, message: "No hay clases próximas pendientes de notificar." });
    }

    // 3. Enviar correos y actualizar estado
    const resultados = [];
    for (const clase of clases) {
      try {
        const user = Array.isArray(clase.usuarios) ? clase.usuarios[0] : clase.usuarios;
        
        if (!user || !user.email) continue;

        const zonaHoraria = user.zona_horaria || config?.zona_horaria || "Europe/Paris";
        const dateObj = new Date(clase.fecha_hora);

        const fechaStr = new Intl.DateTimeFormat("es-ES", {
          timeZone: zonaHoraria,
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(dateObj);

        const horaStr = new Intl.DateTimeFormat("es-ES", {
          timeZone: zonaHoraria,
          hour: "2-digit",
          minute: "2-digit"
        }).format(dateObj) + " (" + zonaHoraria + ")";

        const meetLink = clase.link_reunion || config?.enlace_meet_default || "https://teams.microsoft.com/";

        await enviarCorreoRecordatorioClase(
          user.email,
          user.nombre || "Estudiante",
          fechaStr,
          horaStr,
          meetLink
        );

        // 4. Marcar como enviada en BD
        await supabaseAdmin
          .from("clases")
          .update({ recordatorio_enviado: true })
          .eq("id", clase.id);

        resultados.push({ id: clase.id, email: user.email, success: true });
      } catch (err) {
        console.error(`Error enviando recordatorio para la clase ${clase.id}:`, err);
        resultados.push({ id: clase.id, success: false, error: err });
      }
    }

    return NextResponse.json({
      success: true,
      clasesNotificadas: clases.length,
      resultados
    });

  } catch (error: any) {
    console.error("Error en API Route /api/cron/recordatorios-clase:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
