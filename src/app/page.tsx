"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";
import WelcomeModal from "@/components/WelcomeModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Plane, Briefcase, Heart, Rocket,
  XCircle, CheckCircle, Clock, MessageCircle, CalendarCheck,
  Award, Globe2, Users, Star, BadgeCheck, BookOpen, Headphones, Building2,
  Smartphone, Coins, PlayCircle, Play, Mail, Phone,
  GraduationCap, Landmark, Languages, MessageSquare, CheckCircle2
} from "lucide-react";

const Facebook = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const defaultSpanishConfig: Record<string, string> = {
  titulo_hero: "Domina el francés con {clases personalizadas}",
  subtitulo_hero: "Aprende a tu ritmo con un profesor nativo. Flexibilidad, material exclusivo y enfoque en la conversación fluida.",
  meta_titulo: "Florentin | Aprende Francés con un Experto Nativo",
  meta_descripcion: "Plataforma educativa para aprender francés. Reserva tus clases en tiempo real, accede a material didáctico exclusivo y sigue tu progreso personalizado.",
  palabras_clave: "aprender frances, clases de frances, profesor de frances, frances online, reserva clases de frances",
  teacher_name: "Florentin",
  teacher_badge: "¿QUIÉN SOY?",
  teacher_title: "Profesor nativo de francés | Diplomado en pedagogía",
  teacher_bio: "Me llamo Florentin. Llevo más de cinco años enseñando francés a alumnos de todos los niveles, desde primaria hasta la universidad, aquí en Francia. He viajado por Latinoamérica y el Cáucaso: descubrir otras culturas me llena de energía. Aprender de ellas y acompañar a las personas en su propio cambio es una motivación. Para mí, enseñar francés no es solo transmitir reglas: es guiarte hacia una nueva cultura lingüística, histórica y geográfica.\n\nMi método se centra en la conversación y la interacción directa. En mis clases, el alumno es totalmente activo: hablarás desde la primera clase. La gramática no se memoriza con listas, se fija con práctica regular y constante, en contexto. Estoy convencido de que aprender debe ser una experiencia dinámica: el disfrute y el rigor van de la mano.",
  teacher_experience: "+5 years",
  teacher_students: "+200 students",
  teacher_countries: "+15 countries",
  teacher_skills: "Pronunciación auténtica, Cultura francesa, Gramática aplicada, Preparación aux exámenes DELF/DALF, Francés para debutantes, Francés avanzado, Preparación TCF / TEF",
  teacher_certs: "Máster en docencia y formación, Licenciatura en historia y ciencias políticas, Pedagogía de lenguas, DELE C1 (español)",
  ps_badge: "¿POR QUÉ FLORENTIN?",
  ps_title: "El problema de aprender francés… y la solución",
  ps_prob_1_title: "Apps genéricas",
  ps_prob_1_desc: "Repites frases sin contexto. No aprendes a mantener una conversación real.",
  ps_sol_1_title: "Conversación real",
  ps_sol_1_desc: "Desde la primera clase hablamos en francés. Aprendes con situaciones reales, no con robots.",
  ps_prob_2_title: "Sin feedback",
  ps_prob_2_desc: "Nadie te corrige la pronunciación ni te explica por qué te equivocas.",
  ps_sol_2_title: "Feedback personalizado",
  ps_sol_2_desc: "Te corrijo en tiempo real, te explico las reglas y perfeccionamos tu acento juntos.",
  ps_prob_3_title: "Horarios rígidos",
  ps_prob_3_desc: "Las academias te obligan a adaptarte a sus horarios. Tú trabajas, viajas, vives.",
  ps_sol_3_title: "Flexibilidad total",
  ps_sol_3_desc: "Tú eliges el día y la hora. Clases por Microsoft Teams desde donde estés, en tu zona horaria.",
  for_whom_badge: "¿PARA QUIÉN ES?",
  for_whom_title: "Florentin es para ti si…",
  for_whom_1_title: "Quieres vivir en Francia",
  for_whom_1_desc: "Prepárate para mudarte con confianza. Aprende el francés que realmente necesitas para la vida diaria.",
  for_whom_2_title: "Estudias o trabajas",
  for_whom_2_desc: "Mejora tu currículum con francés certificado. Ideal para universitarios y profesionales.",
  for_whom_3_title: "Amas la cultura francesa",
  for_whom_3_desc: "Cine, literatura, gastronomía… Disfruta la cultura francesa en su idioma original.",
  for_whom_4_title: "Empiezas desde cero",
  for_whom_4_desc: "No importa tu nivel. Diseño cada clase según tu ritmo y necesidades específicas.",
  cta_badge: "¿LISTO PARA EMPEZAR?",
  cta_title: "Agenda tu clase gratuita",
  cta_subtitle: "Escríbeme por WhatsApp y coordinamos tu primera sesión de prueba. Sin compromiso, sin pagos.",
  cta_btn_text: "Agendar por WhatsApp"
};

const defaultKeysMap: Record<string, string> = {
  titulo_hero: "heroTitleCombined",
  subtitulo_hero: "heroSubtitle",
  teacher_name: "teacherName",
  teacher_title: "teacherTitle",
  teacher_bio: "teacherBio",
  teacher_students: "teacherStudents",
  teacher_countries: "teacherCountries",
  teacher_experience: "teacherExperience",
  ps_badge: "psBadge",
  ps_title: "psTitle",
  ps_prob_1_title: "psProblem1",
  ps_prob_1_desc: "psProblemDesc1",
  ps_sol_1_title: "psSolution1",
  ps_sol_1_desc: "psSolutionDesc1",
  ps_prob_2_title: "psProblem2",
  ps_prob_2_desc: "psProblemDesc2",
  ps_sol_2_title: "psSolution2",
  ps_sol_2_desc: "psSolutionDesc2",
  ps_prob_3_title: "psProblem3",
  ps_prob_3_desc: "psProblemDesc3",
  ps_sol_3_title: "psSolution3",
  ps_sol_3_desc: "psSolutionDesc3",
  for_whom_badge: "forWhomBadge",
  for_whom_title: "forWhomTitle",
  for_whom_1_title: "forWhom1Title",
  for_whom_1_desc: "forWhom1Desc",
  for_whom_2_title: "forWhom2Title",
  for_whom_2_desc: "forWhom2Desc",
  for_whom_3_title: "forWhom3Title",
  for_whom_3_desc: "forWhom3Desc",
  for_whom_4_title: "forWhom4Title",
  for_whom_4_desc: "forWhom4Desc",
  cta_badge: "ctaBadge",
  cta_title: "ctaTitle",
  cta_subtitle: "ctaSubtitle",
  cta_btn_text: "ctaBtn"
};

const getEmbedUrl = (url: string, autoPlay: boolean = false) => {
  if (!url) return "";
  const autoPlayParam = autoPlay ? "1" : "0";
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=${autoPlayParam}&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=${autoPlayParam}&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white`;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}?autoplay=${autoPlayParam}`;
  }
    return url;
};

const getYoutubeId = (url: string) => {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) return url.split("v=")[1]?.split("&")[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0];
  return null;
};

