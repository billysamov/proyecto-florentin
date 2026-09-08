"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Globe2, Coins } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface BlogNavbarProps {
  currentLang?: Language;
  onLangChange?: (lang: Language) => void;
}

export default function BlogNavbar({ currentLang = "es", onLangChange }: BlogNavbarProps) {
  const [lang, setLang] = useState<Language>(currentLang);
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [divisaDropdownOpen, setDivisaDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Leer idioma y divisa guardados en localStorage
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang && (savedLang === "es" || savedLang === "fr" || savedLang === "en")) {
        setLang(savedLang);
        onLangChange?.(savedLang);
      }
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa && (savedDivisa === "eur" || savedDivisa === "usd")) {
        setDivisa(savedDivisa);
      }
    }

    const handleLangEvent = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "fr" || e.detail === "en")) {
        setLang(e.detail);
      }
    };
    const handleDivisaEvent = (e: any) => {
      if (e.detail && (e.detail === "eur" || e.detail === "usd")) {
        setDivisa(e.detail);
      }
    };

    window.addEventListener("florentin_lang_changed", handleLangEvent);
    window.addEventListener("florentin_divisa_changed", handleDivisaEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("florentin_lang_changed", handleLangEvent);
      window.removeEventListener("florentin_divisa_changed", handleDivisaEvent);
    };
  }, [onLangChange]);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    setLangDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_lang", newLang);
      window.dispatchEvent(new CustomEvent("florentin_lang_changed", { detail: newLang }));
    }
    onLangChange?.(newLang);
  };

  const changeDivisa = (newDivisa: "eur" | "usd") => {
    setDivisa(newDivisa);
    setDivisaDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_divisa", newDivisa);
      window.dispatchEvent(new CustomEvent("florentin_divisa_changed", { detail: newDivisa }));
    }
  };

  const t = translations[lang] || translations.es;

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-300 rounded-full px-6 py-3.5 flex items-center justify-between ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border border-slate-200/80"
            : "bg-white/90 backdrop-blur-md shadow-md shadow-black/5 border border-slate-200/60"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-40 sm:w-48 h-10">
            <Image
              src="/logo.png"
              alt="Logo Florentin"
              fill
              sizes="192px"
              className="object-contain object-left transition-transform group-hover:scale-[1.02]"
              priority
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback") as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="logo-fallback hidden w-full h-full text-[#0c1b33] font-black text-sm items-center font-serif">
              FLORENTIN
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-sm font-semibold text-slate-600 items-center">
          {/* Dropdown El Curso */}
          <div className="relative group py-1 flex items-center">
            <button className="flex items-center gap-1 hover:text-[#0c1b33] transition-colors cursor-pointer select-none">
              {lang === "es" ? "El Curso" : lang === "fr" ? "Le Cours" : "The Course"}
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180 text-slate-400" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-52 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 z-50 mt-2">
              <Link href="/#teacher" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">
                {t.navTeacher}
              </Link>
              <Link href="/#method" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">
                {t.navMethod}
              </Link>
              <Link href="/#for-whom" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">
                {lang === "es" ? "Para quién" : lang === "fr" ? "Pour qui" : "For whom"}
              </Link>
              <Link href="/#faq" className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold">
                {t.navFaq}
              </Link>
            </div>
          </div>

          <Link href="/#plans" className="hover:text-[#0c1b33] transition-colors whitespace-nowrap">
            {(t as any).navPlansResources || t.navPlans}
          </Link>

          <Link href="/articulos" className="text-[#0c1b33] font-bold hover:text-[#0c1b33] transition-colors whitespace-nowrap">
            {(t as any).navArticles || (lang === "fr" ? "Articles" : "Artículos")}
          </Link>

          <Link href="/#contact" className="hover:text-[#0c1b33] transition-colors whitespace-nowrap">
            {t.navContact}
          </Link>
        </div>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex gap-3 items-center">
          {/* Idioma */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setDivisaDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Globe2 size={14} className="text-slate-500 shrink-0" />
              {lang.toUpperCase()}
              <ChevronDown size={12} className={`transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                {(["es", "fr", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l)}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${
                      lang === l ? "text-[#3b82f6] bg-blue-50/50" : "text-slate-700"
                    }`}
                  >
                    {l === "es" ? "Español" : l === "fr" ? "Français" : "English"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divisa */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setDivisaDropdownOpen(!divisaDropdownOpen);
                setLangDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Coins size={14} className="text-slate-500 shrink-0" />
              {divisa.toUpperCase()}
              <ChevronDown size={12} className={`transition-transform duration-200 ${divisaDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {divisaDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-24 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                {(["eur", "usd"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => changeDivisa(d)}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${
                      divisa === d ? "text-[#3b82f6] bg-blue-50/50" : "text-slate-700"
                    }`}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/alumno"
            className="bg-[#0c1b33] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1a2d4f] hover:scale-105 transition-all shadow-sm"
          >
            {t.navLogin}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-black rounded-lg"
          aria-label="Abrir Menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#f8fafc]/98 backdrop-blur-2xl transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-6 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-5 text-xl font-bold text-slate-800">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            Inicio
          </Link>
          <Link href="/#teacher" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {t.navTeacher}
          </Link>
          <Link href="/#method" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {t.navMethod}
          </Link>
          <Link href="/#for-whom" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {lang === "es" ? "Para quién" : lang === "fr" ? "Pour qui" : "For whom"}
          </Link>
          <Link href="/#faq" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {t.navFaq}
          </Link>
          <Link href="/#plans" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {(t as any).navPlansResources || t.navPlans}
          </Link>
          <Link href="/articulos" onClick={() => setMenuOpen(false)} className="text-[#0c1b33] font-black">
            {(t as any).navArticles || (lang === "fr" ? "Articles" : "Artículos")}
          </Link>
          <Link href="/#contact" onClick={() => setMenuOpen(false)} className="text-slate-600 hover:text-[#0c1b33]">
            {t.navContact}
          </Link>
        </div>

        <div className="flex gap-2 text-sm font-bold mt-4">
          {(["es", "fr", "en"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                changeLang(l);
              }}
              className={`px-4 py-2 rounded-full transition-colors ${
                lang === l ? "bg-[#0c1b33] text-white" : "bg-black/5 text-slate-600"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2 text-sm font-bold">
          {(["eur", "usd"] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                changeDivisa(d);
              }}
              className={`px-4 py-2 rounded-full transition-colors ${
                divisa === d ? "bg-[#0c1b33] text-white" : "bg-black/5 text-slate-600"
              }`}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        <Link
          href="/alumno"
          onClick={() => setMenuOpen(false)}
          className="bg-[#0c1b33] text-white px-8 py-3 rounded-full text-base font-bold shadow-lg"
        >
          {t.navLogin}
        </Link>
      </div>
    </>
  );
}

