-- ==========================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS (SUPABASE)
-- ==========================================

-- 1. Crear tabla de Usuarios
CREATE TABLE usuarios (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  rol TEXT DEFAULT 'alumno' CHECK (rol IN ('alumno', 'admin')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Crear tabla de Inscripciones (Pagos y Saldos)
CREATE TABLE inscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL,
  estado_pago varchar(20) default 'pendiente',
  clases_restantes integer default 0,
  stripe_session_id varchar(100),
  monto_pagado numeric(10, 2),
  divisa varchar(10),
  aviso_renovacion_enviado BOOLEAN DEFAULT false,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Crear tabla de Clases Agendadas
CREATE TABLE clases (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  estado TEXT DEFAULT 'programada' CHECK (estado IN ('programada', 'completada', 'cancelada')),
  notas_profesor TEXT,
  enlace_meet TEXT,
  enlace_grabacion TEXT, -- Campo para guardar el link de la lección grabada
  reprogramaciones_restantes INTEGER DEFAULT 2, -- Límite de reprogramaciones por clase
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Crear tabla de Recursos (Material Didáctico)
CREATE TABLE recursos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('pdf', 'audio', 'video')),
  nivel TEXT NOT NULL,
  url_archivo TEXT NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4.5. Crear tabla de Recursos Asignados (Unión muchos a muchos)
CREATE TABLE recursos_asignados (
  id SERIAL PRIMARY KEY,
  recurso_id INTEGER REFERENCES recursos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (recurso_id, usuario_id)
);

-- 5. Habilitar Seguridad (Row Level Security - RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos_asignados ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para verificar si un usuario es administrador de forma segura (evita recursión de RLS)
CREATE OR REPLACE FUNCTION public.es_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = user_id AND rol = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. Políticas de acceso (RLS)

-- TABLA: usuarios
CREATE POLICY "Lectura de usuarios" ON usuarios FOR SELECT 
  USING (public.es_admin(auth.uid()) OR auth.uid() = id);

CREATE POLICY "Escritura de usuarios" ON usuarios FOR ALL 
  USING (public.es_admin(auth.uid()) OR auth.uid() = id);

-- TABLA: inscripciones
CREATE POLICY "Lectura de inscripciones" ON inscripciones FOR SELECT 
  USING (public.es_admin(auth.uid()) OR auth.uid() = usuario_id);

CREATE POLICY "Escritura de inscripciones" ON inscripciones FOR ALL 
  USING (public.es_admin(auth.uid()));

-- TABLA: clases
CREATE POLICY "Lectura de clases" ON clases FOR SELECT 
  USING (public.es_admin(auth.uid()) OR auth.uid() = usuario_id);

CREATE POLICY "Insertar clases" ON clases FOR INSERT 
  WITH CHECK (public.es_admin(auth.uid()) OR auth.uid() = usuario_id);

-- Solo administradores pueden actualizar y eliminar clases de forma directa en Supabase
CREATE POLICY "Actualizar clases solo admin" ON clases FOR UPDATE 
  USING (public.es_admin(auth.uid()));

CREATE POLICY "Eliminar clases solo admin" ON clases FOR DELETE 
  USING (public.es_admin(auth.uid()));

-- TABLA: recursos (Protección: lectura restringida a alumnos asignados o admin)
CREATE POLICY "Lectura de recursos autorizados" ON recursos FOR SELECT 
  USING (
    public.es_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM recursos_asignados
      WHERE recurso_id = recursos.id AND usuario_id = auth.uid()
    )
  );

CREATE POLICY "Escritura de recursos solo admin" ON recursos FOR ALL 
  USING (public.es_admin(auth.uid()));

-- TABLA: recursos_asignados
CREATE POLICY "Lectura de asignaciones" ON recursos_asignados FOR SELECT 
  USING (public.es_admin(auth.uid()) OR auth.uid() = usuario_id);

CREATE POLICY "Escritura de asignaciones solo admin" ON recursos_asignados FOR ALL 
  USING (public.es_admin(auth.uid()));

-- ==========================================
-- 7. TABLAS PARA EL CMS (Administración)
-- ==========================================

-- Tabla para la configuración global de la Landing Page y Conexiones
CREATE TABLE configuracion_sitio (
  id INT PRIMARY KEY DEFAULT 1,
  titulo_hero TEXT DEFAULT 'Domina el francés con clases personalizadas',
  subtitulo_hero TEXT DEFAULT 'Aprende a tu ritmo con un profesor nativo. Flexibilidad, material exclusivo y enfoque en la conversación fluida.',
  hero_badge TEXT DEFAULT 'Profesor Nativo de París',
  stripe_public_key TEXT,
  google_analytics_id TEXT,
  meta_pixel_id TEXT,
  dias_laborables TEXT DEFAULT '[1,2,3,4,5]', -- 1:Lunes a 5:Viernes
  hora_inicio TEXT DEFAULT '09:00',
  hora_fin TEXT DEFAULT '18:00',
  almuerzo_inicio TEXT DEFAULT '13:00',
  almuerzo_fin TEXT DEFAULT '14:00',
  zona_horaria TEXT DEFAULT 'Europe/Paris',
  email_bienvenida_activo BOOLEAN DEFAULT true,
  email_recordatorio_activo BOOLEAN DEFAULT true,
  email_renovacion_activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insertar fila única por defecto
INSERT INTO configuracion_sitio (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Tabla para los Planes de Estudio
CREATE TABLE planes_estudio (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  total_clases INTEGER NOT NULL,
  tipo TEXT DEFAULT 'paquete',
  nivel TEXT DEFAULT 'A1',
  activo BOOLEAN DEFAULT TRUE,
  imagen_url TEXT DEFAULT '/french_hero.png',
  badge TEXT DEFAULT 'Popular',
  duracion TEXT DEFAULT '4 Semanas',
  caracteristicas TEXT DEFAULT 'Clases particulares en vivo\nMaterial interactivo en PDF incluido\nAtención personalizada 1 a 1',
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE planes_estudio ADD COLUMN IF NOT EXISTS imagen_url TEXT DEFAULT '/french_hero.png';
ALTER TABLE planes_estudio ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT 'Popular';
ALTER TABLE planes_estudio ADD COLUMN IF NOT EXISTS duracion TEXT DEFAULT '4 Semanas';
ALTER TABLE planes_estudio ADD COLUMN IF NOT EXISTS caracteristicas TEXT DEFAULT 'Clases particulares en vivo\nMaterial interactivo en PDF incluido\nAtención personalizada 1 a 1';

-- Habilitar RLS para tablas del CMS
ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes_estudio ENABLE ROW LEVEL SECURITY;

-- Políticas CMS
CREATE POLICY "Lectura publica de configuracion" ON configuracion_sitio FOR SELECT USING (true);
CREATE POLICY "Escritura de configuracion solo admin" ON configuracion_sitio FOR ALL USING (public.es_admin(auth.uid()));

CREATE POLICY "Lectura publica de planes" ON planes_estudio FOR SELECT USING (activo = true OR public.es_admin(auth.uid()));
CREATE POLICY "Escritura de planes solo admin" ON planes_estudio FOR ALL USING (public.es_admin(auth.uid()));
