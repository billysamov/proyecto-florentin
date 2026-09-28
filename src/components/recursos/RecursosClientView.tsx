"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Headphones, CheckCircle, ArrowRight, Sparkles, FileText, Lock,
  ShoppingCart, Eye, ShieldCheck, Download, Star, CheckCircle2, Layers, X,
  ChevronLeft, ChevronRight, MessageCircle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Language, translations } from "@/lib/translations";

export interface GuiaIdiomaItem {
  id: number;
  tagline: string;
  titulo: string;
  subtitulo_italica: string;
  bullets: string[];
  paginas: number;
  precio_eur: number;
  precio_usd: number;
  texto_boton: string;
  badge: string;
  portada_texto_principal: string;
  portada_subtexto_dorado: string;
  portada_detalle_inferior: string;
  url_preview: string;
}

export interface CuadernoNivelItem {
  id: number;
  nivel_codigo: "A1" | "A2" | "B1" | "B2";
  nivel_nombre: string;
  titulo: string;
  subtitulo: string;
  paginas: number;
  total_ejercicios: number;
  precio_eur: number;
  precio_usd: number;
  badge: string;
  color_acento: string;
  beneficios: { titulo: string; desc: string }[];
  temario: string[];
  url_preview: string;
}

const guiasData: GuiaIdiomaItem[] = [
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
    url_preview: "/preview-50-expresiones.pdf"
  },
  {
    id: 2,
    tagline: "A1–B2 · PRONUNCIACIÓN PERFECTA",
    titulo: "La Llave Maestra de la Fonética Francesa",
    subtitulo_italica: "Aprende la colocación anatómica exacta de la 'R' y las vocales nasales.",
    bullets: [
      "Diagramas visuales de garganta y labios para no forzar nunca la voz",
      "Reglas infalibles para saber cuándo se pronuncia y cuándo se calla una consonante",
      "Las 30 palabras trampa donde casi todos los hispanohablantes se delatan"
    ],
    paginas: 18,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Mejorar mi pronunciación →",
    badge: "🎧 Imprescindible",
    portada_texto_principal: "Fonética Francesa",
    portada_subtexto_dorado: "El secreto de la 'R' y vocales nasales",
    portada_detalle_inferior: "Guía anatómica paso a paso",
    url_preview: "/preview-fonetica.pdf"
  },
  {
    id: 3,
    tagline: "A2–B2 · CONJUGACIÓN SIN MIEDO",
    titulo: "Passé Composé vs Imparfait: Sin Dudas",
    subtitulo_italica: "Mi método visual para elegir siempre el tiempo correcto en 2 segundos.",
    bullets: [
      "La técnica de la 'Línea de Tiempo Cinematográfica' que elimina la confusión",
      "Lista de verbos clave con Être y Avoir explicados con lógica sin excepciones absurdas",
      "25 ejercicios rápidos de entrenamiento mental con respuestas comentadas"
    ],
    paginas: 16,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Dominar los pasados →",
    badge: "⚡ Clave Gramatical",
    portada_texto_principal: "Los Pasados en Francés",
    portada_subtexto_dorado: "Passé Composé vs Imparfait",
    portada_detalle_inferior: "Método visual de 2 segundos",
    url_preview: "/preview-pasados.pdf"
  }
];

const cuadernosData: CuadernoNivelItem[] = [
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
    url_preview: "/preview-cuaderno-a1.pdf"
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
    url_preview: "/preview-cuaderno-a2.pdf"
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
    url_preview: "/preview-cuaderno-b1.pdf"
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
    url_preview: "/preview-cuaderno-b2.pdf"
  }
];

interface RecursosClientViewProps {
  whatsappNumber?: string;
}

