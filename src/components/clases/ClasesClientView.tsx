"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { translations, Language } from "@/lib/translations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight, ChevronDown, CheckCircle, CheckCircle2,
  Globe2, Coins, User, BarChart2,
  CalendarCheck, MessageSquare, Clock, Headphones, BookOpen
} from "lucide-react";

export interface PlanItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  total_clases: number;
  tipo?: string;
  nivel?: string;
  activo?: boolean;
  orden?: number;
  recomendado?: boolean;
  imagen_url?: string;
  badge?: string;
  duracion?: string;
  caracteristicas?: string;
}

interface ClasesClientViewProps {
  initialPlanes: PlanItem[];
  whatsappNumber?: string;
}

const fallbackPlanesDefault: PlanItem[] = [
  {
    id: 22,
    nombre: "Sesión de diagnóstico gratuita",
    descripcion: "Una sesión de 30 minutos para conocer tu nivel, hablar de tus objetivos y ver si mis clases son adecuadas para ti.",
    precio: 0,
    total_clases: 1,
    tipo: "clase_gratis",
    nivel: "Todos los Niveles",
    activo: true,
    orden: 0,
    recomendado: false,
    imagen_url: "/teacher_hero.png",
    badge: "Flexible",
    duracion: "30 Minutos",
    caracteristicas: "Evaluación completa de tu nivel\nPlan personalizado a tus metas\nSin compromiso ni tarjeta de crédito"
  },
  {
    id: 26,
    nombre: "Una clase",
    descripcion: "Para necesidades puntuales, preparación urgente de una entrevista o prueba de método.",
    precio: 29.9,
    total_clases: 1,
    tipo: "paquete",
    nivel: "Todos los Niveles",
    activo: true,
    orden: 1,
    recomendado: false,
    imagen_url: "/photo_libre.png",
    badge: "Flexible",
    duracion: "1 Sesión (50 min)",
    caracteristicas: "50 minutos 1 a 1 por Microsoft Teams\nResumen pedagógico y vocabulario en PDF\nGrabación disponible de la sesión"
  },
  {
    id: 25,
    nombre: "Regular (Pack 4 Clases)",
    descripcion: "Progresa a tu propio ritmo con 1 clase por semana. Ideal para mantener el hábito y ganar fluidez.",
    precio: 119.6,
    total_clases: 4,
    tipo: "paquete",
    nivel: "Todos los Niveles",
    activo: true,
    orden: 2,
    recomendado: false,
    imagen_url: "/photo_pack_4.png",
    badge: "Más Popular",
    duracion: "4 Semanas",
    caracteristicas: "4 clases individuales de 50 minutos\nMateriales y ejercicios prácticos entre clases\nSoporte para dudas vía WhatsApp\nFlexibilidad total de reprogramación"
  },
  {
    id: 27,
    nombre: "Inmersión (Pack 8 Clases)",
    descripcion: "Logra un progreso acelerado con 2 sesiones por semana. Inmersión guiada y práctica conversacional continua.",
    precio: 219.9,
    total_clases: 8,
    tipo: "paquete",
    nivel: "Todos los Niveles",
    activo: true,
    orden: 3,
    recomendado: true,
    imagen_url: "/photo_pack_8.png",
    badge: "Recomendado",
    duracion: "4 a 8 Semanas",
    caracteristicas: "8 clases individuales de 50 minutos\nCorrección intensiva de pronunciación\nSimulaciones de conversación real\nSoporte prioritario por WhatsApp"
  },
  {
    id: 28,
    nombre: "Intensivo (Pack 12 Clases)",
    descripcion: "Apoyo intensivo y personalizado para mudanza a Francia, examen DELF/DALF o meta laboral exigente.",
    precio: 299.9,
    total_clases: 12,
    tipo: "paquete",
    nivel: "Todos los Niveles",
    activo: true,
    orden: 4,
    recomendado: false,
    imagen_url: "/photo_intensive_3.png",
    badge: "Acelerado",
    duracion: "6 a 12 Semanas",
    caracteristicas: "12 clases individuales de 50 minutos\nPreparación específica de exámenes oficiales\nBiblioteca completa de recursos multimedia\nPlan de estudio intensivo semana a semana"
  }
];

interface PlanTranslationData {
  nombre: string;
  descripcion: string;
  badge: string;
  nivel: string;
  duracion: string;
  caracteristicas: string[];
}

