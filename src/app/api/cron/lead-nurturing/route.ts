import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { enviarCorreoRecordatorioInactividad } from "@/lib/emails";

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

    // 0. Consultar estado en la base de datos
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("email_recordatorio_activo")
      .eq("id", 1)
      .maybeSingle();

    // Si la columna no existe o está en true (por defecto), procedemos
    const estaActivo = config ? config.email_recordatorio_activo !== false : true;

    if (!estaActivo) {
      console.log(`[Lead Recordatorio] El cron de recordatorios de inactividad de 3 días está desactivado desde el panel de control.`);
      return NextResponse.json({ success: true, message: "Campaña de recordatorio de 3 días desactivada por configuración de usuario" });
    }

    const ahora = new Date();
    
    // Rango de tiempo: Hace 3 días (entre hace 72 y 96 horas)
    const hace72h = new Date(ahora.getTime() - 72 * 60 * 60 * 1000).toISOString();
    const hace96h = new Date(ahora.getTime() - 96 * 60 * 60 * 1000).toISOString();

    // 1. Obtener usuarios creados en ese intervalo
    const { data: usuarios, error: errUsers } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, nombre, creado_en")
      .eq("rol", "alumno")
      .gte("creado_en", hace96h)
      .lte("creado_en", hace72h);

    if (errUsers) {
      console.error("Error obteniendo usuarios de 3 días para lead-nurturing:", errUsers);
      return NextResponse.json({ error: "Error consultando usuarios" }, { status: 500 });
    }

    if (!usuarios || usuarios.length === 0) {
      return NextResponse.json({ success: true, message: "No se encontraron leads de hace 3 días." });
    }

    // 2. Obtener inscripciones de estos usuarios
    const userIds = usuarios.map(u => u.id);
    const { data: inscripciones, error: errInsc } = await supabaseAdmin
      .from("inscripciones")
      .select("usuario_id")
      .in("usuario_id", userIds);

    if (errInsc) {
      console.error("Error obteniendo inscripciones para lead-nurturing:", errInsc);
      return NextResponse.json({ error: "Error consultando inscripciones" }, { status: 500 });
    }

    const userIdsConPlan = new Set(inscripciones?.map(i => i.usuario_id) || []);

    // 3. Filtrar los leads que NO tienen plan
    const leadsSinPlan = usuarios.filter(u => !userIdsConPlan.has(u.id));

    if (leadsSinPlan.length === 0) {
      return NextResponse.json({ success: true, message: "Todos los leads de hace 3 días ya tienen un plan adquirido." });
    }

    // 4. Enviar correos de recordatorio de inactividad
    const resultados = [];
    for (const lead of leadsSinPlan) {
      try {
        const cleanIdioma = (lead.idioma || 'es').toLowerCase();
        const res = await enviarCorreoRecordatorioInactividad(lead.email, lead.nombre || "Estudiante", cleanIdioma);
        resultados.push({ email: lead.email, success: true, messageId: res.id });
      } catch (errEmail) {
        console.error(`Error enviando recordatorio a ${lead.email}:`, errEmail);
        resultados.push({ email: lead.email, success: false, error: errEmail });
      }
    }

    return NextResponse.json({
      success: true,
      leadsProcesados: leadsSinPlan.length,
      resultados
    });

  } catch (error: any) {
    console.error("Error en API Route /api/cron/lead-nurturing:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
