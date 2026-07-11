import React from "react";
import { Shield, Edit, Trash2 } from "lucide-react";

interface PlanesTabProps {
  planes: any[];
  nuevoPlan: { nombre: string; descripcion: string; precio: number; totalClases: number; tipo: string; nivel: string };
  setNuevoPlan: (val: any) => void;
  planExito: boolean;
  editingPlanId: number | null;
  setEditingPlanId: (id: number | null) => void;
  crearPlan: (e: React.FormEvent) => Promise<void>;
  guardarEdicionPlan: (id: number, fields: any) => Promise<void>;
  toggleEstadoPlan: (id: number) => Promise<void>;
  eliminarPlan: (id: number) => Promise<void>;
  lang?: "es" | "fr";
}

export default function PlanesTab({
  planes,
  nuevoPlan,
  setNuevoPlan,
  planExito,
  editingPlanId,
  setEditingPlanId,
  crearPlan,
  guardarEdicionPlan,
  toggleEstadoPlan,
  eliminarPlan,
  lang = "es"
}: PlanesTabProps) {
  const isFr = lang === "fr";

  const t = {
    tituloRegistrar: isFr ? "Enregistrer une Nouvelle Formule / Abonnement" : "Registrar Nuevo Plan / Suscripción",
    descRegistrar: isFr ? "Définissez un nouveau forfait de cours ou un abonnement mensuel à commercialiser sur la Landing Page." : "Define un nuevo paquete de clases o suscripción mensual para comercializar en la Landing Page.",
    exitoRegistrar: isFr ? "✓ Formule enregistrée avec succès dans la base de données." : "✓ Plan registrado correctamente en la base de datos.",
    nombrePlan: isFr ? "Nom de la Formule" : "Nombre del Plan",
    precioPlan: isFr ? "Prix (€ dans la base de données)" : "Precio (€ en base de datos)",
    totalClases: isFr ? "Nombre Total de Cours" : "Total de Clases del Plan",
    tipoPlan: isFr ? "Type de Formule" : "Tipo de Plan",
    optPaquete: isFr ? "Forfait de Cours" : "Paquete de Clases",
    optSuscripcion: isFr ? "Abonnement Mensuel" : "Suscripción Mensual",
    optIndividual: isFr ? "Cours Individuel" : "Clase Individual",
    nivelRecomendado: isFr ? "Niveau Recommandé" : "Nivel Recomendado",
    nivelTodos: isFr ? "Tous les niveaux" : "Todos los niveles",
    nivelA1: isFr ? "Débutant (A1)" : "Principiante (A1)",
    nivelA2: isFr ? "Élémentaire (A2)" : "Elemental (A2)",
    nivelB1: isFr ? "Intermédiaire (B1)" : "Intermedio (B1)",
    nivelB2: isFr ? "Intermédiaire Supérieur (B2)" : "Intermedio Alto (B2)",
    nivelC1: isFr ? "Avancé (C1)" : "Avanzado (C1)",
    descPlan: isFr ? "Brève Description (Affichée sur le site)" : "Breve Descripción (Aparece en la Landing)",
    btnCrear: isFr ? "Créer la Formule" : "Crear Plan",
    tituloCatalogo: isFr ? "💎 Offre de Formules et Abonnements" : "💎 Oferta de Planes y Suscripciones",
    thDetalles: isFr ? "Détails de la Formule" : "Detalles del Plan",
    thTipo: isFr ? "Type de Facturation" : "Tipo de Cobro",
    thClasesNivel: isFr ? "Cours / Niveau" : "Clases / Nivel",
    thPrecio: isFr ? "Prix" : "Precio",
    thAcciones: isFr ? "Actions" : "Acciones",
    lblMensual: isFr ? "Mensuel" : "Mensual",
    lblIndividual: isFr ? "Individuel" : "Individual",
    lblPaquete: isFr ? "Forfait" : "Paquete",
    lblClases: isFr ? "cours" : "clases",
    lblNivel: isFr ? "Niveau :" : "Nivel:",
    btnGuardar: isFr ? "Enregistrer" : "Guardar",
    btnCancelar: isFr ? "Annuler" : "Cancelar",
    activo: isFr ? "Actif" : "Activo",
    desactivar: isFr ? "Désactiver" : "Desactivar",
    activar: isFr ? "Activer" : "Activar",
    eliminarConfirm: isFr ? "Voulez-vous vraiment supprimer cette formule ?" : "¿Seguro que deseas eliminar este plan?"
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm(t.eliminarConfirm)) {
      await eliminarPlan(id);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Crear Plan Nuevo */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield size={20} className="text-[#3b82f6] shrink-0" /> {t.tituloRegistrar}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
          {t.descRegistrar}
        </p>

        {planExito && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
            {t.exitoRegistrar}
          </div>
        )}

        <form onSubmit={crearPlan} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.nombrePlan}</label>
            <input
              type="text"
              className="form-control"
              value={nuevoPlan.nombre}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, nombre: e.target.value })}
              placeholder="Ej: Plan Pro"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.precioPlan}</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={nuevoPlan.precio}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, precio: parseFloat(e.target.value) })}
              placeholder="Ej: 79"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.totalClases}</label>
            <input
              type="number"
              className="form-control"
              value={nuevoPlan.totalClases}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, totalClases: parseInt(e.target.value) })}
              placeholder="Ej: 8"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.tipoPlan}</label>
            <select
              className="form-control"
              value={nuevoPlan.tipo}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, tipo: e.target.value })}
              style={{ padding: "8px 12px" }}
            >
              <option value="paquete">{t.optPaquete}</option>
              <option value="suscripcion">{t.optSuscripcion}</option>
              <option value="clase_individual">{t.optIndividual}</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.nivelRecomendado}</label>
            <select
              className="form-control"
              value={nuevoPlan.nivel}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, nivel: e.target.value })}
              style={{ padding: "8px 12px" }}
            >
              <option value="Todos">{t.nivelTodos}</option>
              <option value="A1">{t.nivelA1}</option>
              <option value="A2">{t.nivelA2}</option>
              <option value="B1">{t.nivelB1}</option>
              <option value="B2">{t.nivelB2}</option>
              <option value="C1">{t.nivelC1}</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.descPlan}</label>
            <input
              type="text"
              className="form-control"
              value={nuevoPlan.descripcion}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, descripcion: e.target.value })}
              placeholder="Ej: Acceso a clases..."
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 16px" }}>
            {t.btnCrear}
          </button>
        </form>
      </div>

      {/* Listado de Planes */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          {t.tituloCatalogo}
        </h3>
        
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thDetalles}</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thTipo}</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thClasesNivel}</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thPrecio}</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>{t.thAcciones}</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((p) => {
                const isEditing = editingPlanId === p.id;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <input
                            type="text"
                            defaultValue={p.nombre}
                            id={`edit-plan-nombre-${p.id}`}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          />
                          <input
                            type="text"
                            defaultValue={p.descripcion}
                            id={`edit-plan-desc-${p.id}`}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          />
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.nombre}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{p.descripcion}</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: p.tipo === "suscripcion" ? "rgba(201, 154, 60, 0.08)" : p.tipo === "clase_individual" ? "#f1f5f9" : "rgba(59, 130, 246, 0.08)",
                        color: p.tipo === "suscripcion" ? "hsl(var(--accent-hsl))" : p.tipo === "clase_individual" ? "var(--text-muted)" : "#3b82f6",
                        border: p.tipo === "suscripcion" ? "1px solid rgba(201, 154, 60, 0.15)" : p.tipo === "clase_individual" ? "1px solid #e2e8f0" : "1px solid rgba(59, 130, 246, 0.15)"
                      }}>
                        {p.tipo === "suscripcion" ? t.lblMensual : p.tipo === "clase_individual" ? t.lblIndividual : t.lblPaquete}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="number"
                            defaultValue={p.totalClases}
                            id={`edit-plan-clases-${p.id}`}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "12px", width: "70px" }}
                          />
                          <select
                            defaultValue={p.nivel}
                            id={`edit-plan-nivel-${p.id}`}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          >
                            <option value="Todos">{t.nivelTodos}</option>
                            <option value="A1">{t.nivelA1}</option>
                            <option value="A2">{t.nivelA2}</option>
                            <option value="B1">{t.nivelB1}</option>
                            <option value="B2">{t.nivelB2}</option>
                            <option value="C1">{t.nivelC1}</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.totalClases} {t.lblClases}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.lblNivel} {p.nivel}</div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: 700 }}>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={p.precio}
                          id={`edit-plan-precio-${p.id}`}
                          className="form-control"
                          style={{ padding: "4px 8px", fontSize: "12px", width: "80px" }}
                        />
                      ) : (
                        `${p.precio} EUR`
                      )}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      {isEditing ? (
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              const nombre = (document.getElementById(`edit-plan-nombre-${p.id}`) as HTMLInputElement).value;
                              const descripcion = (document.getElementById(`edit-plan-desc-${p.id}`) as HTMLInputElement).value;
                              const precio = parseFloat((document.getElementById(`edit-plan-precio-${p.id}`) as HTMLInputElement).value);
                              const totalClases = parseInt((document.getElementById(`edit-plan-clases-${p.id}`) as HTMLInputElement).value);
                              const nivel = (document.getElementById(`edit-plan-nivel-${p.id}`) as HTMLSelectElement).value;
                              guardarEdicionPlan(p.id, { nombre, descripcion, precio, total_clases: totalClases, nivel });
                            }}
                            className="btn btn-primary"
                            style={{ padding: "4px 10px", fontSize: "11px" }}
                          >
                            {t.btnGuardar}
                          </button>
                          <button
                            onClick={() => setEditingPlanId(null)}
                            className="btn btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "11px" }}
                          >
                            {t.btnCancelar}
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => toggleEstadoPlan(p.id)}
                            className={`btn ${p.activo ? 'btn-secondary' : 'btn-accent'}`}
                            style={{ padding: "4px 10px", fontSize: "11px" }}
                          >
                            {p.activo ? t.desactivar : t.activar}
                          </button>
                          <button
                            onClick={() => setEditingPlanId(p.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                            title={t.btnGuardar}
                          >
                            <Edit size={16} className="text-[#3b82f6]" />
                          </button>
                          <button
                            onClick={() => handleEliminar(p.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                            title="Eliminar"
                          >
                            <Trash2 size={16} className="text-[#ef4444]" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
