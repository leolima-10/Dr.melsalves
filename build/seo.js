// Plugin Vite sem dependências: gera <head> (title, meta, Open Graph, Twitter)
// a partir de src/config/site.js, para ter uma única fonte de verdade.
import { SEO, SITE_URL } from '../src/config/site.js';

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export const absoluteUrl = (path = '/') => new URL(path, `${SITE_URL}/`).toString();

export function buildHeadTags() {
  const image = absoluteUrl(SEO.ogImage);
  const tags = [
    `<title>${escapeAttr(SEO.title)}</title>`,
    `<meta name="description" content="${escapeAttr(SEO.description)}" />`,
    `<link rel="canonical" href="${absoluteUrl('/')}" />`,
    `<meta name="theme-color" content="${SEO.themeColor}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${SEO.locale}" />`,
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
  ];
  return tags.map((tag) => `    ${tag}`).join('\n');
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
  };
}
