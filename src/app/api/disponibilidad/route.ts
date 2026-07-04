import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get('fecha');

  if (!fecha) {
    return NextResponse.json({ ocupadas: [] }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Intentar usar service_role_key para evadir RLS y ver clases de todos. 
  // Si no está, usar la anon_key (que fallará por RLS a menos que se ajuste, pero servirá para testing local)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  // La columna fecha_hora es un timestamp with time zone.
  // Buscamos las clases que ocurran en el día seleccionado.
  const startOfDay = new Date(`${fecha}T00:00:00Z`).toISOString();
  const endOfDay = new Date(`${fecha}T23:59:59Z`).toISOString();

  const { data, error } = await supabaseAdmin
    .from('clases')
    .select('fecha_hora')
    .eq('estado', 'programada')
    .gte('fecha_hora', startOfDay)
    .lte('fecha_hora', endOfDay);

  if (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json({ ocupadas: [] }, { status: 500 });
  }

  // Devolver los timestamps ISO completos para que el cliente haga la conversión local
  const ocupadas = data.map(c => c.fecha_hora);

  return NextResponse.json({ ocupadas });
}
