"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  defaultLang?: Language;
}

export default function FloatingWhatsApp({
  whatsappNumber = "33672023884",
  defaultLang = "es",
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>(defaultLang);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang && ["es", "fr", "en"].includes(savedLang)) {
        setLang(savedLang);
      }
      const handleLangChange = (e: any) => {
        if (e.detail && ["es", "fr", "en"].includes(e.detail)) {
          setLang(e.detail);
        }
      };
      window.addEventListener("florentin_lang_changed", handleLangChange);
      return () => {
        window.removeEventListener("florentin_lang_changed", handleLangChange);
      };
    }
  }, []);

  // Ocultar en el panel de administración y portal del alumno
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/alumno")) {
    return null;
  }

  const cleanWhatsapp = (whatsappNumber || "33672023884").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    lang === "fr"
      ? "Bonjour Florentin, je voudrais réserver mon cours d'essai gratuit."
      : lang === "en"
      ? "Hi Florentin, I want to book my free trial class."
      : "Hola Florentin, quiero agendar mi clase de prueba gratuita."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a Florentin por WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white pl-4 pr-6 py-2.5 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 group hover:bg-[#20ba59]"
      style={{ boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.4)" }}
    >
      <div className="relative">
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.652-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.197 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute -top-1.5 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/85 leading-none">
          {lang === "fr"
            ? "DISPONIBLE MAINTENANT"
            : lang === "en"
            ? "AVAILABLE NOW"
            : "DISPONIBLE AHORA"}
        </span>
        <span className="text-sm font-bold leading-tight">
          {lang === "fr"
            ? "Conseil Gratuit"
            : lang === "en"
            ? "Free Consultation"
            : "Asesoría Gratis"}
        </span>
      </div>
    </a>
  );
}
