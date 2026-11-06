
# Copilot Instructions for this repository

## Project overview

This repository is a single-page marketing site for Dra. Mel Salves, built with Vite, React, and Tailwind CSS. It is intended for static deployment on Vercel and does not include a backend or environment-dependent runtime configuration.

The app is structured as a landing page with sections such as hero, about, procedures, results, attendance, FAQ, and contact. Most content is intentionally front-loaded into a few central files so copy and contact details are easy to update without digging through the component tree.

## Build, test, and lint commands

The repository currently exposes these scripts in `package.json`:

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server for local work
- `npm run build` — create the production bundle in `dist/`
- `npm run preview` — preview the built site locally

There is no `test` or `lint` script configured in this project right now, so there is no single-file test command to use. The reliable validation command for frontend changes is `npm run build`.

## Architecture at a glance

- `src/App.jsx` — main page composition and most of the content sections (`hero`, FAQ, procedures, contact, etc.)
- `src/config.js` — shared configuration values: WhatsApp message templates, contact fields, and feature flags such as `SHOW_TESTIMONIALS`
- `src/data/cases.js` — result-gallery metadata for the before/after comparisons and the original board image
- `src/components/BeforeAfterSlider.jsx` — interactive before/after comparison slider, including keyboard support and fallback placeholders for missing images
- `public/` — static site assets, including the image files used throughout the landing page
- `index.html` — SEO metadata, page title, social preview values, and favicon references
- `vite.config.js` — Vite config with React and Tailwind plugins
- `dist/` — generated production output from `npm run build`

This project is content-driven: most changes are likely to touch a few central files rather than a deep component system.

## Key conventions

- Keep marketing copy in `src/App.jsx` or `src/config.js` instead of scattering text across small components. This site is editorial and configuration-driven rather than data-heavy.
- Use `getWhatsAppLink(context)` from `src/config.js` for WhatsApp CTAs instead of building raw URLs ad hoc. It centralizes the phone number and the message text.
- Keep result references synchronized with `src/data/cases.js`: the `id`, file paths, titles, and `alt` content must match the actual files in `public/img/resultados/`.
- Prefer static assets under `public/` and reference them with root-relative paths such as `/img/...`.
- Do not promise guaranteed medical results in copy or new content. The project already includes comments reminding reviewers to confirm claims and keep FAQ answers aligned with the practitioner's actual scope and risk language.
- If an image is missing or fails to load, the existing comparison slider is designed to render a placeholder instead of exposing a broken image. Preserve that behavior unless the image system is intentionally being redesigned.
- The site is meant to be static and simple; avoid introducing backend dependencies or environment variables unless the feature genuinely requires them.

## Repository-specific notes

- README.md is the primary source for publication details: the app is intended for Vercel deployment using the Vite preset and the `dist` output directory.
- `SHOW_TESTIMONIALS` in `src/config.js` is intentionally off by default until real testimonials are provided and approved.
- `CONTACT_INFO` in the same file is deliberately empty until address/hours/map details are confirmed by the clinician.
- The `README.md` also notes workflow requirements around photo authorization and content review before publishing; keep those constraints in mind when editing images or copy.
