"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";
import { MessageSquare, Calendar, BookOpen, Download, TrendingUp, HelpCircle, User, Mail, Lock, Phone, GraduationCap, Globe, Target } from "lucide-react";

interface Clase {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  link: string;
  fecha_original: string;
  reprogramaciones_restantes: number;
}

interface ClasePasada {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  nota: string;
  enlace_grabacion?: string;
}

interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  tipo: string;
  tamaño: string;
  urlArchivo?: string;
}

interface PlanEstudio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  total_clases: number;
  tipo: string;
  nivel: string;
  activo: boolean;
  creado_en?: string;
}

interface Inscripcion {
  id: number;
  usuario_id: string;
  plan_id: number;
  estado_pago: string;
  clases_restantes: number;
  stripe_session_id?: string;
  monto_pagado: number;
  divisa: string;
  creado_en: string;
  planes_estudio?: PlanEstudio | null;
}

interface HoraDisponible {
  display: string;
  utc: string;
}

export default function AlumnoPortal() {
  const [lang, setLang] = useState<Language>("es");
  const [planes, setPlanes] = useState<PlanEstudio[]>([]);
  const [divisa, setDivisa] = useState<"eur" | "usd">("eur");
  const t = translations[lang];

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("florentin_lang", newLang);
  };

  const changeDivisa = (newDivisa: "eur" | "usd") => {
    setDivisa(newDivisa);
    localStorage.setItem("florentin_divisa", newDivisa);
  };

  const formatPrecio = (precioEur: number) => {
    if (divisa === "usd") {
      const precioConvertido = precioEur * 1.10;
      const tieneDecimales = precioConvertido % 1 !== 0;
      return new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD", 
        minimumFractionDigits: tieneDecimales ? 2 : 0,
        maximumFractionDigits: 2 
      }).format(precioConvertido);
    }
    const tieneDecimales = precioEur % 1 !== 0;
    return new Intl.NumberFormat("es-ES", { 
      style: "currency", 
      currency: "EUR", 
      minimumFractionDigits: tieneDecimales ? 2 : 0,
      maximumFractionDigits: 2 
    }).format(precioEur);
  };

  const generarGoogleCalendarLink = (clase: Clase) => {
    const start = new Date(clase.fecha_original);
    const end = new Date(start.getTime() + 50 * 60 * 1000); // 50 minutos de duración

    const formatGDate = (date: Date) => 
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = encodeURIComponent("Clase de Francés con Florentin");
    const dates = `${formatGDate(start)}/${formatGDate(end)}`;
    const details = encodeURIComponent(
      clase.link !== "pendiente" 
        ? `Bonjour! Aquí tienes el enlace para unirte a tu clase de francés: ${clase.link}` 
        : "El profesor asignará el enlace de la clase pronto."
    );
    const location = encodeURIComponent(clase.link !== "pendiente" ? clase.link : "Clase Online (Pendiente)");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const descargarICS = (clase: Clase) => {
    const start = new Date(clase.fecha_original);
    const end = new Date(start.getTime() + 50 * 60 * 1000);

    const formatICSDate = (date: Date) => 
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = "Clase de Frances con Florentin";
    const desc = clase.link !== "pendiente" 
      ? `Enlace a la clase: ${clase.link}` 
      : "El profesor asignara el enlace de la clase pronto.";
    const loc = clase.link !== "pendiente" ? clase.link : "Clase Online";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Florentin//Clases//ES",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `clase-florentin-${clase.id.substring(0, 5)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [minDateReprogramar, setMinDateReprogramar] = useState("");
  
  // Estados adicionales para el wizard de registro
  const [stepRegister, setStepRegister] = useState(1);
  const [registerTelefono, setRegisterTelefono] = useState("");
  const [registerNivel, setRegisterNivel] = useState("A1");
  const [registerZonaHoraria, setRegisterZonaHoraria] = useState("Europe/Paris");
  const [registerObjetivos, setRegisterObjetivos] = useState("");

  // Datos del alumno
  const [alumnoNombre, setAlumnoNombre] = useState("");
  const [planActual, setPlanActual] = useState("Sin plan activo");
  const [clasesRestantes, setClasesRestantes] = useState(0);
  const [totalClases, setTotalClases] = useState(0);
  const [historialPagos, setHistorialPagos] = useState<Inscripcion[]>([]);

  // Clases agendadas y pasadas
  const [clases, setClases] = useState<Clase[]>([]);
  const [clasesPasadas, setClasesPasadas] = useState<ClasePasada[]>([]);

  // Recursos didácticos disponibles
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  // Variables para la reserva de nueva clase
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [reservaExito, setReservaExito] = useState(false);
  const [reservaError, setReservaError] = useState("");
  const [reservaCargando, setReservaCargando] = useState(false);

  const [diasLaborables, setDiasLaborables] = useState<number[]>([1,2,3,4,5]);
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [exclusionesHorario, setExclusionesHorario] = useState<any[]>([]);
  const [horaFin, setHoraFin] = useState("18:00");
  const [almuerzoInicio, setAlmuerzoInicio] = useState("13:00");
  const [almuerzoFin, setAlmuerzoFin] = useState("14:00");
  const [zonaHorariaProfesor, setZonaHorariaProfesor] = useState("Europe/Paris");
  const [userTimeZone, setUserTimeZone] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [horasDisponibles, setHorasDisponibles] = useState<HoraDisponible[]>([]);

  // Estados para reprogramación de clase
  const [reprogramarClaseId, setReprogramarClaseId] = useState<string | null>(null);
  const [activeCalendarMenu, setActiveCalendarMenu] = useState<string | null>(null);
  const [reprogramarFecha, setReprogramarFecha] = useState("");
  const [reprogramarHora, setReprogramarHora] = useState("");
  const [reproHorasOcupadas, setReproHorasOcupadas] = useState<string[]>([]);
  const [reproHorasDisponibles, setReproHorasDisponibles] = useState<HoraDisponible[]>([]);
  const [reproError, setReproError] = useState("");
  const [reproExito, setReproExito] = useState(false);

  // Estados para modal de perfil
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [perfilEditNombre, setPerfilEditNombre] = useState("");
  const [perfilEditTelefono, setPerfilEditTelefono] = useState("");
  const [perfilEditNivel, setPerfilEditNivel] = useState("A1");
  const [perfilEditZonaHoraria, setPerfilEditZonaHoraria] = useState("Europe/Paris");
  const [perfilEditObjetivos, setPerfilEditObjetivos] = useState("");
  const [perfilNewPassword, setPerfilNewPassword] = useState("");
  const [perfilConfirmPassword, setPerfilConfirmPassword] = useState("");
  const [perfilExitoMsg, setPerfilExitoMsg] = useState("");
  const [perfilErrorMsg, setPerfilErrorMsg] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  // Estados para calendario interactivo
  const [mesVisible, setMesVisible] = useState<Date>(new Date());
  const [ocupadasMes, setOcupadasMes] = useState<string[]>([]);

  const cargarDatos = async (userId: string) => {
    setLoading(true);
    try {
      // 1. Obtener perfil
      const { data: perfil } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (perfil) {
        setAlumnoNombre(perfil.nombre || perfil.email);
        setPerfilEditNombre(perfil.nombre || "");
        setPerfilEditTelefono(perfil.telefono || "");
        setPerfilEditNivel(perfil.nivel_frances || "A1");
        setPerfilEditZonaHoraria(perfil.zona_horaria || "Europe/Paris");
        setPerfilEditObjetivos(perfil.objetivos || "");
      }

      // 2. Obtener plan/inscripción activa e historial (sin join directo para evitar errores de FK)
      const { data: inscripciones, error: insError } = await supabase
        .from("inscripciones")
        .select("*")
        .eq("usuario_id", userId)
        .order("creado_en", { ascending: false });

      if (insError) console.error("Error inscripciones:", insError);

      const { data: planesDb } = await supabase
        .from("planes_estudio")
        .select("*")
        .order("orden", { ascending: true })
        .order("precio", { ascending: true });
      if (planesDb) {
        setPlanes(planesDb.filter(p => p.activo));
      }

      if (inscripciones && inscripciones.length > 0) {
        // Enriquecer historial con nombres de planes
        const historialEnriquecido = inscripciones.map(ins => {
          const planInfo = planesDb?.find(p => p.id === ins.plan_id);
          return { ...ins, planes_estudio: planInfo || null };
        });
        setHistorialPagos(historialEnriquecido);

        // Cada compra queda como una inscripción separada (no se fusionan). El saldo
        // visible es la SUMA de todas las compras pagadas, para no perder clases
        // cuando el alumno adquiere un plan nuevo teniendo saldo de uno anterior.
        const planInfoDe = (planId: number) => planesDb?.find(p => p.id === planId);
        const pagadas = inscripciones.filter((i) => i.estado_pago === "pagado");
        if (pagadas.length > 0) {
          const masReciente = pagadas[0];
          const planInfo = planInfoDe(masReciente.plan_id);
          const sumaRestantes = pagadas.reduce((acc, i) => acc + (i.clases_restantes || 0), 0);
          const sumaTotal = pagadas.reduce((acc, i) => acc + (planInfoDe(i.plan_id)?.total_clases ?? (i.plan_id === 1 ? 8 : i.plan_id === 2 ? 12 : 4)), 0);
          setClasesRestantes(sumaRestantes);
          setTotalClases(sumaTotal);
          setPlanActual(planInfo ? planInfo.nombre : (masReciente.plan_id === 1 ? "Curso Principiante A1" : masReciente.plan_id === 2 ? "Conversación Intermedia B2" : "Membresía Mensual Pro"));
        } else {
          setClasesRestantes(0);
          setTotalClases(0);
          setPlanActual("Sin plan activo");
        }
      } else {
        setHistorialPagos([]);
        setClasesRestantes(0);
        setTotalClases(0);
        setPlanActual("Sin plan activo");
      }

      // 3. Obtener clases agendadas y pasadas
      const { data: clasesDb } = await supabase
        .from("clases")
        .select("*")
        .eq("usuario_id", userId)
        .order("fecha_hora", { ascending: true });

      if (clasesDb) {
        const clasesFuturas = clasesDb
          .filter(c => c.estado === "programada")
          .map(c => {
            const dt = new Date(c.fecha_hora);
            return {
              id: c.id.toString(),
              fecha: dt.toLocaleDateString(), // Formato local del alumno
              hora: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              estado: "Programada",
              link: c.enlace_meet || "pendiente",
              fecha_original: c.fecha_hora,
              reprogramaciones_restantes: c.reprogramaciones_restantes !== undefined && c.reprogramaciones_restantes !== null ? c.reprogramaciones_restantes : 2
            };
          });
        setClases(clasesFuturas);

        const clasesHistorial = clasesDb
          .filter(c => c.estado === "completada" || c.estado === "cancelada")
          .map(c => {
            const dt = new Date(c.fecha_hora);
            return {
              id: c.id.toString(),
              fecha: dt.toLocaleDateString(),
              hora: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              estado: c.estado === "completada" ? "Completada" : "Cancelada",
              nota: c.notas_profesor || "Sin comentarios.",
              enlace_grabacion: c.enlace_grabacion || ""
            };
          });
        setClasesPasadas(clasesHistorial);
      }

      // 4. Obtener recursos didácticos asignados a este alumno específicamente
      const { data: asignadosDb, error: asignadosError } = await supabase
        .from("recursos_asignados")
        .select("recurso_id")
        .eq("usuario_id", userId);

      if (asignadosError) console.error("Error obteniendo asignaciones de recursos:", asignadosError);

      if (asignadosDb && asignadosDb.length > 0) {
        const recursoIds = asignadosDb.map(a => a.recurso_id);
        const { data: recursosDb } = await supabase
          .from("recursos")
          .select("*")
          .in("id", recursoIds);

        if (recursosDb) {
          const recursosMap = recursosDb.map((r) => ({
            id: r.id,
            titulo: r.titulo,
            descripcion: r.nivel === "Todos" ? "Material general para todos los niveles" : `Material exclusivo para nivel ${r.nivel}`,
            nivel: r.nivel,
            tipo: r.tipo,
            urlArchivo: r.url_archivo,
            tamaño: r.tipo === "pdf" ? "Documento" : r.tipo === "audio" ? "Audio" : "Video"
          }));
          setRecursos(recursosMap);
        }
      } else {
        setRecursos([]);
      }

      // 5. Obtener configuración de horario
      const { data: configDb } = await supabase
        .from("configuracion_sitio")
        .select("dias_laborables, hora_inicio, hora_fin, almuerzo_inicio, almuerzo_fin, zona_horaria, exclusiones_horario")
        .eq("id", 1)
        .single();
      
      if (configDb) {
        try {
          const dias = JSON.parse(configDb.dias_laborables || "[1,2,3,4,5]");
          setDiasLaborables(dias);
        } catch {}
        try {
          const exclusiones = JSON.parse(configDb.exclusiones_horario || "[]");
          setExclusionesHorario(exclusiones);
        } catch {
          setExclusionesHorario([]);
        }
        setHoraInicio(configDb.hora_inicio || "09:00");
        setHoraFin(configDb.hora_fin || "18:00");
        setAlmuerzoInicio(configDb.almuerzo_inicio || "13:00");
        setAlmuerzoFin(configDb.almuerzo_fin || "14:00");
        setZonaHorariaProfesor(configDb.zona_horaria || "Europe/Paris");
      }

    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setMinDateReprogramar(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    }, 0);
    // Leer parámetros de URL de forma segura
    const params = new URLSearchParams(window.location.search);
    
    // Configurar idioma inicial
    const queryLang = params.get("lang") as Language;
    if (queryLang && (queryLang === "es" || queryLang === "fr" || queryLang === "en")) {
      setTimeout(() => setLang(queryLang), 0);
      localStorage.setItem("florentin_lang", queryLang);
    } else {
      const savedLang = localStorage.getItem("florentin_lang") as Language;
      if (savedLang) setTimeout(() => setLang(savedLang), 0);
    }

    // Configurar divisa inicial
    const queryDivisa = params.get("divisa") as "eur" | "usd";
    if (queryDivisa && (queryDivisa === "eur" || queryDivisa === "usd")) {
      setTimeout(() => setDivisa(queryDivisa), 0);
      localStorage.setItem("florentin_divisa", queryDivisa);
    } else {
      const savedDivisa = localStorage.getItem("florentin_divisa") as "eur" | "usd";
      if (savedDivisa) setTimeout(() => setDivisa(savedDivisa), 0);
    }

    const plan = params.get("plan");
    if (plan) {
      setTimeout(() => {
        setSelectedPlanId(parseInt(plan, 10));
        setIsRegistering(true); // Cambiar a registro si viene con un plan
      }, 0);
    }

    const success = params.get("success");
    const sessionId = params.get("session_id");

    if (success === "true" && sessionId) {
      setTimeout(() => {
        setShowSuccessBanner(true);
      }, 0);
      
      // Llamar al backend para validar y registrar el pago en la base de datos
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Recargar datos del usuario para mostrar su nuevo plan activo
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) cargarDatos(session.user.id);
            });
          }
        })
        .catch(err => console.error("Error verificando pago:", err));

      // Limpiar URL para una experiencia limpia
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Verificar si hay sesión activa al montar
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        cargarDatos(session.user.id);
      } else {
        setLoading(false);
      }
    };
    checkSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        cargarDatos(session.user.id);
      } else {
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [comprarLoading, setComprarLoading] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [simularLoading, setSimularLoading] = useState(false);

  const handleComprarPlan = async (planId: number) => {
    setComprarLoading(planId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Debes iniciar sesión para realizar la compra.");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          usuarioId: session.user.id,
          email: session.user.email,
          nombre: alumnoNombre || "Estudiante de Francés",
          divisa: divisa
        })
      });

      const checkoutData = await res.json();
      if (res.ok && checkoutData.url) {
        window.location.assign(checkoutData.url);
      } else {
        console.error("Error en checkout:", checkoutData.error);
        alert("No se pudo iniciar el checkout. Asegúrate de configurar las credenciales reales de Stripe en .env.local.");
      }
    } catch (err) {
      console.error("Error iniciando compra:", err);
      alert("Error de red al intentar conectar con la pasarela.");
    } finally {
      setComprarLoading(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSimularPago = async (planId: number) => {
    setSimularLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("Debes iniciar sesión para simular el pago.");
        return;
      }

      let planNombre = "Plan Principiante A1-A2";
      let clasesAsignadas = 8;
      if (planId === 2) {
        planNombre = "Plan Intermedio B1-B2";
        clasesAsignadas = 12;
      } else if (planId === 3) {
        planNombre = "Plan Pro (Todos los Niveles)";
        clasesAsignadas = 4;
      }

      // Hacer llamada directa al webhook simulando el evento de Stripe
      const res = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "stripe-signature": "simulado"
        },
        body: JSON.stringify({
          type: "checkout.session.completed",
          data: {
            object: {
              id: `sim_session_${Math.random().toString(36).substring(2, 10)}`,
              customer_details: {
                email: session.user.email,
                name: alumnoNombre || "Alumno Simulado"
              },
              metadata: {
                usuario_id: session.user.id,
                plan_id: planId.toString(),
                plan_nombre: planNombre,
                total_clases: clasesAsignadas.toString()
              }
            }
          }
        })
      });

      if (res.ok) {
        alert("🎉 ¡Simulación Exitosa! El webhook ha procesado el pago. El saldo de clases ha sido asignado.");
        cargarDatos(session.user.id);
      } else {
        const errorData = await res.json();
        console.error("Error simulando pago:", errorData.error);
        alert(`Fallo al simular el pago: ${errorData.error || "Error de servidor"}`);
      }
    } catch (err) {
      console.error("Error en la petición de simulación:", err);
      alert("Error al intentar conectar con la ruta de webhooks.");
    } finally {
      setSimularLoading(false);
    }
  };

  useEffect(() => {
    if (!nuevaFecha) {
      setTimeout(() => setHorasDisponibles([]), 0);
      return;
    }

    const fetchDisponibilidad = async () => {
      try {
        const res = await fetch(`/api/disponibilidad?fecha=${nuevaFecha}`);
        if (res.ok) {
          const data = await res.json();
          setHorasOcupadas(data.ocupadas || []);
        }
      } catch (err) {
        console.error("Error fetching disponibilidad", err);
      }
    };
    fetchDisponibilidad();
  }, [nuevaFecha]);

  // Efecto para obtener la disponibilidad del mes actual
  useEffect(() => {
    const fetchDisponibilidadMes = async () => {
      const year = mesVisible.getFullYear();
      const month = String(mesVisible.getMonth() + 1).padStart(2, '0');
      const mesStr = `${year}-${month}`;
      try {
        const res = await fetch(`/api/disponibilidad?mes=${mesStr}`);
        if (res.ok) {
          const data = await res.json();
          setOcupadasMes(data.ocupadas || []);
        }
      } catch (err) {
        console.error("Error fetching disponibilidad mes", err);
      }
    };
    fetchDisponibilidadMes();
  }, [mesVisible]);

  // Función helper para calcular el estado de disponibilidad de un día del mes
  const getEstadoDia = (diaNum: number) => {
    const dateObj = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), diaNum);
    const dayOfWeek = dateObj.getDay();
    if (!diasLaborables.includes(dayOfWeek)) {
      return "cerrado";
    }

    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(diaNum).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;

    const tieneBloqueoDiaCompleto = exclusionesHorario.some(
      (ex: any) => ex.fecha === dateString && ex.tipo === "dia_completo"
    );
    if (tieneBloqueoDiaCompleto) {
      return "cerrado";
    }
    
    // Si el día es en el pasado (ayer o antes), no se puede reservar
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (dateObj < hoy) {
      return "pasado";
    }

    // Límite de reserva: Máximo 60 días de anticipación
    const limiteFuturo = new Date();
    limiteFuturo.setDate(limiteFuturo.getDate() + 60);
    limiteFuturo.setHours(23, 59, 59, 999);
    if (dateObj > limiteFuturo) {
      return "cerrado"; // Mostrado como deshabilitado
    }

    // Calcular slots totales y ocupados
    const startHourTeacher = parseInt(horaInicio.split(":")[0], 10);
    const endHourTeacher = parseInt(horaFin.split(":")[0], 10);
    const startLunch = parseInt(almuerzoInicio.split(":")[0], 10);
    const endLunch = parseInt(almuerzoFin.split(":")[0], 10);

    let slotsTotales = 0;
    let slotsOcupados = 0;
    // Revisar cada slot horario
    for (let i = startHourTeacher; i < endHourTeacher; i++) {
      const isLunch = i >= startLunch && i < endLunch;
      if (!isLunch) {
        slotsTotales++;
        // Crear fecha del slot en la zona horaria del alumno
        const slotDate = new Date(Number(y), dateObj.getMonth(), Number(d), i, 0, 0);
        const isoString = slotDate.toISOString();
        const isOccupied = ocupadasMes.some(occ => occ.startsWith(isoString.substring(0, 14)));
        if (isOccupied) {
          slotsOcupados++;
        }
      }
    }

    if (slotsTotales === 0) return "cerrado";
    if (slotsOcupados >= slotsTotales) return "completo";
    if (slotsOcupados > 0) return "parcial";
    return "libre";
  };

  // Efecto para calcular las horas disponibles
  useEffect(() => {
    if (!nuevaFecha || !userTimeZone) return;
    
    const startHourTeacher = parseInt(horaInicio.split(":")[0], 10);
    const endHourTeacher = parseInt(horaFin.split(":")[0], 10);
    const startLunch = parseInt(almuerzoInicio.split(":")[0], 10);
    const endLunch = parseInt(almuerzoFin.split(":")[0], 10);
    
    const horasCalculadas: { display: string, utc: string }[] = [];
    const [y, m, d] = nuevaFecha.split("-");
    
    // Iteramos directamente sobre cada hora laboral del profesor en París
    for (let h = startHourTeacher; h < endHourTeacher; h++) {
      const isLunch = h >= startLunch && h < endLunch;
      if (isLunch) continue;

      try {
        // 1. Obtener la equivalencia UTC real de esa hora de París
        const testDateUTC = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0));
        
        // 2. Formatearla a la zona horaria del profesor para ver qué hora da en París
        const formatterTeacher = new Intl.DateTimeFormat('en-US', {
          timeZone: zonaHorariaProfesor,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        });
        
        const formattedStr = formatterTeacher.format(testDateUTC);
        const match = formattedStr.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/);

        if (match) {
          const [_, monthParis, dayParis, yearParis, hourParis, minParis, secParis] = match;
          const dateParisAsUTC = Date.UTC(
            Number(yearParis),
            Number(monthParis) - 1,
            Number(dayParis),
            Number(hourParis),
            Number(minParis),
            Number(secParis)
          );

          // La diferencia pura en ms
          const tzOffsetMs = dateParisAsUTC - testDateUTC.getTime();
          // La fecha UTC real de ese slot en París
          const targetParisAsUTC = Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0);
          const realSlotDateUTC = new Date(targetParisAsUTC - tzOffsetMs);

          // 3. Comprobar si ese día de la semana en París es laborable
          const teacherDateInParisStr = realSlotDateUTC.toLocaleString('en-US', { timeZone: zonaHorariaProfesor });
          const teacherDateInParis = new Date(teacherDateInParisStr);
          const teacherDayNum = teacherDateInParis.getDay();

          if (diasLaborables.includes(teacherDayNum)) {
            const esHoraExcluida = exclusionesHorario.some((ex: any) => {
              if (ex.fecha !== nuevaFecha) return false;
              if (ex.tipo === "dia_completo") return true;
              if (ex.tipo === "rango_horas" && ex.inicio && ex.fin) {
                const startHour = parseInt(ex.inicio.split(":")[0], 10);
                const endHour = parseInt(ex.fin.split(":")[0], 10);
                return h >= startHour && h < endHour;
              }
              return false;
            });

            if (!esHoraExcluida) {
              const isoString = realSlotDateUTC.toISOString();
              // Comprobar si ya existe una clase reservada en esa hora
              const isOccupied = horasOcupadas.some(occ => occ.startsWith(isoString.substring(0, 14)));
              
              if (!isOccupied) {
               // Formatear a la zona horaria del alumno
               const formatterAlumno = new Intl.DateTimeFormat('es-ES', {
                 timeZone: userTimeZone,
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true
               });
               const horaLocalStr = formatterAlumno.format(realSlotDateUTC);
               horasCalculadas.push({ display: horaLocalStr, utc: isoString });
            }
          }
        }
      }
      } catch (err) {
        console.error("Error calculando zona horaria", err);
      }
    }
    
    setTimeout(() => setHorasDisponibles(horasCalculadas), 0);

    if (horasCalculadas.length === 0) {
      setTimeout(() => setReservaError(lang === "fr" ? "Le professeur ne travaille pas ce jour-là" : lang === "en" ? "Teacher is not available on this day" : "El profesor no tiene horas disponibles este día"), 0);
    } else {
      setTimeout(() => setReservaError(""), 0);
    }
  }, [nuevaFecha, horasOcupadas, horaInicio, horaFin, almuerzoInicio, almuerzoFin, diasLaborables, zonaHorariaProfesor, userTimeZone, lang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("Error de acceso: " + error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!nombre) {
      setLoginError("El nombre es requerido");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: nombre
        }
      }
    });

    if (error) {
      setLoading(false);
      setLoginError("Error al registrarse: " + error.message);
    } else if (data.user) {
      // Crear perfil público en la tabla 'usuarios' para asegurar robustez en el registro autónomo
      await supabase.from("usuarios").insert({
        id: data.user.id,
        email: email,
        nombre: nombre,
        rol: "alumno",
        telefono: registerTelefono,
        nivel_frances: registerNivel,
        zona_horaria: registerZonaHoraria,
        objetivos: registerObjetivos,
        idioma: lang
      });

      // Disparar correo de bienvenida automático de Lead Nurturing de forma asíncrona
      fetch("/api/auth/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, idioma: lang })
      }).catch(err => console.error("Error disparando correo de bienvenida:", err));

      // Si se registró con un plan específico, redireccionar de inmediato a Stripe Checkout
      if (selectedPlanId) {
        try {
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planId: selectedPlanId,
              usuarioId: data.user.id,
              email: email,
              nombre: nombre,
              divisa: divisa
            })
          });

          const checkoutData = await res.json();
          if (res.ok && checkoutData.url) {
            window.location.href = checkoutData.url;
            return;
          } else {
            console.error("Error en checkout:", checkoutData.error);
            alert("Cuenta creada con éxito, pero no se pudo iniciar el checkout. Por favor inicia sesión.");
          }
        } catch (checkoutErr: unknown) {
          console.error("Error de red en checkout:", checkoutErr);
          alert("Cuenta creada con éxito. Por favor inicia sesión.");
        }
      } else {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
      }
      setLoading(false);
      setIsRegistering(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setPerfilErrorMsg("");
    setPerfilExitoMsg("");
    setGuardandoPerfil(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(lang === "fr" ? "Aucune session active" : lang === "en" ? "No active session" : "No hay sesión activa");

      // 1. Actualizar Datos en la tabla usuarios
      const { error: nameError } = await supabase
        .from("usuarios")
        .update({ 
          nombre: perfilEditNombre,
          telefono: perfilEditTelefono,
          nivel_frances: perfilEditNivel,
          zona_horaria: perfilEditZonaHoraria,
          objetivos: perfilEditObjetivos
        })
        .eq("id", user.id);

      if (nameError) {
        // Capturar error si falta alguna columna en la base de datos
        if (nameError.message.includes("column")) {
          throw new Error(
            lang === "fr" 
              ? "Erreur de base de données : Veuillez demander à l'administrateur d'exécuter la migration SQL." 
              : lang === "en" 
              ? "Database error: Please ask the administrator to run the SQL migration." 
              : "Error de base de datos: Por favor ejecuta el script de migración SQL en Supabase:\n\nALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono TEXT, ADD COLUMN IF NOT EXISTS nivel_frances TEXT DEFAULT 'A1', ADD COLUMN IF NOT EXISTS zona_horaria TEXT DEFAULT 'Europe/Paris', ADD COLUMN IF NOT EXISTS objetivos TEXT;"
          );
        }
        throw nameError;
      }
      setAlumnoNombre(perfilEditNombre || user.email || "");

      // 2. Actualizar Contraseña en Supabase Auth (si ingresó algo)
      if (perfilNewPassword) {
        if (perfilNewPassword !== perfilConfirmPassword) {
          throw new Error(
            lang === "fr" ? "Les mots de passe ne correspondent pas" :
            lang === "en" ? "Passwords do not match" :
            "Las contraseñas no coinciden"
          );
        }
        if (perfilNewPassword.length < 6) {
          throw new Error(
            lang === "fr" ? "Le mot de passe doit comporter au menos 6 caractères" :
            lang === "en" ? "Password must be at least 6 characters" :
            "La contraseña debe tener al menos 6 caracteres"
          );
        }

        const { error: pwdError } = await supabase.auth.updateUser({
          password: perfilNewPassword
        });

        if (pwdError) throw pwdError;
      }

      setPerfilExitoMsg(
        lang === "fr" ? "Profil mis à jour avec succès !" :
        lang === "en" ? "Profile updated successfully!" :
        "¡Perfil actualizado con éxito!"
      );
      setPerfilNewPassword("");
      setPerfilConfirmPassword("");

      // Ocultar modal tras 2 segundos
      setTimeout(() => {
        setShowPerfilModal(false);
        setPerfilExitoMsg("");
      }, 2000);

    } catch (err: any) {
      setPerfilErrorMsg(err.message);
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaFecha || !nuevaHora) {
      setReservaError(
        lang === "fr" ? "Veuillez sélectionner une date et une heure valides." :
        lang === "en" ? "Please select a valid date and time." :
        "Por favor selecciona una fecha y hora válidas."
      );
      return;
    }

    if (clasesRestantes <= 0) {
      setReservaError(
        lang === "fr" ? "Vous n'avez plus de cours dans votre forfait. Achetez un nouveau forfait." :
        lang === "en" ? "You have no remaining classes in your plan. Purchase a new plan to schedule." :
        "No tienes clases restantes en tu plan. Adquiere un nuevo plan para agendar."
      );
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Sincronizar la zona horaria elegida con el perfil, sin bloquear la reserva si falla.
    if (userTimeZone) {
      supabase.from("usuarios").update({ zona_horaria: userTimeZone }).eq("id", user.id)
        .then(({ error }) => { if (error) console.warn("No se pudo sincronizar zona horaria:", error.message); });
    }

    // Llamar al backend para reserva ATÓMICA con validación anti-colisión
    try {
      setReservaError("");
      setReservaCargando(true);
      const res = await fetch("/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: user.id,
          fecha_hora: nuevaHora  // Ya es un ISO string UTC
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Manejar errores específicos
        if (res.status === 409) {
          // Colisión de horario
          setReservaError(
            lang === "fr" ? "Ce créneau vient d'être réservé par un autre élève. Veuillez choisir une autre heure." :
            lang === "en" ? "This time slot was just booked by another student. Please choose another time." :
            "Este horario ya fue reservado por otro alumno. Por favor selecciona otra hora."
          );
          // Refrescar las horas ocupadas
          const refreshRes = await fetch(`/api/disponibilidad?fecha=${nuevaFecha}`);
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            setHorasOcupadas(refreshData.ocupadas || []);
          }
        } else if (res.status === 403) {
          setReservaError(
            lang === "fr" ? "Vous n'avez plus de cours disponibles." :
            lang === "en" ? "You have no remaining classes." :
            data.error || "No tienes clases restantes."
          );
        } else {
          setReservaError(data.error || "Error al crear la reserva.");
        }
        return;
      }

      // Éxito
      setReservaExito(true);
      setReservaError("");
      setNuevaFecha("");
      setNuevaHora("");

      // Actualizar el conteo de clases localmente
      if (data.clases_restantes !== undefined) {
        setClasesRestantes(data.clases_restantes);
      }

      // Recargar datos completos
      cargarDatos(user.id);

      setTimeout(() => setReservaExito(false), 5000);

    } catch (err) {
      console.error("Error en reserva:", err);
      setReservaError(
        lang === "fr" ? "Erreur de connexion au serveur." :
        lang === "en" ? "Server connection error." :
        "Error de conexión con el servidor."
      );
    } finally {
      setReservaCargando(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancelarClase = async (id: string) => {
    const confirmacion = window.confirm(
      lang === "fr" ? "Êtes-vous sûr de vouloir annuler ce cours ?" :
      lang === "en" ? "Are you sure you want to cancel this class?" :
      "¿Estás seguro de que deseas cancelar esta clase?"
    );
    if (!confirmacion) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const res = await fetch("/api/cancelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clase_id: id,
          usuario_id: user.id
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || (
          lang === "fr" ? "Erreur al annuler le cours." :
          lang === "en" ? "Error canceling class." :
          "Error al cancelar la clase."
        ));
        return;
      }

      alert(
        lang === "fr" ? "Cours annulé avec succès. Votre solde a été rétabli." :
        lang === "en" ? "Class canceled successfully. Your balance has been restored." :
        "Clase cancelada exitosamente. Tu saldo de clase ha sido devuelto."
      );

      if (data.clases_restantes !== undefined) {
        setClasesRestantes(data.clases_restantes);
      }

      cargarDatos(user.id);

    } catch (err) {
      console.error("Error al cancelar:", err);
      alert(
        lang === "fr" ? "Erreur de connexion au serveur." :
        lang === "en" ? "Server connection error." :
        "Error de conexión con el servidor."
      );
    }
  };

  const fetchDisponibilidadReprogramar = async (fechaSeleccionada: string) => {
    if (!fechaSeleccionada) return;
    try {
      setReproError("");
      const res = await fetch(`/api/disponibilidad?fecha=${fechaSeleccionada}`);
      if (!res.ok) throw new Error("Error fetching availability");
      const data = await res.json();
      setReproHorasOcupadas(data.ocupadas || []);
    } catch (err) {
      console.error(err);
      setReproError(
        lang === "fr" ? "Erreur lors de la récupération des horaires." :
        lang === "en" ? "Error fetching schedule availability." :
        "Error al obtener horarios disponibles."
      );
    }
  };

  // Efecto para recalcular horas disponibles al cambiar fecha de reprogramación
  useEffect(() => {
    if (!reprogramarFecha) {
      setTimeout(() => setReproHorasDisponibles([]), 0);
      return;
    }

    const startHourTeacher = parseInt(horaInicio.split(":")[0], 10);
    const endHourTeacher = parseInt(horaFin.split(":")[0], 10);
    const startLunch = parseInt(almuerzoInicio.split(":")[0], 10);
    const endLunch = parseInt(almuerzoFin.split(":")[0], 10);
    
    const horasCalculadas: { display: string, utc: string }[] = [];
    const [y, m, d] = reprogramarFecha.split("-");

    for (let h = startHourTeacher; h < endHourTeacher; h++) {
      const isLunch = h >= startLunch && h < endLunch;
      if (isLunch) continue;

      try {
        // 1. Obtener la equivalencia UTC real de esa hora de París
        const testDateUTC = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0));
        
        // 2. Formatearla a la zona horaria del profesor
        const formatterTeacher = new Intl.DateTimeFormat('en-US', {
          timeZone: zonaHorariaProfesor,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        });
        
        const formattedStr = formatterTeacher.format(testDateUTC);
        const match = formattedStr.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/);

        if (match) {
          const [_, monthParis, dayParis, yearParis, hourParis, minParis, secParis] = match;
          const dateParisAsUTC = Date.UTC(
            Number(yearParis),
            Number(monthParis) - 1,
            Number(dayParis),
            Number(hourParis),
            Number(minParis),
            Number(secParis)
          );

          // La diferencia pura en ms
          const tzOffsetMs = dateParisAsUTC - testDateUTC.getTime();
          // La fecha UTC real de ese slot en París
          const targetParisAsUTC = Date.UTC(Number(y), Number(m) - 1, Number(d), h, 0, 0);
          const realSlotDateUTC = new Date(targetParisAsUTC - tzOffsetMs);

          // 3. Comprobar si ese día de la semana en París es laborable
          const teacherDateInParisStr = realSlotDateUTC.toLocaleString('en-US', { timeZone: zonaHorariaProfesor });
          const teacherDateInParis = new Date(teacherDateInParisStr);
          const teacherDayNum = teacherDateInParis.getDay();

          if (diasLaborables.includes(teacherDayNum)) {
            const isoString = realSlotDateUTC.toISOString();
            const isOccupied = reproHorasOcupadas.some(occ => occ.startsWith(isoString.substring(0, 14)));

            if (!isOccupied) {
              // Formatear a la zona horaria del alumno
              const formatterAlumno = new Intl.DateTimeFormat('es-ES', {
                timeZone: userTimeZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              const horaLocalStr = formatterAlumno.format(realSlotDateUTC);
              
              horasCalculadas.push({
                display: `${horaLocalStr}`,
                utc: isoString
              });
            }
          }
        }
      } catch (err) {
        console.error("Error calculando reprogramacion", err);
      }
    }

    setTimeout(() => setReproHorasDisponibles(horasCalculadas), 0);
  }, [reprogramarFecha, reproHorasOcupadas, horaInicio, horaFin, almuerzoInicio, almuerzoFin, diasLaborables, zonaHorariaProfesor, userTimeZone]);

  const handleReprogramarClase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reprogramarClaseId || !reprogramarFecha || !reprogramarHora) {
      setReproError(
        lang === "fr" ? "Veuillez sélectionner une date et une heure." :
        lang === "en" ? "Please select a date and a time." :
        "Por favor selecciona una fecha y hora válidas."
      );
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Sincronizar la zona horaria elegida con el perfil, sin bloquear la reprogramación si falla.
    if (userTimeZone) {
      supabase.from("usuarios").update({ zona_horaria: userTimeZone }).eq("id", user.id)
        .then(({ error }) => { if (error) console.warn("No se pudo sincronizar zona horaria:", error.message); });
    }

    try {
      setReproError("");
      const res = await fetch("/api/reprogramar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clase_id: reprogramarClaseId,
          usuario_id: user.id,
          nueva_fecha_hora: reprogramarHora
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setReproError(data.error || "Error al reprogramar la clase");
        return;
      }

      setReproExito(true);
      setTimeout(() => {
        setReproExito(false);
        setReprogramarClaseId(null);
        setReprogramarFecha("");
        setReprogramarHora("");
        cargarDatos(user.id);
      }, 2000);

    } catch (err) {
      console.error(err);
      setReproError(
        lang === "fr" ? "Erreur de connexion au serveur." :
        lang === "en" ? "Server connection error." :
        "Error de conexión con el servidor."
      );
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-main)" }}>
        <p style={{ fontSize: "16px", fontWeight: 600 }}>
          {lang === "fr" ? "Chargement du portail..." : lang === "en" ? "Loading portal..." : "Cargando portal..."}
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 40%), var(--bg-main)",
        padding: "24px"
      }}>
        <div style={{ maxWidth: "420px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "200px", height: "60px", backgroundColor: "#ffffff", padding: "8px", borderRadius: "12px", boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image 
                  src="/logo.png" 
                  alt="Logo Florentin" 
                  fill
                  sizes="200px"
                  style={{ objectFit: "contain", padding: "6px" }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback" style={{ display: "none", width: "100%", height: "100%", color: "#000000", fontWeight: 900, fontSize: "18px", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)" }}>
                  FLORENTIN
                </div>
              </div>
            </Link>
            <h2 style={{ fontSize: "20px", marginTop: "16px", color: "var(--text-main)", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
              {isRegistering ? t.portalTitleRegister : t.portalTitleLogin}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
              {isRegistering ? t.portalSubtitleRegister : t.portalSubtitleLogin}
            </p>
          </div>

          {/* Selectores de Idioma y Divisa */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
            <select
              aria-label="Selector de Idioma"
              value={lang}
              onChange={(e) => changeLang(e.target.value as Language)}
              style={{
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "rgba(0,0,0,0.03)",
                border: "1px solid var(--border-color)",
                borderRadius: "20px",
                color: "var(--text-main)",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇬🇧 EN</option>
            </select>

            <select
              aria-label="Selector de Divisa"
              value={divisa}
              onChange={(e) => changeDivisa(e.target.value as "eur" | "usd")}
              style={{
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "rgba(0,0,0,0.03)",
                border: "1px solid var(--border-color)",
                borderRadius: "20px",
                color: "var(--text-main)",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="eur">€ EUR</option>
              <option value="usd">$ USD</option>
            </select>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (isRegistering && stepRegister === 1) {
                // Prevenir envío y avanzar al paso 2
                if (!nombre || !email || !password) {
                  setLoginError(lang === "fr" ? "Veuillez remplir tous les champs." : lang === "en" ? "Please fill all fields." : "Por favor, completa todos los campos.");
                  return;
                }
                if (password.length < 6) {
                  setLoginError(lang === "fr" ? "Le mot de passe doit comporter au moins 6 caractères." : lang === "en" ? "Password must be at least 6 characters." : "La contraseña debe tener al menos 6 caracteres.");
                  return;
                }
                setStepRegister(2);
                setLoginError("");
                return;
              }
              isRegistering ? handleRegister(e) : handleLogin(e);
            }} 
            className="card"
          >
            {/* Registro Paso 1 o Login Normal */}
            {(!isRegistering || (isRegistering && stepRegister === 1)) && (
              <>
                {isRegistering && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="register-nombre">{t.fullName}</label>
                    <input
                      className="form-control"
                      type="text"
                      id="register-nombre"
                      placeholder="Ej. Sofía Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">{t.email}</label>
                  <input
                    className="form-control"
                    type="email"
                    id="login-email"
                    placeholder="alumno@prueba.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">{t.password}</label>
                  <input
                    className="form-control"
                    type="password"
                    id="login-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  {isRegistering 
                    ? (lang === "fr" ? "Étape Suivante ➔" : lang === "en" ? "Next Step ➔" : "Siguiente Paso ➔") 
                    : t.loginBtn}
                </button>
              </>
            )}

            {/* Registro Paso 2: Información de Aprendizaje */}
            {isRegistering && stepRegister === 2 && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "hsl(var(--accent-hsl))" }}>
                    {lang === "fr" ? "ÉTAPE 2 SUR 2" : lang === "en" ? "STEP 2 OF 2" : "PASO 2 DE 2"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {lang === "fr" ? "Profil d'Étudiant" : lang === "en" ? "Student Profile" : "Perfil de Estudiante"}
                  </span>
                </div>

                {/* WhatsApp */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-telefono" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Numéro WhatsApp" : lang === "en" ? "WhatsApp Number" : "Número de WhatsApp"}
                  </label>
                  <input
                    className="form-control"
                    type="tel"
                    id="register-telefono"
                    placeholder="ej: +51 987 654 321"
                    value={registerTelefono}
                    onChange={(e) => setRegisterTelefono(e.target.value)}
                  />
                </div>

                {/* Grid para Nivel y Zona Horaria */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="register-nivel" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <GraduationCap size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                      {lang === "fr" ? "Niveau" : lang === "en" ? "Level" : "Nivel"}
                    </label>
                    <select
                      className="form-control"
                      id="register-nivel"
                      value={registerNivel}
                      onChange={(e) => setRegisterNivel(e.target.value)}
                      style={{ padding: "10px", appearance: "auto" }}
                    >
                      <option value="A1">A1 (Principiante)</option>
                      <option value="A2">A2 (Básico)</option>
                      <option value="B1">B1 (Intermedio)</option>
                      <option value="B2">B2 (Avanzado)</option>
                      <option value="C1">C1 (Experto)</option>
                      <option value="C2">C2 (Bilingüe)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="register-timezone" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Globe size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                      {lang === "fr" ? "Timezone" : lang === "en" ? "Timezone" : "Zona Horaria"}
                    </label>
                    <select
                      className="form-control"
                      id="register-timezone"
                      value={registerZonaHoraria}
                      onChange={(e) => setRegisterZonaHoraria(e.target.value)}
                      style={{ padding: "10px", appearance: "auto" }}
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/Bogota">America/Bogota</option>
                      <option value="America/Mexico_City">America/Mexico_City</option>
                      <option value="America/Santiago">America/Santiago</option>
                      <option value="America/Argentina/Buenos_Aires">America/Buenos_Aires</option>
                      <option value="America/Caracas">America/Caracas</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>

                {/* Objetivos */}
                <div className="form-group">
                  <label className="form-label" htmlFor="register-objetivos" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Target size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Objectifs" : lang === "en" ? "Goals" : "Objetivos y Metas"}
                  </label>
                  <textarea
                    className="form-control"
                    id="register-objetivos"
                    rows={2}
                    placeholder={lang === "fr" ? "Quels sont vos objectifs ?" : lang === "en" ? "What are your goals?" : "¿Qué te gustaría lograr con el francés?"}
                    value={registerObjetivos}
                    onChange={(e) => setRegisterObjetivos(e.target.value)}
                    style={{ resize: "none" }}
                  ></textarea>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => {
                      setStepRegister(1);
                      setLoginError("");
                    }}
                    style={{ flex: 1, padding: "10px" }}
                  >
                    {lang === "fr" ? "Retour" : lang === "en" ? "Back" : "Atrás"}
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 2, padding: "10px" }}
                  >
                    {t.registerBtn}
                  </button>
                </div>
              </>
            )}

            {loginError && (
              <div style={{
                marginTop: "16px",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(220, 53, 69, 0.1)",
                color: "darkred",
                fontSize: "13px",
                textAlign: "center"
              }}>
                {loginError}
              </div>
            )}


            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setStepRegister(1);
                  setLoginError("");
                }}
                style={{ background: "none", border: "none", color: "hsl(var(--accent-hsl))", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
              >
                {isRegistering ? t.hasAccount : t.noAccount}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px" }}>
            <Link href="/" style={{ color: "hsl(var(--accent-hsl))", fontWeight: 600 }}>{t.backHome}</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
        padding: "16px 0"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
              <div style={{ position: "relative", width: "120px", height: "36px" }}>
                <Image 
                  src="/logo.png" 
                  alt="Logo Florentin" 
                  fill
                  sizes="120px"
                  style={{ objectFit: "contain", objectPosition: "left" }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="logo-fallback" style={{ display: "none", width: "100%", height: "100%", color: "var(--text-main)", fontWeight: 900, fontSize: "14px", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)" }}>
                  FLORENTIN
                </div>
              </div>
            </Link>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              color: "#3b82f6",
              padding: "2px 8px",
              borderRadius: "100px",
              textTransform: "uppercase"
            }}>
              Alumno
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Selectores de Idioma y Divisa */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                aria-label="Selector de Idioma"
                value={lang}
                onChange={(e) => changeLang(e.target.value as Language)}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(0,0,0,0.03)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "20px",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
              </select>

              <select
                aria-label="Selector de Divisa"
                value={divisa}
                onChange={(e) => changeDivisa(e.target.value as "eur" | "usd")}
                style={{
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(0,0,0,0.03)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "20px",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="eur">€ EUR</option>
                <option value="usd">$ USD</option>
              </select>
            </div>

            <span style={{ fontSize: "14px", fontWeight: 600 }}>{alumnoNombre}</span>
            <button 
              className="btn btn-outline" 
              style={{ padding: "6px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }} 
              onClick={() => setShowPerfilModal(true)}
            >
              ⚙️ {lang === "fr" ? "Profil" : lang === "en" ? "Profile" : "Mi Perfil"}
            </button>
            <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleSignOut}>
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px 0", backgroundColor: "rgba(20, 23, 26, 0.01)" }}>
        <div className="container">
          {showSuccessBanner && (
            <div style={{
              padding: "16px",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              color: "green",
              fontSize: "15px",
              borderRadius: "var(--radius-md)",
              textAlign: "center",
              fontWeight: 600,
              marginBottom: "32px",
              border: "1px solid rgba(40, 167, 69, 0.2)"
            }}>
              {lang === "fr" 
                ? "🎉 Félicitations ! Votre paiement a été traité avec succès. Votre forfait est actif et vous pouvez maintenant réserver vos cours."
                : lang === "en"
                ? "🎉 Congratulations! Your payment has been processed successfully. Your plan is active and you can now book lessons."
                : "🎉 ¡Felicidades! Tu pago ha sido procesado con éxito. Tu plan está activo y ya puedes reservar clases."}
            </div>
          )}
          
          {/* Banner Resumen del Plan */}
          <div className="card" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            alignItems: "center",
            background: "linear-gradient(135deg, hsl(var(--primary-hsl)), hsl(var(--primary-light-hsl)))",
            color: "#ffffff",
            marginBottom: "40px",
            borderColor: "transparent"
          }}>
            <div>
              <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>{t.myPlan}</p>
              <h2 style={{ color: "#ffffff", fontSize: "24px", margin: "8px 0" }}>
                {planActual === "Sin plan activo" 
                  ? (lang === "fr" ? "Aucun plan actif" : lang === "en" ? "No active plan" : "Sin plan activo") 
                  : planActual}
              </h2>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                {lang === "fr" 
                  ? "Accès actif aux cours virtuels et matériel exclusif."
                  : lang === "en"
                  ? "Active access to virtual classes and exclusive materials."
                  : "Acceso activo a clases virtuales y material exclusivo."}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", fontWeight: 800, color: "hsl(var(--accent-hsl))" }}>
                {clasesRestantes} <span style={{ fontSize: "18px", fontWeight: 500, color: "#ffffff", opacity: 0.8 }}>/ {totalClases}</span>
              </div>
              <p style={{ fontSize: "12px", opacity: 0.8 }}>{t.remainingClasses}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="#reservar" className="btn btn-accent" style={{ color: "#14171a" }}>{t.reserveBtn}</a>
            </div>
          </div>

          {(
            <div className="card" style={{ marginBottom: "40px", padding: "32px", border: "1px solid var(--border-color)" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>{t.buyPlanTitle}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                  {t.buyPlanDesc}
                </p>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px"
              }}>
                
                {planes.map((plan, idx) => (
                  <div key={plan.id} style={{
                    padding: "24px",
                    borderRadius: "var(--radius-md)",
                    border: idx === 1 ? "1px solid hsl(var(--accent-hsl))" : "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-main)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    boxShadow: idx === 1 ? "0 4px 12px rgba(212, 163, 89, 0.05)" : "none"
                  }}>
                    {idx === 1 && (
                      <div style={{
                        position: "absolute",
                        top: "-12px",
                        right: "16px",
                        backgroundColor: "hsl(var(--accent-hsl))",
                        color: "#0f172a",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "2px 10px",
                        borderRadius: "100px"
                      }}>
                        {t.recommended}
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: idx === 1 ? "hsl(var(--accent-hsl))" : "var(--text-muted)", letterSpacing: "1px" }}>
                        {plan.nivel === "Todos" ? (lang === "fr" ? "TOUS NIVEAUX" : lang === "en" ? "ALL LEVELS" : "TODOS LOS NIVELES") : (lang === "fr" ? `NIVEAU ${plan.nivel}` : lang === "en" ? `LEVEL ${plan.nivel}` : `NIVEL ${plan.nivel}`)}
                      </span>
                      <h4 style={{ fontSize: "18px", margin: "8px 0" }}>{plan.nombre}</h4>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "hsl(var(--primary-hsl))", marginBottom: "12px" }}>
                        {formatPrecio(plan.precio)}
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>
                          / {plan.total_clases} {t.planClasses}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                        {plan.descripcion}
                      </p>
                    </div>
                    {plan.tipo === "clase_gratis" || Number(plan.precio) === 0 ? (
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33685744973'}?text=${encodeURIComponent(
                          lang === "fr" ? "Bonjour Florentin, je voudrais réserver mon cours d'essai gratuit." :
                          lang === "en" ? "Hi Florentin, I want to book my free trial class." :
                          "Hola Florentin, quiero agendar mi clase de prueba gratuita."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={idx === 1 ? "btn btn-accent" : "btn btn-primary"}
                        style={{ width: "100%", fontSize: "13px", color: idx === 1 ? "#14171a" : undefined, textAlign: "center" }}
                      >
                        {lang === "fr" ? "Réserver via WhatsApp" : lang === "en" ? "Book via WhatsApp" : "Agendar por WhatsApp"}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleComprarPlan(plan.id)}
                        disabled={comprarLoading !== null}
                        className={idx === 1 ? "btn btn-accent" : "btn btn-primary"}
                        style={{ width: "100%", fontSize: "13px", color: idx === 1 ? "#14171a" : undefined }}
                      >
                        {comprarLoading === plan.id ? (lang === "fr" ? "Chargement..." : lang === "en" ? "Loading..." : "Cargando...") : t.buyBtn}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* El panel de simulación ha sido removido porque Stripe ya está activo */}
            </div>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "40px"
          }}>
            
            {/* Columna Izquierda: Clases y Reservas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              
              {/* Clases Agendadas */}
              <div className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Calendar size={20} className="text-[#3b82f6] shrink-0" /> {t.scheduledClasses}
                </h3>
                {clases.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                    {t.noClasses}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {clases.map((clase) => (
                      <div key={clase.id} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-main)"
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "15px" }}>
                            {clase.fecha}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                            {lang === "fr" ? "Heure" : lang === "en" ? "Time" : "Hora"}: {clase.hora} • {t.teacher}: Florentin
                          </div>
                          <div style={{ 
                            fontSize: "11px", 
                            color: clase.reprogramaciones_restantes > 0 ? "var(--text-muted)" : "#ef4444", 
                            marginTop: "6px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            🔄 {lang === "fr" ? "Changements restants :" : lang === "en" ? "Remaining changes:" : "Intentos de cambio restantes:"} {clase.reprogramaciones_restantes}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>
                          {clase.link && clase.link !== "pendiente" && !clase.link.includes("abc-defg-hij") && (
                            <>
                              <button
                                onClick={() => setActiveCalendarMenu(activeCalendarMenu === clase.id ? null : clase.id)}
                                className="btn btn-outline"
                                style={{
                                  padding: "6px 10px",
                                  fontSize: "12px",
                                  borderRadius: "var(--radius-sm)",
                                  borderColor: activeCalendarMenu === clase.id ? "hsl(var(--accent-hsl))" : "var(--border-color)",
                                  color: activeCalendarMenu === clase.id ? "hsl(var(--accent-hsl))" : "var(--text-main)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer"
                                }}
                                title={lang === "fr" ? "Ajouter au calendrier" : lang === "en" ? "Add to calendar" : "Agregar al calendario"}
                              >
                                📅
                              </button>

                              {activeCalendarMenu === clase.id && (
                                <div style={{
                                  position: "absolute",
                                  bottom: "calc(100% + 8px)",
                                  left: 0,
                                  backgroundColor: "var(--bg-main)",
                                  border: "1px solid var(--border-color)",
                                  borderRadius: "var(--radius-md)",
                                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
                                  padding: "8px",
                                  zIndex: 50,
                                  minWidth: "180px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px"
                                }}>
                                  <a
                                    href={generarGoogleCalendarLink(clase)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setActiveCalendarMenu(null)}
                                    style={{
                                      display: "block",
                                      padding: "8px 12px",
                                      fontSize: "12px",
                                      color: "var(--text-main)",
                                      textDecoration: "none",
                                      borderRadius: "var(--radius-sm)",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      transition: "background-color 0.2s"
                                    }}
                                    className="calendar-dropdown-item"
                                  >
                                    🔵 Google Calendar
                                  </a>
                                  <button
                                    onClick={() => {
                                      descargarICS(clase);
                                      setActiveCalendarMenu(null);
                                    }}
                                    style={{
                                      display: "block",
                                      padding: "8px 12px",
                                      fontSize: "12px",
                                      color: "var(--text-main)",
                                      backgroundColor: "transparent",
                                      border: "none",
                                      borderRadius: "var(--radius-sm)",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      width: "100%",
                                      transition: "background-color 0.2s"
                                    }}
                                    className="calendar-dropdown-item"
                                  >
                                    📅 Apple / Outlook (.ics)
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          {clase.link && clase.link !== "pendiente" && !clase.link.includes("abc-defg-hij") ? (
                            <a href={clase.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }}>
                              {t.join}
                            </a>
                          ) : (
                            <span style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 700,
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: "rgba(249, 115, 22, 0.08)",
                              color: "#f97316",
                              border: "1px solid rgba(249, 115, 22, 0.15)"
                            }}>
                              {lang === "fr" ? "⏳ Lien en attente" : lang === "en" ? "⏳ Link pending" : "⏳ Link pendiente"}
                            </span>
                          )}
                          {(() => {
                            const fechaClase = new Date(clase.fecha_original);
                            const ahora = new Date();
                            const diffHoras = (fechaClase.getTime() - ahora.getTime()) / (1000 * 60 * 60);
                            const puedeReprogramar = diffHoras >= 24 && clase.reprogramaciones_restantes > 0;

                            return (
                              <button
                                onClick={() => {
                                  if (puedeReprogramar) {
                                    setReprogramarClaseId(clase.id);
                                    setReprogramarFecha("");
                                    setReprogramarHora("");
                                  }
                                }}
                                disabled={!puedeReprogramar}
                                title={
                                  clase.reprogramaciones_restantes <= 0
                                    ? (lang === "fr" ? "Limite de changements épuisée." : lang === "en" ? "Change limit exhausted." : "Límite de cambios agotado.")
                                    : diffHoras < 24
                                    ? (lang === "fr" ? "Les modifications doivent être faites 24h à l'avance." : lang === "en" ? "Changes must be done 24h in advance." : "Las modificaciones deben realizarse con 24h de anticipación.")
                                    : (lang === "fr" ? "Modifier l'horaire" : lang === "en" ? "Reschedule class" : "Reprogramar clase")
                                }
                                className="btn btn-outline"
                                style={{
                                  padding: "6px 14px",
                                  fontSize: "12px",
                                  borderRadius: "var(--radius-sm)",
                                  opacity: puedeReprogramar ? 1 : 0.4,
                                  cursor: puedeReprogramar ? "pointer" : "not-allowed"
                                }}
                              >
                                🔄 {lang === "fr" ? "Reprogrammer" : lang === "en" ? "Reschedule" : "Reprogramar"}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Caja de Políticas y Soporte */}
                <div style={{
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(var(--primary-rgb), 0.03)",
                  border: "1px dashed var(--border-color)"
                }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                    ℹ️ {lang === "fr" ? "Politiques de cours" : lang === "en" ? "Class Policies" : "Políticas y Reglas del Aula"}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px", lineHeight: "1.4" }}>
                    <li>
                      <strong>{lang === "fr" ? "Límite de 24h :" : lang === "en" ? "24h Limit:" : "Límite de 24 horas:"}</strong> {lang === "fr" ? "Vous pouvez modifier l'horaire de vos cours jusqu'à 24 heures avant le début." : lang === "en" ? "You can reschedule your classes up to 24 hours before they start." : "Puedes reprogramar tus clases hasta con un mínimo de 24 horas de antelación."}
                    </li>
                    <li>
                      <strong>{lang === "fr" ? "Tentatives de changement :" : lang === "en" ? "Change attempts:" : "Intentos de cambio:"}</strong> {lang === "fr" ? "Chaque cours peut être reprogrammé un maximum de 2 fois." : lang === "en" ? "Each class can be rescheduled a maximum of 2 times." : "Cada clase individual se puede reprogramar un máximo de 2 veces."}
                    </li>
                    <li>
                      <strong>{lang === "fr" ? "Assistance :" : lang === "en" ? "Support:" : "Soporte Técnico:"}</strong> {lang === "fr" ? "Si vous ne pouvez pas modifier un cours ou si vous avez des réclamations, veuillez contacter l'administrateur avec votre ID d'achat." : lang === "en" ? "If you cannot reschedule or have a claim, contact the administrator with your Purchase ID." : "Si no puedes mover tu clase en el sistema o tienes algún reclamo, ponte en contacto con el administrador/profesor con tu ID de Compra."}
                    </li>
                  </ul>
                  
                  <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {lang === "fr" ? "ID d'achat actif :" : lang === "en" ? "Active Purchase ID:" : "ID de Compra Activa:"} <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, fontFamily: "monospace" }}>
                      {(() => {
                        const pagoActivo = historialPagos.find(p => p.estado_pago === 'pagado');
                        return pagoActivo ? String(pagoActivo.id).substring(0, 8) : "N/A";
                      })()}...
                      </code>
                    </span>
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33685744973'}?text=${encodeURIComponent(
                        lang === "fr" ? "Bonjour Florentin, j'ai besoin d'aide pour reprogrammer un cours. Mon ID d'achat est : " : 
                        lang === "en" ? "Hello Florentin, I need help rescheduling a class. My Purchase ID is: " :
                        "Hola Florentin, necesito ayuda para reprogramar una clase. Mi ID de Compra es: "
                      )}${historialPagos.find(p => p.estado_pago === 'pagado')?.id || 'N/A'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#25d366",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <MessageSquare size={14} className="shrink-0" /> {lang === "fr" ? "Contacter Support" : lang === "en" ? "Contact Support" : "Contactar al Administrador"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario de Reserva */}
              <div id="reservar" className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{t.scheduleNew}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
                  {t.scheduleDesc}
                </p>

                <form onSubmit={handleReserva}>
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      🌐 {lang === "fr" ? "Votre zone horaire" : lang === "en" ? "Your Time Zone" : "Tu Zona Horaria"}
                    </label>
                    <select
                      className="form-control"
                      value={userTimeZone}
                      onChange={(e) => setUserTimeZone(e.target.value)}
                      style={{ cursor: "pointer", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="Europe/Paris">París, Francia (CET/CEST)</option>
                      <option value="Europe/Madrid">Madrid, España (CET/CEST)</option>
                      <option value="America/Lima">Lima, Perú (PET - UTC-5)</option>
                      <option value="America/Bogota">Bogotá, Colombia (COT - UTC-5)</option>
                      <option value="America/Mexico_City">Ciudad de México (CST - UTC-6)</option>
                      <option value="America/Santiago">Santiago, Chile (CLT - UTC-4)</option>
                      <option value="America/Argentina/Buenos_Aires">Buenos Aires, Argentina (ART - UTC-3)</option>
                      <option value="America/Caracas">Caracas, Venezuela (VET - UTC-4)</option>
                      <option value="America/New_York">Nueva York, EE.UU. (EST/EDT)</option>
                      <option value="America/Guayaquil">Quito, Ecuador (ECT - UTC-5)</option>
                      <option value="America/La_Paz">La Paz, Bolivia (BOT - UTC-4)</option>
                      <option value="America/Montevideo">Montevideo, Uruguay (UYT - UTC-3)</option>
                      <option value="America/Asuncion">Asunción, Paraguay (PYT - UTC-4)</option>
                    </select>
                    <small style={{ color: "var(--text-muted)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      {lang === "fr" 
                        ? "*Les horaires des cours s'adapteront automatiquement à la zone horaire sélectionnée." 
                        : lang === "en" 
                        ? "*Class schedules will automatically convert to your selected time zone." 
                        : "*Las horas de las clases se convertirán automáticamente a la zona horaria seleccionada."}
                    </small>
                  </div>

                  {/* Calendario Mensual Interactivo en Pantalla */}
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: "12px", color: "var(--text-main)", display: "block" }}>
                      📅 {lang === "fr" ? "Sélectionner la date" : lang === "en" ? "Select Date" : "Seleccionar Fecha"}
                    </label>
                    
                    <div style={{
                      border: "1px solid var(--border-color)",
                      borderRadius: "12px",
                      padding: "20px",
                      backgroundColor: "#ffffff"
                    }}>
                      {/* Cabecera del Calendario */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <button 
                          type="button" 
                          className="btn btn-outline" 
                          style={{ padding: "8px 12px", minWidth: "auto", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                          onClick={() => {
                            const prevMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
                            const hoy = new Date();
                            const mesMin = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                            if (prevMes >= mesMin) {
                              setMesVisible(prevMes);
                            }
                          }}
                        >
                          &lt;
                        </button>
                        <span style={{ fontWeight: 700, fontSize: "16px", textTransform: "capitalize", color: "var(--text-main)" }}>
                          {mesVisible.toLocaleString("es-ES", { month: "long", year: "numeric" })}
                        </span>
                        <button 
                          type="button" 
                          className="btn btn-outline" 
                          style={{ padding: "8px 12px", minWidth: "auto", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                          onClick={() => {
                            const nextMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
                            const hoy = new Date();
                            const limiteFuturo = new Date();
                            limiteFuturo.setDate(limiteFuturo.getDate() + 60);
                            const mesMax = new Date(limiteFuturo.getFullYear(), limiteFuturo.getMonth(), 1);
                            if (nextMes <= mesMax) {
                              setMesVisible(nextMes);
                            } else {
                              alert(
                                lang === "fr" ? "Vous ne pouvez pas réserver plus de 60 jours à l'avance." : 
                                lang === "en" ? "You cannot book more than 60 days in advance." : 
                                "No puedes reservar con más de 60 días de anticipación."
                              );
                            }
                          }}
                        >
                          &gt;
                        </button>
                      </div>

                      {/* Nombres de los días de la semana */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", textAlign: "center", fontWeight: 700, fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                        <div>L</div>
                        <div>M</div>
                        <div>M</div>
                        <div>J</div>
                        <div>V</div>
                        <div>S</div>
                        <div>D</div>
                      </div>

                      {/* Cuadrícula de días */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                        {/* Relleno días mes anterior */}
                        {(() => {
                          const yr = mesVisible.getFullYear();
                          const mth = mesVisible.getMonth();
                          const tempStart = new Date(yr, mth, 1).getDay();
                          const startDayIdx = tempStart === 0 ? 6 : tempStart - 1;
                          const prevTotal = new Date(yr, mth, 0).getDate();

                          return Array.from({ length: startDayIdx }).map((_, idx) => {
                            const dNum = prevTotal - startDayIdx + idx + 1;
                            return (
                              <div 
                                key={`prev-${idx}`} 
                                style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center", 
                                  height: "38px", 
                                  color: "#cbd5e1", 
                                  fontSize: "12px" 
                                }}
                              >
                                {dNum}
                              </div>
                            );
                          });
                        })()}

                        {/* Días mes actual */}
                        {(() => {
                          const yr = mesVisible.getFullYear();
                          const mth = mesVisible.getMonth();
                          const totalDays = new Date(yr, mth + 1, 0).getDate();

                          return Array.from({ length: totalDays }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const estado = getEstadoDia(dayNum);
                            const diaIsoStr = `${yr}-${String(mth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = nuevaFecha === diaIsoStr;

                            let bgColor = "#ffffff";
                            let textColor = "var(--text-main)";
                            let borderColor = "#cbd5e1";
                            let dotColor = "transparent";
                            let isClickable = true;

                            if (estado === "cerrado") {
                              bgColor = "#f8fafc";
                              textColor = "#cbd5e1";
                              borderColor = "#e2e8f0";
                              isClickable = false;
                            } else if (estado === "pasado") {
                              bgColor = "#f8fafc";
                              textColor = "#cbd5e1";
                              borderColor = "#e2e8f0";
                              isClickable = false;
                            } else if (estado === "completo") {
                              bgColor = "#fef2f2";
                              textColor = "#94a3b8";
                              borderColor = "#fca5a5";
                              dotColor = "#ef4444";
                              isClickable = false;
                            } else if (estado === "parcial") {
                              bgColor = "#fff7ed";
                              borderColor = "#fdbb2d";
                              dotColor = "#f97316";
                            } else if (estado === "libre") {
                              bgColor = "#f0fdf4";
                              borderColor = "#86efac";
                              dotColor = "#22c55e";
                            }

                            if (isSelected) {
                              bgColor = "#0c1b33";
                              textColor = "#ffffff";
                              borderColor = "#0c1b33";
                            }

                            return (
                              <button
                                key={`day-${dayNum}`}
                                type="button"
                                disabled={!isClickable}
                                onClick={() => {
                                  setNuevaFecha(diaIsoStr);
                                  setNuevaHora("");
                                }}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "38px",
                                  borderRadius: "8px",
                                  border: `1px solid ${borderColor}`,
                                  backgroundColor: bgColor,
                                  color: textColor,
                                  cursor: isClickable ? "pointer" : "not-allowed",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  position: "relative",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                <span>{dayNum}</span>
                                {isClickable && !isSelected && (
                                  <span style={{
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    backgroundColor: dotColor,
                                    position: "absolute",
                                    bottom: "4px"
                                  }} />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>

                      {/* Leyenda de Colores */}
                      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px", fontSize: "11px", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                          <span>{lang === "fr" ? "Disponible" : lang === "en" ? "Available" : "Libre"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316" }} />
                          <span>{lang === "fr" ? "Partiel" : lang === "en" ? "Partial" : "Parcial"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                          <span>{lang === "fr" ? "Complet" : lang === "en" ? "Full" : "Completo"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selector de Horas en cuadrícula de chips */}
                  {nuevaFecha && (
                    <div className="form-group" style={{ marginBottom: "20px" }}>
                      <label className="form-label" style={{ fontWeight: 700, marginBottom: "12px", color: "var(--text-main)", display: "block" }}>
                        🕒 {lang === "fr" ? "Sélectionner l'heure" : lang === "en" ? "Select Time Slot" : "Elige el Horario Disponible"}
                      </label>

                      {horasDisponibles.length === 0 ? (
                        <div style={{ padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
                          ⚠️ {lang === "fr" ? "Aucun horaire disponible pour ce jour." : lang === "en" ? "No available slots for this day." : "El profesor no tiene horas disponibles este día."}
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
                          {horasDisponibles.map((h) => {
                            const isSelected = nuevaHora === h.utc;
                            return (
                              <button
                                key={h.utc}
                                type="button"
                                onClick={() => setNuevaHora(h.utc)}
                                style={{
                                  padding: "10px 14px",
                                  borderRadius: "8px",
                                  border: isSelected ? "1.5px solid #0c1b33" : "1.5px solid #cbd5e1",
                                  backgroundColor: isSelected ? "#0c1b33" : "#ffffff",
                                  color: isSelected ? "#ffffff" : "var(--text-main)",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  textAlign: "center",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                {h.display}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: "100%", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: reservaCargando ? "wait" : "pointer" }}
                    disabled={!nuevaFecha || !nuevaHora || reservaCargando}
                  >
                    {reservaCargando 
                      ? (lang === "fr" ? "Réservation en cours..." : lang === "en" ? "Booking..." : "Reservando...") 
                      : t.confirmReservation}
                  </button>

                  {reservaExito && (
                    <div style={{
                      marginTop: "16px",
                      padding: "10px",
                      backgroundColor: "rgba(40, 167, 69, 0.1)",
                      color: "green",
                      fontSize: "13px",
                      borderRadius: "var(--radius-sm)",
                      textAlign: "center",
                      fontWeight: 600
                    }}>
                      {t.reservationSuccess}
                    </div>
                  )}

                  {reservaError && (
                    <div style={{
                      marginTop: "16px",
                      padding: "10px",
                      backgroundColor: "rgba(220, 53, 69, 0.1)",
                      color: "darkred",
                      fontSize: "13px",
                      borderRadius: "var(--radius-sm)",
                      textAlign: "center"
                    }}>
                      {reservaError}
                    </div>
                  )}
                </form>
              </div>

            </div>

            {/* Columna Derecha: Recursos y Tareas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              
              {/* Material Didáctico */}
              <div className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <BookOpen size={20} className="text-[#3b82f6] shrink-0" /> {t.resourcesTitle}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
                  {t.resourcesDesc}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {recursos.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "10px 0" }}>
                      {t.noResources}
                    </p>
                  ) : (
                    recursos.map((rec) => (
                      <div key={rec.id} style={{
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-main)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                      }}>
                        <div style={{ flex: 1, paddingRight: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              backgroundColor: "hsl(var(--accent-hsl))",
                              color: "#14171a",
                              borderRadius: "4px"
                            }}>
                              {rec.nivel}
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                              {rec.tipo}
                            </span>
                          </div>
                          <h4 style={{ fontSize: "15px", marginTop: "6px", marginBottom: "4px", color: "hsl(var(--primary-hsl))" }}>
                            {rec.titulo}
                          </h4>
                          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {rec.nivel === "Todos" 
                              ? (lang === "fr" ? "Matériel général pour tous les niveaux" : lang === "en" ? "General material for all levels" : "Material general para todos los niveles")
                              : (lang === "fr" ? `Matériel exclusif pour le niveau ${rec.nivel}` : lang === "en" ? `Exclusive material for level ${rec.nivel}` : `Material exclusivo para nivel ${rec.nivel}`)}
                          </p>
                        </div>
                        <a
                          href={rec.urlArchivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ padding: "6px 12px", fontSize: "12px", whiteSpace: "nowrap", textDecoration: "none", display: "inline-flex", alignItems: "center", color: "inherit" }}
                        >
                          {t.download} ({rec.tamaño})
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Historial e Informes de Progreso */}
              <div className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <TrendingUp size={20} className="text-[#3b82f6] shrink-0" /> {t.progressTitle}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
                  {t.progressDesc}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {clasesPasadas.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "10px 0" }}>
                      {t.noProgress}
                    </p>
                  ) : (
                    clasesPasadas.map((c) => (
                      <div key={c.id} style={{
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-main)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                          <span>{lang === "fr" ? `Cours du ${c.fecha} - ${c.hora}` : lang === "en" ? `Class on ${c.fecha} - ${c.hora}` : `Clase del ${c.fecha} - ${c.hora}`}</span>
                          <span style={{ color: c.estado === "Completada" ? "green" : "red", fontWeight: 600 }}>
                            {c.estado === "Completada" ? (lang === "fr" ? "Complété" : lang === "en" ? "Completed" : "Completada") : (lang === "fr" ? "Annulé" : lang === "en" ? "Cancelled" : "Cancelada")}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", fontStyle: "italic", color: "var(--text-main)", margin: 0 }}>
                          &ldquo;{c.nota === "Sin comentarios." ? (lang === "fr" ? "Pas de commentaires." : lang === "en" ? "No comments." : "Sin comentarios.") : c.nota}&rdquo;
                        </p>
                        {c.enlace_grabacion && (
                          <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                            <a
                              href={c.enlace_grabacion}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline"
                              style={{
                                padding: "6px 12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "hsl(var(--accent-hsl))",
                                borderColor: "rgba(201, 154, 60, 0.2)"
                              }}
                            >
                              🎥 {lang === "fr" ? "Regarder le cours enregistré" : lang === "en" ? "Watch recorded class" : "Ver clase grabada"}
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Historial de Pagos */}
              <div className="card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  {lang === "fr" ? "Historique des paiements" : lang === "en" ? "Payment History" : "Historial de Pagos"}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>
                  {lang === "fr" ? "Consultez vos transactions passées." : lang === "en" ? "Review your past transactions." : "Revisa tus transacciones pasadas."}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {historialPagos.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "10px 0" }}>
                      {lang === "fr" ? "Aucun paiement trouvé." : lang === "en" ? "No payments found." : "No se encontraron pagos."}
                    </p>
                  ) : (
                    historialPagos.map((pago) => {
                      const planInfo = pago.planes_estudio ? (Array.isArray(pago.planes_estudio) ? pago.planes_estudio[0] : pago.planes_estudio) : null;
                      const dt = new Date(pago.creado_en);
                      const fechaFormat = dt.toLocaleDateString();
                      return (
                        <div key={pago.id} style={{
                          padding: "16px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-color)",
                          backgroundColor: "var(--bg-main)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px" }}>
                              {planInfo ? planInfo.nombre : `Plan ID: ${pago.plan_id}`}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                              {fechaFormat} • ID: {pago.id}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "14px" }}>
                              {planInfo ? formatPrecio(parseFloat(planInfo.precio)) : "-"}
                            </div>
                            <div style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: pago.estado_pago === "pagado" ? "green" : "orange",
                              backgroundColor: pago.estado_pago === "pagado" ? "rgba(40,167,69,0.1)" : "rgba(255,165,0,0.1)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              marginTop: "4px",
                              display: "inline-block"
                            }}>
                              {pago.estado_pago}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
        padding: "24px 0",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--text-muted)"
      }}>
        <div className="container">
          © {new Date().getFullYear()} Florentin. {lang === "fr" ? "Portail Éducatif Élève." : lang === "en" ? "Student Educational Portal." : "Panel Educativo Alumno."}
        </div>
      </footer>
      {/* Modal de Reprogramación */}
      {reprogramarClaseId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="card" style={{
            width: "100%",
            maxWidth: "500px",
            padding: "32px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            position: "relative",
            animation: "fadeIn 0.2s ease-out"
          }}>
            <button
              onClick={() => {
                setReprogramarClaseId(null);
                setReprogramarFecha("");
                setReprogramarHora("");
                setReproError("");
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: "4px"
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              🔄 {lang === "fr" ? "Reprogrammer le cours" : lang === "en" ? "Reschedule Class" : "Reprogramar Clase"}
            </h3>
            
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.4" }}>
              {lang === "fr" 
                ? "Sélectionnez un nouveau créneau horaire disponible. Cette opération déduira 1 tentative de modification." 
                : lang === "en" 
                ? "Select a new available date and time. This will deduct 1 reschedule attempt." 
                : "Selecciona una nueva fecha y hora disponible. Esta operación descontará 1 intento de reprogramación."}
            </p>

            {reproExito ? (
              <div style={{
                textAlign: "center",
                padding: "20px",
                color: "#10b981",
                fontWeight: 700,
                fontSize: "15px"
              }}>
                🎉 {lang === "fr" ? "Cours reprogrammé avec succès !" : lang === "en" ? "Class successfully rescheduled!" : "¡Clase reprogramada con éxito!"}
              </div>
            ) : (
              <form onSubmit={handleReprogramarClase} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "0 0 10px 0" }}>
                  {lang === "fr" 
                    ? `*Horaires convertis selon votre zone : ${userTimeZone || "Europe/Paris"}`
                    : lang === "en" 
                    ? `*Schedules converted to your timezone: ${userTimeZone || "Europe/Paris"}`
                    : `*Horarios convertidos a tu zona horaria: ${userTimeZone || "Europe/Paris"}`}
                </p>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    {lang === "fr" ? "1. Choisir une date" : lang === "en" ? "1. Select date" : "1. Selecciona la nueva fecha"}
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    min={minDateReprogramar} // Mínimo 24 horas a futuro
                    value={reprogramarFecha}
                    onChange={(e) => {
                      setReprogramarFecha(e.target.value);
                      setReprogramarHora("");
                      fetchDisponibilidadReprogramar(e.target.value);
                    }}
                    style={{ padding: "12px 16px", cursor: "pointer" }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    {lang === "fr" ? "2. Choisir une heure" : lang === "en" ? "2. Select time" : "2. Selecciona la nueva hora"}
                  </label>
                  <select
                    className="form-control"
                    value={reprogramarHora}
                    onChange={(e) => setReprogramarHora(e.target.value)}
                    style={{ padding: "12px 16px", cursor: "pointer" }}
                    disabled={!reprogramarFecha}
                    required
                  >
                    <option value="">
                      {!reprogramarFecha 
                        ? (lang === "fr" ? "Sélectionnez d'abord une date..." : lang === "en" ? "Select a date first..." : "Selecciona una fecha primero...") 
                        : (lang === "fr" ? "-- Choisir l'heure --" : lang === "en" ? "-- Choose time --" : "-- Elige el horario --")}
                    </option>
                    {reproHorasDisponibles.map((slot) => (
                      <option key={slot.utc} value={slot.utc}>
                        {slot.display}
                      </option>
                    ))}
                  </select>
                  {reprogramarFecha && reproHorasDisponibles.length === 0 && (
                    <p style={{ fontSize: "11px", color: "#f97316", marginTop: "6px" }}>
                      ⚠️ {lang === "fr" ? "Aucun horaire disponible pour ce jour." : lang === "en" ? "No available slots for this day." : "No hay horarios laborables disponibles para este día."}
                    </p>
                  )}
                </div>

                {reproError && (
                  <div style={{
                    padding: "10px 14px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: "8px",
                    color: "#ef4444",
                    fontSize: "12px",
                    lineHeight: "1.4"
                  }}>
                    ⚠️ {reproError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setReprogramarClaseId(null);
                      setReprogramarFecha("");
                      setReprogramarHora("");
                      setReproError("");
                    }}
                    style={{ flex: 1, padding: "12px" }}
                  >
                    {lang === "fr" ? "Annuler" : lang === "en" ? "Cancel" : "Cancelar"}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!reprogramarHora}
                    style={{ flex: 1, padding: "12px" }}
                  >
                    {lang === "fr" ? "Confirmer" : lang === "en" ? "Confirm" : "Confirmar Cambio"}
                  </button>
                </div>

              </form>
            )}

            <div style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-color)",
              textAlign: "center",
              fontSize: "11px",
              color: "var(--text-muted)"
            }}>
              {lang === "fr" 
                ? "En cas de problème persistant, contactez l'administrateur par WhatsApp." 
                : lang === "en" 
                ? "For persistent issues, contact the administrator via WhatsApp." 
                : "Si tienes problemas, ponte en contacto con el administrador por WhatsApp."}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: MI PERFIL / AJUSTES DE CUENTA */}
      {showPerfilModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="card" style={{
            width: "100%",
            maxWidth: "480px",
            padding: "28px",
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            position: "relative"
          }}>
            {/* Cabecera del modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={20} style={{ color: "hsl(var(--accent-hsl))" }} />
                {lang === "fr" ? "Mon Profil" : lang === "en" ? "My Profile" : "Mi Perfil"}
              </h3>
              <button
                onClick={() => {
                  setShowPerfilModal(false);
                  setPerfilErrorMsg("");
                  setPerfilExitoMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "4px"
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {perfilExitoMsg ? (
              <div style={{
                textAlign: "center",
                padding: "24px",
                color: "#10b981",
                fontWeight: 700,
                fontSize: "15px"
              }}>
                🎉 {perfilExitoMsg}
              </div>
            ) : (
              <form onSubmit={handleGuardarPerfil} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* Nombre */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <User size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Nom complet" : lang === "en" ? "Full Name" : "Nombre Completo"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={perfilEditNombre}
                    onChange={(e) => setPerfilEditNombre(e.target.value)}
                    style={{ padding: "12px 16px" }}
                    placeholder={lang === "fr" ? "Votre nom" : lang === "en" ? "Your name" : "Tu nombre"}
                    required
                  />
                </div>

                {/* WhatsApp / Teléfono */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <Phone size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Numéro WhatsApp" : lang === "en" ? "WhatsApp Number" : "Número de WhatsApp"}
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={perfilEditTelefono}
                    onChange={(e) => setPerfilEditTelefono(e.target.value)}
                    style={{ padding: "12px 16px" }}
                    placeholder="ej: +51 987 654 321 o +33 6 12 34 56 78"
                  />
                </div>

                {/* Nivel de Francés y Zona Horaria en grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <GraduationCap size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                      {lang === "fr" ? "Niveau de Français" : lang === "en" ? "French Level" : "Nivel de Francés"}
                    </label>
                    <select
                      className="form-control"
                      value={perfilEditNivel}
                      onChange={(e) => setPerfilEditNivel(e.target.value)}
                      style={{ padding: "12px 16px", appearance: "auto" }}
                    >
                      <option value="A1">A1 (Débutant / Principiante)</option>
                      <option value="A2">A2 (Élémentaire / Básico)</option>
                      <option value="B1">B1 (Intermédiaire / Intermedio)</option>
                      <option value="B2">B2 (Intermédiaire Supérieur / Avanzado)</option>
                      <option value="C1">C1 (Autonome / Experto)</option>
                      <option value="C2">C2 (Maîtrise / Bilingüe)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <Globe size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                      {lang === "fr" ? "Fuseau Horaire" : lang === "en" ? "Timezone" : "Zona Horaria"}
                    </label>
                    <select
                      className="form-control"
                      value={perfilEditZonaHoraria}
                      onChange={(e) => setPerfilEditZonaHoraria(e.target.value)}
                      style={{ padding: "12px 16px", appearance: "auto" }}
                    >
                      <option value="Europe/Paris">Europe/Paris (Francia/España)</option>
                      <option value="America/Bogota">America/Bogota (Colombia/Perú/Ecuador)</option>
                      <option value="America/Mexico_City">America/Mexico_City (México)</option>
                      <option value="America/Santiago">America/Santiago (Chile)</option>
                      <option value="America/Argentina/Buenos_Aires">America/Buenos_Aires (Argentina)</option>
                      <option value="America/Caracas">America/Caracas (Venezuela)</option>
                      <option value="America/New_York">America/New_York (Nueva York/Miami)</option>
                    </select>
                  </div>
                </div>

                {/* Objetivos de Aprendizaje */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <Target size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Objectifs d'apprentissage" : lang === "en" ? "Learning Goals" : "Objetivos y Metas"}
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={perfilEditObjetivos}
                    onChange={(e) => setPerfilEditObjetivos(e.target.value)}
                    style={{ padding: "12px 16px", resize: "none" }}
                    placeholder={lang === "fr" ? "Quels sont vos objectifs (ex: Déménager en France, examen DELF) ?" : lang === "en" ? "What are your goals (e.g. Move to France, DELF exam)?" : "¿Cuáles son tus metas con el francés?"}
                  ></textarea>
                </div>


                {/* Contraseña Nueva */}
                <div className="form-group" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "4px" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <Lock size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                    {lang === "fr" ? "Nouveau mot de passe" : lang === "en" ? "New Password" : "Nueva Contraseña"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={perfilNewPassword}
                    onChange={(e) => setPerfilNewPassword(e.target.value)}
                    style={{ padding: "12px 16px" }}
                    placeholder={lang === "fr" ? "Laisser vide pour ne pas changer" : lang === "en" ? "Leave empty to keep current" : "Dejar en blanco para no cambiar"}
                    minLength={6}
                  />
                </div>

                {/* Confirmar Contraseña */}
                {perfilNewPassword && (
                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                      <Lock size={14} style={{ color: "hsl(var(--accent-hsl))" }} />
                      {lang === "fr" ? "Confirmer le mot de passe" : lang === "en" ? "Confirm Password" : "Confirmar Contraseña"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={perfilConfirmPassword}
                      onChange={(e) => setPerfilConfirmPassword(e.target.value)}
                      style={{ padding: "12px 16px" }}
                      placeholder={lang === "fr" ? "Ressaisir le mot de passe" : lang === "en" ? "Re-enter password" : "Confirmar nueva contraseña"}
                      required
                    />
                  </div>
                )}

                {perfilErrorMsg && (
                  <div style={{
                    padding: "10px 14px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: "8px",
                    color: "#ef4444",
                    fontSize: "12px",
                    lineHeight: "1.4"
                  }}>
                    ⚠️ {perfilErrorMsg}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowPerfilModal(false);
                      setPerfilErrorMsg("");
                      setPerfilExitoMsg("");
                    }}
                    style={{ flex: 1, padding: "12px" }}
                    disabled={guardandoPerfil}
                  >
                    {lang === "fr" ? "Annuler" : lang === "en" ? "Cancel" : "Cancelar"}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "12px" }}
                    disabled={guardandoPerfil}
                  >
                    {guardandoPerfil 
                      ? (lang === "fr" ? "Enregistrement..." : lang === "en" ? "Saving..." : "Guardando...") 
                      : (lang === "fr" ? "Enregistrer" : lang === "en" ? "Save" : "Guardar Perfil")}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

