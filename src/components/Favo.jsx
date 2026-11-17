import { useRef } from 'react';
import { DESKTOP_MOTION, gsap, MOTION_OK, useIsoLayoutEffect } from '../lib/gsap.js';
import { buildHoneycomb } from '../lib/honeycomb.js';

// Opacidades do traço medidas no Paper (Favo 04): seções claras e faixa escura.
const STROKE_OPACITY = {
  light: [0.1, 0.18, 0.28, 0.4],
  dark: [0.12, 0.22, 0.34, 0.5],
};

// Hexágonos de acento: rose-nude nas seções claras, mel na faixa escura.
const ACCENT = {
  light: { fill: '#e8c9bd', opacity: 0.55 },
  dark: { fill: '#c9973f', opacity: 0.35 },
};

/**
 * Aglomerado de favo de mel decorativo, preso à borda de uma seção (a seção precisa ter
 * a classe `favo-host`). Decorativo: aria-hidden, sem foco e sem eventos de ponteiro.
 *
 * - `side`: borda do núcleo ("left" | "right")
 * - `anchor`: posição vertical ("top" | "mid" | "bottom")
 * - `variant`: "light" (fundo claro) | "dark" (faixa espresso)
 * - `seed`: muda as falhas do favo e quais hexágonos são de acento
 *
 * Animação (GSAP + ScrollTrigger, só opacity/transform): os quatro níveis de traço aparecem
 * em cascata do núcleo para fora quando o favo entra na tela; os acentos "respiram"; no
 * desktop o favo anda um pouco com o scroll (parallax). Com reduced motion nada se move.
 * O HTML do servidor já traz o favo visível: o GSAP só assume depois da hidratação.
 */
export default function Favo({ side = 'left', anchor = 'top', variant = 'light', seed = 1, accents = 2 }) {
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const wrap = ref.current;
    if (!wrap) return undefined;
    const svg = wrap.querySelector('.favo__svg');
    const levels = [...wrap.querySelectorAll('[data-favo-level]')].reverse(); // núcleo primeiro
    const accentHexes = wrap.querySelectorAll('.favo__accent');

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // Os hexágonos de cada nível se "desenham" (DrawSVG) enquanto o nível aparece.
      gsap.from(levels, {
        opacity: 0,
        drawSVG: '0%',
        duration: 1.6,
        ease: 'power2.out',
        stagger: 0.14,
        scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
      });

      gsap.fromTo(
        accentHexes,
        { opacity: 0.55 },
        {
          opacity: 1,
          duration: 3.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 1.3 },
        },
      );
    });

    // Parallax só no desktop: no mobile (navegador do Instagram) o favo fica parado.
    mm.add(DESKTOP_MOTION, () => {
      gsap.fromTo(
        svg,
        { y: -24 },
        {
          y: 24,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  const { width, height, levels, accents: accentPaths } = buildHoneycomb({ side, seed, accents });
  const strokes = STROKE_OPACITY[variant];
  const accent = ACCENT[variant];

  return (
    <div
      ref={ref}
      className={`favo favo--${side} favo--${anchor} favo--${variant}`}
      aria-hidden="true"
    >
      <svg className="favo__svg" viewBox={`0 0 ${width} ${height}`} focusable="false">
        {levels.map((d, level) => (
          <path
            key={level}
            data-favo-level={level}
            d={d}
            fill="none"
            stroke="#c9973f"
            strokeWidth="1"
            strokeOpacity={strokes[level]}
          />
        ))}
        {accentPaths.map((d) => (
          <path
            key={d}
            className="favo__accent"
            d={d}
            fill={accent.fill}
            fillOpacity={accent.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
