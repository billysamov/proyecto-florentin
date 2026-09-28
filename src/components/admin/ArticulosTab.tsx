"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ArticleContent from "@/components/blog/ArticleContent";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { translateArticleBundle, translateTextChunk, translateLongText } from "@/lib/translator";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  FileText,
  Save,
  Globe,
  Upload,
  FolderOpen,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";

export interface ArticuloAdmin {
  id: number;
  slug: string;
  titulo: string;
  extracto: string | null;
  contenido: string;
  titulo_fr?: string | null;
  extracto_fr?: string | null;
  contenido_fr?: string | null;
  titulo_en?: string | null;
  extracto_en?: string | null;
  contenido_en?: string | null;
  imagen_portada: string | null;
  categoria: string | null;
  palabras_clave: string | null;
  meta_titulo: string | null;
  meta_descripcion: string | null;
  tiempo_lectura: number | null;
  idioma: string;
  autor: string | null;
  publicado: boolean;
  fecha_publicacion?: string | null;
  visitas: number;
  creado_en: string;
  actualizado_en: string;
}

interface ArticulosTabProps {
  lang?: "es" | "fr";
}

// Portadas predefinidas de alta calidad para selección rápida
const PRESET_IMAGES = [
  {
    name: "Francia & Cultura",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Café & Bistro Francés",
    url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Calles de Francia",
    url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Libros y Estudio",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"
  }
];

const CATEGORIAS_PRESET = [
  "Pronunciación",
  "Gramática",
  "Vocabulario",
  "Cultura & Viajes",
  "Consejos",
  "Exámenes DELF"
];

// Helper para convertir título a Slug limpio
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
    .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-"); // Guiones repetidos
};

