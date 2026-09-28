import React from "react";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import ClasesClientView, { PlanItem } from "@/components/clases/ClasesClientView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clases y Packs de Estudio de Francés | Le Français avec Florentin",
  description:
    "Explora los planes de estudio y clases particulares de francés 1 a 1 por Teams conmigo, profesor nativo certificado. Reserva tu sesión de diagnóstico gratuita de 30 minutos.",
  openGraph: {
    title: "Clases y Packs de Estudio de Francés | Le Français avec Florentin",
    description:
      "Aprende francés con inmersión real, flexibilidad horaria y método personalizado con profesor nativo. Consulta nuestros planes.",
    type: "website",
    locale: "es_ES"
  }
};

export default async function ClasesPage() {
  let planes: PlanItem[] = [];
  let whatsappNumber = "33685744973";

  try {
    const supabase = getSupabaseAdmin();

    const { data: planesData, error: planesError } = await supabase
      .from("planes_estudio")
      .select("id, nombre, descripcion, precio, total_clases, orden, recomendado, imagen_url, badge, duracion, caracteristicas, activo")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .order("precio", { ascending: true });

    if (!planesError && planesData && planesData.length > 0) {
      planes = planesData as PlanItem[];
    }

    const { data: configData } = await supabase
      .from("configuracion_sitio")
      .select("whatsapp_number")
      .eq("id", 1)
      .single();

    if (configData?.whatsapp_number) {
      whatsappNumber = configData.whatsapp_number;
    }
  } catch (e) {
    console.error("Error al obtener planes para /clases:", e);
  }

  return <ClasesClientView initialPlanes={planes} whatsappNumber={whatsappNumber} />;
}
