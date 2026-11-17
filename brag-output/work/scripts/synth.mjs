// Music + sound effects as one piece: 96 BPM, F major, every event on the beat grid from t=0.
// Writes work/audio/dry.wav, send.wav (reverb send) and ir.wav (synthetic room impulse).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'audio');
fs.mkdirSync(OUT, { recursive: true });

const SR = 48000;
const DUR = 20;
const N = SR * DUR;
const BEAT = 60 / 96;
const b = (n) => n * BEAT;

const dry = [new Float32Array(N), new Float32Array(N)];
const send = [new Float32Array(N), new Float32Array(N)];

// deterministic noise
let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 * 2 - 1;
};
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, Bb: 10, B: 11 };
const n = (name, oct) => mtof(12 * (oct + 1) + NOTE[name]);

function add(buf, start, samples, gain, pan = 0, sendAmt = 0) {
  const s0 = Math.round(start * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4);
  const gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < samples.length; i += 1) {
    const k = s0 + i;
    if (k < 0 || k >= N) continue;
    dry[0][k] += samples[i] * gl;
    dry[1][k] += samples[i] * gr;
    if (sendAmt) {
      send[0][k] += samples[i] * gl * sendAmt;
      send[1][k] += samples[i] * gr * sendAmt;
    }
  }
}

// ---------- instruments ----------
function ep(freq, len, vel = 1) {
  // soft electric piano: sine + harmonics, tine attack, exponential decay
  const L = Math.round((len + 1.6) * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const att = Math.min(1, t / 0.006);
    const rel = t > len ? Math.exp(-(t - len) / 0.25) : 1;
    const env = att * Math.exp(-t / 1.9) * rel;
    const tine = Math.exp(-t / 0.05) * 0.25 * Math.sin(2 * Math.PI * freq * 4.0 * t);
    const v = Math.sin(2 * Math.PI * freq * t + 0.6 * Math.exp(-t / 0.4) * Math.sin(2 * Math.PI * freq * t))
      + 0.18 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t / 0.6);
    out[i] = (v + tine) * env * vel * (1 + 0.04 * Math.sin(2 * Math.PI * 4.5 * t));
  }
  return out;
}
function pad(freq, len) {
  const L = Math.round((len + 1.2) * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const env = Math.min(1, t / 0.6) * (t > len ? Math.exp(-(t - len) / 0.5) : 1);
    let v = 0;
    for (const d of [-0.12, 0, 0.11]) v += Math.sin(2 * Math.PI * freq * (1 + d / 100) * t);
    out[i] = (v / 3) * env;
  }
  return out;
}
function bass(freq, len) {
  const L = Math.round((len + 0.2) * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const env = Math.min(1, t / 0.008) * Math.exp(-t / 1.2) * (t > len ? Math.exp(-(t - len) / 0.05) : 1);
    out[i] = (Math.sin(2 * Math.PI * freq * t) + 0.35 * Math.sin(2 * Math.PI * freq * 2 * t)) * env;
  }
  return out;
}
function pluck(freq) {
  const L = Math.round(1.4 * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.35);
    const mod = 1.2 * Math.exp(-t / 0.08) * Math.sin(2 * Math.PI * freq * 3.5 * t);
    out[i] = Math.sin(2 * Math.PI * freq * t + mod) * env;
  }
  return out;
}
function bell(freq, decay = 1.3) {
  const L = Math.round((decay * 3) * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / decay);
    const mod = 2.0 * Math.exp(-t / 0.3) * Math.sin(2 * Math.PI * freq * 2.76 * t);
    out[i] = (Math.sin(2 * Math.PI * freq * t + mod) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t / 0.4)) * env;
  }
  return out;
}
function kick(boom = false) {
  const L = Math.round((boom ? 1.6 : 0.4) * SR);
  const out = new Float32Array(L);
  let ph = 0;
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const f = (boom ? 44 : 46) + 75 * Math.exp(-t / 0.035);
    ph += 2 * Math.PI * f / SR;
    const env = Math.min(1, t / 0.002) * Math.exp(-t / (boom ? 0.55 : 0.16));
    out[i] = Math.sin(ph) * env;
  }
  return out;
}
function hat(len = 0.035, tone = 0.6) {
  const L = Math.round(len * 3 * SR);
  const out = new Float32Array(L);
  let hp = 0;
  let prev = 0;
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    const x = rnd();
    hp = tone * (hp + x - prev); // one-pole high-pass
    prev = x;
    out[i] = hp * Math.exp(-t / len);
  }
  return out;
}
function rim() {
  const L = Math.round(0.15 * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    out[i] = (0.6 * Math.sin(2 * Math.PI * 1750 * t) * Math.exp(-t / 0.018) + 0.4 * rnd() * Math.exp(-t / 0.01));
  }
  return out;
}
function tick(freq) {
  const L = Math.round(0.12 * SR);
  const out = new Float32Array(L);
  for (let i = 0; i < L; i += 1) {
    const t = i / SR;
    out[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t / 0.02) + 0.25 * rnd() * Math.exp(-t / 0.004);
  }
  return out;
}
// filtered-noise air: lowpass cutoff sweeps from f0 to f1; amplitude shape fn(p)
function air(len, f0, f1, shape) {
  const L = Math.round(len * SR);
  const out = new Float32Array(L);
  let lp1 = 0;
  let lp2 = 0;
  for (let i = 0; i < L; i += 1) {
    const p = i / L;
    const fc = f0 * (f1 / f0) ** p;
    const a = 1 - Math.exp(-2 * Math.PI * fc / SR);
    lp1 += a * (rnd() - lp1);
    lp2 += a * (lp1 - lp2);
    out[i] = lp2 * shape(p) * 2.2;
  }
  return out;
}

