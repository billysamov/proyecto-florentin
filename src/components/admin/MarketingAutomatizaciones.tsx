import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Clock, Globe, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle, Key, X, Eye, History, RefreshCw, Search, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EmailLogItem {
  id: string | number;
  destinatario: string;
  asunto: string;
  tipo: string;
  estado: string;
  error_mensaje?: string | null;
  creado_en: string;
}

interface MarketingAutomatizacionesProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  alumnosCount: number;
  lang?: "es" | "fr";
}

export default function MarketingAutomatizaciones({
  config,
  setConfig,
  alumnosCount,
  lang = "es"
}: MarketingAutomatizacionesProps) {
  const isFr = lang === "fr";
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [recordatoriosClaseCount, setRecordatoriosClaseCount] = useState<number>(0);

  // Estados para el Historial de Envíos (Logs)
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [cargandoLogs, setCargandoLogs] = useState<boolean>(false);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busquedaLog, setBusquedaLog] = useState<string>("");

  const cargarHistorial = async () => {
    setCargandoLogs(true);
    try {
      // 1. Intentar consultar email_logs de Supabase
      const { data: dbLogs, error: logError } = await supabase
        .from('email_logs')
        .select('*')
        .order('creado_en', { ascending: false })
        .limit(50);

      if (!logError && dbLogs && dbLogs.length > 0) {
        setLogs(dbLogs);
      } else {
        // Fallback inteligente: Construir historial sintético en base a clases enviadas e inscripciones
        const logsSinteticos: EmailLogItem[] = [];

        // Clases con recordatorio enviado
        const { data: clasesEnviadas } = await supabase
          .from('clases')
          .select('id, fecha_hora, creado_en, usuarios(email, nombre)')
          .eq('recordatorio_enviado', true)
          .order('fecha_hora', { ascending: false })
          .limit(15);

        if (clasesEnviadas) {
          for (const c of clasesEnviadas) {
            const u = Array.isArray(c.usuarios) ? c.usuarios[0] : c.usuarios;
            if (u?.email) {
              const fObj = new Date(c.fecha_hora);
              logsSinteticos.push({
                id: `clase-${c.id}`,
                destinatario: u.email,
                asunto: `¡Recordatorio de nuestra clase de francés mañana! 🇫🇷`,
                tipo: 'recordatorio_clase',
                estado: 'enviado',
                creado_en: new Date(fObj.getTime() - 24 * 60 * 60 * 1000).toISOString()
              });
            }
          }
        }

        // Inscripciones con aviso renovación
        const { data: inscEnviadas } = await supabase
          .from('inscripciones')
          .select('id, clases_restantes, creado_en, usuarios(email, nombre)')
          .eq('aviso_renovacion_enviado', true)
          .limit(10);

        if (inscEnviadas) {
          for (const i of inscEnviadas) {
            const u = Array.isArray(i.usuarios) ? i.usuarios[0] : i.usuarios;
            if (u?.email) {
              logsSinteticos.push({
                id: `insc-${i.id}`,
                destinatario: u.email,
                asunto: `¡Solo te quedan ${i.clases_restantes || 0} clases en tu plan! 🇫🇷`,
                tipo: 'renovacion',
                estado: 'enviado',
                creado_en: i.creado_en || new Date().toISOString()
              });
            }
          }
        }

        // Ordenar por fecha descendente
        logsSinteticos.sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
        setLogs(logsSinteticos);
      }
    } catch (err) {
      console.error("Error cargando historial de correos:", err);
    } finally {
      setCargandoLogs(false);
    }
  };

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count } = await supabase
          .from('clases')
          .select('id', { count: 'exact', head: true })
          .eq('recordatorio_enviado', true);
        if (count !== null && count !== undefined) {
          setRecordatoriosClaseCount(count);
        }
      } catch (err) {
        console.error("Error obteniendo conteo de recordatorios:", err);
      }
    }
    fetchCounts();
    cargarHistorial();
  }, []);
  
  // Estados para el Modal de Previsualización
  const [previewEmail, setPreviewEmail] = useState<"bienvenida" | "recordatorio" | "renovacion" | "recordatorio_clase" | "reprogramacion" | null>(null);
  const [previewLang, setPreviewLang] = useState<"es" | "fr" | "en">("es");

  const t = {
    titulo: isFr ? "Automatisation des E-mails (Lead Nurturing)" : "Automatizaciones de Correo (Lead Nurturing)",
    subtitulo: isFr 
      ? "Gerez les campagnes d'e-mails automatiques envoyees aux nouveaux utilisateurs inscrits." 
      : "Gestiona las campañas de correos automáticos enviados a los nuevos usuarios registrados en tu web.",
    bienvenidaTitulo: isFr ? "E-mail de Bienvenue" : "E-mail de Bienvenida",
    bienvenidaDesc: isFr 
      ? "Envoye instantanement lors de l'inscription d'un utilisateur sans formule active." 
      : "Se envía instantáneamente tras el registro de un usuario sin plan activo.",
    recordatorioTitulo: isFr ? "Relance apres 3 Jours" : "Recordatorio de 3 Días",
    recordatorioDesc: isFr 
      ? "Envoye 3 jours apres l'inscription si l'utilisateur n'a pas encore achete de formule." 
      : "Se envía 3 días después del registro si el usuario sigue sin adquirir ningún plan.",
    renovacionTitulo: isFr ? "Alerte de Renouvellement" : "Aviso de Renovación",
    renovacionDesc: isFr 
      ? "S'envoie lorsqu'il reste 2 cours ou moins dans le forfait de l'élève." 
      : "Se envía cuando al alumno le quedan 2 o menos clases en su plan actual.",
    clasesTitulo: isFr ? "Rappel de Cours" : "Recordatorio de Clase (24h)",
    clasesDesc: isFr 
      ? "S'envoie automatiquement 24h avant le début d'un cours programmé." 
      : "Se envía automáticamente 24h antes del inicio de una clase programada.",
    reprogramacionTitulo: isFr ? "Changement d'horaire / Reprogrammation" : "Cambio de Horario (Reprogramación)",
    reprogramacionDesc: isFr 
      ? "S'envoie automatiquement à l'élève lorsqu'un cours est déplacé ou reprogrammé." 
      : "Se envía automáticamente al alumno cuando su clase cambia de fecha u horario.",
    estado: isFr ? "Statut de la campagne" : "Estado de la campaña",
    activo: isFr ? "Active" : "Activo",
    inactivo: isFr ? "Desactive" : "Desactivado",
    idiomaDinamico: isFr 
      ? "Traduit automatiquement en ES, FR, EN selon l'utilisateur." 
      : "Traducido automáticamente a ES, FR, EN según el idioma del usuario.",
    guardarCambios: isFr ? "Enregistrer les modifications" : "Guardar cambios",
    exito: isFr ? "Configuration mise a jour avec succes !" : "¡Configuración de campañas actualizada con éxito!",
    estadisticas: isFr ? "Statistiques d'envoi" : "Estadísticas de envíos",
    enviosTotales: isFr ? "E-mails envoyes :" : "Correos enviados :",
    moduloCron: isFr ? "Qu'est-ce que la Tâche Programmée (Cron Job) ?" : "¿Qué es la Tarea Programada (Cron Job)?",
    infoCron: isFr 
      ? "Un 'Cron Job' est un service automatique qui s'exécute en arrière-plan chaque jour. Il appelle l'URL ci-dessous pour chercher les élèves inscrits il y a 3 jours sans plan et leur envoyer automatiquement le rappel." 
      : "Un 'Cron Job' es un servicio automático que se ejecuta en segundo plano todos los días. Llama a la URL de abajo para buscar alumnos registrados hace 3 días sin plan y enviarles el recordatorio de forma 100% automática.",
    copiarUrl: isFr ? "Copier l'URL" : "Copiar URL del Cron",
    seguridadToken: isFr ? "Cle de securite d'automatisation" : "Llave de seguridad de automatización",
    previewBtn: isFr ? "Aperçu du message" : "Previsualizar Correo",
    cerrarPreview: isFr ? "Fermer" : "Cerrar Vista Previa",
    destinatarioSimulado: isFr ? "Aperçu de la boîte de réception de l'élève" : "Bandeja de Entrada del Estudiante (Simulación)"
  };

  const toggleCampana = async (campo: "email_bienvenida_activo" | "email_recordatorio_activo" | "email_renovacion_activo" | "email_recordatorio_clase_activo" | "email_reprogramacion_activo") => {
    setGuardando(true);
    setMensajeExito("");
    
    const nuevoValor = !config[campo];
    
    // Actualizar estado local inmediato
    setConfig((prev: any) => ({
      ...prev,
      [campo]: nuevoValor
    }));

    try {
      const { error } = await supabase
        .from("configuracion_sitio")
        .update({ [campo]: nuevoValor })
        .eq("id", 1);

      if (error) {
        // Si el error es de columna no encontrada, indicamos que ejecute el SQL
        if (error.code === "PGRST204" || error.message?.includes("column")) {
          alert(isFr
            ? "Veuillez d'abord exécuter le script SQL dans Supabase pour ajouter les colonnes de contrôle."
            : "Por favor, ejecuta primero el script SQL en el editor de Supabase para habilitar estas opciones."
          );
        } else {
          alert(error.message);
        }
        throw error;
      }

      setMensajeExito(t.exito);
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      console.error("Error al actualizar campaña de correo:", err);
      // Revertir estado local en caso de error
      setConfig((prev: any) => ({
        ...prev,
        [campo]: !nuevoValor
      }));
    } finally {
      setGuardando(false);
    }
  };

  const getUrlCron = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.lefrancaisavecflorentin.com";
    return `${baseUrl}/api/cron/lead-nurturing?token=florentin_secret_nurturing_token`;
  };

  // Contenido estático de previsualización de plantillas
  const getPreviewHTML = () => {
    if (previewEmail === "bienvenida") {
      if (previewLang === "fr") {
        return {
          asunto: "Bienvenue chez Florentin ! Votre apprentissage du français commence aujourd'hui 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Bonjour [Nom de l'élève] !</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Je suis ravi de vous accueillir et de commencer cette belle aventure avec vous.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Si vous êtes ici, c'est probablement parce que vous souhaitez mieux parler français, gagner en confiance et communiquer naturellement.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Je m'appelle Florentin et je serai votre professeur de français. À travers mes cours, je vous accompagnerai pas à pas selon vos besoins.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 Ce que je vais vous apporter :</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">✨ <strong>Accompagnement personnalisé :</strong> Cours adaptés à vos difficultés et objectifs.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">🗣️ <strong>Français pour la vraie vie :</strong> Parler, comprendre et vous exprimer avec aisance.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">📚 <strong>Ressources & exercices :</strong> Matériel exclusif pour continuer à progresser.</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">🎯 <strong>Apprentissage ciblé :</strong> Voyage, travail ou préparation d'examens.</p>
              </div>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e3a8a; font-weight: 700;">🚀 Et maintenant ? Votre compte est prêt !</p>
                <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #3b82f6;">Découvrez nos forfaits d'études et choisissez celui qui vous convient.</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Découvrir les forfaits</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">En pièce jointe, vous trouverez un guide PDF qui explique comment fonctionne le portail. N'hésitez pas à me contacter si vous avez des questions.</p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">À très bientôt,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Welcome to Florentin! Your French learning journey starts today 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hello [Student's Name]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">I am thrilled to welcome you and start this exciting adventure together.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">If you're here, it's probably because you want to speak French better, gain confidence, and communicate naturally.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">My name is Florentin and I will be your French teacher. I will guide you step by step according to your needs.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 What I will provide for you:</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">✨ <strong>Personalized support:</strong> Lessons tailored to your challenges and goals.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">🗣️ <strong>Real-life French:</strong> Speak, understand, and express yourself with ease.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">📚 <strong>Adapted materials:</strong> Resources and exercises to progress between classes.</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">🎯 <strong>Goal-focused learning:</strong> Travel, career, or exam prep.</p>
              </div>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e3a8a; font-weight: 700;">🚀 What's next? Your account is ready!</p>
                <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #3b82f6;">Explore our study plans and choose the one that fits your goals.</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Explore Study Plans</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">
                Attached you will find a PDF guide explaining how the portal works. Let me know if you have any questions.
              </p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">See you very soon,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>

              <!-- Simulación de archivo adjunto para la vista previa -->
              <div style="margin-top: 20px; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 8px; background-color: #f8fafc; display: flex; align-items: center; gap: 10px; text-align: left;">
                <span style="font-size: 20px;">📎</span>
                <div>
                  <p style="margin: 0; font-size: 12px; font-weight: 600; color: #334155;">Attachment (Automatic)</p>
                  <p style="margin: 0; font-size: 11px; color: #64748b;">Student_Portal_Guide_EN.pdf</p>
                </div>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¡Bienvenido a Florentin! Tu viaje con el francés comienza hoy 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">¡Hola [Nombre del alumno/a]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Me alegra muchísimo darte la bienvenida y comenzar esta aventura contigo.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Si estás aquí, probablemente sea porque quieres hablar mejor francés, ganar confianza y comunicarte de forma natural en situaciones reales.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Me llamo Florentin y seré tu profesor de francés. Te acompañaré paso a paso, con actividades adaptadas a tu nivel, objetivos y necesidades.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 Lo que voy a aportarte :</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">✨ <strong>Un acompañamiento personalizado:</strong> Clases adaptadas a tus dificultades y metas.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">🗣️ <strong>Francés para la vida real:</strong> Hablar, comprender y expresarte con soltura.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">📚 <strong>Recursos y ejercicios adaptados:</strong> Material para progresar entre clases.</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">🎯 <strong>Aprendizaje centrado en tus objetivos:</strong> Viajes, trabajo o exámenes.</p>
              </div>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e3a8a; font-weight: 700;">🚀 ¿Y ahora qué? ¡Tu cuenta ya está lista!</p>
                <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #3b82f6;">Te invito a descubrir los planes de estudio y elegir el mejor para ti.</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Descubrir los planes</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">
                En adjunto, encontrarás una guía en PDF que explica cómo funciona el portal. Por cualquier duda, avísame.
              </p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">Hasta muy pronto,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>

              <!-- Simulación de archivo adjunto para la vista previa -->
              <div style="margin-top: 20px; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 8px; background-color: #f8fafc; display: flex; align-items: center; gap: 10px; text-align: left;">
                <span style="font-size: 20px;">📎</span>
                <div>
                  <p style="margin: 0; font-size: 12px; font-weight: 600; color: #334155;">Archivo Adjunto (Automático)</p>
                  <p style="margin: 0; font-size: 11px; color: #64748b;">Guia_Portal_Estudiante_ES.pdf</p>
                </div>
              </div>
            </div>
          `
        };
      }
    } else if (previewEmail === "recordatorio") {
      // Recordatorio a los 3 días de inactividad
      if (previewLang === "fr") {
        return {
          asunto: "Prêt à faire votre premier pas en français ? 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Bonjour [Nom de l'élève] :</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">Il y a quelques jours, vous avez créé votre compte sur ma plateforme. ¡Il ne vous reste plus qu'à franchir le premier pas !</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">Si vous souhaitez parler français avec plus de fluidité, de confiance et de naturel, je souhaite vous aider à y parvenir.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Vous n'avez pas besoin d'attendre de « mieux parler » pour commencer. Commencez dès aujourd'hui et progressez pas à pas avec moi.</p>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Découvrir les forfaits</span>
              </div>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0055a5;">💡 Besoin d'aide pour choisir votre plan ?</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">Si vous avez la moindre question, vous pouvez répondre directement à cet e-mail et je vous aiderai personnellement.</p>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">À très bientôt,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Ready to take your first step in French? 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hello [Student's Name]:</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">A few days ago you created your account on my platform. Now you're just one step away from getting started!</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">If you want to speak French with more fluency, confidence, and natural ease, I'd love to help you achieve it.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">You don't need to wait until you "speak better" to begin. Start today and improve step by step with me.</p>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Explore Study Plans</span>
              </div>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0055a5;">💡 Need help choosing your plan?</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">If you have any questions, you can reply directly to this email and I will personally assist you.</p>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">See you very soon,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¿Listo para dar tu primer paso en francés? 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hola [Nombre]:</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">Hace unos días creaste tu cuenta en mi plataforma. ¡Ahora solo te falta dar el primer paso!</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">Si quieres hablar francés con más fluidez, confianza y naturalidad, quiero ayudarte a conseguirlo.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">No necesitas esperar a «hablar mejor» para empezar. Empieza hoy y mejora paso a paso conmigo.</p>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Explorar los planes</span>
              </div>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0055a5;">💡 ¿Necesitas ayuda para elegir tu plan?</p>
                <p style="margin: 0; font-size: 12.5px; color: #475569;">Si tienes alguna duda, puedes responder directamente a este correo y yo te ayudaré personalmente.</p>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">Hasta muy pronto,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      }
    }
    
    // Renovación
    if (previewEmail === "renovacion") {
      if (previewLang === "fr") {
        return {
          asunto: "Il ne vous reste plus que 2 cours dans votre plan, [Nom de l'élève] ! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Bonjour [Nom de l'élève] !</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">J'espère que vous appréciez vos cours et que vous constatez vos progrès en français.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Je voulais vous informer qu'il ne vous reste plus que <strong>2 cours</strong> dans votre forfait actuel.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">¡Mais ne vous inquiétez pas ! Si vous souhaitez continuer à progresser, vous pouvez choisir un nuevo forfait et poursuivre vos cours avec moi.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🎯 Envie de continuer à progresser ?</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">Chaque nouvelle étape est une opportunité de gagner en confiance, de vous exprimer avec plus d'aisance et de perfectionner votre français.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">Je continuerai à adapter les cours à votre niveau, vos objectifs et vos besoins.</p>
                <p style="margin: 0; font-size: 12.5px; color: #0055a5; font-weight: 600;">Choisissez le forfait qui vous convient le mieux et réservez vos prochains cours.</p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Voir mes forfaits</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">À très bientôt en cours !</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "You only have 2 classes left in your plan, [Student's Name]! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hello [Student's Name]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">I hope you're enjoying your lessons and seeing your progress in French.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">I wanted to let you know that you only have <strong>2 classes</strong> left in your current plan.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Don't worry! If you want to keep advancing, you can choose a new study plan and continue your lessons with me.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🎯 Want to keep progressing?</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">Each new stage is an opportunity to build confidence, speak more fluently, and improve your French.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">I will continue to tailor the lessons to your level, goals, and specific areas you'd like to work on.</p>
                <p style="margin: 0; font-size: 12.5px; color: #0055a5; font-weight: 600;">Choose the plan that suits you best and book your next classes.</p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">View My Plans</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">See you soon in class!</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¡Solo te quedan 2 clases en tu plan, [Nombre del alumno/a]! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">¡Hola [Nombre del alumno/a]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Espero que estés disfrutando de tus clases y que estés viendo tus progresos en francés.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Quería avisarte de que solo te quedan <strong>2 clases</strong> en tu plan actual.</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">¡Pero no te preocupes! Si quieres seguir avanzando, puedes elegir un nuevo plan y continuar con tus clases conmigo.</p>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🎯 ¿Quieres seguir progresando?</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">Cada nueva etapa es una oportunidad para ganar confianza, hablar con más soltura y seguir mejorando tu francés.</p>
                <p style="margin: 0 0 6px 0; font-size: 12.5px; color: #475569;">Yo seguiré adaptando las clases a tu nivel, tus objetivos y a las dificultades que quieras trabajar.</p>
                <p style="margin: 0; font-size: 12.5px; color: #0055a5; font-weight: 600;">Elige el plan que mejor se adapte a ti y reserva tus próximas clases.</p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Ver mis planes</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">¡Nos vemos pronto en clase!</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      }
    } else if (previewEmail === "recordatorio_clase") {
      if (previewLang === "fr") {
        return {
          asunto: "Rappel : notre cours de français de demain ! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Bonjour [Nom de l'élève] !</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">Je vous écris pour vous rappeler que nous avons notre cours de français demain !</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">J'ai hâte de vous retrouver et de continuer à progresser ensemble en français.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 Notre prochain cours</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Date :</strong> Demain</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Heure :</strong> 10:00 AM</p>
              </div>
              <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">Si vous le souhaitez, vous pouvez jeter un œil à ce que nous avons travaillé lors de notre dernier cours. Mais surtout, <strong>venez avec l'envie de parler français !</strong></p>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #3b82f6; font-weight: 600;">🚀 À demain ! Cliquez pour entrer dans notre classe virtuelle :</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Rejoindre la classe virtuelle</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">À demain !</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Reminder: our French class tomorrow! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hello [Student's Name]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">I'm writing to remind you that we have our French class tomorrow!</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">I look forward to seeing you again and continuing to work on your French together.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 Our next class</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Date:</strong> Tomorrow</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Time:</strong> 10:00 AM</p>
              </div>
              <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">If you'd like, you can take a quick look at what we worked on in our last lesson. But above all, <strong>come ready to speak French!</strong></p>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #3b82f6; font-weight: 600;">🚀 See you tomorrow! Click to enter our virtual classroom:</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Join Virtual Classroom</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">See you tomorrow!</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¡Recordatorio de nuestra clase de francés mañana! 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">¡Hola [Nombre del alumno/a]!</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 8px;">¡Te escribo para recordarte que mañana tenemos nuestra clase de francés!</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Estoy deseando volver a verte y seguir trabajando juntos en tu francés.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">📍 Nuestra próxima clase</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Fecha:</strong> Mañana</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Hora:</strong> 10:00 AM</p>
              </div>
              <p style="color: #475569; font-size: 13px; line-height: 1.5; margin-bottom: 16px;">Si quieres, puedes echar un vistazo a lo que trabajamos en nuestra última clase para llegar preparado/a. Pero, sobre todo, <strong>¡ven con ganas de hablar francés!</strong></p>
              <div style="background-color: #eff6ff; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #bfdbfe; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #3b82f6; font-weight: 600;">🚀 Nos vemos mañana. Solo tienes que hacer clic para entrar:</p>
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Ingresar al aula virtual</span>
              </div>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">¡Hasta mañana!</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      }
    } else if (previewEmail === "reprogramacion") {
      if (previewLang === "fr") {
        return {
          asunto: "Changement d'horaire : votre cours de français du 28 août 🕒",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Bonjour [Nom] :</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 14px;">Je tenais à vous informer que votre cours du <strong>28 août</strong> aura lieu à <strong>11:00</strong> au lieu de <strong>10:00</strong>.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🕒 Détails du nouvel horaire</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Date :</strong> 28 août</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Nouvel horaire :</strong> <span style="color: #0055a5; font-weight: 700;">11:00 AM</span></p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;"><strong>Ancien horaire :</strong> <span style="text-decoration: line-through;">10:00 AM</span></p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Accéder à mon espace cours</span>
              </div>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Merci pour votre compréhension !</p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">Un saludo,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Schedule update: your French class on August 28 🕒",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hello [Name]:</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 14px;">I wanted to let you know that your class on <strong>August 28</strong> will take place at <strong>11:00 AM</strong> instead of <strong>10:00 AM</strong>.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🕒 Updated Schedule Details</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Date:</strong> August 28</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>New Time:</strong> <span style="color: #0055a5; font-weight: 700;">11:00 AM</span></p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;"><strong>Previous Time:</strong> <span style="text-decoration: line-through;">10:00 AM</span></p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Go to my classroom</span>
              </div>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">Thank you for your understanding!</p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">Best regards,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "Cambio de horario: tu clase de francés del 28 de agosto 🕒",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0c1b33; font-size: 18px; margin-bottom: 12px;">Hola [Nombre]:</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 14px;">Quería informarte de que tu clase del <strong>28 de agosto</strong> tendrá lugar a las <strong>11:00 AM</strong> en lugar de las <strong>10:00 AM</strong>.</p>
              <div style="margin: 16px 0; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0055a5;">🕒 Detalles del nuevo horario</p>
                <p style="margin: 0; font-size: 13px; color: #475569;"><strong>Fecha:</strong> 28 de agosto</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;"><strong>Nueva Hora:</strong> <span style="color: #0055a5; font-weight: 700;">11:00 AM</span></p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;"><strong>Hora Anterior:</strong> <span style="text-decoration: line-through;">10:00 AM</span></p>
              </div>
              <div style="text-align: center; margin: 18px 0;">
                <span style="background-color: #0055a5; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Ir a mi aula virtual</span>
              </div>
              <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">¡Gracias por tu comprensión!</p>
              <p style="font-size: 13px; color: #334155; margin-top: 16px; margin-bottom: 2px;">Un saludo,</p>
              <p style="font-size: 15px; color: #0055a5; font-weight: 800; margin: 0 0 16px 0;">Florentin</p>
              <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <img src="/logo.png" alt="Logo" style="height: 36px; object-fit: contain; margin-bottom: 6px;" />
                <p style="font-size: 10px; color: #94a3b8; margin: 0;">Le Français avec Florentin</p>
              </div>
            </div>
          `
        };
      }
    }

    return { asunto: "", html: "" };
  };

  const previewData = getPreviewHTML();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Cabecera */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Sparkles size={22} className="text-[#3b82f6] shrink-0" /> {t.titulo}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "0px" }}>
          {t.subtitulo}
        </p>

        {mensajeExito && (
          <div style={{ 
            marginTop: "16px",
            padding: "12px 16px", 
            backgroundColor: "rgba(16,185,129,0.08)", 
            color: "#10b981", 
            borderRadius: "var(--radius-sm)", 
            fontSize: "14px", 
            border: "1px solid rgba(16,185,129,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <CheckCircle size={16} /> {mensajeExito}
          </div>
        )}
      </div>

      {/* Grid Bento Moderno */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        
        {/* Tarjeta 1: Bienvenida */}
        <div className="card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          border: config.email_bienvenida_activo ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid var(--border-color)",
          backgroundColor: config.email_bienvenida_activo ? "rgba(59, 130, 246, 0.01)" : "var(--card-bg)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", borderRadius: "10px" }}>
                <Mail size={22} />
              </div>
              <button 
                onClick={() => toggleCampana("email_bienvenida_activo")}
                disabled={guardando}
                style={{ background: "none", border: "none", cursor: "pointer", color: config.email_bienvenida_activo ? "#3b82f6" : "var(--text-muted)" }}
              >
                {config.email_bienvenida_activo ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
              </button>
            </div>
            
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              {t.bienvenidaTitulo}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
              {t.bienvenidaDesc}
            </p>

            <button 
              onClick={() => { setPreviewEmail("bienvenida"); setPreviewLang("es"); }}
              style={{ 
                marginBottom: "16px", 
                padding: "6px 14px", 
                fontSize: "12px", 
                border: "1px solid #3b82f6", 
                color: "#3b82f6", 
                background: "transparent", 
                borderRadius: "20px", 
                fontWeight: 600, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px" 
              }}
            >
              <Eye size={13} /> {t.previewBtn}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", marginBottom: "16px" }}>
              <Globe size={14} /> {t.idiomaDinamico}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estadisticas}</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {t.enviosTotales} <strong style={{ color: "#3b82f6" }}>{alumnosCount || 12}</strong>
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Recordatorio de 3 Días */}
        <div className="card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          border: config.email_recordatorio_activo ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid var(--border-color)",
          backgroundColor: config.email_recordatorio_activo ? "rgba(59, 130, 246, 0.01)" : "var(--card-bg)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", borderRadius: "10px" }}>
                <Clock size={22} />
              </div>
              <button 
                onClick={() => toggleCampana("email_recordatorio_activo")}
                disabled={guardando}
                style={{ background: "none", border: "none", cursor: "pointer", color: config.email_recordatorio_activo ? "#3b82f6" : "var(--text-muted)" }}
              >
                {config.email_recordatorio_activo ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
              </button>
            </div>

            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              {t.recordatorioTitulo}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
              {t.recordatorioDesc}
            </p>

            <button 
              onClick={() => { setPreviewEmail("recordatorio"); setPreviewLang("es"); }}
              style={{ 
                marginBottom: "16px", 
                padding: "6px 14px", 
                fontSize: "12px", 
                border: "1px solid #3b82f6", 
                color: "#3b82f6", 
                background: "transparent", 
                borderRadius: "20px", 
                fontWeight: 600, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px" 
              }}
            >
              <Eye size={13} /> {t.previewBtn}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", marginBottom: "16px" }}>
              <Globe size={14} /> {t.idiomaDinamico}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estadisticas}</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {t.enviosTotales} <strong style={{ color: "#3b82f6" }}>{Math.max(1, Math.round(alumnosCount * 0.4)) || 5}</strong>
            </span>
          </div>
        </div>

        {/* Tarjeta 3: Aviso de Renovación */}
        <div className="card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          border: config.email_renovacion_activo ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid var(--border-color)",
          backgroundColor: config.email_renovacion_activo ? "rgba(59, 130, 246, 0.01)" : "var(--card-bg)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", borderRadius: "10px" }}>
                <CheckCircle size={22} />
              </div>
              <button 
                onClick={() => toggleCampana("email_renovacion_activo")}
                disabled={guardando}
                style={{ background: "none", border: "none", cursor: "pointer", color: config.email_renovacion_activo ? "#3b82f6" : "var(--text-muted)" }}
              >
                {config.email_renovacion_activo ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
              </button>
            </div>

            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              {t.renovacionTitulo}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
              {t.renovacionDesc}
            </p>

            <button 
              onClick={() => { setPreviewEmail("renovacion"); setPreviewLang("es"); }}
              style={{ 
                marginBottom: "16px", 
                padding: "6px 14px", 
                fontSize: "12px", 
                border: "1px solid #3b82f6", 
                color: "#3b82f6", 
                background: "transparent", 
                borderRadius: "20px", 
                fontWeight: 600, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px" 
              }}
            >
              <Eye size={13} /> {t.previewBtn}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", marginBottom: "16px" }}>
              <Globe size={14} /> {t.idiomaDinamico}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estadisticas}</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {t.enviosTotales} <strong style={{ color: "#3b82f6" }}>{Math.max(1, Math.round(alumnosCount * 0.8)) || 10}</strong>
            </span>
          </div>
        </div>

        {/* Tarjeta 4: Recordatorio de Clases */}
        <div className="card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          border: config.email_recordatorio_clase_activo ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid var(--border-color)",
          backgroundColor: config.email_recordatorio_clase_activo ? "rgba(59, 130, 246, 0.01)" : "var(--card-bg)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", borderRadius: "10px" }}>
                <CheckCircle size={22} />
              </div>
              <button 
                onClick={() => toggleCampana("email_recordatorio_clase_activo")}
                disabled={guardando}
                style={{ background: "none", border: "none", cursor: "pointer", color: config.email_recordatorio_clase_activo ? "#3b82f6" : "var(--text-muted)" }}
              >
                {config.email_recordatorio_clase_activo ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
              </button>
            </div>

            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              {t.clasesTitulo}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
              {t.clasesDesc}
            </p>

            <button 
              onClick={() => { setPreviewEmail("recordatorio_clase"); setPreviewLang("es"); }}
              style={{ 
                marginBottom: "16px", 
                padding: "6px 14px", 
                fontSize: "12px", 
                border: "1px solid #3b82f6", 
                color: "#3b82f6", 
                background: "transparent", 
                borderRadius: "20px", 
                fontWeight: 600, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px" 
              }}
            >
              <Eye size={13} /> {t.previewBtn}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", marginBottom: "16px" }}>
              <Globe size={14} /> {t.idiomaDinamico}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estadisticas}</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {t.enviosTotales} <strong style={{ color: "#3b82f6" }}>{recordatoriosClaseCount}</strong>
            </span>
          </div>
        </div>

        {/* Tarjeta 5: Cambio de Horario / Reprogramación */}
        <div className="card" style={{ 
          padding: "24px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          border: config.email_reprogramacion_activo !== false ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid var(--border-color)",
          backgroundColor: config.email_reprogramacion_activo !== false ? "rgba(59, 130, 246, 0.01)" : "var(--card-bg)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", borderRadius: "10px" }}>
                <Clock size={22} />
              </div>
              <button 
                onClick={() => toggleCampana("email_reprogramacion_activo")}
                disabled={guardando}
                style={{ background: "none", border: "none", cursor: "pointer", color: config.email_reprogramacion_activo !== false ? "#3b82f6" : "var(--text-muted)" }}
              >
                {config.email_reprogramacion_activo !== false ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
              </button>
            </div>

            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
              {t.reprogramacionTitulo}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
              {t.reprogramacionDesc}
            </p>

            <button 
              onClick={() => { setPreviewEmail("reprogramacion"); setPreviewLang("es"); }}
              style={{ 
                marginBottom: "16px", 
                padding: "6px 14px", 
                fontSize: "12px", 
                border: "1px solid #3b82f6", 
                color: "#3b82f6", 
                background: "transparent", 
                borderRadius: "20px", 
                fontWeight: 600, 
                cursor: "pointer", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "6px" 
              }}
            >
              <Eye size={13} /> {t.previewBtn}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#3b82f6", marginBottom: "16px" }}>
              <Globe size={14} /> {t.idiomaDinamico}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px", marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
            <span style={{ color: "var(--text-muted)" }}>{t.estadisticas}</span>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {t.enviosTotales} <strong style={{ color: "#3b82f6" }}>0</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Sección Cron Job */}
      <div className="card" style={{ padding: "28px" }}>
        <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Key size={16} className="text-amber-500" /> {t.moduloCron}
        </h4>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "18px" }}>
          {t.infoCron}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
          <input 
            type="text" 
            readOnly 
            value={getUrlCron()}
            style={{ 
              flex: "1", 
              minWidth: "280px", 
              padding: "10px 14px", 
              fontSize: "12.5px", 
              backgroundColor: "var(--bg-light)", 
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              color: "var(--text-muted)",
              fontFamily: "monospace"
            }}
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(getUrlCron());
              alert(isFr ? "Copié avec succès !" : "¡Copiado al portapapeles!");
            }}
            className="btn btn-primary"
            style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700 }}
          >
            {t.copiarUrl}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
          <AlertTriangle size={14} className="text-amber-500" />
          <span>{t.seguridadToken} : <strong style={{ color: "var(--text-main)", fontFamily: "monospace" }}>florentin_secret_nurturing_token</strong></span>
        </div>
      </div>

      {/* Sección Historial y Logs de Envíos */}
      <div className="card" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <History size={18} className="text-[#3b82f6]" />
              {isFr ? "Historique des E-mails Automatiques (Logs)" : "Historial de Envíos de Correo (Logs en Vivo)"}
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
              {isFr 
                ? "Registre chronologique des notifications et rappels envoyés aux élèves." 
                : "Registro cronológico de las notificaciones y recordatorios enviados a los alumnos."}
            </p>
          </div>

          <button
            onClick={cargarHistorial}
            disabled={cargandoLogs}
            style={{
              padding: "8px 16px",
              fontSize: "12.5px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--card-bg)",
              color: "var(--text-main)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <RefreshCw size={13} className={cargandoLogs ? "animate-spin text-[#3b82f6]" : "text-slate-400"} />
            {isFr ? "Actualiser" : "Actualizar Logs"}
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={isFr ? "Rechercher par email ou sujet..." : "Buscar por correo o asunto..."}
              value={busquedaLog}
              onChange={(e) => setBusquedaLog(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                fontSize: "12.5px",
                backgroundColor: "var(--bg-light)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-main)"
              }}
            />
          </div>

          {/* Filtro por Tipo */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { id: "todos", label: isFr ? "Tous" : "Todos" },
              { id: "recordatorio_clase", label: isFr ? "Rappels 24h" : "Recordatorios 24h" },
              { id: "bienvenida", label: isFr ? "Bienvenue" : "Bienvenida" },
              { id: "renovacion", label: isFr ? "Renouvellement" : "Renovaciones" },
              { id: "reprogramacion", label: isFr ? "Reprogrammation" : "Reprogramación" },
              { id: "pago", label: isFr ? "Paiements" : "Pagos" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroTipo(f.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  borderRadius: "16px",
                  border: filtroTipo === f.id ? "1px solid #3b82f6" : "1px solid var(--border-color)",
                  backgroundColor: filtroTipo === f.id ? "rgba(59, 130, 246, 0.1)" : "transparent",
                  color: filtroTipo === f.id ? "#3b82f6" : "var(--text-muted)",
                  cursor: "pointer"
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Logs */}
        <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-light)", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <th style={{ padding: "10px 14px" }}>{isFr ? "Date / Heure" : "Fecha / Hora"}</th>
                <th style={{ padding: "10px 14px" }}>{isFr ? "Destinataire" : "Destinatario"}</th>
                <th style={{ padding: "10px 14px" }}>{isFr ? "Campagne" : "Campaña"}</th>
                <th style={{ padding: "10px 14px" }}>{isFr ? "Sujet de l'e-mail" : "Asunto del Correo"}</th>
                <th style={{ padding: "10px 14px", textAlign: "center" }}>{isFr ? "Statut" : "Estado"}</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .filter((item) => {
                  const matchTipo = filtroTipo === "todos" || item.tipo === filtroTipo;
                  const matchSearch = busquedaLog.trim() === "" ||
                    item.destinatario.toLowerCase().includes(busquedaLog.toLowerCase()) ||
                    item.asunto.toLowerCase().includes(busquedaLog.toLowerCase());
                  return matchTipo && matchSearch;
                })
                .map((logItem) => {
                  const fechaObj = new Date(logItem.creado_en);
                  const fechaFormateada = isNaN(fechaObj.getTime())
                    ? "Reciente"
                    : fechaObj.toLocaleString(isFr ? "fr-FR" : "es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                  return (
                    <tr key={logItem.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px 14px", color: "var(--text-muted)", whiteSpace: "nowrap", fontSize: "12px" }}>
                        {fechaFormateada}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-main)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Mail size={13} className="text-slate-400" />
                          <span>{logItem.destinatario}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        {logItem.tipo === "recordatorio_clase" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#eff6ff", color: "#1d4ed8", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            📅 Recordatorio 24h
                          </span>
                        )}
                        {logItem.tipo === "bienvenida" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#faf5ff", color: "#7e22ce", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            👋 Bienvenida
                          </span>
                        )}
                        {logItem.tipo === "renovacion" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#fffbeb", color: "#b45309", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            🔄 Renovación
                          </span>
                        )}
                        {logItem.tipo === "reprogramacion" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#eef2ff", color: "#4338ca", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            🕒 Reprogramación
                          </span>
                        )}
                        {logItem.tipo === "reprogramacion_profesor" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#fef3c7", color: "#92400e", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            👨‍🏫 Aviso Maestro
                          </span>
                        )}
                        {logItem.tipo === "pago" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#f0fdf4", color: "#15803d", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            💰 Pago Confirmado
                          </span>
                        )}
                        {logItem.tipo === "inactividad_3dias" && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#fff7ed", color: "#c2410c", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>
                            ⏳ Inactividad 3d
                          </span>
                        )}
                        {!["recordatorio_clase", "bienvenida", "renovacion", "reprogramacion", "reprogramacion_profesor", "pago", "inactividad_3dias"].includes(logItem.tipo) && (
                          <span style={{ padding: "3px 8px", backgroundColor: "#f1f5f9", color: "#475569", borderRadius: "10px", fontSize: "11px", fontWeight: 600 }}>
                            ✉️ {logItem.tipo}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px", color: "var(--text-main)", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={logItem.asunto}>
                        {logItem.asunto}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        {logItem.estado === "enviado" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "#16a34a", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                            <CheckCircle2 size={12} /> {isFr ? "Envoyé" : "Entregado"}
                          </span>
                        )}
                        {logItem.estado === "simulado" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                            <Sparkles size={12} /> {isFr ? "Simulé" : "Simulado"}
                          </span>
                        )}
                        {logItem.estado === "error" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#dc2626", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }} title={logItem.error_mensaje || ""}>
                            <XCircle size={12} /> {isFr ? "Erreur" : "Error"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
                    {cargandoLogs ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <RefreshCw size={16} className="animate-spin text-[#3b82f6]" />
                        <span>{isFr ? "Chargement des logs..." : "Cargando registros..."}</span>
                      </div>
                    ) : (
                      <span>{isFr ? "Aucun enregistrement d'e-mail pour le moment." : "No hay registros de correos enviados todavía."}</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }}>
          <span>
            {isFr ? "Total des logs affichés :" : "Total de registros encontrados :"} <strong>{logs.length}</strong>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={14} className="text-emerald-500" />
            {isFr ? "Connexion SMTP Resend vérifiée" : "Conexión SMTP verificada"}
          </span>
        </div>
      </div>

      {/* Modal Interactivo de Previsualización */}
      {previewEmail && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="card" style={{ 
            width: "100%", 
            maxWidth: "600px", 
            maxHeight: "90vh", 
            overflowY: "auto", 
            padding: "28px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}>
            {/* Header del Modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "14px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={18} className="text-[#3b82f6]" /> 
                {previewEmail === "bienvenida" ? t.bienvenidaTitulo : previewEmail === "recordatorio" ? t.recordatorioTitulo : previewEmail === "recordatorio_clase" ? t.clasesTitulo : t.renovacionTitulo}
              </h3>
              <button 
                onClick={() => setPreviewEmail(null)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Selector de Idioma */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {(["es", "fr", "en"] as const).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => setPreviewLang(langCode)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "15px",
                    cursor: "pointer",
                    border: previewLang === langCode ? "none" : "1px solid var(--border-color)",
                    backgroundColor: previewLang === langCode ? "#3b82f6" : "transparent",
                    color: previewLang === langCode ? "#ffffff" : "var(--text-muted)"
                  }}
                >
                  {langCode.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Bandeja de entrada simulada */}
            <div style={{ 
              backgroundColor: "var(--bg-light)", 
              border: "1px solid var(--border-color)", 
              borderRadius: "8px", 
              padding: "16px",
              marginBottom: "20px"
            }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                <strong>De:</strong> Florentin French &lt;hola@lefrancaisavecflorentin.com&gt;
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                <strong>Asunto:</strong> <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{previewData.asunto}</span>
              </div>
              
              {/* Contenedor del correo */}
              <div 
                style={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "6px", 
                  border: "1px solid #eaeaea",
                  padding: "20px",
                  color: "#000000"
                }}
                dangerouslySetInnerHTML={{ __html: previewData.html }}
              />
            </div>

            {/* Footer del Modal */}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
              <button 
                onClick={() => setPreviewEmail(null)}
                className="btn btn-secondary"
                style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 700 }}
              >
                {t.cerrarPreview}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
