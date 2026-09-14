/**
 * Módulo de Traducción Inteligente y Resiliente - Florentin
 * 
 * Permite traducir textos y artículos Markdown de longitud ILIMITADA (1,000 - 50,000+ caracteres)
 * segmentando automáticamente en fragmentos óptimos (chunking) para la API de MyMemory (< 350 caracteres),
 * respetando sintaxis Markdown, decodificando entidades HTML y garantizando que jamás se inyecten
 * cadenas de error como "QUERY LENGTH LIMIT EXCEEDED".
 */

// Decodificador de entidades HTML comunes retornadas por APIs de traducción
function decodeHTMLEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#160;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&eacute;/g, "é")
    .replace(/&agrave;/g, "à")
    .replace(/&egrave;/g, "è")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ecirc;/g, "ê")
    .replace(/&ccedil;/g, "ç");
}

// Verifica si la respuesta contiene mensajes de error conocidos de APIs de traducción
function isErrorResponse(text: string | null | undefined): boolean {
  if (!text) return true;
  const upper = text.toUpperCase();
  return (
    upper.includes("QUERY LENGTH LIMIT EXCEEDED") ||
    upper.includes("MYMEMORY WARNING") ||
    upper.includes("IS AN INVALID TARGET LANGUAGE") ||
    upper.includes("PLEASE SELECT TWO DISTINCT LANGUAGES") ||
    upper.includes("NO QUERY SPECIFIED") ||
    upper.includes("TOO MANY REQUESTS") ||
    upper.includes("QUOTA EXCEEDED") ||
    upper.includes("DAILY LIMIT")
  );
}

/**
 * Traduce un fragmento atómico (máx 350 caracteres) de forma segura.
 */
export async function translateSingleChunk(
  chunk: string,
  from: string = "es",
  to: string = "fr"
): Promise<string> {
  const trimmed = chunk.trim();
  if (!trimmed) return chunk;

  // Extraer prefijos Markdown comunes (ej: ## , ### , > 💡 , - , * , 1. )
  const prefixMatch = chunk.match(/^(\s*(?:#{1,6}\s+|>\s*(?:💡\s*)?|\s*[-*+]\s+|\d+\.\s+)?)([\s\S]*)$/);
  const prefix = prefixMatch ? prefixMatch[1] : "";
  const body = prefixMatch ? prefixMatch[2].trim() : trimmed;

  if (!body) return chunk;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(body)}&langpair=${from}|${to}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      return chunk;
    }

    const data = await res.json();
    const translatedText = data?.responseData?.translatedText;

    if (
      (data?.responseStatus === 200 || data?.responseStatus === "200") &&
      translatedText &&
      !isErrorResponse(translatedText)
    ) {
      return prefix + decodeHTMLEntities(translatedText);
    }

    return chunk;
  } catch {
    return chunk;
  }
}

/**
 * Divide un texto largo en fragmentos respetando oraciones y párrafos Markdown.
 */
function splitTextIntoSafeChunks(text: string, maxLen: number = 320): string[] {
  if (!text) return [];
  const lines = text.split("\n");
  const chunks: string[] = [];

  for (const line of lines) {
    if (line.length <= maxLen) {
      chunks.push(line);
      continue;
    }

    // Dividir líneas muy largas por oraciones (. ! ?)
    const sentences = line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [line];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + (currentChunk ? " " : "") + sentence).length <= maxLen) {
        currentChunk += (currentChunk ? " " : "") + sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);

        if (sentence.length > maxLen) {
          // Si una sola oración supera maxLen, dividir por palabras
          const words = sentence.split(" ");
          let wordChunk = "";
          for (const word of words) {
            if ((wordChunk + (wordChunk ? " " : "") + word).length <= maxLen) {
              wordChunk += (wordChunk ? " " : "") + word;
            } else {
              if (wordChunk) chunks.push(wordChunk);
              wordChunk = word;
            }
          }
          if (wordChunk) chunks.push(wordChunk);
          currentChunk = "";
        } else {
          currentChunk = sentence;
        }
      }
    }

    if (currentChunk) chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Traduce un texto largo de cualquier longitud (artículos completos)
 * manteniendo la estructura Markdown y ejecutando en lotes paralelos seguros.
 */
export async function translateLongText(
  text: string,
  from: string = "es",
  to: "fr" | "en" = "fr",
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  if (!text || !text.trim()) return text || "";

  // Si el texto es muy corto y cabe en un solo chunk
  if (text.length <= 320 && !text.includes("\n")) {
    const res = await translateSingleChunk(text, from, to);
    if (onProgress) onProgress(100);
    return res;
  }

  const chunks = splitTextIntoSafeChunks(text, 320);
  const total = chunks.length;
  if (total === 0) return text;

  const translatedChunks: string[] = new Array(total);
  let completed = 0;

  // Procesar en lotes de 3 en paralelo con pequeños intervalos para no saturar
  const BATCH_SIZE = 3;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batchIndices: number[] = [];
    for (let j = i; j < Math.min(i + BATCH_SIZE, total); j++) {
      batchIndices.push(j);
    }

    await Promise.all(
      batchIndices.map(async (idx) => {
        const chunk = chunks[idx];
        if (!chunk.trim()) {
          translatedChunks[idx] = "";
        } else {
          translatedChunks[idx] = await translateSingleChunk(chunk, from, to);
        }
        completed++;
        if (onProgress) {
          onProgress(Math.min(100, Math.round((completed / total) * 100)));
        }
      })
    );

    // Pequeño retardo entre lotes para respetar rate limits
    if (i + BATCH_SIZE < total) {
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }

  // Reconstruir el texto uniendo las líneas
  return translatedChunks.join("\n");
}

/**
 * Traduce un texto simple (títulos, extractos, nombres de categorías).
 */
export async function translateTextChunk(
  text: string,
  from: string = "es",
  to: "fr" | "en" = "fr"
): Promise<string> {
  if (!text || !text.trim()) return text || "";
  if (text.length > 320) {
    return translateLongText(text, from, to);
  }
  return translateSingleChunk(text, from, to);
}

/**
 * Traduce un paquete completo de artículo (Título, Extracto y Contenido)
 */
export async function translateArticleBundle(
  article: {
    titulo: string;
    extracto?: string | null;
    contenido: string;
  },
  from: string = "es",
  to: "fr" | "en" = "fr",
  onStatus?: (status: string) => void
): Promise<{
  titulo: string;
  extracto: string;
  contenido: string;
}> {
  const langLabel = to === "fr" ? "Francés" : "Inglés";

  if (onStatus) onStatus(`Traduciendo título a ${langLabel}...`);
  const titulo = article.titulo ? await translateTextChunk(article.titulo, from, to) : "";

  if (onStatus) onStatus(`Traduciendo extracto a ${langLabel}...`);
  const extracto = article.extracto ? await translateTextChunk(article.extracto, from, to) : "";

  if (onStatus) onStatus(`Traduciendo cuerpo completo del artículo a ${langLabel}...`);
  const contenido = article.contenido
    ? await translateLongText(article.contenido, from, to, (pct) => {
        if (onStatus) onStatus(`Traduciendo cuerpo a ${langLabel} (${pct}%)...`);
      })
    : "";

  return { titulo, extracto, contenido };
}
