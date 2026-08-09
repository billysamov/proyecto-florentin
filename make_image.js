const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  try {
    const svg = `
      <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
        <!-- Fondo transparente -->
        <rect width="800" height="800" fill="transparent" />
        
        <!-- Bloque principal abajo -->
        <rect x="0" y="200" width="800" height="600" rx="48" ry="48" fill="#e7e5e3" />
        
        <!-- Bloque alto a la derecha -->
        <rect x="360" y="0" width="440" height="800" rx="48" ry="48" fill="#e7e5e3" />
        
        <!-- Parche para que la esquina interior sea recta -->
        <rect x="310" y="200" width="100" height="100" fill="#e7e5e3" />
      </svg>
    `;

    // Procesamos la imagen de la chica
    // .linear(1.15, 10) aumenta contraste y brillo para eliminar los grises del borde blanco ("arroz blanco")
    const student = await sharp('public/student_cutout.png')
      .resize(800, 750, { fit: 'inside', withoutEnlargement: true })
      .linear(1.15, 15) // Fuerza los grises claros a blanco puro
      .toBuffer();

    // Componemos la imagen
    await sharp(Buffer.from(svg))
      .composite([
        { input: student, blend: 'multiply', gravity: 'south' }
      ])
      .png()
      .toFile('public/perfect_hero_image.png');

    console.log("SUCCESS");
  } catch (err) {
    console.error("ERROR:", err);
  }
}

processImage();
