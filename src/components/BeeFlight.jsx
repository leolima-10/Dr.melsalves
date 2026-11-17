import { useId, useRef } from 'react';
import { DESKTOP_MOTION, gsap, useIsoLayoutEffect } from '../lib/gsap.js';

// Abelha decorativa (mesmo desenho do logo) que acompanha o scroll no desktop, voando em curva
// de uma borda da tela à outra ("Voo da abelha", Paper artboard 03) e sumindo ao fim da página.
// Fica invisível (opacity 0 no CSS) sem JavaScript, no mobile e com reduced motion.

// Pontos do voo em % da viewport. Alternam entre as bordas para cruzar o texto só de passagem.
const FLIGHT = [
  [90, 72],
  [62, 46],
  [9, 32],
  [18, 64],
  [72, 80],
  [92, 42],
  [48, 24],
  [7, 70],
  [30, 84],
];

export default function BeeFlight() {
  const maskId = `bee-flight-wings-${useId().replace(/:/g, '')}`;
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const bee = ref.current;
    if (!bee) return undefined;
    const wings = bee.querySelector('.bee-flight__wings');
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      let flight;

      // O caminho é montado em pixels da viewport atual; refeito quando a janela muda de tamanho.
      const build = () => {
        flight?.scrollTrigger?.kill();
        flight?.kill();
        const path = FLIGHT.map(([x, y]) => ({
          x: (window.innerWidth * x) / 100,
          y: (window.innerHeight * y) / 100,
        }));
        flight = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        });
        flight
          .fromTo(bee, { opacity: 0 }, { opacity: 0.95, duration: 0.05, ease: 'none' }, 0)
          .to(
            bee,
            {
              // Sem `align`: os pontos são deslocamentos a partir do canto da viewport
              // (a abelha é position: fixed em 0,0); alignOrigin centraliza o desenho no ponto.
              motionPath: { path, curviness: 1.3, alignOrigin: [0.5, 0.5] },
              duration: 0.9,
              ease: 'none',
            },
            0.04,
          )
          .to(bee, { opacity: 0, duration: 0.05, ease: 'none' }, 0.95);
      };
      build();

      // Bater de asas: as duas asas "abrem e fecham" rápido, sem relação com o scroll.
      const flutter = gsap.to(wings, {
        scaleY: 0.7,
        svgOrigin: '60 46',
        duration: 0.09,
        yoyo: true,
        repeat: -1,
        ease: 'none',
      });

      let resizeTimer;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(build, 200);
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        window.clearTimeout(resizeTimer);
        flutter.kill();
        flight?.scrollTrigger?.kill();
        flight?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="bee-flight" aria-hidden="true">
      <svg
        viewBox="22 18 76 88"
        fill="none"
        stroke="var(--color-honey)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" stroke="none" />
          <ellipse cx="60" cy="72" rx="14" ry="22" fill="#000" stroke="none" />
          <circle cx="60" cy="42" r="7" fill="#000" stroke="none" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <g className="bee-flight__wings">
            <ellipse cx="42" cy="46" rx="18" ry="10" transform="rotate(-32 42 46)" />
            <ellipse cx="78" cy="46" rx="18" ry="10" transform="rotate(32 78 46)" />
          </g>
        </g>
        <ellipse cx="60" cy="72" rx="14" ry="22" />
        <path d="M47 66 H73 M47 78 H73" />
        <circle cx="60" cy="42" r="7" />
        <path d="M56 36 Q52 27 46 25 M64 36 Q68 27 74 25" />
      </svg>
    </div>
  );
}
