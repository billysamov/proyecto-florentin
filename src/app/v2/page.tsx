"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";
import {
  Sparkles, ArrowRight, ArrowUpRight, Search, ShoppingBag, Check,
  Clock, BookOpen, MessageSquare, Compass, ShieldCheck, CheckCircle2,
  Users, Award, ChevronRight, ChevronLeft, Star, Globe2, Phone, Mail, MapPin, Heart,
  PlayCircle, Sparkle, Laptop, GraduationCap, Play
} from "lucide-react";
import HeroV2 from "@/components/HeroV2";

const getYoutubeId = (url: string) => {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) return url.split("v=")[1]?.split("&")[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0];
  return null;
};

export default function LandingV2Replica() {
  const [lang, setLang] = useState<Language>("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [config, setConfig] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await supabase.from("configuracion_sitio").select("*").eq("id", 1).single();
        if (data) setConfig(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadConfig();
  }, []);

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

  const t = translations[lang];

  const formatPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      return `$${Math.round(precioEur * 1.1)} USD`;
    }
    return `${precioEur} €`;
  };

  // Cursos / Planes del Proyecto Florentin con imágenes de alta calidad
  const todosLosCursos = [
    {
      id: "individual",
      categoria: "principiantes",
      title: "Clase Individual 1 a 1",
      desc: "50 minutos de clase particular enfocada en tu meta personal o dudas de gramática y pronunciación.",
      level: "Todos los Niveles",
      duration: "50 Minutos",
      precioEur: 15,
      img: "/course_french.png",
      flag: "🥐",
      badge: "Flexible"
    },
    {
      id: "semanal",
      categoria: "principiantes",
      title: "Plan Semanal (4 Clases)",
      desc: "1 clase por semana. El ritmo perfecto para avanzar de forma constante sin saturar tu agenda.",
      level: "A1 - A2 (Principiante)",
      duration: "4 Semanas",
      precioEur: 49,
      img: "/hero_student.png",
      flag: "🇫🇷",
      badge: "Más Popular"
    },
    {
      id: "intensivo",
      categoria: "intermedio",
      title: "Plan Intensivo (8 Clases)",
      desc: "2 clases por semana. Recomendado para quienes desean hablar con fluidez en 3 meses.",
      level: "B1 - B2 (Intermedio)",
      duration: "4 Semanas",
      precioEur: 89,
      img: "/video_student.png",
      flag: "🍷",
      badge: "Avanzado"
    },
    {
      id: "master",
      categoria: "avanzado",
      title: "Plan Máster & DELF/DALF (12 Clases)",
      desc: "3 clases por semana. Inmersión total conversacional y preparación oficial de exámenes.",
      level: "C1 - C2 (Avanzado / Examen)",
      duration: "4 Semanas",
      precioEur: 129,
      img: "/corporate_lessons.png",
      flag: "🎓",
      badge: "Certificación"
    }
  ];

  const cursosFiltrados = activeCategory === "todos"
    ? todosLosCursos
    : todosLosCursos.filter(c => c.categoria === activeCategory || c.id === activeCategory);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % cursosFiltrados.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + cursosFiltrados.length) % cursosFiltrados.length);
  };

  const banderasMarquee = [
    { flag: "🇫🇷", label: "Francés Nativo de París" },
    { icon: "🥐", label: "Pronunciación Auténtica" },
    { icon: "💼", label: "Francés para Negocios" },
    { icon: "✈️", label: "Francés para Viajes & Vida Diaria" },
    { icon: "🎓", label: "Exámenes DELF (A1-B2)" },
    { icon: "📜", label: "Exámenes DALF (C1-C2)" },
    { icon: "🍷", label: "Conversación & Cultura Parisina" }
  ];

  // Duplicamos el array para que el scroll del Marquee sea 100% perfecto y continuo sin saltos ni cortes
  const marqueeItemsPoblados = [...banderasMarquee, ...banderasMarquee, ...banderasMarquee];

  return (
    <div className="v2-container" style={{
      backgroundColor: "#ffffff",
      color: "#0f172a",
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: "antialiased",
      overflowX: "hidden",
      paddingTop: "76px" // Compensa la altura del header fijo
    }}>
      
      {/* 1. Header Navbar (Fijo, Limpio y Minimalista) */}
      <header id="sec-1-header" style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
        padding: "14px 24px",
        transition: "all 0.3s ease"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Florentin French"
              width={180}
              height={60}
              style={{ objectFit: "contain", maxHeight: "56px", width: "auto" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo_inicio.png";
              }}
            />
          </Link>

          {/* Menú de Navegación Simplificado */}
          <nav style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", fontWeight: 600, color: "#475569" }} className="hidden lg:flex">
            <a href="#profesor" className="hover:text-teal-900 transition-colors" style={{ textDecoration: "none" }}>Profesor</a>
            <a href="#metodo" className="hover:text-teal-900 transition-colors" style={{ textDecoration: "none" }}>Método</a>
            <a href="#planes" className="hover:text-teal-900 transition-colors" style={{ textDecoration: "none" }}>Planes</a>
            <a href="#testimonios" className="hover:text-teal-900 transition-colors" style={{ textDecoration: "none" }}>Reseñas</a>
          </nav>

          {/* Acciones y Selectores (Minimalistas) */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            
            {/* Controles simples sin bordes para limpiar visualmente */}
            <div className="hidden md:flex items-center gap-4 mr-2">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                style={{
                  backgroundColor: "transparent",
                  color: "#64748b",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>

              <select
                value={divisa}
                onChange={(e) => setDivisa(e.target.value as any)}
                style={{
                  backgroundColor: "transparent",
                  color: "#64748b",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="eur">EUR</option>
                <option value="usd">USD</option>
              </select>
            </div>

            <Link
              href="/alumno"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                textDecoration: "none"
              }}
              className="hidden sm:inline-block hover:text-teal-900 transition-colors"
            >
              Entrar
            </Link>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 20px",
                borderRadius: "100px",
                backgroundColor: "#111827",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "background 0.2s ease"
              }}
              className="hover:bg-teal-900"
            >
              Empezar
            </a>
          </div>

        </div>
      </header>

      {/* 2. Hero Section — Componente modular reutilizable */}
      <HeroV2
        title={parseMultilingualText(config?.titulo_hero, lang) || undefined}
        description={parseMultilingualText(config?.subtitulo_hero, lang) || undefined}
        heroImage={{ src: "/perfect_hero_image.png", alt: "Estudiante de francés sonriendo con un libro" }}
        progressImage={{ src: "/level_progress_v4.png", alt: "Gráfico de niveles de idioma A1 a C2" }}
        marqueeItems={marqueeItemsPoblados.map(item => ({ flag: item.flag || item.icon, label: item.label }))}
      />


      {/* 3. Cinta Azul Royal (4 Items Horizontal Checkmarks Réplica Exacta) */}
      <section id="sec-3-guarantees" style={{ backgroundColor: "#0066ff", color: "#ffffff", padding: "26px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", alignItems: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={18} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "#ffffff" }}>100% Profesor Nativo Parisino</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={18} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "#ffffff" }}>Reserva Flexible 24/7</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={18} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "#ffffff" }}>Enfoque Conversacional Real</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.18)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={18} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", color: "#ffffff" }}>Preparación DELF / DALF</span>
          </div>

        </div>
      </section>

      {/* 3.5. Nueva Sección de Video Presentación Interactivo (Ubicada entre Tu Profesor y Por Qué) */}
      {config?.mostrar_seccion_video !== false && (
        <section id="sec-3-5-video" style={{ padding: "140px 24px 100px", backgroundColor: "#f8fafc", position: "relative", overflow: "hidden" }}>
          {/* Fondo Estilo Tranqui / Pastel - Más Azul */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70%", maxWidth: "1000px", aspectRatio: "16/9", backgroundColor: "rgba(96, 165, 250, 0.3)", filter: "blur(120px)", borderRadius: "50%", pointerEvents: "none" }}></div>
          <div style={{ position: "absolute", top: "0%", right: "0%", width: "40%", height: "40%", backgroundColor: "rgba(147, 197, 253, 0.25)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }}></div>
          <div style={{ position: "absolute", bottom: "0%", left: "0%", width: "50%", height: "50%", backgroundColor: "rgba(94, 234, 212, 0.2)", filter: "blur(120px)", borderRadius: "50%", pointerEvents: "none" }}></div>

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", textAlign: "center", zIndex: 10 }}>
            {/* Reproductor de Video Embebido / Responsive Card con Facade */}
            <div 
              style={{
                position: "relative",
                width: "100%",
                margin: "0 auto",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
                backgroundColor: "#0f172a",
                border: "1px solid #e2e8f0",
                aspectRatio: "16 / 9",
                cursor: "pointer"
              }}
              onClick={() => setIsVideoPlaying(true)}
            >
              {config?.video_url ? (
                isVideoPlaying ? (
                  <iframe
                    src={getEmbedUrl(config.video_url, true)}
                    title="Video de Presentación"
                    style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div style={{ position: "relative", width: "100%", height: "100%" }} className="group">
                    {/* Imagen de fondo (Miniatura de YouTube o fallback) */}
                    <img 
                      src={getYoutubeId(config.video_url) ? `https://img.youtube.com/vi/${getYoutubeId(config.video_url)}/maxresdefault.jpg` : "/perfect_hero_image.png"} 
                      alt="Miniatura del video" 
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      loading="lazy"
                    />
                    {/* Capa oscura (Gradiente para leer el texto) */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.3) 100%)" }}></div>
                    
                    {/* Contenido de la portada (Textos sin botón azul) */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", padding: "24px", transition: "transform 0.3s ease" }}
                         onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                         onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <h3 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "12px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>Descubre mi método</h3>
                      <p style={{ fontSize: "17px", fontWeight: 500, color: "#f8fafc", textShadow: "0 1px 4px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <PlayCircle size={20} /> Haz clic para ver mi presentación
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #091021 0%, #1e293b 100%)", color: "#ffffff", padding: "40px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <PlayCircle size={32} color="#64748b" />
                  </div>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#94a3b8" }}>Sin video configurado</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. "Unlock the World with Language Learning" (4 Bento Cards Pastel) */}
      <section id="sec-4-bento" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "flex-end", marginBottom: "50px" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              {(() => {
                const badgeText = config ? parseMultilingualText(config.ps_badge, lang) : "¿POR QUÉ FLORENTIN?";
                if (config?.mostrar_ps_badge === false || !badgeText) return null;
                return (
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    • {badgeText}
                  </span>
                );
              })()}
              <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", margin: 0 }}>
                Desbloquea el Francés con un Método Inmersivo
              </h2>
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Aprende de un profesor nativo apasionado con clases interactivas diseñadas especialmente para tus objetivos personales y profesionales.
              </p>
            </div>
          </div>

          {/* 4 Bento Grid Cards con botón cuadrado azul en esquina */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            
            {/* Card 1 (Soft Blue) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#edf5ff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(0, 85, 165, 0.15)", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <MessageSquare size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Conversación Real</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Práctica conversacional activa en francés desde la primera sesión con situaciones reales de la vida cotidiana.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 2 (Soft Cyan) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#e0f7fa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(8, 145, 178, 0.15)", color: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>A Tu Propio Ritmo</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Opciones de horario 100% flexibles que se adaptan a tu rutina de trabajo y estilo de vida.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 3 (Soft Purple) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#f3e8ff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(124, 58, 237, 0.15)", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <BookOpen size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Material Didáctico Incluido</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Acceso a biblioteca de guías en PDF, ejercicios de fonética y resúmenes al finalizar cada clase.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

            {/* Card 4 (Soft Mint) */}
            <div style={{
              padding: "36px 28px 28px",
              borderRadius: "24px",
              backgroundColor: "#e6f4ea",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "260px"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(5, 150, 105, 0.15)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Acento Perfecto</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Corrección de acento y pronunciación en tiempo real para lograr sonar limpio y natural.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Client / Partner Logos Bar */}
      <section id="sec-5-partners" style={{ padding: "40px 24px", backgroundColor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "24px" }}>
            CONFIADO POR MÁS DE 200 ALUMNOS Y PROFESIONALES EN TODO EL MUNDO
          </span>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap", opacity: 0.7 }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>🇫🇷 París, Francia</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>🌐 Microsoft Teams</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>📜 DALF C2 Certified</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>💳 Stripe Payments</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>⭐ 4.9/5 Calificación</span>
          </div>
        </div>
      </section>

      {/* 6. "Languages from the Comfort of Home" Section */}
      <section id="sec-6-home" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "50px", alignItems: "center" }}>
          
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
            }}>
              <Image
                src="/video_student.png"
                alt="Clase Virtual de Francés"
                width={550}
                height={420}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>

          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              • CLASES ONLINE 1 A 1
            </span>
            <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "16px" }}>
              Francés desde la Comodidad de tu Hogar
            </h2>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", lineHeight: 1.6, marginBottom: "28px" }}>
              Disfruta de sesiones individuales por Microsoft Teams diseñadas exclusivamente para que avances con confianza.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Guía Paso a Paso</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Ruta estructurada desde nivel principiante (A1) hasta nivel profesional (C2).</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Enfoque Personalizado</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Contenido adaptado a tus metas: viajes, trabajo, exámen DELF o mudanza a Francia.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Flexible y Accesible</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Accede a tus clases y portal desde cualquier ordenador o teléfono móvil.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Big Impact Outline Stat Counter */}
      <section id="sec-7-stats" style={{ padding: "70px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", textAlign: "center" }}>
          
          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              +150
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Recursos Didácticos PDF</div>
          </div>

          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              98%
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Satisfacción en Alumnos</div>
          </div>

          <div>
            <div style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              +1.000
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "12px" }}>Horas Impartidas en Vivo</div>
          </div>

        </div>
      </section>

      {/* 8. "Domina el Francés, en Cualquier Lugar" (Sección Ilustrada 3D de Aprendizaje Global Re-inventada) */}
      <section id="sec-8-global" style={{
        background: "linear-gradient(135deg, #dff4f3 0%, #eefbf7 100%)",
        padding: "72px 56px",
        borderRadius: "36px",
        maxWidth: "1280px",
        margin: "0 auto 80px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 45px rgba(0, 85, 165, 0.08)"
      }}>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center"
        }} className="grid-cols-1 lg:grid-cols-2">
          
          {/* Columna Izquierda: Información & Beneficios */}
          <div style={{ zIndex: 5 }}>
            
            {/* Badge de Alumnos con Avatares */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 18px", borderRadius: "30px", backgroundColor: "#ffffff", boxShadow: "0 6px 16px rgba(0,85,165,0.06)", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#3b82f6", border: "2px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "11px", fontWeight: 800 }}>M</div>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#10b981", border: "2px solid #ffffff", marginLeft: "-8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "11px", fontWeight: 800 }}>C</div>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#8b5cf6", border: "2px solid #ffffff", marginLeft: "-8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "11px", fontWeight: 800 }}>S</div>
              </div>
              <div>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>200+</span>
                <span style={{ fontSize: "13px", color: "#475569", fontWeight: 700, marginLeft: "6px" }}>Alumnos Felices</span>
              </div>
            </div>

            <h2 style={{
              fontSize: "clamp(36px, 4.5vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#0f172a",
              lineHeight: 1.08,
              marginBottom: "20px"
            }}>
              Domina el Francés, <br />
              Desde Cualquier Rincón
            </h2>

            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: "32px",
              maxWidth: "500px"
            }}>
              Conectamos alumnos en <strong>Perú 🇵🇪, Colombia 🇨🇴, Argentina 🇦🇷</strong> y todo el mundo con profesores nativos en <strong>Francia 🇫🇷</strong> a través de clases individuales 100% en vivo.
            </p>

            {/* Chips de Beneficios Ilustrados */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,102,255,0.12)", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🇫🇷</span> Profesor Nativo de Francia
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,102,255,0.12)", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⏰</span> Zona Horaria Adaptable
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,102,255,0.12)", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🎯</span> Preparación Oficial DELF
              </div>
            </div>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 30px 14px 16px",
                borderRadius: "40px",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(0, 102, 255, 0.35)"
              }}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={20} strokeWidth={3} />
              </div>
              <span>Agendar Clase de Prueba</span>
            </a>

          </div>

          {/* Columna Derecha: Ilustración 3D de Conexión Global */}
          <div style={{ position: "relative", width: "100%", height: "420px", borderRadius: "28px", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,85,165,0.1)" }}>
            <Image
              src="/global_learning_illustration.png"
              alt="Ilustración 3D de Aprendizaje Global de Francés"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Badges Flotantes de Glassmorphism en la Ilustración */}
            <div style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", padding: "8px 14px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", fontSize: "12px", fontWeight: 800, color: "#0f172a" }}>
              🇫🇷 París (Francia)
            </div>
            <div style={{ position: "absolute", bottom: "16px", right: "16px", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", padding: "8px 14px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", fontSize: "12px", fontWeight: 800, color: "#0f172a" }}>
              🌎 Latam (🇵🇪 🇨🇴 🇦🇷)
            </div>
          </div>

        </div>

      </section>

      {/* 9. "Learn Fast, Speak Fluently. Explore Our Courses" Carrusel Interactivo de Cursos y Planes */}
      <section id="sec-9-planes" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" }} className="flex-col md:flex-row gap-4">
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                • NUESTROS PLANES DE ESTUDIO
              </span>
              <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", margin: 0 }}>
                Aprende Rápido. Explora Nuestros Planes
              </h2>
            </div>

            {/* Controles del Carrusel (< >) */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={prevSlide}
                style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                aria-label="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#0055a5", color: "#ffffff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                aria-label="Siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Filtros de Categorías de Cursos */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
            {[
              { id: "todos", label: "Todos los Planes" },
              { id: "principiantes", label: "Principiantes (A1-A2)" },
              { id: "intermedio", label: "Intermedio (B1-B2)" },
              { id: "avanzado", label: "Avanzado / DELF" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setCurrentSlideIndex(0); }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 800,
                  border: activeCategory === cat.id ? "none" : "1px solid #e2e8f0",
                  backgroundColor: activeCategory === cat.id ? "#0055a5" : "#f8fafc",
                  color: activeCategory === cat.id ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de Tarjetas de Cursos Réplica */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px" }}>
            {cursosFiltrados.map((course, idx) => (
              <div key={idx} style={{
                borderRadius: "24px",
                border: course.badge === "Más Popular" ? "2px solid #0055a5" : "1px solid #e2e8f0",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: course.badge === "Más Popular" ? "0 15px 35px rgba(0, 85, 165, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)"
              }}>
                <div>
                  <div style={{ position: "relative", height: "190px" }}>
                    <Image src={course.img} alt={course.title} fill style={{ objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#ffffff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 800, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      {course.flag} {course.badge}
                    </span>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", marginBottom: "8px", lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#64748b", lineHeight: 1.5, marginBottom: "12px" }}>
                      {course.desc}
                    </p>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#0055a5", marginBottom: "12px" }}>
                      {course.level} • {course.duration}
                    </p>

                    <ul style={{ listStyle: "none", padding: "12px 0 0 0", margin: 0, borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        "Clases particulares en vivo",
                        "Material interactivo en PDF incluido",
                        "Atención personalizada 1 a 1"
                      ].map((item, fIdx) => (
                        <li key={fIdx} style={{ fontSize: "12px", color: "#334155", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                          <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>{formatPrecio(course.precioEur)}</span>
                  <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: "#0055a5", color: "#ffffff", fontSize: "12px", fontWeight: 800, textDecoration: "none" }}>
                    Agendar →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de Páginas • • • */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
            {cursosFiltrados.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                style={{
                  width: i === currentSlideIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: i === currentSlideIndex ? "#0055a5" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 10. Scrolling Text Marquee Ticker (Espaciado Amplio 1:1 de la 3era Imagen Mockup) */}
      <div id="sec-10-ticker" style={{
        backgroundColor: "#ffffff",
        padding: "54px 0",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
      }}>
        <div className="marquee-smooth-track" style={{
          fontSize: "clamp(38px, 5.2vw, 58px)",
          fontWeight: 800,
          color: "#93c5fd",
          letterSpacing: "-0.01em",
          gap: "48px",
          whiteSpace: "nowrap",
          textTransform: "lowercase",
          alignItems: "center"
        }}>
          {["english", "+", "german", "+", "spanish", "+", "italian", "+", "french", "+", "english", "+", "german", "+", "spanish", "+", "italian", "+", "french", "+", "english", "+", "german", "+", "spanish", "+", "italian", "+", "french"].map((word, idx) => (
            <span key={idx} style={{
              display: "inline-block",
              color: word === "+" ? "#bfdbfe" : "#93c5fd",
              padding: "0 6px"
            }}>
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* 11. Two Feature Cards (Individual vs Corporate Lessons) */}
      <section id="sec-11-corporate" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          
          {/* Card 1: Individual Lessons */}
          <div style={{
            padding: "48px 36px",
            borderRadius: "32px",
            backgroundColor: "#edf5ff",
            position: "relative",
            overflow: "hidden"
          }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              • CLASES PARTICULARES
            </span>
            <h3 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "16px" }}>
              Clases Individuales 1 a 1
            </h3>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#475569", lineHeight: 1.6, marginBottom: "28px" }}>
              Para estudiantes particulares que buscan atención exclusiva y flexibilidad total en su horario.
            </p>
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#0055a5",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

          {/* Card 2: Corporate Lessons */}
          <div style={{
            padding: "48px 36px",
            borderRadius: "32px",
            backgroundColor: "#e6f4ea",
            position: "relative",
            overflow: "hidden"
          }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              • PARA EQUIPOS Y EMPRESAS
            </span>
            <h3 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "16px" }}>
              Francés para Negocios
            </h3>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#475569", lineHeight: 1.6, marginBottom: "28px" }}>
              Capacitación corporativa personalizada de francés comercial para profesionales y ejecutivos.
            </p>
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#059669",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

        </div>
      </section>

      {/* 12. Huge Dark Navy Footer (`#051329`) */}
      <footer id="sec-12-footer" style={{ backgroundColor: "#051329", color: "#ffffff", padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "80px" }}>
            
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Cursos & Niveles</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li>Francés Principiantes (A1-A2)</li>
                <li>Francés Intermedio (B1-B2)</li>
                <li>Francés Avanzado (C1-C2)</li>
                <li>Exámenes DELF & DALF</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Contacto Directo</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li>📍 París, Francia</li>
                <li>
                  <a 
                    href={`mailto:${config?.email_notificaciones || 'lefrancaisavecflorentin@outlook.com'}`}
                    style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    ✉️ {config?.email_notificaciones || 'lefrancaisavecflorentin@outlook.com'}
                  </a>
                </li>
                <li>
                  <a 
                    href={`https://wa.me/${(config?.whatsapp_number || '33685744973').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    💬 WhatsApp / Tel: {config?.whatsapp_number 
                      ? (config.whatsapp_number.startsWith('+') ? config.whatsapp_number : `+${config.whatsapp_number}`)
                      : '+33 6 85 74 49 73'}
                  </a>
                </li>
                <li>🌐 Clases Online por Microsoft Teams</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "20px" }}>Recursos & Alumnos</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><Link href="/alumno" style={{ color: "inherit", textDecoration: "none" }}>Portal de Alumnos</Link></li>
                <li><Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>Acceso Administrador</Link></li>
                <li><Link href="/privacidad" style={{ color: "inherit", textDecoration: "none" }}>Privacidad</Link></li>
                <li><Link href="/terminos" style={{ color: "inherit", textDecoration: "none" }}>Términos y Condiciones</Link></li>
              </ul>
            </div>

          </div>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "clamp(64px, 10vw, 120px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em" }}>
              Ling<span style={{ color: "#0055a5" }}>+</span>
            </span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
            © {new Date().getFullYear()} Florentin French • Ling+ Edition. Todos los derechos reservados.
          </div>

        </div>
      </footer>

      {/* Regla CSS para la Animación Marquee 100% Suave sin Cortes */}
      <style jsx global>{`
        @keyframes scrollMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>

    </div>
  );
}
