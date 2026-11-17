import { useId, useRef } from 'react';
import { DESKTOP_MOTION, gsap, MOTION_OK, SplitText, useIsoLayoutEffect } from '../lib/gsap.js';
import { DISPLAY_NAME, INSTAGRAM, PROFESSIONAL, getWhatsAppLink } from '../config/site.js';
import { trackWhatsAppClick } from '../lib/analytics.js';

// Logo "abelha traço fino" (Paper, logo-dramel, artboard 01): abelha em traço cor de mel
// ao lado de "Mel *Salves*". As asas passam por trás do corpo (a máscara recorta o corpo),
// então o desenho funciona sobre qualquer fundo. O nome completo fica em texto para
// leitores de tela; o desenho é decorativo.
export function BrandLogo({ className = '', animate = false }) {
  const maskId = `bee-wings-${useId().replace(/:/g, '')}`;
  const ref = useRef(null);

  // `animate`: a abelha se desenha traço a traço (DrawSVG) e o nome surge ao lado, uma vez,
  // quando a página carrega. O HTML pré-renderizado já traz o logo completo.
  useIsoLayoutEffect(() => {
    const logo = ref.current;
    if (!animate || !logo) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const strokes = logo.querySelectorAll(
        '.brand-logo__bee > g > ellipse, .brand-logo__bee > ellipse, .brand-logo__bee > circle, .brand-logo__bee > path',
      );
      const timeline = gsap.timeline({ delay: 0.15 });
      timeline
        .from(strokes, { drawSVG: '0%', duration: 1.1, ease: 'power2.inOut', stagger: 0.09 })
        .from(logo.querySelector('.brand-logo__name'), { opacity: 0, x: -8, duration: 0.7, ease: 'power3.out' }, 0.5);
    });
    return () => mm.revert();
  }, [animate]);

  return (
    <span ref={ref} className={`brand-logo ${className}`.trim()}>
      <svg
        className="brand-logo__bee"
        viewBox="22 18 76 88"
        fill="none"
        stroke="var(--color-honey)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" stroke="none" />
          <ellipse cx="60" cy="72" rx="14" ry="22" fill="#000" stroke="none" />
          <circle cx="60" cy="42" r="7" fill="#000" stroke="none" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <ellipse cx="42" cy="46" rx="18" ry="10" transform="rotate(-32 42 46)" />
          <ellipse cx="78" cy="46" rx="18" ry="10" transform="rotate(32 78 46)" />
        </g>
        <ellipse cx="60" cy="72" rx="14" ry="22" />
        <path d="M47 66 H73 M47 78 H73" />
        <circle cx="60" cy="42" r="7" />
        <path d="M56 36 Q52 27 46 25 M64 36 Q68 27 74 25" />
        <path d="M60 94 V101" />
      </svg>
      <span className="brand-logo__name" aria-hidden="true">
        {PROFESSIONAL.firstName} <em>{PROFESSIONAL.lastName}</em>
      </span>
      <span className="sr-only">{DISPLAY_NAME}</span>
    </span>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2 22l5.12-1.34A9.93 9.93 0 1 0 12.04 2Zm0 18.06c-1.47 0-2.91-.39-4.18-1.13l-.3-.18-3.04.8.81-2.96-.19-.31A8.14 8.14 0 1 1 12.04 20.06Zm4.47-6.1c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.3.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.07-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

// Botão do Instagram: ícone em camadas que se abrem no hover + cartão de perfil (tooltip).
// Só CSS (.ig-card*): o cartão aparece no hover/foco de ponteiro fino; no toque fica só o link.
// O rótulo com o @ fica sempre visível. Sem número de seguidores (dado não confirmado).
export function InstagramCard({ className = '' }) {
  return (
    <span className={`ig-card ${className}`.trim()}>
      <span className="ig-card__tooltip" aria-hidden="true">
        <span className="ig-card__profile">
          <span className="ig-card__user">
            <span className="ig-card__avatar">{PROFESSIONAL.firstName.charAt(0)}</span>
            <span className="ig-card__details">
              <span className="ig-card__name">{DISPLAY_NAME}</span>
              <span className="ig-card__handle">@{INSTAGRAM.handle}</span>
            </span>
          </span>
          <span className="ig-card__about">{PROFESSIONAL.profession}</span>
        </span>
      </span>
      <a
        className="ig-card__link"
        href={INSTAGRAM.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram de ${DISPLAY_NAME} (@${INSTAGRAM.handle})`}
      >
        <span className="ig-card__layers" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span className="ig-card__glyph">
            <InstagramIcon />
          </span>
        </span>
        <span className="ig-card__label" aria-hidden="true">
          @{INSTAGRAM.handle}
        </span>
      </a>
    </span>
  );
}

/**
 * Único ponto de criação de links de WhatsApp.
 * `context` = origem do clique (hero, header, gallery...); `service` = nome do serviço (opcional).
 */
export function WhatsAppLink({ context = 'general', service, className = '', children, label }) {
  return (
    <a
      className={className}
      href={getWhatsAppLink(context, { service })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => trackWhatsAppClick({ context, service })}
      data-whatsapp-context={context}
      data-whatsapp-service={service}
    >
      {children}
    </a>
  );
}

// Revela os blocos da seção em cascata (GSAP + ScrollTrigger). O HTML pré-renderizado e o
// do cliente são idênticos e visíveis: o estado inicial "escondido" só é aplicado pelo GSAP
// depois da hidratação, então sem JavaScript ou com reduced motion a seção aparece normal.
export function SectionReveal({ className, children, curtain = false, ...props }) {
  const ref = useRef(null);

  // `curtain`: no desktop a seção escura "abre" como uma cortina (clip-path arredondado que
  // cresce até a largura total) conforme entra na tela.
  useIsoLayoutEffect(() => {
    const section = ref.current;
    if (!curtain || !section) return undefined;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      gsap.fromTo(
        section,
        { clipPath: 'inset(0% 5% 0% 5% round 56px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 30%', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, [curtain]);

  useIsoLayoutEffect(() => {
    const section = ref.current;
    if (!section) return undefined;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // Blocos de primeiro nível do conteúdo; se houver só um (layout em grade), desce um nível.
      const content = section.querySelector(':scope > .page-width');
      let targets = content ? [...content.children] : [];
      if (targets.length > 0 && targets.length < 3) {
        targets = targets.flatMap((node) => (node.children.length > 1 ? [...node.children] : [node]));
      }
      if (targets.length === 0) targets = [section];

      gsap.from(targets, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.09,
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: section, start: 'top 82%', once: true },
      });

      // Títulos: cada linha sobe e aparece em sequência (SplitText). `aria: 'none'` mantém o
      // texto original do <h2> para leitores de tela (inclusive o que está em aria-hidden).
      // autoSplit refaz as linhas se a largura ou a fonte mudar, e o mm.revert() desfaz tudo.
      section.querySelectorAll('h2').forEach((heading) => {
        SplitText.create(heading, {
          type: 'lines',
          aria: 'none',
          autoSplit: true,
          onSplit: (split) =>
            gsap.from(split.lines, {
              yPercent: 45,
              opacity: 0,
              duration: 1,
              ease: 'power4.out',
              stagger: 0.12,
              delay: 0.12,
              scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
            }),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
}
