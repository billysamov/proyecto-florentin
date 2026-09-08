# 🛡️ AUDITORÍA DEL SISTEMA & HOJA DE RUTA TÉCNICA
**Proyecto:** Le Français avec Florentin  
**Fecha de Auditoría:** Septiembre 2026  
**Estado:** Auditoría Finalizada — Tareas de mejora pendientes de ejecución  
**Skill para Agentes IA:** `.agents/skills/auditoria-sistema/SKILL.md`

---

## 📌 Resumen Ejecutivo

Se realizó una auditoría técnica completa del proyecto abarcando:
1. **Consumo y límites de plataformas gratuitas (Vercel, Supabase, Resend)**
2. **Seguridad (Auth, RLS, Tokens, Pasarela Stripe)**
3. **Trazabilidad y Observabilidad (Email Logs, Reservas, Webhooks)**
4. **Escalabilidad y Limpieza de Recursos**

---

## 📊 1. Monitoreo de Cuotas de Plataformas Gratuitas

### A. Supabase (Plan Free / Hobby)
* **Base de datos (Almacenamiento PostgreSQL):** Límite de **500 MB**. Uso actual: **~15 MB** (3.0%). Quedan **~485 MB libres**.
* **Storage de Archivos (Material didáctico / PDFs):** Límite de **1,000 MB (1 GB)**. Uso actual: **76.57 MB** (51 archivos). Quedan **923.43 MB libres** (92.4% libre).
* **Usuarios Activos Mensuales (MAU):** Límite de **50,000**. Uso actual: **8 usuarios**.
* **Riesgo de Pausa por Inactividad:** Supabase pausa proyectos gratuitos tras 7 días continuos sin consultas. **Actualmente protegido:** Los dos crons diarios de Vercel (07:00 y 08:00 UTC) realizan consultas a la base de datos a diario, manteniendo el proyecto activo indefinidamente.

### B. Resend (Plan Gratuito de Emails)
* **Límite Mensual:** **3,000 correos / mes**.
* **Uso Actual:** Entre **40 y 70 correos / mes** (confirmaciones, recordatorios de clase y renovaciones).
* **Margen:** **> 2,930 correos disponibles cada mes**.
* **Capacidad:** Suficiente para atender hasta 150+ alumnos activos sin necesidad de pasar a un plan de pago.

### C. Vercel (Plan Hobby)
* **Tráfico & Serverless Functions:** 100 GB / 1 millón de llamadas. Consumo actual < 4%.
* **Builds:** 6,000 minutos/mes. Consumo actual < 30 minutos/mes.
* **⚠️ ATENCIÓN - Cuota de Tareas Cron:**
  * Vercel Hobby permite **máximo 2 tareas cron al día**.
  * Actualmente ya están programadas las 2 en `vercel.json`:
    1. `/api/cron/recordatorios-clase` (07:00 UTC)
    2. `/api/cron/lead-nurturing` (08:00 UTC)
  * **Conclusión:** Si se agrega una 3ª tarea cron, Vercel no permitirá el despliegue. Si se requiere más automatización, se deben agrupar en un solo endpoint o disparar externamente.

---

## 🚨 2. Diagnóstico de Seguridad

### 🔴 P0 - Crítico: Clave Secreta de Stripe en Tabla Pública
* **Problema:** La columna `stripe_secret_key` en la tabla `configuracion_sitio` contiene la clave `sk_live_...` de producción. La política RLS de dicha tabla permite lectura pública (`USING (true)`).
* **Riesgo:** Cualquier usuario anónimo desde la consola del navegador puede leer la clave de Stripe y tener acceso total a la cuenta de pagos.
* **Solución requerida:** Vaciar o eliminar la columna `stripe_secret_key` de la base de datos y manejarla exclusivamente como variable de entorno de servidor (`STRIPE_SECRET_KEY` en `.env.local` y Vercel).

### 🟠 P1 - Alto: Falta de Validación de Sesión en Endpoints de Alumno
* **Problema:** `/api/reservar`, `/api/cancelar` y `/api/reprogramar` reciben `usuario_id` en el cuerpo JSON sin validar el token JWT / cookie de sesión de Supabase.
* **Riesgo:** Si un usuario malicioso conoce el UUID de otro alumno, podría agendar o cancelar clases a su nombre.
* **Solución requerida:** Extraer y verificar la identidad del usuario llamante con `supabase.auth.getUser()`.

### 🟠 P1 - Alto: Tokens de Cron Hardcodeados y Bypass de User-Agent
* **Problema:** En `/api/cron/recordatorios-clase`, `/api/cron/lead-nurturing` y `/api/cron/renovacion-plan` se acepta el token en texto plano `florentin_secret_nurturing_token` o un `User-Agent: vercel-cron` sin validar secreto.
* **Solución requerida:** Validar únicamente el secreto `CRON_SECRET` mediante el header `Authorization: Bearer <CRON_SECRET>`.

### 🟡 P2 - Medio: Acceso Público a la Biblioteca de Recursos
* **Problema:** Clientes anónimos pueden listar todos los recursos didácticos de la tabla `recursos`.
* **Solución requerida:** Ajustar la política RLS para restringir la lectura a administradores y a alumnos que tengan el recurso asignado en `recursos_asignados`.

---

## 📈 3. Trazabilidad

* **Tabla `email_logs`:**
  * El código en `src/lib/emails.ts` intenta registrar auditoría de cada correo enviado, pero la tabla `email_logs` no fue creada en la base de datos activa.
  * **Solución requerida:** Crear la tabla `email_logs` con RLS para administradores.

---

## 🧹 4. Limpieza y Optimización

* **Archivo Huérfano en Raíz:** `ChatGPT Image 6 ago 2026, 10_08_12 p.m..png` (938 KB) en la raíz del proyecto no es referenciado por ningún componente. Debe removerse para aligerar el repositorio y los despliegues.

---

## 📋 5. Hoja de Ruta de Implementación (Pendiente de Ejecución)

| Prioridad | Tarea | Componente Afectado |
| :---: | :--- | :--- |
| **P0** | Remover `stripe_secret_key` de la tabla pública `configuracion_sitio`. | Base de datos Supabase / CMS |
| **P1** | Blindar `/api/reservar`, `/api/cancelar` y `/api/reprogramar` con validación de sesión. | `src/app/api/` |
| **P1** | Eliminar tokens hardcodeados en crons y exigir `CRON_SECRET`. | `src/app/api/cron/` |
| **P2** | Crear tabla `email_logs` en Supabase para trazabilidad. | Supabase PostgreSQL |
| **P3** | Eliminar imagen pesada de 1MB en la raíz del repositorio. | Raíz del proyecto |

> **Nota para IAs / Desarrolladores:** Este documento y el skill `.agents/skills/auditoria-sistema/SKILL.md` definen las directrices de la auditoría. Cuando se autorice la ejecución, aplicar cada paso respetando las pruebas y verificando con `npm run build`.
