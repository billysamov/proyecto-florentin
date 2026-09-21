"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, ShieldCheck, BookOpen, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ContenidoExito() {
  const searchParams = useSearchParams();
  const titulo = searchParams.get("titulo") || "Tu Material Pedagógico";
  const email = searchParams.get("email") || "tu correo";

  const handleDescargar = () => {
    // Generación de descarga simulada de demostración
    const blob = new Blob(
      [
        `=======================================================\n` +
        `LE FRANÇAIS AVEC FLORENTIN - DOCUMENTO OFICIAL\n` +
        `=======================================================\n\n` +
        `Título: ${titulo}\n` +
        `Licencia: Uso personal de ${email}\n\n` +
        `¡Félicitations! Has adquirido este material didáctico.\n` +
        `En el entorno de producción final de Supabase Storage,\n` +
        `este botón inicia la descarga del PDF de alta resolución.\n\n` +
        `Merci beaucoup pour votre confiance!\n` +
        `- Florentin\n`
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titulo.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Glow decorativo */}
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={52} className="text-emerald-500 animate-bounce" />
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200 mb-4">
          ✓ Pago Confirmado con Éxito
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0c1b33] font-serif mb-3 leading-tight">
          ¡Félicitations! Tu documento está listo
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Has adquirido exitosamente <strong className="text-slate-900 font-bold">"{titulo}"</strong>. Puedes descargarlo inmediatamente a continuación.
        </p>

        {/* Botón Principal de Descarga */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleDescargar}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0055a5] hover:bg-[#003d7a] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center justify-center gap-3"
          >
            <Download size={20} />
            <span>Descargar Documento Completo (PDF)</span>
          </button>
          
          <p className="text-xs text-slate-400">
            Descarga en alta resolución · Compatible con tablet, iPad o impresión física
          </p>
        </div>

        {/* Caja de Reaseguro */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-2 mb-8 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Copia de seguridad enviada a tu correo</span>
          </div>
          <p className="text-slate-500 pl-6">
            Hemos enviado un enlace de respaldo permanente a tu correo por si necesitas descargarlo en otro dispositivo.
          </p>
        </div>

        {/* Enlaces de Retorno */}
        <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-slate-100 text-xs font-bold">
          <Link
            href="/recursos"
            className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ← Volver a Recursos Pedagógicos
          </Link>
          <Link
            href="/alumno"
            className="px-5 py-2.5 rounded-xl bg-[#0c1b33] text-white hover:bg-blue-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Ir a mi Portal de Alumno</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function RecursosExitoPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="pt-28 pb-12">
        <Suspense fallback={<div className="text-center py-20 text-slate-400">Cargando confirmación...</div>}>
          <ContenidoExito />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
