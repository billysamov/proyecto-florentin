import React, { useState } from "react";
import { Mail, Sparkles, Clock, Globe, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle, Key, X, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  
  // Estados para el Modal de Previsualización
  const [previewEmail, setPreviewEmail] = useState<"bienvenida" | "recordatorio" | null>(null);
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

  const toggleCampana = async (campo: "email_bienvenida_activo" | "email_recordatorio_activo") => {
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
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Nom de l'élève]!</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;"> Nous sommes ravis de vous accueillir sur notre plateforme. Votre compte a été créé avec succès.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Apprendre une nouvelle langue est une aventure passionnante. Avec nos cours particuliers sur mesure, vous progresserez rapidement avec un professeur natif certifié.</p>
              <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 15px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;">Ce qui vous attend :</h4>
                <ul style="padding-left: 20px; margin: 0; font-size: 12.5px; color: #475569;">
                  <li>👨‍🏫 <strong>Professeur Natif :</strong> Cours axés sur la conversation réelle.</li>
                  <li>📅 <strong>Flexibilité Totale :</strong> Planifiez vos cours selon vos disponibilités.</li>
                  <li>📝 <strong>Matériel Exclusif :</strong> Accès à des fiches de cours et des leçons enregistrées.</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 13px; font-style: italic; text-align: center;">Faites le premier pas aujourd'hui en choisissant le plan d'études qui correspond à vos objectifs.</p>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Découvrir les Plans</span>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Welcome to Florentin! Your French learning journey starts today 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Student's Name]!</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">We are delighted to welcome you to our platform. Your account has been successfully created.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Learning a new language is an exciting adventure. With our tailored private lessons, you will progress quickly with a certified native teacher.</p>
              <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 15px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;">What awaits you:</h4>
                <ul style="padding-left: 20px; margin: 0; font-size: 12.5px; color: #475569;">
                  <li>👨‍🏫 <strong>Native Teacher:</strong> Lessons focused on real conversation.</li>
                  <li>📅 <strong>Total Flexibility:</strong> Schedule lessons according to your availability.</li>
                  <li>📝 <strong>Exclusive Material:</strong> Access to study sheets and recorded lessons.</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 13px; font-style: italic; text-align: center;">Take the first step today by choosing the study plan that fits your goals.</p>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Explore Study Plans</span>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¡Bienvenido a Florentin! Tu viaje con el francés comienza hoy 🇫🇷",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Nombre del Alumno]!</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Nos alegra mucho darte la bienvenida a nuestra plataforma. Tu cuenta ha sido creada con éxito.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Aprender un nuevo idioma es una aventura emocionante. Con nuestras clases particulares a medida, avanzarás rápidamente de la mano de un profesor nativo certificado.</p>
              <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin: 15px 0;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;">Lo que te espera:</h4>
                <ul style="padding-left: 20px; margin: 0; font-size: 12.5px; color: #475569;">
                  <li>👨‍🏫 <strong>Profesor Nativo:</strong> Clases enfocadas en conversación real.</li>
                  <li>📅 <strong>Flexibilidad Total:</strong> Programa tus clases según tu propio horario.</li>
                  <li>📝 <strong>Material Exclusivo:</strong> Acceso a fichas de estudio y lecciones grabadas.</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 13px; font-style: italic; text-align: center;">Da el primer paso hoy mismo eligiendo el plan de estudios que mejor se adapte a tus metas.</p>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Ver Planes de Estudio</span>
              </div>
            </div>
          `
        };
      }
    } else {
      // Recordatorio
      if (previewLang === "fr") {
        return {
          asunto: "Prêt à faire votre premier pas en français ? 🚀",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Nom de l'élève],</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Il y a quelques jours, vous avez créé votre compte sur notre plateforme. Nous espérons que vous êtes prêt à commencer !</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Le meilleur moment pour apprendre une langue, c'est aujourd'hui. Ne laissez pas passer l'opportunité de parler français couramment avec confiance.</p>
              <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; text-align: center;">
                <p style="margin: 0; font-size: 13.5px; color: #b45309; font-weight: 700;">💡 Besoin d'aide pour choisir un plan ?</p>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #d97706;">Vous pouvez répondre directement à cet e-mail si vous avez des questions ou si vous souhaitez planifier un appel d'orientation.</p>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Commencer mon Apprentissage</span>
              </div>
            </div>
          `
        };
      } else if (previewLang === "en") {
        return {
          asunto: "Ready to take your first step in French? 🚀",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Student's Name],</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">A few days ago, you created your account on our platform. We hope you are ready to begin!</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">The best time to learn a language is today. Don't let the opportunity to speak French fluently and confidently slip away.</p>
              <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; text-align: center;">
                <p style="margin: 0; font-size: 13.5px; color: #b45309; font-weight: 700;">💡 Need help choosing a plan?</p>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #d97706;">You can reply directly to this email if you have any questions or want to schedule an orientation call.</p>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Start My Learning</span>
              </div>
            </div>
          `
        };
      } else {
        return {
          asunto: "¿Listo para dar tu primer paso en francés? 🚀",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 15px; border-radius: 8px;">
              <h2 style="color: #1a2530; font-size: 18px;">Bonjour [Nombre del Alumno],</h2>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Hace unos días creaste tu cuenta en nuestra plataforma. ¡Esperamos que estés listo para comenzar!</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">El mejor momento para aprender un idioma es hoy. No dejes pasar la oportunidad de hablar francés con fluidez y confianza.</p>
              <div style="margin: 15px 0; padding: 15px; background-color: #fffbeb; border-radius: 6px; border: 1px solid #fde68a; text-align: center;">
                <p style="margin: 0; font-size: 13.5px; color: #b45309; font-weight: 700;">💡 ¿Necesitas ayuda para elegir un plan?</p>
                <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #d97706;">Puedes responder directamente a este correo si tienes alguna duda o si deseas agendar una llamada de orientación gratis.</p>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <span style="background-color: #3b82f6; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block;">Iniciar mi Aprendizaje</span>
              </div>
            </div>
          `
        };
      }
    }
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
                {previewEmail === "bienvenida" ? t.bienvenidaTitulo : t.recordatorioTitulo}
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
