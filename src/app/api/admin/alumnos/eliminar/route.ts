import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // 1. Obtener la sesión y validar que el usuario sea administrador
    const authHeader = request.headers.get("Authorization");
    let userToken = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      userToken = authHeader.substring(7);
    } else {
      const cookieHeader = request.headers.get("cookie") || "";
      const tokenMatch = cookieHeader.match(/sb-[a-zA-Z0-9-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const parsed = JSON.parse(decodeURIComponent(tokenMatch[1]));
          userToken = parsed.access_token || "";
        } catch {}
      }
    }

    let user;
    if (userToken) {
      const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(userToken);
      user = authUser;
    } else {
      const { data: { user: sessionUser } } = await supabaseAdmin.auth.getUser();
      user = sessionUser;
    }

    if (!user) {
      return NextResponse.json({ error: "No autorizado. Inicie sesión nuevamente." }, { status: 401 });
    }

    // Verificar rol en la base de datos
    const { data: perfil, error: perfilErr } = await supabaseAdmin
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfilErr || !perfil || perfil.rol !== "admin") {
      return NextResponse.json({ error: "Acceso denegado. Se requieren permisos de administrador." }, { status: 403 });
    }

    // Parsear el body de la petición
    const { alumnoId, limpiarInactivos } = await request.json();

    // CASO 1: Limpieza automática de alumnos sin compras registrados hace más de 14 días
    if (limpiarInactivos) {
      const haceDosSemanas = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: alumnos, error: queryError } = await supabaseAdmin
        .from("usuarios")
        .select(`
          id,
          nombre,
          email,
          creado_en,
          inscripciones (
            id,
            estado_pago
          )
        `)
        .eq("rol", "alumno")
        .lt("creado_en", haceDosSemanas);

      if (queryError) {
        return NextResponse.json({ error: queryError.message }, { status: 500 });
      }

      if (!alumnos || alumnos.length === 0) {
        return NextResponse.json({ success: true, count: 0, message: "No se encontraron alumnos inactivos para eliminar." });
      }

      // Filtrar aquellos que no tienen compras pagadas
      const aEliminar = alumnos.filter(u => {
        const tieneCompras = u.inscripciones && u.inscripciones.some((ins: any) => ins.estado_pago === "pagado");
        return !tieneCompras;
      });

      let count = 0;
      for (const alumno of aEliminar) {
        // 1. Eliminar perfil en tabla pública (cascada borra inscripciones/clases huérfanas)
        const { error: delPerfilErr } = await supabaseAdmin
          .from("usuarios")
          .delete()
          .eq("id", alumno.id);

        if (!delPerfilErr) {
          // 2. Eliminar de Supabase Auth
          await supabaseAdmin.auth.admin.deleteUser(alumno.id);
          count++;
        }
      }

      return NextResponse.json({
        success: true,
        count,
        message: `Se eliminaron automáticamente ${count} estudiantes sin planes adquiridos después de 2 semanas de inactividad.`
      });
    }

    // CASO 2: Eliminación manual de un alumno específico
    if (alumnoId) {
      // Validar si el alumno tiene alguna inscripción pagada
      const { data: inscripciones, error: insError } = await supabaseAdmin
        .from("inscripciones")
        .select("id, estado_pago")
        .eq("usuario_id", alumnoId);

      if (insError) {
        return NextResponse.json({ error: "Error al validar compras del alumno: " + insError.message }, { status: 500 });
      }

      const tieneCompra = inscripciones && inscripciones.some(ins => ins.estado_pago === "pagado");
      if (tieneCompra) {
        return NextResponse.json({
          error: "No se puede eliminar a este estudiante porque tiene planes adquiridos en su cuenta."
        }, { status: 400 });
      }

      // Proceder con la eliminación (la base de datos eliminará registros relacionados por cascade delete)
      const { error: delPerfilErr } = await supabaseAdmin
        .from("usuarios")
        .delete()
        .eq("id", alumnoId);

      if (delPerfilErr) {
        return NextResponse.json({ error: "Error al borrar perfil de usuario: " + delPerfilErr.message }, { status: 500 });
      }

      // Eliminar de Supabase Auth
      const { error: authDelErr } = await supabaseAdmin.auth.admin.deleteUser(alumnoId);
      if (authDelErr) {
        // No es fatal, el perfil ya se eliminó
        console.warn("Advertencia: No se pudo eliminar de Auth:", authDelErr.message);
      }

      return NextResponse.json({ success: true, message: "Estudiante eliminado correctamente." });
    }

    return NextResponse.json({ error: "Faltan parámetros requeridos (alumnoId o limpiarInactivos)" }, { status: 400 });

  } catch (error: any) {
    console.error("Error en API de eliminación:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
