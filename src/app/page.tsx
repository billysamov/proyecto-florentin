"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Menu, X, ChevronDown,
  Plane, Briefcase, Heart, Rocket,
  XCircle, CheckCircle, Clock, MessageCircle, CalendarCheck,
  Award, Globe2, Users, Star, BadgeCheck, BookOpen, Headphones, Building2,
  Smartphone
} from "lucide-react";

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
  teacher_title: "Profesor Nativo de Francés | París, Francia",
  teacher_bio: "Soy Florentin, nacido y criado en París. Llevo más de 5 años enseñando francés a estudiantes de todo el mundo. Mi método se centra en la inmersión cultural y la conversación real, no en la memorización de reglas. Creo que aprender un idioma debe ser una experiencia emocionante, no una tarea aburrida.",
  teacher_experience: "+5 años",
  teacher_students: "+200 alumnos",
  teacher_countries: "+15 países",
  teacher_skills: "Pronunciación nativa, Cultura francesa, Gramática aplicada, Preparación DELF/DALF, Francés para negocios",
  teacher_certs: "Licenciatura en Lenguas Extranjeras, Certificación DALF C2, Formación en Pedagogía de Idiomas",
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
  ps_sol_3_desc: "Tú eliges el día y la hora. Clases por Google Meet desde donde estés, en tu zona horaria.",
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

