const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margin: 36,
  info: {
    Title: 'Formulario Completo de Contenidos V2 - Profesor Florentin',
    Author: 'Proyecto Florentin',
    Subject: 'Brief 100% Exhaustivo Sección 1 a 12 con Capturas'
  }
});

const outputPath = path.join(__dirname, '../public/Formulario_Contenidos_LingPlus_V2.pdf');
const screenshotsDir = path.join(__dirname, '../public/screenshots_v2');

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const darkNavy = '#0f172a';
const borderGray = '#cbd5e1';

// Encabezado Principal del Documento PDF
doc.rect(36, 36, 523, 75).fill('#0055a5');
doc.fillColor('#ffffff').fontSize(15).font('Helvetica-Bold').text('FORMULARIO EXHAUSTIVO DE CONTENIDOS (SECCIONES 1 A 12)', 50, 48);
doc.fontSize(9.5).font('Helvetica').text('Clases de Francés - Profesor Florentin | Documento de Trabajo con Captura de Cada Sección', 50, 70);
doc.fontSize(8.5).font('Helvetica-Oblique').text('Por favor, completa cada campo de texto deseado debajo de la captura correspondiente.', 50, 86);

doc.moveDown(3);

function renderSectionWithImage(sectionNum, title, imageName, fields) {
  if (doc.y > 620) doc.addPage();

  // Cabecera de la Sección
  doc.rect(36, doc.y, 523, 24).fill('#e2e8f0');
  doc.fillColor(darkNavy).fontSize(10.5).font('Helvetica-Bold').text(`SECCIÓN ${sectionNum}: ${title.toUpperCase()}`, 46, doc.y + 6);
  doc.moveDown(1.2);

  // Captura de Pantalla Exacta de la Sección
  const imagePath = path.join(screenshotsDir, imageName);
  if (fs.existsSync(imagePath)) {
    if (doc.y > 520) doc.addPage();
    try {
      doc.image(imagePath, 36, doc.y, { fit: [523, 175], align: 'center' });
      doc.y += 185;
    } catch (e) {
      console.log(`Could not embed image ${imageName}:`, e.message);
    }
  }

  // Lista Exhaustiva de Campos para Completar
  fields.forEach(field => {
    if (doc.y > 710) doc.addPage();

    doc.fillColor(darkNavy).fontSize(9).font('Helvetica-Bold').text(field.code + ' ' + field.label);
    if (field.current) {
      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Oblique').text(`Texto actual en plantilla: "${field.current}"`);
    }

    doc.moveDown(0.2);

    const boxHeight = field.multiline ? 36 : 20;
    doc.rect(36, doc.y, 523, boxHeight).strokeColor(borderGray).lineWidth(1).stroke();
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(' Escribe el texto deseado para este campo aquí...', 42, doc.y + 4);

    doc.y += (boxHeight - 10);
    doc.moveDown(0.5);
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
  { code: '1.7', label: 'Texto Enlace Portal Alumnos:', current: 'Área Alumno' },
  { code: '1.8', label: 'Texto Botón CTA Principal Header:', current: 'Agendar Clase' }
]);

// 2. Hero Portada
renderSectionWithImage(2, 'Hero Principal (Portada)', 'section_2.png', [
  { code: '2.1', label: 'Insignia de Calificación Superior:', current: '4.9/5 • +200 Alumnos Formados' },
  { code: '2.2', label: 'Titular H1 Principal (Línea 1):', current: 'Habla Francés,' },
  { code: '2.3', label: 'Titular H1 Principal (Línea 2):', current: 'Conéctate con el Mundo' },
  { code: '2.4', label: 'Subtítulo Descriptivo de Portada:', current: 'Aprende francés fluido con Florentin, profesor nativo nacido en París. Clases particulares 1 a 1 en vivo por Google Meet, corrigiendo tu acento en tiempo real.', multiline: true },
  { code: '2.5', label: 'Texto Botón Primario CTA:', current: 'Agendar Clase Gratuita' },
  { code: '2.6', label: 'Texto Sub-etiqueta Botón CTA:', current: 'Sin compromisos de tarjeta' },
  { code: '2.7', label: 'Badge Flotante en Foto Hero (Título & Texto):', current: 'Florentin • Nativo de París | Clases 100% Personalizadas 1 a 1', multiline: true },
  { code: '2.8', label: 'Items Marquee Banderas / Especialidades:', current: 'Francés Nativo, Pronunciación, Negocios, Viajes, DELF, DALF, Cultura', multiline: true }
]);

// 3. Cinta Azul de Garantías
renderSectionWithImage(3, 'Cinta Azul de Garantías Clave', 'section_3.png', [
  { code: '3.1', label: 'Garantía 1 (Recuadro 1):', current: '100% Profesor Nativo Parisino' },
  { code: '3.2', label: 'Garantía 2 (Recuadro 2):', current: 'Reserva Flexible 24/7' },
  { code: '3.3', label: 'Garantía 3 (Recuadro 3):', current: 'Enfoque Conversacional Real' },
  { code: '3.4', label: 'Garantía 4 (Recuadro 4):', current: 'Preparación DELF / DALF' }
]);

// 4. Bento Grid "¿Por Qué Florentin?"
renderSectionWithImage(4, 'Tarjetas Bento ("¿Por Qué Elegir a Florentin?")', 'section_4.png', [
  { code: '4.1', label: 'Insignia de Categoría Bento:', current: '• ¿POR QUÉ ELEGIR A FLORENTIN?' },
  { code: '4.2', label: 'Titular H2 de la Sección Bento:', current: 'Desbloquea el Francés con un Método Inmersivo' },
  { code: '4.3', label: 'Subtítulo Descriptivo Bento:', current: 'Aprende de un profesor nativo apasionado con clases interactivas diseñadas especialmente para tus objetivos personales y profesionales.', multiline: true },
  { code: '4.4', label: 'Tarjeta 1 - Título:', current: 'Conversación Real' },
  { code: '4.5', label: 'Tarjeta 1 - Descripción:', current: 'Práctica conversacional activa en francés desde la primera sesión con situaciones reales de la vida cotidiana.', multiline: true },
  { code: '4.6', label: 'Tarjeta 2 - Título:', current: 'A Tu Propio Ritmo' },
  { code: '4.7', label: 'Tarjeta 2 - Descripción:', current: 'Opciones de horario 100% flexibles que se adaptan a tu rutina de trabajo y estilo de vida.', multiline: true },
  { code: '4.8', label: 'Tarjeta 3 - Título:', current: 'Material Didáctico Incluido' },
  { code: '4.9', label: 'Tarjeta 3 - Descripción:', current: 'Acceso a biblioteca de guías en PDF, ejercicios de fonética y resúmenes al finalizar cada clase.', multiline: true },
  { code: '4.10', label: 'Tarjeta 4 - Título:', current: 'Acento Perfecto' },
  { code: '4.11', label: 'Tarjeta 4 - Descripción:', current: 'Corrección de acento y pronunciación en tiempo real para lograr sonar limpio y natural.', multiline: true }
]);

// 5. Barra de Confianza / Logos
renderSectionWithImage(5, 'Barra de Respaldos y Confianza', 'section_5.png', [
  { code: '5.1', label: 'Título Superior de Barra:', current: 'CONFIADO POR MÁS DE 200 ALUMNOS Y PROFESIONALES EN TODO EL MUNDO' },
  { code: '5.2', label: 'Elementos de Confianza (París, Google Meet, DALF C2, Stripe, 4.9/5):', current: 'París, Francia | Google Meet | DALF C2 Certified | Stripe | 4.9/5', multiline: true }
]);

// 6. Clases desde Casa
renderSectionWithImage(6, 'Francés Desde la Comodidad del Hogar', 'section_6.png', [
  { code: '6.1', label: 'Insignia de Categoría:', current: '• CLASES ONLINE 1 A 1' },
  { code: '6.2', label: 'Titular H2 de la Sección:', current: 'Francés desde la Comodidad de tu Hogar' },
  { code: '6.3', label: 'Párrafo Descriptivo Principal:', current: 'Disfruta de sesiones individuales por Google Meet diseñadas exclusivamente para que avances con confianza.', multiline: true },
  { code: '6.4', label: 'Punto de Verificación 1 (Título & Texto):', current: 'Guía Paso a Paso: Ruta estructurada desde nivel principiante (A1) hasta nivel profesional (C2).', multiline: true },
  { code: '6.5', label: 'Punto de Verificación 2 (Título & Texto):', current: 'Enfoque Personalizado: Contenido adaptado a tus metas: viajes, trabajo, exámen DELF o mudanza a Francia.', multiline: true },
  { code: '6.6', label: 'Punto de Verificación 3 (Título & Texto):', current: 'Flexible y Accesible: Accede a tus clases y portal desde cualquier ordenador o teléfono móvil.', multiline: true }
]);

// 7. Contador de Estadísticas
renderSectionWithImage(7, 'Cifras y Estadísticas Nativas', 'section_7.png', [
  { code: '7.1', label: 'Estadística 1 - Cifra Numérica & Etiqueta:', current: '+150 | Recursos Didácticos PDF' },
  { code: '7.2', label: 'Estadística 2 - Cifra Numérica & Etiqueta:', current: '98% | Satisfacción en Alumnos' },
  { code: '7.3', label: 'Estadística 3 - Cifra Numérica & Etiqueta:', current: '+1.000 | Horas Impartidas en Vivo' }
]);

// 8. Alcance Internacional Ilustrado 3D
renderSectionWithImage(8, 'Sección Ilustrada 3D Alcance Global', 'section_8.png', [
  { code: '8.1', label: 'Insignia de Prueba Social:', current: '200+ Alumnos Felices' },
  { code: '8.2', label: 'Titular H2 de Alcance Global:', current: 'Domina el Francés, Desde Cualquier Rincón' },
  { code: '8.3', label: 'Párrafo Descriptivo de Cobertura:', current: 'Conectamos alumnos en Perú 🇵🇪, Colombia 🇨🇴, Argentina 🇦🇷 y todo el mundo con profesores nativos en Francia 🇫🇷.', multiline: true },
  { code: '8.4', label: 'Chip Ilustrado 1:', current: '🇫🇷 Profesor Nativo de Francia' },
  { code: '8.5', label: 'Chip Ilustrado 2:', current: '⏰ Zona Horaria Adaptable' },
  { code: '8.6', label: 'Chip Ilustrado 3:', current: '🎯 Preparación Oficial DELF' },
  { code: '8.7', label: 'Texto del Botón CTA Azul:', current: 'Agendar Clase de Prueba' }
]);

// 9. Planes y Precios
renderSectionWithImage(9, 'Planes de Estudio & Precios Interactivos', 'section_9.png', [
  { code: '9.1', label: 'Insignia de Categoría Planes:', current: '• NUESTROS PLANES DE ESTUDIO' },
  { code: '9.2', label: 'Titular H2 Sección Planes:', current: 'Aprende Rápido. Explora Nuestros Planes' },
  { code: '9.3', label: 'Filtros Pestañas de Categoría:', current: 'Todos los Planes | Principiantes (A1-A2) | Intermedio (B1-B2) | Avanzado / DELF' },
  { code: '9.4', label: 'Plan 1 - Título, Descripción, Nivel, Duración y Precio:', current: 'Clase Individual - 15€ / sesión - 1 hora en vivo', multiline: true },
  { code: '9.5', label: 'Plan 2 - Título, Descripción, Nivel, Duración y Precio:', current: 'Pack 4 Clases - 49€ / mes - 1 clase por semana', multiline: true },
  { code: '9.6', label: 'Plan 3 - Título, Descripción, Nivel, Duración y Precio:', current: 'Pack 8 Clases - 89€ / mes - 2 clases por semana', multiline: true },
  { code: '9.7', label: 'Plan 4 - Título, Descripción, Nivel, Duración y Precio:', current: 'Pack 12 Clases - 129€ / mes - 3 clases por semana', multiline: true }
]);

// 10. Ticker Marquee Idiomas
renderSectionWithImage(10, 'Marquee Ticker de Idiomas & Palabras Clave', 'section_10.png', [
  { code: '10.1', label: 'Secuencia de Palabras Clave en Marquee Ticker:', current: 'english + german + spanish + italian + french' }
]);

// 11. Particulares vs Empresas
renderSectionWithImage(11, 'Sección Doble: Particulares vs. Empresas', 'section_11.png', [
  { code: '11.1', label: 'Tarjeta Particulares - Insignia & Título:', current: '• CLASES PARTICULARES | Clases Individuales 1 a 1' },
  { code: '11.2', label: 'Tarjeta Particulares - Descripción:', current: 'Para estudiantes particulares que buscan atención exclusiva y flexibilidad total en su horario.', multiline: true },
  { code: '11.3', label: 'Tarjeta Corporativo - Insignia & Título:', current: '• PARA EQUIPOS Y EMPRESAS | Francés para Negocios' },
  { code: '11.4', label: 'Tarjeta Corporativo - Descripción:', current: 'Capacitación corporativa personalizada de francés comercial para profesionales y ejecutivos.', multiline: true }
]);

// 12. Pie de Página Footer
renderSectionWithImage(12, 'Pie de Página Footer (Ling+)', 'section_12.png', [
  { code: '12.1', label: 'Columna 1 - Cursos & Niveles:', current: 'Francés Principiantes (A1-A2), Intermedio (B1-B2), Avanzado (C1-C2), Exámenes DELF & DALF', multiline: true },
  { code: '12.2', label: 'Columna 2 - Contacto Directo:', current: '📍 París, Francia | 💬 WhatsApp: +33 7 44 32 13 56 | 🌐 Clases Online por Google Meet', multiline: true },
  { code: '12.3', label: 'Columna 3 - Recursos & Enlaces:', current: 'Portal Alumnos, Acceso Administrador, Privacidad, Términos y Condiciones', multiline: true },
  { code: '12.4', label: 'Nombre de Marca Gigante & Copyright:', current: 'Ling+ | © 2026 Florentin French • Ling+ Edition. Todos los derechos reservados.' }
]);

doc.end();

writeStream.on('finish', () => {
  console.log('PDF 100% Exhaustivo (Secciones 1 a 12) generado exitosamente en:', outputPath);
});
