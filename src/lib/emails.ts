import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
const smtpFrom = process.env.SMTP_FROM || 'Florentin Francés <soporte@florentin.com>';

// Limpiar comillas innecesarias que Vercel o dotenv puedan arrastrar
const cleanSmtpFrom = smtpFrom.replace(/^['"]|['"]$/g, '');

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
      },
      connectionTimeout: 10000, // Prevenir congelamiento de hilos en Vercel
      greetingTimeout: 10000,
      socketTimeout: 10000
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
      from: cleanSmtpFrom,
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
          Ingresar al Aula Virtual (Microsoft Teams)
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

/**
 * Correo de bienvenida para usuarios registrados sin plan (Lead Nurturing).
 */
export async function enviarCorreoBienvenidaLead(email: string, nombre: string, idioma: string = 'es') {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = "¡Bienvenido a Florentin! Tu viaje con el francés comienza hoy 🇫🇷";
  if (isFr) {
    subject = "Bienvenue chez Florentin ! Votre apprentissage du français commence aujourd'hui 🇫🇷";
  } else if (isEn) {
    subject = "Welcome to Florentin! Your French learning journey starts today 🇫🇷";
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 800; color: #1a2530; letter-spacing: 1px;">FLORENTIN</span>
      </div>
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px;">
        Bonjour ${nombre}!
      </h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr 
          ? "Nous sommes ravis de vous accueillir sur notre plateforme. Votre compte a été créé avec succès." 
          : isEn
            ? "We are delighted to welcome you to our platform. Your account has been successfully created."
            : "Nos alegra mucho darte la bienvenida a nuestra plataforma. Tu cuenta ha sido creada con éxito."}
      </p>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr
          ? "Apprendre une nouvelle langue est une aventure passionnante. Avec nos cours particuliers sur mesure, vous progresserez rapidement avec un professeur natif certifié."
          : isEn
            ? "Learning a new language is an exciting adventure. With our tailored private lessons, you will progress quickly with a certified native teacher."
            : "Aprender un nuevo idioma es una aventura emocionante. Con nuestras clases particulares a medida, avanzarás rápidamente de la mano de un profesor nativo certificado."}
      </p>
      
      <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          ${isFr ? "Ce qui vous attend :" : isEn ? "What awaits you:" : "Lo que te espera:"}
        </h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
          <li>${isFr ? "👨‍🏫 <strong>Professeur Natif :</strong> Cours axés sur la conversation réelle." : isEn ? "👨‍🏫 <strong>Native Teacher:</strong> Lessons focused on real conversation." : "👨‍🏫 <strong>Profesor Nativo:</strong> Clases enfocadas en conversación real."}</li>
          <li>${isFr ? "📅 <strong>Flexibilité Totale :</strong> Planifiez vos cours selon vos disponibilités." : isEn ? "📅 <strong>Total Flexibility:</strong> Schedule lessons according to your availability." : "📅 <strong>Flexibilidad Total:</strong> Programa tus clases según tu propio horario."}</li>
          <li>${isFr ? "📝 <strong>Matériel Exclusif :</strong> Accès à des fiches de cours et des leçons enregistrées." : isEn ? "📝 <strong>Exclusive Material:</strong> Access to study sheets and recorded lessons." : "📝 <strong>Material Exclusivo:</strong> Acceso a fichas de estudio y lecciones grabadas."}</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #6b7280; font-style: italic; text-align: center; margin-bottom: 24px;">
        ${isFr
          ? "Faites le premier pas aujourd'hui en choisissant le plan d'études qui correspond à vos objectifs."
          : isEn
            ? "Take the first step today by choosing the study plan that fits your goals."
            : "Da el primer paso hoy mismo eligiendo el plan de estudios que mejor se adapte a tus metas."}
      </p>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com'}/alumno" 
           style="background-color: #3b82f6; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);">
          ${isFr ? "Découvrir les Plans" : isEn ? "Explore Study Plans" : "Ver Planes de Estudio"}
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
      <p style="font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4;">
        Florentin French. © ${new Date().getFullYear()} Paris, France. <br/>
        ${isFr ? "Vous recevez cet e-mail car vous vous êtes inscrit sur notre site." : isEn ? "You receive this email because you registered on our site." : "Recibes este correo porque te has registrado en nuestro sitio web."}
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent
  });
}

/**
 * Correo de recordatorio a los 3 días de inactividad (Lead Nurturing).
 */
