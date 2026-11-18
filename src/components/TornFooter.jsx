import { useId, useMemo, useRef } from 'react';
import { useIsoLayoutEffect } from '../lib/gsap.js';
import { BrandLogo, FooterInstagramButton, FooterWhatsAppButton, WhatsAppLink } from './common.jsx';
import {
  BRAND_PHRASE,
  BRAND_SIGNATURE,
  DISPLAY_NAME,
  INSTAGRAM,
  PROFESSIONAL,
  REDE_PRO_CURSOS,
  SERVICE_AREAS,
  SHOW_CREDENTIALS,
} from '../config/site.js';

// Rodapé "cartaz rasgado" (adaptado do Pushpin Tear Footer, 21st.dev). Uma folha cor de mel leva
// os links e o convite para a avaliação; a parte de baixo foi arrancada de um alfinete âmbar e,
// no papel por baixo, fica impresso o nome. Ao entrar na tela, o conteúdo se monta, o alfinete
// cai e a folha rasga do alfinete para as bordas; clicar no alfinete rasga uma nova borda.
//
// SSG: o HTML pré-renderizado já traz tudo visível e um rasgo estático (viewBox normalizado).
// Depois da hidratação, um layout effect mede o rodapé, redesenha em pixels e só então liga os
// estados escondidos da animação (classe `is-armed`). Todo o estado da animação é imperativo
// (classList/atributos), então o React nunca re-renderiza o rodapé. Reduced motion: sem animação.

// #region rasgo
const RIDGE_N = 84;
const FLAPS = 6;

const clamp01 = (v) => (Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0);

