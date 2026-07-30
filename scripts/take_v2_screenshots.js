const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, '../public/screenshots_v2');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000/v2 ...');
  await page.goto('http://localhost:3000/v2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Full page screenshot
  await page.screenshot({ path: path.join(screenshotsDir, 'v2_full_page.png'), fullPage: true });
  console.log('Saved full page screenshot: v2_full_page.png');

  // Capture every section tag, header, footer, and marquee container
  const elements = await page.$$('header, section, footer, main > div');
  console.log(`Found ${elements.length} section elements to capture.`);

  let index = 1;
  for (const el of elements) {
    try {
      const box = await el.boundingBox();
      if (box && box.height > 40) {
        const filePath = path.join(screenshotsDir, `section_${index}.png`);
        await el.screenshot({ path: filePath });
        console.log(`Saved section_${index}.png (${Math.round(box.width)}x${Math.round(box.height)}px)`);
        index++;
      }
    } catch (err) {
      console.log(`Error capturing section ${index}:`, err.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