export default function Home() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("florentin_lang") as Language) || "es";
    }
    return "es";
  });
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [planes, setPlanes] = useState<any[]>([]);

  // Inicializar síncronamente config traduciendo los defaults locales para evitar FOUC
  const [config, setConfig] = useState<any>(() => {
    const initialLang = typeof window !== "undefined" ? (localStorage.getItem("florentin_lang") || "es") : "es";
    if (initialLang === "es") return defaultSpanishConfig;

    // Traducir dinámicamente desde el diccionario estático local
    const dict = translations[initialLang as Language] as any;
    const translated: Record<string, string> = { ...defaultSpanishConfig };
    
    Object.keys(defaultKeysMap).forEach(key => {
      const dictKey = defaultKeysMap[key];
      if (dictKey === "heroTitleCombined") {
        translated[key] = dict.heroTitle1 + " " + dict.heroTitle2;
      } else if (dict[dictKey]) {
        translated[key] = dict[dictKey];
      }
    });
    return translated;
  });

  const [originalConfig, setOriginalConfig] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      throw new Error("Fallo en MyMemory API");
    } catch (err) {
      console.error("Error al traducir texto de base de datos:", err);
      return text;
    }
  };

  const translateConfigObject = async (sourceConfig: any, targetLang: string) => {
    if (!sourceConfig) return null;
    if (targetLang === "es") return sourceConfig;

    // Cache key basado en hash simple del contenido para invalidar al cambiar textos
    const configHash = Object.values(sourceConfig).join("").length;
    const cacheKey = `florentin_tr_v3_${targetLang}_${configHash}`;
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }

    setTranslating(true);

    try {
      const translatedConfig = { ...sourceConfig };

      // Lista COMPLETA de todas las claves traducibles del CMS
      const allTranslatableKeys = [
        "titulo_hero", "subtitulo_hero",
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

      // Filtrar solo claves que tienen valor en el config de la BD
      const keysWithValues = allTranslatableKeys.filter(k => sourceConfig[k] && String(sourceConfig[k]).trim());

      // Agrupar en lotes por límite de caracteres (~400 chars para respetar el límite de MyMemory)
      const MAX_CHARS_PER_BATCH = 400;
      const batches: string[][] = [];
      let currentBatch: string[] = [];
      let currentChars = 0;

      for (const key of keysWithValues) {
        const textLen = String(sourceConfig[key]).length + 10; // +10 para separador
        if (currentChars + textLen > MAX_CHARS_PER_BATCH && currentBatch.length > 0) {
          batches.push([...currentBatch]);
          currentBatch = [key];
          currentChars = textLen;
        } else {
          currentBatch.push(key);
          currentChars += textLen;
        }
      }
      if (currentBatch.length > 0) batches.push(currentBatch);

      // Traducir cada lote secuencialmente con pausas anti-rate-limit
      for (let i = 0; i < batches.length; i++) {
        const batchKeys = batches[i];
        const texts = batchKeys.map(k => String(sourceConfig[k]));
        const joined = texts.join(" [SEP999] ");

        try {
          const translated = await translateText(joined, "es", targetLang);
          const parts = translated.split(/\s*\[SEP999\]\s*/i);

          batchKeys.forEach((key, idx) => {
            translatedConfig[key] = (parts[idx] || texts[idx]).trim();
          });
        } catch (err) {
          console.warn(`Lote ${i} falló, manteniendo textos originales`);
        }

        // Pausa de 500ms entre lotes para evitar error 429
        if (i < batches.length - 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(cacheKey, JSON.stringify(translatedConfig));
      }

      return translatedConfig;
    } catch (e) {
      console.error("Error al traducir objeto de configuración:", e);
      return sourceConfig;
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    let activeLang: Language = "es";
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang) {
        setLang(savedLang);
        activeLang = savedLang;
      }
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa) setDivisa(savedDivisa);
    }
    const fetchCMSData = async () => {
      try {
        const { data: planesData } = await supabase
          .from("planes_estudio")
          .select("id, nombre, descripcion, precio, total_clases")
          .eq("activo", true)
          .order("id", { ascending: true });
        if (planesData && planesData.length > 0) setPlanes(planesData);

        const { data: configData } = await supabase
          .from("configuracion_sitio")
          .select("*")
          .eq("id", 1)
          .single();
        if (configData) {
          setOriginalConfig(configData);
          if (activeLang !== "es") {
            const translated = await translateConfigObject(configData, activeLang);
            setConfig(translated || configData);
          } else {
            setConfig(configData);
          }
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
    const seoTitle = config.meta_titulo || "Florentin | Aprende Francés con un Experto Nativo";
    document.title = seoTitle;

    // 2. Actualizar Descripción Meta
    let metaDesc = document.querySelector('meta[name="description"]');
    const seoDesc = config.meta_descripcion || "Clases particulares de francés con un profesor parisino nativo. Clases personalizadas, flexibles y adaptadas a tu nivel.";
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoDesc);

    // 3. Actualizar Palabras Clave
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const seoKeywords = config.palabras_clave || "francés, clases de francés, profesor nativo francés, aprender francés, parisino";
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
  };
  const changeDivisa = (newDivisa: "eur" | "usd") => { setDivisa(newDivisa); localStorage.setItem("florentin_divisa", newDivisa); };

  const formatPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      const precioConvertido = precioEur * 1.10;
      const tieneDecimales = precioConvertido % 1 !== 0;
      return new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD", 
        maximumFractionDigits: precioConvertido < 10 && tieneDecimales ? 2 : 0 
      }).format(precioConvertido);
    }
    return new Intl.NumberFormat("es-ES", { 
      style: "currency", 
      currency: "EUR", 
      maximumFractionDigits: precioEur < 10 && (precioEur % 1 !== 0) ? 2 : 0 
    }).format(precioEur);
  };

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34600000000'}?text=${encodeURIComponent(lang === 'es' ? 'Hola Florentin, quiero agendar mi clase de prueba gratuita.' : lang === 'fr' ? 'Bonjour Florentin, je voudrais réserver mon cours d\'essai gratuit.' : 'Hi Florentin, I want to book my free trial class.')}`;

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

  const navLinks = [
    { href: "#method", label: t.navMethod },
    { href: "#plans", label: t.navPlans },
    { href: "#teacher", label: t.navTeacher },
    { href: "#faq", label: t.navFaq },
    { href: "#contact", label: t.navContact },
  ];

  const faqItems = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
    { q: t.faq6Q, a: t.faq6A },
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
    
    // Si no contiene llaves {}, buscar palabras clave para mantener el diseño original coloreando la segunda mitad
    if (!text.includes("{")) {
      const parts = text.split(/(con un expert|con un parisi|con clases|con un native|con un nativ)/i);
      if (parts.length > 1) {
        return (
          <>
            {parts[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#ef4444] font-serif font-bold">{parts.slice(1).join("")}</span>
          </>
        );
      }
      return text;
    }

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#ef4444] font-serif font-bold">
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</>;
  };

  return (
    <main ref={containerRef} className="overflow-x-hidden w-full max-w-full bg-[#0a0a0c] text-white selection:bg-[#c99a3c] selection:text-white">
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
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[90%] max-w-5xl rounded-full bg-[#080c14]/90 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white overflow-hidden flex items-center justify-center border border-white/20">
            <Image 
              src="/logo.png" 
              alt="Logo Florentin" 
              fill
              sizes="(max-width: 640px) 32px, 36px"
              className="object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="logo-fallback hidden w-full h-full bg-[#080c14] text-white font-black text-xs items-center justify-center font-serif">F</div>
          </div>
          <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
            Le français <span className="font-script text-[#ef4444] font-normal text-lg sm:text-xl capitalize ml-1">avec</span> Florentin
          </span>
        </Link>
        <div className="hidden md:flex gap-5 lg:gap-7 text-sm font-medium text-white/70">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white transition-colors">{link.label}</a>
          ))}
        </div>
        <div className="hidden md:flex gap-3 items-center">
          {translating && (
            <div className="flex items-center gap-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider animate-pulse transition-opacity duration-300">
              ⚡ {lang === "es" ? "TRADUCIENDO..." : lang === "fr" ? "TRADUCTION..." : "TRANSLATING..."}
            </div>
          )}
          <div className="flex gap-1 text-xs font-bold">
            {(["es", "fr", "en"] as Language[]).map((l) => (
              <button key={l} onClick={() => changeLang(l)} className={`px-2.5 py-1.5 rounded transition-colors ${lang === l ? "bg-white/10 text-[#3b82f6]" : "text-white/50 hover:bg-white/5"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex gap-1 text-xs font-bold">
            {(["eur", "usd"] as const).map((d) => (
              <button key={d} onClick={() => changeDivisa(d)} className={`px-2.5 py-1.5 rounded transition-colors ${divisa === d ? "bg-white/10 text-[#3b82f6]" : "text-white/50 hover:bg-white/5"}`}>{d.toUpperCase()}</button>
            ))}
          </div>
          <Link href="/alumno" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-300">{t.navLogin}</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/80 hover:text-white" aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-[#0a0a0c]/98 backdrop-blur-2xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-6 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-5 text-2xl font-bold">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-white/70 hover:text-white transition-colors">{link.label}</a>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex gap-2 text-sm font-bold">
            {(["es", "fr", "en"] as Language[]).map((l) => (
              <button key={l} onClick={() => changeLang(l)} className={`px-4 py-2 rounded-full transition-colors ${lang === l ? "bg-[#c99a3c] text-black" : "bg-white/10 text-white/60"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="flex gap-2 text-sm font-bold">
            {(["eur", "usd"] as const).map((d) => (
              <button key={d} onClick={() => changeDivisa(d)} className={`px-4 py-2 rounded-full transition-colors ${divisa === d ? "bg-white text-black" : "bg-white/10 text-white/60"}`}>{d.toUpperCase()}</button>
            ))}
          </div>
          <Link href="/alumno" onClick={() => setMenuOpen(false)} className="mt-2 bg-white text-black px-8 py-3 rounded-full text-lg font-bold">{t.navLogin}</Link>
          {translating && (
            <div className="flex items-center gap-1 bg-[#c99a3c]/10 text-[#c99a3c] border border-[#c99a3c]/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider animate-pulse transition-opacity duration-300">
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,rgba(8,12,20,1)_70%)] z-10" />
          <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" alt="Paris" className="hero-bg-img w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105" />
        </div>
        <div className="relative z-20 text-center max-w-5xl mx-auto flex flex-col items-center">
          <span className="hero-text inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-white/5 border border-white/10 text-[#3b82f6] mb-8">{t.heroBadge}</span>
          <h1 className="hero-text text-[clamp(2.5rem,7.5vw,6.5rem)] font-black leading-[0.92] tracking-tighter text-white mb-6 sm:mb-8">
            {renderFormattedTitle(config?.titulo_hero || (t.heroTitle1 + " " + t.heroTitle2))}
          </h1>
          <p className="hero-text text-base sm:text-lg md:text-xl font-medium text-white/55 max-w-2xl mb-10 px-2">
            {config?.subtitulo_hero || t.heroSubtitle}
          </p>
          <div className="hero-btn flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105 shadow-lg shadow-[#3b82f6]/20">
              {t.heroBtn} <ArrowRight size={20} />
            </a>
            <a href="#plans" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:scale-105">
              {t.heroBtnSecondary}
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          2. PROBLEMA → SOLUCIÓN
      ═══════════════════════════════════════ */}
      <section id="method" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-5">
              {config?.ps_badge || t.psBadge}
            </span>
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
          3. PLANES — Prueba Gratis + De Pago
      ═══════════════════════════════════════ */}
      <section id="plans" className="reveal-section py-20 sm:py-32 md:py-40 px-4 sm:px-6 bg-[#080c14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-5">{t.plansBadge}</span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">{t.plansTitle}</h2>
            <p className="reveal-item text-white/50 text-base sm:text-lg max-w-xl mx-auto">{t.plansSubtitle}</p>
            <div className="reveal-item flex justify-center gap-3 mt-6">
              {(["eur", "usd"] as const).map((d) => (
                <button key={d} onClick={() => changeDivisa(d)} className={`px-5 py-2 rounded-full font-bold text-sm transition-colors ${divisa === d ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}>{d.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-6 sm:gap-8 ${planes.length > 0 ? `md:grid-cols-${Math.min(planes.length + 1, 4)}` : 'md:grid-cols-2'}`} style={{ gridTemplateColumns: `repeat(${Math.min((planes.length || 0) + 1, 4)}, minmax(0, 1fr))` }}>
            {/* Free Trial Card */}
            <div className="reveal-item p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between bg-gradient-to-br from-[#0f4c81] to-[#080c14] text-white relative overflow-hidden md:scale-[1.03] shadow-2xl shadow-[#3b82f6]/20 border border-[#3b82f6]/30">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white tracking-wider">
                {lang === 'es' ? '⭐ GRATIS' : lang === 'fr' ? '⭐ GRATUIT' : '⭐ FREE'}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black mb-2">{t.planFreeName}</h3>
                <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">{t.planFreePrice}</div>
                <p className="text-white/70 text-base font-medium mb-6">{t.planFreeDesc}</p>
                <ul className="space-y-3 mb-8">
                  {[t.planFreeDetail1, t.planFreeDetail2, t.planFreeDetail3].map((detail: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-white/80">
                      <CheckCircle size={18} className="text-[#3b82f6] shrink-0 mt-0.5" />{detail}
                    </li>
                  ))}
                </ul>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-4 sm:py-5 rounded-full text-center font-bold text-base sm:text-lg bg-white text-black hover:bg-white/90 transition-all hover:scale-105">
                {t.planFreeBtn}
              </a>
            </div>

            {/* Paid Plans from Supabase */}
            {planes.map((plan, idx) => (
              <div key={plan.id} className="reveal-item p-8 sm:p-10 rounded-2xl sm:rounded-[2rem] flex flex-col justify-between bg-[#0d1526]/50 backdrop-blur-md text-white border border-white/10 relative">
                {idx === 1 && (
                  <div className="absolute -top-0 right-4 px-3 py-1 bg-[#ef4444] rounded-b-lg text-xs font-bold text-white tracking-wider">{t.recommended}</div>
                )}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2">{plan.nombre}</h3>
                  <div className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">
                    {formatPrecio(plan.precio)}
                  </div>
                  <p className="text-white/40 text-sm font-medium mb-6">/ {plan.total_clases} {t.planClasses}</p>
                  <p className="text-white/60 text-base font-medium mb-8">{plan.descripcion}</p>
                </div>
                <Link href="/alumno" className="block w-full py-4 sm:py-5 rounded-full text-center font-bold text-base sm:text-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all hover:scale-105">
                  {t.planCta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          4. PARA QUIÉN
      ═══════════════════════════════════════ */}
      <section className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#c99a3c]/10 text-[#c99a3c] border border-[#c99a3c]/20 mb-5">
              {config?.for_whom_badge || t.forWhomBadge}
            </span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
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
              <div key={idx} className="forwhom-card group bg-[#fafafa] text-black border border-black/5 rounded-2xl p-7 sm:p-8 hover:bg-[#0a0a0c] hover:text-white hover:border-white/10 transition-all duration-500 cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#c99a3c]/10 group-hover:bg-[#c99a3c]/20 flex items-center justify-center text-[#c99a3c] mb-5 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-black group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-sm text-black/60 group-hover:text-white/70 leading-relaxed transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          5. TU PROFESOR — Florentin
      ═══════════════════════════════════════ */}
      <section id="teacher" className="reveal-section py-20 sm:py-32 md:py-40 px-4 sm:px-6 bg-[#080c14] relative overflow-hidden">
        {/* Auroras de la Bandera de Francia de Fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 left-1/4 w-[400px] sm:w-[600px] h-[300px] sm:h-[450px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] rounded-full blur-[80px] sm:blur-[140px] animate-aurora-1" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] sm:w-[600px] h-[300px] sm:h-[450px] bg-[radial-gradient(circle,rgba(239,68,68,0.08)_0%,transparent_70%)] rounded-full blur-[80px] sm:blur-[140px] animate-aurora-2" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-5">{t.teacherBadge}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            {/* Photo */}
            <div className="reveal-item relative flex justify-center">
              <div className="relative w-[280px] h-[350px] sm:w-[340px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-[#3b82f6]/30 shadow-2xl shadow-[#3b82f6]/10 animate-float-slow">
                <Image src="/florentin-profile.png" alt="Profesor Florentin" fill className="object-cover" sizes="(max-width: 640px) 280px, 340px" />
              </div>
              {/* Floating badges */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                {[
                  { icon: <Users size={16} />, text: config?.teacher_students || t.teacherStudents },
                  { icon: <Globe2 size={16} />, text: config?.teacher_countries || t.teacherCountries },
                  { icon: <Clock size={16} />, text: config?.teacher_experience || t.teacherExperience },
                ].map((badge, i) => (
                  <div 
                    key={i} 
                    className="bg-[#111115] border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-white/80 shadow-lg transition-all duration-300 hover:border-[#3b82f6]/40 hover:bg-[#1a1a1f]"
                  >
                    <span className="text-[#3b82f6]">{badge.icon}</span>{badge.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="reveal-item">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{config?.teacher_name || t.teacherName}</h2>
              <p className="text-[#3b82f6] font-semibold text-base sm:text-lg mb-6">{config?.teacher_title || t.teacherTitle}</p>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-8">{config?.teacher_bio || t.teacherBio}</p>

              {/* Certificates */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">{lang === 'es' ? 'Certificaciones' : lang === 'fr' ? 'Certifications' : 'Certifications'}</h4>
                <div className="flex flex-wrap gap-3">
                  {certs.map((cert: string, i: number) => (
                    <span 
                      key={i} 
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-all duration-300 hover:border-[#3b82f6]/30 cursor-default"
                    >
                      <Award size={16} className="text-[#3b82f6]" />{cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">{lang === 'es' ? 'Habilidades' : lang === 'fr' ? 'Compétences' : 'Skills'}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill: string, i: number) => {
                    const icons = [
                      <Headphones size={14} key="1" />,
                      <Globe2 size={14} key="2" />,
                      <BookOpen size={14} key="3" />,
                      <BadgeCheck size={14} key="4" />,
                      <Building2 size={14} key="5" />
                    ];
                    return (
                      <span 
                        key={i} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full text-xs font-bold text-[#3b82f6] hover:bg-[#3b82f6]/20 transition-all duration-300 cursor-default"
                      >
                        {icons[i % icons.length]} {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          6. FAQ — Accordion
      ═══════════════════════════════════════ */}
      <section id="faq" className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-5">{t.faqBadge}</span>
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
          7. TESTIMONIOS
      ═══════════════════════════════════════ */}
      <section className="reveal-section py-20 sm:py-32 px-4 sm:px-6 bg-[#080c14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-5">{t.testimBadge}</span>
            <h2 className="reveal-item text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">{t.testimTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="reveal-item bg-[#0d1526]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-[#3b82f6]/20 transition-colors duration-500">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#ef4444] fill-[#ef4444]" />
                  ))}
                </div>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 italic">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] font-bold text-sm">
                    {(item.name || "").charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.name || ""}</p>
                    <p className="text-white/40 text-xs">{item.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          8. CTA — WhatsApp (Glassmorphic Redesign)
      ═══════════════════════════════════════ */}
      <section id="contact" className="reveal-section py-24 sm:py-32 px-4 sm:px-6 bg-[#080c14] relative overflow-hidden">
        {/* Radial Blue Glow behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="reveal-item max-w-4xl mx-auto bg-[#0d1526]/70 border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-16 text-center relative z-10 shadow-2xl glow-gold">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-[3px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 mb-6">
            {config?.cta_badge || t.ctaBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            {config?.cta_title || t.ctaTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/65 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            {config?.cta_subtitle || t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer text-white px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl hover:shadow-[#25D366]/20"
            >
              <Smartphone size={24} /> {config?.cta_btn_text || t.ctaBtn}
            </a>
          </div>
          <a href="mailto:info@florentinfrench.com" className="inline-block text-sm text-white/40 hover:text-[#3b82f6] transition-colors mt-6 font-medium">
            {t.ctaBtnAlt}
          </a>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          9. FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-10 sm:py-14 border-t border-white/10 bg-[#0a0a0c] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-black text-2xl text-white tracking-tighter">FLORENTIN.</div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">{t.footerPrivacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footerTerms}</a>
          </div>
          <p className="text-white/30 text-xs sm:text-sm">{t.footerRights}</p>
        </div>
      </footer>

    </main>
  );
}
