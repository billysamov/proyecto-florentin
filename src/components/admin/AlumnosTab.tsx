import React from "react";
import { UserPlus, Users, FileText, Video, Edit, BookOpen, Trash2, Info } from "lucide-react";

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  clases_restantes: number;
  divisa: string;
}

interface ClaseAdmin {
  id: string;
  alumno: string;
  fecha: string;
  hora: string;
  estado: "programada" | "completada" | "cancelada";
  link: string;
  notes?: string;
  recording_url?: string;
}

interface RecursoAdmin {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  tipo: string;
}

interface AlumnosTabProps {
  alumnos: Alumno[];
  clases: ClaseAdmin[];
  recursos: RecursoAdmin[];
  recursosAsignaciones: any[];
  selectedAlumno: Alumno | null;
  setSelectedAlumno: (alumno: Alumno | null) => void;
  nuevoAlumno: { nombre: string; email: string; planId: number };
  setNuevoAlumno: (val: any) => void;
  alExito: boolean;
  alError: string;
  crearAlumnoManual: (e: React.FormEvent) => Promise<void>;
  editingClaseFeedbackId: string | null;
  setEditingClaseFeedbackId: (id: string | null) => void;
  feedbackNota: string;
  setFeedbackNota: (val: string) => void;
  feedbackGrabacion: string;
  setFeedbackGrabacion: (val: string) => void;
  guardarFeedbackClase: (claseId: string) => Promise<void>;
  toggleAsignacionRecurso: (recursoId: number, usuarioId: string, estaAsignado: boolean) => Promise<void>;
  eliminarAlumno: (id: string) => Promise<void>;
  limpiarAlumnosInactivos: () => Promise<void>;
  planes: any[];
  lang?: "es" | "fr";
}

