# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site (pt-BR) for Dra. Mel Salves (biomédica esteta): React 19 + Vite 6 + Tailwind CSS 4, deployed statically to Vercel (preset Vite, output `dist`). No backend. See `README.md` (publishing, image prep, pending items) and `PRODUCT.md` (brand/product constraints).

## Commands

- `npm install`
- `npm run dev` — Vite dev server
- `npm run build` — production bundle to `dist/`
- `npm run preview` — serve the built site

There is no test script. `npm run build` does NOT catch undefined identifiers (they fail at runtime): open the page and check the console after edits.

## Architecture

Content-driven and centralized. Everything the client must confirm lives in ONE config file:

- `src/config/site.js` — single source of truth, plain JS (also read at build time by `build/seo.js`, so no JSX/browser APIs). Holds: `SITE_URL`, `PROFESSIONAL` (honorific, profession, hero credentials, registration/education/experience), derived `DISPLAY_NAME`/`SHORT_NAME`, feature flags (`SHOW_CREDENTIALS`, `SHOW_TESTIMONIALS`, `SHOW_RHINOMODELING`, `SHOW_IDENTITY_PORTRAITS`), contacts, `SERVICE_AREAS` (4 cities; address/hours/mapUrl optional), `VALUES`, `TESTIMONIALS`, `SEO`, and `getWhatsAppLink(context, { service })`.
- `src/data/services.js` — the services, grouped Face/Pele/Corpo; `slug` is the base for future per-service pages.
- `src/data/cases.js` — before/after cases; `visible: false` hides a case (and its filter chip). Ids, paths and alt text must match files in `public/img/resultados/`.
- `src/App.jsx` — nav, hero, about, gallery, care path, FAQ, contact, footer, floating WhatsApp. Animation uses `motion` (`motion/react`), GSAP (`useGSAP`) and Lenis; all must respect `useReducedMotion`.
- `src/components/common.jsx` — shared `WhatsAppLink` (the only place that builds WhatsApp anchors), `SectionReveal`, icons. `src/components/Sections.jsx` — procedures, values, area cards, testimonials, Instagram band, teaching band. `BeforeAfterSlider.jsx` — draggable/keyboard slider; renders a placeholder when images are missing (preserve this).
- `build/seo.js` — Vite plugin that injects title/description/canonical/Open Graph/Twitter into `index.html` (marker `<!--seo-head-->`) from `src/config/site.js`.
- `src/styles.css` — Tailwind `@theme` tokens (cream, champagne, honey, espresso, rose-nude; Cormorant Garamond display / DM Sans body) plus custom CSS.
- `public/` holds static assets referenced root-relative (`/img/...`); `imagens/` holds raw source images, not served.

## Conventions

- Build WhatsApp links only through `<WhatsAppLink context=… service=…>` / `getWhatsAppLink`.
- Never hardcode "Dra. Mel", the profession or the site URL: use `DISPLAY_NAME`, `SHORT_NAME`, `PROFESSIONAL`, `SITE_URL`.
- Copy in Brazilian Portuguese: elegant, welcoming, concise. Prefer "toxina botulínica" over "Botox®".
- Do not invent facts (address, hours, registration, education, experience, testimonials) or promise results. Unconfirmed blocks stay hidden behind flags in `src/config/site.js`; no "[PREENCHER]" text may reach production.
- Confirmed services (8): harmonização facial, preenchimento com ácido hialurônico (inclui labial), toxina botulínica, bioestimuladores de colágeno, microagulhamento, skinbooster, enzimas lipolíticas, intradermoterapia. Rinomodelação only behind `SHOW_RHINOMODELING`.
- Patient images require confirmed authorization before publishing.
- Keep accessibility: semantic HTML, visible focus, adequate touch targets, reduced-motion support; mobile (Instagram in-app browser) is the primary context.
