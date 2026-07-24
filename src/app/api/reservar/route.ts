import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/reservar
 * 
 * Endpoint atómico para crear reservas de clases.
 * Garantiza que no existan colisiones de horario validando
 * en el servidor antes de insertar.
 * 
 * Body: { usuario_id: string, fecha_hora: string (ISO), divisa?: string }
 * 
 * Respuestas:
 * - 201: Reserva creada exitosamente
 * - 400: Datos inválidos
 * - 409: Horario ya ocupado (colisión)
 * - 403: Sin clases disponibles en el plan
 * - 500: Error interno
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario_id, fecha_hora } = body;

    // Validación de entrada
    if (!usuario_id || !fecha_hora) {
      return NextResponse.json(
        { error: 'Se requieren usuario_id y fecha_hora' },
        { status: 400 }
      );
    }

    // Validar formato de fecha
    const fechaReserva = new Date(fecha_hora);
    if (isNaN(fechaReserva.getTime())) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido' },
        { status: 400 }
      );
    }

    // No permitir reservas en el pasado
    if (fechaReserva < new Date()) {
      return NextResponse.json(
        { error: 'No puedes reservar una clase en el pasado' },
        { status: 400 }
      );
    }

    // Crear cliente con service_role para evadir RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // ====== PASO 1: Verificar que el alumno tiene clases disponibles ======
    const { data: inscripcion, error: insError } = await supabaseAdmin
      .from('inscripciones')
      .select('id, clases_restantes')
      .eq('usuario_id', usuario_id)
      .eq('estado_pago', 'pagado')
      .order('creado_en', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (insError) {
      console.error('Error verificando inscripción:', insError);
      return NextResponse.json(
        { error: 'Error al verificar tu plan de estudios' },
        { status: 500 }
      );
    }

    if (!inscripcion || inscripcion.clases_restantes <= 0) {
      return NextResponse.json(
        { error: 'No tienes clases restantes en tu plan. Adquiere un nuevo plan para agendar.' },
        { status: 403 }
      );
    }

    // ====== PASO 2: Verificación ATÓMICA de colisión de horario ======
    // Buscamos si ya existe una clase programada en la misma hora (±30 min)
    const fechaInicio = new Date(fechaReserva.getTime() - 30 * 60 * 1000); // -30 min
    const fechaFin = new Date(fechaReserva.getTime() + 30 * 60 * 1000);    // +30 min

    const { data: clasesExistentes, error: checkError } = await supabaseAdmin
      .from('clases')
      .select('id, fecha_hora')
      .eq('estado', 'programada')
      .gte('fecha_hora', fechaInicio.toISOString())
      .lte('fecha_hora', fechaFin.toISOString());

    if (checkError) {
      console.error('Error verificando disponibilidad:', checkError);
      return NextResponse.json(
        { error: 'Error al verificar disponibilidad del horario' },
        { status: 500 }
      );
    }

    if (clasesExistentes && clasesExistentes.length > 0) {
      return NextResponse.json(
        { error: 'Este horario ya fue reservado por otro alumno. Por favor selecciona otra hora.' },
        { status: 409 }
      );
    }

    // ====== PASO 3: Obtener el link de Meet del profesor ======
    let enlaceMeet = '';

    const { data: configData } = await supabaseAdmin
      .from('configuracion_sitio')
      .select('*')
      .eq('id', 1)
      .single();

    if (configData) {
      // Usar el enlace configurado por el profesor, o generar uno único
      enlaceMeet = configData.enlace_meet_default || '';
    }

    // Si no hay enlace configurado, marcar como pendiente para que el profesor lo asigne
    if (!enlaceMeet) {
      enlaceMeet = 'pendiente';
    }

    // ====== PASO 4: Crear la clase (INSERTAR) ======
    const { data: claseCreada, error: insertError } = await supabaseAdmin
      .from('clases')
      .insert({
        usuario_id: usuario_id,
        fecha_hora: fechaReserva.toISOString(),
        estado: 'programada',
        enlace_meet: enlaceMeet
      })
      .select('id, fecha_hora, enlace_meet')
      .single();

    if (insertError) {
      // Verificar si fue una violación de unicidad (otro alumno reservó mientras procesábamos)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Este horario acaba de ser reservado. Por favor selecciona otra hora.' },
          { status: 409 }
        );
      }
      console.error('Error al crear la clase:', insertError);
      return NextResponse.json(
        { error: 'Error al crear la reserva: ' + insertError.message },
        { status: 500 }
      );
    }

    // ====== PASO 5: Descontar clase de la inscripción de forma ATÓMICA ======
    // .gt('clases_restantes', 0) garantiza que solo se actualiza si aún hay saldo.
    // Si otra petición concurrente consumió el último saldo, esta consulta afectará 0 filas.
    const { data: inscripcionActualizada, error: updateError } = await supabaseAdmin
      .from('inscripciones')
      .update({ clases_restantes: Math.max(0, inscripcion.clases_restantes - 1) })
      .eq('id', inscripcion.id)
      .gt('clases_restantes', 0)
      .select('id, clases_restantes');

    if (updateError || !inscripcionActualizada || inscripcionActualizada.length === 0) {
      console.error('Conflicto de concurrencia al descontar clase (iniciando rollback):', updateError);
      
      // Rollback: Borrar la clase recién creada para mantener la consistencia
      const { error: rollbackError } = await supabaseAdmin
        .from('clases')
        .delete()
        .eq('id', claseCreada.id);

      if (rollbackError) {
        console.error('CRÍTICO: Falló el rollback al eliminar clase huérfana:', rollbackError);
      }

      return NextResponse.json(
        { error: 'No tienes clases restantes en tu plan. Adquiere un nuevo plan para agendar.' },
        { status: 403 }
      );
    }

    const saldoFinal = inscripcionActualizada[0].clases_restantes;

    // ====== ÉXITO ======
    return NextResponse.json({
      success: true,
      clase: {
        id: claseCreada.id,
        fecha_hora: claseCreada.fecha_hora,
        enlace_meet: claseCreada.enlace_meet
      },
      clases_restantes: saldoFinal,
      message: '¡Clase reservada exitosamente!'
    }, { status: 201 });

  } catch (error) {
    console.error('Error inesperado en /api/reservar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
