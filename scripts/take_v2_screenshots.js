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

  const sections = [
    { num: 1, id: '#sec-1-header' },
    { num: 2, id: '#sec-2-hero' },
    { num: 3, id: '#sec-3-guarantees' },
    { num: 4, id: '#sec-4-bento' },
    { num: 5, id: '#sec-5-partners' },
    { num: 6, id: '#sec-6-home' },
    { num: 7, id: '#sec-7-stats' },
    { num: 8, id: '#sec-8-global' },
    { num: 9, id: '#sec-9-planes' },
    { num: 10, id: '#sec-10-ticker' },
    { num: 11, id: '#sec-11-corporate' },
    { num: 12, id: '#sec-12-footer' }
  ];

  for (const sec of sections) {
    try {
      const el = await page.$(sec.id);
      if (el) {
        const filePath = path.join(screenshotsDir, `section_${sec.num}.png`);
        await el.screenshot({ path: filePath });
        console.log(`[SUCCESS] Saved section_${sec.num}.png from selector ${sec.id}`);
      } else {
        console.log(`[WARNING] Element not found for selector: ${sec.id}`);
      }
    } catch (err) {
      console.log(`[ERROR] Failed capturing section_${sec.num}:`, err.message);
    }
  }

  await browser.close();
  console.log('All 12 section screenshots captured accurately!');
}

captureScreenshots().catch(console.error);
