const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margin: 36,
  info: {
    Title: 'Formulario Completo de Contenidos V2 - Profesor Florentin',
    Author: 'Proyecto Florentin',
    Subject: 'Brief Exhaustivo con Capturas de Pantalla'
  }
});

const outputPath = path.join(__dirname, '../public/Formulario_Contenidos_LingPlus_V2.pdf');
const screenshotsDir = path.join(__dirname, '../public/screenshots_v2');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const darkNavy = '#0f172a';
const primaryBlue = '#0066ff';
const textSlate = '#475569';
const borderGray = '#cbd5e1';

// Encabezado Principal del Documento
doc.rect(36, 36, 523, 75).fill('#0066ff');
doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('FORMULARIO EXHAUSTIVO DE CONTENIDOS (V2)', 50, 48);
doc.fontSize(10).font('Helvetica').text('Clases de Francés - Profesor Florentin | Documento Oficial de Trabajo con Capturas de Pantalla', 50, 72);
doc.fontSize(9).font('Helvetica-Oblique').text('Por favor, completa cada campo de texto deseado debajo de la captura correspondiente.', 50, 88);

doc.moveDown(3);

function renderSectionWithImage(sectionNum, title, imageName, fields) {
  if (doc.y > 650) doc.addPage();

  // Cabecera de la Sección
  doc.rect(36, doc.y, 523, 24).fill('#e2e8f0');
  doc.fillColor(darkNavy).fontSize(11).font('Helvetica-Bold').text(`SECCIÓN ${sectionNum}: ${title.toUpperCase()}`, 46, doc.y + 6);
  doc.moveDown(1.2);

  // Captura de Pantalla de la Sección si existe
  const imagePath = path.join(screenshotsDir, imageName);
  if (fs.existsSync(imagePath)) {
    if (doc.y > 550) doc.addPage();
    try {
      doc.image(imagePath, 36, doc.y, { fit: [523, 180], align: 'center' });
      doc.y += 190;
    } catch (e) {
      console.log(`Could not embed image ${imageName}:`, e.message);
    }
  }

  // Lista Exhaustiva de Campos
  fields.forEach(field => {
    if (doc.y > 710) doc.addPage();

    doc.fillColor(darkNavy).fontSize(9.5).font('Helvetica-Bold').text(field.code + ' ' + field.label);
    if (field.current) {
      doc.fillColor('#64748b').fontSize(8.5).font('Helvetica-Oblique').text(`Texto actual en plantilla: "${field.current}"`);
    }

    doc.moveDown(0.2);

    const boxHeight = field.multiline ? 38 : 22;
    doc.rect(36, doc.y, 523, boxHeight).strokeColor(borderGray).lineWidth(1).stroke();
    doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica').text(' Escribe el texto deseado para este campo aquí...', 42, doc.y + 5);

    doc.y += (boxHeight - 10);
    doc.moveDown(0.6);
  });

  doc.moveDown(0.8);
}

// 1. Navbar Header
renderSectionWithImage(1, 'Cabecera & Menú de Navegación', 'section_1.png', [
  { code: '1.1', label: 'Nombre de la Marca / Logotipo:', current: 'Florentin French (Ling+ V2)' },
  { code: '1.2', label: 'Enlace Menú 1:', current: 'Profesor' },
  { code: '1.3', label: 'Enlace Menú 2:', current: 'Método' },
  { code: '1.4', label: 'Enlace Menú 3:', current: 'Por Qué Florentin' },
  { code: '1.5', label: 'Enlace Menú 4:', current: 'Planes & Precios' },
  { code: '1.6', label: 'Enlace Menú 5:', current: 'Testimonios' },
  { code: '1.7', label: 'Texto Botón Portal Alumnos:', current: 'Área de Alumnos' },
  { code: '1.8', label: 'Texto Botón CTA Principal Header:', current: 'Agendar Clase' }
]);

// 2. Hero Portada
renderSectionWithImage(2, 'Hero Principal (Portada)', 'section_2.png', [
  { code: '2.1', label: 'Insignia de Calificación Superior:', current: '★ 4.9/5 Reseñas Excelentes' },
  { code: '2.2', label: 'Titular H1 Principal (Línea 1):', current: 'Aprende Francés Real,' },
  { code: '2.3', label: 'Titular H1 Principal (Línea 2):', current: 'con un Profesor Nativo' },
  { code: '2.4', label: 'Subtítulo Descriptivo de Portada:', current: 'Clases individuales por videoconferencia adaptadas a tu nivel (A1-C2), ritmo y horarios.', multiline: true },
  { code: '2.5', label: 'Texto Botón Primario (CTA Azul):', current: 'Agendar Clase de Prueba' },
  { code: '2.6', label: 'Texto Botón Secundario (Outline):', current: 'Ver Método de Estudio' },
  { code: '2.7', label: 'Insignia de Disponibilidad de Clases:', current: '● Clases Disponibles Hoy' },
  { code: '2.8', label: 'Testimonio en Tarjeta Flotante Hero:', current: 'Florentin explica la pronunciación con paciencia increíble' }
]);

