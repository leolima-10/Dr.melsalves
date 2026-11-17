// Gerador do favo de mel do Paper ("Favo 04"). JS puro e determinístico (sem Math.random,
// window ou Date): o resultado é idêntico no servidor (SSG) e no cliente (hidratação).
//
// Geometria medida no SVG do Paper: hexágonos "pointy-top" de raio 29,4 com passo de 52 px na
// horizontal, 45 px na vertical e deslocamento de 26 px nas linhas ímpares (vão de ~1 px).
// O núcleo do aglomerado fica colado na borda da página e some em direção ao miolo, com
// falhas irregulares nas bordas.

const PITCH_X = 52;
const PITCH_Y = 45;
const RADIUS = 29.4;
const HALF_WIDTH = 25.5;
const HALF_RADIUS = 14.7;

export const HONEYCOMB_SIZE = { width: 560, height: 620 };

// Hash inteiro simples: mesma entrada, mesma saída, em qualquer ambiente.
function hash(row, col, salt) {
  let h = (Math.imul(row, 374761393) + Math.imul(col, 668265263) + Math.imul(salt, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const num = (value) => String(Math.round(value * 10) / 10);

// Contorno do hexágono em coordenadas relativas (curto: o HTML pré-renderizado leva ~5 KB por favo).
function hexPath(x, y) {
  return (
    `M${num(x)} ${num(y - RADIUS)}` +
    `l${HALF_WIDTH} ${HALF_RADIUS}v${RADIUS}l-${HALF_WIDTH} ${HALF_RADIUS}` +
    `-${HALF_WIDTH}-${HALF_RADIUS}v-${RADIUS}z`
  );
}

const cache = new Map();

/**
 * @param {'left'|'right'} side  borda da página onde fica o núcleo do favo
 * @param {number} seed          muda as falhas e a escolha dos hexágonos de acento
 * @param {number} accents       quantos hexágonos recebem preenchimento
 * @returns {{ width: number, height: number, levels: string[], accents: string[] }}
 *   `levels[0]` é o traço mais fraco (borda) e `levels[3]` o mais forte (núcleo).
 */
export function buildHoneycomb({ side = 'left', seed = 1, accents = 2 } = {}) {
  const key = `${side}:${seed}:${accents}`;
  if (cache.has(key)) return cache.get(key);

  const { width, height } = HONEYCOMB_SIZE;
  const coreX = side === 'left' ? 0 : width;
  const levels = ['', '', '', ''];
  const candidates = [];

  const rows = Math.ceil(height / PITCH_Y) + 1;
  const cols = Math.ceil(width / PITCH_X) + 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = -1; col < cols; col += 1) {
      const x = col * PITCH_X + (row % 2 ? PITCH_X / 2 : 0);
      const y = row * PITCH_Y;
      const d = Math.hypot((x - coreX) / width, (y - height / 2) / (height / 2));
      if (d >= 1) continue;

      // Falhas só da metade externa para dentro, para o núcleo continuar contínuo.
      if (d > 0.45 && hash(row, col, seed) < (d - 0.45) * 1.7) continue;

      const level = d < 0.3 ? 3 : d < 0.55 ? 2 : d < 0.8 ? 1 : 0;
      const path = hexPath(x, y);
      levels[level] += path;
      if (d > 0.2 && d < 0.75) candidates.push({ path, order: hash(row, col, seed + 97) });
    }
  }

  const accentPaths = candidates
    .sort((a, b) => a.order - b.order)
    .slice(0, accents)
    .map((item) => item.path);

  const result = { width, height, levels, accents: accentPaths };
  cache.set(key, result);
  return result;
}
