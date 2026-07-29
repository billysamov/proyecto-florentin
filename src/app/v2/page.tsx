"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles, ArrowRight, BookOpen, Globe2, Award, Users, CheckCircle2,
  Star, ShieldCheck, Clock, MessageSquare, CalendarCheck, Check, Sparkle,
  GraduationCap, MapPin, Compass, HeartHandshake, PlayCircle
} from "lucide-react";

export default function LandingV2() {
  const [lang, setLang] = useState<"es" | "fr" | "en">("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");

  const formatPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      return `$${Math.round(precioEur * 1.1)} USD`;
    }
    return `${precioEur} €`;
  };

  return (
    <div className="v2-container" style={{
      backgroundColor: "#ffffff",
      color: "#0f172a",
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      WebkitFontSmoothing: "antialiased",
      overflowX: "hidden"
    }}>
      
      {/* 1. Header V2 - Tipografía limpia del Mockup Ling+ */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        borderBottom: "1px solid #e2e8f0",
        padding: "14px 24px"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo Florentin */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image
              src="/logo_inicio.png"
              alt="Florentin French"
              width={175}
              height={54}
              style={{ objectFit: "contain", maxHeight: "46px", width: "auto" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
          </Link>

          {/* Menú de Navegación (Tipografía Plus Jakarta Sans exactas al mockup) */}
          <nav style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#334155" }} className="hidden md:flex">
            <a href="#profesor" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Conoce a Florentin</a>
            <a href="#metodo" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Método Conversacional</a>
            <a href="#beneficios" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Beneficios</a>
            <a href="#planes" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Planes de Estudio</a>
          </nav>

          {/* Acciones y Selectores */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            
            {/* Selector de Idioma */}
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

            {/* Selector de Moneda */}
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

            {/* Botón CTA Principal */}
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                backgroundColor: "#0055a5",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 14px rgba(0, 85, 165, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              Agenda por WhatsApp
              <ArrowRight size={14} />
            </a>

          </div>

        </div>
      </header>

      {/* 2. Hero Section - Tipografía exactísima al Mockup Ling+ */}
      <section style={{
        background: "linear-gradient(180deg, #edf4ff 0%, #f4f8ff 50%, #ffffff 100%)",
        padding: "70px 24px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          {/* Columna Izquierda: Mensaje en Tipografía de Impacto */}
          <div>
            
            {/* Badge Nativo Parisino */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "30px",
              backgroundColor: "rgba(0, 85, 165, 0.1)",
              border: "1px solid rgba(0, 85, 165, 0.2)",
              color: "#0055a5",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "20px"
            }}>
              <span>🇫🇷</span> PROFESOR NATIVO DE PARÍS, FRANCIA
            </div>

            {/* Titular Principal: Speak Fluently, Connect Globally (adaptado en Tipografía Plus Jakarta Sans) */}
            <h1 style={{
              fontSize: "clamp(42px, 5.8vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#0f172a",
              letterSpacing: "-0.035em",
              marginBottom: "20px"
            }}>
              Habla Francés con la <br />
              <span style={{ color: "#0055a5" }}>Fluidez y Elegancia</span> de un Nativo
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: "17px",
              fontWeight: 500,
              color: "#475569",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              marginBottom: "32px",
              maxWidth: "540px"
            }}>
              Aprende francés real con <strong>Florentin</strong>, nacido y criado en París. Clases particulares 1 a 1 en vivo, corregimos tu acento desde la primera sesión y avanzas a tu propio ritmo.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/33744321356"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "16px 32px",
                  borderRadius: "14px",
                  backgroundColor: "#0055a5",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 25px -5px rgba(0, 85, 165, 0.4)"
                }}
              >
                <ArrowRight size={16} />
                Agendar Primera Clase
              </a>

              <a
                href="#planes"
                style={{
                  padding: "16px 26px",
                  borderRadius: "14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                Ver Planes ({formatPrecio(49)}/mes)
              </a>
            </div>
          </div>

          {/* Columna Derecha: Imagen Estudiante con Marca de Agua Parisina */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 85, 165, 0.22)"
            }}>
              <Image
                src="/hero_student.png"
                alt="Aprender Francés con Florentin"
                width={500}
                height={550}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
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
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a" }}>Florentin • Profesor Nativo de París</div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>+5 años enseñando • Método Conversacional 100% Práctico</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carrusel Marquee de Objetivos y Niveles de Francés */}
        <div style={{ marginTop: "60px", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", gap: "14px", animation: "marqueeFlags 25s linear infinite" }}>
            {[
              { icon: "🥐", label: "Francés de París" },
              { icon: "💼", label: "Francés para Negocios" },
              { icon: "✈️", label: "Francés para Viajes" },
              { icon: "🎓", label: "Preparación DELF (A1-B2)" },
              { icon: "📜", label: "Preparación DALF (C1-C2)" },
              { icon: "🍷", label: "Cultura & Conversación" },
              { icon: "🥐", label: "Francés de París" },
              { icon: "💼", label: "Francés para Negocios" },
              { icon: "✈️", label: "Francés para Viajes" },
              { icon: "🎓", label: "Preparación DELF (A1-B2)" },
              { icon: "📜", label: "Preparación DALF (C1-C2)" },
              { icon: "🍷", label: "Cultura & Conversación" }
            ].map((item, i) => (
              <div key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "30px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#334155"
              }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Barra Azul de Métricas y Compromiso de Calidad */}
      <section style={{ backgroundColor: "#0055a5", color: "#ffffff", padding: "24px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Award size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Pronunciación Nativa de París</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <CalendarCheck size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Reserva Flexible de Horarios</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <MessageSquare size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Sin Tablas Aburridas de Memoria</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <ShieldCheck size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.01em" }}>Certificaciones DELF / DALF</span>
          </div>

        </div>
      </section>

      {/* 4. Perfil Destacado del Profesor Florentin */}
      <section id="profesor" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "50px", alignItems: "center" }}>
          
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              TU PROFESOR PERSONAL
            </span>
            <h2 style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginTop: "8px", marginBottom: "20px" }}>
              Bonjour ! Soy Florentin 🥐
            </h2>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#475569", lineHeight: 1.7, marginBottom: "20px" }}>
              Nací y crecí en París, Francia. Llevo más de 5 años enseñando francés a estudiantes de todo el mundo, especialmente de habla hispana.
            </p>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#475569", lineHeight: 1.7, marginBottom: "30px" }}>
              Mi filosofía pedagógica es simple: <strong>aprender un idioma debe ser emocionante y práctico</strong>, no una acumulación de reglas gramaticales teóricas. En mis clases nos enfocamos en que te expreses con seguridad y naturalidad desde el primer día.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0055a5" }}>+5 Años</div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700 }}>Experiencia Docente</div>
              </div>
              <div style={{ padding: "16px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0055a5" }}>+200</div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700 }}>Alumnos Formados</div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0"
            }}>
              <Image
                src="/hero_student.png"
                alt="Florentin Profesor de Francés"
                width={550}
                height={480}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Bento Grid Pastel: 4 Pilares del Método Florentin */}
      <section id="beneficios" style={{ padding: "80px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ¿POR QUÉ APRENDER CON FLORENTIN?
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginTop: "8px" }}>
              El Método Más Efectivo para Hablar Francés
            </h2>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", maxWidth: "600px", margin: "10px auto 0" }}>
              Diseñado para estudiantes que quieren resultados reales en conversación y fluidez.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            
            {/* Card 1: Azul Pastel */}
            <div style={{
              padding: "32px 24px",
              borderRadius: "24px",
              backgroundColor: "#edf5ff",
              border: "1px solid rgba(0, 85, 165, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#0055a5", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <MessageSquare size={22} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Conversación Real</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6 }}>
                  Hablamos francés desde la primera sesión con situaciones auténticas de la vida diaria en Francia.
                </p>
              </div>
            </div>

            {/* Card 2: Lavanda Pastel */}
            <div style={{
              padding: "32px 24px",
              borderRadius: "24px",
              backgroundColor: "#f5f3ff",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#7c3aed", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Clock size={22} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Horarios Flexibles</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6 }}>
                  Agenda tus clases según tu disponibilidad en tu zona horaria. Sin compromisos rígidos de academia.
                </p>
              </div>
            </div>

            {/* Card 3: Cyan Pastel */}
            <div style={{
              padding: "32px 24px",
              borderRadius: "24px",
              backgroundColor: "#e0f7fa",
              border: "1px solid rgba(6, 182, 212, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#0891b2", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <BookOpen size={22} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Material Exclusivo</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6 }}>
                  Acceso sin costo a guías pedagógicas, ejercicios de pronunciación y notas personalizadas tras cada clase.
                </p>
              </div>
            </div>

            {/* Card 4: Menta Pastel */}
            <div style={{
              padding: "32px 24px",
              borderRadius: "24px",
              backgroundColor: "#e6f4ea",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Sparkle size={22} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "10px" }}>Acento Perfecto</h3>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#475569", lineHeight: 1.6 }}>
                  Corrección de acento y fonética en tiempo real con trucos nativos para sonar limpio y natural.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Sección Dividida: Clases Virtuales por Google Meet */}
      <section id="metodo" style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "50px", alignItems: "center" }}>
          
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
            }}>
              <Image
                src="/video_student.png"
                alt="Clase de Francés 1 a 1 por Google Meet"
                width={550}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>

          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              EXPERIENCIA ONLINE PREMIUM
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginTop: "8px", marginBottom: "20px" }}>
              Clases Virtuales 1 a 1 por Google Meet
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a" }}>Sesiones Individuales 100% Privadas</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Sin distracciones. Toda la atención enfocada en tu aprendizaje.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a" }}>Para Todos los Niveles (A1 hasta C2)</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Diseño cada clase según si empiezas desde cero o perfeccionas nivel avanzado.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0055a5", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.01em", color: "#0f172a" }}>Portal de Alumno Personalizado</h4>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", margin: 0 }}>Accede a tus materiales, notas y reserva tus horarios con un solo clic.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Contador de Impacto (Contorno 3D Azul Francés con Tipografía Jakarta Sans) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", textAlign: "center" }}>
          
          <div>
            <div style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              +150
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "8px" }}>Materiales y Guías PDF</div>
          </div>

          <div>
            <div style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              98%
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "8px" }}>Satisfacción en Alumnos</div>
          </div>

          <div>
            <div style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2.5px #0055a5",
              lineHeight: 1
            }}>
              +1.000
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", color: "#475569", marginTop: "8px" }}>Horas de Francés Impartidas</div>
          </div>

        </div>
      </section>

      {/* 8. Tarjetas de Planes de Estudio */}
      <section id="planes" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0055a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              PLANES Y MATRÍCULA
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.025em", color: "#0f172a", marginTop: "8px" }}>
              Elige tu Plan de Francés
            </h2>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#64748b", maxWidth: "500px", margin: "10px auto 0" }}>
              Sin cláusulas de permanencia. Elige la cantidad de clases que mejor se adapte a tu meta.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            
            {[
              { nombre: "Clase Individual", desc: "1 clase particular de 1 hora. Ideal para preparar una entrevista o dudas puntuales.", precio: 15, clases: 1, popular: false },
              { nombre: "Plan Semanal (4 Clases)", desc: "1 clase a la semana. Perfecto para avanzar de forma constante sin prisa.", precio: 49, clases: 4, popular: true },
              { nombre: "Plan Intensivo (8 Clases)", desc: "2 clases a la semana. Recomendado para lograr fluidez en pocos meses.", precio: 89, clases: 8, popular: false },
              { nombre: "Plan Máster (12 Clases)", desc: "3 clases a la semana. Inmersión total y preparación acelerada DELF/DALF.", precio: 129, clases: 12, popular: false }
            ].map((plan, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  padding: "32px 24px",
                  borderRadius: "24px",
                  backgroundColor: plan.popular ? "#ffffff" : "#f8fafc",
                  border: plan.popular ? "2px solid #0055a5" : "1px solid #e2e8f0",
                  boxShadow: plan.popular ? "0 15px 35px rgba(0, 85, 165, 0.15)" : "0 4px 12px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {plan.popular && (
                  <span style={{
                    position: "absolute",
                    top: "-12px",
                    right: "24px",
                    backgroundColor: "#0055a5",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase"
                  }}>
                    MÁS POPULAR
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.015em", color: "#0f172a", marginBottom: "8px" }}>{plan.nombre}</h3>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#64748b", lineHeight: 1.5, marginBottom: "20px" }}>{plan.desc}</p>
                  
                  <div style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: "20px" }}>
                    {formatPrecio(plan.precio)}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}> / paquete</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/33744321356"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "14px",
                    backgroundColor: plan.popular ? "#0055a5" : "#0f172a",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                    boxShadow: plan.popular ? "0 8px 20px rgba(0, 85, 165, 0.3)" : "none"
                  }}
                >
                  Agendar por WhatsApp
                </a>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* 9. Clases Individuales vs Empresas */}
      <section style={{ padding: "80px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          
          <div style={{
            padding: "40px 32px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            color: "#0c4a6e"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>PARTICULAR</span>
            <h3 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "10px 0 16px" }}>Clases Individuales 1 a 1</h3>
            <p style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.6, marginBottom: "24px" }}>
              Clases enfocadas en tus metas personales: viajes, migración a Francia o superación personal.
            </p>
            <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", borderRadius: "12px", backgroundColor: "#0284c7", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: "14px", display: "inline-block" }}>
              Hablar con Florentin
            </a>
          </div>

          <div style={{
            padding: "40px 32px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)",
            color: "#14532d"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>EMPRESAS Y PROFESIONALES</span>
            <h3 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "10px 0 16px" }}>Francés para Negocios</h3>
            <p style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.6, marginBottom: "24px" }}>
              Capacitación de francés comercial y corporativo para profesionales y empresas.
            </p>
            <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", borderRadius: "12px", backgroundColor: "#16a34a", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: "14px", display: "inline-block" }}>
              Consultar Plan Corporativo
            </a>
          </div>

        </div>
      </section>

      {/* 10. Footer Oscuro Azul Francés (`#051329`) */}
      <footer style={{ backgroundColor: "#051329", color: "#ffffff", padding: "70px 24px 40px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            
            <div>
              <h3 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "16px" }}>
                Florentin<span style={{ color: "#0055a5" }}> French</span>
              </h3>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8", lineHeight: 1.6 }}>
                Clases particulares de francés con un profesor nativo de París. Método práctico conversacional y preparación personalizada.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.01em", marginBottom: "16px", color: "#ffffff" }}>Cursos & Niveles</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>Francés Principiantes (A1-A2)</li>
                <li>Francés Intermedio (B1-B2)</li>
                <li>Francés Avanzado (C1-C2)</li>
                <li>Preparación DELF / DALF</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.01em", marginBottom: "16px", color: "#ffffff" }}>Contacto Directo</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", fontWeight: 500, color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>📍 París, Francia</li>
                <li>💬 WhatsApp: +33 7 44 32 13 56</li>
                <li>🌐 Clases Online por Google Meet</li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
            © {new Date().getFullYear()} Florentin French • Todos los derechos reservados.
          </div>

        </div>
      </footer>

      <style jsx global>{`
        @keyframes marqueeFlags {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}
