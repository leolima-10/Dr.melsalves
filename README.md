# Dra. Mel Salves

Site de página única em React, Vite e Tailwind CSS, preparado para publicação estática na Vercel.

## Rodar localmente

Requer Node.js e npm. Na pasta do projeto:

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## Publicar na Vercel

Importe o repositório na Vercel. O build (`npm run build`) pré-renderiza o HTML da página (SSG), então os buscadores e o preview de links recebem o conteúdo completo. O preset Vite usa `npm run build` e a pasta de saída `dist`. Não há backend. Variáveis de ambiente são opcionais (analytics, ver abaixo).

## Analytics (opcional)

GA4 e Meta Pixel ficam desligados. Para ligar, defina na Vercel (Settings > Environment Variables) `VITE_GA4_ID` e/ou `VITE_META_PIXEL_ID` (ver `.env.example`) e faça um novo deploy. Todo botão de WhatsApp dispara o evento `whatsapp_click` com a origem (hero, header, procedures, gallery, contact, footer, floating) e, quando houver, o serviço. Antes de ligar, avalie com a cliente o aviso de cookies exigido pela LGPD.

## Páginas futuras (serviço e cidade)

`src/routes.js` já tem `buildServiceCityRoutes()` (ex.: `/harmonizacao-facial-lauro-de-freitas`), ainda sem uso. Para ativar: acrescente as rotas em `routes`, crie o componente da página (com texto próprio) e trate o caminho em `src/entry-server.jsx` e `src/main.jsx`. Sitemap e prerender já leem `routes`.

## Atualizar conteúdo e imagens

- **Tudo que depende da cliente:** `src/config/site.js` (forma de tratamento, registro, formação, experiência, cidades/endereços, flags de exibição, depoimentos, URL do site). Blocos sem dados reais ficam ocultos por flag.
- **Serviços:** `src/data/services.js` (agrupados em Face, Pele e Corpo).
- **WhatsApp e mensagens:** `getWhatsAppLink()` em `src/config/site.js` é a única função usada para criar links de conversa; use sempre `<WhatsAppLink>`.
- **Foto da Dra.:** substitua `public/img/dra-mel.webp`, mantendo o nome, ou ajuste o caminho em `src/App.jsx`.
- **Resultados:** os dois pares interativos e a prancha original ficam em `public/img/resultados/`; caminhos, textos alternativos e categorias são definidos em `src/data/cases.js`. Para novos pares, adicione arquivos separados e mantenha os nomes/caminhos alinhados com essa lista. Imagens ausentes ou inválidas exibem um placeholder sem ícone quebrado.
- **Depoimentos e locais:** `SHOW_TESTIMONIALS` + `TESTIMONIALS` e os campos `address`, `hours`, `mapUrl` de cada cidade em `SERVICE_AREAS` (`src/config/site.js`). Só ative depoimentos depois de fornecidos e autorizados; campos vazios não aparecem.
- **Ocultar um caso da galeria:** `visible: false` no caso em `src/data/cases.js` (remove também o filtro).
- **Textos:** conteúdo das seções e FAQ fica em `src/App.jsx` e `src/components/Sections.jsx`. Revise as respostas do FAQ com a cliente antes de publicar.
- **SEO e compartilhamento:** título, descrição, imagem social, canonical e Open Graph vêm de `SEO`/`SITE_URL` em `src/config/site.js` (injetados por `build/seo.js`); o favicon fica em `public/`.

### Preparação das fotos de antes e depois

Use arquivos separados, com o mesmo enquadramento, ângulo, luz, fundo e distância. Prefira proporção 4:5, largura máxima de 1600 px e WebP/JPG com até 250 KB. Preserve o padrão `caso-XX-antes.webp` e `caso-XX-depois.webp` (ou ajuste os caminhos em `src/data/cases.js`).

As imagens-fonte recebidas estão em `imagens/`. Os pares de lábios e perfil foram recortados para permitir a comparação deslizante; a prancha facial foi preservada como imagem estática, pois já contém o antes e depois na mesma composição. A foto `drmel-escritorio.jpg` foi preparada para o hero. As imagens de rinomodelação não foram incluídas porque esse procedimento ainda não está confirmado entre os serviços divulgados.

**Antes de publicar:** confirme a autorização de uso de cada imagem e que os pares, categorias e legendas correspondem aos casos. O aviso do site informa que a publicação depende dessa autorização; não publique as imagens sem a confirmação.

## Pendências para a Dra. Mel

- Confirmar autorização de publicação das imagens já inseridas e validar o pareamento dos casos.
- Confirmar a forma de apresentação (Dra., biomédica esteta, especialista, expert) em `PROFESSIONAL`.
- Informar registro (CRBM), formação e tempo de experiência e ligar `SHOW_CREDENTIALS`.
- Informar endereço, horários e link de mapa de cada um dos 4 locais, caso queira exibi-los.
- Enviar depoimentos reais com autorização, antes de ativar `SHOW_TESTIMONIALS`.
- Confirmar se oferece rinomodelação (`SHOW_RHINOMODELING`) e conferir o pareamento antes/depois do `caso-08`.
- Confirmar o que a Rede Pro Cursos ensina (texto em `REDE_PRO_CURSOS.description`).
- Enviar as fotos de `public/img/identidade/` (faixa "cuidado individual"), ainda ausentes. A foto do hero é `imagens/drmel-escritorio.jpg` (recortada, em `public/img/hero-escritorio-*.webp`; configurada em `HERO_IMAGE`).
- Revisar as respostas do FAQ e o aviso de imagens autorizadas.