export default function RecursosClientView({
  whatsappNumber = "33685744973"
}: RecursosClientViewProps) {
  const [lang, setLang] = useState<Language>("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [activeTab, setActiveTab] = useState<"guias" | "cuadernos" | "gratuitos">("guias");
  const [guias, setGuias] = useState<GuiaIdiomaItem[]>(guiasData);
  const [cuadernos, setCuadernos] = useState<CuadernoNivelItem[]>(cuadernosData);
  const [indiceGuia, setIndiceGuia] = useState(0);
  const [nivelCuadernoActivo, setNivelCuadernoActivo] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  
  // Modales
  const [modalPreview, setModalPreview] = useState<{ titulo: string; tipo: string; paginas: number } | null>(null);
  const [modalCheckout, setModalCheckout] = useState<{ titulo: string; precio: number; divisa: string; tipo: string } | null>(null);
  const [emailCheckout, setEmailCheckout] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Cargar recursos sincronizados desde backend / admin
  const cargarTienda = async () => {
    try {
      const res = await fetch("/api/tienda");
      if (res.ok) {
        const data = await res.json();
        if (data.guias && Array.isArray(data.guias)) {
          const activas = data.guias.filter((g: any) => g.activo !== false);
          if (activas.length > 0) setGuias(activas);
        }
        if (data.cuadernos && Array.isArray(data.cuadernos)) {
          const activos = data.cuadernos.filter((c: any) => c.activo !== false);
          if (activos.length > 0) setCuadernos(activos);
        }
        return;
      }
    } catch (e) {
      // Fallback
    }

    if (typeof window !== "undefined") {
      const localGuias = localStorage.getItem("florentin_tienda_guias");
      const localCuadernos = localStorage.getItem("florentin_tienda_cuadernos");
      if (localGuias) {
        const p = JSON.parse(localGuias).filter((g: any) => g.activo !== false);
        if (p.length > 0) setGuias(p);
      }
      if (localCuadernos) {
        const c = JSON.parse(localCuadernos).filter((c: any) => c.activo !== false);
        if (c.length > 0) setCuadernos(c);
      }
    }
  };

  useEffect(() => {
    cargarTienda();
    const handleActualizacion = () => cargarTienda();
    window.addEventListener("tienda_actualizada", handleActualizacion);

    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang && (savedLang === "es" || savedLang === "fr" || savedLang === "en")) {
        setLang(savedLang);
      }
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa && (savedDivisa === "eur" || savedDivisa === "usd")) {
        setDivisa(savedDivisa);
      }
    }

    const handleLangEvent = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "fr" || e.detail === "en")) {
        setLang(e.detail);
      }
    };
    const handleDivisaEvent = (e: any) => {
      if (e.detail && (e.detail === "eur" || e.detail === "usd")) {
        setDivisa(e.detail);
      }
    };

    window.addEventListener("florentin_lang_changed", handleLangEvent);
    window.addEventListener("florentin_divisa_changed", handleDivisaEvent);

    return () => {
      window.removeEventListener("tienda_actualizada", handleActualizacion);
      window.removeEventListener("florentin_lang_changed", handleLangEvent);
      window.removeEventListener("florentin_divisa_changed", handleDivisaEvent);
    };
  }, []);

  const changeDivisa = (newDivisa: "eur" | "usd") => {
    setDivisa(newDivisa);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_divisa", newDivisa);
      window.dispatchEvent(new CustomEvent("florentin_divisa_changed", { detail: newDivisa }));
    }
  };

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "") || "33685744973";

  // Guía actual del slider seguro
  const guiaActual = guias[indiceGuia] || guias[0];

  const anteriorGuia = () => {
    setIndiceGuia((prev) => (prev === 0 ? guias.length - 1 : prev - 1));
  };

  const siguienteGuia = () => {
    setIndiceGuia((prev) => (prev >= guias.length - 1 ? 0 : prev + 1));
  };

  // Cuaderno seleccionado seguro
  const cuadernoActual = cuadernos.find((c) => c.nivel_codigo === nivelCuadernoActivo) || cuadernos[0];

  // Simulación de Checkout Seguro Stripe
  const procesarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCheckout || !modalCheckout) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoTitulo: modalCheckout.titulo,
          precio: modalCheckout.precio,
          divisa: modalCheckout.divisa,
          email: emailCheckout,
          tipo: modalCheckout.tipo
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error al inicializar la pasarela de pago");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Error al procesar compra:", err);
      alert("Hubo un error de conexión con la pasarela.");
      setIsProcessing(false);
    }
  };

  // Recursos Gratuitos (Fichas descargables)
  const recursosGratuitos = [
    {
      titulo: "Guía de la 'R' Gutural Francesa",
      desc: "Técnica anatómica para colocar la lengua y garganta sin forzar la voz, con 3 audios prácticos.",
      badge: "Más Popular",
      icono: <Headphones className="text-[#0055a5]" size={22} />,
      link: "/articulos/como-pronunciar-la-r-francesa-guia-definitiva"
    },
    {
      titulo: "Los 50 Verbos Franceses Más Usados",
      desc: "Conjugaciones en contexto de los verbos indispensables y las trampas de pronunciación.",
      badge: "Gramática Práctica",
      icono: <FileText className="text-[#0055a5]" size={22} />,
      link: "/articulos/el-frances-vivo-la-lengua-que-los-manuales-no-te-ensenan"
    },
    {
      titulo: "C'est vs Il est : La Regla de Oro",
      desc: "La fórmula infalible para no dudar nunca más entre c'est y il est en tus conversaciones.",
      badge: "Esencial",
      icono: <BookOpen className="text-[#0055a5]" size={22} />,
      link: "/articulos/diferencia-entre-c-est-y-il-est"
    },
    {
      titulo: "Kit de Vocabulario para Viajar a Francia",
      desc: "Frases reales para restaurantes, transporte, emergencias y compras cotidianas.",
      badge: "Viajes y Vida",
      icono: <Sparkles className="text-[#0055a5]" size={22} />,
      link: "/articulos/vocabulario-esencial-restaurante-paris"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#0055a5] selection:text-white">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════
          CABECERA PRINCIPAL (IDÉNTICA A LA CAPTURA DEL USUARIO)
      ════════════════════════════════════════════════════════════ */}
      <section className="pt-32 sm:pt-40 pb-10 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c1b33] font-serif tracking-tight mb-4">
            Recursos pedagógicos
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
            Recursos descargables con métodos, pronunciación y ejercicios. Los compras hoy, los descargas hoy, los usas para siempre.
          </p>

          {/* Switcher EUR / USD (Como en la foto) */}
          <div className="inline-flex p-1 bg-white border border-slate-300/80 rounded-full shadow-xs mb-10">
            <button
              onClick={() => changeDivisa("eur")}
              className={`px-6 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                divisa === "eur"
                  ? "bg-[#1a56db] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#0c1b33]"
              }`}
            >
              EUR
            </button>
            <button
              onClick={() => changeDivisa("usd")}
              className={`px-6 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                divisa === "usd"
                  ? "bg-[#1a56db] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#0c1b33]"
              }`}
            >
              USD
            </button>
          </div>

          {/* Selector de Pestañas Principales */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl max-w-lg w-full shadow-inner border border-slate-300/60">
              <button
                onClick={() => setActiveTab("guias")}
                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "guias"
                    ? "bg-white text-[#0c1b33] shadow-md scale-[1.01]"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <BookOpen size={16} className={activeTab === "guias" ? "text-blue-600" : "text-slate-400"} />
                <span>Guías del Idioma</span>
              </button>

              <button
                onClick={() => setActiveTab("cuadernos")}
                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "cuadernos"
                    ? "bg-white text-[#0c1b33] shadow-md scale-[1.01]"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <Layers size={16} className={activeTab === "cuadernos" ? "text-amber-600" : "text-slate-400"} />
                <span>Cuadernos por Nivel</span>
                <span className="hidden sm:inline text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-extrabold">
                  70-100p
                </span>
              </button>

              <button
                onClick={() => setActiveTab("gratuitos")}
                className={`py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "gratuitos"
                    ? "bg-white text-[#0c1b33] shadow-md scale-[1.01]"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <Sparkles size={16} className={activeTab === "gratuitos" ? "text-emerald-500" : "text-slate-400"} />
                <span>Gratis</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECCIÓN 1: GUÍAS DEL IDIOMA (EL SLIDER EXACTO DE LA FOTO)
      ════════════════════════════════════════════════════════════ */}
      {activeTab === "guias" && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Contenedor del Carrusel con Botones Laterales */}
            <div className="relative flex items-center justify-center">
              {/* Botón Flecha Izquierda < */}
              <button
                onClick={anteriorGuia}
                aria-label="Guía anterior"
                className="hidden sm:flex absolute -left-5 md:-left-7 z-10 w-11 h-11 rounded-full bg-white border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              {/* TARJETA PRINCIPAL (CALCADA DE LA CAPTURA) */}
              <div className="w-full bg-white border-2 border-blue-200/90 rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-900/5 relative transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* COLUMNA IZQUIERDA: PORTADA / PRIMERA PÁGINA */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    {/* Badge superior tipo cápsula */}
                    <div className="self-start mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1a56db] text-white shadow-xs">
                        {guiaActual.badge}
                      </span>
                    </div>

                    {/* Portada Estilo Documento / Primera Página (Azul Marino Florentin) */}
                    <div className="w-full aspect-[4/3] sm:aspect-[4/3.2] bg-[#0c1b33] rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl border border-blue-900/50 relative overflow-hidden group">
                      {/* Efecto de brillo de hoja */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full pointer-events-none" />

                      <div className="text-center">
                        <span className="text-[10px] sm:text-xs font-extrabold tracking-[2px] text-slate-300 uppercase font-sans">
                          LE FRANÇAIS AVEC FLORENTIN
                        </span>
                      </div>

                      <div className="text-center my-auto py-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                          {guiaActual.portada_texto_principal}
                        </h3>
                        <p className="text-sm sm:text-base font-bold text-amber-300 mt-1">
                          {guiaActual.portada_subtexto_dorado}
                        </p>
                      </div>

                      <div className="text-center pt-2 border-t border-white/10">
                        <span className="text-[11px] text-slate-300 tracking-wide font-medium">
                          {guiaActual.portada_detalle_inferior}
                        </span>
                      </div>
                    </div>

                    {/* Botón de vista previa debajo de la portada */}
                    <button
                      onClick={() => setModalPreview({
                        titulo: guiaActual.titulo,
                        tipo: "Guía Práctica",
                        paginas: guiaActual.paginas
                      })}
                      className="mt-3 text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Hojear muestra de páginas</span>
                    </button>
                  </div>

                  {/* COLUMNA DERECHA: TEXTOS, BENEFICIOS Y COMPRA */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* Subtítulo Categoría / Nivel */}
                      <div className="text-xs sm:text-sm font-extrabold tracking-wider text-[#0055a5] uppercase mb-1">
                        {guiaActual.tagline}
                      </div>

                      {/* Título Principal */}
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b33] font-serif leading-tight mb-2">
                        {guiaActual.titulo}
                      </h2>

                      {/* Subtítulo en Cursiva */}
                      <p className="text-sm sm:text-base text-slate-600 italic mb-5 leading-relaxed font-serif">
                        {guiaActual.subtitulo_italica}
                      </p>

                      {/* Lista de 3 Bullets con Check Verde */}
                      <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-700">
                        {guiaActual.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle size={17} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Metadatos (PDF · 14 páginas) */}
                      <div className="text-xs font-semibold text-slate-500 mb-6">
                        PDF · {guiaActual.paginas} páginas
                      </div>
                    </div>

                    {/* Fila Inferior: Precio + Botón CTA */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-[#0c1b33]">
                            {divisa === "usd" ? `$${guiaActual.precio_usd}` : `${guiaActual.precio_eur} €`}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">pago único</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Descarga inmediata
                        </div>
                      </div>

                      <button
                        onClick={() => setModalCheckout({
                          titulo: guiaActual.titulo,
                          precio: divisa === "usd" ? guiaActual.precio_usd : guiaActual.precio_eur,
                          divisa: divisa.toUpperCase(),
                          tipo: "Guía del Idioma"
                        })}
                        className="px-6 sm:px-8 py-3.5 rounded-full bg-[#0055a5] hover:bg-[#003d7a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                      >
                        <span>{guiaActual.texto_boton}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Flecha Derecha > */}
              <button
                onClick={siguienteGuia}
                aria-label="Siguiente guía"
                className="hidden sm:flex absolute -right-5 md:-right-7 z-10 w-11 h-11 rounded-full bg-white border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Controles móviles de flechas y Dots de Paginación */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={anteriorGuia}
                className="sm:hidden p-2 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>

              {guias.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIndiceGuia(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    indiceGuia === idx ? "w-8 bg-[#0055a5]" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Ir a guía ${idx + 1}`}
                />
              ))}

              <button
                onClick={siguienteGuia}
                className="sm:hidden p-2 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* BARRA DE CONFIANZA INFERIOR (CALCADA DE LA CAPTURA) */}
            <div className="mt-10 text-center space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Lock size={15} className="text-slate-500" />
                  <span>Pago seguro con Stripe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={15} className="text-amber-500" />
                  <span>Acceso inmediato</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-blue-600" />
                  <span>Profesor nativo</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500">
                ¿No sabes cuál elegir?{" "}
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Bonjour Florentin! Tengo una duda sobre cuál guía pedagógica me conviene para mi nivel.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0055a5] underline underline-offset-2 hover:text-[#0c1b33]"
                >
                  Pregúntame por WhatsApp
                </a>{" "}
                y te recomiendo la guía perfecta.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECCIÓN 2: CUADERNOS POR NIVEL (70 A 100 PÁGINAS - PRODUCTO MÁS CARO)
      ════════════════════════════════════════════════════════════ */}
      {activeTab === "cuadernos" && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Cabecera de la sección de Cuadernos */}
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-300 mb-3">
                ⭐ Obras Maestras Didácticas · 70 a 110 Páginas
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0c1b33] font-serif mb-3">
                Cuadernos de Práctica Extensiva con Soluciones
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                El material más completo de la academia. Libros de trabajo diseñados específicamente para superar los bloqueos de los hispanohablantes mediante repetición guiada y explicaciones del porqué.
              </p>
            </div>

            {/* Selector de Nivel (A1, A2, B1, B2) */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
                {(["A1", "A2", "B1", "B2"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setNivelCuadernoActivo(lvl)}
                    className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      nivelCuadernoActivo === lvl
                        ? "bg-[#0c1b33] text-white shadow-md scale-[1.03]"
                        : "text-slate-600 hover:text-black hover:bg-white/60"
                    }`}
                  >
                    Nivel {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* TARJETA DEL CUADERNO SELECCIONADO (ESTÉTICA EDITORIAL 3D) */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual del Cuaderno / Workbook con Grosor 3D */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative group perspective">
                    {/* Efecto de lomo de libro grueso (70-100 págs) */}
                    <div className="w-56 sm:w-64 h-80 sm:h-92 bg-gradient-to-br from-[#0c1b33] via-[#162a4d] to-[#0c1b33] rounded-r-2xl rounded-l-md shadow-2xl border-l-8 border-slate-900 flex flex-col justify-between p-6 text-white relative transform transition-transform duration-300 group-hover:rotate-y-6 group-hover:scale-105">
                      
                      {/* Cinta decorativa superior */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-[#0c1b33]">
                          {cuadernoActual.badge}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-widest text-slate-300">
                          EDICIÓN 2026
                        </span>
                      </div>

                      {/* Título en portada del libro */}
                      <div className="text-center my-auto">
                        <span className="text-[9px] uppercase tracking-[3px] text-amber-300 font-bold">
                          MÉTODO FLORENTIN
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black font-serif text-white mt-1 leading-tight">
                          FRANÇAIS {cuadernoActual.nivel_codigo}
                        </h3>
                        <p className="text-xs font-semibold text-slate-300 mt-2">
                          Cahier d'Exercices Pratiques
                        </p>
                        <div className="w-12 h-0.5 bg-amber-400 mx-auto my-3" />
                        <p className="text-[10px] text-slate-300">
                          {cuadernoActual.paginas} PÁGINAS · SOLUCIONES COMPLETAS
                        </p>
                      </div>

                      {/* Pie de portada */}
                      <div className="text-center text-[9px] text-slate-400 border-t border-white/10 pt-2">
                        Pour hispanophones autonomes
                      </div>
                    </div>

                    {/* Sombra de páginas de libro encuadernado al lado */}
                    <div className="absolute right-0 top-3 bottom-3 w-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-r-md -z-10 shadow-md" />
                  </div>

                  {/* Badges de soporte */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <span>📖 {cuadernoActual.paginas} páginas</span>
                    <span>•</span>
                    <span>✍️ {cuadernoActual.total_ejercicios} actividades</span>
                  </div>

                  <button
                    onClick={() => setModalPreview({
                      titulo: cuadernoActual.titulo,
                      tipo: "Cuaderno Extensivo",
                      paginas: cuadernoActual.paginas
                    })}
                    className="mt-3 text-xs text-[#0055a5] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Ver muestra del temario y páginas</span>
                  </button>
                </div>

                {/* Columna Derecha: Explicación de Valor y Compra */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#0055a5]">
                      {cuadernoActual.nivel_nombre}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b33] font-serif leading-tight mt-1 mb-2">
                      {cuadernoActual.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cuadernoActual.subtitulo}
                    </p>
                  </div>

                  {/* Lo que incluye el Cuaderno */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {cuadernoActual.beneficios.map((ben, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {ben.titulo}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug pl-5">
                          {ben.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Acordeón rápido de módulos incluidos */}
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                    <span className="text-xs font-extrabold text-[#0c1b33] block mb-2">
                      Temario incluido en este cuaderno:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                      {cuadernoActual.temario.slice(0, 4).map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#0055a5] font-bold">•</span>
                          <span className="line-clamp-1">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fila de Compra */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#0c1b33]">
                          {divisa === "usd" ? `$${cuadernoActual.precio_usd}` : `${cuadernoActual.precio_eur} €`}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">pago único</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold block">
                        ⚡ Descarga inmediata + Acceso de por vida
                      </span>
                    </div>

                    <button
                      onClick={() => setModalCheckout({
                        titulo: cuadernoActual.titulo,
                        precio: divisa === "usd" ? cuadernoActual.precio_usd : cuadernoActual.precio_eur,
                        divisa: divisa.toUpperCase(),
                        tipo: "Cuaderno Extensivo"
                      })}
                      className="px-8 py-3.5 rounded-full bg-[#0c1b33] hover:bg-[#152e55] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      <span>Comprar Cuaderno Completo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Garantías de los Cuadernos */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-lg">🛡️</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Garantía Pedagógica</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Diseñado por profesor nativo titulado para hispanohablantes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-lg">📲</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Multiplataforma</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Compatible con iPad, tabletas, PC o impresión física A4.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="text-lg">💬</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Soporte por WhatsApp</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Pregunta directamente a Florentin si tienes dudas con un ejercicio.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          SECCIÓN 3: RECURSOS GRATUITOS (LEAD MAGNETS)
      ════════════════════════════════════════════════════════════ */}
      {activeTab === "gratuitos" && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300 mb-3">
                🎁 Biblioteca de Acceso Libre
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b33] font-serif mb-2">
                Mis Fichas y Guías Gratuitas
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Material descargable sin coste para que empieces a mejorar tu francés hoy mismo con explicaciones claras.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recursosGratuitos.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                        {rec.icono}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                        {rec.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {rec.titulo}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {rec.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={rec.link}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#0055a5] hover:text-[#0c1b33] transition-colors"
                    >
                      <span>Leer guía y descargar gratis</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL DE VISTA PREVIA (HOJEAR MUESTRA)
      ════════════════════════════════════════════════════════════ */}
      {modalPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn">
            <button
              onClick={() => setModalPreview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-black p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Eye size={15} />
              <span>Vista Previa Gratuita</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
              {modalPreview.titulo}
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Muestra preliminar de las primeras páginas del documento ({modalPreview.paginas} páginas en total).
            </p>

            {/* Simulación visual de hoja interior */}
            <div className="aspect-[4/3] bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-inner text-xs text-slate-600 mb-6">
              <div className="border-b border-slate-200 pb-2 flex justify-between text-[10px] text-slate-400">
                <span>Le Français avec Florentin</span>
                <span>Page 1 / {modalPreview.paginas}</span>
              </div>
              <div className="space-y-2 py-4">
                <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-2.5 bg-slate-200 rounded w-full" />
                <div className="h-2.5 bg-slate-200 rounded w-5/6" />
                <div className="h-2 bg-slate-200 rounded w-2/3" />
              </div>
              <div className="text-center text-[10px] text-slate-400 italic">
                El documento completo en alta resolución se descarga inmediatamente tras la compra.
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalPreview(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const tit = modalPreview.titulo;
                  setModalPreview(null);
                  setModalCheckout({
                    titulo: tit,
                    precio: divisa === "usd" ? 10 : 9,
                    divisa: divisa.toUpperCase(),
                    tipo: modalPreview.tipo
                  });
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0055a5] text-white hover:bg-blue-900 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingCart size={14} />
                <span>Comprar versión completa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL DE CHECKOUT / COMPRA DIRECTA CON STRIPE
      ════════════════════════════════════════════════════════════ */}
      {modalCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fadeIn">
            <button
              onClick={() => setModalCheckout(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-black p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
              <ShieldCheck size={16} />
              <span>Compra Segura Encriptada</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
              {modalCheckout.titulo}
            </h3>

            <div className="flex items-baseline gap-2 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-2xl font-black text-[#0c1b33]">
                {modalCheckout.precio} {modalCheckout.divisa === "USD" ? "$" : "€"}
              </span>
              <span className="text-xs text-slate-500">Pago único · Descarga instantánea</span>
            </div>

            <form onSubmit={procesarCompra} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tu correo electrónico (para recibir el enlace de descarga):
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={emailCheckout}
                  onChange={(e) => setEmailCheckout(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#0055a5] focus:outline-hidden"
                />
              </div>

              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                  <span>Descarga inmediata en pantalla tras el pago</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                  <span>Copia de seguridad enviada a tu correo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                  <span>Compatible con Apple Pay, Google Pay y Tarjeta</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-[#0055a5] hover:bg-[#003d7a] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isProcessing ? (
                  <span>Conectando con Stripe...</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pagar {modalCheckout.precio} {modalCheckout.divisa === "USD" ? "$" : "€"} con Stripe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
