"use client";

import React, { useState } from "react";
import { Download, Printer, CheckCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BriefPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        
        {/* Header con Botones de Acción */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "24px", borderBottom: "2px solid #f1f5f9" }} className="flex-col sm:flex-row gap-4">
          <Link href="/v2" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#0066ff", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}>
            <ArrowLeft size={18} />
            <span>Volver a la Versión 2</span>
          </Link>

          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="/Formulario_Contenidos_LingPlus_V2.pdf"
              download="Formulario_Contenidos_LingPlus_V2.pdf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "30px",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "14px",
                textDecoration: "none",
                boxShadow: "0 8px 20px rgba(0, 102, 255, 0.25)"
              }}
            >
              <Download size={18} />
              <span>Descargar PDF con Capturas</span>
            </a>

            <button
              onClick={() => window.print()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "30px",
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "14px",
                border: "none",
                cursor: "pointer"
              }}
            >
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Título Principal */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "20px", backgroundColor: "#eff6ff", color: "#0066ff", fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
            <FileText size={16} /> Formulario Exhaustivo de Contenidos V2
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Brief con Capturas de Pantalla Sección por Sección
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "750px", margin: "0 auto", lineHeight: 1.6 }}>
            Cada mínimo texto de la plantilla Versión 2 está enumerado como un campo editable con su captura de pantalla correspondiente para que el Profesor Florentin pueda completarlo con precisión.
          </p>
        </div>

        {/* Formulario Interactivo / Secciones */}
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          
          {/* Sección 1 */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "32px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "15px" }}>
              SECCIÓN 1: CABECERA Y MENÚ SUPERIOR
            </legend>

            <div style={{ margin: "16px 0", borderRadius: "12px", overflow: "hidden", border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
              <Image src="/screenshots_v2/section_1.png" alt="Captura Sección 1" width={900} height={100} style={{ width: "100%", height: "auto" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.1 Nombre de la Marca / Logo:</label>
                <input type="text" defaultValue="Florentin French" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.2 Enlace Menú 1:</label>
                <input type="text" defaultValue="Profesor" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.3 Enlace Menú 2:</label>
                <input type="text" defaultValue="Método" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.4 Enlace Menú 3:</label>
                <input type="text" defaultValue="Por Qué Florentin" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.5 Enlace Menú 4:</label>
                <input type="text" defaultValue="Planes & Precios" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>1.6 Texto Botón CTA Principal Header:</label>
                <input type="text" defaultValue="Agendar Clase" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
            </div>
          </fieldset>

          {/* Sección 4 Bento */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "32px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "15px" }}>
              SECCIÓN 4: TARJETAS BENTO ("¿POR QUÉ ELEGIR A FLORENTIN?")
            </legend>

            <div style={{ margin: "16px 0", borderRadius: "12px", overflow: "hidden", border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
              <Image src="/screenshots_v2/section_4.png" alt="Captura Sección 4 Bento" width={900} height={300} style={{ width: "100%", height: "auto" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.1 Insignia de Categoría Badge (Actual: "• ¿POR QUÉ ELEGIR A FLORENTIN?"):</label>
              <input type="text" defaultValue="• ¿POR QUÉ ELEGIR A FLORENTIN?" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.2 Titular H2 (Actual: "Desbloquea el Francés con un Método Inmersivo"):</label>
              <input type="text" defaultValue="Desbloquea el Francés con un Método Inmersivo" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.4 Tarjeta 1 - Título & Descripción:</label>
                <input type="text" defaultValue="Conversación Real" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "6px" }} />
                <textarea rows={2} defaultValue="Práctica conversacional activa en francés desde la primera sesión..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.6 Tarjeta 2 - Título & Descripción:</label>
                <input type="text" defaultValue="A Tu Propio Ritmo" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "6px" }} />
                <textarea rows={2} defaultValue="Opciones de horario 100% flexibles..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.8 Tarjeta 3 - Título & Descripción:</label>
                <input type="text" defaultValue="Material Didáctico Incluido" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "6px" }} />
                <textarea rows={2} defaultValue="Acceso a biblioteca de guías en PDF..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>4.10 Tarjeta 4 - Título & Descripción:</label>
                <input type="text" defaultValue="Acento Perfecto" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", marginBottom: "6px" }} />
                <textarea rows={2} defaultValue="Corrección de acento y pronunciación en tiempo real..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
            </div>
          </fieldset>

          {/* Sección 5 Marquee Chips */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "32px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "15px" }}>
              SECCIÓN 5: MARQUEE TICKER DE ESPECIALIDADES (CHIPS)
            </legend>

            <div style={{ margin: "16px 0", borderRadius: "12px", overflow: "hidden", border: "1px solid #cbd5e1", backgroundColor: "#ffffff" }}>
              <Image src="/screenshots_v2/section_5.png" alt="Captura Sección 5 Chips" width={900} height={100} style={{ width: "100%", height: "auto" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input type="text" defaultValue="🇫🇷 Francés Nativo de París" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" defaultValue="🥐 Pronunciación Auténtica" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" defaultValue="💼 Francés para Negocios" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" defaultValue="✈️ Francés para Viajes & Vida Diaria" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" defaultValue="🎓 Exámenes DELF (A1-B2)" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              <input type="text" defaultValue="📜 Exámenes DALF (C1-C2)" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
          </fieldset>

          {submitted && (
            <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#ecfdf5", color: "#047857", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle size={20} />
              <span>¡Respuestas guardadas! Descarga el PDF con las capturas integradas para enviarlo a tu jefe.</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px" }}>
            <a
              href="/Formulario_Contenidos_LingPlus_V2.pdf"
              download="Formulario_Contenidos_LingPlus_V2.pdf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                borderRadius: "40px",
                backgroundColor: "#0066ff",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(0, 102, 255, 0.3)"
              }}
            >
              <Download size={20} />
              <span>Descargar PDF Exhaustivo con Capturas</span>
            </a>
          </div>

        </form>

      </div>
    </div>
  );
}
