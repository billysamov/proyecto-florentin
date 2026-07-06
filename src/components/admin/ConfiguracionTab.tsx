import React from "react";

interface ConfiguracionTabProps {
  config: any;
  setConfig: (val: any) => void;
  configExito: boolean;
  configError?: string;
  guardarConfiguracion: (e: React.FormEvent) => Promise<void>;
  subTabCMS: "general" | "profesor" | "metodo" | "destino" | "negocio";
  setSubTabCMS: (tab: "general" | "profesor" | "metodo" | "destino" | "negocio") => void;
}

export default function ConfiguracionTab({
  config,
  setConfig,
  configExito,
  configError,
  guardarConfiguracion,
  subTabCMS,
  setSubTabCMS
}: ConfiguracionTabProps) {
  const subTabs = [
    { id: "general", label: "General y SEO" },
    { id: "profesor", label: "Perfil Profesor" },
    { id: "metodo", label: "Método de Aprendizaje" },
    { id: "destino", label: "Para Quién y CTA" },
    { id: "negocio", label: "Límites y Horarios" }
  ];

  const zonasHorarias = [
    { value: "Europe/Paris", label: "París, Francia (CET/CEST)" },
    { value: "Europe/Madrid", label: "Madrid, España (CET/CEST)" },
    { value: "America/Lima", label: "Lima, Perú (PET - UTC-5)" },
    { value: "America/Bogota", label: "Bogotá, Colombia (COT - UTC-5)" },
    { value: "America/Mexico_City", label: "Ciudad de México (CST - UTC-6)" },
    { value: "America/Santiago", label: "Santiago, Chile (CLT - UTC-4)" },
    { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires, Argentina (ART - UTC-3)" },
    { value: "America/Caracas", label: "Caracas, Venezuela (VET - UTC-4)" },
    { value: "America/New_York", label: "Nueva York, EE.UU. (EST/EDT)" },
    { value: "America/Guayaquil", label: "Quito, Ecuador (ECT - UTC-5)" },
    { value: "America/La_Paz", label: "La Paz, Bolivia (BOT - UTC-4)" },
    { value: "America/Montevideo", label: "Montevideo, Uruguay (UYT - UTC-3)" },
    { value: "America/Asuncion", label: "Asunción, Paraguay (PYT - UTC-4)" },
  ];

  const diasSemana = [
    { id: 1, label: "Lunes", abr: "Lun" },
    { id: 2, label: "Martes", abr: "Mar" },
    { id: 3, label: "Miércoles", abr: "Mié" },
    { id: 4, label: "Jueves", abr: "Jue" },
    { id: 5, label: "Viernes", abr: "Vie" },
    { id: 6, label: "Sábado", abr: "Sáb" },
    { id: 0, label: "Domingo", abr: "Dom" }
  ];

  // Determinar los días laborables actuales parseados de forma segura
  let diasActivos: number[] = [];
  try {
    diasActivos = JSON.parse(config.dias_laborables || "[1,2,3,4,5]");
  } catch (e) {
    if (typeof config.dias_laborables === "string") {
      diasActivos = config.dias_laborables
        .replace(/[\[\]]/g, "")
        .split(",")
        .map(Number)
        .filter((n: number) => !isNaN(n));
    } else {
      diasActivos = [1,2,3,4,5];
    }
  }

  const handleToggleDia = (diaId: number) => {
    let nuevosDias: number[];
    if (diasActivos.includes(diaId)) {
      if (diasActivos.length <= 1) {
        alert("Debes mantener al menos 1 día laboral abierto.");
        return;
      }
      nuevosDias = diasActivos.filter(d => d !== diaId);
    } else {
      nuevosDias = [...diasActivos, diaId];
    }
    
    // Ordenar de forma secuencial lógica 1, 2, 3, 4, 5, 6, 0
    nuevosDias.sort((a, b) => {
      if (a === 0) return 1;
      if (b === 0) return -1;
      return a - b;
    });

    setConfig({ ...config, dias_laborables: JSON.stringify(nuevosDias) });
  };

  const tzValue = config.zona_horaria || "Europe/Paris";
  const esZonaComun = zonasHorarias.some(z => z.value === tzValue);

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
        ⚙️ Configuración del Negocio y Contenidos
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
        Gestiona las llaves de pasarela de pago, el SEO para Google y edita todos los textos de la Landing Page en tiempo real.
      </p>

      {/* Sub-pestañas de Configuración */}
      <div style={{
        display: "flex",
        gap: "8px",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "24px",
        overflowX: "auto",
        paddingBottom: "8px"
      }}>
        {subTabs.map(tab => {
          const isActive = subTabCMS === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTabCMS(tab.id as any)}
              className="btn"
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor: isActive ? "rgba(201, 154, 60, 0.08)" : "transparent",
                color: isActive ? "hsl(var(--accent-hsl))" : "var(--text-muted)",
                border: isActive ? "1px solid rgba(201, 154, 60, 0.15)" : "1px solid transparent",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {configExito && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(16,185,129,0.08)", color: "#10b981", borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(16,185,129,0.15)" }}>
          ✓ Configuración guardada correctamente en la base de datos Supabase.
        </div>
      )}

      {configError && (
        <div style={{ padding: "16px", backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444", borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(239,68,68,0.15)" }}>
          <p style={{ fontWeight: 700, marginBottom: "8px" }}>❌ Error al guardar configuración en Supabase:</p>
          <code style={{ display: "block", backgroundColor: "rgba(0,0,0,0.05)", padding: "8px", borderRadius: "4px", marginBottom: "12px", fontSize: "12px" }}>{configError}</code>
          
          {(configError.includes("almuerzo_inicio") || configError.includes("almuerzo_fin")) && (
            <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(239,68,68,0.2)", paddingTop: "12px" }}>
              <p style={{ fontWeight: 600, color: "#b91c1c", marginBottom: "4px" }}>💡 Solución recomendada:</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>Faltan las columnas de almuerzo en tu base de datos de Supabase. Ejecuta este script en el SQL Editor de tu panel de Supabase:</p>
              <pre style={{ backgroundColor: "#1e293b", color: "#f8fafc", padding: "12px", borderRadius: "6px", fontSize: "11px", overflowX: "auto" }}>
{`ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS almuerzo_inicio TEXT DEFAULT '13:00';
ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS almuerzo_fin TEXT DEFAULT '14:00';`}
              </pre>
            </div>
          )}

          {configError.includes("enlace_meet_default") && (
            <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(239,68,68,0.2)", paddingTop: "12px" }}>
              <p style={{ fontWeight: 600, color: "#b91c1c", marginBottom: "4px" }}>💡 Solución recomendada:</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>Falta la columna para el enlace por defecto en tu base de datos de Supabase. Ejecuta este script en el SQL Editor de tu panel de Supabase:</p>
              <pre style={{ backgroundColor: "#1e293b", color: "#f8fafc", padding: "12px", borderRadius: "6px", fontSize: "11px", overflowX: "auto" }}>
{`ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS enlace_meet_default TEXT;`}
              </pre>
            </div>
          )}
        </div>
      )}

      <form onSubmit={guardarConfiguracion}>
        {/* Pestaña: General y SEO */}
        {subTabCMS === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Título Principal (Hero Banner)</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.titulo_hero}
                  onChange={(e) => setConfig({ ...config, titulo_hero: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Enlace de Clase por Defecto (Meet, Zoom, Teams, etc.)</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.enlace_meet_default || ""}
                  onChange={(e) => setConfig({ ...config, enlace_meet_default: e.target.value })}
                  placeholder="https://meet.google.com/... o https://zoom.us/j/..."
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subtítulo Descriptivo (Hero Banner)</label>
              <textarea
                className="form-control"
                rows={3}
                value={config.subtitulo_hero}
                onChange={(e) => setConfig({ ...config, subtitulo_hero: e.target.value })}
                style={{ padding: "16px", resize: "none" }}
              ></textarea>
            </div>

            <h4 style={{ fontSize: "15px", marginBottom: "8px", marginTop: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Posicionamiento en Google (SEO / Metadatos)
            </h4>

            <div className="form-group">
              <label className="form-label">Título SEO del Sitio (Meta Title)</label>
              <input
                className="form-control"
                type="text"
                value={config.meta_titulo}
                onChange={(e) => setConfig({ ...config, meta_titulo: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción Meta (Meta Description)</label>
              <textarea
                className="form-control"
                rows={2}
                value={config.meta_descripcion}
                onChange={(e) => setConfig({ ...config, meta_descripcion: e.target.value })}
                style={{ padding: "16px", resize: "none" }}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Palabras Clave (Keywords - Separadas por comas)</label>
              <input
                className="form-control"
                type="text"
                value={config.palabras_clave}
                onChange={(e) => setConfig({ ...config, palabras_clave: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <h4 style={{ fontSize: "15px", marginBottom: "8px", marginTop: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Códigos de Seguimiento e Integraciones
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Google Analytics ID</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.google_analytics_id}
                  onChange={(e) => setConfig({ ...config, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXX"
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meta Pixel ID</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.meta_pixel_id}
                  onChange={(e) => setConfig({ ...config, meta_pixel_id: e.target.value })}
                  placeholder="1234567890"
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stripe Public Key</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.stripe_public_key}
                  onChange={(e) => setConfig({ ...config, stripe_public_key: e.target.value })}
                  placeholder="pk_test_..."
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Perfil Profesor */}
        {subTabCMS === "profesor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Nombre del Profesor</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_name}
                  onChange={(e) => setConfig({ ...config, teacher_name: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Título Profesional</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_title}
                  onChange={(e) => setConfig({ ...config, teacher_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biografía Profesional (Sobre mí)</label>
              <textarea
                className="form-control"
                rows={4}
                value={config.teacher_bio}
                onChange={(e) => setConfig({ ...config, teacher_bio: e.target.value })}
                style={{ padding: "16px", resize: "none" }}
              ></textarea>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Años de Experiencia</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_experience}
                  onChange={(e) => setConfig({ ...config, teacher_experience: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número de Alumnos</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_students}
                  onChange={(e) => setConfig({ ...config, teacher_students: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Países de Alumnos</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_countries}
                  onChange={(e) => setConfig({ ...config, teacher_countries: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Habilidades (Separadas por comas)</label>
              <input
                className="form-control"
                type="text"
                value={config.teacher_skills}
                onChange={(e) => setConfig({ ...config, teacher_skills: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Certificaciones y Estudios (Separados por comas)</label>
              <input
                className="form-control"
                type="text"
                value={config.teacher_certs}
                onChange={(e) => setConfig({ ...config, teacher_certs: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>
          </div>
        )}

        {/* Pestaña: Método de Aprendizaje */}
        {subTabCMS === "metodo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Problema / Solución: Badge</label>
              <input
                className="form-control"
                type="text"
                value={config.ps_badge}
                onChange={(e) => setConfig({ ...config, ps_badge: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Problema / Solución: Título Principal</label>
              <input
                className="form-control"
                type="text"
                value={config.ps_title}
                onChange={(e) => setConfig({ ...config, ps_title: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 1: El Problema</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_prob_1_title}
                  onChange={(e) => setConfig({ ...config, ps_prob_1_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_prob_1_desc}
                  onChange={(e) => setConfig({ ...config, ps_prob_1_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 1: La Solución</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_sol_1_title}
                  onChange={(e) => setConfig({ ...config, ps_sol_1_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_sol_1_desc}
                  onChange={(e) => setConfig({ ...config, ps_sol_1_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 2: El Problema</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_prob_2_title}
                  onChange={(e) => setConfig({ ...config, ps_prob_2_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_prob_2_desc}
                  onChange={(e) => setConfig({ ...config, ps_prob_2_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 2: La Solución</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_sol_2_title}
                  onChange={(e) => setConfig({ ...config, ps_sol_2_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_sol_2_desc}
                  onChange={(e) => setConfig({ ...config, ps_sol_2_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", border: "1px solid var(--border-color)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 3: El Problema</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_prob_3_title}
                  onChange={(e) => setConfig({ ...config, ps_prob_3_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_prob_3_desc}
                  onChange={(e) => setConfig({ ...config, ps_prob_3_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
              <div>
                <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>Pilar 3: La Solución</h5>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_sol_3_title}
                  onChange={(e) => setConfig({ ...config, ps_sol_3_title: e.target.value })}
                  placeholder="Título"
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.ps_sol_3_desc}
                  onChange={(e) => setConfig({ ...config, ps_sol_3_desc: e.target.value })}
                  placeholder="Descripción"
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Para Quién y CTA */}
        {subTabCMS === "destino" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Para Quién: Badge</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_badge}
                  onChange={(e) => setConfig({ ...config, for_whom_badge: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Para Quién: Título Principal</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_title}
                  onChange={(e) => setConfig({ ...config, for_whom_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Perfil 1: Título y Desc</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_1_title}
                  onChange={(e) => setConfig({ ...config, for_whom_1_title: e.target.value })}
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.for_whom_1_desc}
                  onChange={(e) => setConfig({ ...config, for_whom_1_desc: e.target.value })}
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Perfil 2: Título y Desc</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_2_title}
                  onChange={(e) => setConfig({ ...config, for_whom_2_title: e.target.value })}
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.for_whom_2_desc}
                  onChange={(e) => setConfig({ ...config, for_whom_2_desc: e.target.value })}
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Perfil 3: Título y Desc</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_3_title}
                  onChange={(e) => setConfig({ ...config, for_whom_3_title: e.target.value })}
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.for_whom_3_desc}
                  onChange={(e) => setConfig({ ...config, for_whom_3_desc: e.target.value })}
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Perfil 4: Título y Desc</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_4_title}
                  onChange={(e) => setConfig({ ...config, for_whom_4_title: e.target.value })}
                  style={{ padding: "8px 12px", marginBottom: "8px" }}
                />
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.for_whom_4_desc}
                  onChange={(e) => setConfig({ ...config, for_whom_4_desc: e.target.value })}
                  style={{ padding: "8px 12px", resize: "none" }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: "15px", marginBottom: "8px", marginTop: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Llamados a la Acción Finales (CTA)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">CTA Badge</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_badge}
                  onChange={(e) => setConfig({ ...config, cta_badge: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Título Principal</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_title}
                  onChange={(e) => setConfig({ ...config, cta_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">CTA Subtítulo</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_subtitle}
                  onChange={(e) => setConfig({ ...config, cta_subtitle: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Texto del Botón CTA</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_btn_text}
                  onChange={(e) => setConfig({ ...config, cta_btn_text: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Límites y Horarios de Negocio */}
        {subTabCMS === "negocio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              
              {/* Zona Horaria */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  Zona Horaria del Servidor
                </label>
                <select
                  className="form-control"
                  value={esZonaComun ? tzValue : "otra"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "otra") {
                      setConfig({ ...config, zona_horaria: "" });
                    } else {
                      setConfig({ ...config, zona_horaria: val });
                    }
                  }}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", cursor: "pointer" }}
                >
                  {zonasHorarias.map(z => (
                    <option key={z.value} value={z.value}>{z.label}</option>
                  ))}
                  <option value="otra">Otra zona horaria (Escribir a mano)...</option>
                </select>

                {(!esZonaComun || tzValue === "") && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      className="form-control"
                      type="text"
                      value={config.zona_horaria}
                      onChange={(e) => setConfig({ ...config, zona_horaria: e.target.value })}
                      placeholder="Ej: Europe/London o Asia/Tokyo"
                      style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                    <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      Escribe la zona horaria en formato IANA (ej: America/Lima, Europe/Paris).
                    </small>
                  </div>
                )}
              </div>

              {/* Días Laborables Abiertos */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b", marginBottom: "4px", display: "block" }}>
                  Días Laborables Abiertos
                </label>
                <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 12px 0" }}>
                  Selecciona los días en los que impartes clases. Los alumnos solo verán espacios en estos días.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {diasSemana.map(dia => {
                    const estaActivo = diasActivos.includes(dia.id);
                    return (
                      <button
                        type="button"
                        key={dia.id}
                        onClick={() => handleToggleDia(dia.id)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "30px",
                          border: estaActivo ? "1.5px solid #0c1b33" : "1.5px solid #cbd5e1",
                          backgroundColor: estaActivo ? "#0c1b33" : "#ffffff",
                          color: estaActivo ? "#ffffff" : "#334155",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                          outline: "none"
                        }}
                        onMouseEnter={(e) => {
                          if (!estaActivo) {
                            e.currentTarget.style.backgroundColor = "#f1f5f9";
                            e.currentTarget.style.borderColor = "#94a3b8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!estaActivo) {
                            e.currentTarget.style.backgroundColor = "#ffffff";
                            e.currentTarget.style.borderColor = "#cbd5e1";
                          }
                        }}
                      >
                        {dia.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Horas de Inicio y Fin */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  Hora de Inicio Clases
                </label>
                <input
                  className="form-control"
                  type="time"
                  value={config.hora_inicio}
                  onChange={(e) => setConfig({ ...config, hora_inicio: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  Hora de Fin Clases
                </label>
                <input
                  className="form-control"
                  type="time"
                  value={config.hora_fin}
                  onChange={(e) => setConfig({ ...config, hora_fin: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}
                  required
                />
              </div>
            </div>

            {/* Horas de Almuerzo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "8px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  Inicio de Almuerzo (Bloqueo de clases)
                </label>
                <input
                  className="form-control"
                  type="time"
                  value={config.almuerzo_inicio || "13:00"}
                  onChange={(e) => setConfig({ ...config, almuerzo_inicio: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  Fin de Almuerzo (Bloqueo de clases)
                </label>
                <input
                  className="form-control"
                  type="time"
                  value={config.almuerzo_fin || "14:00"}
                  onChange={(e) => setConfig({ ...config, almuerzo_fin: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            marginTop: "24px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          💾 Guardar Configuración
        </button>
      </form>
    </div>
  );
}
