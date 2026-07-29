"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles, ArrowRight, BookOpen, Globe2, Award, Users, CheckCircle2,
  Star, ShieldCheck, Clock, MessageSquare, CalendarCheck, Search, ChevronRight,
  Video, Check, Sparkle, Heart
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
    <div style={{ backgroundColor: "#ffffff", color: "#0f172a", minHeight: "100vh", fontFamily: "var(--font-outfit, system-ui, sans-serif)", overflowX: "hidden" }}>
      
      {/* 1. Header V2 (Clean White Theme) */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderBottom: "1px solid #e2e8f0",
        padding: "14px 24px"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <Image
              src="/logo_inicio.png"
              alt="Florentin French"
              width={170}
              height={52}
              style={{ objectFit: "contain", maxHeight: "48px", width: "auto" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
          </Link>

          {/* Menú de Navegación */}
          <nav style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", fontWeight: 600, color: "#334155" }} className="hidden md:flex">
            <a href="#metodo" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Método</a>
            <a href="#beneficios" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Por qué Florentin</a>
            <a href="#planes" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Planes y Precios</a>
            <a href="#profesor" style={{ color: "inherit", textDecoration: "none" }} className="hover:text-blue-600">Profesor Nativo</a>
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
                fontWeight: 600,
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
                fontWeight: 600,
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
                backgroundColor: "#0066ff",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(0, 102, 255, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              Agendar Clase
              <ArrowRight size={14} />
            </a>

          </div>

        </div>
      </header>

      {/* 2. Hero Section V2 (Fondo degradado menta/azul suave) */}
      <section style={{
        background: "linear-gradient(180deg, #e6f4f1 0%, #f0f7ff 60%, #ffffff 100%)",
        padding: "70px 24px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "center" }}>
          
          {/* Columna Izquierda: Textos */}
          <div>
            <h1 style={{
              fontSize: "clamp(40px, 5.5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#0f172a",
              letterSpacing: "-1.5px",
              marginBottom: "20px"
            }}>
              Habla Francés Fluido, <br />
              <span style={{ color: "#0066ff" }}>Conéctate con el Mundo</span>
            </h1>

            <p style={{
              fontSize: "17px",
              color: "#475569",
              lineHeight: 1.6,
              marginBottom: "32px",
              maxWidth: "520px"
            }}>
              Aprende francés a tu ritmo con un profesor nativo parisino. Clases 1 a 1 en vivo, material pedagógico exclusivo y enfoque práctico conversacional.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="#planes"
                style={{
                  padding: "14px 28px",
                  borderRadius: "14px",
                  backgroundColor: "#0066ff",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 800,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 25px -5px rgba(0, 102, 255, 0.4)"
                }}
              >
                <ArrowRight size={16} />
                Explorar Clases
              </a>

              <Link
                href="/alumno"
                style={{
                  padding: "14px 24px",
                  borderRadius: "14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#0f172a",
                  fontSize: "15px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                Acceso Alumnos
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Imagen Estudiante */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 102, 255, 0.25)"
            }}>
              <Image
                src="/hero_student.png"
                alt="Estudiante de Francés"
                width={500}
                height={550}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                priority
              />

              {/* Badge flotante sobre la imagen */}
              <div style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "12px 18px",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{ fontSize: "24px" }}>🇫🇷</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a" }}>Profesor Nativo Parisino</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Clases 100% Personalizadas</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carrusel de Banderas / Idiomas (Marquee estilo Mockup) */}
        <div style={{ marginTop: "60px", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", gap: "14px", animation: "marqueeFlags 25s linear infinite" }}>
            {[
              { flag: "🇫🇷", label: "French" },
              { flag: "🇪🇸", label: "Spanish" },
              { flag: "🇬🇧", label: "English" },
              { flag: "🇩🇪", label: "German" },
              { flag: "🇮🇹", label: "Italian" },
              { flag: "🇨🇳", label: "Chinese" },
              { flag: "🇫🇷", label: "French" },
              { flag: "🇪🇸", label: "Spanish" },
              { flag: "🇬🇧", label: "English" },
              { flag: "🇩🇪", label: "German" },
              { flag: "🇮🇹", label: "Italian" },
              { flag: "🇨🇳", label: "Chinese" }
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
                fontSize: "14px",
                fontWeight: 700,
                color: "#334155"
              }}>
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Barra de Métricas e Identidad (Cinta Azul Royal estilo Mockup) */}
      <section style={{ backgroundColor: "#0066ff", color: "#ffffff", padding: "24px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Award size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800 }}>100% Nativo de París</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <CalendarCheck size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800 }}>Reserva Flexible 24/7</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <MessageSquare size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800 }}>Enfoque Conversacional</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <ShieldCheck size={22} />
            <span style={{ fontSize: "14px", fontWeight: 800 }}>Preparación DELF / DALF</span>
          </div>

        </div>
      </section>

      {/* 4. Sección Bento Cards Pastel (4 Bloques Beneficios) */}
      <section id="beneficios" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "1px", textTransform: "uppercase" }}>
              ¿POR QUÉ ELEGIRNOS?
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", marginTop: "8px" }}>
              Desbloquea el Mundo Aprendiendo Francés
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "600px", margin: "10px auto 0" }}>
              Un método diseñado para que hables con fluidez desde tu primera sesión sin memorizaciones tediosas.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            
            {/* Card 1: Azul Pastel */}
            <div style={{
              padding: "32px 24px",
              borderRadius: "24px",
              backgroundColor: "#edf5ff",
              border: "1px solid rgba(0, 102, 255, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#0066ff", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <MessageSquare size={22} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Conversación Real</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                  Práctica activa en francés desde la primera clase. Aprende con situaciones reales de la vida cotidiana en Francia.
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
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>A Tu Propio Ritmo</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                  Tú decides cuándo estudiar. Reserva y reprograma tus clases fácilmente según tu agenda laboral o personal.
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
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Material Incluido</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                  Acceso a biblioteca de recursos en PDF, audios y ejercicios preparados especialmente para tu nivel de aprendizaje.
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
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>Feedback Inmediato</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                  Corrección de acento y gramática en tiempo real con recomendaciones claras para perfeccionar tu pronunciación.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Sección Dividida: Aprende desde Casa (Imagen Izquierda, Texto Derecha) */}
      <section id="metodo" style={{ padding: "80px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "50px", alignItems: "center" }}>
          
          {/* Imagen Video Clase */}
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
            }}>
              <Image
                src="/video_student.png"
                alt="Clase Virtual de Francés"
                width={550}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Detalles del Método */}
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "1px", textTransform: "uppercase" }}>
              CLASES EN VIVO POR GOOGLE MEET
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", marginTop: "8px", marginBottom: "20px" }}>
              Aprende Francés desde la Comodidad de tu Hogar
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Sesiones 1 a 1 Exclusivas</h4>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Toda la atención centrada en tu progreso y tus objetivos específicos.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Adaptado a tu Nivel (A1 a C2)</h4>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Desde principiante absoluto hasta perfeccionamiento profesional.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Sin Horarios Rígidos</h4>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Elige tus horarios día a día según tu disponibilidad en el calendario.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Números de Impacto (Estilo Contorno 3D Mockup) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", textAlign: "center" }}>
          
          <div>
            <div style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px #0066ff",
              lineHeight: 1
            }}>
              +150
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569", marginTop: "8px" }}>Recursos Pedagógicos</div>
          </div>

          <div>
            <div style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px #0066ff",
              lineHeight: 1
            }}>
              98%
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569", marginTop: "8px" }}>Satisfacción de Alumnos</div>
          </div>

          <div>
            <div style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "2px #0066ff",
              lineHeight: 1
            }}>
              +1.000
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569", marginTop: "8px" }}>Clases Impartidas</div>
          </div>

        </div>
      </section>

      {/* 7. Banner de Mapa Global */}
      <section style={{
        backgroundColor: "#e0f2fe",
        padding: "80px 24px",
        textAlign: "center",
        position: "relative"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "20px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: "13px", fontWeight: 700, color: "#0066ff", marginBottom: "20px" }}>
            <Users size={16} />
            +200 Alumnos Felices
          </div>

          <h2 style={{ fontSize: "40px", fontWeight: 900, color: "#0f172a", marginBottom: "16px" }}>
            Domina el Francés en Cualquier Lugar del Mundo
          </h2>

          <p style={{ fontSize: "16px", color: "#334155", marginBottom: "30px" }}>
            Aprende desde España, México, Colombia, Perú, Chile o cualquier país con conversión automática a tu zona horaria.
          </p>

          <a
            href="https://wa.me/33744321356"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "16px 36px",
              borderRadius: "16px",
              backgroundColor: "#0066ff",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px rgba(0, 102, 255, 0.3)"
            }}
          >
            Escribir por WhatsApp
            <ArrowRight size={18} />
          </a>

        </div>
      </section>

      {/* 8. Tarjetas de Planes y Precios (Carousel V2) */}
      <section id="planes" style={{ padding: "90px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#0066ff", letterSpacing: "1px", textTransform: "uppercase" }}>
              TARIFAS Y PLANES
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", marginTop: "8px" }}>
              Aprende Rápido. Explora Nuestros Planes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            
            {[
              { nombre: "Clase Individual", desc: "Clase de 1 hora diseñada para cualquier objetivo.", precio: 15, clases: 1, popular: false },
              { nombre: "Plan Semanal (4 Clases)", desc: "1 clase por semana. Ideal para progreso constante.", precio: 49, clases: 4, popular: true },
              { nombre: "Plan Intensivo (8 Clases)", desc: "2 clases por semana. Recomendado para avanzar rápido.", precio: 89, clases: 8, popular: false },
              { nombre: "Plan Máster (12 Clases)", desc: "3 clases por semana. Para máxima inmersión.", precio: 129, clases: 12, popular: false }
            ].map((plan, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  padding: "32px 24px",
                  borderRadius: "24px",
                  backgroundColor: plan.popular ? "#ffffff" : "#f8fafc",
                  border: plan.popular ? "2px solid #0066ff" : "1px solid #e2e8f0",
                  boxShadow: plan.popular ? "0 15px 35px rgba(0, 102, 255, 0.15)" : "0 4px 12px rgba(0,0,0,0.02)",
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
                    backgroundColor: "#0066ff",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase"
                  }}>
                    MÁS POPULAR
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{plan.nombre}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, marginBottom: "20px" }}>{plan.desc}</p>
                  
                  <div style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", marginBottom: "20px" }}>
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
                    backgroundColor: plan.popular ? "#0066ff" : "#0f172a",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 800,
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                    boxShadow: plan.popular ? "0 8px 20px rgba(0, 102, 255, 0.3)" : "none"
                  }}
                >
                  Adquirir Plan
                </a>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* 9. Ticker Infinito de Texto Estilo Mockup */}
      <div style={{ backgroundColor: "#f1f5f9", padding: "20px 0", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, color: "#94a3b8", display: "inline-flex", gap: "24px", animation: "marqueeFlags 30s linear infinite" }}>
          <span>FRANÇAIS + ESPAÑOL + ENGLISH + DEUTSCH + ITALIANO + FRANÇAIS + ESPAÑOL + ENGLISH + DEUTSCH + ITALIANO</span>
        </div>
      </div>

      {/* 10. Clases Individuales vs Empresas (2 Bloques Estilo Mockup) */}
      <section style={{ padding: "80px 24px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          
          {/* Bloque 1: Individuales */}
          <div style={{
            padding: "40px 32px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
            color: "#0c4a6e"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>PERSONALIZADO</span>
            <h3 style={{ fontSize: "32px", fontWeight: 900, margin: "10px 0 16px" }}>Clases Individuales</h3>
            <p style={{ fontSize: "15px", lineHeight: 1.6, marginBottom: "24px" }}>
              Clases particulares 1 a 1 diseñadas 100% a tu medida y horario.
            </p>
            <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", borderRadius: "12px", backgroundColor: "#0284c7", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: "14px", display: "inline-block" }}>
              Saber más
            </a>
          </div>

          {/* Bloque 2: Corporativo */}
          <div style={{
            padding: "40px 32px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)",
            color: "#14532d"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>EMPRESAS Y GRUPOS</span>
            <h3 style={{ fontSize: "32px", fontWeight: 900, margin: "10px 0 16px" }}>Clases Corporativas</h3>
            <p style={{ fontSize: "15px", lineHeight: 1.6, marginBottom: "24px" }}>
              Formación de francés de negocios para equipos de trabajo y empresas.
            </p>
            <a href="https://wa.me/33744321356" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", borderRadius: "12px", backgroundColor: "#16a34a", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: "14px", display: "inline-block" }}>
              Contactar Empresas
            </a>
          </div>

        </div>
      </section>

      {/* 11. Footer Oscuro Azul Marino (Estilo Mockup Ling+) */}
      <footer style={{ backgroundColor: "#051329", color: "#ffffff", padding: "70px 24px 40px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "60px" }}>
            
            <div>
              <h3 style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", marginBottom: "16px" }}>
                Florentin<span style={{ color: "#0066ff" }}>+</span>
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
                Aprende francés con un profesor nativo de París. Clases personalizadas y horarios flexibles.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px", color: "#ffffff" }}>Cursos</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>Francés Principiantes (A1-A2)</li>
                <li>Francés Intermedio (B1-B2)</li>
                <li>Francés Avanzado (C1-C2)</li>
                <li>Preparación DELF / DALF</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px", color: "#ffffff" }}>Contacto</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>📍 París, Francia</li>
                <li>💬 WhatsApp: +33 7 44 32 13 56</li>
                <li>🌐 Clases Online por Google Meet</li>
              </ul>
            </div>

          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
            © {new Date().getFullYear()} Florentin French+ • Todos los derechos reservados.
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