const PLAN_TRANSLATIONS: Record<Language, Record<number, PlanTranslationData>> = {
  es: {
    22: {
      nombre: "Sesión de diagnóstico gratuita",
      descripcion: "Una sesión de 30 minutos para conocer tu nivel, hablar de tus objetivos y ver si mis clases son adecuadas para ti.",
      badge: "⭐ DIAGNÓSTICO GRATIS",
      nivel: "Todos los Niveles",
      duracion: "30 Minutos",
      caracteristicas: [
        "Evaluación completa de tu nivel",
        "Plan personalizado a tus metas",
        "Sin compromiso ni tarjeta de crédito"
      ]
    },
    26: {
      nombre: "Una clase",
      descripcion: "Para necesidades puntuales, preparación urgente de una entrevista o prueba de método.",
      badge: "Flexible",
      nivel: "Todos los Niveles",
      duracion: "1 Sesión (50 min)",
      caracteristicas: [
        "50 minutos 1 a 1 por Microsoft Teams",
        "Resumen pedagógico y vocabulario en PDF",
        "Grabación disponible de la sesión"
      ]
    },
    25: {
      nombre: "Regular (Pack 4 Clases)",
      descripcion: "Progresa a tu propio ritmo con 1 clase por semana. Ideal para mantener el hábito y ganar fluidez.",
      badge: "Más Popular",
      nivel: "Todos los Niveles",
      duracion: "4 Semanas",
      caracteristicas: [
        "4 clases individuales de 50 minutos",
        "Materiales y ejercicios prácticos entre clases",
        "Soporte para dudas vía WhatsApp",
        "Flexibilidad total de reprogramación"
      ]
    },
    27: {
      nombre: "Inmersión (Pack 8 Clases)",
      descripcion: "Logra un progreso acelerado con 2 sesiones por semana. Inmersión guiada y práctica conversacional continua.",
      badge: "Recomendado",
      nivel: "Todos los Niveles",
      duracion: "4 a 8 Semanas",
      caracteristicas: [
        "8 clases individuales de 50 minutos",
        "Corrección intensiva de pronunciación",
        "Simulaciones de conversación real",
        "Soporte prioritario por WhatsApp"
      ]
    },
    28: {
      nombre: "Intensivo (Pack 12 Clases)",
      descripcion: "Apoyo intensivo y personalizado para mudanza a Francia, examen DELF/DALF o meta laboral exigente.",
      badge: "Acelerado",
      nivel: "Todos los Niveles",
      duracion: "6 a 12 Semanas",
      caracteristicas: [
        "12 clases individuales de 50 minutos",
        "Preparación específica de exámenes oficiales",
        "Biblioteca completa de recursos multimedia",
        "Plan de estudio intensivo semana a semana"
      ]
    }
  },
  fr: {
    22: {
      nombre: "Session de diagnostic gratuite",
      descripcion: "Une session de 30 minutes pour faire le point sur votre niveau, définir vos objectifs et découvrir ma méthode.",
      badge: "⭐ DIAGNOSTIC GRATUIT",
      nivel: "Tous Niveaux",
      duracion: "30 Minutes",
      caracteristicas: [
        "Évaluation complète de votre niveau",
        "Plan d'apprentissage adapté à vos objectifs",
        "Sans engagement ni carte bancaire"
      ]
    },
    26: {
      nombre: "Cours à l'unité",
      descripcion: "Pour un besoin ponctuel, la préparation urgente d'un entretien ou tester la méthode d'apprentissage.",
      badge: "Flexible",
      nivel: "Tous Niveaux",
      duracion: "1 Séance (50 min)",
      caracteristicas: [
        "50 minutes en direct 1 à 1 sur Microsoft Teams",
        "Fiche récapitulative et vocabulaire en PDF",
        "Enregistrement de la séance disponible sur demande"
      ]
    },
    25: {
      nombre: "Régulier (Pack 4 Cours)",
      descripcion: "Progressez à votre rythme avec 1 cours par semaine. Idéal pour ancrer l'habitude et gagner en aisance.",
      badge: "Le Plus Populaire",
      nivel: "Tous Niveaux",
      duracion: "4 Semaines",
      caracteristicas: [
        "4 cours individuels de 50 minutes",
        "Supports et exercices pratiques entre les cours",
        "Assistance pour vos questions par WhatsApp",
        "Flexibilité complète pour reprogrammer"
      ]
    },
    27: {
      nombre: "Immersion (Pack 8 Cours)",
      descripcion: "Accélérez vos progrès avec 2 séances par semaine. Immersion guidée et pratique continue de la conversation.",
      badge: "Recommandé",
      nivel: "Tous Niveaux",
      duracion: "4 à 8 Semaines",
      caracteristicas: [
        "8 cours individuels de 50 minutes",
        "Correction phonétique et prononciation intensive",
        "Mises en situation et conversations réelles",
        "Support prioritaire par WhatsApp"
      ]
    },
    28: {
      nombre: "Intensif (Pack 12 Cours)",
      descripcion: "Accompagnement intensif et sur-mesure pour expatriation en France, examen DELF/DALF ou objectif professionnel.",
      badge: "Accéléré",
      nivel: "Tous Niveaux",
      duracion: "6 à 12 Semaines",
      caracteristicas: [
        "12 cours individuels de 50 minutes",
        "Préparation ciblée aux examens officiels (DELF/DALF)",
        "Accès complet aux ressources et fiches pédagogiques",
        "Plan d'étude intensif semaine par semaine"
      ]
    }
  },
  en: {
    22: {
      nombre: "Free Diagnostic Session",
      descripcion: "A 30-minute session to assess your level, discuss your goals, and see if my classes are a great fit for you.",
      badge: "⭐ FREE DIAGNOSTIC",
      nivel: "All Levels",
      duracion: "30 Minutes",
      caracteristicas: [
        "Comprehensive level assessment",
        "Tailored plan for your goals",
        "No commitment or credit card required"
      ]
    },
    26: {
      nombre: "Single Class",
      descripcion: "For targeted needs, urgent interview preparation, or testing out the learning method.",
      badge: "Flexible",
      nivel: "All Levels",
      duracion: "1 Session (50 min)",
      caracteristicas: [
        "50 minutes 1-on-1 via Microsoft Teams",
        "PDF lesson summary and vocabulary sheet",
        "Session recording available on request"
      ]
    },
    25: {
      nombre: "Regular (4-Class Pack)",
      descripcion: "Progress at your own pace with 1 class per week. Ideal for building consistency and gaining fluency.",
      badge: "Most Popular",
      nivel: "All Levels",
      duracion: "4 Weeks",
      caracteristicas: [
        "4 individual 50-minute classes",
        "Practical exercises and materials between classes",
        "Support for questions via WhatsApp",
        "Full rescheduling flexibility"
      ]
    },
    27: {
      nombre: "Immersion (8-Class Pack)",
      descripcion: "Accelerate your progress with 2 sessions per week. Guided immersion and continuous conversational practice.",
      badge: "Recommended",
      nivel: "All Levels",
      duracion: "4 to 8 Weeks",
      caracteristicas: [
        "8 individual 50-minute classes",
        "Intensive pronunciation correction",
        "Real-life conversational roleplays",
        "Priority WhatsApp support"
      ]
    },
    28: {
      nombre: "Intensive (12-Class Pack)",
      descripcion: "Intensive personalized preparation for moving to France, DELF/DALF exams, or demanding career goals.",
      badge: "Accelerated",
      nivel: "All Levels",
      duracion: "6 to 12 Weeks",
      caracteristicas: [
        "12 individual 50-minute classes",
        "Targeted preparation for official exams (DELF/DALF)",
        "Full access to learning resources and worksheets",
        "Intensive week-by-week study plan"
      ]
    }
  }
};

