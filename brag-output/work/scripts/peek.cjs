// Screenshots of the live dev site, for reference only.
const { chromium } = require('C:/Users/leojp/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');
const out = path.resolve(__dirname, '..', 'peek');
require('fs').mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const [name, vp] of [['desk', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-hero.png` });
    for (const id of ['resultados', 'procedimentos', 'sobre', 'atendimento', 'contato']) {
      await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${out}/${name}-${id}.png` });
    }
    await page.close();
  }
  await browser.close();
})();
