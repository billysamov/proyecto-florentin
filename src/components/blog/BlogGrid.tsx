"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, Calendar, ArrowRight, BookOpen, X } from "lucide-react";
import { Language, translations } from "@/lib/translations";

export interface ArticuloItem {
  id: number;
  slug: string;
  titulo: string;
  extracto: string | null;
  contenido?: string;
  titulo_fr?: string | null;
  extracto_fr?: string | null;
  contenido_fr?: string | null;
  titulo_en?: string | null;
  extracto_en?: string | null;
  contenido_en?: string | null;
  imagen_portada: string | null;
  categoria: string | null;
  palabras_clave: string | null;
  tiempo_lectura: number | null;
  idioma: string | null;
  autor: string | null;
  visitas: number | null;
  creado_en: string;
  fecha_publicacion?: string | null;
}

interface BlogGridProps {
  articulos: ArticuloItem[];
  initialLang?: Language;
}

export default function BlogGrid({ articulos, initialLang = "es" }: BlogGridProps) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  // Sincronizar idioma con localStorage y eventos de BlogNavbar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("florentin_lang") as Language;
      if (saved && (saved === "es" || saved === "fr" || saved === "en")) {
        setLang(saved);
      }
    }

    const handleLangEvent = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "fr" || e.detail === "en")) {
        setLang(e.detail);
      }
    };
    window.addEventListener("florentin_lang_changed", handleLangEvent);
    return () => window.removeEventListener("florentin_lang_changed", handleLangEvent);
  }, []);

  const t = translations[lang] || translations.es;

  // Obtener categorías dinámicas únicas
  const categories = useMemo(() => {
    const set = new Set<string>();
    articulos.forEach((a) => {
      if (a.categoria) set.add(a.categoria);
    });
    return ["Todos", ...Array.from(set)];
  }, [articulos]);

  // Filtrado de artículos reactivo
  const filtered = useMemo(() => {
    return articulos.filter((art) => {
      const tit = (lang === "fr" ? art.titulo_fr || art.titulo : lang === "en" ? art.titulo_en || art.titulo : art.titulo) || "";
      const ext = (lang === "fr" ? art.extracto_fr || art.extracto : lang === "en" ? art.extracto_en || art.extracto : art.extracto) || "";

      const matchSearch =
        searchTerm === "" ||
        tit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ext.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.extracto && art.extracto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.palabras_clave && art.palabras_clave.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === "Todos" || art.categoria === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [articulos, searchTerm, selectedCategory, lang]);

  return (
    <div className="w-full">
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Input Buscador */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.blogSearchPlaceholder || "Buscar por tema o palabra clave..."}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] text-sm text-slate-800 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Selector Rápido de Idioma en el Grid */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.blogLanguageFilter || "Idioma:"}
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {[
                { id: "es", label: "Español" },
                { id: "fr", label: "Français" },
                { id: "en", label: "English" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setLang(opt.id as Language);
                    localStorage.setItem("florentin_lang", opt.id);
                    window.dispatchEvent(new CustomEvent("florentin_lang_changed", { detail: opt.id }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === opt.id
                      ? "bg-white text-[#0c1b33] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Píldoras de Categorías */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-5 border-t border-slate-100 mt-5">
            {categories.map((cat) => {
              const label = cat === "Todos" ? (t.blogAllFilter || "Todos") : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                    selectedCategory === cat
                      ? "bg-[#0c1b33] text-white shadow-sm scale-105"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0c1b33]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid de Artículos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((art) => {
            const localeCode = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES";
            const fecha = new Date(art.fecha_publicacion || art.creado_en).toLocaleDateString(localeCode, {
              day: "numeric",
              month: "short",
              year: "numeric"
            });

            // Selección del título y extracto según el idioma activo
            const tituloMostrar =
              lang === "fr"
                ? art.titulo_fr || art.titulo
                : lang === "en"
                ? art.titulo_en || art.titulo
                : art.titulo;

            const extractoMostrar =
              lang === "fr"
                ? art.extracto_fr || art.extracto
                : lang === "en"
                ? art.extracto_en || art.extracto
                : art.extracto;

            return (
              <article
                key={art.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Imagen de Portada */}
                <Link href={`/articulos/${art.slug}`} className="relative h-52 w-full overflow-hidden bg-slate-100 block">
                  <Image
                    src={art.imagen_portada || "/french_hero.png"}
                    alt={tituloMostrar}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = "/french_hero.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge de Categoría */}
                  {art.categoria && (
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#0c1b33] text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md border border-white/50">
                      {art.categoria}
                    </span>
                  )}

                  {/* Badge de Idioma Actual */}
                  <span className="absolute top-4 right-4 bg-[#0c1b33]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    {lang.toUpperCase()}
                  </span>
                </Link>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info (tiempo lectura y fecha) */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-[#c99a3c]" />
                        {art.tiempo_lectura || 5} {t.blogReadTime || "min de lectura"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {fecha}
                      </span>
                    </div>

                    {/* Título */}
                    <Link href={`/articulos/${art.slug}`}>
                      <h2 className="text-xl font-bold font-serif text-[#0c1b33] group-hover:text-[#3b82f6] transition-colors line-clamp-2 leading-snug mb-3">
                        {tituloMostrar}
                      </h2>
                    </Link>

                    {/* Extracto */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 font-medium">
                      {extractoMostrar || "Aprende los mejores consejos y métodos para dominar el francés conmigo."}
                    </p>
                  </div>

                  {/* Footer de Tarjeta */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0c1b33] text-white flex items-center justify-center text-xs font-bold font-serif border border-[#c99a3c]">
                        F
                      </div>
                      <span className="text-xs font-bold text-slate-700">{art.autor || "Florentin"}</span>
                    </div>

                    <Link
                      href={`/articulos/${art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0c1b33] group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all"
                    >
                      {t.blogReadArticle || "Leer artículo"} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Estado Vacío */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-blue-50 text-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#0c1b33] mb-2 font-serif">
            {t.blogNoResults || "No se encontraron artículos"}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {searchTerm || selectedCategory !== "Todos"
              ? (t.blogNoResultsDesc || "No hay resultados para los filtros seleccionados.")
              : "Próximamente estaremos publicando nuevas guías y artículos educativos. ¡Vuelve a consultar pronto!"}
          </p>
          {(searchTerm || selectedCategory !== "Todos") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
              className="bg-[#0c1b33] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              {t.blogResetFilters || "Restablecer filtros"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
