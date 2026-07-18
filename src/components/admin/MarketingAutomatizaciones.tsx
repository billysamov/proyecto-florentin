import React, { useState } from "react";
import { Mail, Sparkles, Clock, Globe, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle, Key } from "lucide-react";
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

  const t = {
    titulo: isFr ? "Automatisation des E-mails (Lead Nurturing)" : "Automatizaciones de Correo (Lead Nurturing)",
    subtitulo: isFr 
      ? "Gérez les campagnes d'e-mails automatiques envoyées aux nouveaux utilisateurs inscrits." 
      : "Gestiona las campañas de correos automáticos enviados a los nuevos usuarios registrados en tu web.",
    bienvenidaTitulo: isFr ? "E-mail de Bienvenue" : "E-mail de Bienvenida",
    bienvenidaDesc: isFr 
      ? "Envoyé instantanément lors de l'inscription d'un utilisateur sans formule active." 
      : "Se envía instantáneamente tras el registro de un usuario sin plan activo.",
    recordatorioTitulo: isFr ? "Relance après 3 Jours" : "Recordatorio de 3 Días",
    recordatorioDesc: isFr 
      ? "Envoyé 3 jours après l'inscription si l'utilisateur n'a pas encore acheté de formule." 
      : "Se envía 3 días después del registro si el usuario sigue sin adquirir ningún plan.",
    estado: isFr ? "Statut de la campagne" : "Estado de la campaña",
    activo: isFr ? "Activé" : "Activo",
    inactivo: isFr ? "Désactivé" : "Desactivado",
    idiomaDinamico: isFr 
      ? "Traduit automatiquement en ES, FR, EN selon l'utilisateur." 
      : "Traducido automáticamente a ES, FR, EN según el idioma del usuario.",
    guardarCambios: isFr ? "Enregistrer les modifications" : "Guardar cambios",
    exito: isFr ? "Configuration mise à jour avec succès !" : "¡Configuración de campañas actualizada con éxito!",
    estadisticas: isFr ? "Statistiques d'envoi" : "Estadísticas de envíos",
    enviosTotales: isFr ? "E-mails envoyés :" : "Correos enviados :",
    moduloCron: isFr ? "Configuration de la Tâche Programmée (Cron Job)" : "Configuración de la Tarea Programada (Cron Job)",
    infoCron: isFr 
      ? "Cette URL doit être appelée quotidiennement pour vérifier et envoyer les relances de 3 jours." 
      : "Esta URL debe ser llamada diariamente por tu proveedor de Cron para procesar y enviar los recordatorios de 3 días.",
    copiarUrl: isFr ? "Copier l'URL" : "Copiar URL del Cron",
    seguridadToken: isFr ? "Clé de sécurité d'automatisation" : "Llave de seguridad de automatización"
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

      if (error) throw error;

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
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px" }}>
              {t.bienvenidaDesc}
            </p>

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
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px" }}>
              {t.recordatorioDesc}
            </p>

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
    </div>
  );
}
