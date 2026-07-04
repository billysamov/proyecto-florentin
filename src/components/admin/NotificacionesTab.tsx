import React from "react";

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
  enviarMensaje
}: NotificacionesTabProps) {
  
  // Helper para generar el enlace de WhatsApp dinámico para el profesor
  const obtenerEnlaceWhatsApp = () => {
    let telefono = "";
    if (destinatario !== "todos") {
      // Intentamos recuperar algún teléfono simulado o simplemente abrimos chat genérico con el nombre inyectado
      const al = alumnos.find(a => a.id === destinatario);
      if (al) {
        // En un caso real, la base de datos podría guardar el celular.
        // Aquí generamos el texto para compartir rápidamente
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
        ✉️ Centro de Comunicaciones
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
        Envía notificaciones, avisos de reprogramación de clases o plantillas de estudio a tus alumnos por Correo Electrónico o prepara un mensaje rápido para WhatsApp.
      </p>

      {envioExito && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
          ✓ El mensaje ha sido despachado correctamente a los destinatarios seleccionados.
        </div>
      )}

      <form onSubmit={enviarMensaje} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Selector de Canal */}
        <div className="form-group">
          <label className="form-label">Canal de Envío</label>
          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                checked={canalEnvio === "correo"}
                onChange={() => setCanalEnvio("correo")}
              />
              📧 Correo Electrónico (Vía Resend/SMTP)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                checked={canalEnvio === "whatsapp"}
                onChange={() => setCanalEnvio("whatsapp")}
              />
              💬 Preparar para WhatsApp
            </label>
          </div>
        </div>

        {/* Destinatario */}
        <div className="form-group">
          <label className="form-label">Destinatario</label>
          <select
            className="form-control"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            style={{ padding: "10px 14px" }}
          >
            <option value="todos">Todos los alumnos activos ({alumnos.length})</option>
            {alumnos.map(al => (
              <option key={al.id} value={al.id}>{al.nombre} ({al.email})</option>
            ))}
          </select>
        </div>

        {/* Asunto (Solo si es correo) */}
        {canalEnvio === "correo" && (
          <div className="form-group">
            <label className="form-label">Asunto del Correo</label>
            <input
              type="text"
              className="form-control"
              value={asuntoMsg}
              onChange={(e) => setAsuntoMsg(e.target.value)}
              placeholder="Ej: Recordatorio de tu clase de francés de esta semana"
              style={{ padding: "10px 14px" }}
              required
            />
          </div>
        )}

        {/* Cuerpo del Mensaje */}
        <div className="form-group">
          <label className="form-label">Cuerpo del Mensaje</label>
          <textarea
            className="form-control"
            rows={5}
            value={cuerpoMsg}
            onChange={(e) => setCuerpoMsg(e.target.value)}
            placeholder="Escribe aquí el contenido del mensaje..."
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
              💬 Abrir WhatsApp y Enviar Plantilla
            </a>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
              * Al hacer clic, se abrirá tu aplicación de WhatsApp (Web o Escritorio) con el mensaje redactado listo para enviar al alumno.
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
            📧 Despachar Correo Electrónico
          </button>
        )}
      </form>
    </div>
  );
}
