import React, { useState } from "react";
import { Shield, Edit, Trash2, Upload, Image as ImageIcon, Check, X, FolderPlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const BANCO_IMAGENES_DEFAULT = [
  { url: "/teacher_hero.png", titulo: "🎁 Clase de Prueba (Profesor)", tag: "Prueba" },
  { url: "/plan_pack_8.png", titulo: "📦 Pack de 8 Clases (Estudiante)", tag: "Pack 8" },
  { url: "/plan_intensive_3.png", titulo: "⚡ Intensivo 3 Clases/Semana (Laptop)", tag: "Intensivo" },
  { url: "/plan_libre.png", titulo: "🎫 Clase Libre (1 a 1 Auriculares)", tag: "Individual" },
  { url: "/plan_pack_4.png", titulo: "📚 Pack de 4 Clases (Estudio Libreta)", tag: "Pack 4" },
  { url: "/photo_preply.png", titulo: "💻 Plan Preply (Workspace)", tag: "Preply" },
  { url: "/photo_alexandra.png", titulo: "🎓 Plan Alexandra (Tutoría 1 a 1)", tag: "Personal" },
  { url: "/photo_eugenia.png", titulo: "📝 Plan Eugenia (Apuntes Francés)", tag: "Estudio" },
  { url: "/photo_erick.png", titulo: "🚀 Plan Erick (Sesión en Vivo)", tag: "Sesión" },
  { url: "/french_hero.png", titulo: "🇫🇷 Método / Conversación", tag: "Francés" }
];

interface PlanesTabProps {
  planes: any[];
  nuevoPlan: { 
    nombre: string; 
    descripcion: string; 
    precio: number; 
    totalClases: number; 
    tipo: string; 
    nivel: string; 
    orden: number;
    imagen_url?: string;
    badge?: string;
    duracion?: string;
    caracteristicas?: string;
  };
  setNuevoPlan: (val: any) => void;
  planExito: boolean;
  editingPlanId: number | null;
  setEditingPlanId: (id: number | null) => void;
  crearPlan: (e: React.FormEvent) => Promise<void>;
  guardarEdicionPlan: (id: number, fields: any) => Promise<void>;
  toggleEstadoPlan: (id: number) => Promise<void>;
  toggleRecomendadoPlan: (id: number, isRecomendado: boolean) => Promise<void>;
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
  toggleRecomendadoPlan,
  eliminarPlan,
  lang = "es"
}: PlanesTabProps) {
  const isFr = lang === "fr";

  const [bancoImagenes, setBancoImagenes] = useState(BANCO_IMAGENES_DEFAULT);
  const [modalGaleriaAbierto, setModalGaleriaAbierto] = useState(false);
  const [galeriaTargetPlanId, setGaleriaTargetPlanId] = useState<number | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const handleSubirImagen = async (e: React.ChangeEvent<HTMLInputElement>, targetPlanId: number | null = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSubiendoImagen(true);
      const ext = file.name.split('.').pop();
      const fileName = `plan_img_${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("recursos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        alert("Error al subir imagen: " + uploadError.message);
        setSubiendoImagen(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("recursos")
        .getPublicUrl(fileName);

      // Agregar a la galería del banco
      const nuevaImg = { url: publicUrl, titulo: file.name, tag: "Subida" };
      setBancoImagenes(prev => [nuevaImg, ...prev]);

      if (targetPlanId !== null) {
        const inputImg = document.getElementById(`edit-plan-img-${targetPlanId}`) as HTMLInputElement;
        const previewImg = document.getElementById(`edit-plan-img-preview-${targetPlanId}`) as HTMLImageElement;
        if (inputImg) inputImg.value = publicUrl;
        if (previewImg) previewImg.src = publicUrl;
      } else {
        setNuevoPlan({ ...nuevoPlan, imagen_url: publicUrl });
      }

      setSubiendoImagen(false);
      alert("✓ Imagen subida con éxito.");
    } catch (err: any) {
      alert("Error inesperado: " + err.message);
      setSubiendoImagen(false);
    }
  };

  const seleccionarDeBanco = (url: string) => {
    if (galeriaTargetPlanId !== null) {
      const inputImg = document.getElementById(`edit-plan-img-${galeriaTargetPlanId}`) as HTMLInputElement;
      const previewImg = document.getElementById(`edit-plan-img-preview-${galeriaTargetPlanId}`) as HTMLImageElement;
      if (inputImg) inputImg.value = url;
      if (previewImg) previewImg.src = url;
    } else {
      setNuevoPlan({ ...nuevoPlan, imagen_url: url });
    }
    setModalGaleriaAbierto(false);
  };

  const t = {
    tituloRegistrar: isFr ? "Enregistrer une Nouvelle Formule / Abonnement" : "Registrar Nuevo Plan / Suscripción",
    descRegistrar: isFr ? "Définissez un nouveau forfait de cours ou un abonnement mensuel à commercialiser sur la Landing Page." : "Define un nuevo paquete de clases o suscripción mensual para comercializar en la Landing Page.",
    exitoRegistrar: isFr ? "✓ Formule enregistrée avec succès dans la base de données." : "✓ Plan registrado correctamente en la base de datos.",
    nombrePlan: isFr ? "Nom de la Formule" : "Nombre del Plan",
    precioPlan: isFr ? "Prix (€ dans la base de données)" : "Precio (€ en base de datos)",
    totalClases: isFr ? "Nombre Total de Cours" : "Total de Clases del Plan",
    tipoPlan: isFr ? "Type de Formule" : "Tipo de Plan",
    orden: isFr ? "Ordre d'affichage" : "Orden de visualización",
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
    thOrden: isFr ? "Ordre" : "Orden",
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
    marcarRecomendado: isFr ? "Marquer comme recommandé" : "Marcar como Recomendado",
    quitarRecomendado: isFr ? "Retirer la recommandation" : "Quitar Recomendado",
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
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, totalClases: parseInt(e.target.value) || 0 })}
              placeholder="Ej: 8"
              style={{ padding: "8px 12px" }}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>{t.orden}</label>
            <input
              type="number"
              className="form-control"
              value={nuevoPlan.orden}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, orden: parseInt(e.target.value) || 0 })}
              placeholder="Ej: 0"
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
              <option value="clase_gratis">🎁 Clase de Prueba Gratuita (WhatsApp)</option>
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
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>Insignia / Badge</label>
            <input
              type="text"
              className="form-control"
              value={nuevoPlan.badge || "Flexible"}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, badge: e.target.value })}
              placeholder="Ej: Más Popular, Flexible, Avanzado"
              style={{ padding: "8px 12px" }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "12px" }}>Duración / Ritmo</label>
            <input
              type="text"
              className="form-control"
              value={nuevoPlan.duracion || "4 Semanas"}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, duracion: e.target.value })}
              placeholder="Ej: 4 Semanas, 1 Hora, 3 Meses"
              style={{ padding: "8px 12px" }}
            />
          </div>
          <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
            <label className="form-label" style={{ fontSize: "12px" }}>🖼️ Imagen del Plan (Selección o Subida)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <img 
                src={nuevoPlan.imagen_url || "/french_hero.png"} 
                alt="Vista previa" 
                style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", border: "1px solid #cbd5e1" }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>
                  {bancoImagenes.find(b => b.url === nuevoPlan.imagen_url)?.titulo || "Imagen Seleccionada"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "240px" }}>
                  {nuevoPlan.imagen_url || "/french_hero.png"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => { setGaleriaTargetPlanId(null); setModalGaleriaAbierto(true); }}
                  style={{ padding: "6px 12px", backgroundColor: "#0055a5", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <ImageIcon size={14} /> Banco de Fotos
                </button>

                <label style={{ padding: "6px 12px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", margin: 0 }}>
                  {subiendoImagen ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {subiendoImagen ? "Subiendo..." : "Subir de mi PC"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSubirImagen(e, null)}
                    style={{ display: "none" }}
                    disabled={subiendoImagen}
                  />
                </label>
              </div>
            </div>
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
          <div className="form-group" style={{ margin: 0, gridColumn: "span 2" }}>
            <label className="form-label" style={{ fontSize: "12px" }}>✨ Qué incluye cada plan (1 beneficio por línea)</label>
            <textarea
              className="form-control"
              rows={3}
              value={nuevoPlan.caracteristicas || ""}
              onChange={(e) => setNuevoPlan({ ...nuevoPlan, caracteristicas: e.target.value })}
              placeholder={"✓ Clases particulares en vivo\n✓ Material interactivo en PDF incluido\n✓ Atención personalizada 1 a 1"}
              style={{ padding: "8px 12px", fontSize: "12px" }}
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
                <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>{t.thOrden}</th>
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
                            defaultValue={p.badge || "Flexible"}
                            id={`edit-plan-badge-${p.id}`}
                            className="form-control"
                            placeholder="Badge (ej: Más Popular)"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          />
                          <input
                            type="text"
                            defaultValue={p.duracion || "4 Semanas"}
                            id={`edit-plan-duracion-${p.id}`}
                            className="form-control"
                            placeholder="Duración (ej: 4 Semanas)"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                            <img 
                              id={`edit-plan-img-preview-${p.id}`}
                              src={p.imagen_url || "/french_hero.png"} 
                              alt="preview" 
                              style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", border: "1px solid #cbd5e1" }} 
                            />
                            <input
                              type="hidden"
                              defaultValue={p.imagen_url || "/french_hero.png"}
                              id={`edit-plan-img-${p.id}`}
                            />
                            <button
                              type="button"
                              onClick={() => { setGaleriaTargetPlanId(p.id); setModalGaleriaAbierto(true); }}
                              style={{ padding: "4px 8px", backgroundColor: "#0055a5", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <ImageIcon size={12} /> Galería
                            </button>
                            <label style={{ padding: "4px 8px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
                              <Upload size={12} /> Subir
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSubirImagen(e, p.id)}
                                style={{ display: "none" }}
                              />
                            </label>
                          </div>
                          <textarea
                            defaultValue={p.caracteristicas || ""}
                            id={`edit-plan-caract-${p.id}`}
                            className="form-control"
                            rows={2}
                            placeholder="Beneficios (1 por línea)"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          />
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img src={p.imagen_url || "/french_hero.png"} alt={p.nombre} style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{p.nombre} <span style={{ fontSize: "10px", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "10px" }}>{p.badge || "Flexible"}</span></div>
                              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{p.descripcion}</div>
                            </div>
                          </div>
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
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      {isEditing ? (
                        <input
                          type="number"
                          defaultValue={p.orden || 0}
                          id={`edit-plan-orden-${p.id}`}
                          className="form-control"
                          style={{ padding: "4px 8px", fontSize: "12px", width: "60px" }}
                        />
                      ) : (
                        p.orden || 0
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
                              const orden = parseInt((document.getElementById(`edit-plan-orden-${p.id}`) as HTMLInputElement).value) || 0;
                              const badge = (document.getElementById(`edit-plan-badge-${p.id}`) as HTMLInputElement).value;
                              const duracion = (document.getElementById(`edit-plan-duracion-${p.id}`) as HTMLInputElement).value;
                              const imagen_url = (document.getElementById(`edit-plan-img-${p.id}`) as HTMLInputElement).value;
                              const caracteristicas = (document.getElementById(`edit-plan-caract-${p.id}`) as HTMLTextAreaElement).value;
                              guardarEdicionPlan(p.id, { nombre, descripcion, precio, total_clases: totalClases, nivel, orden, badge, duracion, imagen_url, caracteristicas });
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
                            onClick={() => toggleRecomendadoPlan(p.id, !p.recomendado)}
                            title={p.recomendado ? t.quitarRecomendado : t.marcarRecomendado}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "18px", lineHeight: 1 }}
                          >
                            {p.recomendado ? '⭐' : '☆'}
                          </button>
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

      {/* 🖼️ MODAL BANCO DE IMÁGENES */}
      {modalGaleriaAbierto && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", maxWidth: "750px", width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", padding: "24px", border: "1px solid #e2e8f0" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ImageIcon size={20} className="text-[#0055a5]" /> Banco de Imágenes de la Academia
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                  Haz clic en cualquier imagen para seleccionarla o sube una nueva desde tu computadora.
                </p>
              </div>
              <button onClick={() => setModalGaleriaAbierto(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            {/* Subida rápida desde PC dentro del Modal */}
            <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Subir nueva imagen propia</div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Formatos permitidos: PNG, JPG, WEBP, SVG</div>
              </div>
              <label style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "#ffffff", borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                {subiendoImagen ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {subiendoImagen ? "Subiendo..." : "Subir desde PC"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSubirImagen(e, galeriaTargetPlanId)}
                  style={{ display: "none" }}
                  disabled={subiendoImagen}
                />
              </label>
            </div>

            {/* Grilla de Tarjetas de Imágenes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {bancoImagenes.map((imgItem, idx) => {
                const isSelected = galeriaTargetPlanId === null 
                  ? nuevoPlan.imagen_url === imgItem.url 
                  : (document.getElementById(`edit-plan-img-${galeriaTargetPlanId}`) as HTMLInputElement)?.value === imgItem.url;

                return (
                  <div 
                    key={idx} 
                    onClick={() => seleccionarDeBanco(imgItem.url)}
                    style={{ 
                      borderRadius: "16px", 
                      border: isSelected ? "2px solid #0055a5" : "1px solid #e2e8f0", 
                      overflow: "hidden", 
                      backgroundColor: "#ffffff", 
                      cursor: "pointer", 
                      transition: "all 0.2s shadow",
                      position: "relative"
                    }}
                    className="hover:shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <div style={{ position: "relative", height: "130px", width: "100%", backgroundColor: "#f1f5f9" }}>
                      <img src={imgItem.url} alt={imgItem.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: 800, color: "#0f172a" }}>
                        {imgItem.tag}
                      </span>
                      {isSelected && (
                        <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#0055a5", color: "#ffffff", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={14} />
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {imgItem.titulo}
                      </div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {imgItem.url}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
