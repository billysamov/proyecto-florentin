import React, { useState } from "react";
import {
  UserPlus, Users, FileText, Video, Edit, BookOpen, Trash2,
  X, Mail, Calendar, Award, BarChart2, Clock, CheckCircle, XCircle, AlertCircle,
  BookMarked, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react";

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  nivel_frances?: string;
  zona_horaria?: string;
  plan: string;
  clases_restantes: number;
  divisa: string;
  totalClases?: number;
  ultimoPago?: string;
  monto?: number;
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
  const [fichaTab, setFichaTab] = useState<"resumen" | "clases" | "recursos">("resumen");

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
    btnFicha: isFr ? "Ver Dossier" : "Ver Perfil",
    btnCerrar: isFr ? "Fermer" : "Cerrar",
    btnEliminar: isFr ? "Supprimer" : "Eliminar",
    btnLimpiarInactivos: isFr ? "Nettoyer inactifs" : "Limpiar inactivos",
    confirmEliminar: isFr ? "Voulez-vous vraiment supprimer cet élève ? Toutes ses données associées seront définitivement supprimées." : "¿Seguro que deseas eliminar a este estudiante? Se perderán permanentemente todas sus clases y tareas asignadas.",
    errorEliminarCompra: isFr ? "Impossible de supprimer cet élève car il a déjà acheté un plan." : "No se puede eliminar a este estudiante porque ya ha adquirido un plan.",
    lblClases: isFr ? "cours" : "clases",
    lblMoneda: isFr ? "Devise :" : "Moneda:",
    tituloFicha: isFr ? "Dossier Élève" : "Perfil del Alumno",
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
    btnCompartir: isFr ? "✓ Partager" : "✓ Compartir",
    tabResumen: isFr ? "Resumen" : "Resumen",
    tabClases: isFr ? "Clases" : "Clases",
    tabRecursos: isFr ? "Recursos" : "Recursos",
    sinPlan: isFr ? "Aucune formule active" : "Sin plan activo",
    progreso: isFr ? "Progreso del Plan" : "Progreso del Plan",
    clasesCompleted: isFr ? "Clases tomadas" : "Clases tomadas",
    clasesRestantes: isFr ? "Clases restantes" : "Clases restantes",
    inversion: isFr ? "Inversión Total" : "Inversión Total",
    miembro: isFr ? "Miembro desde" : "Miembro desde",
    contacto: isFr ? "Contacto Directo" : "Contacto Directo",
    enviarEmail: isFr ? "Enviar E-mail" : "Enviar Correo",
    estadoEstudiante: isFr ? "Estado del Estudiante" : "Estado del Estudiante",
    activo: isFr ? "Activo" : "Activo",
    inactivo: isFr ? "Sin suscripción" : "Sin suscripción",
  };

  // Calcular estadísticas del alumno seleccionado
  const getAlumnoStats = (alumno: Alumno) => {
    const clasesAlumno = clases.filter(c => c.alumno === alumno.nombre);
    const completadas = clasesAlumno.filter(c => c.estado === "completada").length;
    const canceladas = clasesAlumno.filter(c => c.estado === "cancelada").length;
    const programadas = clasesAlumno.filter(c => c.estado === "programada").length;
    const totalClases = alumno.totalClases || 0;
    const clasesRestantes = alumno.clases_restantes || 0;
    const clasesTomadas = completadas > 0 ? completadas : Math.max(0, totalClases - clasesRestantes);
    const progresoPct = totalClases > 0 ? Math.round((clasesTomadas / totalClases) * 100) : 0;
    const recursosAsig = recursosAsignaciones.filter(a => a.usuario_id === alumno.id).length;
    return { completadas, canceladas, programadas, clasesTomadas, progresoPct, recursosAsig, clasesAlumno };
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
            ✗ {alError}
          </div>
        )}

        <form onSubmit={crearAlumnoManual} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.nombreCompleto}</label>
            <input type="text" className="form-control" value={nuevoAlumno.nombre} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })} placeholder="Ej: Marie Dubois" style={{ padding: "8px 12px" }} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.correo}</label>
            <input type="email" className="form-control" value={nuevoAlumno.email} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, email: e.target.value })} placeholder="Ej: marie@example.com" style={{ padding: "8px 12px" }} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.planInicial}</label>
            <select className="form-control" value={nuevoAlumno.planId} onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, planId: parseInt(e.target.value) })} style={{ padding: "8px 12px" }}>
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

      {/* Tabla de Alumnos */}
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
            style={{ padding: "6px 12px", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}
          >
            <Trash2 size={14} className="text-[#ef4444]" /> {t.btnLimpiarInactivos}
          </button>
        </div>

        {alumnos.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>{t.noAlumnos}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                {alumnos.map((a) => {
                  const stats = getAlumnoStats(a);
                  const tienePlan = a.plan !== "Sin plan activo" && a.plan !== "Aucune formule active";
                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.15s" }}>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: "14px"
                          }}>
                            {a.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{a.nombre}</div>
                            {stats.completadas > 0 && (
                              <div style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
                                {stats.completadas} {t.lblClases} ✓
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{a.email}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                          backgroundColor: tienePlan ? "rgba(59, 130, 246, 0.08)" : "#f1f5f9",
                          color: tienePlan ? "#3b82f6" : "var(--text-muted)",
                          border: tienePlan ? "1px solid rgba(59, 130, 246, 0.2)" : "none"
                        }}>
                          {a.plan === "Sin plan activo" && isFr ? t.sinPlan : a.plan}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                        {tienePlan ? (
                          <div>
                            <div style={{ fontWeight: 700, color: a.clases_restantes > 0 ? "#3b82f6" : "var(--text-muted)" }}>
                              {a.clases_restantes} {t.lblClases}
                            </div>
                            {(a.totalClases || 0) > 0 && (
                              <div style={{ marginTop: "4px", height: "4px", backgroundColor: "var(--border-color)", borderRadius: "2px", width: "80px" }}>
                                <div style={{
                                  height: "100%", borderRadius: "2px",
                                  width: `${Math.round(((a.totalClases! - a.clases_restantes) / a.totalClases!) * 100)}%`,
                                  background: "linear-gradient(to right, #3b82f6, #6366f1)"
                                }} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => { setSelectedAlumno(a); setFichaTab("resumen"); }}
                            className="btn btn-primary"
                            style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 700, borderRadius: "20px" }}
                          >
                            {t.btnFicha}
                          </button>
                          <button
                            onClick={async () => {
                              if (tienePlan) { alert(t.errorEliminarCompra); return; }
                              if (window.confirm(t.confirmEliminar)) await eliminarAlumno(a.id);
                            }}
                            style={{
                              padding: "6px", border: "1px solid var(--border-color)", backgroundColor: "transparent",
                              borderRadius: "var(--radius-sm)", cursor: tienePlan ? "not-allowed" : "pointer",
                              opacity: tienePlan ? 0.3 : 1, display: "flex", alignItems: "center"
                            }}
                            title={tienePlan ? t.errorEliminarCompra : t.btnEliminar}
                          >
                            <Trash2 size={15} className="text-[#ef4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== MODAL PERFIL DEL ALUMNO ===== */}
      {selectedAlumno && (() => {
        const stats = getAlumnoStats(selectedAlumno);
        const tienePlan = selectedAlumno.plan !== "Sin plan activo" && selectedAlumno.plan !== "Aucune formule active";
        const recursosAsig = recursosAsignaciones.filter(a => a.usuario_id === selectedAlumno.id).length;

        return (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "20px"
          }}>
            <div className="card" style={{
              width: "100%", maxWidth: "820px", maxHeight: "92vh", overflowY: "auto",
              display: "flex", flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
            }}>
              {/* Header del Perfil */}
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)",
                padding: "28px 32px", borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  {/* Avatar grande */}
                  <div style={{
                    width: "68px", height: "68px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: "28px",
                    border: "3px solid rgba(255,255,255,0.2)"
                  }}>
                    {selectedAlumno.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px 0" }}>
                      {selectedAlumno.nombre}
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
                      <Mail size={13} />
                      {selectedAlumno.email}
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                        backgroundColor: tienePlan ? "rgba(59, 130, 246, 0.25)" : "rgba(255,255,255,0.1)",
                        color: tienePlan ? "#93c5fd" : "rgba(255,255,255,0.5)",
                        border: tienePlan ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.15)"
                      }}>
                        {tienePlan ? (selectedAlumno.plan === "Sin plan activo" && isFr ? t.sinPlan : selectedAlumno.plan) : t.sinPlan}
                      </span>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                        backgroundColor: tienePlan ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)",
                        color: tienePlan ? "#6ee7b7" : "rgba(255,255,255,0.4)",
                        border: tienePlan ? "1px solid rgba(16,185,129,0.3)" : "none"
                      }}>
                        {tienePlan ? "● " + t.activo : "○ " + t.inactivo}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedAlumno(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", color: "#fff" }}>
                  <X size={20} />
                </button>
              </div>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0", borderBottom: "1px solid var(--border-color)" }}>
                {[
                  { icon: <CheckCircle size={16} />, label: isFr ? "Clases tomadas" : "Clases tomadas", value: stats.clasesTomadas, color: "#10b981" },
                  { icon: <Clock size={16} />, label: isFr ? "Restantes" : "Restantes", value: selectedAlumno.clases_restantes, color: "#3b82f6" },
                  { icon: <XCircle size={16} />, label: isFr ? "Canceladas" : "Canceladas", value: stats.canceladas, color: "#ef4444" },
                  { icon: <BookMarked size={16} />, label: isFr ? "Recursos" : "Recursos", value: recursosAsig, color: "#8b5cf6" },
                  { icon: <Award size={16} />, label: isFr ? "Inversión" : "Inversión", value: `${selectedAlumno.monto || 0}${selectedAlumno.divisa === "USD" ? "$" : "€"}`, color: "#f59e0b" },
                ].map((kpi, i) => (
                  <div key={i} style={{ padding: "18px 16px", textAlign: "center", borderRight: i < 4 ? "1px solid var(--border-color)" : "none" }}>
                    <div style={{ color: kpi.color, display: "flex", justifyContent: "center", marginBottom: "6px" }}>{kpi.icon}</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>{kpi.value}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs de contenido */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", padding: "0 28px" }}>
                {(["resumen", "clases", "recursos"] as const).map(tab => (
                  <button key={tab} onClick={() => setFichaTab(tab)} style={{
                    padding: "14px 20px", fontSize: "13px", fontWeight: 700, background: "none", border: "none",
                    cursor: "pointer", color: fichaTab === tab ? "#3b82f6" : "var(--text-muted)",
                    borderBottom: fichaTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
                    transition: "all 0.15s", textTransform: "capitalize"
                  }}>
                    {tab === "resumen" ? t.tabResumen : tab === "clases" ? `${t.tabClases} (${stats.clasesAlumno.length})` : `${t.tabRecursos} (${recursosAsig}/${recursos.length})`}
                  </button>
                ))}
              </div>

              {/* Contenido de Tabs */}
              <div style={{ padding: "24px 28px", flexGrow: 1 }}>

                {/* TAB: RESUMEN */}
                {fichaTab === "resumen" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Progreso del plan */}
                    {tienePlan && (selectedAlumno.totalClases || 0) > 0 && (
                      <div style={{ padding: "18px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700 }}>
                            <BarChart2 size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle", color: "#3b82f6" }} />
                            {t.progreso}
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 800, color: "#3b82f6" }}>{stats.progresoPct}%</span>
                        </div>
                        <div style={{ height: "8px", backgroundColor: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: "4px",
                            width: `${stats.progresoPct}%`,
                            background: "linear-gradient(to right, #3b82f6, #6366f1)",
                            transition: "width 0.5s ease"
                          }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                          <span>{stats.clasesTomadas} {isFr ? "cours effectués" : "clases tomadas"}</span>
                          <span>{selectedAlumno.totalClases} {isFr ? "cours au total" : "clases en total"}</span>
                        </div>
                      </div>
                    )}

                    {/* Info de contacto y detalles */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                      {/* Email */}
                      <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                          <Mail size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                          {t.contacto}
                        </div>
                        <a href={`mailto:${selectedAlumno.email}`} style={{ color: "#3b82f6", textDecoration: "none", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", wordBreak: "break-all" }}>
                          {selectedAlumno.email}
                          <ExternalLink size={12} style={{ flexShrink: 0 }} />
                        </a>
                      </div>

                      {/* Teléfono */}
                      <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                          📱 {isFr ? "Téléphone" : "Teléfono"}
                        </div>
                        {selectedAlumno.telefono ? (
                          <a
                            href={`https://wa.me/${selectedAlumno.telefono.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#10b981", textDecoration: "none", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            {selectedAlumno.telefono}
                            <span style={{ fontSize: "10px", padding: "1px 6px", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "10px", color: "#10b981" }}>WhatsApp</span>
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>{isFr ? "Non renseigné" : "No registrado"}</span>
                        )}
                      </div>

                      {/* Nivel de Francés */}
                      {selectedAlumno.nivel_frances && (
                        <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                            🇫🇷 {isFr ? "Niveau" : "Nivel de Francés"}
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: "#6366f1" }}>{selectedAlumno.nivel_frances}</div>
                        </div>
                      )}

                      <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                          <Calendar size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                          {isFr ? "Dernière inscription" : "Último Pago"}
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{selectedAlumno.ultimoPago || "—"}</div>
                      </div>

                      <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                          <Award size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                          {t.inversion}
                        </div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "#f59e0b" }}>
                          {selectedAlumno.monto || 0} {selectedAlumno.divisa === "USD" ? "USD" : "EUR"}
                        </div>
                      </div>

                      {selectedAlumno.zona_horaria && (
                        <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                            🕐 {isFr ? "Fuseau Horaire" : "Zona Horaria"}
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: 600 }}>{selectedAlumno.zona_horaria}</div>
                        </div>
                      )}
                    </div>

                    {/* Última clase */}
                    {stats.clasesAlumno.length > 0 && (() => {
                      const ultimaClase = [...stats.clasesAlumno].reverse()[0];
                      return (
                        <div style={{ padding: "16px", backgroundColor: "var(--bg-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                            {isFr ? "Dernière Classe" : "Última Clase"}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                            <div style={{ fontSize: "14px", fontWeight: 600 }}>{ultimaClase.fecha} — {ultimaClase.hora} hs</div>
                            <span style={{
                              fontSize: "11px", padding: "3px 8px", borderRadius: "20px", fontWeight: 700,
                              backgroundColor: ultimaClase.estado === "completada" ? "rgba(16,185,129,0.1)" : ultimaClase.estado === "cancelada" ? "rgba(239,68,68,0.1)" : "rgba(249,115,22,0.1)",
                              color: ultimaClase.estado === "completada" ? "#10b981" : ultimaClase.estado === "cancelada" ? "#ef4444" : "#f97316"
                            }}>
                              {ultimaClase.estado}
                            </span>
                          </div>
                          {ultimaClase.notes && (
                            <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                              "{ultimaClase.notes}"
                            </div>
                          )}
                          <button onClick={() => setFichaTab("clases")} style={{ marginTop: "10px", background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "12px", fontWeight: 700, padding: 0 }}>
                            {isFr ? "Voir toutes les classes →" : "Ver todas las clases →"}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB: CLASES */}
                {fichaTab === "clases" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h4 style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 700, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      <FileText size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle", color: "#3b82f6" }} />
                      {t.tituloFeedback}
                    </h4>
                    {stats.clasesAlumno.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "30px 0" }}>{t.noClases}</p>
                    ) : (
                      stats.clasesAlumno.map(c => {
                        const isEditing = editingClaseFeedbackId === c.id;
                        return (
                          <div key={c.id} style={{
                            padding: "16px", backgroundColor: "var(--bg-light)",
                            border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                              <div style={{ fontWeight: 700, fontSize: "14px" }}>
                                <Calendar size={13} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle", color: "#3b82f6" }} />
                                {c.fecha} — {c.hora} hs
                              </div>
                              <span style={{
                                fontSize: "10px", padding: "3px 8px", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase",
                                backgroundColor: c.estado === "completada" ? "rgba(16,185,129,0.1)" : c.estado === "cancelada" ? "rgba(239,68,68,0.1)" : "rgba(249,115,22,0.1)",
                                color: c.estado === "completada" ? "#10b981" : c.estado === "cancelada" ? "#ef4444" : "#f97316"
                              }}>
                                {c.estado === "completada" ? (isFr ? "complété" : "completada") : c.estado === "cancelada" ? (isFr ? "annulé" : "cancelada") : (isFr ? "programmé" : "programada")}
                              </span>
                            </div>

                            {isEditing ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>{t.lblNotasFeedback}</label>
                                  <textarea className="form-control" rows={3} value={feedbackNota} onChange={(e) => setFeedbackNota(e.target.value)} placeholder={t.placeholderNota} style={{ padding: "8px", fontSize: "12px", resize: "vertical" }} />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>{t.lblEnlaceGrabacion}</label>
                                  <input type="text" className="form-control" value={feedbackGrabacion} onChange={(e) => setFeedbackGrabacion(e.target.value)} placeholder="Ej: https://drive.google.com/file/..." style={{ padding: "8px", fontSize: "12px" }} />
                                </div>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                  <button onClick={() => setEditingClaseFeedbackId(null)} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "12px" }}>{t.btnCancelar}</button>
                                  <button onClick={() => guardarFeedbackClase(c.id)} className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }}>{t.btnGuardarCambios}</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ fontSize: "13px", color: "var(--text-main)", fontStyle: "italic", backgroundColor: "var(--bg-main)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                                  "{c.notes || t.sinComentarios}"
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                  {c.recording_url && (
                                    <a href={c.recording_url} target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444", fontSize: "12px", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Video size={13} /> {t.grabacionDisponible}
                                    </a>
                                  )}
                                  {c.estado === "completada" && (
                                    <button onClick={() => { setEditingClaseFeedbackId(c.id); setFeedbackNota(c.notes || ""); setFeedbackGrabacion(c.recording_url || ""); }}
                                      style={{ background: "none", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Edit size={11} /> {t.btnEditarNotas}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB: RECURSOS */}
                {fichaTab === "recursos" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h4 style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 700, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      <BookOpen size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle", color: "#3b82f6" }} />
                      {t.tituloRecursos}
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 8px 0" }}>{t.descRecursos}</p>
                    {recursos.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "30px 0" }}>{t.noRecursos}</p>
                    ) : (
                      recursos.map(rec => {
                        const estaAsignado = recursosAsignaciones.some(asig => asig.recurso_id === rec.id && asig.usuario_id === selectedAlumno.id);
                        return (
                          <div key={rec.id} style={{
                            padding: "14px 16px", borderRadius: "var(--radius-sm)",
                            border: estaAsignado ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--border-color)",
                            backgroundColor: estaAsignado ? "rgba(16,185,129,0.02)" : "var(--bg-light)",
                            display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px"
                          }}>
                            <div>
                              <span style={{ fontWeight: 600 }}>{rec.titulo}</span>
                              <div style={{ marginTop: "3px", display: "flex", gap: "6px" }}>
                                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "10px", backgroundColor: "rgba(59,130,246,0.08)", color: "#3b82f6", fontWeight: 700 }}>{rec.nivel}</span>
                                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "10px", backgroundColor: "var(--border-color)", color: "var(--text-muted)", fontWeight: 600 }}>{rec.tipo}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleAsignacionRecurso(rec.id, selectedAlumno.id, estaAsignado)}
                              style={{
                                padding: "6px 12px", fontSize: "12px", fontWeight: 700, borderRadius: "20px", cursor: "pointer",
                                backgroundColor: estaAsignado ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                                color: estaAsignado ? "#ef4444" : "#10b981",
                                border: estaAsignado ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(16,185,129,0.2)"
                              }}
                            >
                              {estaAsignado ? t.btnDesasignar : t.btnCompartir}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Footer del modal */}
              <div style={{ padding: "16px 28px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <a href={`mailto:${selectedAlumno.email}`} className="btn btn-secondary" style={{ fontSize: "13px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={14} /> {t.enviarEmail}
                </a>
                <button onClick={() => setSelectedAlumno(null)} className="btn btn-primary" style={{ padding: "8px 24px", fontSize: "13px", fontWeight: 700 }}>
                  {t.btnCerrar}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
