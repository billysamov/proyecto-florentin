import React, { useState } from "react";
import { Calendar, Edit } from "lucide-react";

interface ClaseAdmin {
  id: string;
  alumno: string;
  fecha: string;
  hora: string;
  estado: "programada" | "completada" | "cancelada";
  link: string;
  notes?: string;
  recording_url?: string;
  fecha_original?: string;
}

interface ResumenTabProps {
  clases: ClaseAdmin[];
  ingresosEur: number;
  ingresosUsd: number;
  editingLinkId: string | null;
  editingLinkValue: string;
  setEditingLinkId: (id: string | null) => void;
  setEditingLinkValue: (val: string) => void;
  guardarLinkClase: (id: string, link: string) => Promise<void>;
  cambiarEstadoClase: (id: string, estado: string) => Promise<void>;
  lang?: "es" | "fr";
}

export default function ResumenTab({
  clases,
  ingresosEur,
  ingresosUsd,
  editingLinkId,
  editingLinkValue,
  setEditingLinkId,
  setEditingLinkValue,
  guardarLinkClase,
  cambiarEstadoClase,
  lang = "es"
}: ResumenTabProps) {
  const [activeCalendarMenu, setActiveCalendarMenu] = useState<string | null>(null);
  const isFr = lang === "fr";

  const t = {
    ganancias: isFr ? "Revenus Totaux (Estimés)" : "Ganancias Totales (Estimado)",
    detalle: isFr ? "Détail : " : "Detalle: ",
    clasesProg: isFr ? "Cours Programmés" : "Clases Programadas",
    totalHistorial: isFr ? "Historique Total des Cours" : "Total Historial Clases",
    tituloAgenda: isFr ? "Agenda & Liste des Cours" : "Agenda y Listado de Clases",
    noClases: isFr ? "Aucun cours programmé ni historique disponible." : "No hay clases programadas ni historial de clases.",
    thAlumno: isFr ? "Élève" : "Estudiante",
    thFecha: isFr ? "Date" : "Fecha",
    thHora: isFr ? "Heure" : "Hora",
    thEnlace: isFr ? "Lien du Cours (Meet, Zoom, Teams, etc.)" : "Enlace de Clase (Meet, Zoom, Teams, etc.)",
    thEstado: isFr ? "Statut" : "Estado",
    thAcciones: isFr ? "Actions" : "Acciones",
    btnGuardar: isFr ? "Enregistrer" : "Guardar",
    tooltipEditar: isFr ? "Éditer le lien" : "Editar Enlace",
    tooltipCalendario: isFr ? "Ajouter à mon Calendrier" : "Agregar a mi Calendario",
    optCompletada: isFr ? "Marquer comme Terminé" : "Marcar Completada",
    optCancelada: isFr ? "Marquer como Annulé" : "Marcar Cancelada",
    optProgramada: isFr ? "Marquer comme Programmé" : "Marcar Programada",
    pendiente: isFr ? "en attente" : "pendiente"
  };

  const generarGoogleCalendarLink = (clase: ClaseAdmin) => {
    if (!clase.fecha_original) return "#";
    const start = new Date(clase.fecha_original);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hora de duración

    const formatGDate = (date: Date) => 
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = encodeURIComponent(isFr ? `Cours de Français avec ${clase.alumno}` : `Clase de Francés con ${clase.alumno}`);
    const dates = `${formatGDate(start)}/${formatGDate(end)}`;
    const details = encodeURIComponent(isFr ? `Lien pour rejoindre le cours de français : ${clase.link}` : `Enlace para unirse a la clase de francés: ${clase.link}`);
    const location = encodeURIComponent(clase.link);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const descargarICS = (clase: ClaseAdmin) => {
    if (!clase.fecha_original) return;
    const start = new Date(clase.fecha_original);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const formatICSDate = (date: Date) => 
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = isFr ? `Cours avec ${clase.alumno}` : `Clase con ${clase.alumno}`;
    const desc = isFr ? `Lien du cours : ${clase.link}` : `Enlace a la clase: ${clase.link}`;
    const loc = clase.link;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//Florentin//Clases//${isFr ? "FR" : "ES"}`,
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `cours-${clase.alumno.replace(/\s+/g, "-")}-${clase.id.substring(0, 5)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [modalReprogramar, setModalReprogramar] = useState<ClaseAdmin | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const handleAdminReprogramar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReprogramar || !nuevaFecha || !nuevaHora) return;
    setProcesando(true);
    setMensajeError("");
    setMensajeExito("");

    try {
      const fechaHoraIso = `${nuevaFecha}T${nuevaHora}:00.000Z`;
      const res = await fetch("/api/reprogramar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clase_id: modalReprogramar.id,
          nueva_fecha_hora: fechaHoraIso,
          es_admin: true
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setMensajeError(data.error || "Error al reprogramar clase");
      } else {
        setMensajeExito("¡Clase reprogramada exitosamente por el Administrador!");
        setTimeout(() => {
          setModalReprogramar(null);
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      setMensajeError("Error de red: " + err.message);
    } finally {
      setProcesando(false);
    }
  };

  const handleRestablecerIntentos = async (claseId: string) => {
    if (!confirm("¿Deseas restablecer los intentos de reprogramación de esta clase a 3 para el alumno?")) return;
    try {
      const res = await fetch("/api/reprogramar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clase_id: claseId,
          reset_intentos: true
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("¡Intentos de reprogramación restablecidos exitosamente a 3!");
        window.location.reload();
      } else {
        alert("Error: " + (data.error || "No se pudo restablecer"));
      }
    } catch (err: any) {
      alert("Error de red: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 💳 Métricas de Ingresos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        <div className="card-custom" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.ingresosEur}</span>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#10b981" }}>€{ingresosEur.toFixed(2)} EUR</span>
        </div>

        <div className="card-custom" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.ingresosUsd}</span>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#3b82f6" }}>${ingresosUsd.toFixed(2)} USD</span>
        </div>

        <div className="card-custom" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.clasesProg}</span>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#f97316" }}>
            {clases.filter(c => c.estado === "programada").length}
          </span>
        </div>

        <div className="card-custom" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.totalHistorial}</span>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "hsl(var(--accent-hsl))" }}>{clases.length}</span>
        </div>
      </div>

      {/* Listado de Clases */}
      <div className="card-custom" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
          {t.tituloAgenda}
        </h3>

        {clases.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic" }}>
            {t.noClases}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>{t.thAlumno}</th>
                  <th style={{ padding: "12px 16px" }}>{t.thFecha}</th>
                  <th style={{ padding: "12px 16px" }}>{t.thHora}</th>
                  <th style={{ padding: "12px 16px" }}>{t.thEnlace}</th>
                  <th style={{ padding: "12px 16px" }}>{t.thEstado}</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Acciones Admin</th>
                </tr>
              </thead>
              <tbody>
                {clases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600 }}>{c.alumno}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{c.fecha}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{c.hora} hs</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {editingLinkId === c.id ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            value={editingLinkValue}
                            onChange={(e) => setEditingLinkValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") guardarLinkClase(c.id, editingLinkValue);
                              if (e.key === "Escape") { setEditingLinkId(null); setEditingLinkValue(""); }
                            }}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "12px", width: "200px" }}
                            autoFocus
                          />
                          <button
                            onClick={() => guardarLinkClase(c.id, editingLinkValue)}
                            className="btn btn-primary"
                            style={{ padding: "2px 8px", fontSize: "11px" }}
                          >
                            {t.btnGuardar}
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
                          <span style={{
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: c.link === "pendiente" ? "#f97316" : "var(--text-main)"
                          }}>
                            {c.link === "pendiente" ? t.pendiente : c.link}
                          </span>
                          <button
                            onClick={() => {
                              setEditingLinkId(c.id);
                              setEditingLinkValue(c.link === "pendiente" ? "" : c.link);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "0"
                            }}
                            title={t.tooltipEditar}
                          >
                            <Edit size={14} className="text-[#3b82f6]" />
                          </button>

                          {c.link && c.link !== "pendiente" && (
                            <div style={{ position: "relative", display: "inline-block" }}>
                              <button
                                onClick={() => setActiveCalendarMenu(activeCalendarMenu === c.id ? null : c.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  padding: "0 4px"
                                }}
                                title={t.tooltipCalendario}
                              >
                                <Calendar size={14} className="text-[#3b82f6]" />
                              </button>

                              {activeCalendarMenu === c.id && (
                                <div style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  backgroundColor: "var(--bg-card)",
                                  border: "1px solid var(--border-color)",
                                  borderRadius: "var(--radius-sm)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  padding: "6px",
                                  zIndex: 100,
                                  minWidth: "160px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px"
                                }}>
                                  <a
                                    href={generarGoogleCalendarLink(c)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setActiveCalendarMenu(null)}
                                    style={{
                                      display: "block",
                                      padding: "6px 8px",
                                      fontSize: "11px",
                                      color: "var(--text-main)",
                                      textDecoration: "none",
                                      borderRadius: "2px",
                                      textAlign: "left",
                                      cursor: "pointer"
                                    }}
                                    className="calendar-dropdown-item"
                                  >
                                    Google Calendar
                                  </a>
                                  <button
                                    onClick={() => {
                                      descargarICS(c);
                                      setActiveCalendarMenu(null);
                                    }}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      padding: "6px 8px",
                                      fontSize: "11px",
                                      color: "var(--text-main)",
                                      border: "none",
                                      background: "none",
                                      borderRadius: "2px",
                                      textAlign: "left",
                                      cursor: "pointer"
                                    }}
                                    className="calendar-dropdown-item"
                                  >
                                    iCal / Outlook (.ics)
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className={`badge ${
                        c.estado === "programada" ? "badge-warning" : c.estado === "completada" ? "badge-success" : "badge-danger"
                      }`}>
                        {c.estado === "programada" ? (isFr ? "programmée" : "programada") : c.estado === "completada" ? (isFr ? "complétée" : "completada") : (isFr ? "annulée" : "cancelada")}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                      <select
                        value={c.estado}
                        onChange={(e) => cambiarEstadoClase(c.id, e.target.value)}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          padding: "4px 8px",
                          fontSize: "12px",
                          borderRadius: "var(--radius-sm)"
                        }}
                      >
                        <option value="programada">{t.optProgramada}</option>
                        <option value="completada">{t.optCompletada}</option>
                        <option value="cancelada">{t.optCancelada}</option>
                      </select>

                      {/* Botón Admin Reprogramar Horario */}
                      <button
                        onClick={() => {
                          setModalReprogramar(c);
                          setNuevaFecha("");
                          setNuevaHora("");
                          setMensajeError("");
                          setMensajeExito("");
                        }}
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        title="Cambiar fecha u hora por el administrador sin consumir intentos"
                      >
                        📅 Reprogramar
                      </button>

                      {/* Botón Admin Restablecer Intentos (+3) */}
                      <button
                        onClick={() => handleRestablecerIntentos(c.id)}
                        style={{
                          backgroundColor: "#10b981",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        title="Restablecer intentos de reprogramación a 3 para el alumno"
                      >
                        🔄 Intentos (+3)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Reprogramación del Administrador */}
      {modalReprogramar && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
              📅 Reprogramar Clase (Admin Override)
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Alumno: <strong>{modalReprogramar.alumno}</strong><br />
              Horario Actual: {modalReprogramar.fecha} a las {modalReprogramar.hora} hs
            </p>

            {mensajeError && (
              <div style={{ padding: "10px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: "8px", fontSize: "12px", marginBottom: "12px" }}>
                {mensajeError}
              </div>
            )}
            {mensajeExito && (
              <div style={{ padding: "10px", backgroundColor: "#ecfdf5", border: "1px solid #6ee7b7", color: "#047857", borderRadius: "8px", fontSize: "12px", marginBottom: "12px" }}>
                {mensajeExito}
              </div>
            )}

            <form onSubmit={handleAdminReprogramar} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Nueva Fecha:</label>
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  required
                  className="form-control"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>Nueva Hora:</label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  required
                  className="form-control"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalReprogramar(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#ffffff", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
                >
                  {procesando ? "Guardando..." : "Confirmar Reprogramación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
