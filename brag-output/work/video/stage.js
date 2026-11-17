// Brag video stage: every visual state is a pure function of time `t` (seconds).
// The real site runs in two same-origin iframes (desktop hero + 390px mobile).
import gsap from 'gsap';
import '/src/styles.css';
import { buildHoneycomb } from '/src/lib/honeycomb.js';
import {
  BRAND_PHRASE,
  BRAND_SIGNATURE,
  DISPLAY_NAME,
  PROFESSIONAL,
  SITE_URL,
  getWhatsAppLink,
} from '/src/config/site.js';

const BEAT = 60 / 96;
const b = (n) => n * BEAT;

// ---------- easing helpers ----------
const E = {
  o3: gsap.parseEase('power3.out'),
  o2: gsap.parseEase('power2.out'),
  i2: gsap.parseEase('power2.in'),
  io2: gsap.parseEase('power2.inOut'),
  io3: gsap.parseEase('power3.inOut'),
  sio: gsap.parseEase('sine.inOut'),
  lin: (p) => p,
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const prog = (t, a, c) => (t <= a ? 0 : t >= c ? 1 : clamp01((t - a) / (c - a)));
const tw = (t, a, c, ease = E.o3) => ease(prog(t, a, c));
const lerp = (a, c, p) => a + (c - a) * p;
// value along keyframes [[time, value, ease]...]
function keys(t, list) {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i += 1) {
    const [t1, v1, ease = E.sio] = list[i];
    const [t0, v0] = list[i - 1];
    if (t <= t1) return lerp(v0, v1, ease(prog(t, t0, t1)));
  }
  return list[list.length - 1][1];
}
function style(el, { o, x = 0, y = 0, s = 1, extra = '' }) {
  if (!el) return;
  if (o !== undefined) el.style.opacity = String(o);
  el.style.transform = `translate(${x}px, ${y}px) scale(${s}) ${extra}`.trim();
}
// rise in during [a, c], out during [d, e] (optional)
function rise(el, t, a, c, d = Infinity, e = Infinity, dist = 26) {
  const pin = tw(t, a, c, E.o3);
  const pout = tw(t, d, e, E.i2);
  style(el, { o: pin * (1 - pout), y: (1 - pin) * dist - pout * 14 });
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// ---------- static content from the project config ----------
const waText = new URL(getWhatsAppLink('procedures', { service: 'Harmonização facial' })).searchParams.get('text');
const WA_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2 22l5.12-1.34A9.93 9.93 0 1 0 12.04 2Zm0 18.06c-1.47 0-2.91-.39-4.18-1.130l-.3-.18-3.04.8.81-2.96-.19-.31A8.14 8.14 0 1 1 12.04 20.06Zm4.47-6.1c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.060-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.3.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.07-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29Z"/></svg>';
$('#msgIcon').innerHTML = WA_ICON;
$('#msgMeta').textContent = `Para ${DISPLAY_NAME}`;
$('#bubble').textContent = waText;

// Bee: same drawing as BrandLogo (src/components/common.jsx).
$('#logo').innerHTML = `
  <svg viewBox="22 18 76 88" fill="none" stroke="#c9973f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <mask id="v-bee" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
      <rect width="120" height="120" fill="#fff" stroke="none" />
      <ellipse cx="60" cy="72" rx="14" ry="22" fill="#000" stroke="none" />
      <circle cx="60" cy="42" r="7" fill="#000" stroke="none" />
    </mask>
    <g mask="url(#v-bee)">
      <ellipse class="d" cx="42" cy="46" rx="18" ry="10" transform="rotate(-32 42 46)" />
      <ellipse class="d" cx="78" cy="46" rx="18" ry="10" transform="rotate(32 78 46)" />
    </g>
    <ellipse class="d" cx="60" cy="72" rx="14" ry="22" />
    <path class="d" d="M47 66 H73 M47 78 H73" />
    <circle class="d" cx="60" cy="42" r="7" />
    <path class="d" d="M56 36 Q52 27 46 25 M64 36 Q68 27 74 25" />
    <path class="d" d="M60 94 V101" />
  </svg>
  <span class="v-logo__name">${PROFESSIONAL.firstName} <em>${PROFESSIONAL.lastName}</em></span>`;
$('#phrase').innerHTML = `<em>${BRAND_SIGNATURE}.</em> ${BRAND_PHRASE}`;
$('#url').innerHTML = `<i></i>${SITE_URL.replace(/^https?:\/\//, '')}<i></i>`;
const beeStrokes = $$('#logo .d');
const beeLens = beeStrokes.map((el) => el.getTotalLength());
beeStrokes.forEach((el, i) => {
  el.style.strokeDasharray = `${beeLens[i]} ${beeLens[i]}`;
});

// Honeycomb clusters from the project's own generator.
const STROKES = { light: [0.1, 0.18, 0.28, 0.4], dark: [0.12, 0.22, 0.34, 0.5] };
const ACCENT = { light: { fill: '#e8c9bd', o: 0.55 }, dark: { fill: '#c9973f', o: 0.35 } };
function favo(el, { side, seed, accents, variant, width, left, right, top }) {
  const hc = buildHoneycomb({ side, seed, accents });
  const levels = hc.levels
    .map((d, i) => `<path data-l="${i}" d="${d}" fill="none" stroke="#c9973f" stroke-width="1" stroke-opacity="${STROKES[variant][i]}"/>`)
    .join('');
  const acc = hc.accents
    .map((d) => `<path class="acc" d="${d}" fill="${ACCENT[variant].fill}" fill-opacity="${ACCENT[variant].o}"/>`)
    .join('');
  el.innerHTML = `<svg viewBox="0 0 ${hc.width} ${hc.height}">${levels}${acc}</svg>`;
  Object.assign(el.style, { width: `${width}px`, top: `${top}px` });
  if (left !== undefined) el.style.left = `${left}px`;
  if (right !== undefined) el.style.right = `${right}px`;
  return { el, levels: [...el.querySelectorAll('[data-l]')].reverse(), accents: [...el.querySelectorAll('.acc')] };
}
const favoR = favo($('#favoR'), { side: 'right', seed: 1, accents: 2, variant: 'light', width: 760, right: 0, top: 120 });
const favoL = favo($('#favoL'), { side: 'left', seed: 2, accents: 1, variant: 'light', width: 520, left: 0, top: 640 });
const favoDL = favo($('#favoDL'), { side: 'left', seed: 3, accents: 1, variant: 'dark', width: 640, left: 0, top: 420 });
const favoDR = favo($('#favoDR'), { side: 'right', seed: 4, accents: 1, variant: 'dark', width: 640, right: 0, top: -60 });

// ---------- stand-in images for the slider (never patient photos) ----------
function standin(filled) {
  const W = 640;
  const H = 800;
  const R = 54;
  const hw = R * Math.sqrt(3) / 2;
  let cells = '';
  let row = 0;
  for (let y = -R; y < H + R; y += R * 1.5, row += 1) {
    for (let x = row % 2 ? hw : 0; x < W + hw * 2; x += hw * 2) {
      const pts = [0, 1, 2, 3, 4, 5]
        .map((k) => {
          const a = (Math.PI / 3) * k - Math.PI / 2;
          return `${(x + (R - 3) * Math.cos(a)).toFixed(1)},${(y + (R - 3) * Math.sin(a)).toFixed(1)}`;
        })
        .join(' ');
      const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      cells += filled
        ? `<polygon points="${pts}" fill="url(#g${h < 0.33 ? 1 : h < 0.7 ? 2 : 3})" stroke="#a8772a" stroke-width="2.5"/>`
        : `<polygon points="${pts}" fill="none" stroke="#c9973f" stroke-opacity="0.55" stroke-width="2.5"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${filled ? '#f6e3bd' : '#f8efe2'}"/><stop offset="1" stop-color="${filled ? '#e9c98a' : '#efe1cb'}"/></linearGradient>
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0cf86"/><stop offset="1" stop-color="#c9973f"/></linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8bd62"/><stop offset="1" stop-color="#b9812b"/></linearGradient>
      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5dca2"/><stop offset="1" stop-color="#d3a24c"/></linearGradient>
      <radialGradient id="sheen" cx="0.3" cy="0.22" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="${filled ? 0.35 : 0.5}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>${cells}<rect width="${W}" height="${H}" fill="url(#sheen)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ---------- iframe setup ----------
const desk = $('#desk');
const mob = $('#mob');
const loaded = (frame) =>
  new Promise((r) => {
    if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.querySelector('#hero-title')) r();
    else frame.addEventListener('load', () => r(), { once: true });
  });

async function waitImages(doc) {
  const imgs = [...doc.images].filter((img) => getComputedStyle(img).display !== 'none' && img.closest('[style*="display: none"]') === null);
  await Promise.all(
    imgs.map((img) => (img.complete && img.naturalWidth ? img.decode().catch(() => {}) : new Promise((r) => {
      img.addEventListener('load', () => img.decode().catch(() => {}).then(r), { once: true });
      img.addEventListener('error', r, { once: true });
    }))),
  );
}

const M = {}; // mobile measurements
const D = {}; // desktop elements

async function setup() {
  await Promise.all([loaded(desk), loaded(mob)]);
  // Let React hydrate/mount in both frames.
  for (let i = 0; i < 30; i += 1) await nextFrame();
  const dd = desk.contentDocument;
  const md = mob.contentDocument;
  await Promise.all([document.fonts.ready, dd.fonts.ready, md.fonts.ready]);

  // Hide every result card except the first, and replace the first slider's photos with stand-ins.
  $$('.result-card', md).forEach((card, i) => {
    if (i > 0) card.style.display = 'none';
  });
  $$('.result-card', dd).forEach((card) => {
    card.style.display = 'none';
  });
  const slider = $('.compare-slider', md);
  $('.compare-slider__image--after img', slider).src = standin(true);
  $('.compare-slider__before img', slider).src = standin(false);
  // The stand-in is not a patient case: label the card honestly.
  const meta = $('.result-card__meta', md);
  $('p', meta).textContent = 'Imagem ilustrativa';
  $('h3', meta).textContent = 'Como funciona o comparador';
  [...md.images, ...dd.images].forEach((img) => {
    img.loading = 'eager';
  });

  // Desktop hero: split the headline into its two natural lines so each can rise.
  const h1 = $('#hero-title', dd);
  h1.innerHTML = '<span class="v-l" style="display:block">Seu rosto é</span><span class="v-l" style="display:block">sua <em>identidade.</em></span>';
  Object.assign(D, {
    doc: dd,
    lines: $$('.v-l', h1),
    welcome: $('.hero__welcome', dd),
    desc: $('.hero__description', dd),
    actions: $('.hero__actions', dd),
    creds: $$('.hero__credentials span', dd),
    credsBox: $('.hero__credentials', dd),
    frame: $('.hero__frame', dd),
    img: $('.hero__media img', dd),
    header: $('.site-header', dd),
  });

  // Mobile scroll targets, measured at scroll 0.
  mob.contentWindow.scrollTo(0, 0);
  const win = mob.contentWindow;
  const sliderRect = slider.getBoundingClientRect();
  M.slider = slider;
  M.hint = $('.compare-slider__hint', slider);
  M.resY = Math.round(sliderRect.top + win.scrollY + sliderRect.height - 744);
  const procHeading = $('#procedures-title', md).getBoundingClientRect();
  M.procY = Math.round(procHeading.top + win.scrollY - 118);
  M.link = $('.procedure-item__link', md);
  M.win = win;

  // Load everything that can appear (both frames), then settle.
  for (const y of [M.resY, M.procY, 0]) {
    win.scrollTo(0, y);
    for (let i = 0; i < 4; i += 1) await nextFrame();
    await waitImages(md);
  }
  await waitImages(dd);
  for (let i = 0; i < 10; i += 1) await nextFrame();
  window.__ready = true;
}

// ---------- phone geometry ----------
const PH = { left: 1067 + 12, top: 72 + 12, s: 1.08 };
const toStage = (x, y) => [PH.left + x * PH.s, PH.top + y * PH.s];

// ---------- the timeline ----------
const T = {
  s1End: b(6),
  capAOut: b(11),
  touch: b(13),
  cut2: b(17),
  tap: b(19),
  msg: b(20),
  out: b(26),
  end: b(32),
};

let lastScroll = -1;

async function renderAt(t) {
  // ---- Scene 1: desktop hero ----
  const s1 = $('#s1');
  const s1Visible = t < T.s1End;
  s1.style.opacity = s1Visible ? '1' : '0';
  if (s1Visible) {
    const exit = tw(t, b(6) - 0.3, b(6), E.io2);
    const wrap = $('#deskWrap');
    const sc = 1.25 * lerp(1, 0.93, exit);
    wrap.style.transform = `translate(${(1920 - 1536) / 2}px, ${(1080 - 864) / 2}px) scale(${sc})`;
    wrap.style.opacity = String(1 - exit);
    wrap.style.borderRadius = `${lerp(0, 22, exit)}px`;

    D.img.style.opacity = String(tw(t, 0, 0.9, E.o2));
    D.img.style.transform = `scale(${lerp(1.09, 1, tw(t, 0, b(6), E.o2))})`;
    D.header.style.opacity = String(tw(t, 0.55, 1.2, E.o2));
    D.frame.style.borderColor = `rgba(201, 151, 63, ${0.55 * tw(t, 0.15, 1.1, E.o2)})`;
    rise(D.welcome, t, 0.05, 0.5, Infinity, Infinity, 18);
    rise(D.lines[0], t, 0.25, 0.95, Infinity, Infinity, 34);
    rise(D.lines[1], t, 0.42, 1.15, Infinity, Infinity, 34);
    rise(D.desc, t, 0.85, 1.4, Infinity, Infinity, 18);
    rise(D.actions, t, 1.05, 1.6, Infinity, Infinity, 18);
    D.creds.forEach((el, i) => rise(el, t, 1.3 + i * 0.08, 1.8 + i * 0.08, Infinity, Infinity, 12));
  }

  // ---- Scenes 2-3: phone ----
  const s23 = $('#s23');
  const s23On = t >= T.s1End - 0.3 && t < T.out + 0.01;
  s23.style.opacity = s23On ? '1' : '0';
  if (s23On) {
    const exitAll = tw(t, T.out - 0.4, T.out - 0.1, E.i2);
    // phone
    const pin = tw(t, T.s1End, T.s1End + 0.6, E.o3);
    style($('#phone'), { o: pin * (1 - exitAll), y: (1 - pin) * 90 - exitAll * 30, s: lerp(0.97, 1, pin) });
    // favo drift
    [favoR, favoL].forEach((f, k) => {
      const show = tw(t, T.s1End - 0.2, T.s1End + 0.9, E.o2) * (1 - exitAll);
      f.el.style.opacity = String(show);
      f.el.style.transform = `translateY(${lerp(18, -18, prog(t, T.s1End, T.out)) * (k ? -1 : 1)}px)`;
    });
    // captions
    const caps = [
      ['#capA', T.s1End + 0.2, T.s1End + 0.6, T.capAOut, T.capAOut + 0.2],
      ['#capB', T.capAOut + 0.25, T.capAOut + 0.65, T.cut2, T.cut2 + 0.2],
      ['#capC', T.cut2 + 0.25, T.cut2 + 0.65, T.out - 0.4, T.out - 0.15],
    ];
    caps.forEach(([sel, a, c, d, e]) => {
      const cap = $(sel);
      const on = t >= a - 0.01 && t <= e + 0.01;
      cap.style.opacity = on ? '1' : '0';
      cap.style.top = `${540 - cap.offsetHeight / 2}px`;
      if (!on) return;
      const rule = $('.v-rule', cap);
      const pr = tw(t, a, c + 0.2, E.o3);
      rule.style.transform = `scaleX(${pr})`;
      rule.style.opacity = String(1 - tw(t, d, e, E.i2));
      const parts = [...cap.querySelectorAll('.v-kicker, .v-line, .v-sub')];
      parts.forEach((el, i) => rise(el, t, a + i * 0.08, c + i * 0.08, d, e, 30));
    });

    // mobile scroll
    const y = Math.round(
      keys(t, [
        [0, 0],
        [T.capAOut, 0],
        [T.capAOut + 0.95, M.resY, E.io3],
        [T.cut2, M.resY],
        [T.cut2 + 0.95, M.procY, E.io3],
      ]),
    );
    if (y !== lastScroll) {
      M.win.scrollTo(0, y);
      lastScroll = y;
    }

    // slider
    const pos = keys(t, [
      [0, 50],
      [T.touch, 50],
      [b(14), 18, E.sio],
      [b(15.5), 84, E.sio],
      [b(16.5), 50, E.sio],
    ]);
    M.slider.style.setProperty('--pos', `${pos}%`);
    if (M.hint) M.hint.style.display = t >= T.touch ? 'none' : '';

    // fingers
    const finger = $('#finger');
    const ripple = $('#ripple');
    let fo = 0;
    let fx = 0;
    let fy = 0;
    let fs = 1;
    let ro = 0;
    let rs = 1;
    if (t >= T.touch - 0.25 && t < b(16.5) + 0.35) {
      const r = M.slider.getBoundingClientRect();
      [fx, fy] = toStage(r.left + (r.width * pos) / 100, r.top + r.height / 2);
      fo = tw(t, T.touch - 0.25, T.touch, E.o2) * (1 - tw(t, b(16.5), b(16.5) + 0.3, E.o2));
      fs = lerp(1.25, 1, tw(t, T.touch - 0.25, T.touch, E.o2)) * lerp(1, 0.86, tw(t, T.touch, T.touch + 0.12, E.o2)) * lerp(1, 1.16, tw(t, b(16.5), b(16.5) + 0.3, E.o2));
      const rp = prog(t, T.touch, T.touch + 0.5);
      ro = rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0;
      rs = lerp(0.8, 2.2, E.o2(rp));
    } else if (t >= T.tap - 0.3 && t < T.tap + 0.6) {
      const r = M.link.getBoundingClientRect();
      [fx, fy] = toStage(r.left + r.width * 0.42, r.top + r.height / 2);
      fy += lerp(30, 0, tw(t, T.tap - 0.3, T.tap, E.o2));
      fo = tw(t, T.tap - 0.3, T.tap - 0.05, E.o2) * (1 - tw(t, T.tap + 0.25, T.tap + 0.55, E.o2));
      fs = lerp(1, 0.84, tw(t, T.tap - 0.04, T.tap + 0.06, E.o2)) * lerp(1, 1.19, tw(t, T.tap + 0.14, T.tap + 0.4, E.o2));
      const rp = prog(t, T.tap, T.tap + 0.5);
      ro = rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0;
      rs = lerp(0.8, 2.4, E.o2(rp));
    }
    finger.style.opacity = String(fo);
    finger.style.transform = `translate(${fx}px, ${fy}px) scale(${fs})`;
    ripple.style.opacity = String(ro);
    ripple.style.transform = `translate(${fx}px, ${fy}px) scale(${rs})`;

    // pressed state on the real "Conversar" link
    const press = tw(t, T.tap - 0.04, T.tap + 0.06, E.o2) * (1 - tw(t, T.tap + 0.14, T.tap + 0.4, E.o2));
    M.link.style.transform = `scale(${lerp(1, 0.95, press)})`;
    M.link.style.backgroundColor = press > 0.01 ? `rgba(201, 151, 63, ${0.28 * press})` : '';

    // message card
    const msg = $('#msg');
    const mr = M.link.getBoundingClientRect();
    const [, ly] = toStage(0, mr.top + mr.height / 2);
    msg.style.top = `${Math.round(ly - 150)}px`;
    const min = tw(t, T.msg, T.msg + 0.5, E.o3);
    const mout = tw(t, T.out - 0.45, T.out - 0.15, E.i2);
    style(msg, { o: min * (1 - mout), x: (1 - min) * -60, y: -mout * 20, s: lerp(0.92, 1, min) });
    const bub = $('#bubble');
    bub.style.opacity = String(tw(t, T.msg + 0.2, T.msg + 0.6, E.o2));
  }

  // ---- Scene 4: outro ----
  const s4 = $('#s4');
  const s4On = t >= T.out - 0.25;
  s4.style.opacity = s4On ? String(tw(t, T.out - 0.25, T.out, E.io2)) : '0';
  if (s4On) {
    [favoDL, favoDR].forEach((f, k) => {
      f.levels.forEach((el, i) => {
        const p = tw(t, T.out + 0.05 + k * 0.1 + i * 0.14, T.out + 1.2 + k * 0.1 + i * 0.14, E.o2);
        el.style.opacity = String(p);
      });
      f.accents.forEach((el) => {
        el.style.opacity = String(tw(t, T.out + 0.8, T.out + 1.6, E.o2));
      });
      f.el.style.transform = `translateY(${lerp(k ? -14 : 14, 0, tw(t, T.out, T.end, E.o2))}px)`;
    });
    beeStrokes.forEach((el, i) => {
      const p = tw(t, T.out + 0.05 + i * 0.05, T.out + 0.55 + i * 0.05, E.io2);
      el.style.strokeDashoffset = String(beeLens[i] * (1 - p));
    });
    const name = $('.v-logo__name');
    const pn = tw(t, T.out + 0.3, T.out + 0.75, E.o3);
    style(name, { o: pn, x: (1 - pn) * -16 });
    rise($('#phrase'), t, T.out + 0.5, b(27.5), Infinity, Infinity, 22);
    rise($('#url'), t, b(28.6), b(28.6) + 0.45, Infinity, Infinity, 14);
  }

  // Let the iframes run scroll handlers / React commits before capture.
  await nextFrame();
  await nextFrame();
  await new Promise((r) => setTimeout(r, 25));
  await nextFrame();
}

window.renderAt = renderAt;
window.TIMES = T;
setup().catch((err) => {
  window.__error = String(err && err.stack ? err.stack : err);
});
