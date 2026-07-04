-- Esquema de Base de Datos para Plataforma de Francés (Supabase / PostgreSQL)

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 1. Tabla de Usuarios (Sincronizada con auth.users de Supabase)
create table public.usuarios (
  id uuid references auth.users on delete cascade primary key,
  email varchar(255) not null unique,
  nombre varchar(255),
  rol varchar(20) not null default 'alumno' check (rol in ('admin', 'alumno')),
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Planes de Estudio / Cursos
create table public.planes (
  id serial primary key,
  nombre varchar(100) not null,
  descripcion text,
  precio numeric(10, 2) not null,
  total_clases integer not null,
  nivel_sugerido varchar(20) check (nivel_sugerido in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Todos')),
  activo boolean default true not null,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar planes iniciales de ejemplo
insert into public.planes (nombre, descripcion, precio, total_clases, nivel_sugerido) values
('Curso Principiante A1', 'Aprende los fundamentos del idioma francés, pronunciación básica y vocabulario esencial para el día a día.', 49.00, 8, 'A1'),
('Conversación Intermedia B2', 'Prácticas conversacionales intensivas, modismos y perfeccionamiento de la fluidez verbal.', 79.00, 12, 'B2'),
('Membresía Mensual Pro', 'Acceso ilimitado a todos los recursos didácticos más 4 clases individuales personalizadas al mes.', 99.00, 4, 'Todos');

-- 3. Tabla de Inscripciones y Pagos (Stripe/PayPal Integration)
create table public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  plan_id integer references public.planes(id) on delete restrict not null,
  estado_pago varchar(20) not null default 'pendiente' check (estado_pago in ('pendiente', 'pagado', 'fallido', 'reembolsado')),
  clases_restantes integer not null,
  stripe_session_id varchar(255),
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null,
  actualizado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabla de Clases Agendadas / Reservas
create table public.clases (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  fecha_hora timestamp with time zone not null,
  estado varchar(20) not null default 'programada' check (estado in ('programada', 'completada', 'cancelada')),
  link_reunion varchar(500),
  notas_clase text,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabla de Recursos y Materiales Didácticos (Adjuntos PDF, Audios)
create table public.recursos (
  id serial primary key,
  titulo varchar(255) not null,
  descripcion text,
  url_archivo varchar(500) not null,
  nivel varchar(10) not null check (nivel in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Todos')),
  tipo_archivo varchar(50) not null, -- 'pdf', 'audio', 'video', 'otro'
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Tabla de Notificaciones
create table public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete cascade not null,
  titulo varchar(150) not null,
  mensaje text not null,
  leido boolean default false not null,
  creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS) en tablas críticas para asegurar los datos
alter table public.usuarios enable row level security;
alter table public.planes enable row level security;
alter table public.inscripciones enable row level security;
alter table public.clases enable row level security;
alter table public.recursos enable row level security;
alter table public.notificaciones enable row level security;

-- Políticas de Seguridad de Ejemplo
-- Usuarios: Cualquiera puede leer perfiles públicos (o solo el propio), el usuario puede leer su propio perfil, admin lee todo.
create policy "Usuarios pueden ver su propio perfil" on public.usuarios
  for select using (auth.uid() = id);

create policy "Admins pueden hacer todo en usuarios" on public.usuarios
  for all using (
    exists (select 1 from public.usuarios where id = auth.uid() and rol = 'admin')
  );

-- Planes: Cualquiera puede ver los planes activos
create policy "Todos pueden ver planes activos" on public.planes
  for select using (activo = true);

-- Clases: Un alumno solo ve sus propias clases, el profesor admin ve todas
create policy "Alumnos ven sus propias clases" on public.clases
  for select using (auth.uid() = usuario_id);

create policy "Admins ven y gestionan todas las clases" on public.clases
  for all using (
    exists (select 1 from public.usuarios where id = auth.uid() and rol = 'admin')
  );

-- Recursos: Alumnos registrados pueden ver recursos de su nivel (o general), admin gestiona.
create policy "Alumnos autenticados ven recursos" on public.recursos
  for select using (auth.role() = 'authenticated');

create policy "Admins gestionan recursos" on public.recursos
  for all using (
    exists (select 1 from public.usuarios where id = auth.uid() and rol = 'admin')
  );
