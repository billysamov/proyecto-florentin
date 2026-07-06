import React from "react";

export default function ManualTab() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Estilos específicos de impresión embebidos */}
      <style>{`
        @media print {
          /* Ocultar todo menos el área del manual */
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          #manual-print-area, #manual-print-area * {
            visibility: visible;
          }
          #manual-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          /* Ocultar botones de acción en el PDF impreso */
          .no-print {
            display: none !important;
          }
          /* Configuración de saltos de página limpios */
          h2 {
            page-break-before: always;
          }
          h1, h2, h3 {
            color: #091021 !important;
            font-family: Georgia, serif !important;
          }
        }
      `}</style>

      {/* Cabecera del Manual con Botón de Descarga */}
      <div className="card no-print" style={{ padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h3 style={{ fontSize: "20px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
            📖 Manual de Operaciones del Profesor
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
            Guía de usuario oficial para administrar clases, configurar precios, subir materiales y realizar el seguimiento pedagógico de los alumnos.
          </p>
        </div>
        <button 
          onClick={handlePrint} 
          className="btn btn-accent" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#14171a", fontWeight: 700 }}
        >
          <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Descargar PDF / Imprimir
        </button>
      </div>

      {/* Contenido Imprimible del Manual */}
      <div id="manual-print-area" className="card" style={{ padding: "40px", backgroundColor: "#ffffff" }}>
        
        {/* Encabezado del Documento */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #000000", paddingBottom: "24px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#0c1b33", margin: "0 0 8px 0", fontFamily: "var(--font-serif)" }}>
            PORTAL EDUCATIVO FLORENTIN
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#475569", margin: "0 0 4px 0" }}>
            Guía Oficial de Administración y Operaciones del Profesor
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            Fecha de emisión: {new Date().toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Sección 1: Introducción */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            1. Introducción general de la Plataforma
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            La plataforma de Florentin está compuesta por dos áreas principales diseñadas para sincronizar el aprendizaje de francés de forma autónoma y fluida:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "14px", color: "#0c1b33" }}>A. El Panel del Profesor (Admin)</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "6px", lineHeight: "1.5" }}>
                Permite controlar la agenda de clases programadas, gestionar alumnos activos, registrar planes de venta, compartir material didáctico y enviar notificaciones masivas por correo o WhatsApp.
              </p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "14px", color: "#0c1b33" }}>B. El Portal del Alumno</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "6px", lineHeight: "1.5" }}>
                Permite a los estudiantes registrados reservar sus sesiones de clases basadas en tu disponibilidad, visualizar sus clases programadas, acceder a los enlaces de videollamada, revisar grabaciones pasadas y descargar material de estudio.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 2: Gestión de Reuniones */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            2. Programación de Clases y Enlaces de Reunión (Meet, Zoom, Teams, etc.)
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            El sistema es <strong>100% compatible con cualquier servicio de videollamada</strong>. Tienes absoluta libertad para utilizar la plataforma que prefieras: **Google Meet, Zoom, Microsoft Teams, Skype, Loom, Whereby, etc.**
          </p>
          
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(59, 130, 246, 0.05)", borderLeft: "4px solid #3b82f6", borderRadius: "0 8px 8px 0", marginBottom: "16px", fontSize: "13px", color: "#1e3a8a", lineHeight: "1.5" }}>
            <strong>💡 Nota de Compatibilidad:</strong> No estás limitado a Google Meet. Puedes guardar y compartir cualquier enlace URL de reunión de forma manual o configurarlo como tu sala por defecto. La plataforma adaptará los botones de acceso de los alumnos y las integraciones de calendario de forma totalmente transparente.
          </div>

          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>Enlace por Defecto:</strong> En la pestaña <em>Configuración CMS &gt; Límites y Horarios</em>, puedes definir tu enlace de videollamada permanente (ej: tu sala fija de Zoom o Meet). Toda nueva reserva de clase se creará automáticamente usando este enlace de forma predeterminada.
            </li>
            <li>
              <strong>Edición Individual de Enlaces:</strong> Si deseas asignar una sala diferente para una sesión en específico:
              <br />
              1. Ve a la pestaña <em>Resumen y Agenda</em>.
              <br />
              2. Busca la clase programada del alumno y haz clic en el botón de edición (icono del lápiz ✏️).
              <br />
              3. Pega el enlace de la reunión real (Meet, Zoom, etc.) y haz clic en <em>Guardar</em>.
            </li>
            <li>
              <strong>Regla de Bloqueo del Alumno:</strong> Para garantizar una experiencia sin fallos, el alumno **no podrá ver las opciones de agendamiento en su calendario (Google Calendar o iCal) si el enlace está configurado en estado "pendiente"**. Solo cuando el profesor asigne un enlace real se habilitará la opción para que el alumno agende la sesión a su calendario personal con un clic.
            </li>
            <li>
              <strong>Calendario del Profesor:</strong> Al lado del enlace de clase guardado en la pestaña de <em>Resumen y Agenda</em>, el profesor tiene un botón de calendario 📅 para añadir la sesión a su propio Google Calendar o descargar el archivo de invitación `.ics` directamente.
            </li>
          </ul>
        </div>

        {/* Sección 3: Conversión de Divisas */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            3. Catálogo de Planes, Precios y Conversión de Divisas
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            Los planes se administran centralizados bajo una lógica de divisa principal (Euros) y conversión inteligente:
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>Precio Base (Euros - EUR):</strong> Al crear o modificar un plan de estudios (pestaña <em>Planes de Estudio</em>), siempre debes ingresar el valor en Euros (€).
            </li>
            <li>
              <strong>Conversión a Dólares (USD):</strong> La plataforma aplica automáticamente la tasa de conversión definida en el código (`1 EUR = 1.10 USD`) y redondea el valor en dólares para la venta al cliente internacional.
              <br />
              <em>Fórmula de cálculo:</em> Precio USD = Redondeo(Precio EUR * 1.10)
            </li>
            <li>
              <strong>Pasarela de Cobros (Stripe):</strong> Cuando el alumno inicia el proceso de compra, el sistema envía el precio convertido de forma exacta a Stripe con la moneda solicitada por el usuario (EUR o USD). Stripe se encarga de procesar la tarjeta y realizar el cobro final. Si el alumno se encuentra en un país como Perú, Stripe le mostrará los medios de pago locales correspondientes, pero liquidando la transacción en la divisa enviada.
            </li>
            <li>
              <strong>Visualización Unificada de Ingresos (Métricas):</strong> En el área de *Resumen y Agenda*, verás una única tarjeta consolidada llamada <strong>Ganancias Totales (Estimado)</strong>. Esta tarjeta suma tus ganancias totales convertidas a Euros (€) para tu facilidad contable, y añade debajo un detalle exacto de cuánto dinero fue recaudado en cada divisa original (`Detalle: XX.XX€ | $YY.YY`).
            </li>
          </ul>
        </div>

        {/* Sección 4: Clases Grabadas y Retroalimentación */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            4. Seguimiento Pedagógico: Clases Grabadas y Feedback
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            Una vez finalizada cada clase, puedes ingresar la retroalimentación y la grabación de video de forma manual en el sistema:
          </p>
          <ol style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Graba la clase en vivo utilizando tu plataforma preferida (Google Meet, Zoom, Loom, etc.).</li>
            <li>Sube el video a un servidor de almacenamiento en la nube (como Google Drive con acceso de lectura, YouTube oculto, Loom o Vimeo).</li>
            <li>Ve al panel administrativo, ingresa a la pestaña <em>Gestión de Alumnos</em> y haz clic sobre el alumno correspondiente para abrir su expediente detallado.</li>
            <li>Busca la clase finalizada en la lista, haz clic en editar e introduce la retroalimentación escrita del progreso del alumno y el enlace de la grabación de video.</li>
            <li>Guarda los cambios. Al instante, el alumno verá en su portal privado las notas pedagógicas y el botón de <strong>"Ver clase grabada"</strong> habilitado para reproducir el video.</li>
          </ol>
        </div>

        {/* Sección 5: Materiales y Biblioteca */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            5. Biblioteca de Material Didáctico y Asignaciones
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            El profesor puede compartir archivos PDF, audios MP3 o enlaces de interés directamente con los estudiantes:
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>
              <strong>Registro del Recurso:</strong> Ve a la pestaña <em>Biblioteca / Material</em>, escribe un título descriptivo, selecciona el nivel (A1, A2, B1, etc.) y sube el archivo correspondiente de forma segura a Supabase Storage.
            </li>
            <li>
              <strong>Asignación por Estudiante:</strong> Puedes marcar las casillas de los alumnos específicos que tendrán acceso exclusivo a este archivo al momento de crearlo o modificarlo. Los alumnos que no estén seleccionados no verán el archivo en sus respectivos portales.
            </li>
          </ul>
        </div>

        {/* Sección 6: Centro de Comunicaciones */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            6. Centro de Comunicaciones y Notificaciones
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            Para mantener el contacto con tu comunidad de alumnos, dispones de dos herramientas en la pestaña <em>Enviar Mensajes</em>:
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>
              <strong>Notificaciones por Correo Electrónico:</strong> Envía comunicados o tareas directamente al buzón del alumno seleccionado o a todos los alumnos a la vez de forma masiva a través del servidor de correos (SMTP) configurado en la aplicación de forma automatizada.
            </li>
            <li>
              <strong>Notificaciones por WhatsApp:</strong> Redacta un mensaje y envíalo. El sistema abrirá WhatsApp Web con el texto precargado y el número del alumno listo para que solo debas pulsar enviar.
            </li>
          </ul>
        </div>

        {/* Firma de Autenticidad */}
        <div style={{ marginTop: "60px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
          <span>© {new Date().getFullYear()} Florentin Portal. Documentación Interna.</span>
          <span>París, Francia</span>
        </div>

      </div>
    </div>
  );
}
