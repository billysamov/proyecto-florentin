"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { adminTranslations } from "@/lib/translations";
import ResumenTab from "@/components/admin/ResumenTab";
import AlumnosTab from "@/components/admin/AlumnosTab";
import PlanesTab from "@/components/admin/PlanesTab";
import RecursosTab from "@/components/admin/RecursosTab";
import NotificacionesTab from "@/components/admin/NotificacionesTab";
import ConfiguracionTab from "@/components/admin/ConfiguracionTab";
import ManualTab from "@/components/admin/ManualTab";
import MarketingAutomatizaciones from "@/components/admin/MarketingAutomatizaciones";
import LogsTab from "@/components/admin/LogsTab";

interface Alumno {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  clasesRestantes: number;
  clases_restantes: number;
  totalClases: number;
  ultimoPago: string;
  monto: number;
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
  fecha_original?: string;
}

interface RecursoAdmin {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  tipo: string;
}

export default function AdminDashboard() {
  // Autenticación de Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado del menú móvil lateral
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado del idioma del panel administrativo
  const [adminLang, setAdminLang] = useState<"es" | "fr">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("florentin_admin_lang") as "es" | "fr") || "es";
    }
    return "es";
  });

  const changeAdminLang = (l: "es" | "fr") => {
    setAdminLang(l);
    localStorage.setItem("florentin_admin_lang", l);
  };

  const at = adminTranslations[adminLang];

  // Pestaña activa del dashboard
  const [activeTab, setActiveTab] = useState<"resumen" | "recursos" | "alumnos" | "notificaciones" | "planes" | "configuracion" | "manual" | "logs">("resumen");
  const [inscripcionesLogs, setInscripcionesLogs] = useState<any[]>([]);

  // --- Planes de Estudio ---
  const [planes, setPlanes] = useState<any[]>([]);

  const [subTabCMS, setSubTabCMS] = useState<"general" | "profesor" | "metodo" | "destino" | "negocio">("general");
  const [subTabMarketing, setSubTabMarketing] = useState<"mensajes" | "automatizaciones">("mensajes");

  const [config, setConfig] = useState({
    id: 1,
    titulo_hero: "Domina el francés con clases personalizadas",
    subtitulo_hero: "Aprende a tu ritmo con un profesor nativo. Flexibilidad, material exclusivo y enfoque en la conversación fluida.",
    hero_badge: "Profesor Nativo de París",
    stripe_public_key: "",
    stripe_secret_key: "",
    google_analytics_id: "",
    meta_pixel_id: "",
    dias_laborables: "[1,2,3,4,5]",
    hora_inicio: "09:00",
    hora_fin: "18:00",
    almuerzo_inicio: "13:00",
    almuerzo_fin: "14:00",
    zona_horaria: "Europe/Paris",
    meta_titulo: "Florentin | Aprende Francés con un Experto Nativo",
    meta_descripcion: "Plataforma educativa para aprender francés. Reserva tus clases en tiempo real, accede a material didáctico exclusivo y sigue tu progreso personalizado.",
    palabras_clave: "aprender frances, clases de frances, profesor de frances, frances online, reserva clases de frances",
    teacher_name: "Florentin",
    teacher_title: "Profesor Nativo de Francés | París, Francia",
    teacher_bio: "Soy Florentin, nacido y criado en París. Llevo más de 5 años enseñando francés a estudiantes de todo el mundo. Mi método se centra en la inmersión cultural y la conversación real, no en la memorización de reglas. Creo que aprender un idioma debe ser una experiencia emocionante, no una tarea aburrida.",
    teacher_experience: "+5 años",
    teacher_students: "+200 alumnos",
    teacher_countries: "+15 países",
    teacher_skills: "Pronunciación nativa, Cultura francesa, Gramática aplicada, Preparación DELF/DALF, Francés para negocios",
    teacher_certs: "Licenciatura en Lenguas Extranjeras, Certificación DALF C2, Formación en Pedagogía de Idiomas",
    exclusiones_horario: "[]",
    // Sección Problema/Solución
    ps_badge: "¿POR QUÉ FLORENTIN?",
    ps_title: "El problema de aprender francés… y la solución",
    ps_prob_1_title: "Apps genéricas",
    ps_prob_1_desc: "Repites frases sin contexto. No aprendes a mantener una conversación real.",
    ps_sol_1_title: "Conversación real",
    ps_sol_1_desc: "Desde la primera clase hablamos en francés. Aprendes con situaciones reales, no con robots.",
    ps_prob_2_title: "Sin feedback",
    ps_prob_2_desc: "Nadie te corrige la pronunciación ni te explica por qué te equivocas.",
    ps_sol_2_title: "Feedback personalizado",
    ps_sol_2_desc: "Te corrijo en tiempo real, te explico las reglas y perfeccionamos tu acento juntos.",
    ps_prob_3_title: "Horarios rígidos",
    ps_prob_3_desc: "Las academias te obligan a adaptarte a sus horarios. Tú trabajas, viajas, vives.",
    ps_sol_3_title: "Flexibilidad total",
    ps_sol_3_desc: "Tú eliges el día y la hora. Clases virtuales desde donde estés, en tu zona horaria.",
    // Sección Para Quién
    for_whom_badge: "¿PARA QUIÉN ES?",
    for_whom_title: "Florentin es para ti si…",
    for_whom_1_title: "Quieres vivir en Francia",
    for_whom_1_desc: "Prepárate para mudarte con confianza. Aprende el francés que realmente necesitas para la vida diaria.",
    for_whom_2_title: "Estudias o trabajas",
    for_whom_2_desc: "Mejora tu currículum con francés certificado. Ideal para universitarios y profesionales.",
    for_whom_3_title: "Amas la cultura francesa",
    for_whom_3_desc: "Cine, literatura, gastronomía… Disfruta la cultura francesa en su idioma original.",
    for_whom_4_title: "Empiezas desde cero",
    for_whom_4_desc: "No importa tu nivel. Diseño cada clase según tu ritmo y necesidades específicas.",
    // Sección CTA WhatsApp
    cta_badge: "¿LISTO PARA EMPEZAR?",
    cta_title: "Agenda tu clase gratuita",
    cta_subtitle: "Escríbeme por WhatsApp y coordinamos tu primera sesión de prueba. Sin compromiso, sin pagos.",
    cta_btn_text: "Agendar por WhatsApp",
    enlace_meet_default: "",
    email_notificaciones: "",
    whatsapp_number: "",
    email_bienvenida_activo: true,
    email_recordatorio_activo: true,
    mostrar_testimonios: true
  });
  const [configExito, setConfigExito] = useState(false);
  const [configError, setConfigError] = useState("");

  // --- Datos de Negocio ---
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [clases, setClases] = useState<ClaseAdmin[]>([]);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const [recursos, setRecursos] = useState<RecursoAdmin[]>([]);
  const [ingresosEur, setIngresosEur] = useState(0);
  const [ingresosUsd, setIngresosUsd] = useState(0);
  
  // --- Formularios de Adición ---
  const [nuevoRecurso, setNuevoRecurso] = useState({ titulo: "", descripcion: "", nivel: "A1", tipo: "pdf" });
  const [recExito, setRecExito] = useState(false);
  const [recError, setRecError] = useState("");
  const [subiendoRecurso, setSubiendoRecurso] = useState(false);
  const [alumnosSeleccionadosRecurso, setAlumnosSeleccionadosRecurso] = useState<string[]>([]);
  const [recursosAsignaciones, setRecursosAsignaciones] = useState<any[]>([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: "", email: "", planId: 1 });
  const [alExito, setAlExito] = useState(false);
  const [alError, setAlError] = useState("");

  // Variables para el expediente del alumno seleccionado (Vista Profesor)
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [editingClaseFeedbackId, setEditingClaseFeedbackId] = useState<string | null>(null);
  const [feedbackNota, setFeedbackNota] = useState("");
  const [feedbackGrabacion, setFeedbackGrabacion] = useState("");

  const [nuevoPlan, setNuevoPlan] = useState({ nombre: "", descripcion: "", precio: 49.00, totalClases: 8, tipo: "paquete", nivel: "A1", orden: 0 });
  const [plExito, setPlExito] = useState(false);
  const [plError, setPlError] = useState("");
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  // Notificaciones / Mensajes
  const [notifExito, setNotifExito] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [enviandoNotif, setEnviandoNotif] = useState(false);
  // --- Estados Adicionales de Notificaciones y Comunicación (Movidos al inicio para cumplir Reglas de Hooks) ---
  const [canalEnvio, setCanalEnvio] = useState<"correo" | "whatsapp">("correo");
  const [destinatario, setDestinatario] = useState("todos");
  const [asuntoMsg, setAsuntoMsg] = useState("");
  const [cuerpoMsg, setCuerpoMsg] = useState("");
  const [envioExito, setEnvioExito] = useState(false);


  useEffect(() => {
    // Verificar si hay sesión de admin activa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Verificar rol
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", session.user.id)
          .single();

        if (perfil && perfil.rol === "admin") {
          setIsAdminLoggedIn(true);
          cargarDatos();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Ejecutar limpieza silenciosa de alumnos inactivos de más de 2 semanas sin compras
      fetch("/api/admin/alumnos/eliminar", {
        method: "POST",
        headers,
        body: JSON.stringify({ limpiarInactivos: true })
      }).catch(err => console.error("Error limpieza inactivos:", err));

      // 1. Obtener Alumnos, Inscripciones y Planes
      const { data: planesCatalog } = await supabase.from("planes_estudio").select("*");

      const { data: usuariosDb, error: usrErr } = await supabase
        .from("usuarios")
        .select(`
          id,
          nombre,
          email,
          telefono,
          nivel_frances,
          zona_horaria,
          inscripciones (
            id,
            plan_id,
            clases_restantes,
            estado_pago,
            creado_en,
            monto_pagado,
            divisa
          )
        `)
        .eq("rol", "alumno");

      if (usrErr) console.error("Error usuarios:", usrErr);

      if (usuariosDb) {
        let totalIngresosEur = 0;
        let totalIngresosUsd = 0;
        const alumnosMap = usuariosDb.map((u: any) => {
          const ins = u.inscripciones && u.inscripciones.length > 0 
            ? [...u.inscripciones].sort((a: any, b: any) => b.id - a.id)[0] 
            : null;
          
          let planNombre = "Sin plan activo";
          let clasesRest = 0;
          let clasesTot = 0;
          let precioPlan = 0;
          let divisaPlan = "EUR";
          let fechaInscr = "-";

          if (ins && ins.estado_pago === "pagado") {
            clasesRest = ins.clases_restantes;
            divisaPlan = ins.divisa ? ins.divisa.toUpperCase() : "EUR";
            precioPlan = ins.monto_pagado || 0;

            const planInfo = planesCatalog?.find((p: any) => p.id === ins.plan_id);
            if (planInfo) {
              // Plan aún existe en el catálogo
              clasesTot = planInfo.total_clases || 0;
              precioPlan = ins.monto_pagado || planInfo.precio || 0;
              planNombre = planInfo.nombre || "Plan no encontrado";
            } else {
              // Plan fue eliminado del catálogo (plan personalizado ya consumido)
              // Calculamos total_clases sumando restantes + ya tomadas (de clases completadas)
              clasesTot = ins.clases_restantes; // Mínimo igual a restantes
              planNombre = ins.monto_pagado
                ? `Plan personalizado (${ins.monto_pagado}${divisaPlan === "USD" ? "$" : "€"})`
                : "Plan personalizado";
            }

            if (ins.creado_en) {
              const dtInscr = new Date(ins.creado_en);
              if (!isNaN(dtInscr.getTime())) {
                fechaInscr = dtInscr.toISOString().split("T")[0];
              }
            }

            if (divisaPlan === "USD") {
              totalIngresosUsd += precioPlan;
            } else {
              totalIngresosEur += precioPlan;
            }
          }


          return {
            id: u.id,
            nombre: u.nombre || "Alumno",
            email: u.email,
            telefono: u.telefono || "",
            nivel_frances: u.nivel_frances || "",
            zona_horaria: u.zona_horaria || "",
            plan: planNombre,
            clasesRestantes: clasesRest,
            clases_restantes: clasesRest,
            totalClases: clasesTot,
            ultimoPago: fechaInscr,
            monto: precioPlan,
            divisa: divisaPlan
          };
        });

        setAlumnos(alumnosMap);
        setIngresosEur(totalIngresosEur);
        setIngresosUsd(totalIngresosUsd);
      }

      // 2. Obtener Clases
      const { data: clasesDb } = await supabase
        .from("clases")
        .select(`
          id,
          fecha_hora,
          estado,
          enlace_meet,
          notas_profesor,
          enlace_grabacion,
          usuario_id,
          usuarios (
            nombre,
            email
          )
        `)
        .order("fecha_hora", { ascending: true });

      if (clasesDb) {
        const clasesMap: ClaseAdmin[] = clasesDb.map((c: any) => {
          let fechaStr = "-";
          let horaStr = "-";
          if (c.fecha_hora) {
            const dt = new Date(c.fecha_hora);
            if (!isNaN(dt.getTime())) {
              fechaStr = dt.toISOString().split("T")[0];
              horaStr = dt.toTimeString().split(" ")[0].substring(0, 5);
            }
          }
          return {
            id: c.id.toString(),
            alumno: c.usuarios?.nombre || c.usuarios?.email || "Estudiante",
            fecha: fechaStr,
            hora: horaStr,
            estado: c.estado,
            link: c.enlace_meet || "pendiente",
            notes: c.notas_profesor || "",
            recording_url: c.enlace_grabacion || "",
            fecha_original: c.fecha_hora
          };
        });
        setClases(clasesMap);
      }

      // 3. Obtener Recursos
      const { data: recursosDb } = await supabase
        .from("recursos")
        .select("*");

      if (recursosDb) {
        const recursosMap = recursosDb.map(r => ({
          id: r.id,
          titulo: r.titulo,
          descripcion: r.nivel === "Todos" ? "Material general para todos los niveles" : `Material exclusivo para nivel ${r.nivel}`,
          nivel: r.nivel,
          tipo: r.tipo
        }));
        setRecursos(recursosMap);
      }

      // 3.5 Obtener Asignaciones de Recursos
      const { data: asignacionesDb } = await supabase
        .from("recursos_asignados")
        .select("recurso_id, usuario_id");
      if (asignacionesDb) {
        setRecursosAsignaciones(asignacionesDb);
      }

      // 4. Obtener Planes de Estudio
      const { data: planesDb } = await supabase
        .from("planes_estudio")
        .select("*")
        .order("id", { ascending: true });
        
      if (planesDb) {
        setPlanes(planesDb.map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          totalClases: p.total_clases,
          tipo: p.tipo || "paquete",
          nivel: p.nivel || "Todos",
          activo: p.activo,
          orden: p.orden || 0
        })));
      }

      // 4b. Obtener historial completo de Inscripciones para Logs
      const { data: allInscripciones } = await supabase
        .from("inscripciones")
        .select(`
          id,
          usuario_id,
          plan_id,
          clases_restantes,
          estado_pago,
          monto_pagado,
          divisa,
          creado_en,
          planes_estudio ( nombre )
        `)
        .order("id", { ascending: false });

      if (allInscripciones) {
        setInscripcionesLogs(allInscripciones);
      }

      // 5. Obtener Configuración
      const { data: configDb } = await supabase
        .from("configuracion_sitio")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (configDb) {
        setConfig({
          id: configDb.id,
          titulo_hero: configDb.titulo_hero || "",
          subtitulo_hero: configDb.subtitulo_hero || "",
          hero_badge: configDb.hero_badge || "Profesor Nativo de París",
          stripe_public_key: configDb.stripe_public_key || "",
          stripe_secret_key: configDb.stripe_secret_key || "",
          google_analytics_id: configDb.google_analytics_id || "",
          meta_pixel_id: configDb.meta_pixel_id || "",
          dias_laborables: configDb.dias_laborables || "[1,2,3,4,5]",
          hora_inicio: configDb.hora_inicio || "09:00",
          hora_fin: configDb.hora_fin || "18:00",
          almuerzo_inicio: configDb.almuerzo_inicio || "13:00",
          almuerzo_fin: configDb.almuerzo_fin || "14:00",
          zona_horaria: configDb.zona_horaria || "Europe/Paris",
          meta_titulo: configDb.meta_titulo || "Florentin | Aprende Francés con un Experto Nativo",
          meta_descripcion: configDb.meta_descripcion || "Plataforma educativa para aprender francés. Reserva tus clases en tiempo real, accede a material didáctico exclusivo y sigue tu progreso personalizado.",
          palabras_clave: configDb.palabras_clave || "aprender frances, clases de frances, profesor de frances, frances online, reserva clases de frances",
          teacher_name: configDb.teacher_name || "Florentin",
          teacher_title: configDb.teacher_title || "Profesor Nativo de Francés | París, Francia",
          teacher_bio: configDb.teacher_bio || "Soy Florentin, nacido y criado en París. Llevo más de 5 años enseñando francés a estudiantes de todo el mundo. Mi método se centra en la inmersión cultural y la conversación real, no en la memorización de reglas. Creo que aprender un idioma debe ser una experiencia emocionante, no una tarea aburrida.",
          teacher_experience: configDb.teacher_experience || "+5 años",
          teacher_students: configDb.teacher_students || "+200 alumnos",
          teacher_countries: configDb.teacher_countries || "+15 países",
          teacher_skills: configDb.teacher_skills || "Pronunciación nativa, Cultura francesa, Gramática aplicada, Preparación DELF/DALF, Francés para negocios",
          teacher_certs: configDb.teacher_certs || "Licenciatura en Lenguas Extranjeras, Certificación DALF C2, Formación en Pedagogía de Idiomas",
          ps_badge: configDb.ps_badge || "¿POR QUÉ FLORENTIN?",
          ps_title: configDb.ps_title || "El problema de aprender francés… y la solución",
          ps_prob_1_title: configDb.ps_prob_1_title || "Apps genéricas",
          ps_prob_1_desc: configDb.ps_prob_1_desc || "Repites frases sin contexto. No aprendes a mantener una conversación real.",
          ps_sol_1_title: configDb.ps_sol_1_title || "Conversación real",
          ps_sol_1_desc: configDb.ps_sol_1_desc || "Desde la primera clase hablamos en francés. Aprendes con situaciones reales, no con robots.",
          ps_prob_2_title: configDb.ps_prob_2_title || "Sin feedback",
          ps_prob_2_desc: configDb.ps_prob_2_desc || "Nadie te corrige la pronunciación ni te explica por qué te equivocas.",
          ps_sol_2_title: configDb.ps_sol_2_title || "Feedback personalizado",
          ps_sol_2_desc: configDb.ps_sol_2_desc || "Te corrijo en tiempo real, te explico las reglas y perfeccionamos tu acento juntos.",
          ps_prob_3_title: configDb.ps_prob_3_title || "Horarios rígidos",
          ps_prob_3_desc: configDb.ps_prob_3_desc || "Las academias te obligan a adaptarte a sus horarios. Tú trabajas, viajas, vives.",
          ps_sol_3_title: configDb.ps_sol_3_title || "Flexibilidad total",
          ps_sol_3_desc: configDb.ps_sol_3_desc || "Tú eliges el día y la hora. Clases virtuales desde donde estés, en tu zona horaria.",
          for_whom_badge: configDb.for_whom_badge || "¿PARA QUIÉN ES?",
          for_whom_title: configDb.for_whom_title || "Florentin es para ti si…",
          for_whom_1_title: configDb.for_whom_1_title || "Quieres vivir en Francia",
          for_whom_1_desc: configDb.for_whom_1_desc || "Prepárate para mudarte con confianza. Aprende el francés que realmente necesitas para la vida diaria.",
          for_whom_2_title: configDb.for_whom_2_title || "Estudias o trabajas",
          for_whom_2_desc: configDb.for_whom_2_desc || "Mejora tu currículum con francés certificado. Ideal para universitarios y profesionales.",
          for_whom_3_title: configDb.for_whom_3_title || "Amas la cultura francesa",
          for_whom_3_desc: configDb.for_whom_3_desc || "Cine, literatura, gastronomía… Disfruta la cultura francesa en su idioma original.",
          for_whom_4_title: configDb.for_whom_4_title || "Empiezas desde cero",
          for_whom_4_desc: configDb.for_whom_4_desc || "No importa tu nivel. Diseño cada clase según tu ritmo y necesidades específicas.",
          cta_badge: configDb.cta_badge || "¿LISTO PARA EMPEZAR?",
          cta_title: configDb.cta_title || "Agenda tu clase gratuita",
          cta_subtitle: configDb.cta_subtitle || "Escríbeme por WhatsApp y coordinamos tu primera sesión de prueba. Sin compromiso, sin pagos.",
          cta_btn_text: configDb.cta_btn_text || "Agendar por WhatsApp",
          enlace_meet_default: configDb.enlace_meet_default || "",
          email_notificaciones: configDb.email_notificaciones || "",
          whatsapp_number: configDb.whatsapp_number || "",
          mostrar_testimonios: configDb.mostrar_testimonios !== false,
          exclusiones_horario: configDb.exclusiones_horario || "[]",
          email_bienvenida_activo: configDb.email_bienvenida_activo !== false,
          email_recordatorio_activo: configDb.email_recordatorio_activo !== false
        });
      }

    } catch (err) {
      console.error("Error al cargar datos de administración:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });

      if (error) {
        setAdminError("Error de credenciales: " + error.message);
        return;
      }

      if (data.user) {
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", data.user.id)
          .single();

        if (perfil && perfil.rol === "admin") {
          setIsAdminLoggedIn(true);
          cargarDatos();
        } else {
          await supabase.auth.signOut();
          setAdminError("Acceso denegado. No tienes permisos de administrador.");
        }
      }
    } catch (err: any) {
      setAdminError("Error de conexión: " + err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
  };

  const crearRecurso = async (titulo: string, tipo: string, nivel: string, file: File, alumnoIds: string[]) => {
    setSubiendoRecurso(true);
    setRecExito(false);
    setRecError("");
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("material_didactico")
        .upload(fileName, file);

      if (uploadError) {
        setRecError("Error al subir archivo: " + uploadError.message);
        setSubiendoRecurso(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("material_didactico")
        .getPublicUrl(fileName);

      const { data: recursoCreado, error: errorRecurso } = await supabase
        .from("recursos")
        .insert({
          titulo,
          tipo,
          nivel,
          url_archivo: publicUrl
        })
        .select("id")
        .single();

      if (errorRecurso || !recursoCreado) {
        setRecError("Error al registrar recurso: " + (errorRecurso?.message || "No se obtuvo ID"));
        setSubiendoRecurso(false);
        return;
      }

      const filasAsignacion = alumnoIds.map(usuarioId => ({
        recurso_id: recursoCreado.id,
        usuario_id: usuarioId
      }));

      const { error: errorAsignacion } = await supabase
        .from("recursos_asignados")
        .insert(filasAsignacion);

      if (errorAsignacion) {
        setRecError("Error en asignación: " + errorAsignacion.message);
        setSubiendoRecurso(false);
        return;
      }

      setRecExito(true);
      cargarDatos();
      setTimeout(() => setRecExito(false), 3000);
    } catch (err: any) {
      setRecError("Error inesperado: " + err.message);
    } finally {
      setSubiendoRecurso(false);
    }
  };

  const eliminarRecurso = async (id: number) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este material?");
    if (!confirmacion) return;

    const { error } = await supabase
      .from("recursos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar el recurso: " + error.message);
      return;
    }

    cargarDatos();
  };

  const crearAlumnoManual = async (nombre: string, email: string, planId: number) => {
    setAlError("");
    setAlExito(false);
    try {
      const response = await fetch("/api/admin/crear-alumno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, planId })
      });

      const resData = await response.json();
      if (!response.ok) {
        setAlError(resData.error || "Error al inscribir al alumno");
        return;
      }

      setAlExito(true);
      cargarDatos();
      setTimeout(() => setAlExito(false), 3000);
    } catch (err: any) {
      setAlError("Error de red: " + err.message);
    }
  };

  const guardarPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlError("");
    setPlExito(false);
    if (!nuevoPlan.nombre || nuevoPlan.precio <= 0) return;
    
    try {
      if (editingPlanId) {
        const { error } = await supabase
          .from("planes_estudio")
          .update({
            nombre: nuevoPlan.nombre,
            descripcion: nuevoPlan.descripcion,
            precio: nuevoPlan.precio,
            total_clases: nuevoPlan.totalClases,
            tipo: nuevoPlan.tipo,
            nivel: nuevoPlan.nivel,
            orden: nuevoPlan.orden
          })
          .eq("id", editingPlanId);

        if (error) {
          setPlError(error.message);
          return;
        }

        setEditingPlanId(null);
        setNuevoPlan({ nombre: "", descripcion: "", precio: 49.00, totalClases: 8, tipo: "paquete", nivel: "A1", orden: 0 });
        setPlExito(true);
        cargarDatos();
        setTimeout(() => setPlExito(false), 3000);
      } else {
        const { error } = await supabase
          .from("planes_estudio")
          .insert({
            nombre: nuevoPlan.nombre,
            descripcion: nuevoPlan.descripcion,
            precio: nuevoPlan.precio,
            total_clases: nuevoPlan.totalClases,
            tipo: nuevoPlan.tipo,
            nivel: nuevoPlan.nivel,
            activo: true,
            orden: nuevoPlan.orden
          });

        if (error) {
          setPlError(error.message);
          return;
        }

        setNuevoPlan({ nombre: "", descripcion: "", precio: 49.00, totalClases: 8, tipo: "paquete", nivel: "A1", orden: 0 });
        setPlExito(true);
        cargarDatos();
        setTimeout(() => setPlExito(false), 3000);
      }
    } catch (err: any) {
      setPlError("Error inesperado: " + err.message);
    }
  };

  const iniciarEdicionPlan = (plan: any) => {
    setEditingPlanId(plan.id);
    setNuevoPlan({
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      precio: Number(plan.precio),
      totalClases: Number(plan.totalClases),
      tipo: plan.tipo || "paquete",
      nivel: plan.nivel || "A1",
      orden: plan.orden || 0
    });
  };

  const togglePlanActivo = async (id: number) => {
    const plan = planes.find(p => p.id === id);
    if (!plan) return;

    const { error } = await supabase
      .from("planes_estudio")
      .update({ activo: !plan.activo })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar plan: " + error.message);
    } else {
      cargarDatos();
    }
  };

  const cambiarEstadoClase = async (id: string, estado: string) => {
    const { error } = await supabase
      .from("clases")
      .update({ estado })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar la clase: " + error.message);
    } else {
      cargarDatos();
    }
  };

  const guardarLinkClase = async (claseId: string, nuevoLink: string) => {
    if (!nuevoLink.trim()) {
      alert("El enlace no puede estar vacío.");
      return;
    }
    const { error } = await supabase
      .from("clases")
      .update({ enlace_meet: nuevoLink.trim() })
      .eq("id", claseId);

    if (error) {
      alert("Error al actualizar el enlace: " + error.message);
    } else {
      setEditingLinkId(null);
      setEditingLinkValue("");
      cargarDatos();
    }
  };

  const guardarFeedbackClase = async (claseId: string) => {
    const dataUpdate: any = {
      notas_profesor: feedbackNota
    };

    if (feedbackGrabacion.trim() !== "") {
      dataUpdate.enlace_grabacion = feedbackGrabacion.trim();
    }

    const { error } = await supabase
      .from("clases")
      .update(dataUpdate)
      .eq("id", claseId);

    if (error) {
      alert("Error al guardar la retroalimentación: " + error.message);
    } else {
      setEditingClaseFeedbackId(null);
      setFeedbackNota("");
      setFeedbackGrabacion("");
      cargarDatos();
    }
  };

  const toggleAsignacionRecurso = async (recursoId: number, usuarioId: string, estaAsignado: boolean) => {
    if (estaAsignado) {
      const { error } = await supabase
        .from("recursos_asignados")
        .delete()
        .eq("recurso_id", recursoId)
        .eq("usuario_id", usuarioId);

      if (error) alert("Error al desasignar: " + error.message);
      else cargarDatos();
    } else {
      const { error } = await supabase
        .from("recursos_asignados")
        .insert({ recurso_id: recursoId, usuario_id: usuarioId });

      if (error) alert("Error al asignar: " + error.message);
      else cargarDatos();
    }
  };

  const enviarNotificacionManual = async (destinatarioId: string, canal: string, asunto: string, mensaje: string) => {
    setEnviandoNotif(true);
    setNotifExito(false);
    setNotifError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/admin/enviar-notificacion", {
        method: "POST",
        headers,
        body: JSON.stringify({ destinatarioId, canal, asunto, mensaje })
      });

      const resData = await response.json();
      if (!response.ok) {
        setNotifError(resData.error || "Error al transmitir notificación");
        return;
      }

      setNotifExito(true);
      setTimeout(() => setNotifExito(false), 3000);
    } catch (err: any) {
      setNotifError("Error de red: " + err.message);
    } finally {
      setEnviandoNotif(false);
    }
  };

  const guardarConfiguracionCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigError("");
    setConfigExito(false);
    const { error } = await supabase
      .from("configuracion_sitio")
      .upsert({
        id: 1,
        titulo_hero: config.titulo_hero,
        subtitulo_hero: config.subtitulo_hero,
        hero_badge: config.hero_badge,
        stripe_public_key: config.stripe_public_key,
        stripe_secret_key: config.stripe_secret_key,
        google_analytics_id: config.google_analytics_id,
        meta_pixel_id: config.meta_pixel_id,
        dias_laborables: config.dias_laborables,
        hora_inicio: config.hora_inicio,
        hora_fin: config.hora_fin,
        almuerzo_inicio: config.almuerzo_inicio,
        almuerzo_fin: config.almuerzo_fin,
        zona_horaria: config.zona_horaria,
        meta_titulo: config.meta_titulo,
        meta_descripcion: config.meta_descripcion,
        palabras_clave: config.palabras_clave,
        teacher_name: config.teacher_name,
        teacher_title: config.teacher_title,
        teacher_bio: config.teacher_bio,
        teacher_experience: config.teacher_experience,
        teacher_students: config.teacher_students,
        teacher_countries: config.teacher_countries,
        teacher_skills: config.teacher_skills,
        teacher_certs: config.teacher_certs,
        ps_badge: config.ps_badge,
        ps_title: config.ps_title,
        ps_prob_1_title: config.ps_prob_1_title,
        ps_prob_1_desc: config.ps_prob_1_desc,
        ps_sol_1_title: config.ps_sol_1_title,
        ps_sol_1_desc: config.ps_sol_1_desc,
        ps_prob_2_title: config.ps_prob_2_title,
        ps_prob_2_desc: config.ps_prob_2_desc,
        ps_sol_2_title: config.ps_sol_2_title,
        ps_sol_2_desc: config.ps_sol_2_desc,
        ps_prob_3_title: config.ps_prob_3_title,
        ps_prob_3_desc: config.ps_prob_3_desc,
        ps_sol_3_title: config.ps_sol_3_title,
        ps_sol_3_desc: config.ps_sol_3_desc,
        for_whom_badge: config.for_whom_badge,
        for_whom_title: config.for_whom_title,
        for_whom_1_title: config.for_whom_1_title,
        for_whom_1_desc: config.for_whom_1_desc,
        for_whom_2_title: config.for_whom_2_title,
        for_whom_2_desc: config.for_whom_2_desc,
        for_whom_3_title: config.for_whom_3_title,
        for_whom_3_desc: config.for_whom_3_desc,
        for_whom_4_title: config.for_whom_4_title,
        for_whom_4_desc: config.for_whom_4_desc,
        cta_badge: config.cta_badge,
        cta_title: config.cta_title,
        cta_subtitle: config.cta_subtitle,
        cta_btn_text: config.cta_btn_text,
        enlace_meet_default: config.enlace_meet_default,
        email_notificaciones: config.email_notificaciones,
        whatsapp_number: config.whatsapp_number,
        mostrar_testimonios: config.mostrar_testimonios !== false,
        exclusiones_horario: config.exclusiones_horario,
        email_bienvenida_activo: config.email_bienvenida_activo,
        email_recordatorio_activo: config.email_recordatorio_activo
      });
      
    if (error) {
      setConfigError(error.message);
    } else {
      setConfigExito(true);
      setTimeout(() => setConfigExito(false), 3000);
    }
  };

  const sidebarItems = [
    {
      id: "resumen",
      label: at.resumen,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      )
    },
    {
      id: "alumnos",
      label: at.alumnos,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: "planes",
      label: at.planes,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "recursos",
      label: at.recursos,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      )
    },
    {
      id: "notificaciones",
      label: at.notificaciones,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      id: "configuracion",
      label: at.configuracion,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "manual",
      label: at.manual,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: "logs",
      label: adminLang === "fr" ? "Logs & Historique" : "Historial & Logs",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  if (loading) {
    
  
  

  return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-main)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(201, 154, 60, 0.2)",
            borderTop: "4px solid #c99a3c",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px auto"
          }}></div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-outfit)" }}>
            {at.loading}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 80% 20%, rgba(201, 154, 60, 0.12), transparent 45%), radial-gradient(circle at 15% 80%, rgba(15, 23, 42, 0.05), transparent 45%), #f8fafc",
        padding: "24px"
      }}>
        <div style={{ maxWidth: "440px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Link href="/" style={{ fontSize: "32px", fontWeight: 900, fontFamily: "var(--font-serif)", color: "hsl(var(--primary-hsl))", letterSpacing: "-1px" }}>
              Florentin<span style={{ color: "hsl(var(--accent-hsl))" }}>.</span>
            </Link>
            <h2 style={{ fontSize: "22px", marginTop: "16px", color: "var(--text-main)", fontWeight: 800, fontFamily: "var(--font-outfit)", letterSpacing: "-0.5px" }}>
              {at.panelTitle}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>
              {at.panelDesc}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
            <button 
              type="button" 
              onClick={() => changeAdminLang("es")} 
              style={{ padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, backgroundColor: adminLang === "es" ? "hsl(var(--accent-hsl))" : "rgba(15,23,42,0.05)", border: "none", cursor: "pointer", color: adminLang === "es" ? "#0f172a" : "var(--text-muted)", transition: "all 0.3s" }}
            >
              ESPAÑOL
            </button>
            <button 
              type="button" 
              onClick={() => changeAdminLang("fr")} 
              style={{ padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, backgroundColor: adminLang === "fr" ? "hsl(var(--accent-hsl))" : "rgba(15,23,42,0.05)", border: "none", cursor: "pointer", color: adminLang === "fr" ? "#0f172a" : "var(--text-muted)", transition: "all 0.3s" }}
            >
              FRANÇAIS
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="card" style={{ padding: "32px", borderRadius: "var(--radius-lg)", boxShadow: "0 20px 40px -15px rgba(15,23,42,0.06)", border: "1px solid rgba(15,23,42,0.06)" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">{at.emailLabel}</label>
              <input
                className="form-control"
                type="email"
                id="admin-email"
                placeholder="florentin@frances.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "28px" }}>
              <label className="form-label" htmlFor="admin-password">{at.passLabel}</label>
              <input
                className="form-control"
                type="password"
                id="admin-password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px 0", borderRadius: "100px", fontSize: "15px", fontWeight: 700 }}>
              {at.loginBtn}
            </button>

            {adminError && (
              <div style={{
                marginTop: "20px",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(220, 53, 69, 0.08)",
                border: "1px solid rgba(220, 53, 69, 0.15)",
                color: "#b91c1c",
                fontSize: "13px",
                textAlign: "center",
                fontWeight: 500
              }}>
                {adminError}
              </div>
            )}
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
            <Link href="/" style={{ color: "hsl(var(--accent-hsl))", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>←</span> {at.backHome}
            </Link>
          </p>
        </div>
      </div>
    );
  }



  
  


  
  

  


  
  const handleCrearAlumnoManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crearAlumnoManual(nuevoAlumno.nombre, nuevoAlumno.email, nuevoAlumno.planId);
  };

  const handleCrearRecursoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crearRecurso(
      nuevoRecurso.titulo,
      nuevoRecurso.tipo,
      nuevoRecurso.nivel,
      archivoSeleccionado as File,
      alumnosSeleccionadosRecurso
    );
  };

  const guardarEdicionPlan = async (id: number, fields: any) => {
    const { error } = await supabase
      .from("planes_estudio")
      .update({
        nombre: fields.nombre,
        descripcion: fields.descripcion,
        precio: fields.precio,
        total_clases: fields.total_clases,
        nivel: fields.nivel,
        orden: fields.orden
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar plan: " + error.message);
    } else {
      setEditingPlanId(null);
      cargarDatos();
    }
  };

  const eliminarPlan = async (id: number) => {
    const { error } = await supabase
      .from("planes_estudio")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar plan: " + error.message);
    } else {
      cargarDatos();
    }
  };

  const eliminarAlumno = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/admin/alumnos/eliminar", {
        method: "POST",
        headers,
        body: JSON.stringify({ alumnoId: id })
      });
      const res = await response.json();
      if (res.error) {
        alert(res.error);
      } else {
        alert(adminLang === 'es' ? "✓ Estudiante eliminado correctamente." : "✓ Élève supprimé avec succès.");
        cargarDatos();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const limpiarAlumnosInactivos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/admin/alumnos/eliminar", {
        method: "POST",
        headers,
        body: JSON.stringify({ limpiarInactivos: true })
      });
      const res = await response.json();
      if (res.error) {
        alert(res.error);
      } else {
        alert(res.message || "✓ Limpieza completada.");
        cargarDatos();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const toggleEstadoPlan = togglePlanActivo;
  const crearPlan = guardarPlan;

  const toggleRecomendadoPlan = async (id: number, isRecomendado: boolean) => {
    const { error } = await supabase
      .from("planes_estudio")
      .update({ recomendado: isRecomendado })
      .eq("id", id);
    if (error) {
      alert("Error al actualizar recomendado: " + error.message);
    } else {
      cargarDatos();
    }
  };

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    await enviarNotificacionManual(destinatario, canalEnvio, asuntoMsg, cuerpoMsg);
    setEnvioExito(true);
    setTimeout(() => setEnvioExito(false), 3000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* 1. SIDEBAR LATERAL (RESPONSIVO) */}
      <aside style={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 30,
        borderRight: "1px solid rgba(255, 255, 255, 0.05)"
      }} className={`w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header del Sidebar */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Link href="/" style={{ fontSize: "24px", fontWeight: 900, fontFamily: "var(--font-serif)", color: "#ffffff" }}>
            Florentin<span style={{ color: "hsl(var(--accent-hsl))" }}>.</span>
          </Link>
          <span style={{
            fontSize: "9px",
            fontWeight: 800,
            backgroundColor: "rgba(201, 154, 60, 0.15)",
            color: "hsl(var(--accent-hsl))",
            padding: "2px 8px",
            borderRadius: "100px",
            border: "1px solid rgba(201, 154, 60, 0.3)"
          }}>
            {at.teacher}
          </span>
        </div>

        {/* Info Perfil */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "hsl(var(--accent-hsl))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f172a",
              fontWeight: 800,
              fontSize: "16px"
            }}>
              F
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#f8fafc" }}>Florentin</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>{at.administrator}</div>
            </div>
          </div>
          {/* Selector de Idioma de Interfaz */}
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <button 
              type="button" 
              onClick={() => changeAdminLang("es")} 
              style={{ flex: 1, padding: "4px 0", borderRadius: "6px", fontSize: "10px", fontWeight: 800, backgroundColor: adminLang === "es" ? "hsl(var(--accent-hsl))" : "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: adminLang === "es" ? "#0f172a" : "#94a3b8", transition: "all 0.2s" }}
            >
              ESPAÑOL
            </button>
            <button 
              type="button" 
              onClick={() => changeAdminLang("fr")} 
              style={{ flex: 1, padding: "4px 0", borderRadius: "6px", fontSize: "10px", fontWeight: 800, backgroundColor: adminLang === "fr" ? "hsl(var(--accent-hsl))" : "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: adminLang === "fr" ? "#0f172a" : "#94a3b8", transition: "all 0.2s" }}
            >
              FRANÇAIS
            </button>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav style={{ flex: 1, padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {sidebarItems.map((item) => {
            const isSelected = activeTab === item.id;
            
  
  

  return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isSelected ? "rgba(201, 154, 60, 0.1)" : "transparent",
                  color: isSelected ? "hsl(var(--accent-hsl))" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "var(--transition-fast)"
                }}
                className="group hover:bg-white/5 hover:text-white"
              >
                <span style={{ color: isSelected ? "hsl(var(--accent-hsl))" : "#64748b" }} className="group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer del Sidebar / Botón Salir */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "100px",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              backgroundColor: "rgba(220, 38, 38, 0.05)",
              color: "#f87171",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
            className="hover:bg-red-600/10 hover:border-red-600/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {at.logout}
          </button>
        </div>
      </aside>

      {/* 2. OVERLAY MÓVIL SI EL SIDEBAR ESTÁ ABIERTO */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 25
          }}
          className="lg:hidden"
        />
      )}

      {/* 3. CONTENEDOR PRINCIPAL */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }} className="lg:ml-72 ml-0 w-full transition-all duration-300">
        
        {/* HEADER SUPERIOR (MÓVIL Y ESCRITORIO) */}
        <header style={{
          height: "72px",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "16px", width: "100%", justifyContent: "space-between" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Botón Hamburguesa Móvil */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                className="lg:hidden hover:bg-slate-100"
                aria-label="Abrir Menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "var(--text-main)",
                fontFamily: "var(--font-outfit)",
                textTransform: "capitalize",
                margin: 0
              }}>
                {adminLang === "fr" ? (
                  activeTab === "resumen" ? "Résumé des Cours" : activeTab === "alumnos" ? "Dossiers des Élèves" : activeTab === "planes" ? "Catalogue de Formules" : activeTab === "recursos" ? "Médiathèque" : activeTab === "notificaciones" ? "Centre de Communication" : activeTab === "manual" ? "Manuel Opérationnel" : activeTab === "logs" ? "Journal d'Audite & Logs" : "Configuration du Site"
                ) : (
                  activeTab === "resumen" ? "Resumen de Clases" : activeTab === "alumnos" ? "Expediente de Alumnos" : activeTab === "planes" ? "Catálogo de Planes" : activeTab === "recursos" ? "Biblioteca Multimedia" : activeTab === "notificaciones" ? "Centro de Comunicaciones" : activeTab === "manual" ? "Manual de Operaciones" : activeTab === "logs" ? "Logs de Auditoría & Cambios" : "Configuración CMS"
                )}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("logs")}
                style={{
                  fontSize: "12px",
                  color: activeTab === "logs" ? "#ffffff" : "#0c1b33",
                  fontWeight: 700,
                  backgroundColor: activeTab === "logs" ? "#0c1b33" : "#ffffff",
                  border: "1px solid #cbd5e1",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease"
                }}
                className="hover:bg-slate-100"
              >
                📋 {adminLang === "fr" ? "Logs Système" : "Historial & Logs"}
              </button>

              <span style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                fontWeight: 600,
                backgroundColor: "#f1f5f9",
                padding: "6px 12px",
                borderRadius: "100px"
              }} className="hidden sm:inline-block">
                📅 {new Date().toLocaleDateString(adminLang === "fr" ? "fr-FR" : "es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ flex: 1, padding: "32px 24px", backgroundColor: "#f8fafc" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* TAB 1: RESUMEN Y AGENDA */}
            {activeTab === "resumen" && (
              <ResumenTab
                clases={clases}
                ingresosEur={ingresosEur}
                ingresosUsd={ingresosUsd}
                editingLinkId={editingLinkId}
                editingLinkValue={editingLinkValue}
                setEditingLinkId={setEditingLinkId}
                setEditingLinkValue={setEditingLinkValue}
                guardarLinkClase={guardarLinkClase}
                cambiarEstadoClase={cambiarEstadoClase}
                lang={adminLang}
              />
            )}

            {/* TAB 2: ALUMNOS */}
            {activeTab === "alumnos" && (
              <AlumnosTab
                alumnos={alumnos as any}
                clases={clases}
                recursos={recursos}
                recursosAsignaciones={recursosAsignaciones}
                selectedAlumno={selectedAlumno as any}
                setSelectedAlumno={setSelectedAlumno as any}
                nuevoAlumno={nuevoAlumno}
                setNuevoAlumno={setNuevoAlumno}
                alExito={alExito}
                alError={alError}
                crearAlumnoManual={handleCrearAlumnoManualSubmit}
                editingClaseFeedbackId={editingClaseFeedbackId}
                setEditingClaseFeedbackId={setEditingClaseFeedbackId}
                feedbackNota={feedbackNota}
                setFeedbackNota={setFeedbackNota}
                feedbackGrabacion={feedbackGrabacion}
                setFeedbackGrabacion={setFeedbackGrabacion}
                guardarFeedbackClase={guardarFeedbackClase}
                toggleAsignacionRecurso={toggleAsignacionRecurso}
                eliminarAlumno={eliminarAlumno}
                limpiarAlumnosInactivos={limpiarAlumnosInactivos}
                planes={planes}
                lang={adminLang}
              />
            )}

            {/* TAB 3: PLANES DE ESTUDIO */}
            {activeTab === "planes" && (
              <PlanesTab
                planes={planes}
                nuevoPlan={nuevoPlan}
                setNuevoPlan={setNuevoPlan}
                planExito={plExito}
                editingPlanId={editingPlanId}
                setEditingPlanId={setEditingPlanId}
                crearPlan={crearPlan}
                guardarEdicionPlan={guardarEdicionPlan}
                toggleEstadoPlan={toggleEstadoPlan}
                toggleRecomendadoPlan={toggleRecomendadoPlan}
                eliminarPlan={eliminarPlan}
                lang={adminLang}
              />
            )}

            {/* TAB 4: RECURSOS COMPARTIDOS */}
            {activeTab === "recursos" && (
              <RecursosTab
                recursos={recursos}
                alumnos={alumnos as any}
                recursosAsignaciones={recursosAsignaciones}
                nuevoRecurso={nuevoRecurso}
                setNuevoRecurso={setNuevoRecurso}
                recExito={recExito}
                alumnosSeleccionadosRecurso={alumnosSeleccionadosRecurso}
                setAlumnosSeleccionadosRecurso={setAlumnosSeleccionadosRecurso}
                archivoSeleccionado={archivoSeleccionado}
                setArchivoSeleccionado={setArchivoSeleccionado}
                crearRecurso={handleCrearRecursoSubmit}
                eliminarRecurso={eliminarRecurso}
                lang={adminLang}
              />
            )}

            {/* TAB 5: MARKETING Y MENSAJES */}
            {activeTab === "notificaciones" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Selector de Subpestaña */}
                <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                  <button
                    onClick={() => setSubTabMarketing("mensajes")}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: subTabMarketing === "mensajes" ? "#3b82f6" : "transparent",
                      color: subTabMarketing === "mensajes" ? "#ffffff" : "var(--text-muted)",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer"
                    }}
                  >
                    {adminLang === "fr" ? "Envoi de Messages" : "Envío de Mensajes"}
                  </button>
                  <button
                    onClick={() => setSubTabMarketing("automatizaciones")}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: subTabMarketing === "automatizaciones" ? "#3b82f6" : "transparent",
                      color: subTabMarketing === "automatizaciones" ? "#ffffff" : "var(--text-muted)",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer"
                    }}
                  >
                    {adminLang === "fr" ? "Automatisations d'E-mails" : "Automatizaciones de Correo"}
                  </button>
                </div>

                {subTabMarketing === "mensajes" ? (
                  <NotificacionesTab
                    alumnos={alumnos as any}
                    canalEnvio={canalEnvio}
                    setCanalEnvio={setCanalEnvio}
                    destinatario={destinatario}
                    setDestinatario={setDestinatario}
                    asuntoMsg={asuntoMsg}
                    setAsuntoMsg={setAsuntoMsg}
                    cuerpoMsg={cuerpoMsg}
                    setCuerpoMsg={setCuerpoMsg}
                    envioExito={envioExito}
                    enviarMensaje={enviarMensaje}
                    lang={adminLang}
                  />
                ) : (
                  <MarketingAutomatizaciones
                    config={config}
                    setConfig={setConfig}
                    alumnosCount={alumnos.length}
                    lang={adminLang}
                  />
                )}
              </div>
            )}

            {/* TAB 6: CONFIGURACION CMS */}
            {activeTab === "configuracion" && (
              <ConfiguracionTab
                config={config}
                setConfig={setConfig}
                configExito={configExito}
                configError={configError}
                guardarConfiguracion={guardarConfiguracionCMS}
                subTabCMS={subTabCMS}
                setSubTabCMS={setSubTabCMS}
                lang={adminLang}
                clases={clases}
              />
            )}

            {/* TAB 7: MANUAL DE OPERACIONES */}
            {activeTab === "manual" && (
              <ManualTab lang={adminLang} />
            )}

            {/* TAB 8: LOGS E HISTORIAL DE CAMBIOS */}
            {activeTab === "logs" && (
              <LogsTab
                inscripciones={inscripcionesLogs}
                clases={clases as any}
                usuarios={alumnos as any}
                recursos={recursos as any}
                lang={adminLang}
              />
            )}

          </div>
        </main>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid var(--border-color)",
          backgroundColor: "#ffffff",
          padding: "24px 0",
          textAlign: "center",
          fontSize: "13px",
          color: "var(--text-muted)"
        }}>
          <div className="container">
            {adminLang === "fr" ? (
              `© ${new Date().getFullYear()} Florentin. Espace Éducatif du Professeur. Tous droits réservés.`
            ) : (
              `© ${new Date().getFullYear()} Florentin. Panel Educativo del Profesor. Todos los derechos reservados.`
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