// 3. Cinta Azul de Garantías
renderSectionWithImage(3, 'Cinta Azul de Garantías Clave', 'section_3.png', [
  { code: '3.1', label: 'Garantía 1 (Recuadro Translúcido 1):', current: '✓ Profesor Nativo de París' },
  { code: '3.2', label: 'Garantía 2 (Recuadro Translúcido 2):', current: '✓ Clases 1 a 1 100% Personalizadas' },
  { code: '3.3', label: 'Garantía 3 (Recuadro Translúcido 3):', current: '✓ Horarios Adaptados a Latinoamérica' },
  { code: '3.4', label: 'Garantía 4 (Recuadro Translúcido 4):', current: '✓ Preparación Oficial Exámenes DELF/DALF' }
]);

// 4. Bento Grid "¿Por Qué Florentin?"
renderSectionWithImage(4, 'Tarjetas Bento ("¿Por Qué Elegir a Florentin?")', 'section_4.png', [
  { code: '4.1', label: 'Insignia de Categoría Bento:', current: '• ¿POR QUÉ ELEGIR A FLORENTIN?' },
  { code: '4.2', label: 'Titular H2 de la Sección Bento:', current: 'Desbloquea el Francés con un Método Inmersivo' },
  { code: '4.3', label: 'Subtítulo Descriptivo Bento:', current: 'Aprende de un profesor nativo apasionado con clases interactivas diseñadas especialmente para ti.', multiline: true },
  { code: '4.4', label: 'Tarjeta 1 - Título:', current: 'Conversación Real' },
  { code: '4.5', label: 'Tarjeta 1 - Descripción:', current: 'Práctica conversacional activa en francés desde la primera sesión con situaciones reales de la vida cotidiana.', multiline: true },
  { code: '4.6', label: 'Tarjeta 2 - Título:', current: 'A Tu Propio Ritmo' },
  { code: '4.7', label: 'Tarjeta 2 - Descripción:', current: 'Opciones de horario 100% flexibles que se adaptan a tu rutina de trabajo y estilo de vida.', multiline: true },
  { code: '4.8', label: 'Tarjeta 3 - Título:', current: 'Material Didáctico Incluido' },
  { code: '4.9', label: 'Tarjeta 3 - Descripción:', current: 'Acceso a biblioteca de guías en PDF, ejercicios de fonética y resúmenes al finalizar cada clase.', multiline: true },
  { code: '4.10', label: 'Tarjeta 4 - Título:', current: 'Acento Perfecto' },
  { code: '4.11', label: 'Tarjeta 4 - Descripción:', current: 'Corrección de acento y pronunciación en tiempo real para lograr sonar limpio y natural.', multiline: true }
]);

// 5. Marquee Chips
renderSectionWithImage(5, 'Marquee Ticker de Especialidades (Chips)', 'section_5.png', [
  { code: '5.1', label: 'Chip 1:', current: '🇫🇷 Francés Nativo de París' },
  { code: '5.2', label: 'Chip 2:', current: '🥐 Pronunciación Auténtica' },
  { code: '5.3', label: 'Chip 3:', current: '💼 Francés para Negocios' },
  { code: '5.4', label: 'Chip 4:', current: '✈️ Francés para Viajes & Vida Diaria' },
  { code: '5.5', label: 'Chip 5:', current: '🎓 Exámenes DELF (A1-B2)' },
  { code: '5.6', label: 'Chip 6:', current: '📜 Exámenes DALF (C1-C2)' },
  { code: '5.7', label: 'Chip 7:', current: '🍷 Conversación & Cultura Parisina' }
]);

// 6. Clases desde Casa
renderSectionWithImage(6, 'Clases Desde la Comodidad del Hogar', 'section_6.png', [
  { code: '6.1', label: 'Insignia de Categoría:', current: '• METODOLOGÍA ONLINE' },
  { code: '6.2', label: 'Titular H2 de la Sección:', current: 'Aprende Francés Desde la Comodidad de Tu Hogar' },
  { code: '6.3', label: 'Párrafo Descriptivo Principal:', current: 'Sin traslados ni pérdidas de tiempo. Conéctate a tus clases individuales desde tu computadora o tablet.', multiline: true },
  { code: '6.4', label: 'Punto de Verificación 1 (Título & Texto):', current: 'Plataforma Fácil de Usar: Enlace directo a tu aula sin instalaciones complejas.', multiline: true },
  { code: '6.5', label: 'Punto de Verificación 2 (Título & Texto):', current: 'Grabaciones y Resúmenes: Repasa los apuntes y ejercicios de cada clase.', multiline: true },
  { code: '6.6', label: 'Punto de Verificación 3 (Título & Texto):', current: 'Soporte Directo por WhatsApp: Resuelve dudas de tarea entre sesiones.', multiline: true }
]);

