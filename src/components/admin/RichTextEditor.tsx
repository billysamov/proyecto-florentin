"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lightbulb,
  Link2,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  Code,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  X,
  Check,
  Loader2,
  Maximize2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * Convierte Markdown legado a HTML limpio para asegurar compatibilidad total
 * con artículos ya existentes en la base de datos.
 */
export function markdownToHtml(md: string): string {
  if (!md) return "";
  // Si ya es HTML enriquecido, no tocar
  if (/<(p|h[1-6]|ul|ol|li|blockquote|div|table|strong|b|em|i|u|span|br|figure|img|iframe|video)\b[^>]*>/i.test(md)) {
    return md;
  }

  const lines = md.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inList = false;
  let inOrderedList = false;

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-pink-600 px-1 py-0.5 rounded font-mono text-sm">$1</code>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="media-figure media-align-center media-size-md"><img src="$2" alt="$1" class="media-img" /><figcaption class="media-caption">$1</figcaption></figure>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push(`<h3>${formatInline(line.replace("### ", ""))}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push(`<h2>${formatInline(line.replace("## ", ""))}</h2>`);
    } else if (line.startsWith("# ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push(`<h1>${formatInline(line.replace("# ", ""))}</h1>`);
    } else if (line.startsWith("> ")) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push(`<blockquote>${formatInline(line.replace("> ", ""))}</blockquote>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      if (!inList) { htmlParts.push("<ul>"); inList = true; }
      htmlParts.push(`<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (!inOrderedList) { htmlParts.push("<ol>"); inOrderedList = true; }
      htmlParts.push(`<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`);
    } else if (line === "---" || line === "***") {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push("<hr>");
    } else {
      if (inList) { htmlParts.push("</ul>"); inList = false; }
      if (inOrderedList) { htmlParts.push("</ol>"); inOrderedList = false; }
      htmlParts.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inList) htmlParts.push("</ul>");
  if (inOrderedList) htmlParts.push("</ol>");

  return htmlParts.join("");
}

/**
 * Limpiador inteligente para contenido pegado desde Word, Google Docs o páginas web.
 * Conserva semántica (negrita, cursiva, encabezados, párrafos, listas, enlaces, imágenes)
 * pero remueve basuritas de Word como XML, MsoNormal, fuentes locales, etc.
 */
function cleanWordAndHtml(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Remover comentarios condicionales de Word y XML
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/gi, "");
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, "");
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<meta[\s\S]*?>/gi, "");
  cleaned = cleaned.replace(/<link[\s\S]*?>/gi, "");
  cleaned = cleaned.replace(/<xml[\s\S]*?<\/xml>/gi, "");
  cleaned = cleaned.replace(/<\/?o:[^>]*>/gi, "");
  cleaned = cleaned.replace(/<\/?w:[^>]*>/gi, "");
  cleaned = cleaned.replace(/<\/?m:[^>]*>/gi, "");

  // 2. Extraer fragmento si viene de WebKit / Word
  const fragmentMatch = cleaned.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/i);
  if (fragmentMatch && fragmentMatch[1]) {
    cleaned = fragmentMatch[1];
  }

  // 3. Normalizar spans con estilos inline de negrita y cursiva
  cleaned = cleaned.replace(/<span[^>]*style="[^"]*font-weight:\s*(bold|[7-9]00)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, "<strong>$2</strong>");
  cleaned = cleaned.replace(/<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, "<em>$2</em>");
  cleaned = cleaned.replace(/<span[^>]*style="[^"]*text-decoration:[^"]*underline[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, "<u>$2</u>");

  // 4. Estandarizar b -> strong e i -> em
  cleaned = cleaned.replace(/<b>([\s\S]*?)<\/b>/gi, "<strong>$1</strong>");
  cleaned = cleaned.replace(/<i>([\s\S]*?)<\/i>/gi, "<em>$1</em>");

  // 5. Remover clases de Word (MsoNormal, MsoListParagraph, etc.)
  cleaned = cleaned.replace(/\s*class="[^"]*Mso[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*class="[^"]*"/gi, "");

  // 6. Remover atributos inline sucios pero conservar href y src
  cleaned = cleaned.replace(/\s*style="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*lang="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*align="[^"]*"/gi, "");

  // 7. Limpiar spans vacíos que hayan quedado
  cleaned = cleaned.replace(/<span>([\s\S]*?)<\/span>/gi, "$1");
  cleaned = cleaned.replace(/<p>\s*&nbsp;\s*<\/p>/gi, "<br>");

  return cleaned.trim();
}

