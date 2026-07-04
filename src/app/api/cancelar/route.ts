import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/cancelar
 * 
 * Endpoint seguro para cancelar una clase programada.
 * Valida en el servidor que la cancelación se realice con al menos 24 horas
 * de anticipación antes de eliminar la clase y devolver el saldo al alumno.
 * 
 * Body: { clase_id: string, usuario_id: string }
 * 
 * Respuestas:
 * - 200: Clase cancelada exitosamente y saldo devuelto
 * - 400: Datos inválidos o límite de tiempo violado (< 24 horas)
 * - 404: Clase no encontrada
 * - 500: Error interno
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clase_id, usuario_id } = body;

    // Validación de entrada
    if (!clase_id || !usuario_id) {
      return NextResponse.json(
        { error: 'Se requieren clase_id y usuario_id' },
        { status: 400 }
      );
    }

    // Crear cliente admin de Supabase para evitar RLS y realizar la transacción
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // ====== PASO 1: Obtener la clase y verificar pertenencia y estado ======
    const { data: clase, error: claseError } = await supabaseAdmin
      .from('clases')
      .select('*')
      .eq('id', clase_id)
      .eq('usuario_id', usuario_id)
      .single();

    if (claseError || !clase) {
      return NextResponse.json(
        { error: 'Clase no encontrada o no pertenece a este usuario' },
        { status: 404 }
      );
    }

    if (clase.estado !== 'programada') {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar clases con estado programada' },
        { status: 400 }
      );
    }

    // ====== PASO 2: Validar regla de las 24 horas ======
    const ahora = new Date();
    const fechaClase = new Date(clase.fecha_hora);
    
    // Diferencia en milisegundos
    const diferenciaMs = fechaClase.getTime() - ahora.getTime();
    const horasDiferencia = diferenciaMs / (1000 * 60 * 60);

    if (horasDiferencia < 24) {
      return NextResponse.json(
        { 
          error: 'No es posible cancelar la clase. Las cancelaciones deben realizarse con al menos 24 horas de anticipación.',
          horasRestantes: horasDiferencia 
        },
        { status: 400 }
      );
    }

    // ====== PASO 3: Obtener la inscripción para calcular el nuevo saldo ======
    const { data: inscripcion, error: insError } = await supabaseAdmin
      .from('inscripciones')
      .select('id, clases_restantes')
      .eq('usuario_id', usuario_id)
      .eq('estado_pago', 'pagado')
      .order('creado_en', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (insError || !inscripcion) {
      console.error('Error al buscar inscripción:', insError);
      return NextResponse.json(
        { error: 'No se pudo encontrar una inscripción de pago activa para devolver el saldo.' },
        { status: 400 }
      );
    }

    const nuevoSaldo = inscripcion.clases_restantes + 1;

    // ====== PASO 4: Incrementar el saldo del alumno primero ======
    const { error: updateError } = await supabaseAdmin
      .from('inscripciones')
      .update({ clases_restantes: nuevoSaldo })
      .eq('id', inscripcion.id);

    if (updateError) {
      console.error('Error al incrementar saldo de clases:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar el saldo de clases. Intente de nuevo.' },
        { status: 500 }
      );
    }

    // ====== PASO 5: Cancelar la clase lógicamente ======
    const { error: cancelError } = await supabaseAdmin
      .from('clases')
      .update({ estado: 'cancelada' })
      .eq('id', clase_id);

    if (cancelError) {
      console.error('Error al cancelar clase (iniciando rollback de saldo):', cancelError);
      
      // Rollback: Regresar el saldo al valor original
      const { error: rollbackError } = await supabaseAdmin
        .from('inscripciones')
        .update({ clases_restantes: inscripcion.clases_restantes })
        .eq('id', inscripcion.id);

      if (rollbackError) {
        console.error('CRÍTICO: Falló el rollback del saldo de clases:', rollbackError);
      }

      return NextResponse.json(
        { error: 'Error interno al procesar la cancelación. Su saldo no fue alterado.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clases_restantes: nuevoSaldo,
      message: 'Clase cancelada exitosamente. Tu saldo de clase ha sido devuelto.'
    });

  } catch (error) {
    console.error('Error inesperado en /api/cancelar:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
