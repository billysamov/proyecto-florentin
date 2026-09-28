"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogNavbar from "@/components/blog/BlogNavbar";
import Footer from "@/components/layout/Footer";
import BlogGrid, { ArticuloItem } from "@/components/blog/BlogGrid";
import { Language, translations } from "@/lib/translations";

interface BlogCatalogWrapperProps {
  articulos: ArticuloItem[];
}

export default function BlogCatalogWrapper({ articulos }: BlogCatalogWrapperProps) {
  const [lang, setLang] = useState<Language>("es");

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0c1b33] selection:bg-[#3b82f6]/20 font-sans flex flex-col">
      {/* Header flotante con selector de idioma sincronizado */}
      <BlogNavbar currentLang={lang} onLangChange={(l) => setLang(l)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-[#f8fafc]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#3b82f6]/10 via-[#c99a3c]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif text-[#0c1b33] tracking-tight max-w-3xl mx-auto leading-[1.15] mb-6">
            {t.blogHeroTitle || "Aprende francés con método, cultura y naturalidad."}
          </h1>

          {/* Subtítulo */}
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8">
            {t.blogHeroSubtitle ||
              "Guías prácticas de fonética, gramática explicada de forma sencilla, secretos de la conjugación, arte de vivir y cultura francesa."}
          </p>
        </div>
      </section>

      {/* Main Content / Articles Grid */}
      <main className="container max-w-6xl mx-auto px-4 pb-24 flex-1">
        <BlogGrid articulos={articulos} initialLang={lang} />

        {/* Lead Magnet CTA al final de la página */}
        <section className="mt-20 bg-gradient-to-br from-[#0c1b33] to-[#172a45] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#c99a3c]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-[#c99a3c] font-black text-xs uppercase tracking-widest block mb-2">
              {t.blogCtaBadge || "CLASES 1 A 1 CON PROFESOR NATIVO"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black mb-4 leading-tight">
              {t.blogCtaTitle || "¿Listo para hablar francés con verdadera confianza?"}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              {t.blogCtaDesc ||
                "Sin libros aburridos, ni métodos tradicionales obsoletos. Aprende a comunicarte con claridad como en la vida real o prepárate a un examen u objetivos específicos."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#c99a3c] hover:bg-[#b58832] text-[#0c1b33] font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-105 shadow-lg"
              >
                {t.blogCtaBtn || "Quiero mi Clase de Prueba Gratis"} <ArrowRight size={16} />
              </Link>
              <Link
                href="/#plans"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-full text-sm border border-white/20 transition-colors"
              >
                {t.blogCtaPlansBtn || "Ver Planes de Estudio"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Unificado */}
      <Footer currentLang={lang} />
    </div>
  );
}
