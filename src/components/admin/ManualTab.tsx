import React from "react";

interface ManualTabProps {
  lang?: "es" | "fr";
}

export default function ManualTab({ lang = "es" }: ManualTabProps) {
  const handlePrint = () => {
    window.print();
  };

  const isFr = lang === "fr";

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
            📖 {isFr ? "Manuel Opérationnel du Professeur" : "Manual de Operaciones del Profesor"}
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
            {isFr 
              ? "Guide d'utilisation officiel pour gérer les cours, configurer les tarifs, télécharger les supports et assurer le suivi pédagogique des élèves."
              : "Guía de usuario oficial para administrar clases, configurar precios, subir materiales y realizar el seguimiento pedagógico de los alumnos."}
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
          {isFr ? "Télécharger le PDF / Imprimer" : "Descargar PDF / Imprimir"}
        </button>
      </div>

      {/* Contenido Imprimible del Manual */}
      <div id="manual-print-area" className="card" style={{ padding: "40px", backgroundColor: "#ffffff" }}>
        
        {/* Encabezado del Documento */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #000000", paddingBottom: "24px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", color: "#0c1b33", margin: "0 0 8px 0", fontFamily: "var(--font-serif)" }}>
            {isFr ? "PORTAIL ÉDUCATIF FLORENTIN" : "PORTAL EDUCATIVO FLORENTIN"}
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#475569", margin: "0 0 4px 0" }}>
            {isFr ? "Guide Officiel d'Administration et d'Opérations du Professeur" : "Guía Oficial de Administración y Operaciones del Profesor"}
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
            {isFr ? "Date d'émission : " : "Fecha de emisión: "} 
            {new Date().toLocaleDateString(isFr ? "fr-FR" : "es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Sección 1: Introducción */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "1. Présentation générale de la plateforme" : "1. Introducción general de la Plataforma"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "La plateforme de Florentin est composée de deux espaces principaux conçus pour synchroniser l'apprentissage du français de manière autonome et fluide :"
              : "La plataforma de Florentin está compuesta por dos áreas principales diseñadas para sincronizar el aprendizaje de francés de forma autónoma y fluida:"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "14px", color: "#0c1b33" }}>
                {isFr ? "A. L'Espace Professeur (Admin)" : "A. El Panel del Profesor (Admin)"}
              </strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "6px", lineHeight: "1.5" }}>
                {isFr 
                  ? "Permet de contrôler l'agenda des cours programmés, de gérer les élèves actifs, d'enregistrer des formules de cours, de partager du matériel didactique et d'envoyer des notifications par e-mail ou WhatsApp."
                  : "Permite controlar la agenda de clases programadas, gestionar alumnos activos, registrar planes de venta, compartir material didáctico y enviar notificaciones masivas por correo o WhatsApp."}
              </p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "14px", color: "#0c1b33" }}>
                {isFr ? "B. Le Portail de l'Élève" : "B. El Portal del Alumno"}
              </strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "6px", lineHeight: "1.5" }}>
                {isFr 
                  ? "Permet aux étudiants inscrits de réserver leurs sessions de cours en fonction de vos disponibilités, de visualiser leurs cours planifiés, d'accéder aux liens d'appel vidéo, de revoir les enregistrements passés et de télécharger le matériel d'étude."
                  : "Permite a los estudiantes registrados reservar sus lecciones basadas en tu disponibilidad, visualizar sus clases programadas, acceder a los enlaces de videollamada, revisar grabaciones pasadas y descargar material de estudio."}
              </p>
            </div>
          </div>
        </div>

        {/* Sección 2: Gestión de Reuniones */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "2. Planification des cours et liens de réunion (Meet, Zoom, Teams, etc.)" : "2. Programación de Clases y Enlaces de Reunión (Meet, Zoom, Teams, etc.)"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "Le système est 100% compatible avec n'importe quel service de visioconférence. Vous avez une totale liberté pour utiliser la plateforme de votre choix : Google Meet, Zoom, Microsoft Teams, Skype, Loom, Whereby, etc."
              : "El sistema es 100% compatible con cualquier servicio de videollamada. Tienes absoluta libertad para utilizar la plataforma que prefieras: Google Meet, Zoom, Microsoft Teams, Skype, Loom, Whereby, etc."}
          </p>
          
          <div style={{ padding: "12px 16px", backgroundColor: "rgba(59, 130, 246, 0.05)", borderLeft: "4px solid #3b82f6", borderRadius: "0 8px 8px 0", marginBottom: "16px", fontSize: "13px", color: "#1e3a8a", lineHeight: "1.5" }}>
            <strong>{isFr ? "💡 Note de Compatibilité :" : "💡 Note de Compatibilité :"}</strong> {isFr 
              ? "Vous n'êtes pas limité à Google Meet. Vous pouvez enregistrer et partager n'importe quel lien URL de réunion manuellement ou le configurer comme salle par défaut. La plateforme adaptera les boutons d'accès des étudiants de manière totalement transparente."
              : "No estás limitado a Google Meet. Puedes guardar y compartir cualquier enlace URL de reunión de forma manual o configurarlo como tu sala por defecto. La plataforma adaptará los botones de acceso de los alumnos de forma totalmente transparente."}
          </div>

          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>{isFr ? "Lien par défaut :" : "Enlace por Defecto:"}</strong> {isFr 
                ? "Dans l'onglet Configuration CMS > Limites et Horaires, vous pouvez définir votre lien de visioconférence permanent (ex: votre salle Zoom ou Meet). Toute nouvelle réservation de cours sera automatiquement créée avec ce lien par défaut."
                : "En la pestaña Configuración CMS > Límites y Horarios, puedes definir tu enlace de videollamada permanente (ej: tu sala fija de Zoom o Meet). Toda nueva reserva de clase se creará automáticamente usando este enlace de forma predeterminada."}
            </li>
            <li>
              <strong>{isFr ? "Édition individuelle des liens :" : "Edición Individual de Enlaces:"}</strong> {isFr 
                ? "Si vous souhaitez attribuer une salle différente pour une session en particulier :"
                : "Si deseas asignar una sala diferente para una sesión en específico:"}
              <br />
              1. {isFr ? "Allez dans l'onglet Résumé & Agenda." : "Ve a la pestaña Resumen y Agenda."}
              <br />
              2. {isFr ? "Recherchez le cours planifié de l'élève et cliquez sur le bouton d'édition (icône de crayon)." : "Busca la clase programada del alumno y haz clic en el botón de edición (icono del lápiz)."}
              <br />
              3. {isFr ? "Collez le lien de la réunion réelle (Meet, Zoom, etc.) et cliquez sur Enregistrer." : "Pega el enlace de la reunión real (Meet, Zoom, etc.) y haz clic en Guardar."}
            </li>
            <li>
              <strong>{isFr ? "Règle de blocage de l'élève :" : "Regla de Bloqueo del Alumno:"}</strong> {isFr 
                ? "Pour garantir une expérience sans faille, l'élève ne pourra pas voir les options de planification dans son calendrier (Google Calendar ou iCal) si le lien est en statut \"en attente\". Ce n'est que lorsque le professeur aura attribué un lien réel que l'option sera activée pour que l'élève l'ajoute à son calendrier personnel en un clic."
                : "Para garantizar una experiencia sin fallos, el alumno no podrá ver las opciones de agendamiento en su calendario (Google Calendar o iCal) si el enlace está configurado en estado \"pendiente\". Solo cuando el profesor asigne un enlace real se habilitará la opción para que el alumno agende la sesión a su calendario personal con un clic."}
            </li>
            <li>
              <strong>{isFr ? "Calendrier du Professeur :" : "Calendario del Profesor:"}</strong> {isFr 
                ? "À côté de chaque cours planifié, le professeur dispose d'un bouton pour ajouter la session à son propre Google Calendar ou télécharger directement le fichier d'invitation .ics."
                : "Al lado del enlace de clase guardado en la pestaña de Resumen y Agenda, el profesor tiene un botón de calendario para añadir la sesión a su propio Google Calendar o descargar el archivo de invitación .ics directamente."}
            </li>
          </ul>
        </div>

        {/* Sección 3: Conversión de Divisas */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "3. Catalogue des formules, tarifs et conversion des devises" : "3. Catálogo de Planes, Precios y Conversión de Divisas"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "Les formules sont gérées de manière centralisée avec l'Euro (EUR) comme devise principale et une conversion intelligente :"
              : "Los planes se administran centralizados bajo una lógica de divisa principal (Euros) y conversión inteligente:"}
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>{isFr ? "Prix de base (Euros - EUR) :" : "Precio Base (Euros - EUR):"}</strong> {isFr 
                ? "Lors de la création ou de la modification d'une formule de cours (onglet Formules de Cours), vous devez toujours saisir la valeur en Euros (€)."
                : "Al crear o modificar un plan de estudios (pestaña Planes de Estudio), siempre debes ingresar el valor en Euros (€)."}
            </li>
            <li>
              <strong>{isFr ? "Conversion en Dollars (USD) :" : "Conversión a Dólares (USD):"}</strong> {isFr 
                ? "La plateforme applique automatiquement le taux de conversion défini dans le code (1 EUR = 1.10 USD) et arrondit la valeur en dollars pour la vente au client international."
                : "La plataforma aplica automáticamente la tasa de conversión definida en el código (1 EUR = 1.10 USD) y redondea el valor en dólares para la venta al cliente internacional."}
              <br />
              <em>{isFr ? "Formule de calcul :" : "Formule de calcul:"}</em> {isFr ? "Prix USD = Arrondi(Prix EUR * 1.10)" : "Precio USD = Redondeo(Precio EUR * 1.10)"}
            </li>
            <li>
              <strong>{isFr ? "Passerelle de Paiement (Stripe) :" : "Pasarela de Cobros (Stripe):"}</strong> {isFr 
                ? "Lorsque l'élève achète une formule, le système envoie le prix converti de manière exacte à Stripe dans la devise choisie (EUR ou USD). Stripe traite la carte et effectue le débit. Les élèves d'Amérique latine verront les options locales, mais la transaction finale sera réglée dans la devise envoyée."
                : "Cuando el alumno inicia el proceso de compra, el sistema envía el precio convertido de forma exacta a Stripe con la moneda solicitada por el usuario (EUR o USD). Stripe se encarga de procesar la tarjeta y realizar el cobro final."}
            </li>
            <li>
              <strong>{isFr ? "Affichage unifié des revenus (Statistiques) :" : "Visualización Unificada de Ingresos (Métricas):"}</strong> {isFr 
                ? "Dans l'onglet Résumé & Agenda, vous verrez une seule carte consolidée intitulée Revenus Totaux (Estimations). Elle additionne vos revenus totaux convertis en Euros (€) pour simplifier votre comptabilité, et détaille en dessous la répartition par devise d'origine (EUR / USD)."
                : "En el área de Resumen y Agenda, verás una única tarjeta consolidada llamada Ganancias Totales (Estimado). Esta tarjeta suma tus ganancias totales convertidas a Euros (€) para tu facilidad contable, y añade debajo un detalle exacto de cuánto dinero fue recaudado en cada divisa original."}
            </li>
          </ul>
        </div>

        {/* Sección 4: Clases Grabadas y Retroalimentación */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "4. Suivi Pédagogique : Cours enregistrés et feedback" : "4. Seguimiento Pedagógico: Clases Grabadas y Feedback"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "Une fois le cours terminé, vous pouvez ajouter le compte rendu (notes) et l'enregistrement vidéo manuellement dans le système :"
              : "Una vez finalizada cada clase, puedes ingresar la retroalimentación y la grabación de video de forma manual en el sistema:"}
          </p>
          <ol style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>{isFr ? "Enregistrez le cours en direct via votre plateforme (Google Meet, Zoom, Loom, etc.)." : "Graba la clase en vivo utilizando tu plataforma preferida (Google Meet, Zoom, Loom, etc.)."}</li>
            <li>{isFr ? "Téléchargez la vidéo sur un hébergeur cloud (Google Drive avec accès partagé public, lien YouTube non répertorié, Loom ou Vimeo)." : "Sube el video a un servidor de almacenamiento en la nube (como Google Drive con acceso de lectura, YouTube oculto, Loom o Vimeo)."}</li>
            <li>{isFr ? "Allez sur l'espace admin, onglet Gestion des Élèves et cliquez sur le nom de l'élève pour ouvrir son dossier." : "Ve al panel administrativo, ingresa a la pestaña Gestión de Alumnos y haz clic sobre el alumno correspondiente para abrir su expediente detallado."}</li>
            <li>{isFr ? "Recherchez le cours terminé dans la liste, cliquez sur éditer, saisissez vos notes et collez le lien vidéo." : "Busca la clase finalizada en la lista, haz clic en editar e introduce la retroalimentación escrita del progreso del alumno y el enlace de la grabación de video."}</li>
            <li>{isFr ? "Enregistrez. L'élève verra instantanément les notes pédagogiques et le bouton \"Voir le cours enregistré\" s'activer sur son portail." : "Guarda los cambios. Al instante, el alumno verá en su portal privado las notas pedagógicas y el botón de \"Ver clase grabada\" habilitado para reproducir el video."}</li>
          </ol>
        </div>

        {/* Sección 5: Materiales y Biblioteca */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "5. Bibliothèque de matériel didactique et affectations" : "5. Biblioteca de Material Didáctico y Asignaciones"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "Le professeur peut partager des fichiers PDF, des audios MP3 ou des liens externes directement avec les élèves :"
              : "El profesor puede compartir archivos PDF, audios MP3 o enlaces de interés directamente con los estudiantes:"}
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>
              <strong>{isFr ? "Enregistrement du document :" : "Registro del Recurso:"}</strong> {isFr 
                ? "Allez dans l'onglet Bibliothèque / Matériel, écrivez un titre, sélectionnez le niveau (A1, A2, etc.) et téléchargez le fichier en toute sécurité sur Supabase Storage."
                : "Ve a la pestaña Biblioteca / Material, escribe un título descriptivo, selecciona el nivel (A1, A2, B1, etc.) y sube el archivo correspondiente de forma segura a Supabase Storage."}
            </li>
            <li>
              <strong>{isFr ? "Affectation par élève :" : "Asignación por Estudiante:"}</strong> {isFr 
                ? "Vous pouvez cocher les cases des élèves qui auront accès à ce document. Les élèves non cochés ne verront pas le fichier sur leur portail."
                : "Puedes marcar las casillas de los alumnos específicos que tendrán acceso exclusivo a este archivo al momento de crearlo o modificarlo. Los alumnos que no estén seleccionados no verán el archivo en sus respectivos portales."}
            </li>
          </ul>
        </div>

        {/* Sección 6: Centro de Comunicaciones */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", color: "#0c1b33", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "16px" }}>
            {isFr ? "6. Centre de communication et notifications" : "6. Centro de Comunicaciones y Notificaciones"}
          </h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "12px" }}>
            {isFr 
              ? "Pour rester en contact avec votre communauté d'élèves, vous disposez de deux outils dans l'onglet Envoyer des Messages :"
              : "Para mantener el contacto con tu comunidad de alumnos, dispones de dos herramientas en la pestaña Enviar Mensajes:"}
          </p>
          <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: "20px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>
              <strong>{isFr ? "Notifications par E-mail :" : "Notificaciones por Correo Electrónico:"}</strong> {isFr 
                ? "Envoyez des messages ou des devoirs directement à la boîte de réception d'un élève ou à tous les élèves de manière groupée via le serveur d'envoi d'e-mails (SMTP) configuré sur la plateforme."
                : "Envía comunicados o tareas directamente al buzón del alumno seleccionado o a todos los alumnos a la vez de forma masiva a través del servidor de correos (SMTP) configurado en la aplicación de forma automatizada."}
            </li>
            <li>
              <strong>{isFr ? "Notifications par WhatsApp :" : "Notificaciones por WhatsApp:"}</strong> {isFr 
                ? "Rédigez un message et cliquez sur envoyer. Le système ouvrira WhatsApp Web avec le texte pré-chargé et le numéro de l'élève prêt, vous n'aurez plus qu'à cliquer sur envoyer."
                : "Redacta un mensaje y envíalo. El sistema abrirá WhatsApp Web con el texto precargado y el número del alumno listo para que solo debas pulsar enviar."}
            </li>
          </ul>
        </div>

        {/* Firma de Autenticidad */}
        <div style={{ marginTop: "60px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b" }}>
          <span>© {new Date().getFullYear()} Florentin Portal. {isFr ? "Documentation Interne." : "Documentación Interna."}</span>
          <span>{isFr ? "Paris, France" : "París, Francia"}</span>
        </div>

      </div>
    </div>
  );
}
