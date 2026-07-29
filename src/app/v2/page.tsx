"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { translations, Language } from "@/lib/translations";
import {
  Sparkles, ArrowRight, ArrowUpRight, Search, ShoppingBag, Check,
  Clock, BookOpen, MessageSquare, Compass, ShieldCheck, CheckCircle2,
  Users, Award, ChevronRight, ChevronLeft, Star, Globe2, Phone, Mail, MapPin, Heart,
  PlayCircle, Sparkle, Laptop, GraduationCap
} from "lucide-react";

export default function LandingV2Replica() {
  const [lang, setLang] = useState<Language>("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
      desc: "1 hora de clase particular enfocada en tu meta personal o dudas de gramática y pronunciación.",
      level: "Todos los Niveles",
      duration: "1 Hora",
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
      overflowX: "hidden"
    }}>
      
      {/* 1. Header Navbar (Réplica Pixel a Pixel del Mockup Ling+ adaptado a Florentin) */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo Ling+ con distintivo Florentin */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Image
              src="/logo_inicio.png"
              alt="Florentin French"
              width={160}
              height={50}
              style={{ objectFit: "contain", maxHeight: "44px", width: "auto" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 800, backgroundColor: "#e0f2fe", color: "#0055a5", padding: "3px 10px", borderRadius: "20px" }}>
              Ling+ V2
            </span>
          </Link>

          {/* Menú de Navegación Réplica */}
          <nav style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", fontWeight: 700, color: "#334155" }} className="hidden lg:flex">
            <a href="#profesor" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Profesor <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#metodo" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Método <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#beneficios" style={{ color: "inherit", textDecoration: "none" }}>Por Qué Florentin</a>
            <a href="#planes" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              Planes & Precios <span style={{ fontSize: "10px" }}>▼</span>
            </a>
            <a href="#testimonios" style={{ color: "inherit", textDecoration: "none" }}>Testimonios</a>
          </nav>

          {/* Acciones y Selectores (Idioma, Moneda, Portal y Agendar) */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            
            {/* Selector de Idioma (ES / FR / EN) */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{
                backgroundColor: "#f8fafc",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            {/* Selector de Moneda (EUR € / USD $) */}
            <select
              value={divisa}
              onChange={(e) => setDivisa(e.target.value as any)}
              style={{
                backgroundColor: "#f8fafc",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <option value="eur">EUR (€)</option>
              <option value="usd">USD ($)</option>
            </select>

            <Link
              href="/alumno"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0055a5",
                textDecoration: "none"
              }}
              className="hidden sm:inline-block"
            >
              Área Alumno
            </Link>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 22px",
                borderRadius: "30px",
                backgroundColor: "#0055a5",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(0, 85, 165, 0.3)"
              }}
            >
              Agendar Clase
              <ArrowUpRight size={14} />
            </a>

          </div>

        </div>
      </header>

      {/* 2. Hero Section (Fondo Menta/Cyan Degradado Réplica) */}
      <section style={{
        background: "linear-gradient(180deg, #dff4f3 0%, #edf9f8 60%, #ffffff 100%)",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          {/* Left Column: Heading, Rating & CTA Button */}
          <div>
            
            {/* Rating Stars Badge con Avatares */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 14px", borderRadius: "30px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", color: "#f59e0b", gap: "2px" }}>
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a" }}>4.9/5 • +200 Alumnos Formados</span>
            </div>

            <h1 style={{
              fontSize: "clamp(44px, 5.8vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#0f172a",
              letterSpacing: "-0.035em",
              marginBottom: "20px"
            }}>
              Habla Francés, <br />
              <span style={{ color: "#0055a5" }}>Conéctate con el Mundo</span>
            </h1>

            <p style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#475569",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              marginBottom: "32px",
              maxWidth: "520px"
            }}>
              Aprende francés fluido con <strong>Florentin</strong>, profesor nativo nacido en París. Clases particulares 1 a 1 en vivo por Google Meet, corrigiendo tu acento en tiempo real.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a
                href="https://wa.me/33744321356"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#0055a5",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(0, 85, 165, 0.35)",
                  transition: "transform 0.2s ease"
                }}
                className="hover:scale-105"
              >
                <ArrowUpRight size={22} />
              </a>
              <div>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", display: "block" }}>Agendar Clase Gratuita</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Sin compromisos de tarjeta</span>
              </div>
            </div>
          </div>

          {/* Right Column: Student Portrait with Soft Mint Oval */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "40px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 85, 165, 0.2)"
            }}>
              <Image
                src="/hero_student.png"
                alt="Estudiante de Francés"
                width={500}
                height={550}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                priority
              />

              {/* Badge flotante de acreditación */}
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                right: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                padding: "14px 18px",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "28px" }}>🇫🇷</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>Florentin • Nativo de París</div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Clases 100% Personalizadas 1 a 1</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carrusel Marquee de Banderas / Especialidades (CORREGIDO: Bucle 100% Infinito y Suave sin cortes) */}
        <div style={{ marginTop: "60px", overflow: "hidden", position: "relative", width: "100%" }}>
          <div className="marquee-track" style={{ display: "flex", gap: "16px", width: "max-content", animation: "scrollMarquee 35s linear infinite" }}>
            {marqueeItemsPoblados.map((item, i) => (
              <div key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 22px",
                borderRadius: "40px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                fontSize: "14px",
                fontWeight: 800,
                color: "#0f172a",
                whiteSpace: "nowrap"
              }}>
                {item.flag && <span style={{ fontSize: "18px" }}>{item.flag}</span>}
                {item.icon && <span style={{ fontSize: "18px" }}>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Cinta Azul Royal (4 Items Horizontal Checkmarks) */}
      <section style={{ backgroundColor: "#0055a5", color: "#ffffff", padding: "22px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>100% Profesor Nativo Parisino</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Reserva Flexible 24/7</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Enfoque Conversacional Real</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#ffffff", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Preparación DELF / DALF</span>
          </div>

        </div>
      </section>

      {/* 4. "Unlock the World with Language Learning" (4 Bento Cards Pastel) */}
      <section id="beneficios" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "flex-end", marginBottom: "50px" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                • ¿POR QUÉ ELEGIR A FLORENTIN?
              </span>
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
      <section style={{ padding: "40px 24px", backgroundColor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "24px" }}>
            CONFIADO POR MÁS DE 200 ALUMNOS Y PROFESIONALES EN TODO EL MUNDO
          </span>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap", opacity: 0.7 }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>🇫🇷 París, Francia</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>🌐 Google Meet</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>📜 DALF C2 Certified</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>💳 Stripe Payments</span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#475569" }}>⭐ 4.9/5 Calificación</span>
          </div>
        </div>
      </section>

      {/* 6. "Languages from the Comfort of Home" Section */}
      <section id="metodo" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
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
              Disfruta de sesiones individuales por Google Meet diseñadas exclusivamente para que avances con confianza.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Guía Paso a Paso</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Ruta estructurada desde nivel principiante (A1) hasta nivel profesional (C2).</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a", margin: 0 }}>Enfoque Personalizado</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Contenido adaptado a tus metas: viajes, trabajo, exámen DELF o mudanza a Francia.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0, marginTop: "2px" }}>
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
      <section style={{ padding: "70px 24px", backgroundColor: "#ffffff" }}>
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

      {/* 8. "Master Any Language, Anywhere" Banner (Map & Floating Flags) */}
      <section style={{
        backgroundColor: "#e0f2fe",
        padding: "80px 24px",
        borderRadius: "32px",
        maxWidth: "1280px",
        margin: "0 auto 80px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 16px", borderRadius: "30px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 800, color: "#0055a5", marginBottom: "20px" }}>
              <span>🥐</span> +200 Alumnos Felices
            </div>

            <h2 style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1, marginBottom: "16px" }}>
              Domina el Francés, <br /> en Cualquier Lugar
            </h2>

            <p style={{ fontSize: "16px", fontWeight: 500, color: "#334155", marginBottom: "32px", maxWidth: "460px" }}>
              Clases virtuales individuales con conversión automática a tu zona horaria local.
            </p>

            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#0055a5",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(0, 85, 165, 0.35)"
              }}
            >
              <ArrowUpRight size={20} />
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {["🇫🇷 Francia", "🇪🇸 España", "🇲🇽 México", "🇨🇱 Chile", "🇨🇴 Colombia"].map((pais, idx) => (
              <div key={idx} style={{ padding: "14px 24px", borderRadius: "20px", backgroundColor: "#ffffff", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                {pais}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. "Learn Fast, Speak Fluently. Explore Our Courses" Carrusel Interactivo de Cursos y Planes */}
      <section id="planes" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
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
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#0055a5", margin: 0 }}>
                      {course.level} • {course.duration}
                    </p>
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

      {/* 10. Scrolling Text Marquee Ticker (CORREGIDO: Bucle continuo suave) */}
      <div style={{ backgroundColor: "#f8fafc", padding: "24px 0", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", overflow: "hidden", position: "relative", width: "100%" }}>
        <div className="marquee-track" style={{ fontSize: "28px", fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.02em", display: "flex", gap: "24px", width: "max-content", animation: "scrollMarquee 30s linear infinite", whiteSpace: "nowrap" }}>
          <span>FRANÇAIS + ESPAÑOL + ENGLISH + DEUTSCH + ITALIANO + FRANÇAIS + ESPAÑOL + ENGLISH + DEUTSCH + ITALIANO + FRANÇAIS + ESPAÑOL</span>
        </div>
      </div>

      {/* 11. Two Feature Cards (Individual vs Corporate Lessons) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
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
      <footer style={{ backgroundColor: "#051329", color: "#ffffff", padding: "80px 24px 40px" }}>
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
                <li>💬 WhatsApp: +33 7 44 32 13 56</li>
                <li>🌐 Clases Online por Google Meet</li>
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
