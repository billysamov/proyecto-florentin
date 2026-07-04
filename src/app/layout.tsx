import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
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
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: config } = await supabaseAdmin
    .from("configuracion_sitio")
    .select("meta_titulo, meta_descripcion, palabras_clave")
    .eq("id", 1)
    .single();

  return {
    title: config?.meta_titulo || "Florentin | Aprende Francés con un Experto Nativo",
    description: config?.meta_descripcion || "Plataforma educativa para aprender francés. Reserva tus clases en tiempo real, accede a material didáctico exclusivo y sigue tu progreso personalizado.",
    keywords: config?.palabras_clave 
      ? config.palabras_clave.split(",").map((k: string) => k.trim()) 
      : ["aprender frances", "clases de frances", "profesor de frances", "frances online", "reserva clases de frances"],
    authors: [{ name: "Profesor Florentin" }],
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
    <html lang="es" className={`${outfit.variable} ${plusJakarta.variable} overflow-x-hidden w-full max-w-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
        
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
      <body>
        {children}
      </body>
    </html>
  );
}
