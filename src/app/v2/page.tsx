"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, BookOpen, Globe2, Award, Users, CheckCircle2, Star, ShieldCheck } from "lucide-react";

export default function LandingV2() {
  const [lang, setLang] = useState<"es" | "fr" | "en">("es");
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");

  const getPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      return `$${Math.round(precioEur * 1.1)} USD`;
    }
    return `${precioEur} €`;
  };

  return (
    <div style={{ backgroundColor: "#060b17", color: "#f8fafc", minHeight: "100vh", fontFamily: "var(--font-outfit, system-ui, sans-serif)", overflowX: "hidden" }}>
      
      {/* 1. Header V2 */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(6, 11, 23, 0.82)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "16px 24px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo V2 */}
          <Link href="/v2" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <Image
              src="/logo_inicio.png"
              alt="Florentin French"
              width={160}
              height={50}
              style={{ objectFit: "contain", maxHeight: "48px", width: "auto" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
            <span style={{
              fontSize: "11px",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "20px",
              backgroundColor: "rgba(201, 154, 60, 0.2)",
              color: "#f59e0b",
              border: "1px solid rgba(201, 154, 60, 0.4)",
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}>
              V2 Preview
            </span>
          </Link>

          {/* Navegación y Controles */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Selector de Idioma */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "13px",
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
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              <option value="eur">EUR (€)</option>
              <option value="usd">USD ($)</option>
            </select>

            {/* Acceso Alumno */}
            <Link
              href="/alumno"
              style={{
                padding: "8px 18px",
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                color: "#60a5fa",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                transition: "all 0.2s ease"
              }}
            >
              Área Alumno
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Hero Section V2 */}
      <section style={{ position: "relative", padding: "100px 24px 80px", overflow: "hidden" }}>
        
        {/* Aura luminosa de fondo */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 154, 60, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
          
          {/* Badge francés */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "30px",
            backgroundColor: "rgba(201, 154, 60, 0.12)",
            border: "1px solid rgba(201, 154, 60, 0.3)",
            color: "#f59e0b",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            marginBottom: "24px"
          }}>
            <Sparkles size={14} />
            NUEVA EXPERIENCIA FRONTEND V2 • PROFESOR NATIVO DE PARÍS
          </div>

          {/* Título Principal */}
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            marginBottom: "20px"
          }}>
            Habla francés fluido con{" "}
            <span style={{
              background: "linear-gradient(135deg, #c99a3c 0%, #f59e0b 50%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              clases 1 a 1 en vivo
            </span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "#94a3b8",
            maxWidth: "700px",
            margin: "0 auto 36px",
            lineHeight: 1.6
          }}>
            Diseño renovado para una experiencia de aprendizaje inmersiva. Elige tu ritmo, reserva en tiempo real y accede a tu material didáctico exclusivo.
          </p>

          {/* Botones CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/33744321356"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "16px 32px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #c99a3c 0%, #f59e0b 100%)",
                color: "#0c1b33",
                fontSize: "16px",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 12px 30px -5px rgba(201, 154, 60, 0.4)",
                transition: "all 0.2s ease"
              }}
            >
              Agenda tu Clase Gratuita
              <ArrowRight size={18} />
            </a>

            <a
              href="#planes-v2"
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Ver Planes ({getPrecio(49)}/mes)
            </a>
          </div>

        </div>
      </section>

      {/* 3. Sección de Tarjetas de Características V2 */}
      <section style={{ padding: "60px 24px", backgroundColor: "rgba(255, 255, 255, 0.02)", borderTop: "1px solid rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          
          {[
            {
              icon: <Globe2 className="text-[#3b82f6]" size={28} />,
              title: "Profesores Nativos",
              desc: "Inmersión cultural real desde el primer día con pronunciación parisina auténtica."
            },
            {
              icon: <BookOpen className="text-[#f59e0b]" size={28} />,
              title: "Material Exclusivo",
              desc: "Acceso gratuito a guías didácticas, ejercicios y recursos personalizados por nivel."
            },
            {
              icon: <CheckCircle2 className="text-[#22c55e]" size={28} />,
              title: "Flexibilidad Total",
              desc: "Reserva y reprograma tus clases según tu horario personal desde el portal."
            }
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                padding: "28px",
                borderRadius: "20px",
                backgroundColor: "rgba(12, 27, 51, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div style={{ marginBottom: "16px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px", color: "#ffffff" }}>{card.title}</h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Footer V2 */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: "13px", color: "#64748b", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>© {new Date().getFullYear()} Florentin French • Entorno de Pruebas Frontend V2</p>
        </div>
      </footer>

    </div>
  );
}
