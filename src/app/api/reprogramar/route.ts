import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { clase_id, usuario_id, nueva_fecha_hora } = body;

    // Validación de entrada
    if (!clase_id || !usuario_id || !nueva_fecha_hora) {
      return NextResponse.json(
        { error: 'Se requieren clase_id, usuario_id y nueva_fecha_hora' },
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

    // Crear cliente admin para evadir RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // ====== PASO 1: Obtener la clase y validar estado e intentos ======
    const { data: clase, error: claseError } = await supabaseAdmin
      .from('clases')
      .select('*')
      .eq('id', clase_id)
      .eq('usuario_id', usuario_id)
      .single();

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

    // Validar regla de las 24 horas sobre el horario ACTUAL de la clase
    const ahora = new Date();
    const fechaActualClase = new Date(clase.fecha_hora);
    const diffHorasActual = (fechaActualClase.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diffHorasActual < 24) {
      return NextResponse.json(
        { error: 'No puedes reprogramar la clase con menos de 24 horas de anticipación. Por favor contacta al administrador.' },
        { status: 400 }
      );
    }

    // Validar intentos restantes. 
    // Si la columna no existe aún (hasta que el usuario corra el SQL), asumimos que tiene intentos
    const intentosRestantes = clase.reprogramaciones_restantes !== undefined ? clase.reprogramaciones_restantes : 2;
    if (intentosRestantes <= 0) {
      return NextResponse.json(
        { error: 'Has agotado el límite de reprogramaciones para esta clase. Por favor contacta al administrador por WhatsApp para resolverlo.' },
        { status: 400 }
      );
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
    const nuevosIntentos = Math.max(0, intentosRestantes - 1);
    
    // Armamos los datos a actualizar de forma dinámica para ser tolerantes a si la columna SQL aún no ha sido agregada
    const updateData: any = {
      fecha_hora: nuevaFecha.toISOString()
    };
    
    // Solo si el campo reprogramaciones_restantes existe en el objeto devuelto por la BD
    if (clase.reprogramaciones_restantes !== undefined) {
      updateData.reprogramaciones_restantes = nuevosIntentos;
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

    return NextResponse.json({
      success: true,
      intentos_restantes: nuevosIntentos,
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
