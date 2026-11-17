// Plugin Vite sem dependências. A partir de src/config/site.js gera:
//  - <head>: title, description, canonical, Open Graph, Twitter, manifest, JSON-LD
//  - sitemap.xml, robots.txt e site.webmanifest (emitidos no build)
import * as config from '../src/config/site.js';
import { services } from '../src/data/services.js';
import { routes } from '../src/routes.js';

const { SEO, SITE_URL, DISPLAY_NAME, PROFESSIONAL, INSTAGRAM, SERVICE_AREAS, WHATSAPP_PHONE } = config;

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export const absoluteUrl = (path = '/') => new URL(path, `${SITE_URL}/`).toString();

export function buildJsonLd() {
  const visibleServices = services.filter(
    (service) => !service.requiresFlag || config[service.requiresFlag],
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${absoluteUrl('/')}#negocio`,
    name: DISPLAY_NAME,
    description: SEO.description,
    url: absoluteUrl('/'),
    telephone: `+${WHATSAPP_PHONE}`,
    image: absoluteUrl(SEO.ogImage),
    sameAs: [INSTAGRAM.url],
    // Só o estado é conhecido: endereços completos entram quando a cliente informar.
    address: { '@type': 'PostalAddress', addressRegion: config.REGION, addressCountry: 'BR' },
    areaServed: SERVICE_AREAS.map((area) => ({
      '@type': area.schemaType ?? 'City',
      name: area.name,
    })),
    employee: {
      '@type': 'Person',
      name: PROFESSIONAL.legalName,
      alternateName: DISPLAY_NAME,
      jobTitle: PROFESSIONAL.profession,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Procedimentos',
      itemListElement: visibleServices.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name },
      })),
    },
  };
}

export function buildHeadTags() {
  const image = absoluteUrl(SEO.ogImage);
  const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c');
  const tags = [
    `<title>${escapeAttr(SEO.title)}</title>`,
    `<meta name="description" content="${escapeAttr(SEO.description)}" />`,
    `<link rel="canonical" href="${absoluteUrl('/')}" />`,
    `<meta name="theme-color" content="${SEO.themeColor}" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${SEO.locale}" />`,
    `<meta property="og:site_name" content="${escapeAttr(DISPLAY_NAME)}" />`,
    `<meta property="og:url" content="${absoluteUrl('/')}" />`,
    `<meta property="og:title" content="${escapeAttr(SEO.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(SEO.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${SEO.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${SEO.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(SEO.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(SEO.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(SEO.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(SEO.ogImageAlt)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ];
  return tags.map((tag) => `    ${tag}`).join('\n');
}

export function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq ?? 'monthly'}</changefreq>\n    <priority>${route.priority ?? 0.5}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`;
}

export function buildManifest() {
  return JSON.stringify(
    {
      name: DISPLAY_NAME,
      short_name: config.SHORT_NAME,
      description: SEO.description,
      lang: 'pt-BR',
      start_url: '/',
      display: 'standalone',
      background_color: SEO.themeColor,
      theme_color: SEO.themeColor,
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  );
}

export function seoPlugin() {
  return {
    name: 'site-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!--seo-head-->', buildHeadTags().trimStart());
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots() });
      this.emitFile({ type: 'asset', fileName: 'site.webmanifest', source: buildManifest() });
    },
  };
}