export default function AlumnosTab({
  alumnos,
  clases,
  recursos,
  recursosAsignaciones,
  selectedAlumno,
  setSelectedAlumno,
  nuevoAlumno,
  setNuevoAlumno,
  alExito,
  alError,
  crearAlumnoManual,
  editingClaseFeedbackId,
  setEditingClaseFeedbackId,
  feedbackNota,
  setFeedbackNota,
  feedbackGrabacion,
  setFeedbackGrabacion,
  guardarFeedbackClase,
  toggleAsignacionRecurso,
  eliminarAlumno,
  limpiarAlumnosInactivos,
  planes,
  lang = "es"
}: AlumnosTabProps) {
  const isFr = lang === "fr";

  const t = {
    tituloRegistrar: isFr ? "Enregistrer un Élève Manuellement" : "Registrar Alumno Manualmente",
    descRegistrar: isFr ? "Inscrivez un élève et affectez-lui une formule de cours dans le système (par exemple, paiement hors ligne)." : "Inscribe un alumno y asígnale un plan de clases en el sistema (por ejemplo, si te pagó en efectivo o por fuera).",
    exitoRegistrar: isFr ? "✓ Élève enregistré et inscrit avec succès dans la base de données." : "✓ Alumno registrado e inscrito correctamente en la base de datos.",
    nombreCompleto: isFr ? "Nom Complet" : "Nombre Completo",
    correo: isFr ? "Adresse E-mail" : "Correo Electrónico",
    planInicial: isFr ? "Formule / Forfait Initial" : "Plan/Paquete Inicial",
    btnInscribir: isFr ? "Inscrire l'Élève" : "Inscribir Alumno",
    tituloExpedientes: isFr ? "Dossiers des Élèves Inscrits" : "Expedientes de Alumnos Inscritos",
    noAlumnos: isFr ? "Aucun élève enregistré pour le moment." : "Aún no tienes alumnos registrados en la base de datos.",
    thNombre: isFr ? "Nom" : "Nombre",
    thEmail: isFr ? "E-mail" : "Email",
    thPlan: isFr ? "Formule" : "Plan Inscrito",
    thSaldo: isFr ? "Solde de Cours" : "Saldo Clases",
    thAccion: isFr ? "Action" : "Acción",
    btnFicha: isFr ? "📂 Dossier" : "📂 Ficha",
    btnCerrar: isFr ? "📂 Fermer" : "📂 Cerrar",
    btnEliminar: isFr ? "Supprimer" : "Eliminar",
    btnLimpiarInactivos: isFr ? "Nettoyer inactifs" : "Limpiar inactivos",
    confirmEliminar: isFr ? "Voulez-vous vraiment supprimer cet élève ? Toutes ses données associées seront définitivement supprimées." : "¿Seguro que deseas eliminar a este estudiante? Se perderán permanentemente todas sus clases y tareas asignadas.",
    errorEliminarCompra: isFr ? "Impossible de supprimer cet élève car il a déjà acheté un plan." : "No se puede eliminar a este estudiante porque ya ha adquirido un plan.",
    lblClases: isFr ? "cours" : "clases",
    lblMoneda: isFr ? "Devise :" : "Moneda:",
    tituloFicha: isFr ? "Dossier :" : "Ficha:",
    descFicha: isFr ? "Dossier détaillé de l'élève. Ajoutez des comptes rendus (notes), associez des enregistrements vidéo et gérez ses ressources." : "Expediente detallado del alumno. Deja comentarios de retroalimentación de sus clases, asocia grabaciones en video y gestiona su biblioteca de recursos.",
    tituloFeedback: isFr ? "Commentaires & Cours Enregistrés" : "Retroalimentación y Clases Grabadas",
    noClases: isFr ? "L'élève n'a pas encore de cours enregistré." : "El alumno aún no tiene clases registradas.",
    lblNotasFeedback: isFr ? "Notes de Compte Rendu (Feedback)" : "Notas de Feedback",
    placeholderNota: isFr ? "Ex: Bon progrès. Aujourd'hui nous avons révisé..." : "Ej: Buen progreso. Hoy repasamos los verbos en pasado compuesto.",
    lblEnlaceGrabacion: isFr ? "Lien du Cours Enregistré (Drive, YouTube, etc.)" : "Enlace de la Clase Grabada (Drive, Youtube, etc)",
    btnCancelar: isFr ? "Annuler" : "Cancelar",
    btnGuardarCambios: isFr ? "Enregistrer" : "Guardar Cambios",
    sinComentarios: isFr ? "Aucun commentaire disponible." : "Sin comentarios registrados.",
    grabacionDisponible: isFr ? "Cours Enregistré disponible" : "Clase Grabada disponible",
    btnEditarNotas: isFr ? "Éditer les Notes & Enregistrement" : "Editar Notas y Grabación",
    tituloRecursos: isFr ? "Bibliothèque & Matériels Partagés" : "Biblioteca y Materiales Compartidos",
    descRecursos: isFr ? "Attribuez ou retirez des ressources multimédias pour que l'élève puisse y accéder." : "Asigna o retira recursos multimedia para que el alumno pueda visualizarlos y descargarlos desde su panel.",
    noRecursos: isFr ? "Aucune ressource créée dans la bibliothèque." : "No tienes recursos creados en la biblioteca.",
    btnCompartido: isFr ? "Partagé" : "Compartido",
    btnDesasignar: isFr ? "✕ Retirer" : "✕ Desasignar",
    btnCompartir: isFr ? "✓ Partager" : "✓ Compartir"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Crear Alumno Manual */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <UserPlus size={20} className="text-[#3b82f6] shrink-0" /> {t.tituloRegistrar}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
          {t.descRegistrar}
        </p>

        {alExito && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
            {t.exitoRegistrar}
          </div>
        )}
        {alError && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(239,68,68,0.15)" }}>
            ✗ {t.btnCancelar}: {alError}
          </div>
        )}

        <form onSubmit={crearAlumnoManual} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.nombreCompleto}</label>
            <input
              type="text"
              className="form-control"
              value={nuevoAlumno.nombre}
              onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
              placeholder="Ej: Marie Dubois"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.correo}</label>
            <input
              type="email"
              className="form-control"
              value={nuevoAlumno.email}
              onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, email: e.target.value })}
              placeholder="Ej: marie@example.com"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.planInicial}</label>
            <select
              className="form-control"
              value={nuevoAlumno.planId}
              onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, planId: parseInt(e.target.value) })}
              style={{ padding: "8px 12px" }}
            >
              {planes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.total_clases} {isFr ? "cours" : "clases"} - {p.precio}€)</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 16px" }}>
            {t.btnInscribir}
          </button>
        </form>
      </div>

      {/* Grid de Expediente y Lista */}
      <div style={{ display: "grid", gridTemplateColumns: selectedAlumno ? "1.2fr 1fr" : "1fr", gap: "32px", alignItems: "start" }}>
        
        {/* Listado de Alumnos */}
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <Users size={20} className="text-[#3b82f6] shrink-0" /> {t.tituloExpedientes}
            </h3>
            <button
              onClick={() => {
                if (window.confirm(lang === 'es' ? '¿Seguro que deseas eliminar automáticamente a todos los alumnos que se registraron hace más de 2 semanas y no han adquirido ningún plan?' : 'Voulez-vous vraiment supprimer tous les élèves inscrits il y a plus de 2 semaines sans formule active ?')) {
                  limpiarAlumnosInactivos();
                }
              }}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, cursor: "pointer" }}
            >
              <Trash2 size={14} className="text-[#ef4444]" />
              {t.btnLimpiarInactivos}
            </button>
          </div>

          {alumnos.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
              {t.noAlumnos}
            </p>
          ) : (
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thNombre}</th>
                    <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.correo}</th>
                    <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thPlan}</th>
                    <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thSaldo}</th>
                    <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>{t.thAccion}</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: selectedAlumno?.id === a.id ? "rgba(201, 154, 60, 0.05)" : "transparent" }}>
                      <td style={{ padding: "16px", fontSize: "14px", fontWeight: 600 }}>{a.nombre}</td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "var(--text-muted)" }}>{a.email}</td>
                      <td style={{ padding: "16px", fontSize: "14px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: a.plan === "Sin plan activo" ? "#f1f5f9" : "rgba(201, 154, 60, 0.08)",
                          color: a.plan === "Sin plan activo" ? "var(--text-muted)" : "hsl(var(--accent-hsl))",
                          border: a.plan === "Sin plan activo" ? "none" : "1px solid rgba(201, 154, 60, 0.15)"
                        }}>
                          {a.plan === "Sin plan activo" && isFr ? "Aucune formule active" : a.plan}
                        </span>
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 700, color: a.clases_restantes > 0 ? "hsl(var(--accent-hsl))" : "var(--text-muted)" }}>
                            {a.clases_restantes} {t.lblClases}
                          </span>
                          <div style={{ fontSize: "11px", color: a.divisa === "USD" ? "#10b981" : "#3b82f6", fontWeight: 700 }}>
                            {t.lblMoneda} {a.divisa}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => setSelectedAlumno(selectedAlumno?.id === a.id ? null : a)}
                            className="btn"
                            style={{
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: 700,
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: selectedAlumno?.id === a.id ? "hsl(var(--accent-hsl))" : "hsl(var(--primary-hsl))",
                              color: selectedAlumno?.id === a.id ? "#000" : "#fff",
                              border: "none",
                              cursor: "pointer"
                            }}
                          >
                            {selectedAlumno?.id === a.id ? t.btnCerrar : t.btnFicha}
                          </button>
                          
                          <button
                            onClick={async () => {
                              const tienePlanes = a.plan !== "Sin plan activo" && a.plan !== "Aucune formule active";
                              if (tienePlanes) {
                                alert(t.errorEliminarCompra);
                                return;
                              }
                              if (window.confirm(t.confirmEliminar)) {
                                await eliminarAlumno(a.id);
                              }
                            }}
                            className="btn btn-secondary"
                            style={{
                              padding: "6px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border-color)",
                              backgroundColor: "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: a.plan !== "Sin plan activo" && a.plan !== "Aucune formule active" ? 0.3 : 1,
                              cursor: a.plan !== "Sin plan activo" && a.plan !== "Aucune formule active" ? "not-allowed" : "pointer"
                            }}
                            title={a.plan !== "Sin plan activo" && a.plan !== "Aucune formule active" ? t.errorEliminarCompra : t.btnEliminar}
                          >
                            <Trash2 size={16} className="text-[#ef4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ficha del Alumno Seleccionado */}
        {selectedAlumno && (
          <div className="card" style={{ padding: "28px", border: "1px solid hsl(var(--accent-hsl))", position: "sticky", top: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                {t.tituloFicha} {selectedAlumno.nombre}
              </h3>
              <button
                onClick={() => setSelectedAlumno(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
              {t.descFicha}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Sección 1: Clases y Grabaciones */}
              <div>
                <h4 style={{ fontSize: "14px", color: "hsl(var(--accent-hsl))", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <FileText size={16} className="text-[#3b82f6] shrink-0" style={{ display: "inline-flex", verticalAlign: "middle", marginRight: "6px" }} /> {t.tituloFeedback}
                </h4>

                {clases.filter(c => c.alumno === selectedAlumno.nombre).length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                    {t.noClases}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {clases
                      .filter(c => c.alumno === selectedAlumno.nombre)
                      .map(c => {
                        const isEditing = editingClaseFeedbackId === c.id;
                        return (
                          <div key={c.id} style={{
                            padding: "12px",
                            backgroundColor: "var(--bg-main)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            fontSize: "13px"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 600 }}>
                              <span>{c.fecha} - {c.hora} hs</span>
                              <span style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                textTransform: "uppercase",
                                backgroundColor: c.estado === "completada" ? "rgba(16, 185, 129, 0.08)" : c.estado === "cancelada" ? "rgba(239, 68, 68, 0.08)" : "rgba(249, 115, 22, 0.08)",
                                color: c.estado === "completada" ? "#10b981" : c.estado === "cancelada" ? "#ef4444" : "#f97316"
                              }}>
                                {c.estado === "completada" ? (isFr ? "complété" : "completada") : c.estado === "cancelada" ? (isFr ? "annulé" : "cancelada") : (isFr ? "programmé" : "programada")}
                              </span>
                            </div>

                            {isEditing ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>{t.lblNotasFeedback}</label>
                                  <textarea
                                    className="form-control"
                                    rows={2}
                                    value={feedbackNota}
                                    onChange={(e) => setFeedbackNota(e.target.value)}
                                    placeholder={t.placeholderNota}
                                    style={{ padding: "8px", fontSize: "12px", resize: "none" }}
                                  />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>{t.lblEnlaceGrabacion}</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={feedbackGrabacion}
                                    onChange={(e) => setFeedbackGrabacion(e.target.value)}
                                    placeholder="Ej: https://drive.google.com/file/..."
                                    style={{ padding: "8px", fontSize: "12px" }}
                                  />
                                </div>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                  <button
                                    onClick={() => setEditingClaseFeedbackId(null)}
                                    className="btn btn-outline"
                                    style={{ padding: "4px 8px", fontSize: "11px" }}
                                  >
                                    {t.btnCancelar}
                                  </button>
                                  <button
                                    onClick={() => guardarFeedbackClase(c.id)}
                                    className="btn btn-primary"
                                    style={{ padding: "4px 12px", fontSize: "11px" }}
                                  >
                                    {t.btnGuardarCambios}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ fontSize: "12px", color: "var(--text-main)", fontStyle: "italic" }}>
                                  "{c.notes || t.sinComentarios}"
                                </div>
                                {c.recording_url && (
                                  <div style={{ marginTop: "4px" }}>
                                    <a
                                      href={c.recording_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: "hsl(var(--accent-hsl))", fontSize: "11px", textDecoration: "none", fontWeight: 700 }}
                                    >
                                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Video size={14} className="text-[#ef4444]" /> {t.grabacionDisponible}</div>
                                    </a>
                                  </div>
                                )}
                                {c.estado === "completada" && (
                                  <button
                                    onClick={() => {
                                      setEditingClaseFeedbackId(c.id);
                                      setFeedbackNota(c.notes || "");
                                      setFeedbackGrabacion(c.recording_url || "");
                                    }}
                                    className="btn btn-outline"
                                    style={{
                                      padding: "4px 8px",
                                      fontSize: "11px",
                                      marginTop: "8px",
                                      alignSelf: "flex-start",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      color: "hsl(var(--accent-hsl))",
                                      borderColor: "rgba(201, 154, 60, 0.2)"
                                    }}
                                  >
                                      <Edit size={12} /> {t.btnEditarNotas}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Sección 2: Biblioteca de Recursos Asignados */}
              <div>
                <h4 style={{ fontSize: "14px", color: "hsl(var(--accent-hsl))", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <BookOpen size={16} className="text-[#3b82f6] shrink-0" style={{ display: "inline-flex", verticalAlign: "middle", marginRight: "6px" }} /> {t.tituloRecursos}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                  {t.descRecursos}
                </p>

                {recursos.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                    {t.noRecursos}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {recursos.map(rec => {
                      const estaAsignado = recursosAsignaciones.some(
                        asig => asig.recurso_id === rec.id && asig.usuario_id === selectedAlumno.id
                      );

                      return (
                        <div key={rec.id} style={{
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "var(--bg-main)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "13px"
                        }}>
                          <div>
                            <span style={{ fontWeight: 600 }}>{rec.titulo}</span>
                            <span style={{
                              marginLeft: "8px",
                              fontSize: "10px",
                              padding: "2px 4px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(201, 154, 60, 0.08)",
                              color: "hsl(var(--accent-hsl))"
                            }}>
                              {rec.nivel}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleAsignacionRecurso(rec.id, selectedAlumno.id, estaAsignado)}
                            className="btn"
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: 700,
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: estaAsignado ? "rgba(239, 68, 68, 0.08)" : "rgba(16, 185, 129, 0.08)",
                              color: estaAsignado ? "#ef4444" : "#10b981",
                              border: estaAsignado ? "1px solid rgba(239, 68, 68, 0.15)" : "1px solid rgba(16, 185, 129, 0.15)",
                              cursor: "pointer"
                            }}
                          >
                            {estaAsignado ? t.btnDesasignar : t.btnCompartir}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
