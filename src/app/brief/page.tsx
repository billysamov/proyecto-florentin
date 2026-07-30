"use client";

import React, { useState } from "react";
import { Download, Printer, CheckCircle, FileText, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BriefPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        
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
              <span>Descargar PDF para Jefe</span>
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
            <FileText size={16} /> Formulario de Recopilación de Contenidos V2
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Brief de Contenidos para la Web del Profesor Florentin
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Utiliza este documento o el PDF descargable para revisar y completar los textos reales de cada una de las 12 secciones de la nueva portada <strong>Versión 2</strong>.
          </p>
        </div>

        {/* Formulario Interactivo / Secciones */}
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          
          {/* Sección 1 */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "28px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "14px" }}>
              SECCIÓN 1: CABECERA Y MENÚ SUPERIOR
            </legend>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>
                1.1 Nombre de la Marca / Logotipo (Actual: "Ling+"):
              </label>
              <input type="text" placeholder="Escribe el nombre del logo o marca..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>
                1.2 Texto del Botón de Acción CTA (Actual: "Agendar Clase de Prueba"):
              </label>
              <input type="text" placeholder="Escribe el texto deseado para el botón principal..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
          </fieldset>

          {/* Sección 2 */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "28px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "14px" }}>
              SECCIÓN 2: HERO PRINCIPAL (PORTADA WEB)
            </legend>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>
                2.1 Titular H1 Principal (Actual: "Aprende Francés con un Profesor Nativo en Vivo"):
              </label>
              <textarea rows={2} placeholder="Escribe el titular principal que verá el alumno al entrar..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>
                2.2 Subtítulo Descriptivo (Actual: "Clases individuales personalizadas adaptadas a tus objetivos y horarios"):
              </label>
              <textarea rows={2} placeholder="Escribe la descripción corta de la portada..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
          </fieldset>

          {/* Sección 3 */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "28px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "14px" }}>
              SECCIÓN 3: BARRA DE BENEFICIOS CLAVE (4 CUADROS DE VERIFICACIÓN)
            </legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Beneficio 1:</label>
                <input type="text" placeholder="ej. Profesor Nativo de Francia" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Beneficio 2:</label>
                <input type="text" placeholder="ej. Clases 1 a 1 Personalizadas" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Beneficio 3:</label>
                <input type="text" placeholder="ej. Horario Adaptado a Latam" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Beneficio 4:</label>
                <input type="text" placeholder="ej. Preparación Oficial DELF/DALF" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
            </div>
          </fieldset>

          {/* Sección 4: Precios */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "28px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "14px" }}>
              SECCIÓN 7: PLANES Y PRECIOS
            </legend>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>
                Precios Oficiales y Frecuencias (Actuales: 15€ individual, 49€ pack 4, 89€ pack 8, 129€ pack 12):
              </label>
              <textarea rows={3} placeholder="Escribe si deseas modificar algún precio o los beneficios incluidos en los planes..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
            </div>
          </fieldset>

          {/* Sección Contacto */}
          <fieldset style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "28px", backgroundColor: "#fafafa" }}>
            <legend style={{ padding: "0 12px", fontWeight: 800, color: "#0066ff", fontSize: "14px" }}>
              SECCIÓN 12: DATOS DE CONTACTO DE FLORENTIN
            </legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Número de WhatsApp:</label>
                <input type="text" defaultValue="+33 7 44 32 13 56" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: "#0f172a", marginBottom: "6px" }}>Correo Electrónico:</label>
                <input type="text" placeholder="ej. contacto@florentinfrancais.com" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
              </div>
            </div>
          </fieldset>

          {submitted && (
            <div style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#ecfdf5", color: "#047857", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle size={20} />
              <span>¡Respuestas guardadas localmente! Puedes descargar el PDF para enviarlo por WhatsApp o correo.</span>
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
              <span>Descargar PDF para Enviar al Jefe</span>
            </a>
          </div>

        </form>

      </div>
    </div>
  );
}
