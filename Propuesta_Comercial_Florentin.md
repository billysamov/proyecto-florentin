# Propuesta Comercial: Plataforma Integral de Autogestión Educativa
**Cliente:** Profesor Florentin (Clases de Francés)
**Fecha:** 23 de Junio de 2026

---

## 1. Resumen Ejecutivo
Se propone el desarrollo e implementación de una **Plataforma Web a la Medida** diseñada específicamente para optimizar, automatizar y profesionalizar el negocio de enseñanza de francés del Profesor Florentin. 
Esta solución elimina la dependencia de plataformas de terceros (como Italki o Preply) que cobran altas comisiones, permitiendo al profesor **retener el 100% de sus ingresos** y ofrecer una experiencia premium a sus estudiantes internacionales.

## 2. Alcance del Proyecto y Funcionalidades
La plataforma opera como un ecosistema completo (Frontend + Backend + Base de Datos) con las siguientes características:

### Para el Estudiante (Portal del Alumno)
*   **Adquisición de Planes:** Compra de paquetes de clases (A1, B2, Pro) con pasarela de pago internacional.
*   **Conversión Automática de Husos Horarios:** El sistema detecta el país del estudiante y traduce automáticamente el horario de disponibilidad del profesor a su hora local exacta, evitando confusiones.
*   **Reserva Autónoma:** Sistema de calendario donde el alumno puede agendar clases descontando saldo de su cuenta de forma automática.
*   **Material Didáctico:** Acceso a una biblioteca privada para descargar PDFs, ejercicios y audios exclusivos.

### Para el Profesor (Panel Administrador/CRM)
*   **Gestor de Horarios Flexible:** Control total sobre qué días y en qué rango horario se está disponible para impartir clases.
*   **CRM Integrado:** Gestión de la base de datos de estudiantes, historial de pagos, saldo de clases restantes y progreso.
*   **Control Financiero:** Integración directa con Stripe para recibir pagos en Euros (EUR) o Dólares (USD) directamente a su cuenta bancaria.
*   **Configuraciones Centralizadas (No Code):** Interfaz dedicada dentro del CRM para vincular, actualizar y gestionar credenciales (Tokens de WhatsApp Meta API, Contraseñas de Correos SMTP y URLs) directamente desde un panel visual, sin necesidad de conocimientos técnicos ni requerir modificaciones en el código fuente.

---

## 3. Arquitectura y Costos de Infraestructura (Cloud)
El sistema ha sido diseñado bajo una arquitectura *Serverless* moderna (Next.js + Supabase), lo que garantiza un rendimiento ultra rápido y costos de mantenimiento virtualmente nulos durante la fase de crecimiento.

| Servicio | Propósito | Costo Estimado (Fase Inicial) | Costo al Escalar (Opcional) |
| :--- | :--- | :--- | :--- |
| **Vercel** | Alojamiento de la Plataforma Web | **$0.00 / mes** | $20.00 / mes (Plan Pro) |
| **Supabase** | Base de Datos y Autenticación de Usuarios | **$0.00 / mes** | $25.00 / mes (Plan Pro) |
| **EmailJS** | Envío de correos desde el cliente (Contacto/Notificaciones) | **$0.00 / mes** (hasta 200 mails) | $9.00 / mes |
| **WhatsApp** | Integración directa para contacto y leads | **$0.00 / mes** | - |
| **Stripe** | Pasarela de Pagos Segura | **Sin costo fijo** | ~2.9% + 0.30€ por transacción |
| **Dominio** | Nombre de la web (ej. *florentinfrench.com*) | **~$15.00 / año** | -$ |

**Conclusión de Infraestructura:** 
El costo operativo fijo mensual del sistema es de **$0.00**. El profesor solo pagará la comisión transaccional a Stripe cada vez que realice una venta, y el costo anual de renovación de su dominio (~$15/año).

---

## 4. Automatización de Comunicaciones (Post-Pago y CRM)
Para lograr un sistema donde el alumno reciba confirmaciones inmediatas al pagar o avisos directos desde tu panel de control, se implementarán integraciones "Backend" (ocultas y seguras) activadas por los eventos de Stripe.

### A. Correos Transaccionales (Automáticos)
*   **Librería a utilizar:** **Nodemailer** (Librería JavaScript nativa de Node.js, sin necesidad de usar plataformas como Resend).
*   **Requerimiento:** Conectar un servidor SMTP de correo (puede ser una cuenta de Gmail del profesor o el Webmail del dominio adquirido).
*   **Costos:** **$0.00**. Se usa tu propia infraestructura de correo.

### B. Mensajería Automática por WhatsApp (Meta Cloud API)
Para enviar recibos, links de clases o recordatorios directo al WhatsApp del alumno.
*   **Librería / Tecnología:** Peticiones seguras desde el servidor (Next.js API) hacia la **WhatsApp Cloud API** oficial de Meta.
*   **Requerimientos Previos:** 
    1. Una cuenta verificada en *Meta Business Manager*.
    2. Un número de teléfono dedicado **exclusivamente** para la API (no puede usarse simultáneamente en la app de WhatsApp de tu móvil).
    3. Aprobación de "Plantillas" de mensajes por parte de Meta (ej. *"Hola {{nombre}}, tu pago por el plan {{plan}} ha sido exitoso."*).
*   **Costos de Meta (Pago por uso):**
    *   **Primeras 1,000 conversaciones** de servicio al mes: **Gratis**.
    *   **Mensajes de Utilidad (Confirmaciones de pago/Citas):** Depende del país del alumno. Promedio de ~$0.01 a $0.03 USD por mensaje en Latinoamérica, y ~0.04€ en Europa. Solo pagas lo que envías.

---

## 5. Requerimientos por parte del Cliente (Florentin)
Para garantizar el cumplimiento de los tiempos de desarrollo y la correcta configuración de todas las herramientas, se requerirá la siguiente información y accesos por parte del cliente:

1. **Branding y Contenidos:** Logotipo en alta resolución, fotografías/videos profesionales para la web, y los textos finales (copy) descriptivos de los planes de estudio.
2. **Cuenta Financiera (Stripe):** Creación y verificación de la cuenta en **Stripe** (se requiere documento de identidad y cuenta bancaria europea/francesa para recibir directamente los fondos de las ventas).
3. **Credenciales de Correo:** Una cuenta de correo electrónico dedicada (Gmail o dominio propio) con su respectiva contraseña de aplicación para configurar el envío automático de emails (Nodemailer).
4. **Infraestructura Meta (WhatsApp):** Un número de teléfono móvil **nuevo o no vinculado** a ninguna app de WhatsApp, junto con acceso administrativo a su página de Facebook / Meta Business Manager.
5. **Dominio Web:** Datos de acceso al proveedor del dominio si ya se tiene uno registrado, o la elección del nombre final para proceder a su registro.

---

## 6. Condiciones del Proyecto y Entregables
*   **Código Fuente:** Propiedad 100% del cliente. No hay bloqueos de proveedor (Vendor Lock-in).
*   **Capacitación:** Se incluye una sesión de capacitación para el manejo del Panel de Administración y configuración de productos en Stripe.
*   **Garantía y Soporte:** Se establece un periodo de garantía técnica de 30 días post-lanzamiento para corregir cualquier anomalía en el código base sin costo adicional.
*   **Seguridad:** Cumplimiento con estándares europeos (SCA) en transacciones electrónicas, y protección de base de datos con políticas estrictas de seguridad de filas (Row Level Security).

---
*Propuesta generada bajo los más altos estándares de desarrollo web moderno.*
