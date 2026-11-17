// Analytics opcional. GA4 e Meta Pixel só carregam se o ID estiver definido (variáveis de
// ambiente VITE_*, ver .env.example). Sem IDs: nenhum script de terceiros é carregado.
// Não depende de pacotes: usa os snippets oficiais.

const GA4_ID = import.meta.env.VITE_GA4_ID?.trim();
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

let started = false;

function loadScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function startGa4(id) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function startMetaPixel(id) {
  if (window.fbq) return;
  const fbq = function fbq() {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); // eslint-disable-line prefer-rest-params
    else fbq.queue.push(arguments); // eslint-disable-line prefer-rest-params
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  loadScript('https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}

export function initAnalytics() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const start = () => {
    if (GA4_ID) startGa4(GA4_ID);
    if (META_PIXEL_ID) startMetaPixel(META_PIXEL_ID);
  };
  // Fora do caminho crítico: espera o navegador ficar ocioso.
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 4000 });
  else window.setTimeout(start, 2000);
}

/**
 * Dispara "whatsapp_click" em todos os botões de WhatsApp.
 * @param {{ context: string, service?: string }} params origem (seção) e serviço, se houver
 */
export function trackWhatsAppClick({ context, service } = {}) {
  if (typeof window === 'undefined') return;
  const params = { origem: context ?? 'general' };
  if (service) params.servico = service;
  try {
    if (GA4_ID && typeof window.gtag === 'function') {
      window.gtag('event', 'whatsapp_click', params);
    }
    if (META_PIXEL_ID && typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'whatsapp_click', params);
    }
  } catch {
    // Medição nunca pode quebrar o clique.
  }
}
