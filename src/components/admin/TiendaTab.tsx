"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Sparkles, Plus, Edit2, Trash2, Eye, DollarSign,
  CheckCircle, ShieldCheck, ArrowRight, ExternalLink, RefreshCw,
  FileText, Download, Star, ChevronLeft, ChevronRight, AlertCircle,
  HelpCircle, Layers, X, Copy, EyeOff
} from "lucide-react";

export interface GuiaIdioma {
  id: number;
  tagline: string;
  titulo: string;
  subtitulo_italica: string;
  bullets: string[];
  paginas: number;
  precio_eur: number;
  precio_usd: number;
  texto_boton: string;
  badge: string;
  portada_texto_principal: string;
  portada_subtexto_dorado: string;
  portada_detalle_inferior: string;
  url_preview: string;
  url_archivo: string;
  activo: boolean;
}

export interface CuadernoNivel {
  id: number;
  nivel_codigo: "A1" | "A2" | "B1" | "B2";
  nivel_nombre: string;
  titulo: string;
  subtitulo: string;
  paginas: number;
  total_ejercicios: number;
  precio_eur: number;
  precio_usd: number;
  badge: string;
  color_acento: string;
  beneficios: { titulo: string; desc: string }[];
  temario: string[];
  url_preview: string;
  url_archivo: string;
  activo: boolean;
}

interface TiendaTabProps {
  lang?: "es" | "fr";
}

