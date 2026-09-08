"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ChevronRight, ArrowLeft, ArrowRight, Sparkles, Globe } from "lucide-react";
import BlogNavbar from "@/components/blog/BlogNavbar";
import ArticleContent from "@/components/blog/ArticleContent";
import ArticleShareBar from "@/components/blog/ArticleShareBar";
import { Language, translations } from "@/lib/translations";
import { ArticuloItem } from "@/components/blog/BlogGrid";

interface ArticleClientViewProps {
  articulo: any;
  relacionados: ArticuloItem[];
}

export default function ArticleClientView({ articulo, relacionados }: ArticleClientViewProps) {
  const [lang, setLang] = useState<Language>("es");
  const [dynamicContent, setDynamicContent] = useState<string>(articulo.contenido || "");
  const [dynamicTitle, setDynamicTitle] = useState<string>(articulo.titulo || "");
  const [dynamicExtracto, setDynamicExtracto] = useState<string>(articulo.extracto || "");
  const [isAutoTranslated, setIsAutoTranslated] = useState(false);
  const [translatingOnFly, setTranslatingOnFly] = useState(false);

  // Sincronizar idioma con localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("florentin_lang") as Language;
      if (saved && (saved === "es" || saved === "fr" || saved === "en")) {
        setLang(saved);
      }

      // Registro de visita real protegida contra recargas repetidas
      if (articulo?.id) {
        const visitKey = `florentin_visited_art_${articulo.id}`;
        if (!sessionStorage.getItem(visitKey)) {
          sessionStorage.setItem(visitKey, "true");
          fetch("/api/articulos/visita", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: articulo.id, slug: articulo.slug })
          }).catch((err) => console.warn("Error registrando visita:", err));
        }
      }
    }

    const handleLangEvent = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "fr" || e.detail === "en")) {
        setLang(e.detail);
      }
    };
    window.addEventListener("florentin_lang_changed", handleLangEvent);
    return () => window.removeEventListener("florentin_lang_changed", handleLangEvent);
  }, [articulo?.id, articulo?.slug]);

  // Actualizar contenido según el idioma seleccionado
  useEffect(() => {
    let cancelled = false;

    const updateForLanguage = async () => {
      if (lang === "fr") {
        if (articulo.contenido_fr && articulo.titulo_fr) {
          setDynamicTitle(articulo.titulo_fr);
          setDynamicExtracto(articulo.extracto_fr || articulo.extracto || "");
          setDynamicContent(articulo.contenido_fr);
          setIsAutoTranslated(false);
        } else {
          // Fallback a traducción automática gratuita con MyMemory
          setTranslatingOnFly(true);
          try {
            const res = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                articulo.titulo
              )}&langpair=es|fr`
            );
            const data = await res.json();
            if (!cancelled && data?.responseData?.translatedText) {
              setDynamicTitle(data.responseData.translatedText);
            }
          } catch (e) {}

          try {
            const resC = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                articulo.contenido.slice(0, 500)
              )}&langpair=es|fr`
            );
            const dataC = await resC.json();
            if (!cancelled && dataC?.responseData?.translatedText) {
              setDynamicContent(dataC.responseData.translatedText + "\n\n*(Suite traduite automatiquement)*");
              setIsAutoTranslated(true);
            }
          } catch (e) {
            if (!cancelled) setDynamicContent(articulo.contenido);
          } finally {
            if (!cancelled) setTranslatingOnFly(false);
          }
        }
      } else if (lang === "en") {
        if (articulo.contenido_en && articulo.titulo_en) {
          setDynamicTitle(articulo.titulo_en);
          setDynamicExtracto(articulo.extracto_en || articulo.extracto || "");
          setDynamicContent(articulo.contenido_en);
          setIsAutoTranslated(false);
        } else {
          // Fallback a traducción automática gratuita con MyMemory
          setTranslatingOnFly(true);
          try {
            const res = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                articulo.titulo
              )}&langpair=es|en`
            );
            const data = await res.json();
            if (!cancelled && data?.responseData?.translatedText) {
              setDynamicTitle(data.responseData.translatedText);
            }
          } catch (e) {}

          try {
            const resC = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                articulo.contenido.slice(0, 500)
              )}&langpair=es|en`
            );
            const dataC = await resC.json();
            if (!cancelled && dataC?.responseData?.translatedText) {
              setDynamicContent(dataC.responseData.translatedText + "\n\n*(Remainder auto-translated)*");
              setIsAutoTranslated(true);
            }
          } catch (e) {
            if (!cancelled) setDynamicContent(articulo.contenido);
          } finally {
            if (!cancelled) setTranslatingOnFly(false);
          }
        }
      } else {
        // Español original
        setDynamicTitle(articulo.titulo);
        setDynamicExtracto(articulo.extracto || "");
        setDynamicContent(articulo.contenido);
        setIsAutoTranslated(false);
      }
    };

    updateForLanguage();

    return () => {
      cancelled = true;
    };
  }, [lang, articulo]);

  const t = translations[lang] || translations.es;
  const localeCode = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES";

  const fechaFormateada = new Date(articulo.creado_en).toLocaleDateString(localeCode, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0c1b33] selection:bg-[#3b82f6]/20 font-sans flex flex-col">
      {/* Header flotante */}
      <BlogNavbar currentLang={lang} onLangChange={(l) => setLang(l)} />

      {/* Main Container */}
      <main className="pt-28 sm:pt-36 pb-20 flex-1">
        <article className="container max-w-4xl mx-auto px-4">
          {/* Breadcrumbs y Volver */}
          <div className="flex items-center justify-between gap-4 mb-8 text-xs font-semibold text-slate-500">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
              <Link href="/" className="hover:text-[#0c1b33] transition-colors">
                {t.blogBreadcrumbHome || "Inicio"}
              </Link>
              <ChevronRight size={12} className="text-slate-400" />
              <Link href="/articulos" className="hover:text-[#0c1b33] transition-colors">
                {t.blogBreadcrumbArticles || "Artículos"}
              </Link>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
                {dynamicTitle}
              </span>
            </nav>

            <Link
              href="/articulos"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#0c1b33] bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm shrink-0 transition-all hover:-translate-x-0.5"
            >
              <ArrowLeft size={13} /> {t.blogBackBtn || "Volver a Artículos"}
            </Link>
          </div>

          {/* Banner de Idioma Seleccionado y Aviso de Auto-Traducción */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Globe size={15} className="text-[#3b82f6]" />
              <span>{lang === "fr" ? "Langue d'affichage :" : lang === "en" ? "Display language:" : "Idioma de lectura:"}</span>
              <div className="inline-flex gap-1 ml-1">
                {(["es", "fr", "en"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      localStorage.setItem("florentin_lang", l);
                      window.dispatchEvent(new CustomEvent("florentin_lang_changed", { detail: l }));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      lang === l
                        ? "bg-[#0c1b33] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {isAutoTranslated && (
              <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <span>⚡ {t.blogAutoTranslated || "Traducido automáticamente"}</span>
                <button
                  onClick={() => setLang("es")}
                  className="underline hover:text-amber-900 font-bold ml-1"
                >
                  {t.blogViewOriginal || "Ver original (ES)"}
                </button>
              </div>
            )}
          </div>

          {/* Cabecera del Artículo */}
          <header className="mb-8">
            {/* Badges y Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-4">
              {articulo.categoria && (
                <span className="bg-[#0c1b33] text-white px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                  {articulo.categoria}
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl">
                <Clock size={13} className="text-[#c99a3c]" />
                {articulo.tiempo_lectura || 5} {t.blogReadTime || "min de lectura"}
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl">
                <Calendar size={13} />
                {fechaFormateada}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#0c1b33] tracking-tight leading-[1.2] mb-6">
              {dynamicTitle}
            </h1>

            {/* Extracto Destacado */}
            {dynamicExtracto && (
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 border-l-4 border-[#c99a3c] pl-4 italic">
                {dynamicExtracto}
              </p>
            )}

            {/* Autor Card */}
            <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0c1b33] text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-[#c99a3c] shadow-sm">
                  F
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0c1b33]">
                    {articulo.autor || "Florentin"}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {t.blogAuthorRole || "Profesor Nativo de París • Le Français avec Florentin"}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Imagen de Portada Principal */}
          {articulo.imagen_portada && (
            <div className="relative w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 mb-10 bg-slate-100">
              <Image
                src={articulo.imagen_portada}
                alt={dynamicTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          )}

          {/* Barra de Compartir Superior */}
          <ArticleShareBar title={dynamicTitle} slug={articulo.slug} />

          {/* Cuerpo del Artículo */}
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm mb-12">
            {translatingOnFly ? (
              <div className="py-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c1b33] mb-3" />
                <p className="text-sm font-semibold">Traduciendo artículo...</p>
              </div>
            ) : (
              <ArticleContent content={dynamicContent} />
            )}
          </div>

          {/* Barra de Compartir Inferior */}
          <ArticleShareBar title={dynamicTitle} slug={articulo.slug} />

          {/* Tarjeta del Autor y Conversión 1 a 1 */}
          <section className="bg-gradient-to-br from-[#0c1b33] to-[#172a45] rounded-3xl p-8 sm:p-10 text-white shadow-xl my-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c99a3c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#c99a3c] text-[#0c1b33] flex items-center justify-center font-serif text-3xl font-black shrink-0 border-4 border-white/20 shadow-lg">
                F
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="text-[#c99a3c] font-black text-xs uppercase tracking-widest block mb-1">
                  {t.blogAuthorCtaBadge || "APRENDE CON UN NATIVO"}
                </span>
                <h3 className="text-2xl font-serif font-black mb-3">
                  {t.blogAuthorCtaTitle || "¿Quieres mejorar tu francés mucho más rápido?"}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {t.blogAuthorCtaDesc ||
                    "Soy Florentin, profesor nativo de París. En mis clases personalizadas 1 a 1 nos enfocamos en tus objetivos reales: fluidez, pronunciación exacta, preparación de exámenes DELF o conversación cotidiana."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#c99a3c] hover:bg-[#b58832] text-[#0c1b33] font-bold px-6 py-3 rounded-full text-xs transition-all hover:scale-105 shadow-md"
                  >
                    {t.blogAuthorCtaBtn || "Reservar Clase de Prueba Gratis (20 min)"} <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/#plans"
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-xs border border-white/20 transition-colors"
                  >
                    {t.blogAuthorCtaPlans || "Ver Planes Disponibles"}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Artículos Recomendados */}
          {relacionados.length > 0 && (
            <section className="mt-16 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-[#0c1b33]">
                  {t.blogRelatedTitle || "Otros artículos que te interesarán"}
                </h3>
                <Link
                  href="/articulos"
                  className="text-xs font-bold text-[#3b82f6] hover:underline inline-flex items-center gap-1"
                >
                  {t.blogViewAll || "Ver todos los artículos"} <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relacionados.map((rel) => {
                  const relTitle =
                    lang === "fr"
                      ? rel.titulo_fr || rel.titulo
                      : lang === "en"
                      ? rel.titulo_en || rel.titulo
                      : rel.titulo;

                  return (
                    <Link
                      key={rel.id}
                      href={`/articulos/${rel.slug}`}
                      className="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={rel.imagen_portada || "/french_hero.png"}
                          alt={relTitle}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-[#c99a3c] uppercase tracking-wider block mb-1">
                          {rel.categoria}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#0c1b33] group-hover:text-[#3b82f6] transition-colors line-clamp-2 leading-snug mb-1">
                          {relTitle}
                        </h4>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={12} /> {rel.tiempo_lectura} {t.blogReadTime || "min"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Le Français avec Florentin. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#0c1b33] transition-colors">
              {t.blogBreadcrumbHome || "Inicio"}
            </Link>
            <Link href="/articulos" className="hover:text-[#0c1b33] transition-colors">
              {t.blogBreadcrumbArticles || "Artículos"}
            </Link>
            <Link href="/privacidad" className="hover:text-[#0c1b33] transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-[#0c1b33] transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
