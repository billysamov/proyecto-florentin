import nodemailer from 'nodemailer';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lefrancaisavecflorentin.com';
const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
const smtpFrom = process.env.SMTP_FROM || 'Florentin <contacto@lefrancaisavecflorentin.com>';

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
 * Convierte HTML a texto plano limpio para cumplir con el estándar multipart/alternative.
 * Los filtros de correo (SpamAssassin, Gmail) penalizan correos que solo envían HTML sin versión texto.
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Envía un correo electrónico transaccional seguro utilizando SMTP con soporte multipart (HTML + Texto).
 * Cuenta con fallback a consola en entornos de desarrollo sin credenciales SMTP.
 */
export async function sendEmail({ 
  to, 
  subject, 
  html, 
  text,
  replyTo 
}: { 
  to: string; 
  subject: string; 
  html: string; 
  text?: string;
  replyTo?: string;
}) {
  if (!transporter) {
    console.log(`[EMAIL SIMULADO (Nodemailer)]
Para: ${to}
Asunto: ${subject}
Contenido: ${html.substring(0, 150)}... [Simulado]`);
    return { success: true, simulated: true };
  }

  try {
    const plainText = text || htmlToPlainText(html);
    const info = await transporter.sendMail({
      from: cleanSmtpFrom,
      to,
      subject,
      text: plainText,
      html,
      replyTo: replyTo || process.env.SMTP_REPLY_TO || cleanSmtpFrom,
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
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
export async function enviarCorreoConfirmacionPago(
  email: string, 
  nombreAlumno: string, 
  planNombre: string, 
  clasesAsignadas: number
) {
  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">Bonjour ${nombreAlumno}!</h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Tu pago ha sido procesado con éxito. Le damos una cálida bienvenida a la plataforma oficial del <strong>Profesor Florentin</strong>.
      </p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 10px 0; color: #0055a5; font-size: 15px; font-weight: 700;">Detalles de tu inscripción:</h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #475569; line-height: 1.8;">
          <li><strong>Plan Adquirido:</strong> ${planNombre}</li>
          <li><strong>Clases Asignadas:</strong> ${clasesAsignadas} clases particulares</li>
          <li><strong>Estado del Pago:</strong> Completado</li>
        </ul>
      </div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        Ya puedes ingresar a tu panel de estudiante para agendar tu primera lección en el calendario disponible.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${BASE_URL}/alumno" 
           style="background-color: #0055a5; color: #ffffff; padding: 14px 34px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          Ingresar al Portal Alumno
        </a>
      </div>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Florentin • © ${new Date().getFullYear()} París, Francia.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `¡Bienvenido a Florentin! Confirmación de inscripción en ${planNombre}`,
    html: htmlContent
  });
}

/**
 * Notificación de recordatorio de clase (24 horas antes).
 */
export async function enviarCorreoRecordatorioClase(
  email: string, 
  nombreAlumno: string, 
  fecha: string, 
  hora: string, 
  meetLink: string,
  idioma: string = 'es'
) {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = `¡Recordatorio de nuestra clase de francés mañana! 🇫🇷`;
  if (isFr) {
    subject = `Rappel : notre cours de français de demain ! 🇫🇷`;
  } else if (isEn) {
    subject = `Reminder: our French class tomorrow! 🇫🇷`;
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
        ${isFr ? `Bonjour ${nombreAlumno} !` : isEn ? `Hello ${nombreAlumno}!` : `¡Hola ${nombreAlumno}!`}
      </h2>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        ${isFr 
          ? "Je vous écris pour vous rappeler que nous avons notre cours de français demain !" 
          : isEn 
            ? "I'm writing to remind you that we have our French class tomorrow!" 
            : "¡Te escribo para recordarte que mañana tenemos nuestra clase de francés!"}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        ${isFr 
          ? "J'ai hâte de vous retrouver et de continuer à progresser ensemble en français." 
          : isEn 
            ? "I look forward to seeing you again and continuing to work on your French together." 
            : "Estoy deseando volver a verte y seguir trabajando juntos en tu francés."}
      </p>

      <!-- Caja Detalles de la Clase -->
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 12px 0; color: #0055a5; font-size: 15px; font-weight: 700;">
          📍 ${isFr ? "Notre prochain cours" : isEn ? "Our next class" : "Nuestra próxima clase"}
        </h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #475569; line-height: 1.8;">
          <li><strong>${isFr ? "Date :" : isEn ? "Date:" : "Fecha:"}</strong> ${fecha}</li>
          <li><strong>${isFr ? "Heure :" : isEn ? "Time:" : "Hora:"}</strong> ${hora}</li>
        </ul>
      </div>

      <p style="font-size: 14.5px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        ${isFr 
          ? "Si vous le souhaitez, vous pouvez jeter un œil à ce que nous avons travaillé lors de notre dernier cours pour arriver bien préparé(e). Mais surtout, <strong>venez avec l'envie de parler français !</strong>" 
          : isEn 
            ? "If you'd like, you can take a quick look at what we worked on in our last lesson to come prepared. But above all, <strong>come ready to speak French!</strong>" 
            : "Si quieres, puedes echar un vistazo a lo que trabajamos en nuestra última clase para llegar preparado/a. Pero, sobre todo, <strong>¡ven con ganas de hablar francés!</strong>"}
      </p>

      <!-- Botón Ingreso al Aula Virtual -->
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #bfdbfe; text-align: center;">
        <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 15px; font-weight: 700;">
          🚀 ${isFr ? "À demain" : isEn ? "See you tomorrow" : "Nos vemos mañana"}
        </h4>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #3b82f6;">
          ${isFr 
            ? "Cliquez simplement sur le bouton ci-dessous pour rejoindre notre classe virtuelle :" 
            : isEn 
              ? "Simply click the button below to enter our virtual classroom:" 
              : "Solo tienes que hacer clic en el botón para entrar en nuestra aula virtual:"}
        </p>
        <a href="${meetLink}" 
           style="background-color: #0055a5; color: #ffffff; padding: 14px 34px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          ${isFr ? "Rejoindre la classe virtuelle" : isEn ? "Join Virtual Classroom" : "Ingresar al aula virtual"}
        </a>
      </div>

      <p style="font-size: 15px; color: #334155; margin-top: 28px; margin-bottom: 4px; font-weight: 600;">
        ${isFr ? "À demain !" : isEn ? "See you tomorrow!" : "¡Hasta mañana!"}
      </p>
      <p style="font-size: 18px; color: #0055a5; font-weight: 800; margin-top: 0; margin-bottom: 24px;">
        Florentin
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />

      <!-- Logo abajo con espacio -->
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Le Français avec Florentin • Clases Personalizadas 1 a 1 de Francés Nativo
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
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
        <a href="${BASE_URL}/admin" 
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
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
        ${isFr ? `Bonjour ${nombre} !` : isEn ? `Hello ${nombre}!` : `¡Hola ${nombre}!`}
      </h2>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        ${isFr 
          ? "Je suis ravi de vous accueillir et de commencer cette belle aventure avec vous." 
          : isEn
            ? "I am thrilled to welcome you and start this exciting learning adventure together."
            : "Me alegra muchísimo darte la bienvenida y comenzar esta aventura contigo."}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        ${isFr
          ? "Si vous êtes ici, c'est probablement parce que vous souhaitez mieux parler français, gagner en confiance et communiquer naturellement en situations réelles."
          : isEn
            ? "If you're here, it's probably because you want to speak French better, gain confidence, and communicate naturally in real-life situations."
            : "Si estás aquí, probablemente sea porque quieres hablar mejor francés, ganar confianza y poder comunicarte de forma natural en situaciones reales."}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
        ${isFr
          ? "Et c'est exactement ce que je souhaite vous aider à accomplir."
          : isEn
            ? "And that is exactly what I want to help you achieve."
            : "Y eso es exactamente lo que quiero ayudarte a conseguir."}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        ${isFr
          ? "Je m'appelle Florentin et je serai votre professeur de français. À travers mes cours, je vous accompagnerai pas à pas, avec des activités adaptées à votre niveau, vos objectifs et surtout vos besoins."
          : isEn
            ? "My name is Florentin and I will be your French teacher. Through my classes, I will guide you step by step with activities tailored to your level, your goals, and above all, your needs."
            : "Me llamo Florentin y seré tu profesor de francés. A través de mis clases, te acompañaré paso a paso, con actividades adaptadas a tu nivel, a tus objetivos y, sobre todo, a tus necesidades."}
      </p>

      <!-- Bloque: Lo que voy a aportarte -->
      <div style="background-color: #f8fafc; padding: 22px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 16px 0; color: #0055a5; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          📍 ${isFr ? "Ce que je vais vous apporter :" : isEn ? "What I will provide for you:" : "Lo que voy a aportarte:"}
        </h4>
        <ul style="padding-left: 0; list-style: none; margin: 0; font-size: 14px; color: #475569; line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
          <li style="margin-bottom: 10px;">
            ✨ <strong>${isFr ? "Un accompagnement personnalisé :" : isEn ? "Personalized support:" : "Un acompañamiento personalizado:"}</strong> 
            ${isFr ? "Je m'adapterai à votre niveau, vos difficultés et vos objectifs pour que chaque cours vous soit vraiment utile." : isEn ? "I will adapt to your level, challenges, and goals so every lesson is genuinely useful to you." : "Me adaptaré a tu nivel, a tus dificultades y a tus objetivos para que cada clase te resulte realmente útil."}
          </li>
          <li style="margin-bottom: 10px;">
            🗣️ <strong>${isFr ? "Le français pour la vraie vie :" : isEn ? "French for real-life communication:" : "Francés para comunicarte en la vida real:"}</strong> 
            ${isFr ? "Mon objectif n'est pas seulement de vous faire apprendre des règles de grammaire, mais de vous permettre de parler, comprendre et vous exprimer avec aisance." : isEn ? "My goal is not just teaching grammar rules, but helping you speak, understand, and express yourself with ease and confidence." : "Mi objetivo no es solo que aprendas reglas gramaticales, sino que puedas hablar, comprender y expresarte con soltura y confianza."}
          </li>
          <li style="margin-bottom: 10px;">
            📚 <strong>${isFr ? "Des ressources et exercices adaptés :" : isEn ? "Adapted resources & exercises:" : "Recursos y ejercicios adaptados:"}</strong> 
            ${isFr ? "Je vous fournirai des supports, des exercices et des activités pour continuer à progresser entre chaque cours." : isEn ? "I will provide materials, exercises, and activities so you can keep progressing between classes." : "Te proporcionaré materiales, ejercicios y actividades para que puedas seguir progresando entre las clases."}
          </li>
          <li>
            🎯 <strong>${isFr ? "Un apprentissage centré sur vos objectifs :" : isEn ? "Goal-centered learning:" : "Un aprendizaje centrado en tus objetivos:"}</strong> 
            ${isFr ? "Que vous souhaitiez voyager, travailler en français, préparer un examen ou simplement être plus à l'aise à l'oral, nous construirons votre parcours autour de vos priorités." : isEn ? "Whether you want to travel, work in French, prepare for an exam, or simply feel more comfortable speaking, we will build your learning around what you truly want to achieve." : "Ya sea que quieras viajar, trabajar en francés, preparar un examen o simplemente sentirte más cómodo/a hablando, construiremos tu aprendizaje en torno a lo que realmente quieres conseguir."}
          </li>
        </ul>
      </div>

      <!-- Bloque: ¿Y ahora qué? -->
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #bfdbfe; text-align: center;">
        <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 15px; font-weight: 700;">
          🚀 ${isFr ? "Et maintenant ?" : isEn ? "What's next?" : "¿Y ahora qué?"}
        </h4>
        <p style="margin: 0 0 6px 0; font-size: 14px; color: #1e3a8a; font-weight: 600;">
          ${isFr ? "¡Votre compte est prêt !" : isEn ? "Your account is ready!" : "¡Tu cuenta ya está lista!"}
        </p>
        <p style="margin: 0 0 16px 0; font-size: 13.5px; color: #3b82f6;">
          ${isFr ? "Je vous invite à découvrir les forfaits d'études et à choisir celui qui correspond à vos objectifs." : isEn ? "I invite you to explore the study plans and choose the one that fits your goals best." : "Te invito a descubrir los diferentes planes de estudio y a elegir el que mejor se adapte a tus objetivos."}
        </p>
        <a href="${BASE_URL}/alumno" 
           style="background-color: #0055a5; color: #ffffff; padding: 14px 34px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          ${isFr ? "Découvrir les forfaits" : isEn ? "Explore Study Plans" : "Descubrir los planes"}
        </a>
      </div>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
        ${isFr 
          ? "J'ai hâte de commencer à travailler avec vous et de voir tout ce que vous allez accomplir !" 
          : isEn
            ? "I can't wait to start working with you and see everything you will accomplish!"
            : "¡Estoy deseando empezar a trabajar contigo y ver todo lo que vas a conseguir!"}
      </p>

      <p style="font-size: 15px; color: #334155; margin-top: 24px; margin-bottom: 4px; font-weight: 600;">
        ${isFr ? "À très bientôt," : isEn ? "See you very soon," : "Hasta muy pronto,"}
      </p>
      <p style="font-size: 18px; color: #0055a5; font-weight: 800; margin-top: 0; margin-bottom: 24px;">
        Florentin
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />

      <!-- Logo abajo con espacio -->
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Le Français avec Florentin • Clases Personalizadas 1 a 1 de Francés Nativo
        </p>
      </div>
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

  let subject = "¿Listo para dar tu primer paso en francés? 🇫🇷";
  if (isFr) {
    subject = "Prêt à faire votre premier pas en français ? 🇫🇷";
  } else if (isEn) {
    subject = "Ready to take your first step in French? 🇫🇷";
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
        ${isFr ? `Bonjour ${nombre} :` : isEn ? `Hello ${nombre}:` : `Hola ${nombre}:`}
      </h2>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
        ${isFr 
          ? "Il y a quelques jours, vous avez créé votre compte sur ma plateforme. ¡Il ne vous reste plus qu'à franchir le premier pas !" 
          : isEn
            ? "A few days ago you created your account on my platform. Now you're just one step away from getting started!"
            : "Hace unos días creaste tu cuenta en mi plataforma. ¡Ahora solo te falta dar el primer paso!"}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
        ${isFr
          ? "Si vous souhaitez parler français avec plus de fluidité, de confiance et de naturel, je souhaite vous aider à y parvenir."
          : isEn
            ? "If you want to speak French with more fluency, confidence, and natural ease, I'd love to help you achieve it."
            : "Si quieres hablar francés con más fluidez, confianza y naturalidad, quiero ayudarte a conseguirlo."}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        ${isFr
          ? "Vous n'avez pas besoin d'attendre de « mieux parler » pour commencer. Commencez dès aujourd'hui et progressez pas à pas avec moi."
          : isEn
            ? "You don't need to wait until you \"speak better\" to begin. Start today and improve step by step with me."
            : "No necesitas esperar a «hablar mejor» para empezar. Empieza hoy y mejora paso a paso conmigo."}
      </p>

      <!-- Botón de Planes -->
      <div style="text-align: center; margin: 26px 0;">
        <a href="${BASE_URL}/alumno" 
           style="background-color: #0055a5; color: #ffffff; padding: 14px 34px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          ${isFr ? "Découvrir les forfaits" : isEn ? "Explore Study Plans" : "Explorar los planes"}
        </a>
      </div>

      <!-- Caja de ayuda -->
      <div style="margin: 24px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: left;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; color: #0055a5; font-weight: 700;">
          💡 ${isFr ? "Besoin d'aide pour choisir votre plan ?" : isEn ? "Need help choosing your plan?" : "¿Necesitas ayuda para elegir tu plan?"}
        </h4>
        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
          ${isFr
            ? "Si vous avez la moindre question, vous pouvez répondre directement à cet e-mail et je vous aiderai personnellement."
            : isEn
              ? "If you have any questions, you can reply directly to this email and I will personally assist you."
              : "Si tienes alguna duda, puedes responder directamente a este correo y yo te ayudaré personalmente."}
        </p>
      </div>

      <p style="font-size: 15px; color: #334155; margin-top: 24px; margin-bottom: 4px; font-weight: 600;">
        ${isFr ? "À très bientôt," : isEn ? "See you very soon," : "Hasta muy pronto,"}
      </p>
      <p style="font-size: 18px; color: #0055a5; font-weight: 800; margin-top: 0; margin-bottom: 24px;">
        Florentin
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />

      <!-- Logo abajo con espacio -->
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Le Français avec Florentin • Clases Personalizadas 1 a 1 de Francés Nativo
        </p>
      </div>
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
export async function enviarCorreoRenovacionPlan(email: string, nombre: string, clasesRestantes: number = 2, idioma: string = 'es') {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = `¡Solo te quedan ${clasesRestantes} clases en tu plan, ${nombre}! 🇫🇷`;
  if (isFr) {
    subject = `Il ne vous reste plus que ${clasesRestantes} cours dans votre plan, ${nombre} ! 🇫🇷`;
  } else if (isEn) {
    subject = `You only have ${clasesRestantes} classes left in your plan, ${nombre}! 🇫🇷`;
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
        ${isFr ? `Bonjour ${nombre} !` : isEn ? `Hello ${nombre}!` : `¡Hola ${nombre}!`}
      </h2>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        ${isFr 
          ? "J'espère que vous appréciez vos cours et que vous constatez vos progrès en français." 
          : isEn
            ? "I hope you're enjoying your lessons and seeing your progress in French."
            : "Espero que estés disfrutando de tus clases y que estés viendo tus progresos en francés."}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
        ${isFr
          ? `Je voulais vous informer qu'il ne vous reste plus que <strong>${clasesRestantes} cours</strong> dans votre forfait actuel.`
          : isEn
            ? `I wanted to let you know that you only have <strong>${clasesRestantes} classes</strong> left in your current plan.`
            : `Quería avisarte de que solo te quedan <strong>${clasesRestantes} clases</strong> en tu plan actual.`}
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        ${isFr
          ? "¡Mais ne vous inquiétez pas ! Si vous souhaitez continuer à progresser, vous pouvez choisir un nouveau forfait et poursuivre vos cours avec moi."
          : isEn
            ? "Don't worry! If you want to keep advancing, you can choose a new study plan and continue your lessons with me."
            : "¡Pero no te preocupes! Si quieres seguir avanzando, puedes elegir un nuevo plan y continuar con tus clases conmigo."}
      </p>

      <!-- Caja Motivacional -->
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0; text-align: left;">
        <h4 style="margin: 0 0 10px 0; font-size: 15px; color: #0055a5; font-weight: 700;">
          🎯 ${isFr ? "Envie de continuer à progresser ?" : isEn ? "Want to keep progressing?" : "¿Quieres seguir progresando?"}
        </h4>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
          ${isFr
            ? "Chaque nouvelle étape est une opportunité de gagner en confiance, de vous exprimer avec plus d'aisance et de perfectionner votre français."
            : isEn
              ? "Each new stage is an opportunity to build confidence, speak more fluently, and improve your French."
              : "Cada nueva etapa es una oportunidad para ganar confianza, hablar con más soltura y seguir mejorando tu francés."}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
          ${isFr
            ? "Je continuerai à adapter les cours à votre niveau, vos objectifs et aux points que vous souhaitez travailler."
            : isEn
              ? "I will continue to tailor the lessons to your level, goals, and specific areas you'd like to work on."
              : "Yo seguiré adaptando las clases a tu nivel, tus objetivos y a las dificultades que quieras trabajar."}
        </p>
        <p style="margin: 0; font-size: 14px; color: #0055a5; font-weight: 600;">
          ${isFr
            ? "Choisissez le forfait qui vous convient le mieux et réservez vos prochains cours."
            : isEn
              ? "Choose the plan that suits you best and book your next classes."
              : "Elige el plan que mejor se adapte a ti y reserva tus próximas clases."}
        </p>
      </div>

      <!-- Botón de Planes -->
      <div style="text-align: center; margin: 26px 0;">
        <a href="${BASE_URL}/alumno" 
           style="background-color: #0055a5; color: #ffffff; padding: 14px 34px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          ${isFr ? "Voir mes forfaits" : isEn ? "View My Plans" : "Ver mis planes"}
        </a>
      </div>

      <p style="font-size: 15px; color: #334155; margin-top: 24px; margin-bottom: 4px; font-weight: 600;">
        ${isFr ? "À très bientôt en cours !" : isEn ? "See you soon in class!" : "¡Nos vemos pronto en clase!"}
      </p>
      <p style="font-size: 18px; color: #0055a5; font-weight: 800; margin-top: 0; margin-bottom: 24px;">
        Florentin
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />

      <!-- Logo abajo con espacio -->
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Le Français avec Florentin • Clases Personalizadas 1 a 1 de Francés Nativo
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent
  });
}

/**
 * Notificación de cambio de horario / reprogramación de clase.
 */
export async function enviarCorreoReprogramacionClase(
  email: string,
  nombre: string,
  fecha: string,
  nuevaHora: string,
  horaAnterior: string,
  idioma: string = 'es',
  enlaceMeet?: string
) {
  const isFr = idioma === 'fr';
  const isEn = idioma === 'en';

  let subject = `Cambio de horario: tu clase de francés del ${fecha} 🕒`;
  if (isFr) {
    subject = `Changement d'horaire : votre cours de français du ${fecha} 🕒`;
  } else if (isEn) {
    subject = `Schedule update: your French class on ${fecha} 🕒`;
  }

  const htmlContent = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff;">
      
      <h2 style="color: #0c1b33; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
        ${isFr ? `Bonjour ${nombre} :` : isEn ? `Hello ${nombre}:` : `Hola ${nombre}:`}
      </h2>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
        ${isFr 
          ? `Je tenais à vous informer que votre cours du <strong>${fecha}</strong> aura lieu à <strong>${nuevaHora}</strong> au lieu de <strong>${horaAnterior}</strong>.` 
          : isEn 
            ? `I wanted to let you know that your class on <strong>${fecha}</strong> will take place at <strong>${nuevaHora}</strong> instead of <strong>${horaAnterior}</strong>.` 
            : `Quería informarte de que tu clase del <strong>${fecha}</strong> tendrá lugar a las <strong>${nuevaHora}</strong> en lugar de las <strong>${horaAnterior}</strong>.`}
      </p>

      <!-- Caja Detalles del Nuevo Horario -->
      <div style="background-color: #f8fafc; padding: 18px 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0; text-align: left;">
        <h4 style="margin: 0 0 10px 0; color: #0055a5; font-size: 14.5px; font-weight: 700;">
          🕒 ${isFr ? "Détails du nouvel horaire" : isEn ? "Updated Schedule Details" : "Detalles del nuevo horario"}
        </h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 13.5px; color: #475569; line-height: 1.8;">
          <li><strong>${isFr ? "Date :" : isEn ? "Date:" : "Fecha:"}</strong> ${fecha}</li>
          <li><strong>${isFr ? "Nouvel horaire :" : isEn ? "New Time:" : "Nueva Hora:"}</strong> <span style="color: #0055a5; font-weight: 700;">${nuevaHora}</span></li>
          <li><strong>${isFr ? "Ancien horaire :" : isEn ? "Previous Time:" : "Hora Anterior:"}</strong> <span style="text-decoration: line-through; color: #94a3b8;">${horaAnterior}</span></li>
        </ul>
      </div>

      <!-- Botón Ingreso al Aula Virtual / Panel -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${enlaceMeet && enlaceMeet !== 'pendiente' ? enlaceMeet : `${BASE_URL}/alumno`}" 
           style="background-color: #0055a5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 85, 165, 0.25);">
          ${isFr ? "Accéder à mon espace cours" : isEn ? "Go to my classroom" : "Ir a mi aula virtual"}
        </a>
      </div>

      <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
        ${isFr 
          ? "Merci pour votre compréhension !" 
          : isEn 
            ? "Thank you for your understanding!" 
            : "¡Gracias por tu comprensión!"}
      </p>

      <p style="font-size: 15px; color: #334155; margin-top: 20px; margin-bottom: 4px; font-weight: 600;">
        ${isFr ? "Un saludo," : isEn ? "Best regards," : "Un saludo,"}
      </p>
      <p style="font-size: 18px; color: #0055a5; font-weight: 800; margin-top: 0; margin-bottom: 24px;">
        Florentin
      </p>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0 20px;" />

      <!-- Logo abajo con espacio -->
      <div style="text-align: center; padding-top: 8px;">
        <img src="${BASE_URL}/logo.png" alt="Le Français avec Florentin" style="height: 42px; max-width: 180px; object-fit: contain; margin-bottom: 8px;" />
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          Le Français avec Florentin • Clases Personalizadas 1 a 1 de Francés Nativo
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent
  });
}