export default function ArticulosTab({ lang = "es" }: ArticulosTabProps) {
  const [articulos, setArticulos] = useState<ArticuloAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "publicados" | "programados" | "borradores">("todos");
  const [tableMissing, setTableMissing] = useState(false);

  // Estados del Modal de Edición / Creación
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [autoTraduciendo, setAutoTraduciendo] = useState(false);
  const [estadoTraduccion, setEstadoTraduccion] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // Capa activa de idioma para el modal: 'es' | 'fr' | 'en'
  const [capaIdioma, setCapaIdioma] = useState<"es" | "fr" | "en">("es");

  // Campos Capa Español (Principal)
  const [formTitulo, setFormTitulo] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExtracto, setFormExtracto] = useState("");
  const [formContenido, setFormContenido] = useState("");

  // Campos Capa Francés (Français)
  const [formTituloFr, setFormTituloFr] = useState("");
  const [formExtractoFr, setFormExtractoFr] = useState("");
  const [formContenidoFr, setFormContenidoFr] = useState("");

  // Campos Capa Inglés (English)
  const [formTituloEn, setFormTituloEn] = useState("");
  const [formExtractoEn, setFormExtractoEn] = useState("");
  const [formContenidoEn, setFormContenidoEn] = useState("");

  // Campos generales compartidos
  const [formImagen, setFormImagen] = useState(PRESET_IMAGES[0].url);
  const [formCategoria, setFormCategoria] = useState("Consejos");
  const [formPalabrasClave, setFormPalabrasClave] = useState("");
  const [formMetaTitulo, setFormMetaTitulo] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");
  const [formTiempoLectura, setFormTiempoLectura] = useState(5);
  const [formPublicado, setFormPublicado] = useState(false);
  const [tipoPublicacion, setTipoPublicacion] = useState<"borrador" | "inmediato" | "programado">("borrador");
  const [formFechaProgramada, setFormFechaProgramada] = useState("");

  // Estados para subida de imagen
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [modoImagen, setModoImagen] = useState<"subir" | "url" | "presets">("subir");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMensajeError("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMensajeError("La imagen supera los 5MB recomendados. Por favor selecciona una imagen más ligera.");
      return;
    }

    setSubiendoImagen(true);
    setMensajeError(null);

    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const cleanFileName = `articulos/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("material_didactico")
        .upload(cleanFileName, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("material_didactico")
          .getPublicUrl(cleanFileName);

        if (data?.publicUrl) {
          setFormImagen(data.publicUrl);
          setSubiendoImagen(false);
          return;
        }
      }

      // Respaldo inmediato vía DataURL en caso de que el bucket no esté público o requiera permisos especiales
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImagen(reader.result);
        }
        setSubiendoImagen(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.warn("Fallo subida a storage, usando DataURL de respaldo:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImagen(reader.result);
        }
        setSubiendoImagen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cargar artículos desde Supabase
  const cargarArticulos = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .order("creado_en", { ascending: false });

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("cache") || error.message?.includes("does not exist")) {
          setTableMissing(true);
        } else {
          console.error("Error cargando articulos:", error);
        }
        setArticulos([]);
      } else {
        setArticulos(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  // Calcular tiempo de lectura automático (limpiando etiquetas HTML)
  const calcularTiempoLectura = (texto: string) => {
    const textoLimpio = texto.replace(/<[^>]+>/g, " ").trim();
    const palabras = textoLimpio.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(palabras / 200));
  };

  const handleTituloChange = (val: string) => {
    setFormTitulo(val);
    if (autoSlug) {
      setFormSlug(slugify(val));
    }
  };

  const handleContenidoChange = (val: string) => {
    setFormContenido(val);
    setFormTiempoLectura(calcularTiempoLectura(val));
  };

  // Abrir modal para crear nuevo
  const abrirCrear = () => {
    setEditingId(null);
    setAutoSlug(true);
    setPreviewMode(false);
    setCapaIdioma("es");
    // Limpiar campos ES
    setFormTitulo("");
    setFormSlug("");
    setFormExtracto("");
    setFormContenido(
      `<h2>Introducción al tema</h2><p>Escribe o pega aquí el contenido de tu artículo desde Word. Puedes usar negritas en <strong>palabras clave</strong>, listas y consejos.</p><blockquote>💡 <strong>Consejo pedagógico:</strong> Los franceses aprecian que uses expresiones auténticas y naturales.</blockquote>`
    );
    // Limpiar campos FR
    setFormTituloFr("");
    setFormExtractoFr("");
    setFormContenidoFr("");
    // Limpiar campos EN
    setFormTituloEn("");
    setFormExtractoEn("");
    setFormContenidoEn("");
    // Generales
    setFormImagen(PRESET_IMAGES[0].url);
    setFormCategoria("Consejos");
    setFormPalabrasClave("frances, aprender frances, florentin");
    setFormMetaTitulo("");
    setFormMetaDesc("");
    setFormTiempoLectura(3);
    setFormPublicado(false);
    setTipoPublicacion("borrador");
    // Fecha sugerida: Mañana a las 09:00 AM
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(9, 0, 0, 0);
    const localIso = new Date(manana.getTime() - manana.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setFormFechaProgramada(localIso);
    setMensajeError(null);
    setMensajeExito(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const abrirEditar = (art: ArticuloAdmin) => {
    setEditingId(art.id);
    setAutoSlug(false);
    setPreviewMode(false);
    setCapaIdioma("es");
    // ES
    setFormTitulo(art.titulo || "");
    setFormSlug(art.slug || "");
    setFormExtracto(art.extracto || "");
    setFormContenido(art.contenido || "");
    // FR
    setFormTituloFr(art.titulo_fr || "");
    setFormExtractoFr(art.extracto_fr || "");
    setFormContenidoFr(art.contenido_fr || "");
    // EN
    setFormTituloEn(art.titulo_en || "");
    setFormExtractoEn(art.extracto_en || "");
    setFormContenidoEn(art.contenido_en || "");
    // Generales
    setFormImagen(art.imagen_portada || PRESET_IMAGES[0].url);
    setFormCategoria(art.categoria || "Consejos");
    setFormPalabrasClave(art.palabras_clave || "");
    setFormMetaTitulo(art.meta_titulo || "");
    setFormMetaDesc(art.meta_descripcion || "");
    setFormTiempoLectura(art.tiempo_lectura || 5);
    setFormPublicado(art.publicado);
    
    // Determinar si es borrador, publicado o programado
    const now = new Date();
    if (!art.publicado) {
      setTipoPublicacion("borrador");
      const defaultD = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      defaultD.setHours(9, 0, 0, 0);
      setFormFechaProgramada(new Date(defaultD.getTime() - defaultD.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } else if (art.fecha_publicacion && new Date(art.fecha_publicacion) > now) {
      setTipoPublicacion("programado");
      const d = new Date(art.fecha_publicacion);
      setFormFechaProgramada(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    } else {
      setTipoPublicacion("inmediato");
      const d = art.fecha_publicacion ? new Date(art.fecha_publicacion) : new Date(art.creado_en);
      setFormFechaProgramada(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }

    setMensajeError(null);
    setMensajeExito(null);
    setModalOpen(true);
  };

  // Asistente de Auto-Traducción Inteligente Multilingüe (Sin límite de caracteres)
  const handleAutoTraducir = async () => {
    if (!formTitulo.trim() && !formContenido.trim()) {
      alert("Escribe primero el título o contenido en español para traducirlo.");
      return;
    }

    setAutoTraduciendo(true);
    setMensajeError(null);
    setEstadoTraduccion("Iniciando auto-traducción completa...");

    try {
      // 1. Traducir a Francés
      const bundleFr = await translateArticleBundle(
        {
          titulo: formTitulo,
          extracto: formExtracto,
          contenido: formContenido
        },
        "es",
        "fr",
        (status) => setEstadoTraduccion(status)
      );

      if (bundleFr.titulo) setFormTituloFr(bundleFr.titulo);
      if (bundleFr.extracto) setFormExtractoFr(bundleFr.extracto);
      if (bundleFr.contenido) setFormContenidoFr(bundleFr.contenido);

      // 2. Traducir a Inglés
      const bundleEn = await translateArticleBundle(
        {
          titulo: formTitulo,
          extracto: formExtracto,
          contenido: formContenido
        },
        "es",
        "en",
        (status) => setEstadoTraduccion(status)
      );

      if (bundleEn.titulo) setFormTituloEn(bundleEn.titulo);
      if (bundleEn.extracto) setFormExtractoEn(bundleEn.extracto);
      if (bundleEn.contenido) setFormContenidoEn(bundleEn.contenido);

      setMensajeExito(
        "✨ ¡Auto-traducción completada con éxito! Se han generado las versiones en Francés e Inglés sin límite de caracteres."
      );
      setTimeout(() => setMensajeExito(null), 5000);
    } catch (e: any) {
      console.error(e);
      setMensajeError("Hubo un problema al auto-traducir: " + (e.message || "Error de red"));
    } finally {
      setAutoTraduciendo(false);
      setEstadoTraduccion(null);
    }
  };

  // Traducción individual por idioma bajo demanda
  const handleTraducirIndividual = async (targetLang: "fr" | "en") => {
    if (!formTitulo.trim() && !formContenido.trim()) {
      alert("Escribe primero el título o contenido en español.");
      return;
    }

    setAutoTraduciendo(true);
    setMensajeError(null);
    const langNombre = targetLang === "fr" ? "Francés" : "Inglés";
    setEstadoTraduccion(`Traduciendo a ${langNombre}...`);

    try {
      const bundle = await translateArticleBundle(
        {
          titulo: formTitulo,
          extracto: formExtracto,
          contenido: formContenido
        },
        "es",
        targetLang,
        (status) => setEstadoTraduccion(status)
      );

      if (targetLang === "fr") {
        if (bundle.titulo) setFormTituloFr(bundle.titulo);
        if (bundle.extracto) setFormExtractoFr(bundle.extracto);
        if (bundle.contenido) setFormContenidoFr(bundle.contenido);
      } else {
        if (bundle.titulo) setFormTituloEn(bundle.titulo);
        if (bundle.extracto) setFormExtractoEn(bundle.extracto);
        if (bundle.contenido) setFormContenidoEn(bundle.contenido);
      }

      setMensajeExito(`✨ ¡Traducción a ${langNombre} completada con éxito!`);
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (e: any) {
      console.error(e);
      setMensajeError(`Error al traducir a ${langNombre}: ` + (e.message || "Error de conexión"));
    } finally {
      setAutoTraduciendo(false);
      setEstadoTraduccion(null);
    }
  };

  // Guardar (Crear o Actualizar)
  const guardarArticulo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formSlug.trim() || !formContenido.trim()) {
      setMensajeError(
        lang === "fr"
          ? "Veuillez remplir le titre, le slug et le contenu en espagnol."
          : "Por favor completa el título, slug y contenido en español."
      );
      return;
    }

    setGuardando(true);
    setMensajeError(null);

    // Determinar publicado y fecha_publicacion según el tipo seleccionado
    let publicadoBool = false;
    let fechaPublicacionIso: string | null = null;

    if (tipoPublicacion === "inmediato") {
      publicadoBool = true;
      fechaPublicacionIso = new Date().toISOString();
    } else if (tipoPublicacion === "programado") {
      publicadoBool = true;
      fechaPublicacionIso = formFechaProgramada ? new Date(formFechaProgramada).toISOString() : new Date().toISOString();
    } else {
      publicadoBool = false;
      fechaPublicacionIso = null;
    }

    const payload = {
      titulo: formTitulo.trim(),
      slug: formSlug.trim().toLowerCase(),
      extracto: formExtracto.trim(),
      contenido: formContenido,
      titulo_fr: formTituloFr.trim() || null,
      extracto_fr: formExtractoFr.trim() || null,
      contenido_fr: formContenidoFr || null,
      titulo_en: formTituloEn.trim() || null,
      extracto_en: formExtractoEn.trim() || null,
      contenido_en: formContenidoEn || null,
      imagen_portada: formImagen.trim(),
      categoria: formCategoria.trim(),
      palabras_clave: formPalabrasClave.trim(),
      meta_titulo: formMetaTitulo.trim() || formTitulo.trim(),
      meta_descripcion: formMetaDesc.trim() || formExtracto.trim(),
      tiempo_lectura: formTiempoLectura,
      idioma: "es",
      publicado: publicadoBool,
      fecha_publicacion: fechaPublicacionIso,
      autor: "Florentin",
      actualizado_en: new Date().toISOString()
    };

    try {
      if (editingId) {
        // Actualizar
        const { error } = await supabase.from("articulos").update(payload).eq("id", editingId);
        if (error) throw error;
        setMensajeExito(lang === "fr" ? "Article mis à jour avec succès !" : "¡Artículo actualizado con éxito!");
      } else {
        // Crear
        const { error } = await supabase.from("articulos").insert({
          ...payload,
          visitas: 0,
          creado_en: new Date().toISOString()
        });
        if (error) throw error;
        setMensajeExito(lang === "fr" ? "Article créé avec succès !" : "¡Artículo creado con éxito!");
      }

      setTimeout(() => {
        setModalOpen(false);
        cargarArticulos();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMensajeError(err.message || "Error al guardar el artículo");
    } finally {
      setGuardando(false);
    }
  };

  // Cambiar estado de publicación rápido (Toggle switch)
  const togglePublicado = async (art: ArticuloAdmin) => {
    const nuevoEstado = !art.publicado;
    setArticulos((prev) => prev.map((a) => (a.id === art.id ? { ...a, publicado: nuevoEstado } : a)));

    const { error } = await supabase
      .from("articulos")
      .update({ publicado: nuevoEstado, actualizado_en: new Date().toISOString() })
      .eq("id", art.id);

    if (error) {
      alert("Error al actualizar estado: " + error.message);
      cargarArticulos();
    }
  };

  // Eliminar artículo
  const eliminarArticulo = async (id: number, titulo: string) => {
    const confirmMsg =
      lang === "fr"
        ? `Êtes-vous sûr de vouloir supprimer l'article "${titulo}" ?`
        : `¿Estás seguro de que deseas eliminar el artículo "${titulo}"? Esta acción no se puede deshacer.`;

    if (!window.confirm(confirmMsg)) return;

    setArticulos((prev) => prev.filter((a) => a.id !== id));

    const { error } = await supabase.from("articulos").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
      cargarArticulos();
    }
  };

  // Filtrado de la tabla
  const articulosFiltrados = useMemo(() => {
    return articulos.filter((art) => {
      const matchSearch =
        searchTerm === "" ||
        art.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.categoria && art.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.titulo_fr && art.titulo_fr.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.titulo_en && art.titulo_en.toLowerCase().includes(searchTerm.toLowerCase()));

      const now = new Date();
      const esProgramado = art.publicado && !!art.fecha_publicacion && new Date(art.fecha_publicacion) > now;
      const esPublicado = art.publicado && (!art.fecha_publicacion || new Date(art.fecha_publicacion) <= now);
      const esBorrador = !art.publicado;

      const matchEstado =
        filtroEstado === "todos"
          ? true
          : filtroEstado === "publicados"
          ? esPublicado
          : filtroEstado === "programados"
          ? esProgramado
          : esBorrador;

      return matchSearch && matchEstado;
    });
  }, [articulos, searchTerm, filtroEstado]);

  // Métricas
  const now = new Date();
  const totalArticulos = articulos.length;
  const totalPublicados = articulos.filter(
    (a) => a.publicado && (!a.fecha_publicacion || new Date(a.fecha_publicacion) <= now)
  ).length;
  const totalProgramados = articulos.filter(
    (a) => a.publicado && !!a.fecha_publicacion && new Date(a.fecha_publicacion) > now
  ).length;
  const totalBorradores = articulos.filter((a) => !a.publicado).length;
  const totalVisitas = articulos.reduce((acc, curr) => acc + (curr.visitas || 0), 0);

  // Contenido y título según la capa activa para vista previa
  const currentCapaContent =
    capaIdioma === "fr" ? formContenidoFr || formContenido : capaIdioma === "en" ? formContenidoEn || formContenido : formContenido;

  return (
    <div className="space-y-8">
      {/* Banner de aviso si la tabla no existe aún */}
      {tableMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 shadow-sm flex items-start gap-4">
          <AlertCircle className="text-amber-600 shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-base mb-1">
              {lang === "fr" ? "Table 'articulos' non configurée dans Supabase" : "Tabla 'articulos' pendiente de inicialización en Supabase"}
            </h4>
            <p className="text-sm text-amber-800 mb-3">
              {lang === "fr"
                ? "Le script avec support multilingue est prêt. Exécutez 'supabase_articulos.sql' dans le SQL Editor de Supabase."
                : "El archivo de migración con soporte multilingüe está listo. Puedes ejecutar 'supabase_articulos.sql' en el SQL Editor de tu panel de Supabase."}
            </p>
            <button
              onClick={() => cargarArticulos()}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              🔄 Reintentar conexión
            </button>
          </div>
        </div>
      )}

      {/* 1. MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3b82f6] flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0c1b33]">{totalArticulos}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "fr" ? "Total Articles" : "Artículos Totales"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{totalPublicados}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "fr" ? "Publiés en Ligne" : "Publicados"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">{totalProgramados}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "fr" ? "Programmés" : "Programados"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{totalBorradores}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "fr" ? "Brouillons" : "Borradores"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{totalVisitas}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === "fr" ? "Lectures Totales" : "Lecturas Totales"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE ACCIÓN: BUSCADOR, FILTROS Y BOTÓN CREAR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === "fr" ? "Rechercher par titre (ES, FR, EN), slug..." : "Buscar por título (ES, FR, EN), slug..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
            />
          </div>

          {/* Filtro Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="todos">{lang === "fr" ? "Tous les états" : "Todos los estados"}</option>
            <option value="publicados">{lang === "fr" ? "Publiés" : "Publicados"}</option>
            <option value="programados">{lang === "fr" ? "Programmés (🕒)" : "Programados (🕒)"}</option>
            <option value="borradores">{lang === "fr" ? "Brouillons" : "Borradores"}</option>
          </select>
        </div>

        {/* Botón Crear Nuevo Artículo */}
        <button
          onClick={abrirCrear}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0c1b33] hover:bg-[#1a2d4f] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02]"
        >
          <Plus size={16} />
          {lang === "fr" ? "Nouvel Article" : "Crear Nuevo Artículo"}
        </button>
      </div>

      {/* 3. TABLA DE ARTÍCULOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                <th className="py-4 px-6">{lang === "fr" ? "Article" : "Artículo"}</th>
                <th className="py-4 px-6">{lang === "fr" ? "Traductions Disponibles" : "Capas de Idioma"}</th>
                <th className="py-4 px-6">{lang === "fr" ? "Statut" : "Estado"}</th>
                <th className="py-4 px-6">{lang === "fr" ? "Lectures" : "Visitas"}</th>
                <th className="py-4 px-6">{lang === "fr" ? "Date" : "Fecha"}</th>
                <th className="py-4 px-6 text-right">{lang === "fr" ? "Actions" : "Acciones"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c1b33] mb-2" />
                    <div>{lang === "fr" ? "Chargement des articles..." : "Cargando catálogo de artículos..."}</div>
                  </td>
                </tr>
              ) : articulosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <BookOpen className="mx-auto mb-3 text-slate-300" size={36} />
                    <div className="font-bold text-sm text-slate-600 mb-1">
                      {lang === "fr" ? "Aucun article trouvé" : "No hay artículos para mostrar"}
                    </div>
                    {articulos.length === 0 && (
                      <button
                        onClick={abrirCrear}
                        className="bg-[#0c1b33] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors mt-2"
                      >
                        + {lang === "fr" ? "Créer maintenant" : "Crear mi primer artículo"}
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                articulosFiltrados.map((art) => {
                  const now = new Date();
                  const esProgramado = art.publicado && !!art.fecha_publicacion && new Date(art.fecha_publicacion) > now;
                  const esPublicado = art.publicado && (!art.fecha_publicacion || new Date(art.fecha_publicacion) <= now);
                  const previewHref = `/articulos/${art.slug}${esProgramado || !art.publicado ? "?preview=true" : ""}`;

                  const fecha = new Date(art.creado_en).toLocaleDateString(lang === "fr" ? "fr-FR" : "es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Título e Imagen */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image
                              src={art.imagen_portada || PRESET_IMAGES[0].url}
                              alt={art.titulo}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/french_hero.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 line-clamp-1 text-sm">{art.titulo}</div>
                            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                              <span>/articulos/{art.slug}</span>
                              <Link
                                href={previewHref}
                                target="_blank"
                                className="text-[#3b82f6] hover:text-[#1d4ed8]"
                                title={esProgramado ? "Previsualizar (programado)" : !art.publicado ? "Previsualizar (borrador)" : "Abrir vista pública"}
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Capas de Idiomas Disponibles */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                            ES ✓
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              art.contenido_fr
                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                          >
                            FR {art.contenido_fr ? "✓" : "—"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              art.contenido_en
                                ? "bg-purple-50 border-purple-200 text-purple-800"
                                : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                          >
                            EN {art.contenido_en ? "✓" : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Estado y Programación */}
                      <td className="py-4 px-6">
                        {(() => {
                          if (esProgramado) {
                            const fechaProg = new Date(art.fecha_publicacion!);
                            return (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                                  <Clock size={12} className="text-blue-600 animate-spin-slow" />
                                  {lang === "fr" ? "Programmé" : "Programado"}
                                </span>
                                <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                  <span>📅 {fechaProg.toLocaleDateString(lang === "fr" ? "fr-FR" : "es-ES", { day: "numeric", month: "short" })} · {fechaProg.toLocaleTimeString(lang === "fr" ? "fr-FR" : "es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                              </div>
                            );
                          }

                          if (esPublicado) {
                            return (
                              <button
                                type="button"
                                onClick={() => togglePublicado(art)}
                                title="Clic para cambiar a borrador"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-xs"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {lang === "fr" ? "Publié" : "Publicado"}
                              </button>
                            );
                          }

                          return (
                            <button
                              type="button"
                              onClick={() => togglePublicado(art)}
                              title="Clic para publicar de inmediato"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                            >
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              {lang === "fr" ? "Brouillon" : "Borrador"}
                            </button>
                          );
                        })()}
                      </td>

                      {/* Visitas */}
                      <td className="py-4 px-6 font-bold text-slate-700">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Eye size={13} className="text-slate-400" />
                          <span>{art.visitas || 0}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {fecha}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={previewHref}
                            target="_blank"
                            className="p-2 text-slate-500 hover:text-[#0c1b33] hover:bg-slate-100 rounded-lg transition-colors"
                            title={esProgramado ? (lang === "fr" ? "Aperçu programmé" : "Previsualizar artículo programado") : !art.publicado ? (lang === "fr" ? "Aperçu brouillon" : "Previsualizar borrador") : (lang === "fr" ? "Voir en direct" : "Ver en vivo")}
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => abrirEditar(art)}
                            className="p-2 text-slate-500 hover:text-[#3b82f6] hover:bg-blue-50 rounded-lg transition-colors"
                            title={lang === "fr" ? "Modifier" : "Editar"}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => eliminarArticulo(art.id, art.titulo)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={lang === "fr" ? "Supprimer" : "Eliminar"}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL DE CREACIÓN Y EDICIÓN CON 3 CAPAS LINGÜÍSTICAS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0c1b33] text-white flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingId
                      ? lang === "fr" ? "Modifier l'Article Multilingue" : "Editar Artículo Multilingüe (3 Capas)"
                      : lang === "fr" ? "Créer un Nouvel Article Multilingue" : "Crear Nuevo Artículo Multilingüe (3 Capas)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === "fr"
                      ? "Gérez les 3 versions linguistiques (ES, FR, EN) et utilisez l'auto-traduction gratuite pour aller plus vite."
                      : "Gestiona las 3 versiones de idioma (ES, FR, EN) y usa la auto-traducción con 1 clic para ahorrar tiempo."}
                  </p>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              {mensajeError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} /> {mensajeError}
                </div>
              )}
              {mensajeExito && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} /> {mensajeExito}
                </div>
              )}

              {/* BARRA DE LAS 3 CAPAS DE IDIOMA + BOTÓN AUTO-TRADUCIR */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCapaIdioma("es")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      capaIdioma === "es"
                        ? "bg-white text-[#0c1b33] shadow-sm font-black scale-105"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    🇪🇸 Español (Principal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCapaIdioma("fr")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      capaIdioma === "fr"
                        ? "bg-white text-[#0c1b33] shadow-sm font-black scale-105"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    🇫🇷 Français {formTituloFr ? "✓" : ""}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCapaIdioma("en")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      capaIdioma === "en"
                        ? "bg-white text-[#0c1b33] shadow-sm font-black scale-105"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    🇬🇧 English {formTituloEn ? "✓" : ""}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoTraducir}
                  disabled={autoTraduciendo}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 disabled:opacity-50"
                  title="Traduce automáticamente el artículo completo a Francés e Inglés sin límite de longitud"
                >
                  <Sparkles size={14} className={autoTraduciendo ? "animate-spin" : ""} />
                  {autoTraduciendo ? (estadoTraduccion || "Traduciendo a FR y EN...") : "✨ Auto-traducir a FR y EN (Completo)"}
                </button>
              </div>

              <form id="articuloForm" onSubmit={guardarArticulo} className="space-y-6">
                {/* CAMPOS DEPENDIENTES DE LA CAPA ACTIVA */}

                {/* 🇪🇸 CAPA ESPAÑOL */}
                {capaIdioma === "es" && (
                  <div className="space-y-5 bg-blue-50/20 p-5 rounded-2xl border border-blue-100">
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                      <span>🇪🇸 Contenido en Español (Versión Base)</span>
                      <span className="text-[11px] text-blue-700 font-medium">Idioma principal de redacción</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                          Título (Español) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitulo}
                          onChange={(e) => handleTituloChange(e.target.value)}
                          placeholder="Ej: Cómo pronunciar la R francesa de forma natural"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                            Slug URL *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setAutoSlug(true);
                              setFormSlug(slugify(formTitulo));
                            }}
                            className="text-[11px] font-bold text-[#3b82f6] hover:underline"
                          >
                            🔄 Auto-generar
                          </button>
                        </div>
                        <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#3b82f6]/20 focus-within:border-[#3b82f6]">
                          <span className="pl-3 pr-1 text-slate-400 text-xs font-mono select-none">/articulos/</span>
                          <input
                            type="text"
                            required
                            value={formSlug}
                            onChange={(e) => {
                              setAutoSlug(false);
                              setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                            }}
                            className="w-full py-2.5 pr-4 text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Extracto / Resumen (Español)
                      </label>
                      <textarea
                        rows={2}
                        value={formExtracto}
                        onChange={(e) => setFormExtracto(e.target.value)}
                        placeholder="Resumen corto para las tarjetas en español..."
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 🇫🇷 CAPA FRANCÉS */}
                {capaIdioma === "fr" && (
                  <div className="space-y-5 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                        <span>🇫🇷 Contenu en Français</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTraducirIndividual("fr")}
                        disabled={autoTraduciendo}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm transition-all hover:scale-105 disabled:opacity-50"
                        title="Auto-traducir todo el artículo a francés"
                      >
                        <Sparkles size={13} className={autoTraduciendo ? "animate-spin" : ""} />
                        Auto-traducir a Francés
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Titre (Français)
                      </label>
                      <input
                        type="text"
                        value={formTituloFr}
                        onChange={(e) => setFormTituloFr(e.target.value)}
                        placeholder="Ex: Comment prononcer le R français naturellement"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Extrait / Résumé (Français)
                      </label>
                      <textarea
                        rows={2}
                        value={formExtractoFr}
                        onChange={(e) => setFormExtractoFr(e.target.value)}
                        placeholder="Court résumé en français pour les cartes..."
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 🇬🇧 CAPA INGLÉS */}
                {capaIdioma === "en" && (
                  <div className="space-y-5 bg-purple-50/30 p-5 rounded-2xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1">
                        <span>🇬🇧 English Content</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTraducirIndividual("en")}
                        disabled={autoTraduciendo}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-purple-200 shadow-sm transition-all hover:scale-105 disabled:opacity-50"
                        title="Auto-traducir todo el artículo a inglés"
                      >
                        <Sparkles size={13} className={autoTraduciendo ? "animate-spin" : ""} />
                        Auto-translate to English
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={formTituloEn}
                        onChange={(e) => setFormTituloEn(e.target.value)}
                        placeholder="Ex: How to Pronounce the French R Naturally"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                        Excerpt (English)
                      </label>
                      <textarea
                        rows={2}
                        value={formExtractoEn}
                        onChange={(e) => setFormExtractoEn(e.target.value)}
                        placeholder="Short summary in English for cards..."
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* EDITOR DE CONTENIDO DE LA CAPA SELECCIONADA CON RICH TEXT (ESTILO WORD) */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-600">
                        Cuerpo del texto ({capaIdioma.toUpperCase()}):
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewMode(false)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            !previewMode ? "bg-white text-[#0c1b33] shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          ✏️ Editor Visual
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(true)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            previewMode ? "bg-white text-[#0c1b33] shadow-sm" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          👁️ Vista Previa ({capaIdioma.toUpperCase()})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    {!previewMode ? (
                      <RichTextEditor
                        value={
                          capaIdioma === "fr"
                            ? formContenidoFr
                            : capaIdioma === "en"
                            ? formContenidoEn
                            : formContenido
                        }
                        onChange={(newHtml) => {
                          if (capaIdioma === "fr") setFormContenidoFr(newHtml);
                          else if (capaIdioma === "en") setFormContenidoEn(newHtml);
                          else handleContenidoChange(newHtml);
                        }}
                        placeholder={
                          capaIdioma === "fr"
                            ? "Rédigez ou collez le corps de l'article en français (Word / Docs)..."
                            : capaIdioma === "en"
                            ? "Write or paste article body in English (Word / Docs)..."
                            : "Escribe o pega aquí el contenido de tu artículo desde Word..."
                        }
                      />
                    ) : (
                      <div className="min-h-[250px] max-h-[500px] overflow-y-auto p-6 border border-slate-100 rounded-xl bg-slate-50/50">
                        <ArticleContent content={currentCapaContent} />
                      </div>
                    )}

                    {/* Barra de estadísticas y longitud ilimitada */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 mt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">
                          📊 {(currentCapaContent || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ? (currentCapaContent || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length : 0} palabras · {(currentCapaContent || "").replace(/<[^>]+>/g, "").trim().length.toLocaleString()} caracteres netos
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Longitud Ilimitada
                        </span>
                      </div>

                      {capaIdioma !== "es" && (
                        <button
                          type="button"
                          onClick={() => handleTraducirIndividual(capaIdioma)}
                          disabled={autoTraduciendo}
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
                        >
                          <Sparkles size={12} className={autoTraduciendo ? "animate-spin" : ""} />
                          {autoTraduciendo ? (estadoTraduccion || "Traduciendo...") : `Re-traducir solo este cuerpo (${capaIdioma.toUpperCase()})`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* METADATOS COMPARTIDOS (CATEGORÍA, IMAGEN, TIEMPO, ETC.) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Categoría
                    </label>
                    <input
                      list="categorias-list"
                      type="text"
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      placeholder="Ej: Pronunciación"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <datalist id="categorias-list">
                      {CATEGORIAS_PRESET.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Tiempo estimado de lectura (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={formTiempoLectura}
                      onChange={(e) => setFormTiempoLectura(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Imagen de Portada — Subida Local, URL o Presets */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-[#c99a3c]" />
                        Imagen de Portada del Artículo
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Sube una foto desde tu equipo, ingresa un enlace de internet o elige una postal de Francia.
                      </p>
                    </div>

                    {/* Selector de modo */}
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-xs">
                      <button
                        type="button"
                        onClick={() => setModoImagen("subir")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          modoImagen === "subir"
                            ? "bg-[#0c1b33] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Upload size={12} />
                        Subir de mi PC
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoImagen("url")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          modoImagen === "url"
                            ? "bg-[#0c1b33] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <LinkIcon size={12} />
                        Enlace URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setModoImagen("presets")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          modoImagen === "presets"
                            ? "bg-[#0c1b33] text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <FolderOpen size={12} />
                        Sugeridas
                      </button>
                    </div>
                  </div>

                  {/* Vista Previa de la Imagen Actualmente Seleccionada */}
                  {formImagen && (
                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                        <Image src={formImagen} alt="Portada actual" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          Foto de portada seleccionada
                        </div>
                        <div className="text-[11px] text-slate-400 truncate font-mono mt-0.5">
                          {formImagen}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormImagen("")}
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  )}

                  {/* MODO 1: SUBIR DESDE EQUIPO */}
                  {modoImagen === "subir" && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/jpg"
                        onChange={handleSubirImagen}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          subiendoImagen
                            ? "bg-blue-50/50 border-blue-300 pointer-events-none"
                            : "border-slate-300 hover:border-[#0c1b33] bg-white hover:bg-slate-50/80"
                        }`}
                      >
                        {subiendoImagen ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#0c1b33]" />
                            <div className="text-xs font-bold text-[#0c1b33]">
                              Subiendo y optimizando imagen en Supabase...
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0c1b33]">
                              <Upload size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                Haz clic aquí para elegir una foto de tu computadora o teléfono
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Formatos admitidos: JPG, PNG, WebP (Máx. 5 MB)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODO 2: PEGAR CUALQUIER URL LIBRE */}
                  {modoImagen === "url" && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formImagen}
                        onChange={(e) => setFormImagen(e.target.value)}
                        placeholder="https://images.unsplash.com/... o https://tusitio.com/foto.jpg"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]"
                      />
                      <p className="text-[11px] text-slate-500">
                        💡 Puedes usar cualquier imagen pública de internet (Unsplash, Pexels, Google, etc.).
                      </p>
                    </div>
                  )}

                  {/* MODO 3: PRESETS FRANCIA */}
                  {modoImagen === "presets" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImagen(img.url)}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                            formImagen === img.url
                              ? "border-[#0c1b33] ring-2 ring-[#0c1b33]/20 scale-[1.02]"
                              : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.01]"
                          }`}
                        >
                          <Image src={img.url} alt={img.name} fill className="object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[10px] font-bold py-1 px-1.5 text-center truncate">
                            {img.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selector de Publicación y Programación */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Clock size={16} className="text-[#c99a3c]" />
                        {lang === "fr" ? "Statut de publication & Planification" : "Estado de Publicación & Planificación"}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lang === "fr"
                          ? "Choisissez de garder en brouillon, de publier immédiatement ou de programmer pour une date future."
                          : "Elige guardar como borrador privado, publicar de inmediato o programar para que salga público en una fecha y hora exacta."}
                      </div>
                    </div>

                    {/* Botones de selección de estado */}
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setTipoPublicacion("borrador")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          tipoPublicacion === "borrador"
                            ? "bg-slate-800 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {lang === "fr" ? "Brouillon" : "Borrador"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoPublicacion("inmediato")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          tipoPublicacion === "inmediato"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {lang === "fr" ? "Publier maintenant" : "Publicar Ahora"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoPublicacion("programado")}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                          tipoPublicacion === "programado"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Clock size={12} />
                        {lang === "fr" ? "Programmer" : "Programar"}
                      </button>
                    </div>
                  </div>

                  {/* Campo desplegable para fecha y hora programada */}
                  {tipoPublicacion === "programado" && (
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
                      <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Clock size={14} className="text-blue-600" />
                        {lang === "fr" ? "Date et heure de publication automatique :" : "Fecha y hora de publicación automática:"}
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <input
                          type="datetime-local"
                          value={formFechaProgramada}
                          onChange={(e) => setFormFechaProgramada(e.target.value)}
                          className="px-3.5 py-2 rounded-xl border border-blue-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                        />
                        <span className="text-xs text-blue-900 font-medium">
                          {formFechaProgramada ? (
                            <span>
                              🕒 {lang === "fr" ? "Sera publié automatiquement le" : "Se publicará automáticamente el"}{" "}
                              <strong>
                                {new Date(formFechaProgramada).toLocaleString(lang === "fr" ? "fr-FR" : "es-ES", {
                                  dateStyle: "full",
                                  timeStyle: "short"
                                })}
                              </strong>
                            </span>
                          ) : (
                            lang === "fr" ? "Veuillez sélectionner la date et l'heure" : "Selecciona la fecha y hora deseada"
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-700/80">
                        💡 {lang === "fr" 
                          ? "L'article restera caché pour les élèves jusqu'à l'heure exacte choisie, puis deviendra public automatiquement."
                          : "El artículo permanecerá oculto para los visitantes hasta el minuto exacto programado, y se volverá público de forma automática sin intervención."}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="articuloForm"
                disabled={guardando}
                className="inline-flex items-center gap-2 bg-[#0c1b33] hover:bg-[#1a2d4f] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Save size={15} />
                {guardando
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar Artículo (3 Idiomas)"
                  : "Guardar Artículo (3 Idiomas)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
