import { createClient } from '@supabase/supabase-js';

// Usar placeholders por defecto para que la compilación (build time) sea exitosa
// y no rompa por la falta de variables de entorno, que se inyectarán en tiempo de ejecución (runtime).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Cliente público estándar de Supabase para operaciones del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

