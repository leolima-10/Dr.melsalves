// Serviços confirmados (8) agrupados em Face, Pele e Corpo.
// Textos informativos: sem promessa de resultado e sempre condicionados à avaliação.
// Sem JSX nem APIs do navegador: também é lido em build (JSON-LD, futuras páginas por serviço).
//
// `slug` já serve de base para futuras páginas (/harmonizacao-facial-lauro-de-freitas).
// `requiresFlag` liga o item a uma flag de src/config/site.js (ex.: rinomodelação).

export const serviceGroups = [
  { id: 'face', title: 'Face' },
  { id: 'pele', title: 'Pele' },
  { id: 'corpo', title: 'Corpo' },
];

export const services = [
  {
    slug: 'harmonizacao-facial',
    group: 'face',
    name: 'Harmonização facial',
    description:
      'Planejamento individual que considera as proporções e a expressão do seu rosto, para quem busca equilíbrio com naturalidade.',
  },
  {
    slug: 'preenchimento-acido-hialuronico',
    group: 'face',
    name: 'Preenchimento com ácido hialurônico',
    description:
      'Uso do ácido hialurônico para dar volume e definir contornos, incluindo os lábios, de forma planejada e proporcional ao conjunto do rosto.',
  },
  {
    slug: 'toxina-botulinica',
    group: 'face',
    name: 'Toxina botulínica',
    description:
      'Aplicação em pontos específicos do rosto, indicada após avaliação, para suavizar linhas de expressão preservando a mobilidade natural.',
  },
  {
    slug: 'rinomodelacao',
    group: 'face',
    name: 'Rinomodelação',
    description:
      'Avaliação individual das proporções do nariz em relação ao restante do rosto, com planejamento personalizado.',
    requiresFlag: 'SHOW_RHINOMODELING',
  },
  {
    slug: 'bioestimuladores-de-colageno',
    group: 'pele',
    name: 'Bioestimuladores de colágeno',
    description:
      'Substâncias que estimulam a produção natural de colágeno, indicadas para quem quer cuidar da firmeza e da qualidade da pele. A indicação e o número de sessões variam em cada caso.',
  },
  {
    slug: 'microagulhamento',
    group: 'pele',
    name: 'Microagulhamento',
    description:
      'Técnica que cria microestímulos controlados na pele para favorecer a renovação, podendo ser associada a ativos conforme a avaliação.',
  },
  {
    slug: 'skinbooster',
    group: 'pele',
    name: 'Skinbooster',
    description:
      'Microaplicações de ácido hialurônico voltadas à hidratação profunda da pele, indicadas para quem busca mais viço e uniformidade.',
  },
  {
    slug: 'enzimas-lipoliticas',
    group: 'corpo',
    name: 'Enzimas lipolíticas',
    description:
      'Aplicações localizadas indicadas, após avaliação, para tratar áreas específicas de gordura localizada.',
  },
  {
    slug: 'intradermoterapia',
    group: 'corpo',
    name: 'Intradermoterapia facial e corporal',
    description:
      'Aplicação de ativos na camada superficial da pele, no rosto ou no corpo, de acordo com o objetivo definido na avaliação.',
  },
];