export async function enviarCorreoRecordatorioInactividad(email: string, nombre: string, idioma: string = 'es') {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = "¿Listo para dar tu primer paso en francés? 🚀";
  if (isFr) {
    subject = "Prêt à faire votre premier pas en français ? 🚀";
  } else if (isEn) {
    subject = "Ready to take your first step in French? 🚀";
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 800; color: #1a2530; letter-spacing: 1px;">FLORENTIN</span>
      </div>
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px;">
        Bonjour ${nombre},
      </h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr 
          ? "Il y a quelques jours, vous avez créé votre compte sur notre plateforme. Nous espérons que vous êtes prêt à commencer !" 
          : isEn
            ? "A few days ago, you created your account on our platform. We hope you are ready to begin!"
            : "Hace unos días creaste tu cuenta en nuestra plataforma. ¡Esperamos que estés listo para comenzar!"}
      </p>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr
          ? "Le meilleur moment pour apprendre une langue, c'est aujourd'hui. Ne laissez pas passer l'opportunité de parler français couramment avec confiance."
          : isEn
            ? "The best time to learn a language is today. Don't let the opportunity to speak French fluently and confidently slip away."
            : "El mejor momento para aprender un idioma es hoy. No dejes pasar la oportunidad de hablar francés con fluidez y confianza."}
      </p>
      
      <div style="margin: 28px 0; padding: 20px; background-color: #fffbeb; border-radius: 8px; border: 1px solid #fde68a; text-align: center;">
        <p style="margin: 0; font-size: 15px; color: #b45309; font-weight: 700;">
          💡 ${isFr ? "Besoin d'aide pour choisir un plan ?" : isEn ? "Need help choosing a plan?" : "¿Necesitas ayuda para elegir un plan?"}
        </p>
        <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #d97706; line-height: 1.5;">
          ${isFr
            ? "Vous pouvez répondre directement à cet e-mail si vous avez des questions ou si vous souhaitez planifier un appel d'orientation."
            : isEn
              ? "You can reply directly to this email if you have any questions or want to schedule an orientation call."
              : "Puedes responder directamente a este correo si tienes alguna duda o si deseas agendar una llamada de orientación gratis."}
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com'}/alumno" 
           style="background-color: #3b82f6; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);">
          ${isFr ? "Commencer mon Apprentissage" : isEn ? "Start My Learning" : "Iniciar mi Aprendizaje"}
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
      <p style="font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4;">
        Florentin French. © ${new Date().getFullYear()} Paris, France. <br/>
        ${isFr ? "Si vous ne souhaitez plus recevoir d'e-mails, vous pouvez ignorer ce message." : isEn ? "If you do not wish to receive emails, you can ignore this message." : "Si no deseas recibir más correos, puedes ignorar este mensaje."}
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent
  });
}

/**
 * Correo de advertencia cuando al alumno le quedan pocas clases (Renovación).
 */
export async function enviarCorreoRenovacionPlan(email: string, nombre: string, clasesRestantes: number, idioma: string = 'es') {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = `⚠️ ¡Te quedan solo ${clasesRestantes} clases, ${nombre}!`;
  if (isFr) {
    subject = `⚠️ Il ne vous reste plus que ${clasesRestantes} cours, ${nombre} !`;
  } else if (isEn) {
    subject = `⚠️ You only have ${clasesRestantes} classes left, ${nombre}!`;
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 800; color: #1a2530; letter-spacing: 1px;">FLORENTIN</span>
      </div>
      <h2 style="color: #1a2530; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px;">
        Bonjour ${nombre},
      </h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr 
          ? `Nous espérons que vous appréciez vos cours de français. Nous vous écrivons pour vous informer qu'il ne vous reste plus que <strong>${clasesRestantes} cours</strong> dans votre plan actuel.` 
          : isEn
            ? `We hope you are enjoying your French classes. We are writing to let you know that you only have <strong>${clasesRestantes} classes</strong> left in your current plan.`
            : `Esperamos que estés disfrutando tus clases de francés. Te escribimos para avisarte que te quedan solo <strong>${clasesRestantes} clases</strong> en tu plan actual.`}
      </p>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
        ${isFr
          ? "Pour ne pas interrompre votre progression, nous vous invitons à renouveler votre plan dès aujourd'hui."
          : isEn
            ? "To keep up your progress without interruptions, we invite you to renew your plan today."
            : "Para no interrumpir tu progreso, te invitamos a renovar tu plan hoy mismo."}
      </p>
      
      <div style="margin: 28px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0; font-size: 15px; color: #1e293b; font-weight: 700;">
          🎓 ${isFr ? "Prêt à continuer ?" : isEn ? "Ready to continue?" : "¿Listo para continuar?"}
        </p>
        <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
          ${isFr
            ? "Découvrez nos nouveaux forfaits et réservez vos prochaines semaines de cours."
            : isEn
              ? "Check out our new packages and book your next weeks of classes."
              : "Descubre nuestros nuevos paquetes y asegura tus próximas semanas de clases."}
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com'}/alumno" 
           style="background-color: #1a2530; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 30px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          ${isFr ? "Voir les Plans et Renouveler" : isEn ? "View Plans and Renew" : "Ver Planes y Renovar"}
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
      <p style="font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4;">
        Florentin French. © ${new Date().getFullYear()} Paris, France. <br/>
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent
  });
}
