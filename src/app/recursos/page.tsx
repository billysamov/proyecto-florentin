import React from "react";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import RecursosClientView from "@/components/recursos/RecursosClientView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recursos y Materiales de Francés | Le Français avec Florentin",
  description:
    "Descarga guías gratuitas en PDF, ejercicios de pronunciación y materiales exclusivos para acelerar tu aprendizaje del francés conmigo.",
  openGraph: {
    title: "Recursos y Materiales de Francés | Le Français avec Florentin",
    description:
      "Descarga guías gratuitas en PDF, ejercicios de pronunciación y materiales didácticos conmigo.",
    type: "website",
    locale: "es_ES"
  }
};

export default async function RecursosPage() {
  let whatsappNumber = "33685744973";

  try {
    const supabase = getSupabaseAdmin();
    const { data: configData } = await supabase
      .from("configuracion_sitio")
      .select("whatsapp_number")
      .eq("id", 1)
      .single();

    if (configData?.whatsapp_number) {
      whatsappNumber = configData.whatsapp_number;
    }
  } catch (e) {
    console.error("Error al obtener config para /recursos:", e);
  }

  return <RecursosClientView whatsappNumber={whatsappNumber} />;
}
