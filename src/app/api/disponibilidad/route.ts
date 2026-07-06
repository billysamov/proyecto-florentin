import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get('fecha');
  const mes = searchParams.get('mes'); // Formato esperado: YYYY-MM

  if (!fecha && !mes) {
    return NextResponse.json({ ocupadas: [] }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  let startRange = '';
  let endRange = '';

  if (fecha) {
    // Consulta por día específico
    startRange = new Date(`${fecha}T00:00:00Z`).toISOString();
    endRange = new Date(`${fecha}T23:59:59Z`).toISOString();
  } else if (mes) {
    // Consulta por mes completo (YYYY-MM)
    const [year, month] = mes.split('-').map(Number);
    // Primer día del mes
    startRange = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)).toISOString();
    // Último día del mes (usando el día 0 del mes siguiente)
    const ultimoDia = new Date(Date.UTC(year, month, 0, 23, 59, 59));
    endRange = ultimoDia.toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('clases')
    .select('fecha_hora')
    .eq('estado', 'programada')
    .gte('fecha_hora', startRange)
    .lte('fecha_hora', endRange);

  if (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json({ ocupadas: [] }, { status: 500 });
  }

  const ocupadas = data.map(c => c.fecha_hora);

  return NextResponse.json({ ocupadas });
}
