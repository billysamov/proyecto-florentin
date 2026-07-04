const { createClient } = require("@supabase/supabase-js");

// Recuperar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Las variables NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY no están definidas.");
  console.error("Asegúrate de ejecutar este script cargando las variables de entorno, ej: node --env-file=.env.local scripts/check_clases_columns.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data, error } = await supabase
    .from("clases")
    .select("*")
    .limit(1);

  if (error) {
    console.log("Error:", error);
  } else {
    if (data.length > 0) {
      console.log("Columnas de clases:", Object.keys(data[0]).join(", "));
    } else {
      console.log("Tabla de clases vacía, pero consultando estructura...");
      // Intentar forzar error de columna inexistente para ver la estructura
      const { error: err2 } = await supabase
        .from("clases")
        .select("columna_inventada_123");
      
      if (err2) {
        console.log("Mensaje de error (contiene las columnas válidas):", err2.message);
      } else {
        console.log("No se pudo obtener la estructura.");
      }
    }
  }
}

main();
