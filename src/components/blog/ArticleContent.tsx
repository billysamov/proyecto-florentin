"use client";

import React from "react";
import Image from "next/image";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  // Si el contenido contiene etiquetas HTML enriquecidas (de Word / WYSIWYG / Multimedia), renderizar directamente
  const isHtml = /<(p|h[1-6]|ul|ol|li|blockquote|div|table|strong|b|em|i|u|span|br|hr|figure|figcaption|img|iframe|video)\b[^>]*>/i.test(content);
  if (isHtml) {
    return (
      <div
        className="rich-text-content article-body font-sans text-slate-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Renderizador limpio y seguro de bloques de texto/Markdown (compatibilidad con artículos antiguos)
  const renderBlocks = (raw: string) => {
    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];
    let listType: "ul" | "ol" | null = null;
    let tableRows: string[][] = [];
    let inTable = false;

    const flushParagraph = (idx: number) => {
      if (currentParagraph.length > 0) {
        // Preservar saltos de línea (Enter simple) dentro del párrafo usando <br />
        const linesToRender = currentParagraph.filter((l) => l.trim().length > 0);
        if (linesToRender.length > 0) {
          elements.push(
            <p key={`p-${idx}`} className="text-slate-700 text-lg leading-relaxed mb-6 font-normal">
              {linesToRender.map((lineText, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {parseInlineStyles(lineText)}
                  {lineIdx < linesToRender.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = (idx: number) => {
      if (currentList.length > 0) {
        if (listType === "ul") {
          elements.push(
            <ul key={`ul-${idx}`} className="space-y-2.5 my-6 list-disc list-inside text-slate-700 text-lg pl-2">
              {currentList.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="text-slate-800">{parseInlineStyles(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else if (listType === "ol") {
          elements.push(
            <ol key={`ol-${idx}`} className="space-y-2.5 my-6 list-decimal list-inside text-slate-700 text-lg pl-2 font-semibold">
              {currentList.map((item, i) => (
                <li key={i} className="leading-relaxed font-normal">
                  <span className="text-slate-800">{parseInlineStyles(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushTable = (idx: number) => {
      if (tableRows.length > 0) {
        const [headerRow, ...bodyRows] = tableRows;
        elements.push(
          <div key={`table-${idx}`} className="overflow-x-auto my-8 border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left text-sm text-slate-700">
              {headerRow && (
                <thead className="bg-[#0c1b33] text-white uppercase text-xs tracking-wider">
                  <tr>
                    {headerRow.map((col, cIdx) => (
                      <th key={cIdx} className="px-5 py-3.5 font-bold">
                        {parseInlineStyles(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-200 bg-white">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-5 py-3.5 font-medium">
                        {parseInlineStyles(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Separador horizontal
      if (trimmed === "---" || trimmed === "***") {
        flushParagraph(idx);
        flushList(idx);
        flushTable(idx);
        elements.push(<hr key={`hr-${idx}`} className="my-10 border-slate-200" />);
        return;
      }

      // Tablas Markdown (| col1 | col2 |)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        flushParagraph(idx);
        flushList(idx);
        // Ignorar fila de separador tipo |:---|:---|
        if (trimmed.includes("---") || trimmed.includes(":---")) {
          return;
        }
        const cols = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cols);
        inTable = true;
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Encabezados
      if (trimmed.startsWith("### ")) {
        flushParagraph(idx);
        flushList(idx);
        elements.push(
          <h3 key={`h3-${idx}`} className="text-xl sm:text-2xl font-bold text-[#0c1b33] mt-8 mb-4 tracking-tight">
            {parseInlineStyles(trimmed.replace("### ", ""))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith("## ")) {
        flushParagraph(idx);
        flushList(idx);
        elements.push(
          <h2 key={`h2-${idx}`} className="text-2xl sm:text-3xl font-black text-[#0c1b33] font-serif mt-10 mb-4 tracking-tight border-b border-slate-100 pb-3">
            {parseInlineStyles(trimmed.replace("## ", ""))}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith("# ")) {
        flushParagraph(idx);
        flushList(idx);
        elements.push(
          <h1 key={`h1-${idx}`} className="text-3xl sm:text-4xl font-black text-[#0c1b33] font-serif mt-12 mb-6 tracking-tight">
            {parseInlineStyles(trimmed.replace("# ", ""))}
          </h1>
        );
        return;
      }

      // Blockquotes y Tips destacados
      if (trimmed.startsWith("> ")) {
        flushParagraph(idx);
        flushList(idx);
        const quoteText = trimmed.replace("> ", "");
        const isTip = quoteText.includes("💡") || quoteText.toLowerCase().includes("consejo") || quoteText.toLowerCase().includes("tip");
        elements.push(
          <div
            key={`quote-${idx}`}
            className={`my-6 p-5 sm:p-6 rounded-2xl border ${
              isTip
                ? "bg-amber-50/80 border-amber-200/70 text-amber-950"
                : "bg-slate-50 border-l-4 border-l-[#c99a3c] border-slate-200 text-slate-700"
            }`}
          >
            <div className="text-base sm:text-lg italic font-medium leading-relaxed">
              {parseInlineStyles(quoteText)}
            </div>
          </div>
        );
        return;
      }

      // Listas desordenadas (- o *)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph(idx);
        listType = "ul";
        currentList.push(trimmed.replace(/^[-*]\s+/, ""));
        return;
      }

      // Listas ordenadas (1., 2.)
      if (/^\d+\.\s+/.test(trimmed)) {
        flushParagraph(idx);
        listType = "ol";
        currentList.push(trimmed.replace(/^\d+\.\s+/, ""));
        return;
      }

      // Línea vacía
      if (!trimmed) {
        flushParagraph(idx);
        flushList(idx);
        return;
      }

      // Párrafo normal en acumulación
      currentParagraph.push(trimmed);
    });

    flushParagraph(lines.length);
    flushList(lines.length);
    flushTable(lines.length);

    return elements;
  };

  // Función para procesar negritas (**texto**), cursivas (*texto*), código (`code`), enlaces y etiquetas <br>
  const parseInlineStyles = (text: string): React.ReactNode => {
    // Si el texto incluye etiquetas <br> o <br/> escritas por el usuario, las procesamos como saltos de línea reales
    if (/<br\s*\/?>/i.test(text)) {
      const segments = text.split(/<br\s*\/?>/i);
      return segments.map((seg, i) => (
        <React.Fragment key={`br-seg-${i}`}>
          {parseTokens(seg)}
          {i < segments.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return parseTokens(text);
  };

  const parseTokens = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Expresión regular para tokens inline: **bold**, *italic*, `code`, [label](url)
    const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
      // Texto previo al token
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];

      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={key++} className="font-bold text-[#0c1b33]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={key++} className="italic text-slate-800">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code key={key++} className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={key++}
              href={linkMatch[2]}
              target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
              rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[#3b82f6] hover:text-[#2563eb] underline font-semibold transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        }
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return <div className="article-body font-sans text-slate-700">{renderBlocks(content)}</div>;
}
