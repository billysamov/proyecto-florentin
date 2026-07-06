import React from "react";

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
  eliminarPlan
}: PlanesTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Crear Plan Nuevo */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          💎 Registrar Nuevo Plan / Suscripción
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
          Define un nuevo paquete de clases o suscripción mensual para comercializar en la Landing Page.
        </p>

        {planExito && (
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
            ✓ Plan registrado correctamente en la base de datos.
          </div>
        )}

        <form onSubmit={crearPlan} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>Nombre del Plan</label>
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
            <label className="form-label" style={{ fontSize: "12px" }}>Precio (€ en base de datos)</label>
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
            <label className="form-label" style={{ fontSize: "12px" }}>Total de Clases del Plan</label>
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
            <label className="form-label" style={{ fontSize: "12px" }}>Tipo de Plan</label>
            <select
              className="form-control"
              value={nuevoPlan.tipo}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, tipo: e.target.value })}
              style={{ padding: "8px 12px" }}
            >
              <option value="paquete">Paquete de Clases</option>
              <option value="suscripcion">Suscripción Mensual</option>
              <option value="clase_individual">Clase Individual</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>Nivel Recomendado</label>
            <select
              className="form-control"
              value={nuevoPlan.nivel}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, nivel: e.target.value })}
              style={{ padding: "8px 12px" }}
            >
              <option value="Todos">Todos los niveles</option>
              <option value="A1">Principiante (A1)</option>
              <option value="A2">Elemental (A2)</option>
              <option value="B1">Intermedio (B1)</option>
              <option value="B2">Intermedio Alto (B2)</option>
              <option value="C1">Avanzado (C1)</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
            <label className="form-label" style={{ fontSize: "12px" }}>Breve Descripción (Aparece en la Landing)</label>
            <input
              type="text"
              className="form-control"
              value={nuevoPlan.descripcion}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, descripcion: e.target.value })}
              placeholder="Ej: Acceso a clases personalizadas con soporte vía WhatsApp..."
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 16px" }}>
            Crear Plan
          </button>
        </form>
      </div>

      {/* Listado de Planes */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          💎 Oferta de Planes y Suscripciones
        </h3>
        
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Detalles del Plan</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Tipo de Cobro</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Clases / Nivel</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>Precio</th>
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textAlign: "right" }}>Acciones</th>
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
                        {p.tipo === "suscripcion" ? "Mensual" : p.tipo === "clase_individual" ? "Individual" : "Paquete"}
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
                            <option value="Todos">Todos</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.totalClases} clases</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Nivel: {p.nivel}</div>
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
                            ✓ Guardar
                          </button>
                          <button
                            onClick={() => setEditingPlanId(null)}
                            className="btn btn-outline"
                            style={{ padding: "4px 10px", fontSize: "11px" }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => toggleEstadoPlan(p.id)}
                            className="btn"
                            style={{
                              padding: "4px 10px",
                              fontSize: "11px",
                              backgroundColor: p.activo ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                              color: p.activo ? "#10b981" : "#ef4444",
                              border: p.activo ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(239,68,68,0.15)"
                            }}
                          >
                            ● {p.activo ? "Activo" : "Pausado"}
                          </button>
                          <button
                            onClick={() => setEditingPlanId(p.id)}
                            className="btn btn-outline"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            title="Editar Plan"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("¿Estás seguro de eliminar este plan?")) {
                                eliminarPlan(p.id);
                              }
                            }}
                            className="btn btn-outline"
                            style={{ padding: "4px 8px", fontSize: "11px", borderColor: "rgba(239,68,68,0.2)", color: "#ef4444" }}
                            title="Eliminar Plan"
                          >
                            🗑️
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
