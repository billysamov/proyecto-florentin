import React from "react";

interface ConfiguracionTabProps {
  config: any;
  setConfig: (val: any) => void;
  configExito: boolean;
  guardarConfiguracion: (e: React.FormEvent) => Promise<void>;
  subTabCMS: "general" | "profesor" | "metodo" | "destino" | "negocio";
  setSubTabCMS: (tab: "general" | "profesor" | "metodo" | "destino" | "negocio") => void;
}

export default function ConfiguracionTab({
  config,
  setConfig,
  configExito,
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
                <label className="form-label">Google Meet Link por Defecto</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.enlace_meet_default || ""}
                  onChange={(e) => setConfig({ ...config, enlace_meet_default: e.target.value })}
                  placeholder="https://meet.google.com/..."
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Zona Horaria del Servidor</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.zona_horaria}
                  onChange={(e) => setConfig({ ...config, zona_horaria: e.target.value })}
                  placeholder="Ej: Europe/Madrid"
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Días Laborables Abiertos (Separados por comas - 0: Dom, 1: Lun...)</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.dias_laborables}
                  onChange={(e) => setConfig({ ...config, dias_laborables: e.target.value })}
                  placeholder="Ej: 1,2,3,4,5"
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Hora de Inicio Clases (Formato 24h - Ej: 08:00)</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.hora_inicio}
                  onChange={(e) => setConfig({ ...config, hora_inicio: e.target.value })}
                  placeholder="Ej: 08:00"
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora de Fin Clases (Formato 24h - Ej: 21:00)</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.hora_fin}
                  onChange={(e) => setConfig({ ...config, hora_fin: e.target.value })}
                  placeholder="Ej: 21:00"
                  style={{ padding: "12px 16px" }}
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
