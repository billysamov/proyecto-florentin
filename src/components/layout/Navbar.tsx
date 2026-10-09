"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Globe2, Coins } from "lucide-react";
import { Language, translations } from "@/lib/translations";

export type ActivePage = "home" | "clases" | "recursos" | "articulos" | "faq" | "contacto";

interface NavbarProps {
  activePage?: ActivePage;
  currentLang?: Language;
  onLangChange?: (lang: Language) => void;
  onDivisaChange?: (divisa: "eur" | "usd") => void;
  translating?: boolean;
}

export default function Navbar({
  activePage,
  currentLang = "es",
  onLangChange,
  onDivisaChange,
  translating = false
}: NavbarProps) {
  const [lang, setLang] = useState<Language>(currentLang);
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [divisaDropdownOpen, setDivisaDropdownOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const divisaRef = useRef<HTMLDivElement>(null);
  const academyRef = useRef<HTMLDivElement>(null);

  // Sincronizar prop si cambia externamente
  useEffect(() => {
    if (currentLang && currentLang !== lang) {
      setLang(currentLang);
    }
  }, [currentLang, lang]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Leer preferencias guardadas en localStorage
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang && (savedLang === "es" || savedLang === "fr" || savedLang === "en") && savedLang !== lang) {
        setLang(savedLang);
        onLangChange?.(savedLang);
      }
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa && (savedDivisa === "eur" || savedDivisa === "usd") && savedDivisa !== divisa) {
        setDivisa(savedDivisa);
        onDivisaChange?.(savedDivisa);
      }
    }

    const handleLangEvent = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "fr" || e.detail === "en")) {
        setLang((prev) => (prev !== e.detail ? e.detail : prev));
      }
    };
    const handleDivisaEvent = (e: any) => {
      if (e.detail && (e.detail === "eur" || e.detail === "usd")) {
        setDivisa((prev) => (prev !== e.detail ? e.detail : prev));
      }
    };

    window.addEventListener("florentin_lang_changed", handleLangEvent);
    window.addEventListener("florentin_divisa_changed", handleDivisaEvent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("florentin_lang_changed", handleLangEvent);
      window.removeEventListener("florentin_divisa_changed", handleDivisaEvent);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (academyRef.current && !academyRef.current.contains(e.target as Node)) {
        setAcademyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (divisaRef.current && !divisaRef.current.contains(e.target as Node)) {
        setDivisaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLang = (newLang: Language) => {
    if (newLang === lang) {
      setLangDropdownOpen(false);
      return;
    }
    setLang(newLang);
    setLangDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_lang", newLang);
      window.dispatchEvent(new CustomEvent("florentin_lang_changed", { detail: newLang }));
    }
    onLangChange?.(newLang);
  };

  const changeDivisa = (newDivisa: "eur" | "usd") => {
    if (newDivisa === divisa) {
      setDivisaDropdownOpen(false);
      return;
    }
    setDivisa(newDivisa);
    setDivisaDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_divisa", newDivisa);
      window.dispatchEvent(new CustomEvent("florentin_divisa_changed", { detail: newDivisa }));
    }
    onDivisaChange?.(newDivisa);
  };

  const t = translations[lang] || translations.es;

  // Labels localizados para el menú
  const labels = {
    academy: lang === "es" ? "La academia" : lang === "fr" ? "L'Académie" : "The Academy",
    teacher: t.navTeacher || (lang === "es" ? "Profesor" : lang === "fr" ? "Professeur" : "Teacher"),
    method: t.navMethod || (lang === "es" ? "Método" : lang === "fr" ? "Méthode" : "Method"),
    why: (t as any).navWhy || (lang === "es" ? "¿Por qué?" : lang === "fr" ? "Pourquoi ?" : "Why?"),
    forWhom: (t as any).navForWhom || (lang === "es" ? "Para quién" : lang === "fr" ? "Pour qui" : "For whom"),
    faq: t.navFaq || "FAQ",
    clases: lang === "es" ? "Clases" : lang === "fr" ? "Cours" : "Classes",
    recursos: lang === "es" ? "Recursos" : lang === "fr" ? "Ressources" : "Resources",
    articulos: (t as any).navArticles || (lang === "fr" ? "Articles" : "Artículos"),
    contacto: t.navContact || (lang === "fr" ? "Contact" : "Contacto"),
    login: t.navLogin || (lang === "es" ? "Portal Alumno" : lang === "fr" ? "Espace Élève" : "Student Portal")
  };

  return (
    <>
      {/* ═══════════════════════════════════════
          HEADER NAVBAR — Pegado al Techo (Estilo V2)
      ═══════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-200/80 py-3 px-4 sm:px-8"
            : "bg-white/90 backdrop-blur-md border-slate-200/60 py-3.5 px-4 sm:px-8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            {/* Dropdown La Academia */}
            <div
              ref={academyRef}
              className="relative py-2 flex items-center group"
              onMouseEnter={() => setAcademyOpen(true)}
              onMouseLeave={() => setAcademyOpen(false)}
            >
              <button
                onClick={() => setAcademyOpen(!academyOpen)}
                className="flex items-center gap-1 hover:text-[#0c1b33] transition-colors cursor-pointer select-none"
              >
                {labels.academy}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 text-slate-400 ${
                    academyOpen ? "rotate-180 text-[#0c1b33]" : "group-hover:rotate-180"
                  }`}
                />
              </button>

              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2.5 z-50 transition-all duration-200 ${
                  academyOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="w-52 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 overflow-hidden">
                  <Link
                    href="/#teacher"
                    onClick={() => setAcademyOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold"
                  >
                    {labels.teacher}
                  </Link>
                  <Link
                    href="/#method"
                    onClick={() => setAcademyOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold"
                  >
                    {labels.method}
                  </Link>
                  <Link
                    href="/#why"
                    onClick={() => setAcademyOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold"
                  >
                    {labels.why}
                  </Link>
                  <Link
                    href="/#for-whom"
                    onClick={() => setAcademyOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold"
                  >
                    {labels.forWhom}
                  </Link>
                  <Link
                    href="/#faq"
                    onClick={() => setAcademyOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#0c1b33] transition-colors font-semibold"
                  >
                    {labels.faq}
                  </Link>
                </div>
              </div>
            </div>

            {/* Clases */}
            <Link
              href="/clases"
              className={`transition-colors whitespace-nowrap ${
                activePage === "clases" ? "text-[#0055a5] font-bold" : "hover:text-[#0c1b33]"
              }`}
            >
              {labels.clases}
            </Link>

            {/* Recursos */}
            <Link
              href="/recursos"
              className={`transition-colors whitespace-nowrap ${
                activePage === "recursos" ? "text-[#0055a5] font-bold" : "hover:text-[#0c1b33]"
              }`}
            >
              {labels.recursos}
            </Link>

            {/* Artículos */}
            <Link
              href="/articulos"
              className={`transition-colors whitespace-nowrap ${
                activePage === "articulos" ? "text-[#0055a5] font-bold" : "hover:text-[#0c1b33]"
              }`}
            >
              {labels.articulos}
            </Link>

            {/* Contacto */}
            <Link
              href="/#contact"
              className="hover:text-[#0c1b33] transition-colors whitespace-nowrap"
            >
              {labels.contacto}
            </Link>
          </div>

          {/* Right CTA & Controls */}
          <div className="hidden md:flex gap-3 items-center">
            {translating && (
              <div className="flex items-center gap-1 bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider animate-pulse transition-opacity duration-300">
                ⚡ {lang === "es" ? "TRADUCIENDO..." : lang === "fr" ? "TRADUCTION..." : "TRANSLATING..."}
              </div>
            )}

            {/* Dropdown Idioma */}
            <div ref={langRef} className="relative flex items-center">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setDivisaDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Globe2 size={14} className="text-slate-500 shrink-0" />
                {lang.toUpperCase()}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  {(["es", "fr", "en"] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLang(l)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer ${
                        lang === l ? "text-[#3b82f6] bg-blue-50/50" : "text-slate-700"
                      }`}
                    >
                      {l === "es" ? "Español" : l === "fr" ? "Français" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Divisa */}
            <div ref={divisaRef} className="relative flex items-center">
              <button
                onClick={() => {
                  setDivisaDropdownOpen(!divisaDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Coins size={14} className="text-slate-500 shrink-0" />
                {divisa.toUpperCase()}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${divisaDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {divisaDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-24 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  {(["eur", "usd"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => changeDivisa(d)}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer ${
                        divisa === d ? "text-[#3b82f6] bg-blue-50/50" : "text-slate-700"
                      }`}
                    >
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón Login / Portal Alumno */}
            <Link
              href="/alumno"
              className="bg-[#0c1b33] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1a2d4f] hover:scale-105 transition-all shadow-sm"
            >
              {labels.login}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-black rounded-lg cursor-pointer"
            aria-label="Abrir Menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#f8fafc]/98 backdrop-blur-2xl transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-6 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-3.5 text-base sm:text-lg font-bold text-slate-800 max-h-[65vh] overflow-y-auto w-full px-6">
          {/* Subgrupo La academia */}
          <div className="w-full max-w-xs bg-slate-100/70 rounded-2xl p-3 flex flex-col items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0055a5]">
              {labels.academy}
            </span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm font-semibold text-slate-600">
              <Link href="/#teacher" onClick={() => setMenuOpen(false)} className="hover:text-[#0c1b33] transition-colors">
                {labels.teacher}
              </Link>
              <Link href="/#method" onClick={() => setMenuOpen(false)} className="hover:text-[#0c1b33] transition-colors">
                {labels.method}
              </Link>
              <Link href="/#why" onClick={() => setMenuOpen(false)} className="hover:text-[#0c1b33] transition-colors">
                {labels.why}
              </Link>
              <Link href="/#for-whom" onClick={() => setMenuOpen(false)} className="hover:text-[#0c1b33] transition-colors">
                {labels.forWhom}
              </Link>
              <Link href="/#faq" onClick={() => setMenuOpen(false)} className="hover:text-[#0c1b33] transition-colors">
                {labels.faq}
              </Link>
            </div>
          </div>

          <Link
            href="/clases"
            onClick={() => setMenuOpen(false)}
            className={`py-1 transition-colors ${
              activePage === "clases" ? "text-[#0055a5] font-black text-lg" : "text-slate-700 hover:text-[#0c1b33]"
            }`}
          >
            {labels.clases}
          </Link>
          <Link
            href="/recursos"
            onClick={() => setMenuOpen(false)}
            className={`py-1 transition-colors ${
              activePage === "recursos" ? "text-[#0055a5] font-black text-lg" : "text-slate-700 hover:text-[#0c1b33]"
            }`}
          >
            {labels.recursos}
          </Link>
          <Link
            href="/articulos"
            onClick={() => setMenuOpen(false)}
            className={`py-1 transition-colors ${
              activePage === "articulos" ? "text-[#0055a5] font-black text-lg" : "text-slate-700 hover:text-[#0c1b33]"
            }`}
          >
            {labels.articulos}
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="py-1 text-slate-700 hover:text-[#0c1b33] transition-colors"
          >
            {labels.contacto}
          </Link>
        </div>

        {/* Selector de idioma en Móvil */}
        <div className="flex gap-2 text-sm font-bold mt-2">
          {(["es", "fr", "en"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                lang === l ? "bg-[#0c1b33] text-white" : "bg-black/5 text-slate-600"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Selector de divisa en Móvil */}
        <div className="flex gap-2 text-sm font-bold">
          {(["eur", "usd"] as const).map((d) => (
            <button
              key={d}
              onClick={() => changeDivisa(d)}
              className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                divisa === d ? "bg-[#0055a5] text-white" : "bg-black/5 text-slate-600"
              }`}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Botón Portal Alumno en Móvil */}
        <Link
          href="/alumno"
          onClick={() => setMenuOpen(false)}
          className="bg-[#0c1b33] text-white px-8 py-3 rounded-full text-base font-bold shadow-lg mt-1"
        >
          {labels.login}
        </Link>
      </div>
    </>
  );
}