export default function TiendaTab({ lang = "es" }: TiendaTabProps) {
  const [seccionActiva, setSeccionActiva] = useState<"guias" | "cuadernos" | "ventas">("guias");
  const [guias, setGuias] = useState<GuiaIdioma[]>([]);
  const [cuadernos, setCuadernos] = useState<CuadernoNivel[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados de Modales
  const [editandoGuia, setEditandoGuia] = useState<GuiaIdioma | null>(null);
  const [creandoGuia, setCreandoGuia] = useState(false);
  const [nuevaGuia, setNuevaGuia] = useState<Partial<GuiaIdioma>>({
    tagline: "A2–B1 · SUENA NATURAL",
    titulo: "",
    subtitulo_italica: "",
    bullets: ["", "", ""],
    paginas: 15,
    precio_eur: 9.00,
    precio_usd: 10.00,
    texto_boton: "Quiero esta guía →",
    badge: "☆ Novedad",
    portada_texto_principal: "",
    portada_subtexto_dorado: "",
    portada_detalle_inferior: "Guía práctica descargable",
    url_preview: "",
    url_archivo: "",
    activo: true
  });

  const [editandoCuaderno, setEditandoCuaderno] = useState<CuadernoNivel | null>(null);
  const [creandoCuaderno, setCreandoCuaderno] = useState(false);
  const [nuevoCuaderno, setNuevoCuaderno] = useState<Partial<CuadernoNivel>>({
    nivel_codigo: "A1",
    nivel_nombre: "Nivel A1 · Principiante",
    titulo: "",
    subtitulo: "",
    paginas: 85,
    total_ejercicios: 140,
    precio_eur: 24.90,
    precio_usd: 27.90,
    badge: "⭐ Paso a Paso",
    color_acento: "#0055a5",
    beneficios: [
      { titulo: "Ejercicios con Solucionario", desc: "Soluciones explicadas con razonamiento gramatical y cultural." },
      { titulo: "Fonética y Sonidos Trampa", desc: "Técnica anatómica adaptada para hispanohablantes." },
      { titulo: "Situaciones de la Vida Real", desc: "Diálogos auténticos en Francia (cafés, compras, trámites)." },
      { titulo: "Doble Formato", desc: "PDF interactivo para iPad/tablet + versión lista para imprimir." }
    ],
    temario: ["Módulo 1: Introducción", "Módulo 2: Estructuras clave", "Módulo 3: Ejercicios y soluciones"],
    url_preview: "",
    url_archivo: "",
    activo: true
  });

  const [notificacion, setNotificacion] = useState<string | null>(null);

  const mostrarAviso = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Cargar datos iniciales desde la API o localStorage
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch("/api/tienda");
        if (res.ok) {
          const data = await res.json();
          if (data.guias) setGuias(data.guias);
          if (data.cuadernos) setCuadernos(data.cuadernos);
          setCargando(false);
          return;
        }
      } catch (e) {
        console.warn("Fallo al cargar de API, intentando local storage...");
      }

      // Fallback local
      const localGuias = localStorage.getItem("florentin_tienda_guias");
      const localCuadernos = localStorage.getItem("florentin_tienda_cuadernos");
      if (localGuias) setGuias(JSON.parse(localGuias));
      if (localCuadernos) setCuadernos(JSON.parse(localCuadernos));
      setCargando(false);
    };

    cargarDatos();
  }, []);

  // Función para guardar cambios en backend y localStorage
  const sincronizar = async (nuevasGuias: GuiaIdioma[], nuevosCuadernos: CuadernoNivel[]) => {
    setGuias(nuevasGuias);
    setCuadernos(nuevosCuadernos);

    if (typeof window !== "undefined") {
      localStorage.setItem("florentin_tienda_guias", JSON.stringify(nuevasGuias));
      localStorage.setItem("florentin_tienda_cuadernos", JSON.stringify(nuevosCuadernos));
      window.dispatchEvent(new CustomEvent("tienda_actualizada"));
    }

    try {
      await fetch("/api/tienda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guias: nuevasGuias, cuadernos: nuevosCuadernos })
      });
    } catch (err) {
      console.error("Error al sincronizar con /api/tienda:", err);
    }
  };

  // ═══════════════════════════════════════════════
  // ACCIONES PARA GUÍAS DEL IDIOMA
  // ═══════════════════════════════════════════════

  const handleCrearGuia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaGuia.titulo) return;

    const guiaCreada: GuiaIdioma = {
      id: Date.now(),
      tagline: nuevaGuia.tagline || "A2–B1 · SUENA NATURAL",
      titulo: nuevaGuia.titulo || "Nueva Guía Práctica",
      subtitulo_italica: nuevaGuia.subtitulo_italica || "Aprende el francés real del día a día.",
      bullets: nuevaGuia.bullets?.filter(b => b.trim() !== "") || ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
      paginas: Number(nuevaGuia.paginas) || 14,
      precio_eur: Number(nuevaGuia.precio_eur) || 9.00,
      precio_usd: Number(nuevaGuia.precio_usd) || 10.00,
      texto_boton: nuevaGuia.texto_boton || "Quiero sonar natural →",
      badge: nuevaGuia.badge || "☆ Novedad",
      portada_texto_principal: nuevaGuia.portada_texto_principal || nuevaGuia.titulo || "Guía Práctica",
      portada_subtexto_dorado: nuevaGuia.portada_subtexto_dorado || "Edición Especial",
      portada_detalle_inferior: nuevaGuia.portada_detalle_inferior || "Guía descargable",
      url_preview: nuevaGuia.url_preview || "",
      url_archivo: nuevaGuia.url_archivo || "",
      activo: true
    };

    const actualizadas = [guiaCreada, ...guias];
    sincronizar(actualizadas, cuadernos);
    setCreandoGuia(false);
    setNuevaGuia({
      tagline: "A2–B1 · SUENA NATURAL",
      titulo: "",
      subtitulo_italica: "",
      bullets: ["", "", ""],
      paginas: 15,
      precio_eur: 9.00,
      precio_usd: 10.00,
      texto_boton: "Quiero esta guía →",
      badge: "☆ Novedad",
      portada_texto_principal: "",
      portada_subtexto_dorado: "",
      portada_detalle_inferior: "Guía práctica descargable",
      activo: true
    });
    mostrarAviso("¡Nueva Guía creada y publicada con éxito!");
  };

  const handleGuardarEdicionGuia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoGuia) return;

    const actualizadas = guias.map(g => (g.id === editandoGuia.id ? editandoGuia : g));
    sincronizar(actualizadas, cuadernos);
    setEditandoGuia(null);
    mostrarAviso("¡Guía actualizada correctamente!");
  };

  const handleEliminarGuia = (id: number, titulo: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la guía "${titulo}"?`)) {
      const actualizadas = guias.filter(g => g.id !== id);
      sincronizar(actualizadas, cuadernos);
      mostrarAviso(`Guía "${titulo}" eliminada.`);
    }
  };

  const handleToggleActivoGuia = (id: number) => {
    const actualizadas = guias.map(g => (g.id === id ? { ...g, activo: !g.activo } : g));
    sincronizar(actualizadas, cuadernos);
  };

  // ═══════════════════════════════════════════════
  // ACCIONES PARA CUADERNOS POR NIVEL (70-100 PÁGS)
  // ═══════════════════════════════════════════════

  const handleCrearCuaderno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCuaderno.titulo) return;

    const cuadernoCreado: CuadernoNivel = {
      id: Date.now(),
      nivel_codigo: (nuevoCuaderno.nivel_codigo as any) || "A1",
      nivel_nombre: nuevoCuaderno.nivel_nombre || `Nivel ${nuevoCuaderno.nivel_codigo}`,
      titulo: nuevoCuaderno.titulo || "Nuevo Cuaderno de Francés",
      subtitulo: nuevoCuaderno.subtitulo || "100 páginas de actividades intensivas con explicaciones.",
      paginas: Number(nuevoCuaderno.paginas) || 90,
      total_ejercicios: Number(nuevoCuaderno.total_ejercicios) || 150,
      precio_eur: Number(nuevoCuaderno.precio_eur) || 24.90,
      precio_usd: Number(nuevoCuaderno.precio_usd) || 27.90,
      badge: nuevoCuaderno.badge || "⭐ Práctica Intensiva",
      color_acento: nuevoCuaderno.color_acento || "#0055a5",
      beneficios: nuevoCuaderno.beneficios || [],
      temario: nuevoCuaderno.temario || [],
      url_preview: nuevoCuaderno.url_preview || "",
      url_archivo: nuevoCuaderno.url_archivo || "",
      activo: true
    };

    const actualizados = [...cuadernos, cuadernoCreado];
    sincronizar(guias, actualizados);
    setCreandoCuaderno(false);
    mostrarAviso("¡Nuevo Cuaderno de nivel creado con éxito!");
  };

  const handleGuardarEdicionCuaderno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoCuaderno) return;

    const actualizados = cuadernos.map(c => (c.id === editandoCuaderno.id ? editandoCuaderno : c));
    sincronizar(guias, actualizados);
    setEditandoCuaderno(null);
    mostrarAviso("¡Cuaderno de nivel actualizado correctamente!");
  };

  const handleEliminarCuaderno = (id: number, titulo: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el cuaderno "${titulo}"?`)) {
      const actualizados = cuadernos.filter(c => c.id !== id);
      sincronizar(guias, actualizados);
      mostrarAviso(`Cuaderno "${titulo}" eliminado.`);
    }
  };

  const handleToggleActivoCuaderno = (id: number) => {
    const actualizados = cuadernos.map(c => (c.id === id ? { ...c, activo: !c.activo } : c));
    sincronizar(guias, actualizados);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Superior Explicativo */}
      <div className="bg-gradient-to-r from-[#0c1b33] via-[#112a4d] to-[#0c1b33] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            {lang === "fr" ? "Gestion de la Boutique Pédagogique" : "Gestor de Tienda Didáctica"}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif mb-2 tracking-tight">
            {lang === "fr" ? "Catalogue des Cahiers & Guides Florentin" : "Catálogo de Cuadernos y Guías de Florentin"}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {lang === "fr"
              ? "Créez, modifiez ou supprimez vos supports pédagogiques. Tous les changements sont répercutés instantanément sur la boutique en ligne."
              : "Crea nuevos materiales, modifica precios en EUR (€) y USD ($), textos de portada, número de páginas o elimina recursos obsoletos. Todo se sincroniza en vivo con la web."}
          </p>
        </div>
      </div>

      {/* Notificación Flotante de Éxito */}
      {notificacion && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-md animate-fadeIn">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Selector de Sub-pestañas de Gestión */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-xl">
          <button
            onClick={() => setSeccionActiva("guias")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              seccionActiva === "guias" ? "bg-white text-[#0c1b33] shadow-md" : "text-slate-600 hover:text-black"
            }`}
          >
            <BookOpen size={16} className={seccionActiva === "guias" ? "text-blue-600" : ""} />
            <span>Guías del Idioma ({guias.length})</span>
          </button>

          <button
            onClick={() => setSeccionActiva("cuadernos")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              seccionActiva === "cuadernos" ? "bg-white text-[#0c1b33] shadow-md" : "text-slate-600 hover:text-black"
            }`}
          >
            <Layers size={16} className={seccionActiva === "cuadernos" ? "text-amber-600" : ""} />
            <span>Cuadernos por Nivel ({cuadernos.length})</span>
          </button>

          <button
            onClick={() => setSeccionActiva("ventas")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              seccionActiva === "ventas" ? "bg-white text-[#0c1b33] shadow-md" : "text-slate-600 hover:text-black"
            }`}
          >
            <DollarSign size={16} className={seccionActiva === "ventas" ? "text-emerald-600" : ""} />
            <span>Ventas Digitales</span>
          </button>
        </div>

        {/* Botón de Añadir Recurso según la sección */}
        {seccionActiva === "guias" && (
          <button
            onClick={() => setCreandoGuia(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#0055a5] hover:bg-[#003d7a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>+ Crear Nueva Guía</span>
          </button>
        )}

        {seccionActiva === "cuadernos" && (
          <button
            onClick={() => setCreandoCuaderno(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#0c1b33] hover:bg-[#152e55] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>+ Crear Nuevo Cuaderno (70-100p)</span>
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════
          SUBPESTAÑA 1: GUÍAS DEL IDIOMA
      ════════════════════════════════════════════════════════════ */}
      {seccionActiva === "guias" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Guías Prácticas del Idioma (Mini-guías de 10-20 páginas)
              </h3>
              <p className="text-xs text-slate-500">
                Son las que aparecen en el carrusel de `/recursos` con la portada azul marino, badge, checks verdes y botón.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((guia) => (
              <div
                key={guia.id}
                className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative ${
                  guia.activo ? "border-slate-200" : "border-amber-300 bg-amber-50/20 opacity-80"
                }`}
              >
                <div>
                  {/* Mock de la portada azul marino Florentin */}
                  <div className="aspect-[4/3] bg-[#0c1b33] rounded-2xl p-4 text-white flex flex-col justify-between mb-4 border border-blue-900/30 relative shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        {guia.badge}
                      </span>
                      {!guia.activo && (
                        <span className="text-[9px] bg-red-500/80 text-white font-bold px-2 py-0.5 rounded-full">
                          Oculto en tienda
                        </span>
                      )}
                    </div>
                    <div className="text-center my-auto">
                      <p className="text-xs tracking-widest text-slate-300 uppercase font-semibold">
                        LE FRANÇAIS AVEC FLORENTIN
                      </p>
                      <h4 className="text-base font-extrabold text-white mt-1">
                        {guia.portada_texto_principal || guia.titulo}
                      </h4>
                      <p className="text-xs font-bold text-amber-400 mt-0.5">
                        {guia.portada_subtexto_dorado}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-2">
                        {guia.portada_detalle_inferior}
                      </p>
                    </div>
                    <div className="text-[10px] text-right text-slate-400">
                      PDF · {guia.paginas} págs
                    </div>
                  </div>

                  <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                    {guia.tagline}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {guia.titulo}
                  </h4>
                  <p className="text-xs italic text-slate-500 mb-3 font-serif">
                    "{guia.subtitulo_italica}"
                  </p>

                  <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                    {guia.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Acciones: Editar, Visibilidad, Eliminar */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        {guia.precio_eur} € <span className="text-xs text-slate-400">/ ${guia.precio_usd}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Pago único</div>
                    </div>

                    {/* Interruptor Activo/Oculto */}
                    <button
                      onClick={() => handleToggleActivoGuia(guia.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        guia.activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {guia.activo ? <CheckCircle size={12} /> : <EyeOff size={12} />}
                      <span>{guia.activo ? "Visible" : "Pausado"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditandoGuia(guia)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#0c1b33] hover:text-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleEliminarGuia(guia.id, guia.titulo)}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Eliminar guía"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          SUBPESTAÑA 2: CUADERNOS POR NIVEL (70-100 PÁGINAS)
      ════════════════════════════════════════════════════════════ */}
      {seccionActiva === "cuadernos" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Cuadernos de Francés por Nivel (Workbooks 70 a 110 Páginas)
              </h3>
              <p className="text-xs text-slate-500">
                El producto estrella y más completo. Con mockup 3D de libro encuadernado y solucionario explicado paso a paso.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cuadernos.map((cuaderno) => (
              <div
                key={cuaderno.id}
                className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative ${
                  cuaderno.activo ? "border-slate-200" : "border-amber-300 bg-amber-50/20 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full border border-blue-200">
                        {cuaderno.nivel_codigo}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {cuaderno.nivel_nombre}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      📖 {cuaderno.paginas} págs · ✍️ {cuaderno.total_ejercicios} ejercicios
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {cuaderno.titulo}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {cuaderno.subtitulo}
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-3 mb-4 space-y-1.5 text-xs text-slate-600">
                    <div className="font-bold text-slate-700 mb-1">Pilares de valor:</div>
                    {cuaderno.beneficios.map((ben, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle size={13} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 font-medium">{ben.titulo}: {ben.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones: Editar, Visibilidad, Eliminar */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        {cuaderno.precio_eur} € <span className="text-xs text-slate-400">/ ${cuaderno.precio_usd}</span>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Descarga inmediata</div>
                    </div>

                    <button
                      onClick={() => handleToggleActivoCuaderno(cuaderno.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        cuaderno.activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cuaderno.activo ? <CheckCircle size={12} /> : <EyeOff size={12} />}
                      <span>{cuaderno.activo ? "Visible" : "Pausado"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditandoCuaderno(cuaderno)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-[#0c1b33] hover:text-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit2 size={13} />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => handleEliminarCuaderno(cuaderno.id, cuaderno.titulo)}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Eliminar cuaderno"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          SUBPESTAÑA 3: VENTAS Y COMPRAS DIGITALES
      ════════════════════════════════════════════════════════════ */}
      {seccionActiva === "ventas" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registro de Ventas Digitales</h3>
              <p className="text-xs text-slate-500">
                Visualiza las compras procesadas con Stripe y reenvía enlaces de descarga si un alumno lo necesita.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Pasarela Stripe Activa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Alumno / Email</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">
                    50 Expresiones Francesas Esenciales (Guía)
                  </td>
                  <td className="p-3">carlos.m@example.com</td>
                  <td className="p-3 font-bold text-emerald-600">9.00 €</td>
                  <td className="p-3 text-slate-400">Hoy, 18:30</td>
                  <td className="p-3">
                    <button
                      onClick={() => alert("¡Enlace de descarga reenviado a carlos.m@example.com!")}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Reenviar link
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">
                    Cuaderno Completo de Francés A2 (Workbook 95p)
                  </td>
                  <td className="p-3">laura.sanchez@example.com</td>
                  <td className="p-3 font-bold text-emerald-600">24.90 €</td>
                  <td className="p-3 text-slate-400">Ayer, 14:15</td>
                  <td className="p-3">
                    <button
                      onClick={() => alert("¡Enlace de descarga reenviado a laura.sanchez@example.com!")}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Reenviar link
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 1: CREAR NUEVA GUÍA DEL IDIOMA
      ════════════════════════════════════════════════════════════ */}
      {creandoGuia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">+ Crear Nueva Guía del Idioma</h3>
                <p className="text-xs text-slate-500">Aparecerá en el carrusel de Recursos.</p>
              </div>
              <button onClick={() => setCreandoGuia(false)} className="text-slate-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearGuia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Guía *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Los 30 Secretos del Subjuntivo Francés"
                  value={nuevaGuia.titulo}
                  onChange={(e) => setNuevaGuia({ ...nuevaGuia, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo en Cursiva *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Deja de memorizar tablas y habla con la lógica de un nativo."
                  value={nuevaGuia.subtitulo_italica}
                  onChange={(e) => setNuevaGuia({ ...nuevaGuia, subtitulo_italica: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nivel y Categoría</label>
                  <input
                    type="text"
                    value={nuevaGuia.tagline}
                    onChange={(e) => setNuevaGuia({ ...nuevaGuia, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    placeholder="A2–B1 · SUENA NATURAL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={nuevaGuia.badge}
                    onChange={(e) => setNuevaGuia({ ...nuevaGuia, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    placeholder="☆ El favorito"
                  />
                </div>
              </div>

              {/* Portada Azul */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#0c1b33]">
                  Portada (Primera Página del Documento):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Texto Blanco Grande</label>
                    <input
                      type="text"
                      placeholder="Ej: Subjuntivo Fácil"
                      value={nuevaGuia.portada_texto_principal}
                      onChange={(e) => setNuevaGuia({ ...nuevaGuia, portada_texto_principal: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Subtexto Dorado</label>
                    <input
                      type="text"
                      placeholder="Ej: Sin memorizar excepciones"
                      value={nuevaGuia.portada_subtexto_dorado}
                      onChange={(e) => setNuevaGuia({ ...nuevaGuia, portada_subtexto_dorado: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Checks Verdes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Los 3 Puntos Clave (con check verde):
                </label>
                {[0, 1, 2].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Beneficio ${idx + 1}`}
                    value={nuevaGuia.bullets?.[idx] || ""}
                    onChange={(e) => {
                      const nb = [...(nuevaGuia.bullets || ["", "", ""])];
                      nb[idx] = e.target.value;
                      setNuevaGuia({ ...nuevaGuia, bullets: nb });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                ))}
              </div>

              {/* Precios y Páginas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Páginas</label>
                  <input
                    type="number"
                    value={nuevaGuia.paginas}
                    onChange={(e) => setNuevaGuia({ ...nuevaGuia, paginas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio EUR (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={nuevaGuia.precio_eur}
                    onChange={(e) => setNuevaGuia({ ...nuevaGuia, precio_eur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio USD ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={nuevaGuia.precio_usd}
                    onChange={(e) => setNuevaGuia({ ...nuevaGuia, precio_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto Botón de Compra</label>
                <input
                  type="text"
                  value={nuevaGuia.texto_boton}
                  onChange={(e) => setNuevaGuia({ ...nuevaGuia, texto_boton: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  placeholder="Quiero sonar natural →"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
                <button
                  type="button"
                  onClick={() => setCreandoGuia(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0055a5] text-white hover:bg-blue-900 shadow-md cursor-pointer"
                >
                  Publicar Guía en Tienda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 2: EDITAR GUÍA DEL IDIOMA
      ════════════════════════════════════════════════════════════ */}
      {editandoGuia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Editar Guía: {editandoGuia.titulo}</h3>
                <p className="text-xs text-slate-500">Modifica los textos, precios y checks verdes.</p>
              </div>
              <button onClick={() => setEditandoGuia(null)} className="text-slate-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicionGuia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  value={editandoGuia.titulo}
                  onChange={(e) => setEditandoGuia({ ...editandoGuia, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo en Cursiva</label>
                <input
                  type="text"
                  value={editandoGuia.subtitulo_italica}
                  onChange={(e) => setEditandoGuia({ ...editandoGuia, subtitulo_italica: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editandoGuia.tagline}
                    onChange={(e) => setEditandoGuia({ ...editandoGuia, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editandoGuia.badge}
                    onChange={(e) => setEditandoGuia({ ...editandoGuia, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Portada */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#0c1b33]">Textos Portada Azul:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Texto Blanco</label>
                    <input
                      type="text"
                      value={editandoGuia.portada_texto_principal}
                      onChange={(e) => setEditandoGuia({ ...editandoGuia, portada_texto_principal: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Subtexto Dorado</label>
                    <input
                      type="text"
                      value={editandoGuia.portada_subtexto_dorado}
                      onChange={(e) => setEditandoGuia({ ...editandoGuia, portada_subtexto_dorado: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Checks */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Los 3 Puntos Clave:</label>
                {editandoGuia.bullets.map((b, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const nb = [...editandoGuia.bullets];
                      nb[idx] = e.target.value;
                      setEditandoGuia({ ...editandoGuia, bullets: nb });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                ))}
              </div>

              {/* Precios */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Páginas</label>
                  <input
                    type="number"
                    value={editandoGuia.paginas}
                    onChange={(e) => setEditandoGuia({ ...editandoGuia, paginas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio EUR (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editandoGuia.precio_eur}
                    onChange={(e) => setEditandoGuia({ ...editandoGuia, precio_eur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio USD ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editandoGuia.precio_usd}
                    onChange={(e) => setEditandoGuia({ ...editandoGuia, precio_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto Botón</label>
                <input
                  type="text"
                  value={editandoGuia.texto_boton}
                  onChange={(e) => setEditandoGuia({ ...editandoGuia, texto_boton: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
                <button
                  type="button"
                  onClick={() => setEditandoGuia(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0055a5] text-white hover:bg-blue-900 shadow-md cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 3: CREAR NUEVO CUADERNO POR NIVEL
      ════════════════════════════════════════════════════════════ */}
      {creandoCuaderno && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">+ Crear Nuevo Cuaderno por Nivel</h3>
                <p className="text-xs text-slate-500">Producto estrella de 70 a 110 páginas.</p>
              </div>
              <button onClick={() => setCreandoCuaderno(false)} className="text-slate-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearCuaderno} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nivel MCER *</label>
                  <select
                    value={nuevoCuaderno.nivel_codigo}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, nivel_codigo: e.target.value as any, nivel_nombre: `Nivel ${e.target.value}` })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="A1">Nivel A1 (Débutant)</option>
                    <option value="A2">Nivel A2 (Élémentaire)</option>
                    <option value="B1">Nivel B1 (Intermédiaire)</option>
                    <option value="B2">Nivel B2 (Avancé)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={nuevoCuaderno.badge}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    placeholder="⭐ Paso a Paso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título del Cuaderno *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cuaderno Integral de Francés C1: Perfeccionamiento Total"
                  value={nuevoCuaderno.titulo}
                  onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Subtítulo *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explica qué contiene este cuaderno y por qué es imprescindible."
                  value={nuevoCuaderno.subtitulo}
                  onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, subtitulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Páginas</label>
                  <input
                    type="number"
                    value={nuevoCuaderno.paginas}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, paginas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Ejercicios</label>
                  <input
                    type="number"
                    value={nuevoCuaderno.total_ejercicios}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, total_ejercicios: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio EUR (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={nuevoCuaderno.precio_eur}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, precio_eur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio USD ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={nuevoCuaderno.precio_usd}
                    onChange={(e) => setNuevoCuaderno({ ...nuevoCuaderno, precio_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
                <button
                  type="button"
                  onClick={() => setCreandoCuaderno(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0c1b33] text-white hover:bg-blue-900 shadow-md cursor-pointer"
                >
                  Crear Cuaderno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 4: EDITAR CUADERNO POR NIVEL
      ════════════════════════════════════════════════════════════ */}
      {editandoCuaderno && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Editar Cuaderno {editandoCuaderno.nivel_codigo}</h3>
                <p className="text-xs text-slate-500">Modifica títulos, ejercicios, páginas y precios.</p>
              </div>
              <button onClick={() => setEditandoCuaderno(null)} className="text-slate-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicionCuaderno} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  value={editandoCuaderno.titulo}
                  onChange={(e) => setEditandoCuaderno({ ...editandoCuaderno, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editandoCuaderno.subtitulo}
                  onChange={(e) => setEditandoCuaderno({ ...editandoCuaderno, subtitulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Páginas</label>
                  <input
                    type="number"
                    value={editandoCuaderno.paginas}
                    onChange={(e) => setEditandoCuaderno({ ...editandoCuaderno, paginas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Ejercicios</label>
                  <input
                    type="number"
                    value={editandoCuaderno.total_ejercicios}
                    onChange={(e) => setEditandoCuaderno({ ...editandoCuaderno, total_ejercicios: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio EUR (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={editandoCuaderno.precio_eur}
                    onChange={(e) => setEditandoCuaderno({ ...editandoCuaderno, precio_eur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 justify-end">
                <button
                  type="button"
                  onClick={() => setEditandoCuaderno(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0c1b33] text-white hover:bg-blue-900 shadow-md cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
