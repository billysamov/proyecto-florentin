import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { 
  enviarCorreoRecordatorioInactividad, 
  enviarCorreoRecordatorioInactividadSemanal 
} from "@/lib/emails";

/**
 * Consulta email_logs para saber si un correo de cierto tipo ya fue enviado a un destinatario.
 * Esto evita enviar correos duplicados si el cron se ejecuta varias veces.
 */
async function yaSeEnvioCorreo(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  destinatario: string,
  tipo: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("email_logs")
      .select("id")
      .eq("destinatario", destinatario)
      .eq("tipo", tipo)
      .eq("estado", "enviado")
      .limit(1);
    return !!(data && data.length > 0);
  } catch {
    // Si la tabla no existe o falla, permitir el envío (no bloquear)
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const authHeader = request.headers.get("authorization");

    // Validar token de seguridad (soporta Vercel Cron nativo y servicios externos con token)
    const vercelCronSecret = process.env.CRON_SECRET;
    const customToken = "florentin_secret_nurturing_token";
    const isVercelCron = request.headers.get("user-agent")?.includes("vercel-cron") || request.headers.get("x-vercel-cron") === "1";

    const isValidToken = 
      isVercelCron ||
      token === customToken || 
      (vercelCronSecret && token === vercelCronSecret) || 
      (vercelCronSecret && authHeader === `Bearer ${vercelCronSecret}`);

    if (!isValidToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 0. Consultar estado de automatizaciones en la base de datos
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_recordatorio_activo")
      .eq("id", 1)
      .maybeSingle();

    const estaActivo = config ? config.email_recordatorio_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Lead Nurturing] Cron desactivado desde panel de control.`);
      return NextResponse.json({ success: true, message: "Campaña de recordatorios desactivada por configuración de usuario" });
    }

    const ahora = new Date();
    
    // Ventana 1: Hace 3 días (entre 72h y 96h)
    const hace72h = new Date(ahora.getTime() - 72 * 60 * 60 * 1000).toISOString();
    const hace96h = new Date(ahora.getTime() - 96 * 60 * 60 * 1000).toISOString();

    // Ventana 2: Hace 1 semana / 7 días (entre 168h y 192h)
    const hace168h = new Date(ahora.getTime() - 168 * 60 * 60 * 1000).toISOString();
    const hace192h = new Date(ahora.getTime() - 192 * 60 * 60 * 1000).toISOString();

    // Ventana para Cohorte 3: 7 días desde última clase completada
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const resultados3Dias: any[] = [];
    const resultados7Dias: any[] = [];
    const resultadosRecompra: any[] = [];

    // ==============================================================
    // COHORTE 1: Recordatorio a los 3 Días de Inactividad
    // ==============================================================
    const { data: usuarios3Dias } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, nombre, idioma, creado_en")
      .eq("rol", "alumno")
      .gte("creado_en", hace96h)
      .lte("creado_en", hace72h);

    if (usuarios3Dias && usuarios3Dias.length > 0) {
      const uids3d = usuarios3Dias.map(u => u.id);
      const { data: inscripciones3d } = await supabaseAdmin
        .from("inscripciones")
        .select("usuario_id")
        .in("usuario_id", uids3d);

      const uidsConPlan3d = new Set(inscripciones3d?.map(i => i.usuario_id) || []);
      const leads3dSinPlan = usuarios3Dias.filter(u => !uidsConPlan3d.has(u.id));

      for (const lead of leads3dSinPlan) {
        // Deduplicación: verificar que no se haya enviado ya
        const yaEnviado = await yaSeEnvioCorreo(supabaseAdmin, lead.email, "inactividad_3dias");
        if (yaEnviado) {
          resultados3Dias.push({ email: lead.email, omitido: true, razon: "ya_enviado" });
          continue;
        }

        try {
          const cleanIdioma = (lead.idioma || 'es').toLowerCase();
          const res = await enviarCorreoRecordatorioInactividad(lead.email, lead.nombre || "Estudiante", cleanIdioma);
          resultados3Dias.push({ email: lead.email, success: res.success, messageId: res.id });
        } catch (errEmail: any) {
          console.error(`Error enviando recordatorio 3 días a ${lead.email}:`, errEmail);
          resultados3Dias.push({ email: lead.email, success: false, error: errEmail?.message });
        }
      }
    }

    // ==============================================================
    // COHORTE 2: Recordatorio a la 1 Semana (7 Días) de Inactividad
    // ==============================================================
    const { data: usuarios7Dias } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, nombre, idioma, creado_en")
      .eq("rol", "alumno")
      .gte("creado_en", hace192h)
      .lte("creado_en", hace168h);

    if (usuarios7Dias && usuarios7Dias.length > 0) {
      const uids7d = usuarios7Dias.map(u => u.id);
      const { data: inscripciones7d } = await supabaseAdmin
        .from("inscripciones")
        .select("usuario_id")
        .in("usuario_id", uids7d);

      const uidsConPlan7d = new Set(inscripciones7d?.map(i => i.usuario_id) || []);
      const leads7dSinPlan = usuarios7Dias.filter(u => !uidsConPlan7d.has(u.id));

      for (const lead of leads7dSinPlan) {
        const yaEnviado = await yaSeEnvioCorreo(supabaseAdmin, lead.email, "inactividad_7dias");
        if (yaEnviado) {
          resultados7Dias.push({ email: lead.email, omitido: true, razon: "ya_enviado" });
          continue;
        }

        try {
          const cleanIdioma = (lead.idioma || 'es').toLowerCase();
          const res = await enviarCorreoRecordatorioInactividadSemanal(lead.email, lead.nombre || "Estudiante", cleanIdioma);
          resultados7Dias.push({ email: lead.email, success: res.success, messageId: res.id });
        } catch (errEmail: any) {
          console.error(`Error enviando recordatorio 7 días a ${lead.email}:`, errEmail);
          resultados7Dias.push({ email: lead.email, success: false, error: errEmail?.message });
        }
      }
    }

    // ==============================================================
    // COHORTE 3: Alumnos que agotaron su plan y no recompraron en 7+ días
    // ==============================================================
    // Buscar la última clase completada de cada alumno cuya inscripción tiene clases_restantes = 0
    const { data: inscripcionesAgotadas } = await supabaseAdmin
      .from("inscripciones")
      .select("usuario_id, clases_restantes, actualizado_en, usuarios(id, email, nombre, idioma)")
      .eq("clases_restantes", 0)
      .lte("actualizado_en", hace7Dias)  // Solo inscripciones agotadas hace 7+ días
      .limit(30);

    if (inscripcionesAgotadas && inscripcionesAgotadas.length > 0) {
      const checkedUserIds = new Set<string>();

      for (const item of inscripcionesAgotadas) {
        const u = Array.isArray(item.usuarios) ? item.usuarios[0] : item.usuarios;
        if (!u || !u.email || checkedUserIds.has(u.id)) continue;
        checkedUserIds.add(u.id);

        // Verificar si tiene alguna otra inscripción activa con clases disponibles
        const { data: tieneActiva } = await supabaseAdmin
          .from("inscripciones")
          .select("id")
          .eq("usuario_id", u.id)
          .gt("clases_restantes", 0)
          .limit(1);

        if (tieneActiva && tieneActiva.length > 0) continue; // Tiene plan activo, omitir

        // Deduplicación: verificar que no se le haya enviado ya un correo de recompra
        const yaEnviado = await yaSeEnvioCorreo(supabaseAdmin, u.email, "inactividad_7dias");
        if (yaEnviado) {
          resultadosRecompra.push({ email: u.email, omitido: true, razon: "ya_enviado" });
          continue;
        }

        const cleanIdioma = (u.idioma || 'es').toLowerCase();
        try {
          const res = await enviarCorreoRecordatorioInactividadSemanal(u.email, u.nombre || "Estudiante", cleanIdioma);
          resultadosRecompra.push({ email: u.email, tipo: "recompra_7dias", success: res.success, messageId: res.id });
        } catch (errRecompra: any) {
          console.error(`Error enviando recordatorio recompra a ${u.email}:`, errRecompra);
          resultadosRecompra.push({ email: u.email, success: false, error: errRecompra?.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      cohorte3Dias: {
        totalEnviados: resultados3Dias.filter(r => r.success).length,
        totalOmitidos: resultados3Dias.filter(r => r.omitido).length,
        resultados: resultados3Dias
      },
      cohorte7Dias: {
        totalEnviados: resultados7Dias.filter(r => r.success).length,
        totalOmitidos: resultados7Dias.filter(r => r.omitido).length,
        resultados: resultados7Dias
      },
      cohorteRecompra: {
        totalEnviados: resultadosRecompra.filter(r => r.success).length,
        totalOmitidos: resultadosRecompra.filter(r => r.omitido).length,
        resultados: resultadosRecompra
      }
    });

  } catch (error: any) {
    console.error("Error en API Route /api/cron/lead-nurturing:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
