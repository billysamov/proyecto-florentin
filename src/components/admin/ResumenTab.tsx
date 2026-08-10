import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  alumno_zona_horaria?: string;
}

interface ConfigHorario {
  dias_laborables?: string;
  hora_inicio?: string;
  hora_fin?: string;
  almuerzo_inicio?: string;
  almuerzo_fin?: string;
  zona_horaria?: string;
  exclusiones_horario?: string;
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
  config?: ConfigHorario;
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
  lang = "es",
  config
}: ResumenTabProps) {
  const [activeCalendarMenu, setActiveCalendarMenu] = useState<string | null>(null);
  const [filtroAlumno, setFiltroAlumno] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "programada" | "completada" | "cancelada">("todos");
  const isFr = lang === "fr";

  const clasesFiltradas = useMemo(() => {
    return clases.filter(c => {
      const coincideAlumno = c.alumno.toLowerCase().includes(filtroAlumno.trim().toLowerCase());
      const coincideEstado = filtroEstado === "todos" || c.estado === filtroEstado;
      return coincideAlumno && coincideEstado;
    });
  }, [clases, filtroAlumno, filtroEstado]);

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
  const [nuevaHoraSlot, setNuevaHoraSlot] = useState<{ display: string; utc: string; alumnoDisplay?: string } | null>(null);
  const [slotsDisponibles, setSlotsDisponibles] = useState<{ display: string; utc: string; alumnoDisplay?: string }[]>([]);
  const [mesVisibleAdmin, setMesVisibleAdmin] = useState<Date>(new Date());
  const [procesando, setProcesando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Igual al calendario del panel del alumno: clasifica cada día del mes
  // visible como libre/parcial/completo/cerrado/pasado según ocupación real.
  const getEstadoDiaAdmin = (diaNum: number) => {
    if (!modalReprogramar) return "cerrado";

    const horaInicio = config?.hora_inicio || "09:00";
    const horaFin = config?.hora_fin || "18:00";
    const almuerzoInicio = config?.almuerzo_inicio || "13:00";
    const almuerzoFin = config?.almuerzo_fin || "14:00";
    let diasLaborables: number[] = [1, 2, 3, 4, 5];
    try {
      diasLaborables = JSON.parse(config?.dias_laborables || "[1,2,3,4,5]");
    } catch {}
    let exclusiones: any[] = [];
    try {
      exclusiones = JSON.parse(config?.exclusiones_horario || "[]");
    } catch {}

    const dateObj = new Date(mesVisibleAdmin.getFullYear(), mesVisibleAdmin.getMonth(), diaNum);
    const dayOfWeek = dateObj.getDay();
    if (!diasLaborables.includes(dayOfWeek)) return "cerrado";

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(diaNum).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;

    const bloqueado = exclusiones.some((ex: any) => ex.fecha === dateString && ex.tipo === "dia_completo");
    if (bloqueado) return "cerrado";

    // El admin sí puede reprogramar clases del pasado (no consume intentos, es una corrección),
    // así que un día pasado se muestra "parcial" en vez de bloquearlo.
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const esPasado = dateObj < hoy;

    const startHourTeacher = parseInt(horaInicio.split(":")[0], 10);
    const endHourTeacher = parseInt(horaFin.split(":")[0], 10);
    const startLunch = parseInt(almuerzoInicio.split(":")[0], 10);
    const endLunch = parseInt(almuerzoFin.split(":")[0], 10);

    const ocupados = clases
      .filter(c => c.estado === "programada" && c.id !== modalReprogramar.id && c.fecha_original)
      .map(c => c.fecha_original as string);

    let slotsTotales = 0;
    let slotsOcupados = 0;
    for (let h = startHourTeacher; h < endHourTeacher; h++) {
      if (h >= startLunch && h < endLunch) continue;
      slotsTotales++;
      const slotDate = new Date(Date.UTC(y, dateObj.getMonth(), diaNum, h, 0, 0));
      const isoString = slotDate.toISOString();
      if (ocupados.some(occ => occ.startsWith(isoString.substring(0, 14)))) slotsOcupados++;
    }

    if (slotsTotales === 0) return "cerrado";
    if (esPasado) return "parcial";
    if (slotsOcupados >= slotsTotales) return "completo";
    if (slotsOcupados > 0) return "parcial";
    return "libre";
  };

  // Calcula los horarios disponibles para reprogramar respetando el horario
  // laboral/almuerzo/días laborables configurados, igual que hace el panel del alumno.
  useEffect(() => {
    if (!modalReprogramar || !nuevaFecha) {
      setSlotsDisponibles([]);
      return;
    }

    const horaInicio = config?.hora_inicio || "09:00";
    const horaFin = config?.hora_fin || "18:00";
    const almuerzoInicio = config?.almuerzo_inicio || "13:00";
    const almuerzoFin = config?.almuerzo_fin || "14:00";
    const zonaHorariaProfesor = config?.zona_horaria || "Europe/Paris";
    let diasLaborables: number[] = [1, 2, 3, 4, 5];
    try {
      diasLaborables = JSON.parse(config?.dias_laborables || "[1,2,3,4,5]");
    } catch {}

    const ocupados = clases
      .filter(c => c.estado === "programada" && c.id !== modalReprogramar.id && c.fecha_original)
      .map(c => c.fecha_original as string);

    const startHourTeacher = parseInt(horaInicio.split(":")[0], 10);
    const endHourTeacher = parseInt(horaFin.split(":")[0], 10);
    const startLunch = parseInt(almuerzoInicio.split(":")[0], 10);
    const endLunch = parseInt(almuerzoFin.split(":")[0], 10);

    const slots: { display: string; utc: string; alumnoDisplay?: string }[] = [];
    const [y, m, d] = nuevaFecha.split("-");

    for (let h = startHourTeacher; h < endHourTeacher; h++) {
      if (h >= startLunch && h < endLunch) continue;

      try {
        const testDateUTC = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0));

        const formatterTeacher = new Intl.DateTimeFormat('en-US', {
          timeZone: zonaHorariaProfesor,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        });

        const formattedStr = formatterTeacher.format(testDateUTC);
        const match = formattedStr.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/);
        if (!match) continue;

        const [, monthParis, dayParis, yearParis, hourParis, minParis, secParis] = match;
        const dateParisAsUTC = Date.UTC(
          Number(yearParis), Number(monthParis) - 1, Number(dayParis),
          Number(hourParis), Number(minParis), Number(secParis)
        );
        const tzOffsetMs = dateParisAsUTC - testDateUTC.getTime();
        const targetParisAsUTC = Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0);
        const realSlotDateUTC = new Date(targetParisAsUTC - tzOffsetMs);

        const teacherDateInParisStr = realSlotDateUTC.toLocaleString('en-US', { timeZone: zonaHorariaProfesor });
        const teacherDayNum = new Date(teacherDateInParisStr).getDay();

        if (!diasLaborables.includes(teacherDayNum)) continue;

        const isoString = realSlotDateUTC.toISOString();
        const isOccupied = ocupados.some(occ => occ.startsWith(isoString.substring(0, 14)));
        if (isOccupied) continue;

        const horaLocalStr = new Intl.DateTimeFormat('es-ES', {
          timeZone: zonaHorariaProfesor,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(realSlotDateUTC);

        let alumnoDisplay: string | undefined;
        const zonaAlumno = modalReprogramar.alumno_zona_horaria;
        if (zonaAlumno && zonaAlumno !== zonaHorariaProfesor) {
          try {
            alumnoDisplay = new Intl.DateTimeFormat('es-ES', {
              timeZone: zonaAlumno,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }).format(realSlotDateUTC);
          } catch {}
        }

        slots.push({ display: horaLocalStr, utc: isoString, alumnoDisplay });
      } catch (err) {
        console.error("Error calculando horarios disponibles:", err);
      }
    }

    setSlotsDisponibles(slots);
  }, [modalReprogramar, nuevaFecha, clases, config]);

  const handleAdminReprogramar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalReprogramar || !nuevaFecha || !nuevaHoraSlot) return;
    setProcesando(true);
    setMensajeError("");
    setMensajeExito("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const fechaHoraIso = nuevaHoraSlot.utc;
      const res = await fetch("/api/reprogramar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
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
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/reprogramar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <input
            type="text"
            value={filtroAlumno}
            onChange={(e) => setFiltroAlumno(e.target.value)}
            placeholder={isFr ? "Rechercher un élève..." : "Buscar por alumno..."}
            className="form-control"
            style={{ padding: "8px 12px", fontSize: "13px", flex: "1 1 220px", minWidth: "180px" }}
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
            className="form-control"
            style={{ padding: "8px 12px", fontSize: "13px", width: "auto" }}
          >
            <option value="todos">{isFr ? "Tous les statuts" : "Todos los estados"}</option>
            <option value="programada">{t.optProgramada}</option>
            <option value="completada">{t.optCompletada}</option>
            <option value="cancelada">{t.optCancelada}</option>
          </select>
        </div>

        {clasesFiltradas.length === 0 ? (
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
                {clasesFiltradas.map((c) => (
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

                      {c.estado === "programada" && (
                        <>
                          {/* Botón Admin Reprogramar Horario */}
                          <button
                            onClick={() => {
                              setModalReprogramar(c);
                              setNuevaFecha("");
                              setNuevaHoraSlot(null);
                              setMensajeError("");
                              setMensajeExito("");
                              setMesVisibleAdmin(c.fecha_original ? new Date(c.fecha_original) : new Date());
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
                        </>
                      )}
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
            maxWidth: "460px",
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
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "8px" }}>Seleccionar Fecha:</label>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setMesVisibleAdmin(new Date(mesVisibleAdmin.getFullYear(), mesVisibleAdmin.getMonth() - 1, 1))}
                    style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}
                  >
                    &lt;
                  </button>
                  <span style={{ fontWeight: 700, fontSize: "14px", textTransform: "capitalize" }}>
                    {mesVisibleAdmin.toLocaleString("es-ES", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMesVisibleAdmin(new Date(mesVisibleAdmin.getFullYear(), mesVisibleAdmin.getMonth() + 1, 1))}
                    style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}
                  >
                    &gt;
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center", fontWeight: 700, fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                  {(() => {
                    const yr = mesVisibleAdmin.getFullYear();
                    const mth = mesVisibleAdmin.getMonth();
                    const tempStart = new Date(yr, mth, 1).getDay();
                    const startDayIdx = tempStart === 0 ? 6 : tempStart - 1;
                    return Array.from({ length: startDayIdx }).map((_, idx) => (
                      <div key={`pad-${idx}`} />
                    ));
                  })()}
                  {(() => {
                    const yr = mesVisibleAdmin.getFullYear();
                    const mth = mesVisibleAdmin.getMonth();
                    const totalDays = new Date(yr, mth + 1, 0).getDate();

                    return Array.from({ length: totalDays }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const estado = getEstadoDiaAdmin(dayNum);
                      const diaIsoStr = `${yr}-${String(mth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isSelected = nuevaFecha === diaIsoStr;
                      const isClickable = estado !== "cerrado";

                      let bgColor = "#ffffff";
                      let textColor = "var(--text-main)";
                      let borderColor = "#cbd5e1";
                      let dotColor = "transparent";

                      if (estado === "cerrado") {
                        bgColor = "#f8fafc"; textColor = "#cbd5e1"; borderColor = "#e2e8f0";
                      } else if (estado === "completo") {
                        bgColor = "#fef2f2"; textColor = "#94a3b8"; borderColor = "#fca5a5"; dotColor = "#ef4444";
                      } else if (estado === "parcial") {
                        bgColor = "#fff7ed"; borderColor = "#fdbb2d"; dotColor = "#f97316";
                      } else if (estado === "libre") {
                        bgColor = "#f0fdf4"; borderColor = "#86efac"; dotColor = "#22c55e";
                      }

                      if (isSelected) {
                        bgColor = "#0c1b33"; textColor = "#ffffff"; borderColor = "#0c1b33";
                      }

                      return (
                        <button
                          key={`day-${dayNum}`}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => {
                            setNuevaFecha(diaIsoStr);
                            setNuevaHoraSlot(null);
                          }}
                          style={{
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            height: "34px", borderRadius: "6px", border: `1px solid ${borderColor}`,
                            backgroundColor: bgColor, color: textColor,
                            cursor: isClickable ? "pointer" : "not-allowed",
                            fontSize: "12px", fontWeight: 600, position: "relative"
                          }}
                        >
                          <span>{dayNum}</span>
                          {isClickable && !isSelected && (
                            <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: dotColor, position: "absolute", bottom: "3px" }} />
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px", fontSize: "10px", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} /> Libre
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} /> Parcial
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} /> Completo
                  </div>
                </div>
              </div>

              {modalReprogramar.alumno_zona_horaria && config?.zona_horaria && modalReprogramar.alumno_zona_horaria !== config.zona_horaria && (
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                  🌍 Horarios en tu zona ({config.zona_horaria}). Debajo de cada hora se muestra el equivalente para el alumno ({modalReprogramar.alumno_zona_horaria}).
                </p>
              )}

              {nuevaFecha && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Horarios Disponibles:
                  </label>
                  {slotsDisponibles.length === 0 ? (
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                      No hay horarios disponibles ese día (fuera de días laborables u horario configurado, u ocupado por otra clase).
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {slotsDisponibles.map((slot) => (
                        <button
                          key={slot.utc}
                          type="button"
                          onClick={() => setNuevaHoraSlot(slot)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: nuevaHoraSlot?.utc === slot.utc ? "2px solid #3b82f6" : "1px solid var(--border-color)",
                            backgroundColor: nuevaHoraSlot?.utc === slot.utc ? "#3b82f6" : "transparent",
                            color: nuevaHoraSlot?.utc === slot.utc ? "#ffffff" : "var(--text-main)"
                          }}
                        >
                          {slot.display}
                          {slot.alumnoDisplay && (
                            <span style={{
                              fontSize: "10px",
                              fontWeight: 400,
                              opacity: 0.8
                            }}>
                              alumno: {slot.alumnoDisplay}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                  disabled={procesando || !nuevaHoraSlot}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#ffffff", cursor: "pointer", fontSize: "12px", fontWeight: 700, opacity: !nuevaHoraSlot ? 0.5 : 1 }}
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
