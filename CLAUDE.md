# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site (pt-BR) for Dra. Mel Salves: React 19 + Vite 6 + Tailwind CSS 4, deployed statically to Vercel (preset Vite, output `dist`). No backend, no env vars. See `README.md` (publishing, image prep, pending items) and `PRODUCT.md` (brand/product constraints).

## Commands

- `npm install`
- `npm run dev` — Vite dev server
- `npm run build` — production bundle to `dist/`; the only validation available
- `npm run preview` — serve the built site

No test or lint scripts exist.

## Architecture

Content-driven, deliberately centralized rather than a deep component tree:

- `src/App.jsx` — whole page: nav, hero, sections, FAQ, footer, and most copy. Animation uses `motion` (`motion/react`), GSAP (`useGSAP`), and Lenis for smooth scroll; all must respect `useReducedMotion`.
- `src/config.js` — WhatsApp phone/message templates, `CONTACT_INFO` (intentionally empty until confirmed), `SHOW_TESTIMONIALS` flag (off until real, authorized testimonials exist).
- `src/data/cases.js` — before/after case metadata; ids, paths and alt text must match files in `public/img/resultados/`.
- `src/components/BeforeAfterSlider.jsx` — draggable/keyboard-accessible comparison slider; renders a placeholder when images are missing (preserve this).
- `src/components/Intro.jsx` (+ `intro/` directory) — intro/splash work, currently uncommitted.
- `src/styles.css` — Tailwind `@theme` tokens (cream, champagne, honey, espresso, rose-nude; Cormorant Garamond display / DM Sans body) plus custom CSS.
- `index.html` — SEO, social preview, favicon. `public/` holds static assets referenced root-relative (`/img/...`); `imagens/` holds raw source images, not served.

## Conventions

- Build WhatsApp links only with `getWhatsAppLink(context)` from `src/config.js`.
- Keep copy in `App.jsx`/`config.js`, in Brazilian Portuguese: elegant, welcoming, concise.
- Do not invent facts (city, address, hours, registration, education, experience, testimonials) or promise guaranteed results. Only Harmonização Facial, Preenchimento Labial and Estética Avançada are confirmed services (rinomodelação is intentionally excluded).
- Patient images require confirmed authorization before publishing.
- Keep accessibility: semantic HTML, visible focus, adequate touch targets, reduced-motion support; mobile (Instagram in-app browser) is the primary context.
