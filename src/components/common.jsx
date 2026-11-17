import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DISPLAY_NAME, PROFESSIONAL, getWhatsAppLink } from '../config/site.js';
import { trackWhatsAppClick } from '../lib/analytics.js';

// Logo "abelha traço fino" (Paper, logo-dramel, artboard 01): abelha em traço cor de mel
// ao lado de "Mel *Salves*". As asas passam por trás do corpo (a máscara recorta o corpo),
// então o desenho funciona sobre qualquer fundo. O nome completo fica em texto para
// leitores de tela; o desenho é decorativo.
export function BrandLogo({ className = '' }) {
  const maskId = `bee-wings-${useId().replace(/:/g, '')}`;
  return (
    <span className={`brand-logo ${className}`.trim()}>
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

export function SectionReveal({ className, children, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  // `initial` é sempre o mesmo para o HTML pré-renderizado coincidir com o do cliente
  // (evita erro de hidratação). Com reduced-motion, a revelação é instantânea (duração 0).
  // Sem JavaScript, o <noscript> do index.html mantém as seções visíveis.
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