// ---------- arrangement ----------
const chords = [
  { root: n('F', 2), notes: [n('A', 3), n('C', 4), n('E', 4), n('F', 4)] }, // Fmaj7
  { root: n('A', 2), notes: [n('G', 3), n('C', 4), n('E', 4), n('A', 4)] }, // Am7
  { root: n('Bb', 2), notes: [n('A', 3), n('D', 4), n('F', 4), n('Bb', 4)] }, // Bbmaj7
  { root: n('C', 3), notes: [n('G', 3), n('D', 4), n('E', 4), n('A', 4)] }, // C6/9
];
const OUTRO = b(26);

for (let bar = 0; bar < 7; bar += 1) {
  const c = chords[bar % 4];
  const t0 = b(bar * 4);
  // EP: downbeat + soft re-hit on the "and" of 2 (stops at the outro)
  c.notes.forEach((f, i) => add(dry, t0 + i * 0.012, ep(f, b(1.5)), 0.07, (i - 1.5) * 0.25, 0.5));
  if (t0 + b(1.5) < OUTRO) c.notes.forEach((f, i) => add(dry, t0 + b(1.5) + i * 0.01, ep(f, b(1)), 0.028, (i - 1.5) * 0.25, 0.5));
  if (t0 + b(3) < OUTRO) c.notes.slice(1).forEach((f, i) => add(dry, t0 + b(3), ep(f, b(0.8)), 0.022, (i - 1) * 0.3, 0.5));
  // pad bed
  const padLen = Math.min(b(4), OUTRO - t0);
  if (padLen > 0) c.notes.forEach((f, i) => add(dry, t0, pad(f, padLen), 0.012, (i - 1.5) * 0.4, 0.8));
  // bass
  if (t0 < OUTRO) {
    add(dry, t0, bass(c.root, b(1.4)), 0.11, 0, 0);
    if (t0 + b(2.5) < OUTRO) add(dry, t0 + b(2.5), bass(c.root, b(0.4)), 0.07, 0, 0);
    if (t0 + b(3) < OUTRO) add(dry, t0 + b(3), bass(c.root * 1.5, b(0.8)), 0.075, 0, 0);
  }
}

// drums: kick on 1 and 3 from the top; hats and rim join at scene 2 (b6); stop at the outro
for (let beat = 0; beat < 26; beat += 1) {
  if (beat % 2 === 0) add(dry, b(beat), kick(), beat === 0 ? 0.5 : 0.38, 0, 0);
  if (beat >= 6) {
    add(dry, b(beat + 0.5), hat(0.03), 0.1, 0.25, 0.1);
    if (beat % 4 === 1 || beat % 4 === 3) add(dry, b(beat), rim(), 0.05, -0.15, 0.3);
    if (beat % 2 === 1) add(dry, b(beat + 0.75), hat(0.015), 0.045, -0.3, 0.05);
  }
}

