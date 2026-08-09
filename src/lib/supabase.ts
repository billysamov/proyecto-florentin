import { createClient } from '@supabase/supabase-js';

// Usar placeholders por defecto para que la compilación (build time) sea exitosa
// y no rompa por la falta de variables de entorno, que se inyectarán en tiempo de ejecución (runtime).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Cliente público estándar de Supabase para operaciones del cliente con manejo resiliente de red
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) =>
      fetch(...args).catch((err) => {
        // Capturar variaciones de red o refresh de sesión sin lanzar TypeError no controlado en consola
        console.warn("Supabase network drop recovered gracefully:", err.message);
        return new Response(JSON.stringify({ error: "Network unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      })
  }
});

// Cliente administrador (solo para ejecutar en el servidor Next.js)
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
};

