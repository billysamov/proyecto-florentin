"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Globe, Coins, Check, ArrowRight } from "lucide-react";
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
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 300);
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
    }, 400);
  };

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
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? "scale(0.96)" : "scale(1)",
        transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: "welcomeFadeIn 0.4s ease-out forwards"
      }}
    >
      {/* Resplandor decorativo suave */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201, 154, 60, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          borderRadius: "24px",
          padding: "36px 28px",
          boxShadow: "0 20px 50px -10px rgba(12, 27, 51, 0.18), 0 0 30px rgba(201, 154, 60, 0.08)",
          color: "#0c1b33",
          textAlign: "center",
          overflow: "hidden"
        }}
      >
        {/* Adorno superior francés */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
          <span style={{ width: "26px", height: "4px", backgroundColor: "#0055A5", borderRadius: "2px" }} />
          <span style={{ width: "26px", height: "4px", backgroundColor: "#E2E8F0", borderRadius: "2px" }} />
          <span style={{ width: "26px", height: "4px", backgroundColor: "#C8102E", borderRadius: "2px" }} />
        </div>

        {/* Logo LIBRE (sin contenedor circular) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Image
            src="/logo_inicio.png"
            alt="Florentin French"
            width={220}
            height={80}
            style={{
              objectFit: "contain",
              maxHeight: "80px",
              width: "auto",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))"
            }}
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logo.png";
            }}
          />
        </div>

        {/* Saludo MULTILINGÜE simultáneo (los 3 idiomas al mismo tiempo) */}
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#0c1b33",
              margin: "0 0 10px 0",
              lineHeight: 1.3,
              letterSpacing: "-0.5px"
            }}
          >
            <span style={{ color: "#0055A5" }}>Bienvenue !</span>
            <span style={{ margin: "0 6px", color: "#cbd5e1", fontWeight: 300 }}>•</span>
            <span>¡Bienvenido/a!</span>
            <span style={{ margin: "0 6px", color: "#cbd5e1", fontWeight: 300 }}>•</span>
            <span style={{ color: "#c99a3c" }}>Welcome!</span>
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: 0,
              lineHeight: 1.5
            }}
          >
            Selecciona tu idioma y moneda preferidos para comenzar.
            <br />
            <span style={{ fontSize: "12px", opacity: 0.85 }}>
              Choisissez votre langue et votre devise pour continuer.
            </span>
          </p>
        </div>

        {/* Selección de Idioma */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px"
            }}
          >
            <Globe size={14} style={{ color: "#0055A5" }} />
            Idioma / Langue / Language
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
                      : "1.5px solid #e2e8f0",
                    backgroundColor: isSelected
                      ? "rgba(201, 154, 60, 0.08)"
                      : "#f8fafc",
                    color: isSelected ? "#0c1b33" : "#475569",
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
                        color: "#ffffff"
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
        <div style={{ marginBottom: "26px", textAlign: "left" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px"
            }}
          >
            <Coins size={14} style={{ color: "#c99a3c" }} />
            Moneda / Devise / Currency
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
                      : "1.5px solid #e2e8f0",
                    backgroundColor: isSelected
                      ? "rgba(59, 130, 246, 0.08)"
                      : "#f8fafc",
                    color: isSelected ? "#0c1b33" : "#475569",
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
                    backgroundColor: isSelected ? "#3b82f6" : "#e2e8f0",
                    color: isSelected ? "#ffffff" : "#475569"
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
            background: "linear-gradient(135deg, #0c1b33 0%, #1e293b 100%)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 10px 25px -5px rgba(12, 27, 51, 0.3)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(12, 27, 51, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(12, 27, 51, 0.3)";
          }}
        >
          {selectedLang === "fr" ? "Commencer" : selectedLang === "en" ? "Start" : "Comenzar"}
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
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </div>
  );
}
