export const WHATSAPP_PHONE = '5571983591398';
export const SHOW_TESTIMONIALS = false;

export const CONTACT_INFO = {
  address: '',
  hours: '',
  mapUrl: '',
  professionalRegistration: '',
};

const WHATSAPP_MESSAGES = {
  general: 'Olá, Dra. Mel! Vim pelo seu site e gostaria de agendar uma avaliação.',
  lip: 'Olá, Dra. Mel! Vim pelo seu site e gostaria de conversar sobre preenchimento labial.',
  harmonization:
    'Olá, Dra. Mel! Vim pelo seu site e gostaria de conversar sobre harmonização facial.',
  gallery: 'Vi os resultados no site e gostaria de avaliar o meu caso.',
  footer: 'Olá, Dra. Mel! Vim pelo seu site e gostaria de agendar uma avaliação.',
  floating: 'Olá, Dra. Mel! Vim pelo seu site e gostaria de agendar uma avaliação.',
};

export function getWhatsAppLink(context = 'general') {
  const message = WHATSAPP_MESSAGES[context] ?? WHATSAPP_MESSAGES.general;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