export default function Home() {
  const [lang, setLang] = useState<Language>("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [planes, setPlanes] = useState<any[]>([]);
  const [originalPlanes, setOriginalPlanes] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(defaultSpanishConfig);
  const [isHydrated, setIsHydrated] = useState(false);

  const [originalConfig, setOriginalConfig] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const plansContainerRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const divisaRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [divisaDropdownOpen, setDivisaDropdownOpen] = useState(false);

  const t = translations[lang] as any;

  const certs = config?.teacher_certs
    ? config.teacher_certs.split(",").map((c: string) => c.trim())
    : [t.teacherCert1, t.teacherCert2, t.teacherCert3];

  const skillsList = config?.teacher_skills
    ? config.teacher_skills.split(",").map((s: string) => s.trim())
    : [t.teacherSkill1, t.teacherSkill2, t.teacherSkill3, t.teacherSkill4, t.teacherSkill5];

  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const data = await res.json();
      if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      console.warn("MyMemory API rate limit alcanzado o inactivo. Usando texto por defecto.");
      return text;
    } catch (err) {
      console.warn("Error al conectar con MyMemory API. Usando texto por defecto.");
      return text;
    }
  };

  const parseMultilingualText = (text: string | null | undefined, targetLang: string = "es"): string => {
    if (!text) return "";
    const tLang = targetLang.toLowerCase();
    let extracted = "";

    if (text.includes("[:")) {
      const regex = new RegExp(`\\[:${tLang}\\]([\\s\\S]*?)(?=\\[:|$)/?`, "i");
      const match = text.match(regex);
      if (match && match[1] !== undefined) {
        extracted = match[1].trim();
      } else {
        const esMatch = text.match(/\[:es\]([\s\S]*?)(?=\[:|$)/i);
        extracted = esMatch && esMatch[1] !== undefined ? esMatch[1].trim() : "";
      }
    } else if (text.includes("[ES]") || text.includes("[FR]") || text.includes("[EN]")) {
      const regex = new RegExp(`\\[${tLang.toUpperCase()}\\]([\\s\\S]*?)(?=\\[[A-Z]{2}\\]|$)`, "i");
      const match = text.match(regex);
      if (match && match[1] !== undefined) {
        extracted = match[1].trim();
      } else {
        const esMatch = text.match(/\[ES\]([\s\S]*?)(?=\[[A-Z]{2}\]|$)/i);
        extracted = esMatch && esMatch[1] !== undefined ? esMatch[1].trim() : "";
      }
    } else {
      extracted = text.trim();
    }

    // Limpiar residuos de etiquetas cortas
    extracted = extracted.replace(/\[:?[a-z]{2}\]?/gi, "").trim();
    return extracted;
  };

  const translateConfigObject = async (sourceConfig: any, targetLang: string) => {
    if (!sourceConfig) return null;

    // Procesar todos los campos para decodificar shortcodes (incluso si está en español)
    const translatedConfig = { ...sourceConfig };
    const allTranslatableKeys = [
      "titulo_hero", "subtitulo_hero", "hero_badge",
      "meta_titulo", "meta_descripcion", "palabras_clave",
      "teacher_name", "teacher_title", "teacher_bio",
      "teacher_skills", "teacher_certs",
      "teacher_students", "teacher_countries", "teacher_experience",
      "ps_badge", "ps_title",
      "ps_prob_1_title", "ps_prob_1_desc", "ps_sol_1_title", "ps_sol_1_desc",
      "ps_prob_2_title", "ps_prob_2_desc", "ps_sol_2_title", "ps_sol_2_desc",
      "ps_prob_3_title", "ps_prob_3_desc", "ps_sol_3_title", "ps_sol_3_desc",
      "for_whom_badge", "for_whom_title",
      "for_whom_1_title", "for_whom_1_desc",
      "for_whom_2_title", "for_whom_2_desc",
      "for_whom_3_title", "for_whom_3_desc",
      "for_whom_4_title", "for_whom_4_desc",
      "cta_badge", "cta_title", "cta_subtitle", "cta_btn_text"
    ];

    // Decodificar etiquetas multilingües primero en cualquier idioma (incluido español)
    allTranslatableKeys.forEach(key => {
      const val = sourceConfig[key];
      if (val && (val.includes("[:") || val.includes("[ES]") || val.includes("[FR]") || val.includes("[EN]"))) {
        translatedConfig[key] = parseMultilingualText(val, targetLang);
      }
    });

    if (targetLang === "es") return translatedConfig;

    // Si es otro idioma y no tiene shortcodes, usar caché y traducción de MyMemory
    const configHash = Object.values(sourceConfig).join("").length;
    const cacheKey = `florentin_tr_v3_${targetLang}_${configHash}`;
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          return { ...translatedConfig, ...JSON.parse(cached) };
        } catch (e) {}
      }
    }

    setTranslating(true);

    try {
      const dict = translations[targetLang as Language] as any;
      const changedKeys: string[] = [];

      allTranslatableKeys.forEach(key => {
        const val = sourceConfig[key];
        // Si ya fue traducido por shortcode, no enviarlo a la API
        if (val && (val.includes("[:") || val.includes("[ES]") || val.includes("[FR]"))) {
          return;
        }

        const defaultVal = (defaultSpanishConfig as any)[key];
        const currentVal = sourceConfig[key];

        // Si el valor actual es igual al default en español, traducirlo localmente
        if (currentVal === defaultVal || !currentVal) {
          const dictKey = defaultKeysMap[key];
          if (dictKey === "heroTitleCombined") {
            translatedConfig[key] = dict.heroTitle1 + " " + dict.heroTitle2;
          } else if (dict[dictKey]) {
            translatedConfig[key] = dict[dictKey];
          }
        } else {
          // Ha cambiado y no tiene shortcodes: requiere traducción por API
          changedKeys.push(key);
        }
      });

      // Traducir las claves personalizadas que cambiaron y no tienen shortcodes
      if (changedKeys.length > 0) {
        const texts = changedKeys.map(k => String(sourceConfig[k]));
        const joined = texts.join(" [SEP999] ");
        try {
          const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(joined)}&langpair=es|${targetLang}`);
          const data = await res.json();
          if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
            const translated = data.responseData.translatedText;
            const parts = translated.split(/\s*\[SEP999\]\s*/i);
            changedKeys.forEach((key, idx) => {
              translatedConfig[key] = (parts[idx] || texts[idx]).trim();
            });
          }
        } catch (err) {
          console.warn("Fallo de API de traducción para textos personalizados del CMS, usando español");
        }
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(cacheKey, JSON.stringify(translatedConfig));
      }

      return translatedConfig;
    } catch (e) {
      console.warn("Error general al traducir config:", e);
      return translatedConfig;
    } finally {
      setTranslating(false);
    }
  };

  const planesStaticTranslations: Record<string, Record<string, string>> = {
    es: {
      "classe libre": "Clase individual",
      "classe d'un heure élaborée pour tout type d'objectifs": "Clase de una hora diseñada para todo tipo de objetivos.",
      "deux cours par semaine": "Dos clases por semana",
      "cours personnalisé d'une heure en fonction de vos objectifs": "Clase personalizada de una hora según tus objetivos.",
      "un cours par semana": "Una clase por semana",
      "un cours par semaine": "Una clase por semana",
      "trois cours par semaine": "Tres clases por semana",
      "4 cours par semaine": "4 clases por semana",
      "un curso por semana": "Una clase por semana",
      "dos clases por semana": "Dos clases por semana",
      "tres clases por semana": "Tres clases por semana",
      "4 clases por semana": "4 clases por semana",
      "clase individual": "Clase individual",
    },
    fr: {
      "clase individual": "Classe individuelle",
      "clase de una hora diseñada para todo tipo de objetivos": "Cours d'une heure conçu pour tout type d'objectifs.",
      "clase de una hora diseñada para todo tipo de objetivos.": "Cours d'une heure conçu pour tout type d'objectifs.",
      "dos clases por semana": "Deux cours par semaine",
      "clase personalizada de una hora según tus objetivos": "Cours personnalisé d'une heure en fonction de vos objectifs.",
      "clase personalizada de una hora según tus objetivos.": "Cours personnalisé d'une heure en fonction de vos objectifs.",
      "una clase por semana": "Un cours par semaine",
      "tres clases por semana": "Trois cours par semaine",
      "4 clases por semana": "4 cours par semaine",
      "un curso por semana": "Un cours par semaine",
      "un cours par semaine": "Un cours par semaine",
      "deux cours par semana": "Deux cours par semaine",
      "deux cours par semaine": "Deux cours par semaine",
      "trois cours par semaine": "Trois cours par semaine",
      "4 cours par semaine": "4 cours par semaine",
    },
    en: {
      "classe libre": "Individual class",
      "classe d'un heure élaborée pour tout type d'objectifs": "1-hour class tailored for all types of goals.",
      "deux cours par semaine": "Two classes per week",
      "cours personnalisé d'une heure en fonction de vos objectifs": "Personalized 1-hour class based on your goals.",
      "un cours par semaine": "One class per week",
      "trois cours par semaine": "Three classes per week",
      "4 cours par semaine": "4 classes per week",
      "un curso por semana": "One class per week",
      "dos clases por semana": "Two classes per week",
      "tres clases por semana": "Three classes per week",
      "4 clases por semana": "4 classes per week",
      "clase individual": "Individual class",
      "clase de una hora diseñada para todo tipo de objetivos.": "1-hour class tailored for all types of goals.",
      "clase personalizada de una hora según tus objetivos.": "Personalized 1-hour class based on your goals.",
    }
  };

  const translatePlanesObject = async (sourcePlanes: any[], targetLang: string) => {
    if (!sourcePlanes || sourcePlanes.length === 0) return sourcePlanes;

    try {
      const translatedPlanes = sourcePlanes.map(p => ({ ...p }));
      
      for (const p of translatedPlanes) {
        // Normalizar clave de búsqueda estática (sin puntos al final y en minúsculas)
        const nombreNormalized = (p.nombre || "").trim().toLowerCase().replace(/\.$/, "");
        const descNormalized = (p.descripcion || "").trim().toLowerCase().replace(/\.$/, "");

        // 1. Intentar traducción estática
        const staticDict = planesStaticTranslations[targetLang];
        let translatedNombre = staticDict?.[nombreNormalized];
        let translatedDesc = staticDict?.[descNormalized];

        // 2. Si no hay traducción estática, detectar idioma y usar API
        const textoAnalizar = ((p.nombre || "") + " " + (p.descripcion || "")).toLowerCase();
        const esFrances = textoAnalizar.includes("cours") || 
                           textoAnalizar.includes("semaine") || 
                           textoAnalizar.includes("forfait") || 
                           textoAnalizar.includes("leçon") || 
                           textoAnalizar.includes("apprendre") || 
                           textoAnalizar.includes("trois");
        
        const langOrigen = esFrances ? "fr" : "es";

        if (langOrigen !== targetLang) {
          if (!translatedNombre && p.nombre) {
            const cacheKey = `florentin_plan_name_${p.id}_${targetLang}`;
            let cached = sessionStorage.getItem(cacheKey);
            if (!cached) {
              cached = await translateText(p.nombre, langOrigen, targetLang);
              sessionStorage.setItem(cacheKey, cached);
            }
            translatedNombre = cached;
          }

          if (!translatedDesc && p.descripcion) {
            const cacheKey = `florentin_plan_desc_${p.id}_${targetLang}`;
            let cached = sessionStorage.getItem(cacheKey);
            if (!cached) {
              cached = await translateText(p.descripcion, langOrigen, targetLang);
              sessionStorage.setItem(cacheKey, cached);
            }
            translatedDesc = cached;
          }
        }

        // Asignar los valores traducidos
        if (translatedNombre) p.nombre = translatedNombre;
        if (translatedDesc) p.descripcion = translatedDesc;
      }

      return translatedPlanes;
    } catch (e) {
      console.error("Error al traducir planes:", e);
      return sourcePlanes;
    }
  };

  useEffect(() => {
    let activeLang: Language = "es";
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang) {
        setLang(savedLang);
        activeLang = savedLang;
        
        // Traducir localmente la configuración por defecto para evitar FOUC
        if (savedLang !== "es") {
          const dict = translations[savedLang] as any;
          const translated: Record<string, string> = { ...defaultSpanishConfig };
          Object.keys(defaultKeysMap).forEach(key => {
            const dictKey = defaultKeysMap[key];
            if (dictKey === "heroTitleCombined") {
              translated[key] = dict.heroTitle1 + " " + dict.heroTitle2;
            } else if (dict[dictKey]) {
              translated[key] = dict[dictKey];
            }
          });
          setConfig(translated);
        }
      }
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa) setDivisa(savedDivisa);
      setIsHydrated(true);
    }
    const fetchCMSData = async () => {
      try {
        const { data: planesData } = await supabase
          .from("planes_estudio")
          .select("id, nombre, descripcion, precio, total_clases, orden, recomendado")
          .eq("activo", true)
          .order("orden", { ascending: true })
          .order("precio", { ascending: true });
        if (planesData && planesData.length > 0) {
          setOriginalPlanes(planesData);
          if (activeLang !== "es") {
            const translatedPlanes = await translatePlanesObject(planesData, activeLang);
            setPlanes(translatedPlanes || planesData);
          } else {
            const translatedPlanes = await translatePlanesObject(planesData, "es");
            setPlanes(translatedPlanes || planesData);
          }
        }

        const { data: configData } = await supabase
          .from("configuracion_sitio")
          .select("*")
          .eq("id", 1)
          .single();
        if (configData) {
          setOriginalConfig(configData);
          const translated = await translateConfigObject(configData, activeLang);
          setConfig(translated || configData);
        }
      } catch (e) {
        console.error("Error al cargar CMS:", e);
      }
    };
    fetchCMSData();
  }, []);

  // Inyección dinámica de SEO (Metatags de Google)
  useEffect(() => {
    if (!config) return;

    // 1. Actualizar Título
    const seoTitle = parseMultilingualText(config.meta_titulo, lang) || "Florentin | Aprende Francés con un Experto Nativo";
    document.title = seoTitle;

    // 2. Actualizar Descripción Meta
    let metaDesc = document.querySelector('meta[name="description"]');
    const seoDesc = parseMultilingualText(config.meta_descripcion, lang) || "Clases particulares de francés con un profesor parisino nativo. Clases personalizadas, flexibles y adaptadas a tu nivel.";
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoDesc);

    // 3. Actualizar Palabras Clave
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const seoKeywords = parseMultilingualText(config.palabras_clave, lang) || "francés, clases de francés, profesor nativo francés, aprender francés, parisino";
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seoKeywords);
  }, [config]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (divisaRef.current && !divisaRef.current.contains(event.target as Node)) {
        setDivisaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, [planes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const changeLang = async (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("florentin_lang", newLang);
    if (originalConfig) {
      const translated = await translateConfigObject(originalConfig, newLang);
      if (translated) setConfig(translated);
    }
    if (originalPlanes.length > 0) {
      const translatedP = await translatePlanesObject(originalPlanes, newLang);
      if (translatedP) setPlanes(translatedP);
    }
  };
  const changeDivisa = (newDivisa: "eur" | "usd") => { setDivisa(newDivisa); localStorage.setItem("florentin_divisa", newDivisa); };

  const handleWelcomeConfirm = async (selectedLang: Language, selectedDivisa: "eur" | "usd") => {
    await changeLang(selectedLang);
    changeDivisa(selectedDivisa);
  };

  const formatPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      const precioConvertido = precioEur * 1.10;
      const tieneDecimales = precioConvertido % 1 !== 0;
      return new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD", 
        minimumFractionDigits: tieneDecimales ? 2 : 0,
        maximumFractionDigits: 2 
      }).format(precioConvertido);
    }
    const tieneDecimales = precioEur % 1 !== 0;
    return new Intl.NumberFormat("es-ES", { 
      style: "currency", 
      currency: "EUR", 
      minimumFractionDigits: tieneDecimales ? 2 : 0,
      maximumFractionDigits: 2 
    }).format(precioEur);
  };

  const whatsappUrl = `https://wa.me/${config?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33685744973'}?text=${encodeURIComponent(lang === 'es' ? 'Hola Florentin, quiero agendar mi clase de prueba gratuita.' : lang === 'fr' ? 'Bonjour Florentin, je voudrais réserver mon cours d\'essai gratuit.' : 'Hi Florentin, I want to book my free trial class.')}`;

  // GSAP Animations (Optimized for Mobile & Desktop)
  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. HERO ANIMATION (Page Load)
    const bgImg = containerRef.current.querySelector(".hero-bg-img");
    const heroTexts = containerRef.current.querySelectorAll(".hero-text");
    const heroBtns = containerRef.current.querySelectorAll(".hero-btn");

    if (bgImg) gsap.from(bgImg, { scale: 1.15, opacity: 0, duration: 2, ease: "power3.out" });
    if (heroTexts.length > 0) gsap.from(heroTexts, { y: 80, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power4.out" });
    if (heroBtns.length > 0) gsap.from(heroBtns, { y: 40, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });

    // GSAP MatchMedia for responsive animations
    const mm = gsap.matchMedia();

    // DESKTOP ANIMATIONS (>= 1024px)
    mm.add("(min-width: 1024px)", () => {
      // 2. PROBLEM-SOLUTION (Flow Stagger column by column)
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        const problemCards = section.querySelectorAll(".problem-card");
        const arrows = section.querySelectorAll(".arrow-icon");
        const solutionCards = section.querySelectorAll(".solution-card");

        if (problemCards.length > 0) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          });

          // Stagger problems in, then arrows, then solutions
          tl.from(problemCards, { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" })
            .from(arrows, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.3")
            .from(solutionCards, { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.3");
        }
      });

      // 3. FOR WHOM SECTION (Cards trigger individually for bulletproof load)
      gsap.utils.toArray<HTMLElement>(".forwhom-card").forEach((card) => {
        gsap.from(card, {
          y: 40,
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        });
      });
    });

    // MOBILE ANIMATIONS (< 1024px)
    mm.add("(max-width: 1023px)", () => {
      // Problem-Solution flow card-by-card when scrolled
      gsap.utils.toArray<HTMLElement>(".problem-solution-col").forEach((col) => {
        const pc = col.querySelector(".problem-card");
        const arrow = col.querySelector(".arrow-icon");
        const sc = col.querySelector(".solution-card");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: col,
            start: "top 92%",
            toggleActions: "play none none none"
          }
        });

        if (pc) tl.from(pc, { x: -30, opacity: 0, duration: 0.5, ease: "power2.out" });
        if (arrow) tl.from(arrow, { scale: 0, opacity: 0, duration: 0.3, ease: "back.out(1.5)" });
        if (sc) tl.from(sc, { x: 30, opacity: 0, duration: 0.5, ease: "power2.out" });
      });

      // For Whom Cards trigger individually when they enter mobile view
      gsap.utils.toArray<HTMLElement>(".forwhom-card").forEach((card) => {
        gsap.from(card, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        });
      });
    });

    // 4. GENERAL REVEAL ITEMS (FAQ, Profesor, Testimonials, CTA)
    gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((item) => {
      gsap.from(item, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 96%",
          toggleActions: "play none none none"
        },
      });
    });
  }, { scope: containerRef });

  const mobileNavLinks = [
    { href: "#teacher", label: t.navTeacher },
    { href: "#method", label: t.navMethod },
    { href: "#for-whom", label: lang === 'es' ? 'Para quién' : lang === 'fr' ? 'Pour qui' : 'For whom' },
    { href: "#plans", label: t.navPlans },
    { href: "#faq", label: t.navFaq },
    { href: "#contact", label: t.navContact },
  ];

  const faqItems = [
    { q: config?.faq_1_q || t.faq1Q, a: config?.faq_1_a || t.faq1A },
    { q: config?.faq_2_q || t.faq2Q, a: config?.faq_2_a || t.faq2A },
    { q: config?.faq_3_q || t.faq3Q, a: config?.faq_3_a || t.faq3A },
    { q: config?.faq_4_q || t.faq4Q, a: config?.faq_4_a || t.faq4A },
    { q: config?.faq_5_q || t.faq5Q, a: config?.faq_5_a || t.faq5A },
    { q: config?.faq_6_q || t.faq6Q, a: config?.faq_6_a || t.faq6A },
  ];

  const testimonials = [
    { name: t.testim1Name, country: t.testim1Country, text: t.testim1Text },
    { name: t.testim2Name, country: t.testim2Country, text: t.testim2Text },
    { name: t.testim3Name, country: t.testim3Country, text: t.testim3Text },
    { name: t.testim4Name, country: t.testim4Country, text: t.testim4Text },
  ];

  const renderFormattedTitle = (text: string) => {
    if (!text) return "";
    const regex = /\{([^}]+)\}/g;
    
    // Si no contiene llaves, pero tiene la palabra "Florentin", le inyectamos las llaves dinámicamente
    let processedText = text;
    if (!text.includes("{") && /Florentin/i.test(text)) {
      processedText = text.replace(/(Florentin)/i, "{$1}");
    }

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(processedText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processedText.substring(lastIndex, match.index));
      }
      
      const word = match[1];
      if (/Florentin/i.test(word)) {
        parts.push(
          <span key={match.index} className="font-script text-[#ef4444] font-normal lowercase tracking-wide text-5xl sm:text-7xl inline-block align-middle mx-2 select-none">
            Florentin
          </span>
        );
      } else {
        parts.push(
          <span key={match.index} className="text-[#0f4c81] font-serif font-bold italic">
            {word}
          </span>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < processedText.length) {
      parts.push(processedText.substring(lastIndex));
    }

    if (parts.length === 0) return text;
    return <>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</>;
  };

  return (
    <main ref={containerRef} className="overflow-x-clip w-full max-w-full bg-[#f8fafc] text-[#0c1b33] selection:bg-[#3b82f6]/20 selection:text-[#0c1b33] font-sans">
      {/* Datos Estructurados Schema.org JSON-LD para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Le Français avec Florentin",
            "url": "https://lefrancaisavecflorentin.com",
            "logo": "https://lefrancaisavecflorentin.com/icon.jpeg",
            "image": "https://lefrancaisavecflorentin.com/icon.jpeg",
            "description": "Aprende francés con clases personalizadas online 1 a 1 de la mano de Florentin, profesor nativo de París.",
            "provider": {
              "@type": "Person",
              "name": "Florentin",
              "jobTitle": "Profesor de Francés Nativo",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "París",
                "addressCountry": "FR"
              }
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "lowPrice": "0",
              "offerCount": "3"
            }
          })
        }}
      />

      {/* Estilos CSS Inyectados para efectos de Levitación y Auroras Boreales */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-medium {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-badge {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.01); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes aurora-gold-1 {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
          33% { transform: translate(40px, -40px) scale(1.15); opacity: 0.8; }
          66% { transform: translate(-20px, 30px) scale(0.95); opacity: 0.4; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
        }
        @keyframes aurora-gold-2 {
          0% { transform: translate(0px, 0px) scale(1.1); opacity: 0.4; }
          50% { transform: translate(-40px, 20px) scale(0.9); opacity: 0.7; }
          100% { transform: translate(0px, 0px) scale(1.1); opacity: 0.4; }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-badge {
          animation: float-badge 4s ease-in-out infinite;
        }
        .animate-aurora-1 {
          animation: aurora-gold-1 18s ease-in-out infinite;
        }
        .animate-aurora-2 {
          animation: aurora-gold-2 22s ease-in-out infinite;
        }
      `}} />

      {/* ═══════════════════════════════════════
          NAVBAR — Glass Pill Responsive
      ═══════════════════════════════════════ */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[90%] max-w-5xl rounded-full bg-white/85 shadow-md backdrop-blur-xl border border-black/5 px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 text-[#0c1b33]">
        <Link href="/" className="flex items-center md:justify-self-start">
          <div className="relative w-40 h-12 sm:w-56 sm:h-16 hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logo.png" 
              alt="Logo Florentin" 
              fill
              sizes="(max-width: 640px) 160px, 224px"
              className="object-contain object-left"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="logo-fallback hidden w-full h-full text-slate-800 font-black text-sm items-center justify-start font-serif">FLORENTIN</div>
          </div>
        </Link>
        <div className="hidden md:flex gap-5 lg:gap-7 text-sm font-semibold text-slate-600 md:justify-self-center items-center">
          {/* Dropdown El Curso */}
          <div className="relative group py-2 flex items-center">
            <button className="flex items-center gap-1 hover:text-[#0c1b33] transition-colors cursor-pointer select-none">
              {lang === 'es' ? 'El Curso' : lang === 'fr' ? 'Le Cours' : 'The Course'}
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180 text-slate-400" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-48 bg-white border border-slate-200/80 rounded-2xl shadow-lg py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
              <a href="#teacher" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">{t.navTeacher}</a>
              <a href="#method" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">{t.navMethod}</a>
              <a href="#for-whom" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">{lang === 'es' ? 'Para quién' : lang === 'fr' ? 'Pour qui' : 'For whom'}</a>
            </div>
          </div>

          <a href="#plans" className="hover:text-[#0c1b33] transition-colors whitespace-nowrap">{t.navPlans}</a>
          <a href="#faq" className="hover:text-[#0c1b33] transition-colors whitespace-nowrap">{t.navFaq}</a>
          <a href="#contact" className="hover:text-[#0c1b33] transition-colors whitespace-nowrap">{t.navContact}</a>
        </div>
        <div className="hidden md:flex gap-3 items-center md:justify-self-end">
          {translating && (
            <div className="flex items-center gap-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider animate-pulse transition-opacity duration-300">
              ⚡ {lang === "es" ? "TRADUCIENDO..." : lang === "fr" ? "TRADUCTION..." : "TRANSLATING..."}
            </div>
          )}
          
          {/* Dropdown de Idioma */}
          <div ref={langRef} className="relative flex items-center">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 text-xs font-bold transition-all"
            >
              <Globe2 size={14} className="text-slate-500 shrink-0" /> {lang.toUpperCase()} <ChevronDown size={12} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-28 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                {(["es", "fr", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLang(l);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${lang === l ? 'text-[#3b82f6] bg-[#3b82f6]/5' : 'text-slate-700'}`}
                  >
                    {l === 'es' ? 'Español' : l === 'fr' ? 'Français' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-black/10" />

          {/* Dropdown de Divisa */}
          <div ref={divisaRef} className="relative flex items-center">
            <button 
              onClick={() => setDivisaDropdownOpen(!divisaDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 text-xs font-bold transition-all"
            >
              <Coins size={14} className="text-slate-500 shrink-0" /> {divisa.toUpperCase()} <ChevronDown size={12} className={`transition-transform duration-200 ${divisaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {divisaDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-24 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                {(["eur", "usd"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      changeDivisa(d);
                      setDivisaDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${divisa === d ? 'text-[#3b82f6] bg-[#3b82f6]/5' : 'text-slate-700'}`}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/alumno" className="bg-[#0c1b33] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-300">{t.navLogin}</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-700 hover:text-black" aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-[#f8fafc]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-6 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-5 text-2xl font-bold text-slate-800">
          {mobileNavLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33] transition-colors">{link.label}</a>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex gap-2 text-sm font-bold">
            {(["es", "fr", "en"] as Language[]).map((l) => (
              <button key={l} onClick={() => changeLang(l)} className={`px-4 py-2 rounded-full transition-colors ${lang === l ? "bg-[#3b82f6]/15 text-[#3b82f6]" : "bg-black/5 text-slate-600"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="flex gap-2 text-sm font-bold">
            {(["eur", "usd"] as const).map((d) => (
              <button key={d} onClick={() => changeDivisa(d)} className={`px-4 py-2 rounded-full transition-colors ${divisa === d ? "bg-[#3b82f6]/15 text-[#3b82f6]" : "bg-black/5 text-slate-600"}`}>{d.toUpperCase()}</button>
            ))}
          </div>
          <Link href="/alumno" onClick={() => setMenuOpen(false)} className="mt-2 bg-[#0c1b33] text-white px-8 py-3 rounded-full text-lg font-bold shadow-md hover:bg-[#0c1b33]/90">{t.navLogin}</Link>
          {translating && (
            <div className="flex items-center gap-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider animate-pulse transition-opacity duration-300">
              ⚡ {lang === "es" ? "TRADUCIENDO..." : lang === "fr" ? "TRADUCTION..." : "TRANSLATING..."}
            </div>
          )}
        </div>
      </div>


      {/* ═══════════════════════════════════════
          1. HERO — Enganche prueba gratuita
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,rgba(248,250,252,1)_80%)] z-10" />
          <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" alt="Paris" className="hero-bg-img w-full h-full object-cover opacity-10 mix-blend-overlay scale-105" />
        </div>
        <div className="relative z-20 text-center max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="hero-text text-[clamp(2.5rem,7.5vw,6.5rem)] font-black leading-[0.92] tracking-tighter text-[#0c1b33] mb-6 sm:mb-8 font-serif">
            {renderFormattedTitle(config?.titulo_hero || (t.heroTitle1 + " " + t.heroTitle2))}
          </h1>
          <p className="hero-text text-base sm:text-lg md:text-xl font-semibold text-slate-500 max-w-2xl mb-10 px-2 leading-relaxed">
            {config?.subtitulo_hero || t.heroSubtitle}
          </p>
          <div className="hero-btn flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#0c1b33] hover:bg-[#152e54] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-lg shadow-[#0c1b33]/15">
              {lang === 'es' ? 'Agendar clase de francés gratis por WhatsApp' : lang === 'fr' ? 'Réserver un cours de français gratuit via WhatsApp' : 'Book a free French class via WhatsApp'} <ArrowRight size={20} />
            </a>
            <a href="#plans" className="bg-white/70 backdrop-blur-sm hover:bg-white text-slate-700 border border-slate-200 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-sm">
              {lang === 'es' ? 'Ver planes y precios de clases de francés' : lang === 'fr' ? 'Voir nos formules et tarifs de cours' : 'View our class plans and pricing'}
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          2. TU PROFESOR — Florentin
      ═══════════════════════════════════════ */}
      <section id="teacher" className="reveal-section py-20 sm:py-28 px-4 sm:px-6 bg-white relative">
        {/* Auroras de la Bandera de Francia de Fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 left-1/4 w-[400px] sm:w-[600px] h-[300px] sm:h-[450px] bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)] rounded-full blur-[80px] sm:blur-[140px] animate-aurora-1" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] sm:w-[600px] h-[300px] sm:h-[450px] bg-[radial-gradient(circle,rgba(239,68,68,0.03)_0%,transparent_70%)] rounded-full blur-[80px] sm:blur-[140px] animate-aurora-2" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {(() => {
            const badgeText = config ? parseMultilingualText(config.teacher_badge, lang) : t.teacherBadge;
            if (config?.mostrar_teacher_badge === false || !badgeText) return null;
            return (
              <div className="text-center mb-12 sm:mb-16">
                <span className="reveal-item inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[3px] uppercase bg-[#3b82f6]/8 text-[#0055a5] border border-[#3b82f6]/20 shadow-xs">
                  {badgeText}
                </span>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 relative items-start">
            {/* Columna Izquierda: Sticky Grid Item */}
            <div 
              className="lg:col-span-5 w-full flex flex-col items-center gap-8 lg:sticky lg:top-[120px] lg:self-start transition-all duration-300"
              style={{ position: "sticky", top: "120px", alignSelf: "flex-start" }}
            >
              {/* Photo */}
              <div className="relative flex justify-center w-full">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] h-auto rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl animate-float-slow hover:shadow-2xl transition-all duration-500">
                  <Image src="/perfilfoto.jpeg" alt="Profesor Florentin" fill className="object-cover" sizes="(max-width: 640px) 300px, 380px" priority />
                </div>
                {/* Floating badges */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20 w-[95%] sm:w-auto justify-center">
                  {[
                    { icon: <Users size={15} />, text: config?.teacher_students || t.teacherStudents },
                    { icon: <Globe2 size={15} />, text: config?.teacher_countries || t.teacherCountries },
                    { icon: <Clock size={15} />, text: config?.teacher_experience || t.teacherExperience },
                  ].map((badge, i) => (
                    <div 
                      key={i} 
                      className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-700 shadow-md transition-all duration-300 hover:border-[#3b82f6]/40 hover:bg-slate-50 cursor-default"
                    >
                      <span className="text-[#0055a5]">{badge.icon}</span>{badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Bio, Habilidades y Nueva Estructura de Certificaciones */}
            <div className="lg:col-span-7 w-full flex flex-col gap-7">
              {/* Título y Bio */}
              <div>
                <h3 className="text-[#0055a5] font-bold text-lg sm:text-xl mb-4 leading-snug">
                  {config?.teacher_title || t.teacherTitle}
                </h3>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 font-normal" style={{ whiteSpace: "pre-line" }}>
                  {config?.teacher_bio || t.teacherBio}
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="font-script text-[#ef4444] text-4xl sm:text-5xl select-none tracking-wide transform -rotate-3 block pr-4">
                    Florentin
                  </span>
                </div>
              </div>

              {/* Habilidades */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">
                  {lang === 'es' ? 'HABILIDADES' : lang === 'fr' ? 'COMPÉTENCES' : 'SKILLS'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill: string, i: number) => {
                    const icons = [
                      <Headphones size={13} key="1" />,
                      <Globe2 size={13} key="2" />,
                      <BookOpen size={13} key="3" />,
                      <BadgeCheck size={13} key="4" />,
                      <Building2 size={13} key="5" />
                    ];
                    return (
                      <span 
                        key={i} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-full text-xs font-bold text-[#1d4ed8] hover:bg-[#dbeafe] transition-all duration-300 cursor-default"
                      >
                        {icons[i % icons.length]} {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Nueva Estructura: Formación y Certificaciones */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3.5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t.teacherCertsSectionTitle || (lang === 'es' ? 'FORMACIÓN Y CERTIFICACIONES' : lang === 'fr' ? 'FORMATION ET CERTIFICATIONS' : 'EDUCATION & CERTIFICATIONS')}
                  </h4>
                </div>

                {/* Tarjeta 1: Máster (Destacada con borde azul) */}
                <div className="bg-white border-2 border-[#93c5fd] rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#dbeafe] text-[#2563eb] flex items-center justify-center shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h5 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {t.teacherMasterTitle || (lang === 'es' ? 'Máster en docencia y formación' : lang === 'fr' ? 'Master en enseignement et formation' : 'Master in Teaching and Training')}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                        {t.teacherMasterDesc || (lang === 'es' ? 'Especialización en pedagogía y enseñanza' : lang === 'fr' ? 'Spécialisation en pédagogie et enseignement' : 'Specialization in pedagogy and teaching')}
                      </p>
                    </div>
                  </div>
                  <div className="self-end sm:self-center shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] text-xs font-bold rounded-full shadow-2xs">
                      <CheckCircle2 size={13} className="text-[#16a34a]" /> {t.verified || (lang === 'es' ? 'Verificado' : lang === 'fr' ? 'Vérifié' : 'Verified')}
                    </span>
                  </div>
                </div>

                {/* Grid 2 Columnas: Licenciatura y Pedagogía */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {/* Tarjeta 2: Licenciatura */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#93c5fd] transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055a5] flex items-center justify-center mb-3">
                        <Landmark size={18} />
                      </div>
                      <h5 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {t.teacherLicTitle || (lang === 'es' ? 'Licenciatura en historia y ciencias políticas' : lang === 'fr' ? 'Licence en histoire et sciences politiques' : 'Bachelor in History and Political Science')}
                      </h5>
                      <p className="text-xs text-slate-500 font-medium mt-1.5">
                        {t.teacherLicDesc || (lang === 'es' ? 'Título universitario' : lang === 'fr' ? 'Diplôme universitaire' : 'University degree')}
                      </p>
                    </div>
                  </div>

                  {/* Tarjeta 3: Pedagogía de lenguas */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#93c5fd] transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0055a5] flex items-center justify-center mb-3">
                        <Languages size={18} />
                      </div>
                      <h5 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {t.teacherPedagogyTitle || (lang === 'es' ? 'Pedagogía de lenguas' : lang === 'fr' ? 'Pédagogie des langues' : 'Language pedagogy')}
                      </h5>
                      <p className="text-xs text-slate-500 font-medium mt-1.5">
                        {t.teacherPedagogyDesc || (lang === 'es' ? 'Formación especializada' : lang === 'fr' ? 'Formation spécialisée' : 'Specialized training')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tarjeta 4: DELE C1 español */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 px-4 sm:px-5 shadow-xs flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-blue-50 text-[#0055a5] flex items-center justify-center shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {t.teacherDeleTitle || (lang === 'es' ? 'DELE C1 — español' : lang === 'fr' ? 'DELE C1 — espagnol' : 'DELE C1 — Spanish')}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      {t.teacherDeleDesc || (lang === 'es' ? 'Te explico en tu idioma sin problema' : lang === 'fr' ? 'Je vous explique dans votre langue sans problème' : 'I explain in your language without problem')}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          2.5. SECCIÓN DE VIDEO PRESENTACIÓN INTERACTIVO
      ═══════════════════════════════════════ */}
      {config?.mostrar_seccion_video !== false && (
        <section id="video-demo" className="relative reveal-section py-20 sm:py-28 px-4 sm:px-6 bg-[#f8fafc] overflow-hidden border-y border-slate-200/80">
          {/* Fondo Estilo Tranqui / Pastel - Más Azul */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-4xl aspect-video bg-blue-400/30 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-300/25 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-300/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Video Container con Facade */}
            <div className="reveal-item relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.15)] bg-slate-900 border border-slate-200/80 group cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
              {config?.video_url ? (
                isVideoPlaying ? (
                  <iframe
                    src={getEmbedUrl(config.video_url, true)}
                    title="Video de Presentación"
                    className="w-full h-full border-0 absolute top-0 left-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {/* Imagen de fondo (Miniatura de YouTube o fallback) */}
                    <img 
                      src={getYoutubeId(config.video_url) ? `https://img.youtube.com/vi/${getYoutubeId(config.video_url)}/maxresdefault.jpg` : "/perfect_hero_image.png"} 
                      alt="Miniatura del video" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Capa oscura (Gradiente para leer el texto) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>
                    
                    {/* Contenido de la portada (Textos sin botón azul) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 transition-all duration-300">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 drop-shadow-md">Descubre mi método</h3>
                      <p className="text-sm sm:text-base font-medium text-slate-200 drop-shadow flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                        <PlayCircle size={18} className="text-white" /> Haz clic para ver mi presentación
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                    <PlayCircle size={40} className="text-slate-500 ml-1" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-slate-400">Sin video configurado</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════
          3. PROBLEMA → SOLUCIÓN (Método)
      ═══════════════════════════════════════ */}
      <section id="method" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            {(() => {
              const badgeText = config ? parseMultilingualText(config.ps_badge, lang) : t.psBadge;
              if (config?.mostrar_ps_badge === false || !badgeText) return null;
              return (
                <span className="reveal-item inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[4px] uppercase bg-[#3b82f6]/8 text-[#3b82f6] border border-[#3b82f6]/18 mb-6 shadow-sm">
                  {badgeText}
                </span>
              );
            })()}
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              {config?.ps_title || t.psTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: <XCircle className="text-red-500" size={28} />, 
                prob: config?.ps_prob_1_title || t.psProblem1, 
                probD: config?.ps_prob_1_desc || t.psProblemDesc1, 
                solIcon: <MessageCircle className="text-emerald-600" size={28} />, 
                sol: config?.ps_sol_1_title || t.psSolution1, 
                solD: config?.ps_sol_1_desc || t.psSolutionDesc1 
              },
              { 
                icon: <XCircle className="text-red-500" size={28} />, 
                prob: config?.ps_prob_2_title || t.psProblem2, 
                probD: config?.ps_prob_2_desc || t.psProblemDesc2, 
                solIcon: <CheckCircle className="text-emerald-600" size={28} />, 
                sol: config?.ps_sol_2_title || t.psSolution2, 
                solD: config?.ps_sol_2_desc || t.psSolutionDesc2 
              },
              { 
                icon: <XCircle className="text-red-500" size={28} />, 
                prob: config?.ps_prob_3_title || t.psProblem3, 
                probD: config?.ps_prob_3_desc || t.psProblemDesc3, 
                solIcon: <CalendarCheck className="text-emerald-600" size={28} />, 
                sol: config?.ps_sol_3_title || t.psSolution3, 
                solD: config?.ps_sol_3_desc || t.psSolutionDesc3 
              },
            ].map((item, idx) => (
              <div key={idx} className="problem-solution-col flex flex-col gap-5">
                {/* Problem */}
                <div className="problem-card bg-red-50 border border-red-100 rounded-2xl p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">{item.icon}<h3 className="font-bold text-lg text-red-700">{item.prob}</h3></div>
                  <p className="text-black/60 text-sm leading-relaxed">{item.probD}</p>
                </div>
                {/* Arrow */}
                <div className="arrow-icon flex justify-center"><ArrowRight className="text-[#c99a3c] rotate-90" size={24} /></div>
                {/* Solution */}
                <div className="solution-card bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">{item.solIcon}<h3 className="font-bold text-lg text-emerald-700">{item.sol}</h3></div>
                  <p className="text-black/60 text-sm leading-relaxed">{item.solD}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          4. PARA QUIÉN
      ═══════════════════════════════════════ */}
      <section id="for-whom" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[4px] uppercase bg-[#3b82f6]/8 text-[#3b82f6] border border-[#3b82f6]/18 mb-6 shadow-sm">
              {config?.for_whom_badge || t.forWhomBadge}
            </span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#0c1b33] font-serif">
              {config?.for_whom_title || t.forWhomTitle}
            </h2>
          </div>
          <div className="forwhom-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { icon: <Plane size={32} />, title: config?.for_whom_1_title || t.forWhom1Title, desc: config?.for_whom_1_desc || t.forWhom1Desc },
              { icon: <Briefcase size={32} />, title: config?.for_whom_2_title || t.forWhom2Title, desc: config?.for_whom_2_desc || t.forWhom2Desc },
              { icon: <Heart size={32} />, title: config?.for_whom_3_title || t.forWhom3Title, desc: config?.for_whom_3_desc || t.forWhom3Desc },
              { icon: <Rocket size={32} />, title: config?.for_whom_4_title || t.forWhom4Title, desc: config?.for_whom_4_desc || t.forWhom4Desc },
            ].map((item, idx) => (
              <div key={idx} className="forwhom-card group bg-white border border-slate-200/80 rounded-2xl p-7 sm:p-8 hover:border-[#3b82f6]/30 hover:shadow-md hover:scale-[1.02] transition-all duration-500 cursor-default shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/8 group-hover:bg-[#3b82f6]/15 flex items-center justify-center text-[#3b82f6] mb-5 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#0c1b33] transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          5. PLANES — Carrusel & Tarjetas V2 Réplica
      ═══════════════════════════════════════ */}
      <section id="plans" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <span className="reveal-item inline-block text-xs sm:text-sm font-extrabold text-[#0055a5] tracking-[0.1em] uppercase mb-3">
                • {lang === 'es' ? 'NUESTROS PLANES DE ESTUDIO' : lang === 'fr' ? 'NOS FORMULES D\'ÉTUDE' : 'OUR STUDY PLANS'}
              </span>
              <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] font-serif">
                {lang === 'es' ? 'Explora los planes' : lang === 'fr' ? 'Explorez Nos Formules' : 'Explore Our Plans'}
              </h2>
            </div>

            {/* Selector de divisa EUR / USD */}
            <div className="reveal-item flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-full border border-slate-200">
              {(["eur", "usd"] as const).map((d) => (
                <button 
                  key={d} 
                  onClick={() => changeDivisa(d)} 
                  className={`px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${divisa === d ? "bg-[#0055a5] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Tarjetas de Planes V2 con Imágenes y Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
            
            {/* 💎 Planes Dinámicos desde Supabase (Gestionables desde el Admin) */}
            {planes.map((plan, idx) => {
              const isFreePlan = Number(plan.precio) === 0 || plan.tipo === 'clase_gratis';
              const featuresList = plan.caracteristicas 
                ? plan.caracteristicas.split('\n').filter((f: string) => f.trim().length > 0)
                : [];

              const getUniquePlanImage = (name: string, isFree: boolean, i: number) => {
                const n = (name || "").toLowerCase();
                if (isFree || n.includes('prueba')) return '/teacher_hero.png';
                if (n.includes('libre')) return '/photo_libre.png';
                if (n.includes('4')) return '/photo_pack_4.png';
                if (n.includes('8')) return '/photo_pack_8.png';
                if (n.includes('3') || n.includes('semana')) return '/photo_intensive_3.png';
                if (n.includes('preply')) return '/photo_preply.png';
                if (n.includes('alexandra')) return '/photo_alexandra.png';
                if (n.includes('eugenia')) return '/photo_eugenia.png';
                if (n.includes('erick')) return '/photo_erick.png';
                
                const fallbacks = ['/photo_pack_8.png', '/photo_intensive_3.png', '/photo_libre.png', '/photo_pack_4.png'];
                return fallbacks[i % fallbacks.length];
              };

              const planImgSrc = plan.imagen_url || getUniquePlanImage(plan.nombre, isFreePlan, idx);

              return (
                <div 
                  key={plan.id || idx} 
                  className={`reveal-item rounded-[24px] overflow-hidden bg-white flex flex-col justify-between relative transition-all hover:scale-[1.02] ${
                    isFreePlan
                      ? 'border-2 border-[#10b981] shadow-lg shadow-[#10b981]/10'
                      : plan.recomendado 
                        ? 'border-2 border-[#0055a5] shadow-xl shadow-[#0055a5]/10' 
                        : 'border border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="relative h-[190px] w-full">
                      <Image 
                        src={planImgSrc} 
                        alt={plan.nombre} 
                        fill 
                        className="object-cover" 
                      />
                      <span className={`absolute top-3 left-3 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 ${
                        isFreePlan 
                          ? 'bg-[#10b981] text-white' 
                          : plan.recomendado
                            ? 'bg-[#0055a5] text-white border border-[#0055a5] shadow-blue-500/20'
                            : 'bg-white text-slate-800 border border-slate-100'
                      }`}>
                        {isFreePlan 
                          ? '⭐ GRATIS' 
                          : plan.recomendado 
                            ? '🇫🇷 Recomendado' 
                            : (plan.badge && plan.badge !== 'FR Más Popular' && plan.badge !== 'Más Popular' ? plan.badge : 'Flexible')}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2 leading-snug">
                        {plan.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-4">
                        {plan.descripcion}
                      </p>
                      <p className={`text-xs font-bold mb-4 ${isFreePlan ? 'text-[#10b981]' : 'text-[#0055a5]'}`}>
                        {plan.nivel || 'Todos los Niveles'} • {plan.duracion || (plan.total_clases > 0 ? `${plan.total_clases} ${t.planClasses}` : '1 Sesión')}
                      </p>

                      {featuresList.length > 0 && (
                        <ul className="space-y-2.5 pt-3 border-t border-slate-100">
                          {featuresList.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                              <CheckCircle size={14} className={isFreePlan ? "text-[#10b981] shrink-0" : "text-[#10b981] shrink-0"} />
                              <span>{feature.replace(/^[✓\s-]+/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                    <div>
                      <span className="text-2xl font-extrabold text-[#0f172a]">
                        {isFreePlan ? (lang === 'es' ? 'GRATIS' : lang === 'fr' ? 'GRATUIT' : 'FREE') : formatPrecio(plan.precio)}
                      </span>
                      {!isFreePlan && plan.total_clases > 0 && (
                        <span className="text-[11px] text-slate-400 font-medium block">/ {plan.total_clases} {t.planClasses}</span>
                      )}
                    </div>

                    {isFreePlan ? (
                      <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-extrabold transition-all shadow-md"
                      >
                        {lang === 'es' ? 'Agendar →' : lang === 'fr' ? 'Réserver →' : 'Book →'}
                      </a>
                    ) : (
                      <Link 
                        href="/alumno" 
                        className="px-5 py-2.5 rounded-xl bg-[#0055a5] hover:bg-[#003d7a] text-white text-xs font-extrabold transition-all shadow-md"
                      >
                        {lang === 'es' ? 'Elegir Plan →' : lang === 'fr' ? 'Choisir →' : 'Choose →'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          6. FAQ — Accordion
      ═══════════════════════════════════════ */}
      <section id="faq" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[4px] uppercase bg-[#3b82f6]/8 text-[#3b82f6] border border-[#3b82f6]/18 mb-6 shadow-sm">{t.faqBadge}</span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">{t.faqTitle}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, idx) => (
              <div key={idx} className="reveal-item border border-black/8 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-black/[0.02] transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg pr-4">{item.q}</span>
                  <ChevronDown size={20} className={`shrink-0 text-[#3b82f6] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-out ${openFaq === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-black/60 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          7. TESTIMONIOS — Experiencias de Alumnos
      ═══════════════════════════════════════ */}
      {config?.mostrar_testimonios !== false && (
      <section className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[4px] uppercase bg-[#3b82f6]/8 text-[#3b82f6] border border-[#3b82f6]/18 mb-6 shadow-sm">{t.testimBadge}</span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#0c1b33] font-serif">{t.testimTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="reveal-item bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 hover:border-[#3b82f6]/20 transition-all duration-500 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#ef4444] fill-[#ef4444]" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 italic font-medium">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6]/8 border border-[#3b82f6]/15 flex items-center justify-center text-[#3b82f6] font-bold text-sm">
                    {(item.name || "").charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.name || ""}</p>
                    <p className="text-slate-400 text-xs">{item.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}


      {/* ═══════════════════════════════════════
          8. CTA — WhatsApp (Glassmorphic Redesign)
      ═══════════════════════════════════════ */}
      <section id="contact" className="reveal-section py-24 sm:py-32 px-4 sm:px-6 bg-[#f1f5f9] relative overflow-hidden">
        {/* Radial Blue Glow behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="reveal-item max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-16 text-center relative z-10 shadow-lg">
          <span className="inline-block px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[4px] uppercase bg-[#3b82f6]/8 text-[#3b82f6] border border-[#3b82f6]/18 mb-6 shadow-sm">
            {config?.cta_badge || t.ctaBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#0c1b33] mb-6 font-serif">
            {config?.cta_title || t.ctaTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 font-semibold max-w-xl mx-auto mb-10 leading-relaxed">
            {config?.cta_subtitle || t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0c1b33] hover:bg-[#152e54] text-white px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-[#0c1b33]/15"
            >
              <Smartphone size={24} /> {config?.cta_btn_text || t.ctaBtn}
            </a>
          </div>
          <a href={`mailto:${config?.email_notificaciones || 'lefrancaisavecflorentin@outlook.com'}`} className="inline-block text-sm text-slate-400 hover:text-[#3b82f6] transition-colors mt-6 font-semibold">
            {t.ctaBtnAlt}
          </a>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          9. FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-16 border-t border-slate-200 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Columna 1: Marca & Contacto Principal */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <Link href="/" className="inline-block relative h-12 w-48 mb-1">
              <Image 
                src="/logo.png" 
                alt="Florentin French" 
                fill
                sizes="192px"
                className="object-contain object-left" 
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed md:pr-6">
              {lang === 'es' 
                ? 'Academia de francés en línea. Clases particulares y grupales adaptadas a tus objetivos, enfocadas en la conversación fluida.'
                : lang === 'fr'
                ? "Académie de français en ligne. Cours particuliers et en groupe adaptés à vos objectifs, axés sur la conversation fluide."
                : "Online French academy. Private and group classes tailored to your goals, focused on fluent conversation."
              }
            </p>

            {/* Contacto Directo: Email y Teléfono/WhatsApp */}
            <div className="flex flex-col gap-2.5 mt-2">
              <a 
                href={`mailto:${config?.email_notificaciones || 'lefrancaisavecflorentin@outlook.com'}`}
                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0055a5] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0055a5]/10 text-[#0055a5] flex items-center justify-center shrink-0">
                  <Mail size={13} />
                </div>
                <span className="truncate">{config?.email_notificaciones || 'lefrancaisavecflorentin@outlook.com'}</span>
              </a>

              <a 
                href={`https://wa.me/${(config?.whatsapp_number || '33685744973').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#10b981] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                  <Phone size={13} />
                </div>
                <span>
                  {config?.whatsapp_number 
                    ? (config.whatsapp_number.startsWith('+') ? config.whatsapp_number : `+${config.whatsapp_number}`)
                    : '+33 6 85 74 49 73'}
                </span>
              </a>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3 mt-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-[#0055a5] hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-[#e1306c] hover:text-white transition-all">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Columna 2: NAVEGACIÓN */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
              {lang === 'es' ? 'Navegación' : lang === 'fr' ? 'Navigation' : 'Navigation'}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
              <a href="#method" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Método' : lang === 'fr' ? 'Méthode' : 'Method'}
              </a>
              <a href="#teacher" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Profesor' : lang === 'fr' ? 'Professeur' : 'Teacher'}
              </a>
              <a href="#contact" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Contacto' : lang === 'fr' ? 'Contact' : 'Contact'}
              </a>
            </div>
          </div>

          {/* Columna 3: ACADEMIA */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
              {lang === 'es' ? 'Academia' : lang === 'fr' ? 'Académie' : 'Academy'}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
              <a href="#plans" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Planes' : lang === 'fr' ? 'Formules' : 'Plans'}
              </a>
              <a href="#faq" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Preguntas' : lang === 'fr' ? 'FAQ' : 'FAQ'}
              </a>
              <Link href="/alumno" className="hover:text-[#0c1b33] transition-colors">
                {lang === 'es' ? 'Portal Alumnos' : lang === 'fr' ? "Portail de l'Élève" : 'Student Portal'}
              </Link>
            </div>
          </div>

          {/* Columna 4: POLÍTICAS Y SOPORTE */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
              {lang === 'es' ? 'Políticas y Soporte' : lang === 'fr' ? 'Soutien et Politiques' : 'Policies & Support'}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
              <Link href="/privacidad" className="hover:text-[#0c1b33] transition-colors">{t.footerPrivacy}</Link>
              <Link href="/terminos" className="hover:text-[#0c1b33] transition-colors">{t.footerTerms}</Link>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#10b981] transition-colors"
              >
                {lang === 'es' ? 'Soporte en WhatsApp' : lang === 'fr' ? 'Support WhatsApp' : 'WhatsApp Support'}
              </a>
            </div>
          </div>
        </div>

        {/* Separador inferior */}
        <div className="max-w-6xl mx-auto border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {config?.site_name || "Florentin French"}. {t.footerRights}
          </div>
          <div className="text-center sm:text-right">
            <span>
              {lang === 'es' ? 'Plataforma SaaS operada por ' : lang === 'fr' ? 'Plateforme SaaS opérée par ' : 'SaaS Platform operated by '}
            </span>
            <a 
              href="https://introspectiva.digital/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#3b82f6] hover:text-[#2563eb] font-bold underline underline-offset-2 transition-colors"
            >
              Introspectiva Studio
            </a>
          </div>
        </div>
      </footer>


      {/* Botón flotante de WhatsApp superpuesto */}
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
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/85 leading-none">
            {lang === 'es' ? 'DISPONIBLE AHORA' : lang === 'fr' ? 'DISPONIBLE MAINTENANT' : 'AVAILABLE NOW'}
          </span>
          <span className="text-sm font-bold leading-tight">
            {lang === 'es' ? 'Asesoría Gratis' : lang === 'fr' ? 'Conseil Gratuit' : 'Free Consultation'}
          </span>
        </div>
      </a>

      {/* Botón flotante de Compartir (SEO & Redes Sociales) */}
      <div 
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px"
        }}
      >
        <div 
          className="share-menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "6px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            marginBottom: "2px"
          }}
        >
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Aprende francés con el profesor Florentin. Visita su plataforma oficial en: https://lefrancaisavecflorentin.com")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#25d366",
              textDecoration: "none",
              padding: "4px 8px",
              borderRadius: "6px"
            }}
            className="hover:bg-slate-50 transition-colors"
          >
            <span>💬 WhatsApp</span>
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://lefrancaisavecflorentin.com")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#1877f2",
              textDecoration: "none",
              padding: "4px 8px",
              borderRadius: "6px"
            }}
            className="hover:bg-slate-50 transition-colors"
          >
            <span>🔵 Facebook</span>
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.querySelector(".share-menu") as HTMLElement;
            if (el) el.style.display = el.style.display === "flex" ? "none" : "flex";
          }}
          style={{
            backgroundColor: "#ffffff",
            color: "#0c1b33",
            border: "1px solid #cbd5e1",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "transform 0.2s ease"
          }}
          className="hover:scale-105"
          title="Compartir"
        >
          🔗
        </button>
      </div>

      {/* Modal de Bienvenida para primera visita */}
      <WelcomeModal onConfirm={handleWelcomeConfirm} currentLang={lang} currentDivisa={divisa} />

    </main>
  );
}
