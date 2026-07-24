"use client";

import React, { useState, useMemo } from "react";
import {
  Terminal, Search, RefreshCw, Copy, Download, Filter,
  CheckCircle2, AlertTriangle, Info, ShieldCheck, Clock, Calendar, User, CreditCard
} from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  category: "pago" | "reserva" | "reprogramacion" | "cancelacion" | "recurso" | "sistema";
  severity: "info" | "success" | "warning" | "system";
  action: string;
  detalles: string;
  usuario?: string;
}

interface LogsTabProps {
  inscripciones?: any[];
  clases?: any[];
  usuarios?: any[];
  recursos?: any[];
  lang?: "es" | "fr";
}

export default function LogsTab({
  inscripciones = [],
  clases = [],
  usuarios = [],
  recursos = [],
  lang = "es"
}: LogsTabProps) {
  const isFr = lang === "fr";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("todos");
  const [isTerminalView, setIsTerminalView] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mapa de usuarios por ID para enriquecer nombres
  const usuariosMap = useMemo(() => {
    const map = new Map<string, string>();
    usuarios.forEach((u: any) => {
      if (u.id) map.set(u.id, u.nombre || u.email || u.id);
    });
    return map;
  }, [usuarios]);

  // Generar la lista cronológica unificada de Logs del sistema
  const logsList = useMemo<LogEntry[]>(() => {
    const list: LogEntry[] = [];

    // 1. Logs de Inscripciones y Pagos
    inscripciones.forEach((ins: any) => {
      const nombreUsuario = usuariosMap.get(ins.usuario_id) || `Usuario #${ins.usuario_id?.slice(0, 6)}`;
      const planNombre = ins.planes_estudio?.nombre || ins.plan_nombre || `Plan ID ${ins.plan_id}`;
      const divisaStr = (ins.divisa || "eur").toUpperCase();
      const montoStr = ins.monto_pagado ? `${ins.monto_pagado} ${divisaStr}` : "Pagado";

      list.push({
        id: `ins-${ins.id}`,
        timestamp: ins.creado_en || new Date().toISOString(),
        category: "pago",
        severity: "success",
        action: isFr ? "Paiement Enregistré" : "Pago e Inscripción Registrada",
        detalles: `${nombreUsuario} adquirió ${planNombre} (${ins.clases_restantes || 0} clases) - ${montoStr}`,
        usuario: nombreUsuario
      });
    });

    // 2. Logs de Clases (Reservas, Reprogramaciones, Cancelaciones)
    clases.forEach((c: any) => {
      const nombreAlumno = c.alumno || usuariosMap.get(c.usuario_id) || "Alumno";
      const fechaClase = c.fecha_hora || (c.fecha && c.hora ? `${c.fecha} ${c.hora}` : "");

      if (c.estado === "cancelada") {
        list.push({
          id: `clase-canc-${c.id}`,
          timestamp: c.creado_en || new Date().toISOString(),
          category: "cancelacion",
          severity: "warning",
          action: isFr ? "Cours Annulé" : "Clase Cancelada",
          detalles: `Clase cancelada para ${nombreAlumno} (Horario original: ${fechaClase})`,
          usuario: nombreAlumno
        });
      } else {
        list.push({
          id: `clase-${c.id}`,
          timestamp: c.creado_en || new Date().toISOString(),
          category: "reserva",
          severity: c.estado === "completada" ? "success" : "info",
          action: c.estado === "completada"
            ? (isFr ? "Cours Terminé" : "Clase Completada")
            : (isFr ? "Réservation de Cours" : "Reserva de Clase"),
          detalles: `Clase ${c.estado || "programada"} para ${nombreAlumno} el ${fechaClase}`,
          usuario: nombreAlumno
        });
      }
    });

    // 3. Logs de Recursos Didácticos
    recursos.forEach((rec: any) => {
      list.push({
        id: `rec-${rec.id}`,
        timestamp: rec.creado_en || new Date().toISOString(),
        category: "recurso",
        severity: "system",
        action: isFr ? "Ressource Pédagogique Ajoutée" : "Material Didáctico Registrado",
        detalles: `Recurso "${rec.titulo}" (Nivel: ${rec.nivel || "Todos"}, Tipo: ${rec.tipo || "PDF"}) subido al sistema`,
        usuario: "Administrador"
      });
    });

    // Ordenar cronológicamente descendente (los más recientes primero)
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [inscripciones, clases, recursos, usuariosMap, isFr]);

  // Filtrar logs según la búsqueda y filtros seleccionados
  const filteredLogs = useMemo(() => {
    return logsList.filter(log => {
      const matchSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detalles.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.usuario && log.usuario.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === "todos" || log.category === selectedCategory;
      const matchSeverity = selectedSeverity === "todos" || log.severity === selectedSeverity;

      return matchSearch && matchCategory && matchSeverity;
    });
  }, [logsList, searchTerm, selectedCategory, selectedSeverity]);

  // Copiar logs como texto
  const copyToClipboard = () => {
    const text = filteredLogs.map(l =>
      `[${new Date(l.timestamp).toLocaleString()}] [${l.severity.toUpperCase()}] [${l.action}] ${l.detalles}`
    ).join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Exportar logs a archivo CSV
  const exportCSV = () => {
    const headers = "ID,FechaHora,Categoria,Nivel,Accion,Detalles,Usuario\n";
    const rows = filteredLogs.map(l =>
      `"${l.id}","${new Date(l.timestamp).toLocaleString()}","${l.category}","${l.severity}","${l.action}","${l.detalles.replace(/"/g, '""')}","${l.usuario || ""}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `florentin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (severity: LogEntry["severity"]) => {
    switch (severity) {
      case "success":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1"><CheckCircle2 size={12} /> OK</span>;
      case "warning":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1"><AlertTriangle size={12} /> WARN</span>;
      case "system":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-purple-500/10 text-purple-600 border border-purple-500/20 inline-flex items-center gap-1"><ShieldCheck size={12} /> SYS</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 inline-flex items-center gap-1"><Info size={12} /> INFO</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Tarjeta de Encabezado y KPIs */}
      <div className="card" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "10px" }}>
              <Terminal className="text-[#3b82f6]" size={24} />
              {isFr ? "Journal d'Audite & Logs Système" : "Historial de Cambios & Logs de Auditoría"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              {isFr
                ? "Registre chronologique en temps réel de toutes les actions, paiements et réservations."
                : "Registro cronológico en tiempo real de todas las inscripciones, pagos, reservas y eventos del sistema."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsTerminalView(!isTerminalView)}
              className="btn btn-outline"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Terminal size={15} />
              {isTerminalView ? (isFr ? "Vue Tableau" : "Modo Tabla") : (isFr ? "Vue Console" : "Modo Consola")}
            </button>

            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-outline"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Copy size={15} />
              {copied ? (isFr ? "Copié !" : "¡Copiado!") : (isFr ? "Copier Logs" : "Copiar Logs")}
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="btn btn-primary"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Download size={15} />
              {isFr ? "Exporter CSV" : "Exportar CSV"}
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
          {/* Buscador */}
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-control"
              placeholder={isFr ? "Rechercher par utilisateur, action..." : "Buscar por alumno, acción o detalle..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "36px", height: "40px", fontSize: "13px" }}
            />
          </div>

          {/* Filtro Categoría */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} style={{ color: "var(--text-muted)" }} />
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ height: "40px", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="todos">{isFr ? "Toutes Catégories" : "Todas las Categorías"}</option>
              <option value="pago">{isFr ? "Paiements & Forfaits" : "Pagos e Inscripciones"}</option>
              <option value="reserva">{isFr ? "Réservations" : "Reservas de Clases"}</option>
              <option value="cancelacion">{isFr ? "Annulations" : "Cancelaciones"}</option>
              <option value="recurso">{isFr ? "Ressources" : "Materiales Didácticos"}</option>
            </select>
          </div>

          {/* Contador de Logs */}
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", paddingLeft: "8px" }}>
            {filteredLogs.length} {isFr ? "événements trouvés" : "eventos registrados"}
          </div>
        </div>
      </div>

      {/* Vista MODO CONSOLA / TERMINAL */}
      {isTerminalView ? (
        <div
          style={{
            backgroundColor: "#090d16",
            borderRadius: "16px",
            border: "1px solid #1e293b",
            padding: "20px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "12px",
            color: "#38bdf8",
            maxHeight: "600px",
            overflowY: "auto",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
          }}
        >
          <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "14px", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
            <span>root@florentin-french-production:~# systemctl status audit.log</span>
            <span>{filteredLogs.length} LINES</span>
          </div>

          {filteredLogs.length === 0 ? (
            <div style={{ color: "#64748b", textAlign: "center", padding: "20px 0" }}>
              // No logs matching search criteria
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} style={{ marginBottom: "8px", lineHeight: 1.6, wordBreak: "break-word" }}>
                <span style={{ color: "#64748b" }}>[{new Date(log.timestamp).toLocaleString()}]</span>{" "}
                <span style={{
                  color: log.severity === "success" ? "#4ade80" : log.severity === "warning" ? "#fbbf24" : log.severity === "system" ? "#c084fc" : "#60a5fa",
                  fontWeight: "bold"
                }}>
                  [{log.severity.toUpperCase()}]
                </span>{" "}
                <span style={{ color: "#f8fafc", fontWeight: "bold" }}>[{log.action}]</span>{" "}
                <span style={{ color: "#cbd5e1" }}>{log.detalles}</span>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Vista MODO TABLA ELEGANTE */
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-main)", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <th style={{ padding: "14px 20px" }}>{isFr ? "Date & Heure" : "Fecha y Hora"}</th>
                  <th style={{ padding: "14px 20px" }}>{isFr ? "Niveau" : "Estado / Nivel"}</th>
                  <th style={{ padding: "14px 20px" }}>{isFr ? "Action" : "Acción"}</th>
                  <th style={{ padding: "14px 20px" }}>{isFr ? "Détails" : "Detalle del Evento"}</th>
                  <th style={{ padding: "14px 20px" }}>{isFr ? "Utilisateur" : "Usuario"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                      {isFr ? "Aucun événement trouvé." : "No se encontraron eventos registrados."}
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => {
                    const dt = new Date(log.timestamp);
                    const fechaStr = dt.toLocaleDateString() + " " + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={log.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.15s ease" }} className="hover:bg-slate-50/50">
                        <td style={{ padding: "14px 20px", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "12px", fontWeight: 500 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={13} style={{ opacity: 0.7 }} />
                            {fechaStr}
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          {getSeverityBadge(log.severity)}
                        </td>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap" }}>
                          {log.action}
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--text-main)", maxWidth: "450px" }}>
                          {log.detalles}
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--text-muted)", whiteSpace: "nowrap", fontWeight: 500 }}>
                          {log.usuario ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <User size={13} />
                              {log.usuario}
                            </div>
                          ) : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
