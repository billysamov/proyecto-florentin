"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export default function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/articulos/${slug}`;
    }
    return `https://lefrancaisavecflorentin.com/articulos/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error al copiar enlace:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${title} - Lee este artículo de francés por Florentin: ${getUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${title} via @FlorentinFrances`);
    const url = encodeURIComponent(getUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-slate-200/80 my-8">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
        <Share2 size={15} /> Compartir:
      </span>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-all"
      >
        <span className="text-base leading-none">💬</span> WhatsApp
      </button>

      {/* Twitter / X */}
      <button
        onClick={handleTwitterShare}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
      >
        <span className="text-sm font-black leading-none">𝕏</span> Compartir
      </button>

      {/* Copiar Enlace */}
      <button
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
          copied
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        }`}
      >
        {copied ? (
          <>
            <Check size={14} /> ¡Enlace Copiado!
          </>
        ) : (
          <>
            <LinkIcon size={14} /> Copiar Enlace
          </>
        )}
      </button>
    </div>
  );
}
