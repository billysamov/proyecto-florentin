import React from "react";
import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";
import BlogCatalogWrapper from "@/components/blog/BlogCatalogWrapper";
import { ArticuloItem } from "@/components/blog/BlogGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artículos y Guías para Aprender Francés | Le Français avec Florentin",
  description:
    "Descubre artículos exclusivos, técnicas de pronunciación nativa, gramática simplificada y consejos culturales para dominar el francés conmigo.",
  openGraph: {
    title: "Artículos y Guías para Aprender Francés | Le Français avec Florentin",
    description:
      "Aprende francés con método, fonética práctica y cultura francesa. Artículos y recursos educativos conmigo.",
    type: "website",
    locale: "es_ES"
  }
};

// Artículos de respaldo si la base de datos aún no ha sido migrada o está vacía (con 3 capas de idioma)
const fallbackArticulos: ArticuloItem[] = [
  {
    id: 10,
    slug: "el-frances-vivo-la-lengua-que-los-manuales-no-te-ensenan",
    titulo: "El francés vivo: la lengua que los manuales no te enseñan",
    extracto:
      "Has aprendido francés con libros, apruebas tus ejercicios… ¿y sin embargo, cuando un francés te habla, no reconoces casi nada? Descubre las claves del francés real y cotidiano.",
    titulo_fr: "Le français vivant : la langue que les manuels ne vous apprennent pas",
    extracto_fr:
      "Vous avez appris le français avec des livres... et pourtant quand un Français vous parle, vous hésitez ? Découvrez les clés du vrai français parlé au quotidien.",
    titulo_en: "Living French: The Language Textbooks Don't Teach You",
    extracto_en:
      "Learned French with books but struggle to understand native speakers? Discover the real spoken French heard on the streets, at work and among friends.",
    imagen_portada:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    categoria: "Consejos",
    palabras_clave: "frances real, frances vivo, hablar frances",
    tiempo_lectura: 6,
    idioma: "es",
    autor: "Florentin",
    visitas: 61,
    creado_en: "2026-09-08T15:24:11.491Z"
  },
  {
    id: 1,
    slug: "como-pronunciar-la-r-francesa-guia-definitiva",
    titulo: "Cómo pronunciar la \"R\" francesa sin morir en el intento",
    extracto:
      "Descubre el método anatómico y los 3 ejercicios prácticos que uso con mis alumnos para dominar la R gutural francesa desde la primera semana.",
    titulo_fr: "Comment prononcer le \"R\" français sans effort",
    extracto_fr:
      "Découvrez la méthode anatomique et les 3 exercices pratiques que j'utilise avec mes élèves pour maîtriser le R français dès la première semaine.",
    titulo_en: "How to Pronounce the French \"R\" Without the Struggle",
    extracto_en:
      "Discover the anatomical technique and 3 practical exercises I use with my students to master the French guttural R from week one.",
    imagen_portada:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    categoria: "Pronunciación",
    palabras_clave: "pronunciacion francesa, r francesa, hablar frances",
    tiempo_lectura: 4,
    idioma: "es",
    autor: "Florentin",
    visitas: 142,
    creado_en: "2026-09-05T23:43:27.359Z"
  },
  {
    id: 2,
    slug: "diferencia-entre-c-est-y-il-est",
    titulo: "C'est vs Il est: Deja de confundirlos para siempre",
    extracto:
      "Una de las dudas más frecuentes de los estudiantes de francés explicada con una fórmula sencilla y ejemplos claros de la vida cotidiana en Francia.",
    titulo_fr: "C'est vs Il est : La règle d'or pour ne plus hésiter",
    extracto_fr:
      "L'une des erreurs les plus fréquentes des apprenants enfin expliquée avec une formule claire et des exemples concrets du quotidien.",
    titulo_en: "C'est vs Il est: The Golden Rule to Stop Confusing Them",
    extracto_en:
      "One of the most common pitfalls for French learners explained with a simple formula and real-life everyday examples.",
    imagen_portada:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    categoria: "Gramática",
    palabras_clave: "gramatica, c est vs il est, errores comunes",
    tiempo_lectura: 5,
    idioma: "es",
    autor: "Florentin",
    visitas: 98,
    creado_en: "2026-09-05T23:43:27.359Z"
  },
  {
    id: 3,
    slug: "vocabulario-esencial-restaurante-paris",
    titulo: "Cómo pedir en un restaurante en Francia como un auténtico local",
    extracto:
      "Las frases indispensables, las normas de cortesía que los franceses aprecian y los errores más comunes al pedir la cuenta.",
    titulo_fr: "Comment commander au restaurant en France comme un vrai local",
    extracto_fr:
      "Les phrases indispensables, les codes de politesse français et les astuces pour profiter pleinement des cafés et bistrots.",
    titulo_en: "How to Order at a Restaurant in France Like a True Local",
    extracto_en:
      "Essential phrases, cultural etiquette that French people appreciate, and tips on water, tipping, and paying the bill.",
    imagen_portada:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    categoria: "Cultura & Viajes",
    palabras_clave: "frances para viajar, restaurantes, cultura francesa",
    tiempo_lectura: 3,
    idioma: "es",
    autor: "Florentin",
    visitas: 210,
    creado_en: "2026-09-05T23:43:27.359Z"
  }
];

export default async function ArticulosPage() {
  let articulos: ArticuloItem[] = [];

  try {
    const supabase = getSupabaseAdmin();
    const now = new Date();

    // Consultamos los artículos publicados en Supabase (incluyendo fecha_publicacion para respetar el cronograma)
    const { data, error } = await supabase
      .from("articulos")
      .select("id, slug, titulo, extracto, titulo_fr, extracto_fr, contenido_fr, titulo_en, extracto_en, contenido_en, imagen_portada, categoria, palabras_clave, tiempo_lectura, idioma, autor, visitas, creado_en, fecha_publicacion")
      .eq("publicado", true)
      .order("creado_en", { ascending: false });

    if (!error && data && data.length > 0) {
      // Filtrar estrictamente: solo los que ya alcanzaron su fecha programada o no tienen fecha futura
      const visibles = data.filter((art: any) => {
        if (art.fecha_publicacion && new Date(art.fecha_publicacion) > now) {
          return false;
        }
        return true;
      });

      articulos = visibles.length > 0 ? visibles : fallbackArticulos;
    } else {
      if (error) {
        console.error("Error al cargar artículos desde Supabase:", error);
      }
      articulos = fallbackArticulos;
    }
  } catch (err) {
    console.error("Error inesperado al cargar artículos:", err);
    articulos = fallbackArticulos;
  }

  return <BlogCatalogWrapper articulos={articulos} />;
}
