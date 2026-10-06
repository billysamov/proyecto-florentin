"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Language, translations } from "@/lib/translations";

const Facebook = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  currentLang?: Language;
  whatsappNumber?: string;
  emailContact?: string;
}

export default function Footer({
  currentLang = "es",
  whatsappNumber = "33685744973",
  emailContact = "lefrancaisavecflorentin@outlook.com"
}: FooterProps) {
  const [lang, setLang] = useState<Language>(currentLang);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang && (savedLang === "es" || savedLang === "fr" || savedLang === "en")) {
        setLang(savedLang);
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

  const cleanWhatsapp = (whatsappNumber || "33685744973").replace(/[^0-9]/g, "");
  const formattedWhatsapp = cleanWhatsapp.startsWith("33")
    ? `+33 6 ${cleanWhatsapp.slice(3, 5)} ${cleanWhatsapp.slice(5, 7)} ${cleanWhatsapp.slice(7, 9)} ${cleanWhatsapp.slice(9, 11)}`
    : `+${cleanWhatsapp}`;

  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    lang === "fr"
      ? "Bonjour Florentin, j'ai une question concernant les cours de français."
      : lang === "en"
      ? "Hello Florentin, I have a question about the French classes."
      : "Hola Florentin, tengo una consulta sobre las clases de francés."
  )}`;

  return (
    <footer className="py-16 border-t border-slate-200 bg-white px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        {/* Columna 1 y 2: Marca & Contacto Principal */}
        <div className="flex flex-col gap-3 md:col-span-2">
          <Link href="/" className="inline-block relative h-12 w-48 mb-1">
            <Image
              src="/logo.png"
              alt="Logo Florentin"
              fill
              sizes="192px"
              className="object-contain object-left"
            />
          </Link>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed md:pr-6">
            {lang === "es"
              ? "Academia de francés en línea. Clases particulares y grupales adaptadas a tus objetivos, enfocadas en la conversación fluida."
              : lang === "fr"
              ? "Académie de français en ligne. Cours particuliers et en groupe adaptés à vos objectifs, axés sur la conversation fluide."
              : "Online French academy. Private and group classes tailored to your goals, focused on fluent conversation."}
          </p>

          {/* Contacto Directo: Email y WhatsApp */}
          <div className="flex flex-col gap-2.5 mt-2">
            <a
              href={`mailto:${emailContact}`}
              className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0055a5] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#0055a5]/10 text-[#0055a5] flex items-center justify-center shrink-0">
                <Mail size={13} />
              </div>
              <span className="truncate">{emailContact}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#10b981] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                <Phone size={13} />
              </div>
              <span>{formattedWhatsapp}</span>
            </a>
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center gap-3 mt-3">
            <a
              href="https://www.facebook.com/lefrancaisavecflorentin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-all shadow-2xs"
              aria-label="Facebook de Florentin"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/lefrancaisavecflorentin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-[#e1306c] hover:text-white transition-all shadow-2xs"
              aria-label="Instagram de Florentin"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Columna 3: LA ACADEMIA (Profesor, Método, Por qué, Para quién, FAQ, Contacto) */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
            {lang === "es" ? "La academia" : lang === "fr" ? "L'Académie" : "The Academy"}
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
            <Link href="/#teacher" className="hover:text-[#0c1b33] transition-colors">
              {t.navTeacher || (lang === "es" ? "Profesor" : lang === "fr" ? "Professeur" : "Teacher")}
            </Link>
            <Link href="/#method" className="hover:text-[#0c1b33] transition-colors">
              {t.navMethod || (lang === "es" ? "Método" : lang === "fr" ? "Méthode" : "Method")}
            </Link>
            <Link href="/#why" className="hover:text-[#0c1b33] transition-colors">
              {(t as any).navWhy || (lang === "es" ? "¿Por qué?" : lang === "fr" ? "Pourquoi ?" : "Why?")}
            </Link>
            <Link href="/#for-whom" className="hover:text-[#0c1b33] transition-colors">
              {(t as any).navForWhom || (lang === "es" ? "Para quién" : lang === "fr" ? "Pour qui" : "For whom")}
            </Link>
            <Link href="/#faq" className="hover:text-[#0c1b33] transition-colors">
              {t.navFaq || "FAQ"}
            </Link>
            <Link href="/#contact" className="hover:text-[#0c1b33] transition-colors">
              {t.navContact || (lang === "fr" ? "Contact" : "Contacto")}
            </Link>
          </div>
        </div>

        {/* Columna 4: CURSOS Y RECURSOS */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
            {lang === "es" ? "Cursos & Blog" : lang === "fr" ? "Cours & Blog" : "Courses & Blog"}
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
            <Link href="/clases" className="hover:text-[#0c1b33] transition-colors">
              {lang === "es" ? "Clases" : lang === "fr" ? "Cours" : "Classes"}
            </Link>
            <Link href="/recursos" className="hover:text-[#0c1b33] transition-colors">
              {lang === "es" ? "Recursos" : lang === "fr" ? "Ressources" : "Resources"}
            </Link>
            <Link href="/articulos" className="hover:text-[#0c1b33] transition-colors">
              {lang === "fr" ? "Articles" : "Artículos"}
            </Link>
            <Link href="/alumno" className="hover:text-[#0c1b33] transition-colors">
              {t.navLogin || (lang === "es" ? "Portal Alumnos" : lang === "fr" ? "Portail Élève" : "Student Portal")}
            </Link>
          </div>
        </div>

        {/* Columna 5: POLÍTICAS Y SOPORTE */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-[#0c1b33] text-sm uppercase tracking-wider">
            {lang === "es" ? "Políticas y Soporte" : lang === "fr" ? "Soutien et Politiques" : "Policies & Support"}
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-slate-500 font-semibold">
            <Link href="/privacidad" className="hover:text-[#0c1b33] transition-colors">
              {t.footerPrivacy || (lang === "fr" ? "Politique de confidentialité" : "Política de Privacidad")}
            </Link>
            <Link href="/terminos" className="hover:text-[#0c1b33] transition-colors">
              {t.footerTerms || (lang === "fr" ? "Conditions générales" : "Términos y Condiciones")}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10b981] transition-colors"
            >
              {lang === "es" ? "Soporte en WhatsApp" : lang === "fr" ? "Support WhatsApp" : "WhatsApp Support"}
            </a>
          </div>
        </div>
      </div>

      {/* Separador inferior con Copyright */}
      <div className="max-w-6xl mx-auto border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
        <div>
          &copy; {new Date().getFullYear()} Le Français avec Florentin. {t.footerRights || (lang === "fr" ? "Tous droits réservés." : "Todos los derechos reservados.")}
        </div>
        <div className="text-center sm:text-right">
          <span>
            {lang === "es"
              ? "Plataforma SaaS operada por "
              : lang === "fr"
              ? "Plateforme SaaS opérée par "
              : "SaaS Platform operated by "}
          </span>
          <a
            href="https://introspectiva.digital/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3b82f6] hover:text-[#2563eb] font-bold underline underline-offset-2 transition-colors"
          >
            Introspectiva Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
