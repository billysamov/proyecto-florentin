import React from "react";
import { BookOpen, FileText, Music, Video, Trash2, Upload } from "lucide-react";

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  clases_restantes: number;
  divisa: string;
}

interface RecursoAdmin {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  tipo: string;
}

interface RecursosTabProps {
  recursos: RecursoAdmin[];
  alumnos: Alumno[];
  recursosAsignaciones: any[];
  nuevoRecurso: { titulo: string; descripcion: string; nivel: string; tipo: string };
  setNuevoRecurso: (val: any) => void;
  recExito: boolean;
  alumnosSeleccionadosRecurso: string[];
  setAlumnosSeleccionadosRecurso: (ids: string[]) => void;
  archivoSeleccionado: File | null;
  setArchivoSeleccionado: (file: File | null) => void;
  crearRecurso: (e: React.FormEvent) => Promise<void>;
  eliminarRecurso: (id: number) => Promise<void>;
}

export default function RecursosTab({
  recursos,
  alumnos,
  recursosAsignaciones,
  nuevoRecurso,
  setNuevoRecurso,
  recExito,
  alumnosSeleccionadosRecurso,
  setAlumnosSeleccionadosRecurso,
  archivoSeleccionado,
  setArchivoSeleccionado,
  crearRecurso,
  eliminarRecurso
}: RecursosTabProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "start" }}>
      {/* Listado de Recursos en Biblioteca */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen size={20} className="text-[#3b82f6] shrink-0" /> Biblioteca Multimedia de Recursos
        </h3>

        {recursos.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
            Aún no has subido materiales didácticos a tu biblioteca.
          </p>
        ) : (
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Recurso / Formato</th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Nivel Recomendado</th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Alumnos Compartidos</th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recursos.map((rec) => {
                  const asignaciones = recursosAsignaciones.filter(a => a.recurso_id === rec.id);
                  return (
                    <tr key={rec.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "16px", fontSize: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>
                            {rec.tipo === "pdf" ? <FileText size={18} className="text-blue-500" /> : rec.tipo === "audio" ? <Music size={18} className="text-purple-500" /> : <Video size={18} className="text-red-500" />}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700 }}>{rec.titulo}</div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{rec.descripcion}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "rgba(201, 154, 60, 0.08)",
                          color: "hsl(var(--accent-hsl))",
                          border: "1px solid rgba(201, 154, 60, 0.15)"
                        }}>
                          {rec.nivel}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontSize: "13px" }}>
                        {asignaciones.length === 0 ? (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Privado (0 alumnos)</span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {asignaciones.map(asig => {
                              const alumno = alumnos.find(al => al.id === asig.usuario_id);
                              return (
                                <span key={asig.usuario_id} style={{
                                  fontSize: "11px",
                                  backgroundColor: "#f1f5f9",
                                  color: "var(--text-muted)",
                                  padding: "2px 6px",
                                  borderRadius: "4px"
                                }}>
                                  {alumno ? alumno.nombre : "Estudiante"}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar el recurso "${rec.titulo}"?`)) {
                              eliminarRecurso(rec.id);
                            }
                          }}
                          className="btn btn-outline"
                          style={{ padding: "6px 12px", fontSize: "11px", borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Trash2 size={12} /> Eliminar</div>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agregar Recurso Nuevo */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Upload size={20} className="text-[#3b82f6] shrink-0" /> Subir Nuevo Recurso Didáctico
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
          Sube guías PDF, grabaciones de audio o videos explicativos directamente a Supabase Storage y compártelos con tus alumnos.
        </p>

        {recExito && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
            ✓ Recurso subido y asignado a los alumnos correspondientes de forma exitosa.
          </div>
        )}

        <form onSubmit={crearRecurso} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Título del Recurso</label>
            <input
              type="text"
              className="form-control"
              value={nuevoRecurso.titulo}
              onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, titulo: e.target.value })}
              placeholder="Ej: Guía de Pronunciación Francesa A1"
              style={{ padding: "10px 14px" }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Nivel Recomendado</label>
              <select
                className="form-control"
                value={nuevoRecurso.nivel}
                onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, nivel: e.target.value })}
                style={{ padding: "10px 14px" }}
              >
                <option value="Todos">Todos los niveles</option>
                <option value="A1">Principiante (A1)</option>
                <option value="A2">Elemental (A2)</option>
                <option value="B1">Intermedio (B1)</option>
                <option value="B2">Intermedio Alto (B2)</option>
                <option value="C1">Avanzado (C1)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Formato del Recurso</label>
              <select
                className="form-control"
                value={nuevoRecurso.tipo}
                onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, tipo: e.target.value })}
                style={{ padding: "10px 14px" }}
              >
                <option value="pdf">Documento PDF</option>
                <option value="audio">Audio (MP3 / WAV)</option>
                <option value="video">Enlace de Video (Youtube / Vimeo / Drive)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={nuevoRecurso.descripcion}
              onChange={(e) => setNuevoRecurso({ ...nuevoRecurso, descripcion: e.target.value })}
              placeholder="Ej: Ejercicios interactivos con soluciones sobre fonética..."
              style={{ padding: "10px 14px" }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {nuevoRecurso.tipo === "video" ? "Enlace de Video (URL)" : "Seleccionar Archivo (Límite 10MB)"}
            </label>
            {nuevoRecurso.tipo === "video" ? (
              <input
                type="url"
                className="form-control"
                name="enlaceVideo"
                id="enlaceVideo"
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ padding: "10px 14px" }}
                required
              />
            ) : (
              <input
                type="file"
                className="form-control"
                onChange={(e) => setArchivoSeleccionado(e.target.files ? e.target.files[0] : null)}
                accept={nuevoRecurso.tipo === "pdf" ? ".pdf" : nuevoRecurso.tipo === "audio" ? "audio/*" : "video/*"}
                style={{ padding: "8px 12px" }}
                required
              />
            )}
          </div>

          {/* Compartir inmediatamente con alumnos */}
          <div className="form-group">
            <label className="form-label">Compartir de inmediato con Alumnos:</label>
            <div style={{
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {alumnos.length === 0 ? (
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  No hay alumnos disponibles para compartir.
                </span>
              ) : (
                alumnos.map(al => {
                  const isChecked = alumnosSeleccionadosRecurso.includes(al.id);
                  return (
                    <label key={al.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setAlumnosSeleccionadosRecurso(alumnosSeleccionadosRecurso.filter(id => id !== al.id));
                          } else {
                            setAlumnosSeleccionadosRecurso([...alumnosSeleccionadosRecurso, al.id]);
                          }
                        }}
                      />
                      <span>{al.nombre} ({al.email})</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Subir a Biblioteca y Compartir
          </button>
        </form>
      </div>
    </div>
  );
}
