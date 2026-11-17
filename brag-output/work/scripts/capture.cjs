// Usage:
//   node capture.cjs stills 0.5,3.6,...   -> work/stills/t_<time>.png
//   node capture.cjs full                  -> work/frames/f_0000.jpg ... (600 frames)
const { chromium } = require('C:/Users/leojp/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const WORK = path.resolve(__dirname, '..');
const URL = 'http://localhost:5199/brag-output/work/video/index.html';
const FPS = 30;
const DURATION = 20;

(async () => {
  const [mode, arg] = process.argv.slice(2);
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--hide-scrollbars', '--force-color-profile=srgb'],
  });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console]', m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) {
    console.error('setup error:', err);
    process.exit(1);
  }

  if (mode === 'stills') {
    const dir = path.join(WORK, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of arg.split(',').map(Number)) {
      await page.evaluate((tt) => window.renderAt(tt), t);
      await page.screenshot({ path: path.join(dir, `t_${t.toFixed(3)}.png`) });
      console.log('still', t);
    }
  } else {
    const dir = path.join(WORK, 'frames');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const total = FPS * DURATION;
    const started = Date.now();
    for (let f = 0; f < total; f += 1) {
      const t = f / FPS;
      await page.evaluate((tt) => window.renderAt(tt), t);
      await page.screenshot({ path: path.join(dir, `f_${String(f).padStart(4, '0')}.png`) });
      if (f % 60 === 0) console.log(`frame ${f}/${total} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
    }
    console.log('done', total);
  }
  await browser.close();
})();
