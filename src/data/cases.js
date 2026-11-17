// Casos de antes e depois.
// - `visible: false` oculta o caso (e seu filtro) sem apagar arquivos: use se a autorização for retirada.
// - ids, caminhos e `alt` devem corresponder aos arquivos de public/img/resultados/.
// - `alt` descreve a imagem; o slider acrescenta "Antes." / "Depois." automaticamente.
export const cases = [
  {
    id: 'caso-01',
    visible: true,
    titulo: 'Comparativo de lábios',
    procedimento: 'Preenchimento labial',
    antes: '/img/resultados/caso-01-antes.webp',
    depois: '/img/resultados/caso-01-depois.webp',
    largura: 640,
    altura: 800,
    alt: 'Foto em close dos lábios de uma pessoa, em ângulo lateral, para comparar antes e depois do preenchimento labial.',
  },
  {
    id: 'caso-02',
    visible: true,
    titulo: 'Comparativo de perfil',
    procedimento: 'Harmonização facial',
    antes: '/img/resultados/caso-02-antes.webp',
    depois: '/img/resultados/caso-02-depois.webp',
    largura: 640,
    altura: 800,
    alt: 'Foto de perfil do rosto de um homem com barba, mostrando nariz, lábios e queixo, para comparar antes e depois da harmonização facial.',
  },
  {
    id: 'caso-03',
    visible: true,
    titulo: 'Comparação facial',
    procedimento: 'Harmonização facial',
    formato: 'prancha',
    imagem: '/img/resultados/caso-03-prancha.webp',
    largura: 1080,
    altura: 1350,
    alt: 'Prancha com duas fotos de um homem de óculos, lado a lado: antes, à esquerda, e depois, à direita, da harmonização facial.',
    legenda: 'Composição original apresentada sem controle deslizante.',
  },
  {
    id: 'caso-07',
    visible: true,
    titulo: 'Rinomodelação',
    procedimento: 'Rinomodelação',
    antes: '/img/resultados/caso-07-antes.webp',
    depois: '/img/resultados/caso-07-depois.webp',
    largura: 400,
    altura: 400,
    alt: 'Foto em close do nariz visto por baixo, para comparar antes e depois da rinomodelação.',
  },
  {
    id: 'caso-08',
    visible: true,
    titulo: 'Rinomodelação, segundo caso',
    procedimento: 'Rinomodelação',
    // ATENÇÃO: os arquivos estão trocados de propósito no código original
    // (antes = "-depois.webp", depois = "-antes.webp"). Confirmar com a cliente.
    antes: '/img/resultados/caso-08-depois.webp',
    depois: '/img/resultados/caso-08-antes.webp',
    largura: 600,
    altura: 800,
    alt: 'Foto em close do nariz visto por baixo, em ângulo inclinado, para comparar antes e depois da rinomodelação.',
  },
];
