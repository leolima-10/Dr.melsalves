// =====================================================================
// CONFIGURAÇÃO CENTRAL DO SITE
// Tudo que depende de confirmação da cliente fica aqui. Este arquivo é
// JavaScript puro (sem JSX nem APIs do navegador) porque também é lido
// em tempo de build por build/seo.js (meta tags, JSON-LD, sitemap).
// =====================================================================

// --- Endereço público do site -----------------------------------------
// Trocar aqui quando houver domínio próprio (ex.: https://drmelsalves.com.br).
// Alimenta canonical, og:url, og:image absoluto, JSON-LD e sitemap.xml.
export const SITE_URL = 'https://drmelsalves.vercel.app';

// --- Forma de apresentação (PENDENTE DE CONFIRMAÇÃO COM A CLIENTE) ------
// Troque só aqui: header, rodapé, hero, textos, FAQ, mensagens de WhatsApp,
// aria-labels, título e JSON-LD seguem estes valores.
export const PROFESSIONAL = {
  honorific: 'Dra.', // 'Dra.' | '' (vazio remove o tratamento em todo o site)
  firstName: 'Mel',
  lastName: 'Salves',
  legalName: 'Melissa Salves',
  profession: 'Biomédica esteta', // ex.: 'Biomédica esteta' | 'Biomédica'
  // Linhas de credencial exibidas no hero. Lista curta, só o que está confirmado.
  // ("Especialista" / "Expert" foram removidos até a cliente confirmar o uso.)
  heroCredentials: [
    'Biomédica esteta',
    'Harmonização facial e estética avançada',
    'Professora na Rede Pro Cursos',
  ],
  // Dados reais para a caixa "Sobre" e o rodapé. Vazio = não aparece.
  registration: '', // ex.: 'CRBM-1 nº 00000 / BA'
  education: '', // ex.: 'Biomedicina — Instituição, ano'
  experience: '', // ex.: 'Atua na área desde 20XX'
};

export const DISPLAY_NAME = [PROFESSIONAL.honorific, PROFESSIONAL.firstName, PROFESSIONAL.lastName]
  .filter(Boolean)
  .join(' '); // "Dra. Mel Salves"
export const SHORT_NAME = [PROFESSIONAL.honorific, PROFESSIONAL.firstName]
  .filter(Boolean)
  .join(' '); // "Dra. Mel"

export const BRAND_PHRASE = 'Sua melhor versão começa com escolhas seguras.';
export const BRAND_SIGNATURE = 'Beleza natural';

// --- Flags de exibição ------------------------------------------------
// Blocos sem dados reais ficam ocultos até a flag ser ligada.
export const SHOW_CREDENTIALS = false; // caixa Formação/Registro/Experiência + registro no rodapé
export const SHOW_TESTIMONIALS = false; // só com depoimentos reais e autorizados
export const SHOW_RHINOMODELING = false; // card de rinomodelação (cliente precisa confirmar)
// Faixa de retratos da seção "cuidado individual". Os arquivos abaixo ainda não existem em
// public/img/identidade/: ligue a flag só depois de adicioná-los (e ter autorização de uso).
export const SHOW_IDENTITY_PORTRAITS = false;
export const IDENTITY_PORTRAITS = [
  '/img/identidade/retrato-01.webp',
  '/img/identidade/retrato-02.webp',
  '/img/identidade/retrato-03.webp',
  '/img/identidade/retrato-04.webp',
];

// --- Contas e links ----------------------------------------------------
export const WHATSAPP_PHONE = '5571983591398';
export const WHATSAPP_DISPLAY = '(71) 98359-1398';
export const INSTAGRAM = {
  handle: 'dramelsalves',
  url: 'https://www.instagram.com/dramelsalves',
};
export const REDE_PRO_CURSOS = {
  url: 'https://www.instagram.com/redeprocursos/',
  // PENDENTE: confirmar com a cliente o que a Rede Pro Cursos ensina.
  description:
    `Espaço de ensino em que a ${SHORT_NAME} atua como professora. É um projeto de formação, não um canal de atendimento a pacientes.`,
};

// --- Locais de atendimento --------------------------------------------
// address, hours e mapUrl são opcionais: vazios = ocultos.
export const SERVICE_AREAS = [
  { slug: 'lauro-de-freitas', name: 'Lauro de Freitas', address: '', hours: '', mapUrl: '' },
  { slug: 'salvador', name: 'Salvador', address: '', hours: '', mapUrl: '' },
  { slug: 'praia-do-forte', name: 'Praia do Forte', address: '', hours: '', mapUrl: '' },
  { slug: 'barra-do-pojuca', name: 'Barra do Pojuca', address: '', hours: '', mapUrl: '' },
];
export const REGION = 'BA';

// --- Pilares da marca ---------------------------------------------------
export const VALUES = [
  {
    icon: 'ear',
    title: 'Escuta ativa e acolhimento',
    text: 'Cada atendimento começa ouvindo o que você sente e o que deseja, sem pressa e sem julgamento.',
  },
  {
    icon: 'plan',
    title: 'Protocolos personalizados',
    text: 'O plano é construído para o seu rosto e a sua pele, e não repetido de pessoa para pessoa.',
  },
  {
    icon: 'book',
    title: 'Atualização constante',
    text: 'Estudo contínuo das técnicas e dos materiais para escolher o que é adequado a cada caso.',
  },
];

// --- Depoimentos (só aparecem com SHOW_TESTIMONIALS e lista preenchida) ---
// Formato: { name: 'Nome autorizado', text: 'Texto autorizado', source: 'Ex.: Instagram, Google' }
export const TESTIMONIALS = [];

// --- SEO ---------------------------------------------------------------
const AREA_NAMES = SERVICE_AREAS.map((area) => area.name);
export const SEO = {
  locale: 'pt_BR',
  title: `${DISPLAY_NAME} | ${PROFESSIONAL.profession} em Lauro de Freitas e Salvador`,
  description:
    'Biomedicina estética, harmonização facial e preenchimento em Lauro de Freitas e Salvador. Atendimento também em Praia do Forte e Barra do Pojuca.',
  ogImage: '/img/og-image.jpg', // 1200x630; vira URL absoluta no build
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${DISPLAY_NAME}, ${PROFESSIONAL.profession.toLowerCase()}, em atendimento.`,
  themeColor: '#FBF6EE',
  areaNames: AREA_NAMES,
};

// --- WhatsApp ------------------------------------------------------------
const GREETING = `Olá, ${SHORT_NAME}!`;
const WHATSAPP_MESSAGES = {
  general: `${GREETING} Vim pelo seu site e gostaria de agendar uma avaliação.`,
  gallery: `${GREETING} Vi os resultados no site e gostaria de avaliar o meu caso.`,
};

/**
 * @param {string} context  origem do clique (header, hero, gallery, footer, floating...)
 * @param {{ service?: string }} [options]  nome do serviço para mensagem específica
 */
export function getWhatsAppLink(context = 'general', { service } = {}) {
  const message = service
    ? `${GREETING} Quero saber mais sobre ${service.toLowerCase()}.`
    : (WHATSAPP_MESSAGES[context] ?? WHATSAPP_MESSAGES.general);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
