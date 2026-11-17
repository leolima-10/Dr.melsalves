import { motion, useReducedMotion } from 'motion/react';
import { getWhatsAppLink } from '../config/site.js';

export function HoneycombMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Monograma MS em um hexágono">
      <path d="M24 2.8 43 13.4v21.2L24 45.2 5 34.6V13.4z" />
      <text
        x="24"
        y="27"
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="13"
        fontWeight="600"
      >
        MS
      </text>
    </svg>
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
      data-whatsapp-context={context}
      data-whatsapp-service={service}
    >
      {children}
    </a>
  );
}

export function SectionReveal({ className, children, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
