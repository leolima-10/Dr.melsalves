const { chromium } = require('C:/Users/leojp/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  await page.goto('http://localhost:5199/brag-output/work/video/index.html');
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  await page.evaluate(() => window.renderAt(0.6));
  const r = await page.evaluate(() => {
    const dd = document.getElementById('desk').contentDocument;
    const w = dd.defaultView;
    const desc = dd.querySelector('.hero__description');
    const h1 = dd.querySelector('#hero-title');
    return {
      rm: w.matchMedia('(prefers-reduced-motion: reduce)').matches,
      h1: h1.innerHTML.slice(0, 120),
      descInline: desc.getAttribute('style'),
      descOpacity: w.getComputedStyle(desc).opacity,
      descAnim: w.getComputedStyle(desc).animationName,
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