// 7. Estadísticas Nativas
renderSectionWithImage(7, 'Cifras y Estadísticas Nativas', 'section_7.png', [
  { code: '7.1', label: 'Estadística 1 - Cifra Numérica:', current: '+150' },
  { code: '7.2', label: 'Estadística 1 - Etiqueta Explicativa:', current: 'Alumnos Activos' },
  { code: '7.3', label: 'Estadística 2 - Cifra Numérica:', current: '98%' },
  { code: '7.4', label: 'Estadística 2 - Etiqueta Explicativa:', current: 'Éxito en Exámenes DELF' },
  { code: '7.5', label: 'Estadística 3 - Cifra Numérica:', current: '+1.000' },
  { code: '7.6', label: 'Estadística 3 - Etiqueta Explicativa:', current: 'Horas Impartidas en Vivo' }
]);

// 8. Alcance Internacional
renderSectionWithImage(8, 'Sección Ilustrada 3D Alcance Internacional', 'section_8.png', [
  { code: '8.1', label: 'Insignia de Prueba Social:', current: '200+ Alumnos Felices' },
  { code: '8.2', label: 'Titular H2 de Alcance Global:', current: 'Domina el Francés, Desde Cualquier Rincón' },
  { code: '8.3', label: 'Párrafo Descriptivo de Cobertura:', current: 'Conectamos alumnos en Perú 🇵🇪, Colombia 🇨🇴, Argentina 🇦🇷 con profesores nativos en Francia 🇫🇷.', multiline: true },
  { code: '8.4', label: 'Chip Ilustrado 1:', current: '🇫🇷 Profesor Nativo de Francia' },
  { code: '8.5', label: 'Chip Ilustrado 2:', current: '⏰ Zona Horaria Adaptable' },
  { code: '8.6', label: 'Chip Ilustrado 3:', current: '🎯 Preparación Oficial DELF' },
  { code: '8.7', label: 'Texto del Botón CTA Azul:', current: 'Agendar Clase de Prueba' }
]);

// 9. Planes y Cursos
renderSectionWithImage(9, 'Planes de Estudio & Precios Interactivos', 'section_9.png', [
  { code: '9.1', label: 'Insignia de Categoría Planes:', current: '• NUESTROS PLANES DE ESTUDIO' },
  { code: '9.2', label: 'Titular H2 Sección Planes:', current: 'Aprende Rápido. Explora Nuestros Planes' },
  { code: '9.3', label: 'Filtro Pestaña 1:', current: 'Todos los Niveles' },
  { code: '9.4', label: 'Filtro Pestaña 2:', current: 'Principiantes A1-A2' },
  { code: '9.5', label: 'Filtro Pestaña 3:', current: 'Intermedio B1-B2' },
  { code: '9.6', label: 'Filtro Pestaña 4:', current: 'Avanzado / DELF C1-C2' },
  { code: '9.7', label: 'Plan 1 - Nombre, Precio, Frecuencia y Lista de Beneficios:', current: 'Clase Individual - 15€ / sesión - 1 hora en vivo', multiline: true },
  { code: '9.8', label: 'Plan 2 - Nombre, Precio, Frecuencia y Lista de Beneficios:', current: 'Pack 4 Clases - 49€ / mes - 1 clase por semana', multiline: true },
  { code: '9.9', label: 'Plan 3 - Nombre, Precio, Frecuencia y Lista de Beneficios:', current: 'Pack 8 Clases - 89€ / mes - 2 clases por semana', multiline: true },
  { code: '9.10', label: 'Plan 4 - Nombre, Precio, Frecuencia y Lista de Beneficios:', current: 'Pack 12 Clases - 129€ / mes - 3 clases por semana', multiline: true }
]);

// 10. Ticker Marquee Idiomas
renderSectionWithImage(10, 'Marquee Ticker de Idiomas & Palabras Clave', 'section_10.png', [
  { code: '10.1', label: 'Secuencia de Palabras Clave:', current: 'english + german + spanish + italian + french' }
]);

// 11. Particulares vs Empresas
renderSectionWithImage(11, 'Sección Doble: Particulares vs. Empresas', 'section_11.png', [
  { code: '11.1', label: 'Tarjeta Particulares - Título & Descripción:', current: 'Clases Individuales 1 a 1 para particulares de nivel A1 a C2.', multiline: true },
  { code: '11.2', label: 'Tarjeta Particulares - Lista de Beneficios:', current: '• Plan 100% a medida | • Horarios flexibles | • Corrección directa de acento', multiline: true },
  { code: '11.3', label: 'Tarjeta Corporativo - Título & Descripción:', current: 'Programa para Empresas & Equipos de Trabajo.', multiline: true },
  { code: '11.4', label: 'Tarjeta Corporativo - Lista de Beneficios:', current: '• Francés de negocios | • Facturación corporativa | • Reportes de progreso', multiline: true }
]);

doc.end();

writeStream.on('finish', () => {
  console.log('PDF Exhaustivo con capturas generado exitosamente en:', outputPath);
});
