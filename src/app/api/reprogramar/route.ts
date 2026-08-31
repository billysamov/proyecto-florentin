import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  enviarCorreoReprogramacionClase, 
  enviarCorreoReprogramacionProfesor 
} from '@/lib/emails';

/**
 * POST /api/reprogramar
 * 
 * Endpoint seguro para reprogramar una clase.
 * Valida:
 * 1. Que falten al menos 24 horas para la fecha actual de la clase.
 * 2. Que queden intentos de reprogramación (reprogramaciones_restantes > 0).
 * 3. Que el nuevo horario esté disponible (sin colisiones).
 * 4. Descuenta 1 del contador de reprogramaciones de la clase.
 * 
 * Body: { clase_id: string, usuario_id: string, nueva_fecha_hora: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clase_id, usuario_id, nueva_fecha_hora, es_admin, reset_intentos } = body;

    // Validación de entrada
    if (!clase_id) {
      return NextResponse.json(
        { error: 'Se requiere clase_id' },
        { status: 400 }
      );
    }

    // Crear cliente admin para evadir RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Las acciones que se autodeclaran como administrador requieren verificar
    // una sesión real con rol "admin". Sin esto, cualquiera podría enviar
    // es_admin/reset_intentos en el body y saltarse las restricciones.
    if (es_admin || reset_intentos) {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '';

      if (!token) {
        return NextResponse.json({ error: 'No autorizado. Inicie sesión nuevamente.' }, { status: 401 });
      }

      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (!user) {
        return NextResponse.json({ error: 'No autorizado. Inicie sesión nuevamente.' }, { status: 401 });
      }

      const { data: perfil } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (!perfil || perfil.rol !== 'admin') {
        return NextResponse.json({ error: 'Acceso denegado. Se requieren permisos de administrador.' }, { status: 403 });
      }
    }

    // Accion especial: Restablecer intentos de reprogramacion por el administrador
    if (reset_intentos) {
      const { error: resetErr } = await supabaseAdmin
        .from('clases')
        .update({ reprogramaciones_restantes: 3 })
        .eq('id', clase_id);

      if (resetErr) {
        return NextResponse.json({ error: 'Error al restablecer intentos: ' + resetErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: '¡Intentos de reprogramación restablecidos exitosamente a 3!'
      });
    }

    if (!nueva_fecha_hora) {
      return NextResponse.json(
        { error: 'Se requiere nueva_fecha_hora' },
        { status: 400 }
      );
    }

    const nuevaFecha = new Date(nueva_fecha_hora);
    if (isNaN(nuevaFecha.getTime())) {
      return NextResponse.json(
        { error: 'Formato de nueva fecha inválido' },
        { status: 400 }
      );
    }

    if (nuevaFecha < new Date()) {
      return NextResponse.json(
        { error: 'No puedes programar una clase en el pasado' },
        { status: 400 }
      );
    }

    // ====== PASO 1: Obtener la clase y validar estado e intentos ======
    let query = supabaseAdmin.from('clases').select('*').eq('id', clase_id);
    if (usuario_id) query = query.eq('usuario_id', usuario_id);

    const { data: clase, error: claseError } = await query.single();

    if (claseError || !clase) {
      return NextResponse.json(
        { error: 'Clase no encontrada' },
        { status: 404 }
      );
    }

    if (clase.estado !== 'programada') {
      return NextResponse.json(
        { error: 'Solo se pueden reprogramar clases activas/programadas' },
        { status: 400 }
      );
    }

    // Si NO es el administrador, aplicar reglas estrictas de 24h e intentos
    if (!es_admin) {
      const ahora = new Date();
      const fechaActualClase = new Date(clase.fecha_hora);
      const diffHorasActual = (fechaActualClase.getTime() - ahora.getTime()) / (1000 * 60 * 60);

      if (diffHorasActual < 24) {
        return NextResponse.json(
          { error: 'No puedes reprogramar la clase con menos de 24 horas de anticipación. Por favor contacta al administrador.' },
          { status: 400 }
        );
      }

      const intentosRestantes = clase.reprogramaciones_restantes !== undefined ? clase.reprogramaciones_restantes : 2;
      if (intentosRestantes <= 0) {
        return NextResponse.json(
          { error: 'Has agotado el límite de reprogramaciones para esta clase. Por favor contacta al administrador por WhatsApp para resolverlo.' },
          { status: 400 }
        );
      }
    }

    // ====== PASO 2: Verificación de colisión en el nuevo horario ======
    const fechaInicio = new Date(nuevaFecha.getTime() - 30 * 60 * 1000); // -30 min
    const fechaFin = new Date(nuevaFecha.getTime() + 30 * 60 * 1000);    // +30 min

    const { data: colisiones, error: colError } = await supabaseAdmin
      .from('clases')
      .select('id')
      .eq('estado', 'programada')
      .neq('id', clase_id) // Ignorar la misma clase
      .gte('fecha_hora', fechaInicio.toISOString())
      .lte('fecha_hora', fechaFin.toISOString());

    if (colError) {
      console.error('Error al verificar colisiones:', colError);
      return NextResponse.json(
        { error: 'Error al validar disponibilidad del nuevo horario' },
        { status: 500 }
      );
    }

    if (colisiones && colisiones.length > 0) {
      return NextResponse.json(
        { error: 'El horario seleccionado ya está ocupado. Por favor elige otra hora.' },
        { status: 409 }
      );
    }

    // ====== PASO 3: Actualizar fecha e intentos ======
    const updateData: any = {
      fecha_hora: nuevaFecha.toISOString()
    };
    
    // Si la acción proviene del alumno, se descuenta 1 intento. Si es del Admin, no se descuenta.
    if (!es_admin && clase.reprogramaciones_restantes !== undefined) {
      updateData.reprogramaciones_restantes = Math.max(0, clase.reprogramaciones_restantes - 1);
    }

    const { error: updateError } = await supabaseAdmin
      .from('clases')
      .update(updateData)
      .eq('id', clase_id);

    if (updateError) {
      console.error('Error al actualizar clase:', updateError);
      return NextResponse.json(
        { error: 'Error al reprogramar la clase en la base de datos' },
        { status: 500 }
      );
    }

    // ====== PASO 4: Enviar Correo Automatizado de Notificación ======
    try {
      const [usuarioRes, configRes] = await Promise.all([
        supabaseAdmin
          .from('usuarios')
          .select('email, nombre, idioma')
          .eq('id', clase.usuario_id)
          .single(),
        supabaseAdmin
          .from('configuracion_sitio')
          .select('email_notificaciones')
          .eq('id', 1)
          .single()
      ]);

      const usuario = usuarioRes.data;
      const emailProfesor = configRes.data?.email_notificaciones || process.env.SMTP_USER || 'lefrancaisavecflorentin@outlook.com';

      if (usuario?.email) {
        const fechaOld = new Date(clase.fecha_hora);
        const fechaNew = new Date(nuevaFecha);
        const cleanIdioma = (usuario.idioma || 'es').toLowerCase();

        const localeStr = cleanIdioma === 'fr' ? 'fr-FR' : cleanIdioma === 'en' ? 'en-US' : 'es-ES';
        const opcionesFecha: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const opcionesHora: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        const fechaStr = fechaNew.toLocaleDateString(localeStr, opcionesFecha);
        const nuevaHoraStr = fechaNew.toLocaleTimeString(localeStr, opcionesHora);
        const horaAnteriorStr = fechaOld.toLocaleTimeString(localeStr, opcionesHora);

        // 1. Enviar correo al estudiante (en su idioma)
        await enviarCorreoReprogramacionClase(
          usuario.email,
          usuario.nombre || 'Estudiante',
          fechaStr,
          nuevaHoraStr,
          horaAnteriorStr,
          cleanIdioma,
          clase.enlace_meet
        );

        // 2. Enviar correo de notificación al profesor (siempre informado)
        if (emailProfesor) {
          await enviarCorreoReprogramacionProfesor(
            emailProfesor,
            usuario.nombre || 'Estudiante',
            usuario.email,
            fechaStr,
            nuevaHoraStr,
            horaAnteriorStr,
            clase.enlace_meet
          );
        }
      }
    } catch (mailErr) {
      console.error('Error no bloqueante al enviar correo de reprogramación:', mailErr);
    }

    return NextResponse.json({
      success: true,
      intentos_restantes: updateData.reprogramaciones_restantes !== undefined
        ? updateData.reprogramaciones_restantes
        : clase.reprogramaciones_restantes,
      nueva_fecha_hora: nuevaFecha.toISOString(),
      message: '¡Clase reprogramada exitosamente!'
    });

  } catch (error) {
    console.error('Error inesperado en /api/reprogramar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
