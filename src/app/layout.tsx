import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import { getSupabaseAdmin } from "@/lib/supabase";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
});

function parseMultilingualText(text: string | null | undefined, fallback: string): string {
  if (!text) return fallback;
  if (text.includes("[:")) {
    const match = text.match(/\[:es\]([\s\S]*?)(?=\[:|$)/i);
    if (match && match[1] && match[1].trim()) return match[1].trim();
  }
  if (text.includes("[ES]")) {
    const match = text.match(/\[ES\]([\s\S]*?)(?=\[[A-Z]{2}\]|$)/i);
    if (match && match[1] && match[1].trim()) return match[1].trim();
  }
  return text.trim() || fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: config } = await supabaseAdmin
    .from("configuracion_sitio")
    .select("meta_titulo, meta_descripcion, palabras_clave")
    .eq("id", 1)
    .single();

  const title = parseMultilingualText(config?.meta_titulo, "Florentin | Aprende Francés con un Experto Nativo");
  const description = parseMultilingualText(config?.meta_descripcion, "Plataforma educativa para aprender francés. Reserva tus clases en tiempo real, accede a material didáctico exclusivo y sigue tu progreso personalizado.");
  const keywordsRaw = parseMultilingualText(config?.palabras_clave, "aprender frances, clases de frances, profesor de frances, frances online, reserva clases de frances");
  const keywords = keywordsRaw
    ? keywordsRaw.split(",").map((k: string) => k.trim()) 
    : ["aprender frances", "clases de frances", "profesor de frances", "frances online", "reserva clases de frances"];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Profesor Florentin" }],
    verification: {
      google: "fb6CvN9aZsE8CUE_BBckn95nGP3lAc1XUvKiXOWcFLQ",
    },
    openGraph: {
      title,
      description,
      url: "https://lefrancaisavecflorentin.com",
      siteName: "Le Français avec Florentin",
      images: [
        {
          url: "https://lefrancaisavecflorentin.com/icon.jpeg",
          width: 512,
          height: 512,
          alt: "Profesor Florentin",
        },
      ],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://lefrancaisavecflorentin.com/icon.jpeg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener configuración global (Analytics, Meta Pixel) desde Supabase
  const supabaseAdmin = getSupabaseAdmin();
  const { data: config } = await supabaseAdmin
    .from("configuracion_sitio")
    .select("google_analytics_id, meta_pixel_id")
    .eq("id", 1)
    .single();

  return (
    <html lang="es" className={`${outfit.variable} ${plusJakarta.variable} ${playfair.variable} ${greatVibes.variable} overflow-x-clip w-full max-w-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Great+Vibes&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon.jpeg" />
        
        {/* Google Analytics (Dinámico) */}
        {config?.google_analytics_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.google_analytics_id}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.google_analytics_id}');
                `,
              }}
            />
          </>
        )}

        {/* Meta Pixel (Dinámico) */}
        {config?.meta_pixel_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${config.meta_pixel_id}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
