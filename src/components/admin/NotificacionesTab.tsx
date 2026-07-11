import React from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  clases_restantes: number;
  divisa: string;
}

interface NotificacionesTabProps {
  alumnos: Alumno[];
  canalEnvio: "correo" | "whatsapp";
  setCanalEnvio: (canal: "correo" | "whatsapp") => void;
  destinatario: string;
  setDestinatario: (dest: string) => void;
  asuntoMsg: string;
  setAsuntoMsg: (val: string) => void;
  cuerpoMsg: string;
  setCuerpoMsg: (val: string) => void;
  envioExito: boolean;
  enviarMensaje: (e: React.FormEvent) => Promise<void>;
  lang?: "es" | "fr";
}

export default function NotificacionesTab({
  alumnos,
  canalEnvio,
  setCanalEnvio,
  destinatario,
  setDestinatario,
  asuntoMsg,
  setAsuntoMsg,
  cuerpoMsg,
  setCuerpoMsg,
  envioExito,
  enviarMensaje,
  lang = "es"
}: NotificacionesTabProps) {
  const isFr = lang === "fr";

  const t = {
    tituloCentro: isFr ? "Centre de Communication" : "Centro de Comunicaciones",
    descCentro: isFr ? "Envoyez des notifications, des avis de report de cours ou des supports d'étude à vos élèves par e-mail ou préparez un message rapide pour WhatsApp." : "Envía notificaciones, avisos de reprogramación de clases o plantillas de estudio a tus alumnos por Correo Electrónico o prepara un mensaje rápido para WhatsApp.",
    exitoEnvio: isFr ? "✓ Le message a été envoyé avec succès aux destinataires sélectionnés." : "✓ El mensaje ha sido despachado correctamente a los destinatarios seleccionados.",
    canalEnvio: isFr ? "Canal d'Envoi" : "Canal de Envío",
    opCorreo: isFr ? "E-mail (Via Resend/SMTP)" : "Correo Electrónico (Vía Resend/SMTP)",
    opWhatsapp: isFr ? "Préparer pour WhatsApp" : "Preparar para WhatsApp",
    destinatario: isFr ? "Destinataire" : "Destinatario",
    todosAlumnos: isFr ? "Tous les élèves actifs" : "Todos los alumnos activos",
    asuntoCorreo: isFr ? "Objet de l'e-mail" : "Asunto del Correo",
    asuntoPlaceholder: isFr ? "Ex : Rappel de votre cours de français cette semaine" : "Ej: Recordatorio de tu clase de francés de esta semana",
    cuerpoMensaje: isFr ? "Corps du Message" : "Cuerpo del Mensaje",
    cuerpoPlaceholder: isFr ? "Écrivez ici le contenu du message..." : "Escribe aquí el contenido del mensaje...",
    btnWhatsApp: isFr ? "Ouvrir WhatsApp et envoyer" : "Abrir WhatsApp y Enviar Plantilla",
    helpWhatsApp: isFr ? "* En cliquant, l'application WhatsApp s'ouvrira avec le message pré-rempli prêt à être envoyé à l'élève." : "* Al hacer clic, se abrirá tu aplicación de WhatsApp (Web o Escritorio) con el mensaje redactado listo para enviar al alumno.",
    btnCorreo: isFr ? "Envoyer l'E-mail" : "Despachar Correo Electrónico"
  };

  // Helper para generar el enlace de WhatsApp dinámico para el profesor
  const obtenerEnlaceWhatsApp = () => {
    let telefono = "";
    if (destinatario !== "todos") {
      const al = alumnos.find(a => a.id === destinatario);
      if (al) {
        const msg = encodeURIComponent(`Bonjour ${al.nombre}! ${cuerpoMsg}`);
        return `https://wa.me/?text=${msg}`;
      }
    }
    const msgMasivo = encodeURIComponent(cuerpoMsg);
    return `https://wa.me/?text=${msgMasivo}`;
  };

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Mail size={20} className="text-[#3b82f6] shrink-0" /> {t.tituloCentro}
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
        {t.descCentro}
      </p>

      {envioExito && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
          {t.exitoEnvio}
        </div>
      )}

      <form onSubmit={enviarMensaje} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Selector de Canal */}
        <div className="form-group">
          <label className="form-label">{t.canalEnvio}</label>
          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                checked={canalEnvio === "correo"}
                onChange={() => setCanalEnvio("correo")}
              />
              {t.opCorreo}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                checked={canalEnvio === "whatsapp"}
                onChange={() => setCanalEnvio("whatsapp")}
              />
              {t.opWhatsapp}
            </label>
          </div>
        </div>

        {/* Destinatario */}
        <div className="form-group">
          <label className="form-label">{t.destinatario}</label>
          <select
            className="form-control"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            style={{ padding: "10px 14px" }}
          >
            <option value="todos">{t.todosAlumnos} ({alumnos.length})</option>
            {alumnos.map(al => (
              <option key={al.id} value={al.id}>{al.nombre} ({al.email})</option>
            ))}
          </select>
        </div>

        {/* Asunto (Solo si es correo) */}
        {canalEnvio === "correo" && (
          <div className="form-group">
            <label className="form-label">{t.asuntoCorreo}</label>
            <input
              type="text"
              className="form-control"
              value={asuntoMsg}
              onChange={(e) => setAsuntoMsg(e.target.value)}
              placeholder={t.asuntoPlaceholder}
              style={{ padding: "10px 14px" }}
              required
            />
          </div>
        )}

        {/* Cuerpo del Mensaje */}
        <div className="form-group">
          <label className="form-label">{t.cuerpoMensaje}</label>
          <textarea
            className="form-control"
            rows={5}
            value={cuerpoMsg}
            onChange={(e) => setCuerpoMsg(e.target.value)}
            placeholder={t.cuerpoPlaceholder}
            style={{ padding: "16px", resize: "none" }}
            required
          ></textarea>
        </div>

        {/* Botón de Envío Dinámico */}
        {canalEnvio === "whatsapp" ? (
          <div>
            <a
              href={obtenerEnlaceWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px",
                backgroundColor: "#25d366",
                borderColor: "#25d366",
                color: "#000"
              }}
            >
              <MessageSquare size={16} /> {t.btnWhatsApp}
            </a>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
              {t.helpWhatsApp}
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
              alignSelf: "flex-start"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Send size={16} /> {t.btnCorreo}</div>
          </button>
        )}
      </form>
    </div>
  );
}