// mulberry32: o mesmo rasgo para a mesma semente, no servidor e no cliente.
function rng(seed) {
  let a = (Number.isFinite(seed) ? Math.floor(seed) : 0) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Posições x da crista, iguais para todas as sementes (um rasgo pode se transformar no outro).
const XS = (() => {
  const r = rng(911);
  const out = [];
  for (let i = 0; i < RIDGE_N; i++) {
    const u = i / (RIDGE_N - 1);
    const j = i > 0 && i < RIDGE_N - 1 ? (r() - 0.5) * (0.8 / RIDGE_N) : 0;
    out.push(-0.02 + u * 1.04 + j);
  }
  return out;
})();

function ridgeFloor(x) {
  const d = Math.abs(x - 0.5);
  if (d < 0.13) return 0.39;
  if (d < 0.25) return 0.43;
  return 0.5;
}

// Crista em unidades 0.39..0.8 (mais alta sob o alfinete, descendo para as bordas), espessura da
// fibra branca, atraso do rasgo por ponto e seis abas de papel.
function makeTear(seed) {
  const r = rng(seed);
  const ph = [r() * 6.283, r() * 6.283, r() * 6.283];
  const ys = [];
  const rim = [];
  const lag = [];
  for (let i = 0; i < RIDGE_N; i++) {
    const x = XS[i];
    const d = Math.min(1, Math.abs(x - 0.5) * 2);
    const base = 0.43 + 0.3 * Math.pow(d, 1.35);
    const wander =
      (0.022 * Math.sin(x * 7 + ph[0]) + 0.016 * Math.sin(x * 13 + ph[1]) + 0.01 * Math.sin(x * 29 + ph[2])) *
      (0.45 + 0.55 * d);
    const spike = r() < 0.16 ? 2.3 : 1;
    const jag = (r() - 0.5) * 0.022 * spike;
    ys.push(Math.min(0.8, Math.max(ridgeFloor(x), base + wander + jag)));
    rim.push(1.2 + r() * 3.6);
    lag.push(Math.min(0.48, d * 0.4 + 0.04 + 0.03 * Math.sin(x * 23 + ph[1]) + r() * 0.012));
  }
  const slots = [0.05, 0.19, 0.33, 0.67, 0.81, 0.95];
  const up = r() < 0.5 ? [2, 4] : [1, 3];
  const flaps = slots.map((slot, k) => {
    const x = slot + (r() - 0.5) * 0.05;
    const span = 3 + Math.floor(r() * 5);
    const at = Math.max(0, Math.min(RIDGE_N - 1 - span, Math.round(x * (RIDGE_N - 1))));
    const dir = up.includes(k) ? -1 : 1;
    const outer = k === 0 || k === slots.length - 1;
    const len = dir < 0 ? 0.022 + r() * 0.022 : outer ? 0.085 + r() * 0.04 : 0.045 + r() * 0.05;
    return { at, span, len, skew: (r() - 0.5) * 1.1, dir, jag: [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5] };
  });
  return { ys, rim, lag, flaps };
}

// Saída com leve passada do ponto: o papel rasga um tico além e assenta.
function easeTear(t) {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  const c1 = 0.9;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOut(t) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// A crista em unidades vira pixels dentro da faixa do rasgo (entre a folha e o papel).
function ridgePx(y, top, h) {
  return top + (0.2 + ((y - 0.39) / 0.41) * 0.68) * h;
}

// Aba: o trecho da crista de onde ela pende e duas bordas recortadas até a ponta (ys em px).
function flapPoly(ys, f, W, L) {
  const b = Math.min(ys.length - 1, f.at + f.span);
  const top = [];
  for (let k = f.at; k <= b; k++) top.push([XS[k] * W, ys[k]]);
  const A = top[0];
  const B = top[top.length - 1];
  const mx = (A[0] + B[0]) / 2;
  const my = (A[1] + B[1]) / 2;
  const tip = [mx + f.skew * L, my + f.dir * L];
  const side = (P, Q, j0, j1) => {
    const dx = Q[0] - P[0];
    const dy = Q[1] - P[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    return [
      [P[0] + dx / 3 + nx * j0 * 0.22 * L, P[1] + dy / 3 + ny * j0 * 0.22 * L],
      [P[0] + (dx * 2) / 3 + nx * j1 * 0.22 * L, P[1] + (dy * 2) / 3 + ny * j1 * 0.22 * L],
    ];
  };
  return [...top, ...side(B, tip, f.jag[0], f.jag[1]), tip, ...side(tip, A, f.jag[2], f.jag[3])];
}

const n1 = (v) => Math.round(v * 10) / 10;

function polyD(pts) {
  return pts.length ? 'M' + pts.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z' : '';
}

// A folha: tudo acima da crista; `off` levanta cada ponto (a borda de fibra aparece por baixo).
function sheetD(ys, W, off) {
  let d = 'M-20 -20L' + (W + 20) + ' -20';
  for (let i = ys.length - 1; i >= 0; i--) d += 'L' + n1(XS[i] * W) + ' ' + n1(ys[i] - (off ? off[i] : 0));
  return d + 'Z';
}

function mixHex(a, b, t) {
  const p = (h) => {
    const s = h.replace('#', '');
    const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s.padEnd(6, '0').slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
  };
  const x = p(a);
  const y = p(b);
  const k = clamp01(t);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('');
}
// #endregion

// Cores da marca (hex: o alfinete e as abas são sombreados a partir delas).
const PAPER = '#f4eadb'; // areia
const PIN = '#9a6420'; // âmbar, uma gota de mel
const SHADE = '#3b2a1c'; // sombras em espresso, nunca em preto/azul
const FLAP_BASE = mixHex(PAPER, '#ffffff', 0.35);
const FLAP_DARK = mixHex(FLAP_BASE, SHADE, 0.34);
const FLAP_MID = mixHex(FLAP_BASE, SHADE, 0.08);

// Rasgo estático do HTML pré-renderizado (sem JS): coordenadas 0..1000 esticadas no rodapé.
function staticSheet(seed) {
  const tear = makeTear(seed);
  const ys = tear.ys.map((y) => ridgePx(y, 470, 230));
  return { sheet: sheetD(ys, 1000, tear.rim), rim: sheetD(ys, 1000) };
}

function Squiggle() {
  return (
    <svg viewBox="0 0 24 24" className="tf-ico tf-ico--squiggle" aria-hidden="true" focusable="false">
      <path d="M3.5 15c1.8-3.2 3.6-3.2 5.4 0s3.6 3.2 5.4 0 3.6-3.2 5.4 0" />
    </svg>
  );
}

function Arrow({ up = false }) {
  return (
    <svg viewBox="0 0 24 24" className={`tf-ico${up ? ' tf-ico--up' : ''}`} aria-hidden="true" focusable="false">
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="tf-ico" aria-hidden="true" focusable="false">
      <path d="M12 6.5c-1.8-1.3-4.2-2-7.5-2v13c3.3 0 5.7.7 7.5 2 1.8-1.3 4.2-2 7.5-2v-13c-3.3 0-5.7.7-7.5 2Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="tf-ico" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.6a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.1-2.4 3.6" />
      <circle cx="12" cy="17.1" r=".6" fill="currentColor" />
    </svg>
  );
}

function Hex() {
  return (
    <svg viewBox="0 0 24 24" className="tf-hex" aria-hidden="true" focusable="false">
      <path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4Z" />
    </svg>
  );
}

// Alfinete: cabeça abaulada com brilho, pescoço, aba e agulha de aço. Sombreado a partir de `base`.
function Pin({ base, id }) {
  const hi = mixHex(base, '#ffffff', 0.62);
  const lo = mixHex(base, '#000000', 0.42);
  const deep = mixHex(base, '#000000', 0.66);
  return (
    <svg viewBox="0 0 100 200" className="tf-pin__svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id + 's'} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={lo} />
          <stop offset=".24" stopColor={base} />
          <stop offset=".4" stopColor={hi} />
          <stop offset=".58" stopColor={base} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <radialGradient id={id + 't'} cx=".38" cy=".3" r=".8">
          <stop offset="0" stopColor={hi} />
          <stop offset=".55" stopColor={base} />
          <stop offset="1" stopColor={lo} />
        </radialGradient>
        <linearGradient id={id + 'n'} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5f5a55" />
          <stop offset=".4" stopColor="#f6f3ef" />
          <stop offset=".7" stopColor="#aaa49d" />
          <stop offset="1" stopColor="#4e4842" />
        </linearGradient>
        <filter id={id + 'b'} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <path d="M48.3 112h3.4l-.7 76-1 4-1-4z" fill={`url(#${id}n)`} />
      <ellipse cx="50" cy="191.5" rx="3.2" ry="1.1" fill={SHADE} opacity=".35" />
      <path d="M28 103v6.5a22 7 0 0 0 44 0V103z" fill={`url(#${id}s)`} />
      <ellipse cx="50" cy="103" rx="22" ry="7" fill={`url(#${id}t)`} />
      <path
        d="M41.5 38c1.6 16 4.6 26 3 36-1.8 10-13 19-14.6 29h40.2c-1.6-10-12.8-19-14.6-29-1.6-10 1.4-20 3-36z"
        fill={`url(#${id}s)`}
      />
      <path d="M16 22v14a34 13 0 0 0 68 0V22z" fill={`url(#${id}s)`} />
      <ellipse cx="50" cy="22" rx="34" ry="13" fill={`url(#${id}t)`} />
      <ellipse cx="50" cy="22" rx="33" ry="12.3" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth=".8" />
      <ellipse cx="37" cy="17.5" rx="12" ry="4" fill="#fff" opacity=".7" filter={`url(#${id}b)`} />
      <path
        d="M22 38c4 4.5 9.5 6.4 15 7"
        stroke="#fff"
        strokeOpacity=".35"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        filter={`url(#${id}b)`}
      />
      <path d="M45 50c.8 8 1.6 14 .8 22" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const H = (i) => ({ '--i': i });

/**
 * @param {{ links?: { href: string, label: string }[], seed?: number }} props
 *   links: âncoras da coluna "Navegue" (mesma ordem das seções).
 */
export default function TornFooter({ links = [], seed = 7 }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const sheetRef = useRef(null);
  const rimRef = useRef(null);
  const grainRef = useRef(null);
  const bandRef = useRef(null);
  const pinRef = useRef(null);
  const clockRef = useRef(null);
  const flapRefs = useRef([]);
  const gradRefs = useRef([]);
  const api = useRef(null);
  const ssr = useMemo(() => staticSheet(seed), [seed]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const band = bandRef.current;
    const svg = svgRef.current;
    const pin = pinRef.current;
    if (!root || !band || !svg || !pin) return undefined;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = {
      W: 0,
      H: 0,
      top: 0,
      h: 0,
      seed,
      tear: makeTear(seed),
      prev: null,
      final: [],
      from: [],
      ys: [],
      mode: still ? 'rest' : 'wait',
      t0: 0,
      dur: 1,
      raf: 0,
      px: -1e4,
      py: -1e4,
      lift: new Array(FLAPS).fill(0),
      stage: still ? 3 : 0,
      ripped: still,
      busy: false,
      timers: [],
    };
    const later = (fn, ms) => s.timers.push(window.setTimeout(fn, ms));
    const setStage = (n) => {
      s.stage = n;
      root.classList.toggle('s1', n >= 1);
      root.classList.toggle('s2', n >= 2);
      root.classList.toggle('s3', n >= 3);
    };

    const measure = () => {
      s.W = root.clientWidth;
      s.H = root.clientHeight;
      s.top = band.offsetTop;
      s.h = band.offsetHeight;
      svg.setAttribute('viewBox', `0 0 ${s.W} ${s.H}`);
      s.final = s.tear.ys.map((y) => ridgePx(y, s.top, s.h));
    };

    const frame = (now) => {
      s.raf = 0;
      const { W, H: HH, tear } = s;
      if (!W || !HH) return;
      let busy = false;
      let ys;
      const open = new Array(FLAPS).fill(1);
      const openOld = new Array(FLAPS).fill(0);
      const start = HH + 40; // fora da tela: a folha inteira
      if (s.mode === 'wait') {
        ys = s.final.map(() => start);
        open.fill(0);
      } else if (s.mode === 'intro') {
        const p = Math.min(1, (now - s.t0) / s.dur);
        ys = s.final.map((y, i) => start + (y - start) * easeTear((p - tear.lag[i]) / 0.5));
        tear.flaps.forEach((f, k) => {
          open[k] = easeTear((p - tear.lag[f.at] - 0.18) / 0.32);
        });
        if (p >= 1) s.mode = 'rest';
        else busy = true;
      } else if (s.mode === 'morph') {
        const p = Math.min(1, (now - s.t0) / s.dur);
        ys = s.final.map((y, i) => {
          const a = s.from[i] ?? y;
          return a + (y - a) * easeInOut((p - tear.lag[i] * 0.6) / 0.6);
        });
        open.fill(easeTear((p - 0.5) / 0.5));
        openOld.fill(1 - easeInOut(p / 0.35));
        if (p >= 1) {
          s.mode = 'rest';
          s.prev = null;
        } else busy = true;
      } else ys = s.final;
      s.ys = ys;

      // As abas se levantam um pouco perto do ponteiro.
      tear.flaps.forEach((f, k) => {
        const b = Math.min(ys.length - 1, f.at + f.span);
        const mx = ((XS[f.at] + XS[b]) / 2) * W;
        const my = (ys[f.at] + ys[b]) / 2;
        const target = still ? 0 : clamp01(1 - Math.hypot(s.px - mx, s.py - my) / (0.2 * Math.max(W, 520)));
        s.lift[k] += (target - s.lift[k]) * 0.14;
        if (Math.abs(target - s.lift[k]) > 0.003) busy = true;
        open[k] *= 1 + 0.32 * s.lift[k];
      });

      sheetRef.current?.setAttribute('d', sheetD(ys, W, tear.rim));
      rimRef.current?.setAttribute('d', sheetD(ys, W));
      const scale = s.h * 1.4;
      const draw = (k, f, o) => {
        const el = flapRefs.current[k];
        const g = gradRefs.current[k];
        if (!el || !g) return;
        if (!f || o < 0.01) {
          el.setAttribute('d', '');
          return;
        }
        const pts = flapPoly(ys, f, W, f.len * scale * Math.max(0, o));
        el.setAttribute('d', polyD(pts));
        const b = Math.min(ys.length - 1, f.at + f.span);
        const tip = pts[b - f.at + 3];
        g.setAttribute('x1', String(((XS[f.at] + XS[b]) / 2) * W));
        g.setAttribute('y1', String((ys[f.at] + ys[b]) / 2));
        g.setAttribute('x2', String(tip[0]));
        g.setAttribute('y2', String(tip[1]));
      };
      for (let k = 0; k < FLAPS; k++) {
        draw(k, tear.flaps[k], open[k]);
        draw(FLAPS + k, s.prev?.flaps[k], openOld[k]);
      }
      if (busy) s.raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(frame);
    };

    // Primeiro desenho síncrono, antes da pintura: quem tem JS nunca vê o rasgo estático.
    measure();
    frame(performance.now());
    root.classList.add('is-live');
    if (!still) root.classList.add('is-armed');
    else setStage(3);

    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(root);
    ro.observe(band);

    // Grão do papel: um ladrilho de ruído gerado uma vez.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx && grainRef.current) {
      const img = ctx.createImageData(160, 160);
      const r = rng(42);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = r() < 0.5 ? 0 : 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.floor(r() * 46);
      }
      ctx.putImageData(img, 0, 0);
      grainRef.current.setAttribute('href', canvas.toDataURL());
    }

    // Relógio local (Bahia), com os dois-pontos piscando.
    let clockId = 0;
    const clock = clockRef.current;
    if (clock) {
      const fmt = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'America/Bahia',
      });
      const tick = () => {
        const [hh, mm] = fmt.format(new Date()).split(':');
        clock.querySelector('[data-h]').textContent = hh;
        clock.querySelector('[data-m]').textContent = mm;
      };
      tick();
      clockId = window.setInterval(tick, 10000);
    }

    // Abertura: o conteúdo da folha se monta quando o rodapé aparece; o alfinete cai e a folha
    // rasga quando a faixa do rasgo entra na tela.
    const rip = () => {
      root.classList.add('is-hit');
      setStage(3);
      s.mode = 'intro';
      s.t0 = performance.now();
      s.dur = 1550;
      kick();
      later(() => root.classList.remove('is-hit'), 340);
    };
    const observers = [];
    if (!still && 'IntersectionObserver' in window) {
      const ioTop = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && s.stage === 0) setStage(1);
        },
        { threshold: 0, rootMargin: '0px 0px -12% 0px' },
      );
      const ioBand = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || s.ripped) return;
          s.ripped = true;
          const wait = s.stage >= 1 ? 0 : 450;
          if (s.stage === 0) setStage(1);
          later(() => setStage(2), wait + 150);
          later(rip, wait + 650);
          ioBand.disconnect();
        },
        { threshold: 0.6 },
      );
      ioTop.observe(root);
      ioBand.observe(band);
      observers.push(ioTop, ioBand);
    } else if (!still) {
      setStage(3);
      s.mode = 'rest';
      s.ripped = true;
      kick();
    }

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      s.px = event.clientX - rect.left;
      s.py = event.clientY - rect.top;
      pin.style.setProperty('--tilt', `${Math.max(-9, Math.min(9, (s.px / rect.width - 0.5) * 18)).toFixed(2)}deg`);
      kick();
    };
    const onLeave = () => {
      s.px = s.py = -1e4;
      pin.style.setProperty('--tilt', '0deg');
      kick();
    };
    if (!still) {
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave);
    }

    // Clique no alfinete: ele sobe, a folha rasga uma borda nova e ele crava de novo.
    const swap = () => {
      s.seed += 1;
      s.prev = s.tear;
      s.from = s.ys.length ? s.ys : s.final;
      s.tear = makeTear(s.seed);
      s.final = s.tear.ys.map((y) => ridgePx(y, s.top, s.h));
    };
    api.current = {
      repin() {
        if (s.busy || s.stage < 3) return;
        if (still) {
          swap();
          s.prev = null;
          s.mode = 'rest';
          kick();
          return;
        }
        s.busy = true;
        pin.dataset.pin = 'lift';
        later(() => {
          swap();
          s.mode = 'morph';
          s.t0 = performance.now();
          s.dur = 1150;
          kick();
        }, 300);
        later(() => {
          pin.dataset.pin = 'stab';
        }, 1280);
        later(() => {
          pin.dataset.pin = 'idle';
          s.busy = false;
        }, 1720);
      },
    };

    return () => {
      api.current = null;
      ro.disconnect();
      observers.forEach((io) => io.disconnect());
      cancelAnimationFrame(s.raf);
      s.timers.forEach((id) => clearTimeout(id));
      window.clearInterval(clockId);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.classList.remove('is-live', 'is-armed', 'is-hit', 's1', 's2', 's3');
      pin.dataset.pin = 'idle';
    };
  }, [seed]);

  const year = new Date().getFullYear();

  return (
    <footer ref={rootRef} className="tf">
      <svg ref={svgRef} className="tf-stage" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={uid + 'v'} cx=".5" cy=".78" r=".75">
            <stop offset=".45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor={SHADE} stopOpacity=".08" />
          </radialGradient>
          <linearGradient id={uid + 'l'} x1="0" y1="0" x2=".35" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".16" />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor={SHADE} stopOpacity=".14" />
          </linearGradient>
          <pattern id={uid + 'g'} width="160" height="160" patternUnits="userSpaceOnUse">
            <image ref={grainRef} width="160" height="160" />
          </pattern>
          <filter id={uid + 'd'} x="-5%" y="-5%" width="110%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor={SHADE} floodOpacity=".32" />
          </filter>
          <filter id={uid + 'f'} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="-2" dy="4" stdDeviation="4" floodColor={SHADE} floodOpacity=".26" />
          </filter>
          {Array.from({ length: FLAPS * 2 }, (_, k) => (
            <linearGradient
              key={k}
              id={uid + 'fg' + k}
              ref={(el) => {
                gradRefs.current[k] = el;
              }}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={FLAP_DARK} />
              <stop offset=".5" stopColor={FLAP_MID} />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          ))}
          <path id={uid + 's'} ref={sheetRef} d={ssr.sheet} />
        </defs>
        <rect className="tf-paper-fill" width="100%" height="100%" />
        <rect width="100%" height="100%" fill={`url(#${uid}v)`} style={{ mixBlendMode: 'multiply' }} />
        <rect width="100%" height="100%" fill={`url(#${uid}g)`} opacity=".3" />
        <g className="tf-sheet-g" filter={`url(#${uid}d)`}>
          <path ref={rimRef} className="tf-rim" d={ssr.rim} />
          <use href={`#${uid}s`} className="tf-sheet-fill" />
        </g>
        <use href={`#${uid}s`} fill={`url(#${uid}l)`} />
        <use href={`#${uid}s`} fill={`url(#${uid}g)`} opacity=".45" />
        <g filter={`url(#${uid}f)`}>
          {Array.from({ length: FLAPS * 2 }, (_, k) => (
            <path
              key={k}
              ref={(el) => {
                flapRefs.current[k] = el;
              }}
              fill={`url(#${uid}fg${k})`}
            />
          ))}
        </g>
      </svg>

      {/* ---- na folha ---- */}
      <div className="tf-sheet-area">
        <div className="page-width">
          <div className="tf-top">
            <div className="footer-links tf-social tf-h" style={H(0)}>
              <FooterInstagramButton />
              <FooterWhatsAppButton />
            </div>
            <span className="tf-logo tf-h" style={H(1)}>
              <BrandLogo />
            </span>
            <a className="tf-up tf-h" style={H(2)} href="#inicio">
              <span className="tf-up__label">Voltar ao topo</span>
              <span className="tf-up__icon">
                <Arrow up />
              </span>
            </a>
          </div>

          <div className="tf-mid">
            <nav className="tf-col tf-col--l tf-h" style={H(4)} aria-label="Navegação do rodapé">
              <span className="tf-flank">{BRAND_SIGNATURE}</span>
              <h2 className="tf-col__title">
                Navegue
                <Squiggle />
              </h2>
              <ul>
                {links.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
              <a className="tf-big" href="#resultados">
                Resultados.
              </a>
            </nav>

            <div className="tf-center">
              <p className="tf-phrase tf-h" style={H(3)}>
                {BRAND_PHRASE}
              </p>
              <span className="tf-h" style={H(4)}>
                <WhatsAppLink
                  context="footer"
                  className="tf-pill"
                  label={`Agendar avaliação com ${DISPLAY_NAME} pelo WhatsApp`}
                >
                  <span className="tf-pill__label">Agendar avaliação</span>
                  <span className="tf-pill__knob">
                    <Arrow />
                  </span>
                </WhatsAppLink>
              </span>
              <p className="tf-status tf-h" style={H(5)}>
                <Hex />
                Todo procedimento começa por uma avaliação individual.
              </p>
            </div>

            <div className="tf-col tf-col--r tf-h" style={H(5)}>
              <span className="tf-flank" ref={clockRef} title="Horário local, Bahia">
                Bahia <span data-h>--</span>
                <i aria-hidden="true">:</i>
                <span data-m>--</span>
              </span>
              <h2 className="tf-col__title">
                Cidades
                <Squiggle />
              </h2>
              <ul>
                {SERVICE_AREAS.map((area) => (
                  <li key={area.slug}>{area.name}</li>
                ))}
              </ul>
              <a
                className="tf-big"
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram de ${DISPLAY_NAME} (@${INSTAGRAM.handle})`}
              >
                Instagram.
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---- o alfinete, na faixa do rasgo ---- */}
      <div ref={bandRef} className="tf-band">
        <button
          ref={pinRef}
          type="button"
          className="tf-pin"
          data-pin="idle"
          onClick={() => api.current?.repin()}
          aria-label="Puxar o alfinete e rasgar uma nova borda"
          title="Puxe o alfinete"
        >
          <span className="tf-pin__shadow" aria-hidden="true" />
          <span className="tf-pin__tilt">
            <span className="tf-pin__drop">
              <span className="tf-pin__body">
                <Pin base={PIN} id={uid + 'p'} />
              </span>
            </span>
          </span>
        </button>
      </div>

      {/* ---- impresso no papel ---- */}
      <div className="tf-paper-area">
        <div className="page-width">
          <div className="tf-brand-row">
            <a
              className="tf-side tf-side--l tf-p"
              style={H(1)}
              href={REDE_PRO_CURSOS.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Rede Pro Cursos</span>
              <BookIcon />
            </a>
            <div className="tf-brand">
              <span className="tf-eye tf-p" style={H(0)}>
                {PROFESSIONAL.profession}
              </span>
              <p className="tf-word">
                <span aria-hidden="true">
                  {PROFESSIONAL.firstName} <em>{PROFESSIONAL.lastName}</em>
                </span>
                <span className="sr-only">{DISPLAY_NAME}</span>
              </p>
            </div>
            <a className="tf-side tf-side--r tf-p" style={H(2)} href="#faq">
              <span>Perguntas frequentes</span>
              <QuestionIcon />
            </a>
          </div>

          <p className="tf-disclaimer tf-p" style={H(3)}>
            Os resultados variam de pessoa para pessoa. A publicação das imagens depende de autorização
            dos pacientes. Todo procedimento é realizado mediante avaliação individual.
          </p>

          <div className="tf-foot tf-p" style={H(4)}>
            <span>
              © {year} {DISPLAY_NAME}
            </span>
            {SHOW_CREDENTIALS && PROFESSIONAL.registration && (
              <span className="tf-registration">{PROFESSIONAL.registration}</span>
            )}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
              @{INSTAGRAM.handle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
