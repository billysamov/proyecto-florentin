import React from "react";
import { Settings } from "lucide-react";

interface ConfiguracionTabProps {
  config: any;
  setConfig: (val: any) => void;
  configExito: boolean;
  configError?: string;
  guardarConfiguracion: (e: React.FormEvent) => Promise<void>;
  subTabCMS: "general" | "profesor" | "metodo" | "destino" | "negocio";
  setSubTabCMS: (tab: "general" | "profesor" | "metodo" | "destino" | "negocio") => void;
  lang?: "es" | "fr";
}

export default function ConfiguracionTab({
  config,
  setConfig,
  configExito,
  configError,
  guardarConfiguracion,
  subTabCMS,
  setSubTabCMS,
  lang = "es"
}: ConfiguracionTabProps) {
  const isFr = lang === "fr";

  const subTabs = [
    { id: "general", label: isFr ? "Général & SEO" : "General y SEO" },
    { id: "profesor", label: isFr ? "Profil Enseignant" : "Perfil Profesor" },
    { id: "metodo", label: isFr ? "Méthode d'Apprentissage" : "Método de Aprendizaje" },
    { id: "destino", label: isFr ? "Pour Qui & CTA" : "Para Quién y CTA" },
    { id: "negocio", label: isFr ? "Limites & Horaires" : "Límites y Horarios" }
  ];

  const t = {
    tituloHeader: isFr ? "Configuration du Site et Contenu" : "Configuración del Negocio y Contenidos",
    descHeader: isFr ? "Gérez les clés de paiement, le SEO Google et modifiez tous les textes de la Landing Page en temps réel." : "Gestiona las llaves de pasarela de pago, el SEO para Google y edita todos los textos de la Landing Page en tiempo real.",
    guardadoExito: isFr ? "✓ Configuration enregistrée avec succès dans la base de données Supabase." : "✓ Configuración guardada correctamente en la base de datos Supabase.",
    guardarBtn: isFr ? "💾 Enregistrer la Configuration" : "💾 Guardar Configuración",
    solucionRecomendada: isFr ? "Solution recommandée :" : "Solución recomendada:",
    ejecutaScript: isFr ? "Exécutez ce script dans l'éditeur SQL de votre panneau Supabase :" : "Ejecuta este script en el SQL Editor de tu panel de Supabase:",
    // SubTab General y SEO
    tituloHero: isFr ? "Titre Principal (Hero Banner)" : "Título Principal (Hero Banner)",
    enlaceMeet: isFr ? "Lien du cours par défaut (Meet, Zoom, etc.)" : "Enlace de Clase por Defecto (Meet, Zoom, Teams, etc.)",
    subtituloHero: isFr ? "Sous-titre descriptif (Hero Banner)" : "Subtítulo Descriptivo (Hero Banner)",
    tagHero: isFr ? "Badge / Tag du Hero Banner (ex: Professeur Natif de Paris)" : "Etiqueta / Tag del Hero Banner (ej: Profesor Nativo de París)",
    seoGoogle: isFr ? "Référencement Google (SEO / Métadonnées)" : "Posicionamiento en Google (SEO / Metadatos)",
    metaTitulo: isFr ? "Titre SEO du site (Meta Title)" : "Título SEO del Sitio (Meta Title)",
    metaDesc: isFr ? "Description Meta (Meta Description)" : "Descripción Meta (Meta Description)",
    metaKeywords: isFr ? "Mots-clés (Keywords - Séparés par des virgules)" : "Palabras Clave (Keywords - Separadas por comas)",
    integraciones: isFr ? "Codes de suivi & Intégrations" : "Códigos de Seguimiento e Integraciones",
    stripePublicKey: isFr ? "Clé publique Stripe (Stripe Public Key)" : "Stripe Public Key",
    stripeSecretKey: isFr ? "Clé secrète Stripe (Stripe Secret Key)" : "Stripe Secret Key",
    // SubTab Profesor
    nombreProfesor: isFr ? "Nom de l'enseignant" : "Nombre del Profesor",
    tituloProfesor: isFr ? "Titre professionnel" : "Título Profesional",
    bioProfesor: isFr ? "Biographie professionnelle (À propos de moi)" : "Biografía Profesional (Sobre mí)",
    experienciaProfesor: isFr ? "Années d'expérience" : "Años de Experiencia",
    alumnosProfesor: isFr ? "Nombre d'élèves" : "Número de Alumnos",
    paisesProfesor: isFr ? "Pays des élèves" : "Países de Alumnos",
    skillsProfesor: isFr ? "Compétences (Séparées por des virgules)" : "Habilidades (Separadas por comas)",
    certsProfesor: isFr ? "Certifications & Diplômes (Séparés par des virgules)" : "Certificaciones y Estudios (Separados por comas)",
    // SubTab Metodo
    seccionMetodo: isFr ? "Section Pourquoi Florentin (Méthode de vente)" : "Sección ¿Por qué Florentin? (Método de venta)",
    badgeMetodo: isFr ? "Badge de la section" : "Badge de la sección",
    tituloSeccionMetodo: isFr ? "Titre de la section" : "Título de la sección",
    prob1Titulo: isFr ? "Problème 1 : Titre" : "Problema 1: Título",
    prob1Desc: isFr ? "Problème 1 : Description" : "Problema 1: Descripción",
    sol1Titulo: isFr ? "Solution 1 : Titre" : "Solución 1: Título",
    sol1Desc: isFr ? "Solution 1 : Description" : "Solución 1: Descripción",
    prob2Titulo: isFr ? "Problème 2 : Titre" : "Problema 2: Título",
    prob2Desc: isFr ? "Problème 2 : Description" : "Problema 2: Descripción",
    sol2Titulo: isFr ? "Solution 2 : Titre" : "Solución 2: Título",
    sol2Desc: isFr ? "Solution 2 : Description" : "Solución 2: Descripción",
    prob3Titulo: isFr ? "Problème 3 : Titre" : "Problema 3: Título",
    prob3Desc: isFr ? "Problème 3 : Description" : "Problema 3: Descripción",
    sol3Titulo: isFr ? "Solution 3 : Titre" : "Solución 3: Título",
    sol3Desc: isFr ? "Solution 3 : Description" : "Solution 3 : Description",
    // SubTab Destino y CTA
    seccionDestino: isFr ? "Section Pour Qui (Public cible de la Landing)" : "Sección Para Quién (Destinatarios de la Landing)",
    destBadge: isFr ? "Badge de la section" : "Badge de la sección",
    destTitulo: isFr ? "Titre de la section" : "Título de la sección",
    dest1Titulo: isFr ? "Cible 1 : Titre" : "Destinatario 1: Título",
    dest1Desc: isFr ? "Cible 1 : Description" : "Destinatario 1: Descripción",
    dest2Titulo: isFr ? "Cible 2 : Titre" : "Destinatario 2: Título",
    dest2Desc: isFr ? "Cible 2 : Description" : "Destinatario 2: Descripción",
    dest3Titulo: isFr ? "Cible 3 : Titre" : "Destinatario 3: Título",
    dest3Desc: isFr ? "Cible 3 : Description" : "Destinatario 3: Descripción",
    dest4Titulo: isFr ? "Cible 4 : Titre" : "Destinatario 4: Título",
    dest4Desc: isFr ? "Cible 4 : Description" : "Destinatario 4: Descripción",
    seccionCta: isFr ? "Section CTA (Bouton WhatsApp Final)" : "Sección CTA (Botón de WhatsApp final)",
    ctaBadge: isFr ? "Badge du CTA" : "Badge del CTA",
    ctaTitulo: isFr ? "Titre principal du CTA" : "Título principal del CTA",
    ctaSubtitulo: isFr ? "Sous-titre explicatif du CTA" : "Subtítulo explicativo del CTA",
    ctaBotonText: isFr ? "Texte du bouton WhatsApp" : "Texto del botón de WhatsApp",
    // SubTab Negocio
    negocioConfig: isFr ? "Configuration des Réservations & Fuseau horaire" : "Configuración de Horarios de Reserva",
    diasLaborales: isFr ? "Jours de travail (Actifs pour la planification)" : "Días Laborales (Abiertos para agendar)",
    zonaHoraria: isFr ? "Fuseau Horaire de Référence (Le vôtre)" : "Zona Horaria de Referencia (La tuya)",
    rangoHorario: isFr ? "Plage horaire d'ouverture quotidienne (Heure locale)" : "Rango Horario de Clases Diario (Tu hora local)",
    horaInicio: isFr ? "Heure de début" : "Hora de Inicio",
    horaFin: isFr ? "Heure de fin" : "Hora de Fin",
    rangoAlmuerzo: isFr ? "Pause Déjeuner (Bloquée automatiquement pour les réservations)" : "Rango de Almuerzo / Descanso (Se bloquea automáticamente)",
    almuerzoInicio: isFr ? "Début pause déjeuner" : "Inicio Almuerzo",
    almuerzoFin: isFr ? "Fin pause déjeuner" : "Fin Almuerzo",
    diasSemana: [
      { id: 1, label: isFr ? "Lundi" : "Lunes", abr: isFr ? "Lun" : "Lun" },
      { id: 2, label: isFr ? "Mardi" : "Martes", abr: isFr ? "Mar" : "Mar" },
      { id: 3, label: isFr ? "Mercredi" : "Miércoles", abr: isFr ? "Mer" : "Mié" },
      { id: 4, label: isFr ? "Jeudi" : "Jueves", abr: isFr ? "Jeu" : "Jue" },
      { id: 5, label: isFr ? "Vendredi" : "Viernes", abr: isFr ? "Ven" : "Vie" },
      { id: 6, label: isFr ? "Samedi" : "Sábado", abr: isFr ? "Sam" : "Sáb" },
      { id: 0, label: isFr ? "Dimanche" : "Domingo", abr: isFr ? "Dim" : "Dom" }
    ]
  };

  const zonasHorarias = [
    { value: "Europe/Paris", label: isFr ? "Paris, France (CET/CEST)" : "París, Francia (CET/CEST)" },
    { value: "Europe/Madrid", label: isFr ? "Madrid, Espagne (CET/CEST)" : "Madrid, España (CET/CEST)" },
    { value: "America/Lima", label: "Lima, Perú (PET - UTC-5)" },
    { value: "America/Bogota", label: "Bogotá, Colombia (COT - UTC-5)" },
    { value: "America/Mexico_City", label: isFr ? "Mexico, Mexique (CST - UTC-6)" : "Ciudad de México (CST - UTC-6)" },
    { value: "America/Santiago", label: "Santiago, Chile (CLT - UTC-4)" },
    { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires, Argentina (ART - UTC-3)" },
    { value: "America/Caracas", label: "Caracas, Venezuela (VET - UTC-4)" },
    { value: "America/New_York", label: isFr ? "New York, USA (EST/EDT)" : "Nueva York, EE.UU. (EST/EDT)" },
    { value: "America/Guayaquil", label: "Quito, Ecuador (ECT - UTC-5)" },
    { value: "America/La_Paz", label: "La Paz, Bolivia (BOT - UTC-4)" },
    { value: "America/Montevideo", label: "Montevideo, Uruguay (UYT - UTC-3)" },
    { value: "America/Asuncion", label: "Asunción, Paraguay (PYT - UTC-4)" },
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
        alert(isFr ? "Vous devez garder au moins 1 jour ouvrable ouvert." : "Debes mantener al menos 1 día laboral abierto.");
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

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Settings size={20} className="text-[#3b82f6] shrink-0" /> {t.tituloHeader}
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
        {t.descHeader}
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
          {t.guardadoExito}
        </div>
      )}

      {configError && (
        <div style={{ padding: "16px", backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444", borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "14px", border: "1px solid rgba(239,68,68,0.15)" }}>
          <p style={{ fontWeight: 700, marginBottom: "8px" }}>❌ {isFr ? "Erreur d'enregistrement :" : "Error al guardar configuración en Supabase:"}</p>
          <code style={{ display: "block", backgroundColor: "rgba(0,0,0,0.05)", padding: "8px", borderRadius: "4px", marginBottom: "12px", fontSize: "12px" }}>{configError}</code>
          
          {(configError.includes("almuerzo_inicio") || configError.includes("almuerzo_fin")) && (
            <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(239,68,68,0.2)", paddingTop: "12px" }}>
              <p style={{ fontWeight: 600, color: "#b91c1c", marginBottom: "4px" }}>💡 {t.solucionRecomendada}</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>{t.ejecutaScript}</p>
              <pre style={{ backgroundColor: "#1e293b", color: "#f8fafc", padding: "12px", borderRadius: "6px", fontSize: "11px", overflowX: "auto" }}>
{`ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS almuerzo_inicio TEXT DEFAULT '13:00';
ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS almuerzo_fin TEXT DEFAULT '14:00';`}
              </pre>
            </div>
          )}

          {configError.includes("enlace_meet_default") && (
            <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(239,68,68,0.2)", paddingTop: "12px" }}>
              <p style={{ fontWeight: 600, color: "#b91c1c", marginBottom: "4px" }}>💡 {t.solucionRecomendada}</p>
              <p style={{ fontSize: "12px", marginBottom: "8px" }}>{t.ejecutaScript}</p>
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
                <label className="form-label">{t.tituloHero}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.titulo_hero}
                  onChange={(e) => setConfig({ ...config, titulo_hero: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.enlaceMeet}</label>
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
              <label className="form-label">{t.subtituloHero}</label>
              <textarea
                className="form-control"
                rows={3}
                value={config.subtitulo_hero}
                onChange={(e) => setConfig({ ...config, subtitulo_hero: e.target.value })}
                style={{ padding: "16px", resize: "none" }}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">{t.tagHero}</label>
              <input
                className="form-control"
                type="text"
                value={config.hero_badge || ""}
                onChange={(e) => setConfig({ ...config, hero_badge: e.target.value })}
                placeholder="Profesor Nativo de París"
                style={{ padding: "12px 16px" }}
              />
            </div>

            <h4 style={{ fontSize: "15px", marginBottom: "8px", marginTop: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.seoGoogle}
            </h4>

            <div className="form-group">
              <label className="form-label">{t.metaTitulo}</label>
              <input
                className="form-control"
                type="text"
                value={config.meta_titulo}
                onChange={(e) => setConfig({ ...config, meta_titulo: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.metaDesc}</label>
              <textarea
                className="form-control"
                rows={2}
                value={config.meta_descripcion}
                onChange={(e) => setConfig({ ...config, meta_descripcion: e.target.value })}
                style={{ padding: "16px", resize: "none" }}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">{t.metaKeywords}</label>
              <input
                className="form-control"
                type="text"
                value={config.palabras_clave}
                onChange={(e) => setConfig({ ...config, palabras_clave: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <h4 style={{ fontSize: "15px", marginBottom: "8px", marginTop: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.integraciones}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">{t.stripePublicKey}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.stripe_public_key}
                  onChange={(e) => setConfig({ ...config, stripe_public_key: e.target.value })}
                  placeholder="pk_test_..."
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.stripeSecretKey}</label>
                <input
                  className="form-control"
                  type="password"
                  value={config.stripe_secret_key}
                  onChange={(e) => setConfig({ ...config, stripe_secret_key: e.target.value })}
                  placeholder="sk_test_..."
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
            </div>
          </div>
        )}

        {/* Pestaña: Perfil Profesor */}
        {subTabCMS === "profesor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">{t.nombreProfesor}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_name}
                  onChange={(e) => setConfig({ ...config, teacher_name: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.tituloProfesor}</label>
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
              <label className="form-label">{t.bioProfesor}</label>
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
                <label className="form-label">{t.experienciaProfesor}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_experience}
                  onChange={(e) => setConfig({ ...config, teacher_experience: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.alumnosProfesor}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.teacher_students}
                  onChange={(e) => setConfig({ ...config, teacher_students: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.paisesProfesor}</label>
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
              <label className="form-label">{t.skillsProfesor}</label>
              <input
                className="form-control"
                type="text"
                value={config.teacher_skills}
                onChange={(e) => setConfig({ ...config, teacher_skills: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.certsProfesor}</label>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h4 style={{ fontSize: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.seccionMetodo}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">{t.badgeMetodo}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_badge}
                  onChange={(e) => setConfig({ ...config, ps_badge: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.tituloSeccionMetodo}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.ps_title}
                  onChange={(e) => setConfig({ ...config, ps_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            {/* Problema / Solución 1 */}
            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob1Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_prob_1_title}
                    onChange={(e) => setConfig({ ...config, ps_prob_1_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol1Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_sol_1_title}
                    onChange={(e) => setConfig({ ...config, ps_sol_1_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob1Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_prob_1_desc}
                    onChange={(e) => setConfig({ ...config, ps_prob_1_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol1Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_sol_1_desc}
                    onChange={(e) => setConfig({ ...config, ps_sol_1_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Problema / Solución 2 */}
            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob2Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_prob_2_title}
                    onChange={(e) => setConfig({ ...config, ps_prob_2_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol2Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_sol_2_title}
                    onChange={(e) => setConfig({ ...config, ps_sol_2_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob2Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_prob_2_desc}
                    onChange={(e) => setConfig({ ...config, ps_prob_2_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol2Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_sol_2_desc}
                    onChange={(e) => setConfig({ ...config, ps_sol_2_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Problema / Solución 3 */}
            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob3Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_prob_3_title}
                    onChange={(e) => setConfig({ ...config, ps_prob_3_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol3Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.ps_sol_3_title}
                    onChange={(e) => setConfig({ ...config, ps_sol_3_title: e.target.value })}
                    style={{ padding: "10px 14px" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">{t.prob3Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_prob_3_desc}
                    onChange={(e) => setConfig({ ...config, ps_prob_3_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.sol3Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.ps_sol_3_desc}
                    onChange={(e) => setConfig({ ...config, ps_sol_3_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña: Para Quién y CTA */}
        {subTabCMS === "destino" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h4 style={{ fontSize: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.seccionDestino}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">{t.destBadge}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_badge}
                  onChange={(e) => setConfig({ ...config, for_whom_badge: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.destTitulo}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.for_whom_title}
                  onChange={(e) => setConfig({ ...config, for_whom_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            {/* Fila Célula Destinos 1 y 2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div className="form-group">
                  <label className="form-label">{t.dest1Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.for_whom_1_title}
                    onChange={(e) => setConfig({ ...config, for_whom_1_title: e.target.value })}
                    style={{ padding: "10px 14px", marginBottom: "8px" }}
                  />
                  <label className="form-label">{t.dest1Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.for_whom_1_desc}
                    onChange={(e) => setConfig({ ...config, for_whom_1_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div className="form-group">
                  <label className="form-label">{t.dest2Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.for_whom_2_title}
                    onChange={(e) => setConfig({ ...config, for_whom_2_title: e.target.value })}
                    style={{ padding: "10px 14px", marginBottom: "8px" }}
                  />
                  <label className="form-label">{t.dest2Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.for_whom_2_desc}
                    onChange={(e) => setConfig({ ...config, for_whom_2_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Fila Célula Destinos 3 y 4 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div className="form-group">
                  <label className="form-label">{t.dest3Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.for_whom_3_title}
                    onChange={(e) => setConfig({ ...config, for_whom_3_title: e.target.value })}
                    style={{ padding: "10px 14px", marginBottom: "8px" }}
                  />
                  <label className="form-label">{t.dest3Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.for_whom_3_desc}
                    onChange={(e) => setConfig({ ...config, for_whom_3_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div className="form-group">
                  <label className="form-label">{t.dest4Titulo}</label>
                  <input
                    className="form-control"
                    type="text"
                    value={config.for_whom_4_title}
                    onChange={(e) => setConfig({ ...config, for_whom_4_title: e.target.value })}
                    style={{ padding: "10px 14px", marginBottom: "8px" }}
                  />
                  <label className="form-label">{t.dest4Desc}</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={config.for_whom_4_desc}
                    onChange={(e) => setConfig({ ...config, for_whom_4_desc: e.target.value })}
                    style={{ padding: "12px", resize: "none" }}
                  ></textarea>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginTop: "16px" }}>
              {t.seccionCta}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">{t.ctaBadge}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_badge}
                  onChange={(e) => setConfig({ ...config, cta_badge: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.ctaTitulo}</label>
                <input
                  className="form-control"
                  type="text"
                  value={config.cta_title}
                  onChange={(e) => setConfig({ ...config, cta_title: e.target.value })}
                  style={{ padding: "12px 16px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.ctaSubtitulo}</label>
              <textarea
                className="form-control"
                rows={2}
                value={config.cta_subtitle}
                onChange={(e) => setConfig({ ...config, cta_subtitle: e.target.value })}
                style={{ padding: "12px", resize: "none" }}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">{t.ctaBotonText}</label>
              <input
                className="form-control"
                type="text"
                value={config.cta_btn_text}
                onChange={(e) => setConfig({ ...config, cta_btn_text: e.target.value })}
                style={{ padding: "12px 16px" }}
              />
            </div>
          </div>
        )}

        {/* Pestaña: Límites y Horarios */}
        {subTabCMS === "negocio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h4 style={{ fontSize: "16px", color: "hsl(var(--accent-hsl))", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.negocioConfig}
            </h4>

            {/* Días laborales checkbox */}
            <div className="form-group">
              <label className="form-label">{t.diasLaborales}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "6px" }}>
                {t.diasSemana.map((dia) => {
                  const isActive = diasActivos.includes(dia.id);
                  return (
                    <button
                      key={dia.id}
                      type="button"
                      onClick={() => handleToggleDia(dia.id)}
                      className="btn"
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: isActive ? "hsl(var(--accent-hsl))" : "rgba(15,23,42,0.05)",
                        color: isActive ? "#0f172a" : "var(--text-muted)",
                        border: "none",
                        borderRadius: "100px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {dia.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Zona Horaria */}
            <div className="form-group">
              <label className="form-label">{t.zonaHoraria}</label>
              <select
                className="form-control"
                value={config.zona_horaria || "Europe/Paris"}
                onChange={(e) => setConfig({ ...config, zona_horaria: e.target.value })}
                style={{ padding: "12px 16px", borderRadius: "8px" }}
              >
                {zonasHorarias.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} ({tz.value})
                  </option>
                ))}
              </select>
            </div>

            {/* Horas de Inicio y Fin */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, color: "#1e293b" }}>
                  {t.horaInicio}
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
                  {t.horaFin}
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
                  {t.almuerzoInicio}
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
                  {t.almuerzoFin}
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
          {t.guardarBtn}
        </button>
      </form>
    </div>
  );
}