// pluck motif (F major pentatonic), hook and its answer
const motif = [[0, 'C', 5], [0.5, 'F', 5], [1, 'A', 5], [1.5, 'G', 5], [2.5, 'E', 5], [3, 'F', 5]];
for (const [beat, nn, oc] of motif) add(dry, b(beat), pluck(n(nn, oc)), 0.06, 0.2, 0.6);
const answer = [[16, 'A', 5], [16.5, 'C', 6], [17, 'G', 5], [18.5, 'F', 5], [19, 'E', 5]];
for (const [beat, nn, oc] of answer) add(dry, b(beat), pluck(n(nn, oc)), 0.04, -0.2, 0.6);

// ---------- outro bloom (b26): Fmaj9, boom, shimmer ----------
add(dry, OUTRO, kick(true), 0.42, 0, 0.2);
add(dry, OUTRO, bass(n('F', 1), 3.2), 0.16, 0, 0);
[n('F', 2), n('C', 3), n('A', 3), n('E', 4), n('G', 4), n('C', 5)].forEach((f, i) =>
  add(dry, OUTRO + i * 0.03, ep(f, 3.0), 0.045, (i - 2.5) * 0.2, 0.6));
[n('F', 3), n('C', 4), n('G', 4), n('A', 4)].forEach((f, i) => add(dry, OUTRO, pad(f, 3.2), 0.014, (i - 1.5) * 0.4, 0.8));
[[0, 'F', 6], [0.5, 'A', 6], [1, 'C', 7], [2, 'G', 6]].forEach(([beat, nn, oc], i) =>
  add(dry, OUTRO + b(beat), bell(n(nn, oc), 1.0), 0.018, i % 2 ? 0.35 : -0.35, 1.0));

// ---------- sound effects (same key, same grid, under the music) ----------
// swell into the cut to scene 2 (b6)
add(dry, b(6) - 0.9, air(0.9, 300, 5000, (p) => p ** 2.2 * (p < 0.97 ? 1 : (1 - p) / 0.03)), 0.05, 0, 0.6);
// scroll airs at b11 and b17
for (const at of [b(11), b(17)]) add(dry, at, air(0.9, 2500, 600, (p) => Math.sin(Math.PI * p) ** 2), 0.03, 0.3, 0.5);
// slider touch + release
add(dry, b(13), tick(n('C', 7)), 0.035, 0.35, 0.4);
add(dry, b(16.5), tick(n('F', 6)), 0.025, 0.35, 0.4);
// tap on "Conversar"
add(dry, b(19), tick(n('A', 6)), 0.04, 0.35, 0.4);
// message chime: C6 -> F6
add(dry, b(20), bell(n('C', 6), 0.8), 0.04, 0.4, 0.8);
add(dry, b(20.5), bell(n('F', 6), 1.0), 0.04, 0.4, 0.8);
// dip into the outro
add(dry, b(26) - 0.4, air(0.4, 400, 3000, (p) => p ** 2), 0.03, 0, 0.6);

// ---------- write ----------
function wav(file, chans) {
  const len = chans[0].length;
  const buf = Buffer.alloc(44 + len * chans.length * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + len * chans.length * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(3, 20); // float
  buf.writeUInt16LE(chans.length, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * chans.length * 4, 28);
  buf.writeUInt16LE(chans.length * 4, 32);
  buf.writeUInt16LE(32, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(len * chans.length * 4, 40);
  let o = 44;
  for (let i = 0; i < len; i += 1) for (const c of chans) {
    buf.writeFloatLE(c[i], o);
    o += 4;
  }
  fs.writeFileSync(path.join(OUT, file), buf);
}

// impulse response: 2.4 s stereo decaying noise, darker over time
const IRL = Math.round(2.4 * SR);
const ir = [new Float32Array(IRL), new Float32Array(IRL)];
for (const ch of ir) {
  let lp = 0;
  for (let i = 0; i < IRL; i += 1) {
    const t = i / SR;
    const a = 0.5 * Math.exp(-t / 0.5) + 0.04;
    lp += a * (rnd() - lp);
    ch[i] = lp * Math.exp(-t / 0.55) * (t < 0.012 ? 0 : 1);
  }
}

let peak = 0;
for (const c of dry) for (const v of c) peak = Math.max(peak, Math.abs(v));
console.log('dry peak', peak.toFixed(3));
wav('dry.wav', dry);
wav('send.wav', send);
wav('ir.wav', ir);
