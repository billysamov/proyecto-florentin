import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Datos por defecto enriquecidos
const defaultGuias = [
  {
    id: 1,
    tagline: "A2–B1 · SUENA NATURAL",
    titulo: "50 Expresiones Francesas Esenciales",
    subtitulo_italica: "Deja de hablar como un manual: habla como se habla en París.",
    bullets: [
      "Las 50 expresiones que oirás cien veces al día en Francia",
      "Cada una con pronunciación, ejemplo real y cuándo usarla",
      "Evita los errores que delatan a un extranjero"
    ],
    paginas: 14,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Quiero sonar natural →",
    badge: "☆ El favorito",
    portada_texto_principal: "50 Expresiones",
    portada_subtexto_dorado: "Las más usadas en Francia",
    portada_detalle_inferior: "Expresión + pronunciación + contexto",
    url_preview: "/preview-50-expresiones.pdf",
    url_archivo: "privado/guia-50-expresiones.pdf",
    activo: true
  },
  {
    id: 2,
    tagline: "A1–B2 · PRONUNCIACIÓN PERFECTA",
    titulo: "La Llave Maestra de la Fonética Francesa",
    subtitulo_italica: "Aprende la colocación anatómica exacta de la 'R' y las vocales nasales.",
    bullets: [
      "Diagramas visuales de garganta y labios para no forzar la voz",
      "Reglas de oro para saber cuándo se pronuncia y cuándo se calla una letra",
      "Lista de las 30 palabras trampa donde casi todos fallan"
    ],
    paginas: 18,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Mejorar mi pronunciación →",
    badge: "🎧 Imprescindible",
    portada_texto_principal: "Fonética Francesa",
    portada_subtexto_dorado: "El secreto de la 'R' y vocales nasales",
    portada_detalle_inferior: "Guía anatómica paso a paso",
    url_preview: "/preview-fonetica.pdf",
    url_archivo: "privado/guia-fonetica.pdf",
    activo: true
  },
  {
    id: 3,
    tagline: "A2–B2 · CONJUGACIÓN SIN MIEDO",
    titulo: "Passé Composé vs Imparfait: Sin Dudas",
    subtitulo_italica: "Mi método visual para elegir siempre el tiempo correcto en 2 segundos.",
    bullets: [
      "La técnica de la 'Línea de Tiempo Cinematográfica' que elimina la confusión",
      "Lista de verbos clave con Être y Avoir explicados con lógica",
      "25 frases de entrenamiento rápido con soluciones inmediatas"
    ],
    paginas: 16,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Dominar los pasados →",
    badge: "⚡ Clave Gramatical",
    portada_texto_principal: "Los Pasados en Francés",
    portada_subtexto_dorado: "Passé Composé vs Imparfait",
    portada_detalle_inferior: "Método visual de 2 segundos",
    url_preview: "/preview-pasados.pdf",
    url_archivo: "privado/guia-pasados.pdf",
    activo: true
  }
];

