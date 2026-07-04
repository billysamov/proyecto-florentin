import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { nombre, email, planId } = await request.json();

    if (!nombre || !email || !planId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Crear el usuario en Supabase Auth usando privilegios de administrador
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: "AlumnoFlorentin2026*", // Contraseña temporal por defecto
      email_confirm: true,
      user_metadata: { nombre }
    });

    if (authError) {
      console.error("Error al crear usuario en Auth:", authError);
      return NextResponse.json({ error: `Error en Auth: ${authError.message}` }, { status: 500 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ error: "No se pudo recuperar el usuario creado" }, { status: 500 });
    }

    // 2. Obtener el plan de la base de datos para recuperar total_clases de forma dinámica
    const { data: planDb, error: planError } = await supabaseAdmin
      .from("planes_estudio")
      .select("total_clases")
      .eq("id", planId)
      .single();

    if (planError || !planDb) {
      console.error("Error al obtener plan de estudio:", planError);
      // Eliminar el usuario de auth si el plan no existe para no dejar huérfanos
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return NextResponse.json({ error: "El plan de estudios seleccionado no existe o no está activo." }, { status: 400 });
    }

    const clasesTotales = planDb.total_clases;

    // 3. Crear la inscripción en la base de datos
    const { error: inscripcionError } = await supabaseAdmin
      .from("inscripciones")
      .insert({
        usuario_id: user.id,
        plan_id: planId,
        estado_pago: "pagado",
        clases_restantes: clasesTotales
      });

    if (inscripcionError) {
      console.error("Error al crear inscripción:", inscripcionError);
      // Intenta eliminar el usuario de auth si la inscripción falla para no dejar huérfanos
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return NextResponse.json({ error: `Error en base de datos: ${inscripcionError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 200 });

  } catch (err: any) {
    console.error("Error interno:", err);
    return NextResponse.json({ error: `Error interno: ${err.message}` }, { status: 500 });
  }
}
