---
name: auditoria-sistema
description: >-
  Instrucciones, contexto y hoja de ruta técnica de la auditoría del sistema Florentin.
  Utiliza este skill para conocer el estado actual de seguridad, cuotas de plataformas
  gratuitas (Vercel, Supabase, Resend), trazabilidad y las tareas de mejora pendientes de ejecución.
---

# 🛡️ Skill: Auditoría del Sistema & Hoja de Ruta (Florentin)

> **Estado:** Auditoría completada — Pendiente de ejecución de mejoras.  
> **Ámbito:** Seguridad, Trazabilidad, Escalabilidad y Cuotas de Plataformas Gratuitas.  
> **Documento Completo:** Consulta `AUDITORIA.md` en la raíz del proyecto.

---

## 🎯 Contexto para Agentes de IA (Antigravity / LLM)

Este proyecto es una plataforma web para la enseñanza de francés (**Le Français avec Florentin**), construida con:
* **Framework:** Next.js 16 (App Router + Turbopack)
* **Base de Datos & Auth:** Supabase (PostgreSQL + Auth + Storage)
* **Pasarela de Pagos:** Stripe Checkout & Webhooks
* **Mailing Transaccional:** Resend (vía SMTP con Nodemailer)
* **Despliegue & Crons:** Vercel (Plan Hobby)

Se realizó una auditoría completa del sistema. Cualquier agente que continúe el desarrollo debe respetar los siguientes hallazgos y prioridades.

---

## 🚨 Hallazgos Críticos de Seguridad

1. **Fuga de `stripe_secret_key` en `configuracion_sitio` (P0 - Crítico):**
   * La tabla `configuracion_sitio` contiene la clave secreta de producción `sk_live_...` y tiene una política RLS pública `USING (true)`.
   * **Acción requerida:** Remover la columna `stripe_secret_key` de la tabla pública o vaciar su contenido. La clave privada debe residir exclusivamente en variables de entorno seguras (`.env.local` y variables de Vercel).

2. **Endpoints de Alumnos sin Verificación Criptográfica de Sesión (P1 - Alto):**
   * `/api/reservar`, `/api/cancelar` y `/api/reprogramar` reciben `usuario_id` en el body JSON sin validar el token JWT / cookie de Supabase.
   * **Acción requerida:** Extraer el token de autorización (Bearer o cookie `sb-*-auth-token`) y validar con `supabase.auth.getUser()` antes de permitir cualquier operación sobre las clases del usuario.

3. **Tokens Secretos Hardcodeados en Crons (P1 - Alto):**
   * En `/api/cron/recordatorios-clase`, `/api/cron/lead-nurturing` y `/api/cron/renovacion-plan`, existe el token en duro `florentin_secret_nurturing_token` y una comprobación insegura de `user-agent` (`vercel-cron`).
   * **Acción requerida:** Eliminar el token hardcodeado y validar estrictamente `request.headers.get("authorization") === \`Bearer \${process.env.CRON_SECRET}\``.

4. **Tabla `recursos` accesible anónimamente (P2 - Medio):**
   * Los archivos didácticos pueden ser leídos por clientes anónimos. Revisar y activar la política RLS para que solo usuarios con dicho recurso asignado en `recursos_asignados` puedan consultarlo.

---

## 📊 Estado de Cuotas Gratuitas (Límites y Riesgos)

* **Supabase:**
  * Base de datos: ~15 MB de 500 MB (3% usado). Margen: **485 MB libres**.
  * Storage (PDFs): 76.57 MB de 1,000 MB (7.6% usado). Margen: **923.4 MB libres**.
  * Usuarios: 8 de 50,000 MAU.
  * **Regla de oro:** El proyecto gratuito no se pausará porque los crons diarios de Vercel (07:00 y 08:00 UTC) realizan consultas a la base de datos a diario.
* **Resend:**
  * Cuota: 3,000 correos/mes. Uso actual: ~40-70 correos/mes (< 2.5%).
  * Margen: **> 2,930 correos disponibles cada mes**.
* **Vercel:**
  * Tráfico y Serverless: Menos del 4% consumido.
  * **LÍMITE ALCANZADO EN CRONS:** Vercel Hobby solo permite **2 tareas cron diarias**. Ya están ocupadas las 2 (`0 7 * * *` y `0 8 * * *`). No añadir más crons a `vercel.json` sin consolidarlos en una única función o usar un disparador externo.

---

## 📈 Trazabilidad

* **Tabla `email_logs`:**
  * La tabla no existe en la base de datos activa (error en cache de esquema).
  * **Acción requerida:** Ejecutar la creación de la tabla `email_logs` en Supabase para que los envíos de correo en `src/lib/emails.ts` queden registrados con éxito.

---

## 🛠️ Procedimiento de Ejecución de Mejoras (Para cuando se active la resolución)

Cuando el usuario solicite implementar las mejoras de la auditoría:
1. **Paso 1:** Limpiar `stripe_secret_key` de la tabla `configuracion_sitio` mediante script seguro.
2. **Paso 2:** Crear la tabla `email_logs` en Supabase con sus políticas RLS.
3. **Paso 3:** Blindar `/api/reservar`, `/api/cancelar` y `/api/reprogramar` con validación de sesión de usuario.
4. **Paso 4:** Limpiar tokens hardcodeados en los 3 endpoints de `/api/cron/`.
5. **Paso 5:** Eliminar la imagen residual `ChatGPT Image 6 ago 2026, 10_08_12 p.m..png` de la raíz del proyecto.
6. **Paso 6:** Verificar compilación (`npm run build`) y notificar al usuario con el reporte final.
