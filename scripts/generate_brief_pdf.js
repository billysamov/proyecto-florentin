const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margin: 40,
  info: {
    Title: 'Formulario de Recopilacion de Contenidos V2 - Clases de Frances',
    Author: 'Proyecto Florentin',
    Subject: 'Brief de Contenidos Web Versión 2'
  }
});

const outputPath = path.join(__dirname, '../public/Formulario_Contenidos_LingPlus_V2.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Encabezado del documento
doc.rect(40, 40, 515, 70).fill('#0066ff');
doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('PLANTILLA DE RECOPILACIÓN DE CONTENIDOS (V2)', 55, 55);
doc.fontSize(11).font('Helvetica').text('Clases de Francés - Profesor Florentin | Documento de Trabajo para el Cliente', 55, 80);

doc.moveDown(2.5);

// Introducción e Instrucciones
doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('📌 Instrucciones para completar este documento:');
doc.moveDown(0.4);
doc.fillColor('#475569').fontSize(10).font('Helvetica').text(
  'Este documento contiene todos los campos de texto de la nueva Versión 2 de la plataforma web. Por favor, revisa cada sección y escribe el texto exacto o modificaciones que deseas mostrar en la versión final desplegada.'
);

doc.moveDown(1.5);

// Helper para Secciones
function renderSection(title, fields) {
  if (doc.y > 700) doc.addPage();
  
  doc.rect(40, doc.y, 515, 24).fill('#e2e8f0');
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(title, 50, doc.y + 6);
  doc.moveDown(1);

  fields.forEach(field => {
    if (doc.y > 710) doc.addPage();
    
    doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(field.label);
    if (field.current) {
      doc.fillColor('#64748b').fontSize(9).font('Helvetica-Oblique').text(`Texto actual en plantilla: "${field.current}"`);
    }
    
    doc.moveDown(0.3);
    
    // Cuadro de texto para llenar
    const boxHeight = field.multiline ? 44 : 24;
    doc.rect(40, doc.y, 515, boxHeight).strokeColor('#cbd5e1').lineWidth(1).stroke();
    doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text(' Escribe el texto deseado aquí...', 45, doc.y + 6);
    
    doc.y += (boxHeight - 12);
    doc.moveDown(0.8);
  });
  
  doc.moveDown(0.5);
}

// 1. Cabecera / Navbar
renderSection('SECCIÓN 1: CABECERA Y MENÚ SUPERIOR', [
  { label: '1.1 Nombre de la Marca / Logotipo:', current: 'Ling+' },
  { label: '1.2 Texto del Botón Principal de Acción (CTA):', current: 'Agendar Clase de Prueba' },
  { label: '1.3 Enlaces del Menú de Navegación:', current: 'Inicio, Planes, Cursos, Testimonios, Contacto' }
]);

// 2. Hero Principal
renderSection('SECCIÓN 2: HERO PRINCIPAL (PORTADA WEB)', [
  { label: '2.1 Titular Principal H1 (Título que ven al entrar):', current: 'Aprende Francés con un Profesor Nativo en Vivo', multiline: true },
  { label: '2.2 Subtítulo Descriptivo / Propuesta de Valor:', current: 'Clases individuales personalizadas adaptadas a tus objetivos y horarios en Latinoamérica.', multiline: true },
  { label: '2.3 Insignia Destacada / Prueba Social:', current: '200+ Alumnos Felices' }
]);

// 3. Barra de Beneficios Clave
renderSection('SECCIÓN 3: BARRA AZUL DE BENEFICIOS DESTACADOS', [
  { label: '3.1 Beneficio 1:', current: 'Profesores Nativos de Francia' },
  { label: '3.2 Beneficio 2:', current: 'Clases 1 a 1 Personalizadas' },
  { label: '3.3 Beneficio 3:', current: 'Horarios Flexibles para Latinoamérica' },
  { label: '3.4 Beneficio 4:', current: 'Preparación Oficial DELF / DALF' }
]);

// 4. Tarjetas Bento
renderSection('SECCIÓN 4: TARJETAS BENTO ("PILARES DE ENSEÑANZA")', [
  { label: '4.1 Tarjeta 1 - Título & Descripción:', current: 'Clases 100% en Vivo por Video Conferencia', multiline: true },
  { label: '4.2 Tarjeta 2 - Título & Descripción:', current: 'Material Didáctico Exclusivo e Interactivo', multiline: true },
  { label: '4.3 Tarjeta 3 - Título & Descripción:', current: 'Enfoque en Conversación y Pronunciación Real', multiline: true },
  { label: '4.4 Tarjeta 4 - Título & Descripción:', current: 'Flexibilidad Total de Reprogramación de Clases', multiline: true }
]);

// 5. Estadísticas
renderSection('SECCIÓN 5: CIFRAS Y ESTADÍSTICAS DEL PROFESOR', [
  { label: '5.1 Estadística 1 (Cifra y Etiqueta):', current: '+150 Alumnos Activos' },
  { label: '5.2 Estadística 2 (Cifra y Etiqueta):', current: '98% Éxito en Exámenes DELF' },
  { label: '5.3 Estadística 3 (Cifra y Etiqueta):', current: '+1.000 Horas Impartidas en Vivo' }
]);

// 6. Alcance Internacional
renderSection('SECCIÓN 6: ALCANCE INTERNACIONAL (FRANCIA Y LATINOAMÉRICA)', [
  { label: '6.1 Titular de Conexión Internacional:', current: 'Domina el Francés Desde Cualquier Rincón', multiline: true },
  { label: '6.2 Párrafo Explicativo de Cobertura:', current: 'Conectamos alumnos en Perú, Colombia, Argentina y todo el mundo con profesores nativos en Francia.', multiline: true },
  { label: '6.3 Países Objetivo a Mencionar:', current: 'Perú, Colombia, Argentina, México, Chile, España, Francia' }
]);

// 7. Planes y Precios
renderSection('SECCIÓN 7: PLANES DE ESTUDIO Y PRECIOS', [
  { label: '7.1 Plan 1 (Individual / Prueba):', current: 'Clase Individual - 15€ / sesión - 1 hora en vivo', multiline: true },
  { label: '7.2 Plan 2 (Paquete Básico):', current: 'Pack 4 Clases - 49€ / mes - 1 clase por semana', multiline: true },
  { label: '7.3 Plan 3 (Paquete Recomendado / Estándar):', current: 'Pack 8 Clases - 89€ / mes - 2 clases por semana', multiline: true },
  { label: '7.4 Plan 4 (Paquete Intensivo / Avanzado):', current: 'Pack 12 Clases - 129€ / mes - 3 clases por semana', multiline: true }
]);

// 8. Clases Particulares vs Corporativo
renderSection('SECCIÓN 8: CLASES INDIVIDUALES VS. EMPRESAS (CORPORATIVO)', [
  { label: '8.1 Bloque Clases Particulares (Descripción y Beneficios):', current: 'Atención personalizada para particulares de nivel A1 a C2.', multiline: true },
  { label: '8.2 Bloque Clases para Empresas (Descripción y Beneficios):', current: 'Capacitación en francés de negocios para equipos y empresas.', multiline: true }
]);

// 9. Pie de Página (Footer)
renderSection('SECCIÓN 9: DATOS DE CONTACTO Y PIE DE PÁGINA (FOOTER)', [
  { label: '9.1 Número de WhatsApp de Atención:', current: '+33 7 44 32 13 56' },
  { label: '9.2 Correo Electrónico Oficial:', current: 'contacto@florentinfrancais.com' },
  { label: '9.3 Horarios de Atención:', current: 'Lunes a Sábado de 08:00 a 20:00 (Hora Francia / Latam)' },
  { label: '9.4 Texto de Derechos Reservados / Copyright:', current: '© 2026 Profesor Florentin. Todos los derechos reservados.' }
]);

doc.end();

writeStream.on('finish', () => {
  console.log('PDF generado exitosamente en:', outputPath);
});
