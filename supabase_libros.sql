-- ==========================================================
-- SCRIPT DE BASE DE DATOS: TIENDA DE LIBROS Y CUADERNOS
-- ==========================================================

-- 1. Tabla de Productos Digitales (Libros, Cuadernos de Ejercicios, Guías)
CREATE TABLE IF NOT EXISTS productos_digitales (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descripcion TEXT,
  nivel TEXT DEFAULT 'Todos los Niveles',
  categoria TEXT CHECK (categoria IN ('libro', 'cuaderno', 'guia', 'pack')) DEFAULT 'cuaderno',
  precio_eur NUMERIC(10,2) NOT NULL DEFAULT 14.90,
  precio_usd NUMERIC(10,2) NOT NULL DEFAULT 16.50,
  paginas INTEGER DEFAULT 60,
  total_ejercicios INTEGER DEFAULT 100,
  formato TEXT DEFAULT 'PDF Descargable',
  url_portada TEXT NOT NULL DEFAULT '/book_cover_1.png',
  archivo_storage_path TEXT, -- Ruta privada en bucket de Supabase
  preview_pdf_url TEXT,       -- Enlace a muestra gratuita de las primeras páginas
  badge TEXT DEFAULT 'Más Vendido',
  destacado BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabla de Compras de Libros y Productos Digitales
CREATE TABLE IF NOT EXISTS compras_productos (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos_digitales(id) ON DELETE RESTRICT,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  email_comprador TEXT NOT NULL,
  nombre_comprador TEXT,
  monto_pagado NUMERIC(10,2) NOT NULL,
  divisa VARCHAR(5) NOT NULL DEFAULT 'eur',
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  descargas_realizadas INTEGER DEFAULT 0,
  ultimo_enlace_expira TIMESTAMP WITH TIME ZONE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Habilitar Seguridad (RLS)
ALTER TABLE productos_digitales ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_productos ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para productos activos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'productos_digitales' AND policyname = 'Lectura pública de productos digitales activos'
  ) THEN
    CREATE POLICY "Lectura pública de productos digitales activos" 
      ON productos_digitales FOR SELECT 
      USING (activo = true OR public.es_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'productos_digitales' AND policyname = 'Gestión completa de productos solo admin'
  ) THEN
    CREATE POLICY "Gestión completa de productos solo admin" 
      ON productos_digitales FOR ALL 
      USING (public.es_admin(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'compras_productos' AND policyname = 'Lectura de compras para el comprador y admin'
  ) THEN
    CREATE POLICY "Lectura de compras para el comprador y admin" 
      ON compras_productos FOR SELECT 
      USING (public.es_admin(auth.uid()) OR auth.uid() = usuario_id);
  END IF;
END $$;

-- 4. Datos iniciales de demostración
INSERT INTO productos_digitales (titulo, subtitulo, descripcion, nivel, categoria, precio_eur, precio_usd, paginas, total_ejercicios, formato, url_portada, badge, destacado, orden)
VALUES
(
  'Cuaderno de Francés Cotidiano: 150 Ejercicios Clave con Soluciones',
  'Domina las estructuras gramaticales indispensables y el vocabulario de situaciones reales.',
  'Diseñado para estudiantes hispanohablantes. Incluye explicaciones paso a paso de por qué se usa cada forma verbal, hojas de vocabulario contextual y 150 actividades prácticas con solucionario detallado.',
  'A1 - A2 (Principiante / Básico)',
  'cuaderno',
  14.90,
  16.50,
  85,
  150,
  'PDF Interactivo + Imprimible',
  '/book_cuaderno_a1.png',
  '⭐ Más Recomendado',
  true,
  1
),
(
  'El Arte de la Conjugación Francesa: Guía y Cuaderno de Práctica',
  'Aprende a conjugar con fluidez sin memorizar tablas infinitas ni cometer errores típicos.',
  'El método definitivo de Florentin para asimilar el Subjonctif, Passé Composé vs Imparfait y el Futur sin estrés. Incluye trampas clásicas de pronunciación entre cómo se escribe y cómo suena.',
  'B1 - B2 (Intermedio)',
  'libro',
  19.90,
  21.90,
  110,
  180,
  'PDF Descargable + Cheat Sheets',
  '/book_conjugacion.png',
  '🔥 Esencial B1-B2',
  true,
  2
),
(
  'Pack Intensivo de Pronunciación y Fonética Francesa con Audios Nativos',
  'El manual anatómico de sonidos franceses y guía de entonación natural.',
  'Guía detallada con ejercicios guiados, diagrama de colocación de boca y lengua, y acceso a audios descargables en alta fidelidad grabados por Florentin.',
  'Todos los Niveles',
  'pack',
  24.90,
  27.50,
  65,
  80,
  'PDF + Archivos MP3 HD',
  '/book_fonetica.png',
  '🎧 Con Audios Nativos',
  false,
  3
)
ON CONFLICT DO NOTHING;