const defaultCuadernos = [
  {
    id: 101,
    nivel_codigo: "A1",
    nivel_nombre: "Nivel A1 · Principiante (Débutant)",
    titulo: "Cuaderno Integral de Francés A1: De Cero a tus Primeras Conversaciones",
    subtitulo: "Diseñado para hispanohablantes: 140 ejercicios progresivos, explicaciones directas sin jerga y soluciones comentadas paso a paso para construir bases sólidas desde el primer día.",
    paginas: 85,
    total_ejercicios: 140,
    precio_eur: 24.90,
    precio_usd: 27.90,
    badge: "⭐ Paso a Paso",
    color_acento: "#0055a5",
    beneficios: [
      {
        titulo: "140 Ejercicios con Solucionario Explicado",
        desc: "No solo sabrás si tu respuesta es correcta, sino el porqué cultural y gramatical de cada frase."
      },
      {
        titulo: "Fonética y Sonidos Trampa desde la Base",
        desc: "Explicaciones anatómicas de boca y garganta adaptadas a hispanohablantes para no arrastrar malos hábitos."
      },
      {
        titulo: "Situaciones Reales de la Vida Cotidiana",
        desc: "Diálogos auténticos en panaderías, cafés, trenes, hoteles y cómo presentarte con soltura."
      },
      {
        titulo: "Doble Formato: iPad/Tablet e Imprimible",
        desc: "Puedes rellenarlo directamente en apps como GoodNotes o imprimirlo en formato A4."
      }
    ],
    temario: [
      "Módulo 1: Los sonidos franceses y las letras mudas que no debes pronunciar",
      "Módulo 2: Presentarse, profesiones, nacionalidades y romper el hielo",
      "Módulo 3: La vida cotidiana, números, horas y hacer preguntas sin miedo",
      "Módulo 4: Pedir en un restaurante, comprar y desenvolverse en la ciudad",
      "Módulo 5: Verbos del primer grupo (-er) y los irregulares clave (être, avoir, aller, faire)",
      "Módulo 6: Solucionario completo con mis comentarios pedagógicos"
    ],
    url_preview: "/preview-cuaderno-a1.pdf",
    url_archivo: "privado/cuaderno-a1-completo.pdf",
    activo: true
  },
  {
    id: 102,
    nivel_codigo: "A2",
    nivel_nombre: "Nivel A2 · Elemental (Élémentaire)",
    titulo: "Cuaderno Integral de Francés A2: Consolidación y Fluidez Narrativa",
    subtitulo: "El cuaderno de mayor demanda. Desbloquea la capacidad de narrar anécdotas en pasado, expresar proyectos en futuro y dejar de responder con frases cortas de una sola palabra.",
    paginas: 95,
    total_ejercicios: 165,
    precio_eur: 24.90,
    precio_usd: 27.90,
    badge: "🔥 El Más Vendido",
    color_acento: "#b45309",
    beneficios: [
      {
        titulo: "165 Ejercicios Intensivos de Tiempos Pasados",
        desc: "Entrenamiento exhaustivo de Passé Composé vs Imparfait con la lógica nativa."
      },
      {
        titulo: "Conectores del Francés Real de Francia",
        desc: "Aprende a usar 'en fait', 'du coup', 'alors' y 'pourtant' para sonar fluido y natural."
      },
      {
        titulo: "Trampas Comunes de Traducción Literal",
        desc: "Las 50 construcciones donde el español induce a cometer errores graves en francés."
      },
      {
        titulo: "Autonomía para Viajes y Convivencia",
        desc: "Expresar sentimientos, describir recuerdos, resolver incidencias y hacer reservas."
      }
    ],
    temario: [
      "Módulo 1: La narración en pasado: cuándo usar Passé Composé vs Imparfait",
      "Módulo 2: Pronombres de objeto directo e indirecto (COD / COI) sin dolores de cabeza",
      "Módulo 3: El futuro simple y el futuro próximo: planes, deseos e hipótesis",
      "Módulo 4: Dar consejos, expresar órdenes educadas y el imperativo",
      "Módulo 5: Comparaciones, superlativos y matices de opinión",
      "Módulo 6: Solucionario exhaustivo con advertencia de 'falsos amigos'"
    ],
    url_preview: "/preview-cuaderno-a2.pdf",
    url_archivo: "privado/cuaderno-a2-completo.pdf",
    activo: true
  },
  {
    id: 103,
    nivel_codigo: "B1",
    nivel_nombre: "Nivel B1 · Intermedio (Intermédiaire)",
    titulo: "Cuaderno Integral de Francés B1: Autonomía y Argumentación",
    subtitulo: "Para quienes quieren desenvolverse en el ámbito profesional, debatir con soltura o preparar el examen oficial DELF B1 con métodos probados y ejercicios de nivel real.",
    paginas: 105,
    total_ejercicios: 185,
    precio_eur: 29.90,
    precio_usd: 33.50,
    badge: "✨ Nivel Intermedio",
    color_acento: "#047857",
    beneficios: [
      {
        titulo: "185 Actividades de Argumentación y Debate",
        desc: "Estructuras para opinar, matizar desacuerdos y formular propuestas formales."
      },
      {
        titulo: "El Subjuntivo Explicado con Lógica",
        desc: "Sin tablas interminables: las 4 situaciones donde los franceses realmente lo usan."
      },
      {
        titulo: "Vocabulario Laboral y Social Avanzado",
        desc: "Redacción de correos electrónicos profesionales, llamadas y entrevistas de trabajo."
      },
      {
        titulo: "Preparación Específica para DELF B1",
        desc: "Modelos de producción escrita y comprensión con pautas de corrección oficiales."
      }
    ],
    temario: [
      "Módulo 1: Expresar la causa, la consecuencia y la oposición de forma elegante",
      "Módulo 2: El Subjonctif Présent: disparadores obligatorios y cuándo evitarlo",
      "Módulo 3: El Conditionnel para la cortesía, hipótesis y situaciones imaginarias",
      "Módulo 4: Pronombres relativos compuestos (auquel, duquel, lequel)",
      "Módulo 5: Técnicas de redacción formal para el DELF B1",
      "Módulo 6: Solucionario razonado paso a paso con consejos de examen"
    ],
    url_preview: "/preview-cuaderno-b1.pdf",
    url_archivo: "privado/cuaderno-b1-completo.pdf",
    activo: true
  },
  {
    id: 104,
    nivel_codigo: "B2",
    nivel_nombre: "Nivel B2 · Avanzado (Avancé)",
    titulo: "Cuaderno Maestro de Francés B2: Fluidez Nativa y Precisión",
    subtitulo: "El libro de trabajo más exhaustivo de la academia (110 páginas). Diseñado para dominar matices culturales, giros idiomáticos, estilo refinado y superar con éxito el DELF B2.",
    paginas: 110,
    total_ejercicios: 200,
    precio_eur: 29.90,
    precio_usd: 33.50,
    badge: "🎓 Preparación DELF B2",
    color_acento: "#6d28d9",
    beneficios: [
      {
        titulo: "200 Ejercicios de Alto Nivel y Matices",
        desc: "Diferenciación sutil de sinónimos, registros de habla (familiar, corriente y formal)."
      },
      {
        titulo: "Dominio Total de Tiempos Compuestos",
        desc: "Plus-que-parfait, Subjonctif Passé y concordancias complejas del participio."
      },
      {
        titulo: "El Francés de los Medios y la Prensa",
        desc: "Artículos de opinión, síntesis de textos y argumentación oral estructurada."
      },
      {
        titulo: "Simulacros con Criterios de Calificación",
        desc: "Estrategias concretas para maximizar puntos en la prueba de producción escrita."
      }
    ],
    temario: [
      "Módulo 1: Matices de la lengua culta y el lenguaje periodístico francés",
      "Módulo 2: Concordancias complejas y excepciones que debes conocer",
      "Módulo 3: Estructuración de un ensayo argumentativo según la norma francesa",
      "Módulo 4: Ironía, giros coloquiales y expresiones idiomáticas modernas",
      "Módulo 5: Batería intensiva de ejercicios de transformación sintáctica",
      "Módulo 6: Solucionario maestro con comentarios lingüísticos avanzados"
    ],
    url_preview: "/preview-cuaderno-b2.pdf",
    url_archivo: "privado/cuaderno-b2-completo.pdf",
    activo: true
  }
];

// Memoria caché en servidor para persistencia inmediata
let memoryTienda = {
  guias: defaultGuias,
  cuadernos: defaultCuadernos
};

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: config } = await supabaseAdmin
      .from("configuracion_sitio")
      .select("datos_tienda_pedagogica")
      .eq("id", 1)
      .maybeSingle();

    if (config?.datos_tienda_pedagogica) {
      memoryTienda = config.datos_tienda_pedagogica;
    }

    return NextResponse.json(memoryTienda, { status: 200 });
  } catch (err) {
    return NextResponse.json(memoryTienda, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guias, cuadernos } = body;

    if (guias) memoryTienda.guias = guias;
    if (cuadernos) memoryTienda.cuadernos = cuadernos;

    // Intentar persistir en Supabase si la columna existe
    try {
      const supabaseAdmin = getSupabaseAdmin();
      await supabaseAdmin
        .from("configuracion_sitio")
        .update({ datos_tienda_pedagogica: memoryTienda })
        .eq("id", 1);
    } catch (dbErr) {
      // Continuar con memoria
    }

    return NextResponse.json({ ok: true, tienda: memoryTienda }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