/**
 * Convierte URLs de video de YouTube, Vimeo o MP4 a formatos embed seguros.
 */
function convertToEmbedUrl(url: string): { type: "youtube" | "vimeo" | "video" | "unknown"; embedUrl: string } {
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`
    };
  }

  // MP4 / WebM directo
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      type: "video",
      embedUrl: trimmed
    };
  }

  return { type: "unknown", embedUrl: trimmed };
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe o pega aquí el contenido de tu artículo...",
  minHeight = "340px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [rawHtml, setRawHtml] = useState<string>("");
  const isInternalUpdate = useRef(false);
  const savedRange = useRef<Range | null>(null);

  // Estados para Modal de Inserción de Imagen
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageAlign, setImageAlign] = useState<"left" | "center" | "right" | "full">("center");
  const [imageSize, setImageSize] = useState<"sm" | "md" | "lg" | "full">("md");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  // Estados para Modal de Inserción de Video
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSize, setVideoSize] = useState<"md" | "full">("full");
  const [videoCaption, setVideoCaption] = useState("");

  // Guardar y restaurar la posición del cursor de manera robusta
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRange.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
    }
  };

  // Atajos de teclado estilo Word (Ctrl+B, Ctrl+I, Ctrl+U)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        format("bold");
      } else if (key === 'i') {
        e.preventDefault();
        format("italic");
      } else if (key === 'u') {
        e.preventDefault();
        format("underline");
      }
    }
  };

  // Inicializar o sincronizar el valor inicial (conviertiendo Markdown a HTML si viene en texto plano)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const htmlToLoad = markdownToHtml(value || "");
    if (editorRef.current.innerHTML !== htmlToLoad) {
      editorRef.current.innerHTML = htmlToLoad;
      setRawHtml(htmlToLoad);
    }
  }, [value]);

  // Emitir cambios hacia el padre
  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    setRawHtml(currentHtml);
    isInternalUpdate.current = true;
    onChange(currentHtml);
  }, [onChange]);

  // Manejo de eventos de entrada
  const handleInput = () => {
    saveSelection();
    emitChange();
  };

  // 🚀 INTERCEPTOR INTELIGENTE DE COPIAR Y PEGAR DESDE WORD / GOOGLE DOCS
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const clipboardHtml = e.clipboardData.getData("text/html");
    const clipboardText = e.clipboardData.getData("text/plain");

    if (clipboardHtml) {
      const cleanHtml = cleanWordAndHtml(clipboardHtml);
      document.execCommand("insertHTML", false, cleanHtml);
    } else if (clipboardText) {
      // Si solo es texto plano, dividir por párrafos y crear <p> para preservar el espaciado
      const paragraphs = clipboardText
        .split(/\r?\n\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/\r?\n/g, "<br>")}</p>`)
        .join("");

      document.execCommand("insertHTML", false, paragraphs || clipboardText);
    }

    saveSelection();
    emitChange();
  };

  // Ejecutor de comandos de formato de texto estilo Word
  const format = (command: string, val: string | undefined = undefined) => {
    if (mode === "html") return;
    const sel = window.getSelection();
    // Si la selección actual no está en el editor pero tenemos un rango guardado, restaurarlo
    if ((!sel || sel.rangeCount === 0 || !editorRef.current?.contains(sel.anchorNode)) && savedRange.current) {
      restoreSelection();
    }
    // Ejecutar comando de formateo
    document.execCommand(command, false, val);
    saveSelection();
    emitChange();
  };

  // Selector de Tipografía
  const formatFontFamily = (fontFamily: string) => {
    if (mode === "html" || !fontFamily) return;
    const sel = window.getSelection();
    if ((!sel || sel.rangeCount === 0 || !editorRef.current?.contains(sel.anchorNode)) && savedRange.current) {
      restoreSelection();
    }
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("fontName", false, fontFamily);
    saveSelection();
    emitChange();
  };

  // Selector de Tamaño de Letra en Píxeles
  const formatFontSize = (sizePx: string) => {
    if (mode === "html" || !sizePx) return;
    const sel = window.getSelection();
    if ((!sel || sel.rangeCount === 0 || !editorRef.current?.contains(sel.anchorNode)) && savedRange.current) {
      restoreSelection();
    }
    const currentSel = window.getSelection();
    if (!currentSel || currentSel.rangeCount === 0 || currentSel.isCollapsed) return;

    try {
      const range = currentSel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = sizePx;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      currentSel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      newRange.collapse(false);
      currentSel.addRange(newRange);
    } catch {
      document.execCommand("fontSize", false, sizePx === "13px" ? "2" : sizePx === "18px" ? "4" : sizePx === "22px" ? "5" : "3");
    }

    saveSelection();
    emitChange();
  };

  // Insertar HTML en la posición del cursor de forma segura
  const insertHtmlAtCursor = (htmlToInsert: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
      try {
        const success = document.execCommand("insertHTML", false, htmlToInsert);
        if (!success) {
          editorRef.current.innerHTML += htmlToInsert;
        }
      } catch {
        editorRef.current.innerHTML += htmlToInsert;
      }
      emitChange();
    }
  };

  // Insertar un bloque destacado de consejo (Tip Box)
  const insertTipBox = () => {
    if (mode === "html") return;
    saveSelection();
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";
    const tipHtml = `<blockquote>💡 <strong>Consejo pedagógico:</strong> ${selectedText || "Escribe aquí un consejo clave para tus alumnos..."}</blockquote><p><br></p>`;
    insertHtmlAtCursor(tipHtml);
  };

  // Insertar un enlace
  const insertLink = () => {
    if (mode === "html") return;
    const url = window.prompt("Ingresa la URL del enlace (ej: https://...):", "https://");
    if (url && url !== "https://") {
      format("createLink", url);
    }
  };

  // Abrir Modal de Imagen
  const handleOpenImageModal = () => {
    if (mode === "html") return;
    saveSelection();
    setImageUrl("");
    setImagePreview("");
    setImageCaption("");
    setImageAlt("");
    setImageAlign("center");
    setImageSize("md");
    setImageModalOpen(true);
  };

  // Subir archivo de imagen a Supabase Storage (o DataURL como fallback)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP, GIF).");
      return;
    }

    setImageUploading(true);

    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const cleanFileName = `articulos_contenido/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

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
          setImageUrl(data.publicUrl);
          setImagePreview(data.publicUrl);
          setImageUploading(false);
          return;
        }
      }

      // Respaldo en DataURL si no hay permisos de storage público
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = typeof reader.result === "string" ? reader.result : "";
        setImageUrl(res);
        setImagePreview(res);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn("Error en subida de imagen, usando DataURL:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = typeof reader.result === "string" ? reader.result : "";
        setImageUrl(res);
        setImagePreview(res);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirmar e insertar la imagen en el artículo
  const handleConfirmInsertImage = () => {
    const src = imageTab === "upload" ? imageUrl : imageUrl.trim();
    if (!src) {
      alert("Por favor sube una imagen o ingresa una URL válida.");
      return;
    }

    const alignClass = `media-align-${imageAlign}`;
    const sizeClass = `media-size-${imageSize}`;
    const captionHtml = imageCaption.trim() ? `<figcaption class="media-caption">${imageCaption.trim()}</figcaption>` : "";
    const altAttr = imageAlt.trim() ? imageAlt.trim() : (imageCaption.trim() || "Ilustración del artículo");

    const imageHtml = `
      <figure class="media-figure ${alignClass} ${sizeClass}">
        <img src="${src}" alt="${altAttr}" class="media-img" />
        ${captionHtml}
      </figure>
      <p><br></p>
    `;

    insertHtmlAtCursor(imageHtml);
    setImageModalOpen(false);
  };

  // Abrir Modal de Video
  const handleOpenVideoModal = () => {
    if (mode === "html") return;
    saveSelection();
    setVideoUrl("");
    setVideoCaption("");
    setVideoSize("full");
    setVideoModalOpen(true);
  };

  // Confirmar e insertar video
  const handleConfirmInsertVideo = () => {
    if (!videoUrl.trim()) {
      alert("Ingresa el enlace del video (YouTube, Vimeo o archivo MP4).");
      return;
    }

    const { type, embedUrl } = convertToEmbedUrl(videoUrl);
    const sizeClass = videoSize === "md" ? "media-video-md" : "media-video-full";
    const captionHtml = videoCaption.trim() ? `<div class="media-caption">${videoCaption.trim()}</div>` : "";

    let videoElementHtml = "";
    if (type === "video") {
      videoElementHtml = `
        <video controls class="w-full h-full rounded-2xl">
          <source src="${embedUrl}" type="video/mp4" />
          Tu navegador no soporta el reproductor de video.
        </video>
      `;
    } else {
      videoElementHtml = `
        <iframe
          src="${embedUrl}"
          title="Video explicativo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
    }

    const finalVideoBlock = `
      <div class="media-video-container ${sizeClass}">
        <div class="media-video-aspect">
          ${videoElementHtml}
        </div>
        ${captionHtml}
      </div>
      <p><br></p>
    `;

    insertHtmlAtCursor(finalVideoBlock);
    setVideoModalOpen(false);
  };

  // Cambiar entre vista Visual (Word) y vista Código HTML
  const toggleMode = (newMode: "visual" | "html") => {
    if (newMode === mode) return;

    if (newMode === "html") {
      if (editorRef.current) {
        setRawHtml(editorRef.current.innerHTML);
      }
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = rawHtml;
      }
      onChange(rawHtml);
    }
    setMode(newMode);
  };

  // Conteo de palabras en tiempo real (limpiando etiquetas HTML)
  const wordCount = React.useMemo(() => {
    const textOnly = (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return textOnly ? textOnly.split(" ").filter(Boolean).length : 0;
  }, [value]);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#0055a5] focus-within:ring-2 focus-within:ring-[#0055a5]/10 transition-all relative">
      {/* ── BARRA DE HERRAMIENTAS ESTILO MICROSOFT WORD (STICKY) ── */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-1.5 select-none shadow-2xs">
        <div className="flex flex-wrap items-center gap-1">
          {/* Selector de Estilo de Párrafo / Título */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("formatBlock", "<p>"); }}
              className="px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100"
              title="Texto normal / Párrafo"
            >
              Normal
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("formatBlock", "<h2>"); }}
              className="px-2 py-1 rounded text-xs font-bold text-[#0c1b33] hover:bg-slate-100"
              title="Título Grande (H2)"
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("formatBlock", "<h3>"); }}
              className="px-2 py-1 rounded text-xs font-bold text-slate-700 hover:bg-slate-100"
              title="Subtítulo (H3)"
            >
              H3
            </button>
          </div>

          {/* Selector de Tipo de Letra (Fuente) */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 mr-1 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase select-none">Fuente</span>
            <select
              onChange={(e) => {
                formatFontFamily(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              className="text-xs font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer pr-1"
              title="Cambiar tipo de letra / tipografía"
            >
              <option value="" disabled>Seleccionar</option>
              <option value="'Plus Jakarta Sans', system-ui, sans-serif">Sans (Moderna)</option>
              <option value="'Playfair Display', Georgia, serif">Serif (Elegante)</option>
              <option value="'Great Vibes', cursive">Script (Manuscrita)</option>
              <option value="monospace">Código (Monospace)</option>
            </select>
          </div>

          {/* Selector de Tamaño de Letra */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 mr-1 shadow-2xs">
            <span className="text-[10px] font-black text-slate-400 uppercase select-none">Tamaño</span>
            <select
              onChange={(e) => {
                formatFontSize(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              className="text-xs font-bold text-slate-700 bg-transparent border-none outline-none cursor-pointer pr-1"
              title="Cambiar tamaño de texto"
            >
              <option value="" disabled>Seleccionar</option>
              <option value="13px">13px (Pequeño)</option>
              <option value="16px">16px (Normal)</option>
              <option value="18px">18px (Mediano)</option>
              <option value="22px">22px (Grande)</option>
              <option value="28px">28px (Titular)</option>
            </select>
          </div>

          {/* Formato de Carácter (Negrita, Cursiva, Subrayado) */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("bold"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100 font-black text-sm"
              title="Negrita (Ctrl+B)"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("italic"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Cursiva (Ctrl+I)"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("underline"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Subrayado (Ctrl+U)"
            >
              <Underline size={15} />
            </button>
          </div>

          {/* Listas (Viñetas y Numeradas) */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("insertUnorderedList"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Lista con viñetas"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("insertOrderedList"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Lista numerada"
            >
              <ListOrdered size={15} />
            </button>
          </div>

          {/* Alineación de Texto */}
          <div className="hidden sm:flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("justifyLeft"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Alinear a la izquierda"
            >
              <AlignLeft size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("justifyCenter"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Centrar texto"
            >
              <AlignCenter size={15} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("justifyRight"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Alinear a la derecha"
            >
              <AlignRight size={15} />
            </button>
          </div>

          {/* 🌟 HERRAMIENTAS DE MEDIA MULTIMEDIA (IMAGEN Y VIDEO DENTRO DEL CONTENIDO) */}
          <div className="flex items-center gap-1 bg-blue-50/70 border border-blue-200/80 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onClick={handleOpenImageModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-blue-800 hover:bg-blue-100/80 text-xs font-bold transition-colors cursor-pointer"
              title="Insertar imagen dentro del contenido (con tamaño y alineación)"
            >
              <ImageIcon size={14} className="text-blue-600" />
              <span>Imagen</span>
            </button>

            <button
              type="button"
              onClick={handleOpenVideoModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-purple-800 hover:bg-purple-100/80 text-xs font-bold transition-colors cursor-pointer"
              title="Insertar video (YouTube, Vimeo, MP4)"
            >
              <VideoIcon size={14} className="text-purple-600" />
              <span>Video</span>
            </button>
          </div>

          {/* Bloques Especiales: Tip Box y Enlace */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 mr-1 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertTipBox(); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors"
              title="Insertar Cuadro de Consejo / Tip Pedagógico"
            >
              <Lightbulb size={14} className="text-amber-600" />
              <span>Tip</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Insertar enlace web"
            >
              <Link2 size={15} />
            </button>

            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("insertHorizontalRule"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
              title="Insertar línea divisoria"
            >
              <Minus size={15} />
            </button>
          </div>

          {/* Deshacer / Rehacer / Limpiar */}
          <div className="hidden md:flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("undo"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("redo"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); format("removeFormat"); }}
              className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100"
              title="Limpiar formato"
            >
              <Eraser size={14} />
            </button>
          </div>
        </div>

        {/* Selector de Modo: Visual (Word) vs Código HTML */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => toggleMode("visual")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === "visual"
                ? "bg-white text-[#0055a5] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={13} />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => toggleMode("html")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === "html"
                ? "bg-white text-[#0055a5] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code size={13} />
            <span>HTML</span>
          </button>
        </div>
      </div>

      {/* ── ÁREA DE EDICIÓN WYSIWYG / WORD CON SCROLL INTERNO ── */}
      <div className="relative p-6 sm:p-8 bg-white min-h-[340px] max-h-[520px] overflow-y-auto">
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            onBlur={emitChange}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            onSelect={saveSelection}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            style={{ minHeight }}
            className="rich-text-content focus:outline-none cursor-text select-text"
          />
        ) : (
          <textarea
            value={rawHtml}
            onChange={(e) => {
              setRawHtml(e.target.value);
              onChange(e.target.value);
            }}
            style={{ minHeight }}
            className="w-full font-mono text-xs leading-relaxed text-slate-800 bg-slate-50 p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0055a5] resize-y min-h-[340px] max-h-[520px] overflow-y-auto"
            placeholder="<html>...</html>"
          />
        )}
      </div>

      {/* ── PIE DEL EDITOR: CONTADOR DE PALABRAS Y CONSEJO ── */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Editor Word enriquecido · Inserta imágenes, videos y citas con fluidez</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} palabras</span>
          <span>·</span>
          <span>~{Math.max(1, Math.ceil(wordCount / 200))} min de lectura</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL INTERACTIVO: INSERTAR IMAGEN DENTRO DEL CONTENIDO
         ════════════════════════════════════════════════════════════════════════ */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Cabecera del modal */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Insertar Imagen en el Contenido</h3>
                  <p className="text-xs text-slate-500">Configura la posición, tamaño y pie de foto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Selector de origen: Subir archivo vs URL */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    imageTab === "upload" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📁 Subir desde mi ordenador
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    imageTab === "url" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔗 Pegar URL de imagen
                </button>
              </div>

              {imageTab === "upload" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Seleccionar imagen (JPG, PNG, WebP)
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
                    {imageUploading ? (
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Subiendo imagen a Supabase...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-slate-400 mb-1.5" size={24} />
                        <span className="text-xs font-bold text-slate-700">Haz clic para buscar en tu PC</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">o arrastra el archivo aquí</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    URL de la Imagen
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Vista previa miniatura de la imagen cargada */}
              {imagePreview && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Selector de Alineación Horizontal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Alineación horizontal en el artículo
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageAlign("left")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      imageAlign === "left"
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <AlignLeft size={16} />
                    <span className="text-[10px]">Izquierda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlign("center")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      imageAlign === "center"
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <AlignCenter size={16} />
                    <span className="text-[10px]">Centrada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlign("right")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      imageAlign === "right"
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <AlignRight size={16} />
                    <span className="text-[10px]">Derecha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageAlign("full")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      imageAlign === "full"
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Maximize2 size={16} />
                    <span className="text-[10px]">Completo</span>
                  </button>
                </div>
              </div>

              {/* Selector de Tamaño Horizontal */}
              {imageAlign !== "full" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Tamaño de la imagen
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { id: "sm", label: "Pequeño", desc: "30%" },
                      { id: "md", label: "Mediano", desc: "55%" },
                      { id: "lg", label: "Grande", desc: "80%" },
                      { id: "full", label: "100%", desc: "Total" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setImageSize(s.id as any)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          imageSize === s.id
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="text-[11px] font-bold">{s.label}</div>
                        <div className="text-[10px] text-slate-400">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pie de foto / Leyenda opcional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pie de foto / Leyenda (Opcional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Ej: Posición de la lengua para pronunciar la R francesa"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Texto alternativo para SEO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Texto descriptivo Alt (Opcional para SEO)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Ej: Esquema anatómico de la pronunciación francesa"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pie de botones */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmInsertImage}
                disabled={imageUploading || (!imageUrl && !imagePreview)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Insertar Imagen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL INTERACTIVO: INSERTAR VIDEO RESPONSIVO (YOUTUBE, VIMEO, MP4)
         ════════════════════════════════════════════════════════════════════════ */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Cabecera */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <VideoIcon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Insertar Video Educativo</h3>
                  <p className="text-xs text-slate-500">YouTube, Vimeo o archivo directo MP4</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enlace del video (YouTube, Vimeo o URL .mp4)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Se convertirá automáticamente en un reproductor responsivo optimizado para móviles y computadoras.
                </p>
              </div>

              {/* Selector de Ancho */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tamaño del reproductor
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setVideoSize("full")}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      videoSize === "full"
                        ? "border-purple-600 bg-purple-50 text-purple-800 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    Ancho Completo (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSize("md")}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      videoSize === "md"
                        ? "border-purple-600 bg-purple-50 text-purple-800 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    Centrado Estándar (70%)
                  </button>
                </div>
              </div>

              {/* Descripción o pie de video */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pie de video / Descripción (Opcional)
                </label>
                <input
                  type="text"
                  value={videoCaption}
                  onChange={(e) => setVideoCaption(e.target.value)}
                  placeholder="Ej: Ejercicio práctico guiado por Florentin"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Pie de botones */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmInsertVideo}
                disabled={!videoUrl.trim()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Insertar Video</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
