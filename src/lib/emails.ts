import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
const smtpFrom = process.env.SMTP_FROM || 'Florentin Francés <soporte@florentin.com>';

// Configurar transportador SMTP si las credenciales existen
const transporter = smtpHost && smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true para puerto 465, false para el resto (ej. 587)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false // Permite conexiones locales o autofirmadas de desarrollo
      }
    })
  : null;

/**
 * Envía un correo electrónico transaccional seguro utilizando SMTP.
 * Cuenta con fallback a consola en entornos de desarrollo sin credenciales SMTP.
 */
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!transporter) {
    console.log(`[EMAIL SIMULADO (Nodemailer)]
Para: ${to}
Asunto: ${subject}
Contenido: ${html.substring(0, 150)}... [Simulado]`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
    });
    return { success: true, id: info.messageId };
  } catch (error) {
    console.error("Error enviando correo con Nodemailer (SMTP):", error);
    return { success: false, error };
  }
}

/**
 * Notificación de confirmación de pago y alta de plan.
 */
export async function enviarCorreoConfirmacionPago(email: string, nombreAlumno: string, planNombre: string, clasesAsignadas: number) {
  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif;">Bonjour ${nombreAlumno}!</h2>
      <p style="font-size: 15px; color: #5a5a5a; line-height: 1.6;">
        Tu pago ha sido procesado con éxito. Le damos una cálida bienvenida a la plataforma oficial del <strong>Profesor Florentin</strong>.
      </p>
      <div style="background-color: #fcfbfa; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px dashed #d4a359;">
        <h4 style="margin: 0 0 10px 0; color: #1a2530;">Detalles de tu inscripción:</h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #5a5a5a;">
          <li><strong>Plan Adquirido:</strong> ${planNombre}</li>
          <li><strong>Clases Asignadas:</strong> ${clasesAsignadas} clases particulares</li>
          <li><strong>Estado del Pago:</strong> Completado</li>
        </ul>
      </div>
      <p style="font-size: 15px; color: #5a5a5a;">
        Ya puedes ingresar a tu panel de estudiante para agendar tu primera lección en el calendario disponible.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/alumno" 
           style="background-color: #1a2530; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block;">
          Ingresar al Portal Alumno
        </a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="font-size: 12px; color: #9a9a9a; text-align: center;">
        Florentin. © ${new Date().getFullYear()} París, Francia.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `¡Bienvenido a Florentin! Confirmación de inscripción en ${planNombre}`,
    html: htmlContent
  });
}

/**
 * Notificación de recordatorio de clase inminente.
 */
export async function enviarCorreoRecordatorioClase(email: string, nombreAlumno: string, fecha: string, hora: string, meetLink: string) {
  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif;">Bonjour ${nombreAlumno},</h2>
      <p style="font-size: 15px; color: #5a5a5a; line-height: 1.6;">
        Le recordamos que tiene una clase de francés programada muy pronto. ¡Prepare sus materiales de la última lección!
      </p>
      <div style="background-color: #fcfbfa; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #eaeaea;">
        <h4 style="margin: 0 0 10px 0; color: #1a2530;">Detalles de la sesión:</h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #5a5a5a;">
          <li><strong>Fecha:</strong> ${fecha}</li>
          <li><strong>Hora:</strong> ${hora}</li>
          <li><strong>Profesor:</strong> Florentin (Nativo)</li>
        </ul>
      </div>
      <p style="font-size: 15px; color: #5a5a5a;">
        Para conectarse al aula virtual, simplemente haga clic en el botón de abajo en el horario establecido:
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${meetLink}" 
           style="background-color: #d4a359; color: #1a2530; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block;">
          Ingresar al Aula Virtual (Google Meet)
        </a>
      </div>
      <p style="font-size: 13px; color: #9a9a9a; margin-top: 20px; text-align: center;">
        Si no puede asistir, recuerde que puede reprogramar con un mínimo de 12 horas de anticipación desde su panel.
      </p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="font-size: 12px; color: #9a9a9a; text-align: center;">
        Florentin. © ${new Date().getFullYear()} París, Francia.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Recordatorio de Clase de Francés - ${fecha} a las ${hora}`,
    html: htmlContent
  });
}

/**
 * Notificación al profesor sobre una nueva venta/inscripción.
 */
export async function enviarCorreoNotificacionProfesor(
  emailProfesor: string,
  nombreAlumno: string,
  emailAlumno: string,
  planNombre: string,
  clasesAsignadas: number,
  monto: number,
  divisa: string
) {
  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif;">Bonjour Florentin,</h2>
      <p style="font-size: 15px; color: #5a5a5a; line-height: 1.6;">
        Felicidades, has recibido un nuevo pago y una nueva inscripción en tu sitio web.
      </p>
      <div style="background-color: #fcfbfa; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 10px 0; color: #1a2530;">Detalles de la Transacción:</h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #5a5a5a;">
          <li><strong>Alumno:</strong> ${nombreAlumno} (${emailAlumno})</li>
          <li><strong>Plan Adquirido:</strong> ${planNombre}</li>
          <li><strong>Clases Asignadas:</strong> ${clasesAsignadas} clases particulares</li>
          <li><strong>Monto del Pago:</strong> ${monto.toFixed(2)} ${divisa.toUpperCase()}</li>
        </ul>
      </div>
      <p style="font-size: 15px; color: #5a5a5a;">
        El alumno ya ha recibido su correo de bienvenida y tiene acceso a su panel para agendar sus clases.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" 
           style="background-color: #1a2530; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: 600; display: inline-block;">
          Ir al Panel de Administrador
        </a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="font-size: 12px; color: #9a9a9a; text-align: center;">
        Florentin French. Sistema Automático de Notificaciones.
      </p>
    </div>
  `;

  return sendEmail({
    to: emailProfesor,
    subject: `💰 ¡Nueva Venta! ${nombreAlumno} se ha inscrito en ${planNombre}`,
    html: htmlContent
  });
}
