"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PlayCircle, Check, GraduationCap } from "lucide-react";

// ─── Tipos de Props ────────────────────────────────────────────────────────────
export interface HeroBadgeItem {
  iconType: "check" | "euro";
  label: string;
  position: "top-right" | "center-left";
}

export interface HeroV2Props {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  returnLink?: { label: string; href: string };
  badges?: HeroBadgeItem[];
  socialProof?: {
    avatars: { src: string; alt: string }[];
    text: string;
  };
  /** Imagen central — reemplazar con foto tematica de frances */
  heroImage?: { src: string; alt: string };
  /** Imagen panel derecho — niveles de idioma A1-C2 */
  progressImage?: { src: string; alt: string };
  progressCard?: { title: string; description: string };
  marqueeItems?: { flag?: string; label: string }[];
}

// ─── Valores por defecto ──────────────────────────────────────────────────────
const DEFAULT_BADGES: HeroBadgeItem[] = [
  { iconType: "check", label: "Exito garantizado", position: "top-right" },
  { iconType: "euro",  label: "Bajo costo",         position: "center-left" },
];

const DEFAULT_MARQUEE = [
  { flag: "🇫🇷", label: "Nativo de Paris"       },
  { flag: "🎙️", label: "Correccion de Acento" },
  { flag: "📅", label: "Horarios Flexibles"   },
  { flag: "💻", label: "Clases 1 a 1"         },
  { flag: "🏆", label: "DALF C2"              },
  { flag: "🌍", label: "+200 Alumnos"         },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function HeroV2({
  title       = "Domina el frances con clases personalizadas",
  description = "Aprende a tu propio ritmo con un profesor nativo y cualificado. Flexibilidad, materiales didacticos y conversacion fluida.",
  primaryCta   = { label: "Empezar ahora", href: "https://wa.me/33744321356" },
  secondaryCta = { label: "Ver demo",      href: "#sec-3-5-video" },
  returnLink   = { label: "Finaliza tu inscripcion", href: "/alumno" },
  badges       = DEFAULT_BADGES,
  socialProof  = {
    avatars: [
      { src: "/perfilfoto.jpeg", alt: "Alumno 1" },
      { src: "/perfilfoto.jpeg", alt: "Alumno 2" },
      { src: "/perfilfoto.jpeg", alt: "Alumno 3" },
    ],
    text: "Mas de 200 alumnos aprenden con Florentin.",
  },
  heroImage     = { src: "/teacher_hero.png",  alt: "Profesor de frances sonriendo, camisa verde" },
  progressImage = { src: "/level_progress_clay.png", alt: "Niveles de idioma A1 a C2" },
  progressCard  = { title: "Crecimiento del Nivel", description: "De A1 a C2 con un metodo probado." },
  marqueeItems  = DEFAULT_MARQUEE,
}: HeroV2Props) {

  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <section
      id="sec-2-hero"
      aria-label="Hero principal"
      className="bg-[#fafafa] overflow-hidden px-5 pt-14 pb-20 md:px-10 lg:px-16"
    >
      {/* ── Grid 3 columnas ── */}
      <div className="mx-auto max-w-[1480px] grid grid-cols-1 gap-8 items-stretch lg:grid-cols-[1.2fr_1.7fr_0.95fr] lg:gap-7 xl:gap-10">

        {/* COL 1: Titulo, descripcion y CTAs */}
        <div className="flex flex-col justify-center pt-2 lg:pt-5">

          <h1 className="font-extrabold leading-tight tracking-tight text-teal-900 mb-5 text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Descripcion — margen compacto (fix problema 4) */}
          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-5 max-w-md md:text-base">
            {description}
          </p>

          {/* Botones CTA */}
          <div className="flex items-center gap-6 flex-wrap mb-5">
            <a
              href={primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 pl-1.5 pr-6 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-900 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-800 text-white">
                <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </span>
              {primaryCta.label}
            </a>

            <a
              href={secondaryCta.href}
              className="inline-flex items-center gap-2.5 text-sm font-bold text-slate-900 hover:opacity-70 transition-opacity duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 rounded"
            >
              <PlayCircle size={28} className="text-teal-800" strokeWidth={1.5} aria-hidden="true" />
              {secondaryCta.label}
            </a>
          </div>

          {/* Link de regreso con banner sutil (fix problema 3) */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-2 rounded-lg bg-teal-50 border border-teal-100">
            <span className="text-sm text-slate-500 font-medium">Ya empezaste?</span>
            <Link
              href={returnLink.href}
              className="text-sm font-bold text-teal-800 underline underline-offset-2 hover:text-teal-600 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 rounded"
            >
              {returnLink.label}
            </Link>
            <ArrowUpRight size={14} className="text-teal-700" aria-hidden="true" />
          </div>

        </div>

        {/* COL 2: Imagen central — todo el diseño (fondo beige + mujer) horneado en un solo PNG */}
        <div className="relative flex items-center justify-center min-h-[460px] lg:min-h-[520px]">

          <Image
            src="/perfect_hero_image.png"
            alt={heroImage.alt}
            width={650}
            height={650}
            priority
            className="relative z-10 w-full h-full object-contain"
          />

          {/* Badge superior derecho */}
          {badges.filter(b => b.position === "top-right").map((badge, i) => (
            <div
              key={i}
              className="absolute top-[16%] -right-2 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/80 shadow-lg"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/90">
                <Check size={13} strokeWidth={3} className="text-teal-800" />
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}

          {/* Badge centro izquierdo */}
          {badges.filter(b => b.position === "center-left").map((badge, i) => (
            <div
              key={i}
              className="absolute top-[52%] left-3 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/80 shadow-lg"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/90 text-xs font-black text-teal-800">
                €
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}

          {/* Prueba social: avatares + texto */}
          {socialProof && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <div className="flex">
                {socialProof.avatars.map((av, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-md"
                    style={{ marginLeft: i === 0 ? 0 : "-10px" }}
                  >
                    <Image src={av.src} alt={av.alt} width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-700 drop-shadow leading-snug max-w-[150px]">
                {socialProof.text}
              </p>
            </div>
          )}

        </div>

        {/* COL 3: Panel lateral — progreso de idioma */}
        <div className="flex flex-col gap-7 justify-end">

          {/* Contenedor de imagen de niveles: fondo beige para que la imagen 1:1 flote en el espacio vertical 1:3 */}
          <div className="flex-1 w-full min-h-[260px] bg-[#e7e5e3] rounded-3xl flex items-center justify-center relative">
            <Image
              src={progressImage.src}
              alt={progressImage.alt}
              fill
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>

          {/* Tarjeta inferior de descripcion */}
          <div className="flex items-center gap-5">
            <div
              aria-hidden="true"
              className="flex-shrink-0 w-14 h-14 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-lg shadow-teal-900/20"
            >
              <GraduationCap size={26} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 mb-0.5">
                {progressCard?.title}
              </h4>
              <p className="text-xs font-medium text-slate-500 leading-snug">
                {progressCard?.description}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ── Marquee de especialidades ── */}
      <div className="mt-16 overflow-hidden w-full" aria-hidden="true">
        <div className="flex gap-10 whitespace-nowrap marquee-smooth-track">
          {doubled.map((item, i) => (
            <div key={i} className="inline-flex items-center gap-3 text-base font-semibold text-slate-400">
              {item.flag && <span className="text-lg opacity-60">{item.flag}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
