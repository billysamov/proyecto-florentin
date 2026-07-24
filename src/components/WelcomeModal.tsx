"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Globe, Coins, Check, Sparkles, ArrowRight } from "lucide-react";
import { Language } from "@/lib/translations";

interface WelcomeModalProps {
  onConfirm: (lang: Language, divisa: "eur" | "usd") => void;
  currentLang?: Language;
  currentDivisa?: "eur" | "usd";
}

export default function WelcomeModal({
  onConfirm,
  currentLang = "es",
  currentDivisa = "eur"
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);
  const [selectedDivisa, setSelectedDivisa] = useState<"eur" | "usd">(currentDivisa);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("florentin_welcome_seen");
      if (!hasVisited) {
        // Retardo sutil para la animación de entrada
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!mounted || !isOpen) return null;

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("florentin_welcome_seen", "true");
        localStorage.setItem("florentin_lang", selectedLang);
        localStorage.setItem("florentin_divisa", selectedDivisa);
      }
      onConfirm(selectedLang, selectedDivisa);
      setIsOpen(false);
      setIsClosing(false);
    }, 450);
  };

  // Textos adaptativos según el idioma seleccionado en tiempo real en la pantalla
  const getModalContent = () => {
    switch (selectedLang) {
      case "fr":
        return {
          welcome: "Bienvenue !",
          subtitle: "Personnalisez votre expérience pour apprendre le français avec Florentin.",
          langLabel: "Choisissez votre langue",
          currencyLabel: "Devise d'affichage",
          btnText: "Commencer l'expérience",
          badge: "Professeur Natif de Paris"
        };
      case "en":
        return {
          welcome: "Welcome!",
          subtitle: "Customize your experience to learn French with Florentin.",
          langLabel: "Choose your language",
          currencyLabel: "Display Currency",
          btnText: "Start Experience",
          badge: "Native Teacher from Paris"
        };
      default:
        return {
          welcome: "¡Bienvenido/a!",
          subtitle: "Personaliza tu experiencia para aprender francés con Florentin.",
          langLabel: "Elige tu idioma preferido",
          currencyLabel: "Moneda de visualización",
          btnText: "Comenzar Experiencia",
          badge: "Profesor Nativo de París"
        };
    }
  };

  const content = getModalContent();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "rgba(6, 11, 23, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? "scale(0.96)" : "scale(1)",
        transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: "welcomeFadeIn 0.5s ease-out forwards"
      }}
    >
      {/* Resplandor decorativo de fondo */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 154, 60, 0.18) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "pulseAura 6s ease-in-out infinite alternate"
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "rgba(12, 27, 51, 0.95)",
          border: "1px solid rgba(201, 154, 60, 0.3)",
          borderRadius: "24px",
          padding: "36px 28px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(201, 154, 60, 0.15)",
          color: "#ffffff",
          textAlign: "center",
          overflow: "hidden"
        }}
      >
        {/* Adorno superior francés */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
          <span style={{ width: "24px", height: "4px", backgroundColor: "#0055A5", borderRadius: "2px" }} />
          <span style={{ width: "24px", height: "4px", backgroundColor: "#FFFFFF", borderRadius: "2px" }} />
          <span style={{ width: "24px", height: "4px", backgroundColor: "#C8102E", borderRadius: "2px" }} />
        </div>

        {/* Logo animado */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div
            style={{
              position: "relative",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              padding: "4px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 15px rgba(201, 154, 60, 0.4)",
              animation: "floatLogo 4s ease-in-out infinite"
            }}
          >
            <Image
              src="/logo.png"
              alt="Florentin French"
              width={64}
              height={64}
              style={{ objectFit: "contain", borderRadius: "50%" }}
              priority
              onError={(e) => {
                // Fallback por si la imagen tiene otro nombre
                const target = e.target as HTMLImageElement;
                target.src = "/inicio.png";
              }}
            />
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "20px",
            backgroundColor: "rgba(201, 154, 60, 0.15)",
            border: "1px solid rgba(201, 154, 60, 0.3)",
            color: "#f59e0b",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}
        >
          <Sparkles size={12} />
          {content.badge}
        </div>

        {/* Título de bienvenida */}
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px",
            fontFamily: "var(--font-heading, inherit)"
          }}
        >
          {content.welcome}
        </h2>

        {/* Subtítulo */}
        <p
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            margin: "0 0 28px 0",
            lineHeight: 1.5
          }}
        >
          {content.subtitle}
        </p>

        {/* Selección de Idioma */}
        <div style={{ marginBottom: "22px", textAlign: "left" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px"
            }}
          >
            <Globe size={14} style={{ color: "#3b82f6" }} />
            {content.langLabel}
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {[
              { code: "es" as Language, flag: "🇪🇸", name: "Español" },
              { code: "fr" as Language, flag: "🇫🇷", name: "Français" },
              { code: "en" as Language, flag: "🇬🇧", name: "English" }
            ].map((item) => {
              const isSelected = selectedLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedLang(item.code)}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "12px 8px",
                    borderRadius: "14px",
                    border: isSelected
                      ? "2px solid #c99a3c"
                      : "1.5px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: isSelected
                      ? "rgba(201, 154, 60, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#ffffff" : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    outline: "none"
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#c99a3c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0c1b33"
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                  <span style={{ fontSize: "22px" }}>{item.flag}</span>
                  <span style={{ fontSize: "12px", fontWeight: isSelected ? 700 : 500 }}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selección de Moneda */}
        <div style={{ marginBottom: "28px", textAlign: "left" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px"
            }}
          >
            <Coins size={14} style={{ color: "#f59e0b" }} />
            {content.currencyLabel}
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {[
              { code: "eur" as const, symbol: "€", label: "EUR (€)" },
              { code: "usd" as const, symbol: "$", label: "USD ($)" }
            ].map((item) => {
              const isSelected = selectedDivisa === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedDivisa(item.code)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : "1.5px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: isSelected
                      ? "rgba(59, 130, 246, 0.18)"
                      : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#ffffff" : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    outline: "none"
                  }}
                >
                  <span style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    color: "#ffffff"
                  }}>
                    {item.symbol}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: isSelected ? 700 : 500 }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Confirmación */}
        <button
          type="button"
          onClick={handleConfirm}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg, #c99a3c 0%, #f59e0b 100%)",
            color: "#0c1b33",
            fontSize: "15px",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 10px 25px -5px rgba(201, 154, 60, 0.4)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(201, 154, 60, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(201, 154, 60, 0.4)";
          }}
        >
          {content.btnText}
          <ArrowRight size={18} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes welcomeFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(16px);
          }
        }
        @keyframes pulseAura {
          0% {
            transform: scale(0.9) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.1) rotate(10deg);
            opacity: 0.9;
          }
        }
        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