export default function ClasesClientView({ initialPlanes, whatsappNumber = "33672023884" }: ClasesClientViewProps) {
  const [lang, setLang] = useState<Language>("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [tasaUsd, setTasaUsd] = useState(1.08);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [divisaDropdownOpen, setDivisaDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const divisaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (divisaRef.current && !divisaRef.current.contains(e.target as Node)) {
        setDivisaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_lang", newLang);
    }
  };

  const changeDivisa = (newDivisa: "eur" | "usd") => {
    setDivisa(newDivisa);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_divisa", newDivisa);
    }
  };

  const t = translations[lang] || translations.es;
  const planes = initialPlanes && initialPlanes.length > 0 ? initialPlanes : fallbackPlanesDefault;

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "") || "33672023884";
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    lang === "fr"
      ? "Bonjour Florentin, je voudrais réserver mon cours d'essai gratuit de 30 minutes."
      : lang === "en"
      ? "Hi Florentin, I would like to book my 30-minute free trial class."
      : "Hola Florentin, me gustaría reservar mi clase de prueba gratuita de 30 minutos."
  )}`;

  const formatPrecio = (precioEur: number) => {
    if (precioEur === 0) {
      return lang === "fr" ? "GRATUIT" : lang === "en" ? "FREE" : "GRATIS";
    }
    if (divisa === "usd") {
      const precioUsd = (precioEur * tasaUsd).toFixed(2);
      return `$${precioUsd} USD`;
    }
    return `${precioEur.toFixed(2).replace(".", ",")} €`;
  };

  const getPlanImage = (plan: PlanItem, isFree: boolean, idx: number) => {
    // Si la imagen viene definida en BD y NO es el placeholder genérico 'french_hero.png', respetarla
    if (plan.imagen_url && plan.imagen_url.trim() !== "" && plan.imagen_url !== "/french_hero.png") {
      return plan.imagen_url;
    }

    const n = (plan.nombre || "").toLowerCase();
    if (isFree || plan.id === 22 || n.includes("prueba") || n.includes("diagnóstico") || n.includes("diagnostic") || n.includes("gratuit") || n.includes("free")) {
      return "/teacher_hero.png";
    }
    if (plan.id === 26 || (plan.total_clases === 1 && plan.precio > 0) || n.includes("libre") || n.includes("una clase") || n.includes("one class") || n.includes("un cours")) {
      return "/photo_libre.png";
    }
    if (plan.id === 25 || plan.total_clases === 4 || n.includes("regular") || n.includes("pack 4") || n.includes("4 clases") || n.includes("4 cours")) {
      return "/photo_pack_4.png";
    }
    if (plan.id === 27 || plan.total_clases === 8 || n.includes("inmersión") || n.includes("inmersion") || n.includes("immersion") || n.includes("pack 8") || n.includes("8 clases")) {
      return "/photo_pack_8.png";
    }
    if (plan.id === 28 || plan.total_clases === 12 || n.includes("intensivo") || n.includes("intensif") || n.includes("intensive") || n.includes("pack 12") || n.includes("12 clases")) {
      return "/photo_intensive_3.png";
    }
    const fallbacks = ["/teacher_hero.png", "/photo_libre.png", "/photo_pack_4.png", "/photo_pack_8.png", "/photo_intensive_3.png"];
    return fallbacks[idx % fallbacks.length];
  };

  const getPlanTranslation = (plan: PlanItem, currentLang: Language) => {
    const langDict = PLAN_TRANSLATIONS[currentLang] || PLAN_TRANSLATIONS.es;

    // Detectar clave canónica (22, 26, 25, 27, 28)
    const n = (plan.nombre || "").toLowerCase();
    let key: number = 22;

    if (plan.id === 22 || Number(plan.precio) === 0 || plan.tipo === "clase_gratis" || n.includes("diagnóstico") || n.includes("diagnostic") || n.includes("prueba") || n.includes("free")) {
      key = 22;
    } else if (plan.id === 26 || (plan.total_clases === 1 && plan.precio > 0) || n.includes("una clase") || n.includes("libre") || n.includes("single") || n.includes("unité")) {
      key = 26;
    } else if (plan.id === 25 || plan.total_clases === 4 || n.includes("regular") || n.includes("pack 4") || n.includes("4 cours") || n.includes("4 clases")) {
      key = 25;
    } else if (plan.id === 27 || plan.total_clases === 8 || n.includes("inmersión") || n.includes("inmersion") || n.includes("immersion") || n.includes("pack 8")) {
      key = 27;
    } else if (plan.id === 28 || plan.total_clases === 12 || n.includes("intensivo") || n.includes("intensif") || n.includes("intensive") || n.includes("pack 12")) {
      key = 28;
    } else if (plan.id && langDict[plan.id]) {
      key = plan.id;
    }

    if (langDict[key]) {
      return langDict[key];
    }

    // Fallback de seguridad usando los datos originales del plan
    return {
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      badge: plan.badge || (currentLang === "fr" ? "Flexible" : currentLang === "en" ? "Flexible" : "Flexible"),
      nivel: plan.nivel || (currentLang === "fr" ? "Tous Niveaux" : currentLang === "en" ? "All Levels" : "Todos los Niveles"),
      duracion: plan.duracion || (plan.total_clases > 0 ? `${plan.total_clases} ${currentLang === "fr" ? "Séances" : currentLang === "en" ? "Sessions" : "Sesiones"}` : "1 Sesión"),
      caracteristicas: plan.caracteristicas && plan.caracteristicas.trim().length > 0
        ? plan.caracteristicas.split("\n").filter((f: string) => f.trim().length > 0)
        : [
            currentLang === "fr" ? "Cours 1 à 1 avec moi" : currentLang === "en" ? "1-on-1 class with me" : "Clase 1 a 1 conmigo",
            currentLang === "fr" ? "Supports de cours personnalisés" : currentLang === "en" ? "Personalized learning materials" : "Material didáctico personalizado",
            currentLang === "fr" ? "Flexibilité d'horaires" : currentLang === "en" ? "Schedule flexibility" : "Flexibilidad de horario"
          ]
    };
  };

  const faqsClases = [
    {
      q: lang === "fr" ? "Comment se déroulent les cours en ligne ?" : lang === "en" ? "How do online classes work?" : "¿Cómo se imparten las clases en línea?",
      a: lang === "fr"
        ? "Les cours ont lieu en direct 1 à 1 via Microsoft Teams. Chaque session de 50 minutes allie conversation naturelle, grammaire pratique et correction phonétique en temps réel."
        : lang === "en"
        ? "Classes are conducted 1-on-1 live via Microsoft Teams. Each 50-minute session combines natural conversation, practical grammar, and real-time phonetic feedback."
        : "Las clases son 1 a 1 en vivo a través de Microsoft Teams. Cada sesión de 50 minutos combina conversación espontánea, gramática aplicada y corrección de pronunciación en tiempo real."
    },
    {
      q: lang === "fr" ? "Puis-je reporter ou annuler un cours ?" : lang === "en" ? "Can I reschedule or cancel a class?" : "¿Puedo reprogramar o cancelar una clase?",
      a: lang === "fr"
        ? "Oui, en toute tranquillité. Vous pouvez reporter votre cours jusqu'à 24 heures à l'avance sans aucun frais. Votre cours est reprogrammé, jamais perdu."
        : lang === "en"
        ? "Yes, absolutely. You can reschedule your session up to 24 hours in advance at no extra cost. Your class is rescheduled, never lost."
        : "Sí, con total tranquilidad. Puedes reagendar tu sesión con al menos 24 horas de anticipación sin ningún costo. Tu clase se reprograma, nunca se pierde."
    },
    {
      q: lang === "fr" ? "Quelle est la durée de validité des forfaits ?" : lang === "en" ? "How long are class packs valid?" : "¿Cuánto tiempo duran o caducan los paquetes de clases?",
      a: lang === "fr"
        ? "Les forfaits de 4, 8 ou 12 cours ont une validité étendue de 3 à 6 mois pour que vous puissiez apprendre sans stress selon vos disponibilités professionnelles et personnelles."
        : lang === "en"
        ? "Packs of 4, 8, or 12 classes are valid for 3 to 6 months so you can learn without pressure according to your personal schedule."
        : "Los paquetes de 4, 8 y 12 clases tienen una validez flexible de 3 a 6 meses para que puedas avanzar sin presiones adaptándote a tus viajes y horarios laborales."
    },
    {
      q: lang === "fr" ? "Comment fonctionnent les paiements ?" : lang === "en" ? "How do payments work?" : "¿Cómo se realizan los pagos?",
      a: lang === "fr"
        ? "Les paiements sont 100% sécurisés via Stripe par carte bancaire. Il s'agit d'un paiement unique par forfait, sans aucun abonnement ni prélèvement automatique récurrent."
        : lang === "en"
        ? "Payments are 100% secure via Stripe using debit or credit card. It is a single one-time payment per pack, with no recurring subscriptions or surprise charges."
        : "Los pagos se procesan de forma segura mediante Stripe con tarjeta de crédito o débito. Es un pago único por paquete, sin suscripciones automáticas ni cobros ocultos."
    }
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0c1b33] selection:bg-[#3b82f6]/20 selection:text-[#0c1b33] font-sans">
      
      {/* ═══════════════════════════════════════
          NAVBAR UNIFICADO
      ═══════════════════════════════════════ */}
      <Navbar
        activePage="clases"
        currentLang={lang}
        onLangChange={changeLang}
        onDivisaChange={changeDivisa}
      />

      {/* ═══════════════════════════════════════
          HERO DE LA PÁGINA DE CLASES
      ═══════════════════════════════════════ */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-b from-blue-50/50 via-white to-[#f8fafc]">
        <div className="max-w-6xl mx-auto text-center">

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0f172a] font-serif mb-6 leading-tight">
            {lang === "es" ? "Explora los planes de clases" : lang === "fr" ? "Explorez nos formules de cours" : "Explore our French classes"}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            {lang === "es"
              ? "Clases particulares individuales 1 a 1 por Microsoft Teams conmigo, profesor nativo certificado. Flexibilidad, inmersión y metodología personalizada para tus metas."
              : lang === "fr"
              ? "Cours particuliers en ligne 1 à 1 via Microsoft Teams avec moi, professeur natif certifié. Flexibilité, immersion et pédagogie sur mesure."
              : "Private 1-on-1 French lessons via Microsoft Teams with me, certified native teacher. Full flexibility and personalized immersion."}
          </p>

          {/* Selector de divisa EUR / USD */}
          <div className="inline-flex items-center gap-2 bg-white p-2 rounded-full border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-500 pl-3 pr-1">
              {lang === "es" ? "Moneda:" : lang === "fr" ? "Devise :" : "Currency:"}
            </span>
            {(["eur", "usd"] as const).map((d) => (
              <button 
                key={d} 
                onClick={() => changeDivisa(d)} 
                className={`px-5 py-2 rounded-full font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                  divisa === d ? "bg-[#0055a5] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          GRID DE TARJETAS DE PLANES
      ═══════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {planes.map((plan, idx) => {
            const isFreePlan = Number(plan.precio) === 0 || plan.tipo === "clase_gratis";
            const planTranslation = getPlanTranslation(plan, lang);
            const planImgSrc = getPlanImage(plan, isFreePlan, idx);
            const rawFeatures = planTranslation.caracteristicas;

            return (
              <div 
                key={plan.id || idx} 
                className={`rounded-[24px] overflow-hidden bg-white flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isFreePlan
                    ? "border-2 border-[#10b981] shadow-lg shadow-[#10b981]/10"
                    : plan.recomendado 
                      ? "border-2 border-[#0055a5] shadow-xl shadow-[#0055a5]/10" 
                      : "border border-slate-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="relative h-[200px] w-full bg-slate-100">
                    <Image 
                      src={planImgSrc} 
                      alt={planTranslation.nombre} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover" 
                    />
                    <span className={`absolute top-3 left-3 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 ${
                      isFreePlan 
                        ? "bg-[#10b981] text-white" 
                        : plan.recomendado
                          ? "bg-[#0055a5] text-white border border-[#0055a5] shadow-blue-500/20"
                          : "bg-white text-slate-800 border border-slate-100"
                    }`}>
                      {isFreePlan 
                        ? (lang === "fr" ? "⭐ DIAGNOSTIC GRATUIT" : lang === "en" ? "⭐ FREE DIAGNOSTIC" : "⭐ DIAGNÓSTICO GRATIS") 
                        : plan.recomendado 
                          ? (lang === "fr" ? "🇫🇷 Plus Recommandé" : lang === "en" ? "🇫🇷 Most Recommended" : "🇫🇷 Más Recomendado") 
                          : planTranslation.badge}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2 leading-snug">
                      {planTranslation.nombre}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-4 min-h-[40px]">
                      {planTranslation.descripcion}
                    </p>
                    <p className={`text-xs font-bold mb-4 ${isFreePlan ? "text-[#10b981]" : "text-[#0055a5]"}`}>
                      {planTranslation.nivel} • {planTranslation.duracion}
                    </p>

                    <ul className="space-y-2.5 pt-3 border-t border-slate-100">
                      {rawFeatures.map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle size={14} className="text-[#10b981] shrink-0" />
                          <span>{feature.replace(/^[✓\s-]+/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                  <div>
                    <span className="text-2xl font-extrabold text-[#0f172a]">
                      {formatPrecio(plan.precio)}
                    </span>
                    {!isFreePlan && plan.total_clases > 0 && (
                      <span className="text-[11px] text-slate-400 font-medium block">
                        / {plan.total_clases} {plan.total_clases === 1 
                          ? (lang === "fr" ? "cours" : lang === "en" ? "class" : "clase") 
                          : (lang === "fr" ? "cours" : lang === "en" ? "classes" : "clases")}
                      </span>
                    )}
                  </div>

                  {isFreePlan ? (
                    <a 
                      href={whatsappUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-extrabold transition-all shadow-md hover:scale-105 active:scale-95"
                    >
                      {lang === "es" ? "Agendar →" : lang === "fr" ? "Réserver →" : "Book →"}
                    </a>
                  ) : (
                    <Link 
                      href="/alumno" 
                      className="px-5 py-2.5 rounded-xl bg-[#0055a5] hover:bg-[#003d7a] text-white text-xs font-extrabold transition-all shadow-md hover:scale-105 active:scale-95"
                    >
                      {lang === "es" ? "Elegir Plan →" : lang === "fr" ? "Choisir →" : "Choose →"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUÉ INCLUYE CADA CLASE
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-5 py-2 rounded-full text-xs font-extrabold tracking-[3px] uppercase bg-blue-50 text-[#0055a5] mb-4">
              {lang === "es" ? "GARANTÍA PEDAGÓGICA" : lang === "fr" ? "GARANTIE PÉDAGOGIQUE" : "PEDAGOGICAL GUARANTEE"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0c1b33] font-serif">
              {lang === "es" ? "Todo lo que incluye aprender conmigo" : lang === "fr" ? "Ce qui est inclus quand vous apprenez avec moi" : "What is included when learning with me"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <Headphones size={28} className="text-[#0055a5]" />,
                title: lang === "es" ? "Inmersión 1 a 1 en Vivo" : lang === "fr" ? "Immersion 1 à 1 en Direct" : "Live 1-on-1 Immersion",
                desc: lang === "fr"
                  ? "Parlez dès le premier jour dans des situations de la vie réelle, loin de la répétition passive d'une application."
                  : lang === "en"
                  ? "Speak from day one in real-life conversational contexts, not just passively repeating phrases from an app."
                  : "Habla desde el primer día con situaciones de la vida real, no repitiendo frases de una app."
              },
              {
                icon: <BookOpen size={28} className="text-[#0055a5]" />,
                title: lang === "es" ? "Materiales en PDF tras la sesión" : lang === "fr" ? "Fiches de Révision PDF" : "PDF Lesson Summaries",
                desc: lang === "fr"
                  ? "Recevez vos notes de cours, erreurs corrigées et vocabulaire ciblé sans stresser pour prendre des notes à la hâte."
                  : lang === "en"
                  ? "Receive your lesson notes, corrected mistakes, and key vocabulary without having to rush taking notes."
                  : "Recibe tus apuntes de clase, errores corregidos y vocabulario nuevo sin tener que tomar notas apresuradas."
              },
              {
                icon: <Clock size={28} className="text-[#0055a5]" />,
                title: lang === "es" ? "Flexibilidad de Horarios" : lang === "fr" ? "Flexibilité Horaire Totale" : "Schedule Flexibility",
                desc: lang === "fr"
                  ? "Vous choisissez le jour et l'heure. Annulez ou reprogrammez sans frais avec un préavis de 24h sans perdre votre cours."
                  : lang === "en"
                  ? "You pick the day and time. Cancel or reschedule for free with 24 hours notice without losing your lesson."
                  : "Tú eliges el día y la hora. Cancela o reagenda con 24h de aviso sin perder tu clase."
              },
              {
                icon: <MessageSquare size={28} className="text-[#0055a5]" />,
                title: lang === "es" ? "Soporte WhatsApp entre Clases" : lang === "fr" ? "Assistance WhatsApp" : "WhatsApp Support",
                desc: lang === "fr"
                  ? "Un doute ponctuel pendant que vous étudiez ? Envoyez-moi un message sur WhatsApp et je vous répondrai par note vocale."
                  : lang === "en"
                  ? "Got a quick question while studying? Send me a message on WhatsApp and I will reply with an explanatory audio note."
                  : "¿Una duda puntual mientras estudias? Envíamela por WhatsApp y te responderé con un audio explicativo."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100/60 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-base text-[#0c1b33] mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PREGUNTAS FRECUENTES SOBRE LAS CLASES
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 rounded-full text-xs font-extrabold tracking-[3px] uppercase bg-blue-50 text-[#0055a5] mb-3">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0c1b33] font-serif">
              {lang === "es" ? "Preguntas frecuentes sobre las clases" : lang === "fr" ? "Foire aux questions sur les cours" : "Frequently Asked Questions about classes"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqsClases.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 bg-white rounded-2xl overflow-hidden transition-all shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-[#0c1b33] pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-[#0055a5] transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TARJETA DE CLASE DE PRUEBA GRATUITA (CTA)
      ═══════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#f1f5f9] relative overflow-hidden">
        <div className="max-w-4xl lg:max-w-5xl mx-auto bg-white border border-slate-200/90 rounded-[2.25rem] sm:rounded-[3rem] px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-18 text-center relative z-10 shadow-2xl shadow-slate-300/40 overflow-hidden">
          
          {/* Luces ambientales decorativas dentro de la tarjeta */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-gradient-to-b from-[#3b82f6]/10 via-[#c99a3c]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-10 w-[300px] h-[180px] bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Badge Superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-widest bg-blue-50 text-[#0055a5] border border-blue-200/60 mb-5 sm:mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0055a5] animate-ping" />
            <span>{lang === "fr" ? "SÉANCE DÉCOUVERTE OFFERTE" : lang === "en" ? "FREE DISCOVERY SESSION" : "CLASE DE PRUEBA GRATUITA"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c1b33] font-serif leading-[1.16] tracking-tight max-w-3xl mx-auto mb-3 sm:mb-4">
            {lang === "fr" 
              ? "Essayez un cours d'essai gratuit de 30 minutes"
              : lang === "en" 
                ? "Try a 30-minute free trial class" 
                : "Prueba una clase de prueba gratuita de 30 minutos"}
          </h2>

          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            {lang === "fr" 
              ? "et découvrez comment nous pouvons travailler ensemble." 
              : lang === "en" 
                ? "and discover how we can work together." 
                : "y descubre cómo podemos trabajar juntos."}
          </p>

          {/* Fila Panorámica: Beneficios de la sesión */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-10 text-slate-700">
            <div className="flex items-center gap-3 bg-slate-50/90 border border-slate-200/80 px-4 sm:px-5 py-2.5 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-[#0055a5] flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {lang === "fr" ? "Faire connaissance" : lang === "en" ? "Get to know each other" : "Conocernos"}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/90 border border-slate-200/80 px-4 sm:px-5 py-2.5 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-[#0055a5] flex items-center justify-center shrink-0">
                <BarChart2 size={16} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {lang === "fr" ? "Évaluer votre niveau" : lang === "en" ? "Assess your level" : "Evaluar tu nivel"}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/90 border border-slate-200/80 px-4 sm:px-5 py-2.5 rounded-2xl shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-[#b45309] flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {lang === "fr" ? "Sans engagement" : lang === "en" ? "Zero commitment" : "Sin compromiso"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#003d7a] via-[#004e9a] to-[#003d7a] hover:from-[#002b57] hover:to-[#003d7a] text-white px-9 sm:px-12 py-4 sm:py-4.5 rounded-full text-sm sm:text-base font-extrabold shadow-xl shadow-blue-950/20 hover:shadow-2xl hover:shadow-blue-950/30 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
            >
              <span>{lang === "fr" ? "Réserver mon cours gratuit" : lang === "en" ? "Book my free class" : "Reservar mi clase gratuita"}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-3.5 mb-5 select-none">
              — {lang === "fr" ? "Sans engagement" : lang === "en" ? "No commitment" : "Sin compromiso"} —
            </span>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                lang === "fr" ? "Bonjour Florentin, j'ai une question sur les cours." : lang === "en" ? "Hi Florentin, I have a question about the classes." : "Hola Florentin, tengo una pregunta sobre las clases."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0055a5] bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-5 py-2.5 rounded-full transition-all duration-200 shadow-2xs"
            >
              <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.202-1.362a9.92 9.92 0 004.808 1.258h.005c5.507 0 9.99-4.478 9.99-9.988C22.007 6.478 17.52 2 12.012 2zm6.657 14.184c-.273.768-1.579 1.393-2.185 1.48-.56.08-1.288.125-2.072-.125a10.05 10.05 0 01-4.444-2.82 10.15 10.15 0 01-2.316-3.878c-.286-.777.01-1.39.29-1.68.21-.22.47-.56.71-.85.24-.29.33-.48.49-.8.16-.33.08-.62-.04-.89-.12-.27-1.07-2.58-1.47-3.53-.39-.95-.79-.82-1.08-.83h-.92c-.31 0-.82.12-1.25.59-.43.47-1.64 1.6-1.64 3.9s1.68 4.52 1.91 4.83c.24.31 3.3 5.04 8.01 7.07 1.12.48 2 .77 2.68.99 1.13.36 2.16.31 2.97.19.9-.13 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.09-.15-.35-.24-.76-.44z"/>
              </svg>
              <span>{lang === "fr" ? "Vous avez une question ? Écrivez-moi sur WhatsApp" : lang === "en" ? "Have a question? Text me on WhatsApp" : "¿Tienes una pregunta? Escríbeme por WhatsApp"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER UNIFICADO
      ═══════════════════════════════════════ */}
      <Footer currentLang={lang} whatsappNumber={whatsappNumber} />

      {/* Botón flotante de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white pl-4 pr-6 py-2.5 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 group hover:bg-[#20ba59]"
        style={{ boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.4)" }}
      >
        <div className="relative">
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.202-1.362a9.92 9.92 0 004.808 1.258h.005c5.507 0 9.99-4.478 9.99-9.988C22.007 6.478 17.52 2 12.012 2zm6.657 14.184c-.273.768-1.579 1.393-2.185 1.48-.56.08-1.288.125-2.072-.125a10.05 10.05 0 01-4.444-2.82 10.15 10.15 0 01-2.316-3.878c-.286-.777.01-1.39.29-1.68.21-.22.47-.56.71-.85.24-.29.33-.48.49-.8.16-.33.08-.62-.04-.89-.12-.27-1.07-2.58-1.47-3.53-.39-.95-.79-.82-1.08-.83h-.92c-.31 0-.82.12-1.25.59-.43.47-1.64 1.6-1.64 3.9s1.68 4.52 1.91 4.83c.24.31 3.3 5.04 8.01 7.07 1.12.48 2 .77 2.68.99 1.13.36 2.16.31 2.97.19.9-.13 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.09-.15-.35-.24-.76-.44z"/>
          </svg>
          <span className="absolute -top-1.5 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </div>
        <span className="text-xs font-bold tracking-wide">
          {lang === "fr" ? "Discuter sur WhatsApp" : lang === "en" ? "Chat on WhatsApp" : "¿Hablamos por WhatsApp?"}
        </span>
      </a>

    </main>
  );
}
