const { createClient } = require('@supabase/supabase-js');

// Recuperar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Las variables NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY no están definidas.");
  console.error("Asegúrate de ejecutar este script cargando las variables de entorno, ej: node --env-file=.env.local scripts/check_recursos_fields.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkFields() {
  const { data: recursos, error } = await supabase
    .from('recursos')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error al consultar recursos:", error);
    return;
  }

  console.log("Campos de recursos:");
  console.log(recursos);
}

checkFields();
