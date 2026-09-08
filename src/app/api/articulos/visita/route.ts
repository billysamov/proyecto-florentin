import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, slug } = body;

    if (!id && !slug) {
      return NextResponse.json({ error: "Falta id o slug" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Buscar el artículo actual
    let query = supabase.from("articulos").select("id, visitas");
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", slug);
    }

    const { data: articulo, error: fetchErr } = await query.single();

    if (fetchErr || !articulo) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    const nuevasVisitas = (articulo.visitas || 0) + 1;

    const { error: updateErr } = await supabase
      .from("articulos")
      .update({ visitas: nuevasVisitas })
      .eq("id", articulo.id);

    if (updateErr) {
      console.error("Error al actualizar visitas:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, visitas: nuevasVisitas });
  } catch (error: any) {
    console.error("Error en POST /api/articulos/visita:", error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}
