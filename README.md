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

Importe o repositório na Vercel. O preset Vite usa `npm run build` e a pasta de saída `dist`. Não há backend nem variáveis de ambiente.

## Atualizar conteúdo e imagens

- **WhatsApp e mensagens:** edite `src/config.js`. `getWhatsAppLink()` é a única função usada para criar links de conversa.
- **Foto da Dra.:** substitua `public/img/dra-mel.webp`, mantendo o nome, ou ajuste o caminho em `src/App.jsx`.
- **Resultados:** os dois pares interativos e a prancha original ficam em `public/img/resultados/`; caminhos, textos alternativos e categorias são definidos em `src/data/cases.js`. Para novos pares, adicione arquivos separados e mantenha os nomes/caminhos alinhados com essa lista. Imagens ausentes ou inválidas exibem um placeholder sem ícone quebrado.
- **Depoimentos e dados de atendimento:** a flag `SHOW_TESTIMONIALS` e os campos de endereço, horário e mapa estão em `src/config.js`. Depoimentos só devem ser ativados depois de serem fornecidos e autorizados.
- **Textos:** conteúdo das seções e FAQ fica em `src/App.jsx`. Revise as respostas do FAQ com a Dra. antes de publicar.
- **SEO e compartilhamento:** título, descrição, imagem social e favicon ficam em `index.html` e `public/`.

### Preparação das fotos de antes e depois

Use arquivos separados, com o mesmo enquadramento, ângulo, luz, fundo e distância. Prefira proporção 4:5, largura máxima de 1600 px e WebP/JPG com até 250 KB. Preserve o padrão `caso-XX-antes.webp` e `caso-XX-depois.webp` (ou ajuste os caminhos em `src/data/cases.js`).

As imagens-fonte recebidas estão em `imagens/`. Os pares de lábios e perfil foram recortados para permitir a comparação deslizante; a prancha facial foi preservada como imagem estática, pois já contém o antes e depois na mesma composição. A foto `drmel-escritorio.jpg` foi preparada para o hero. As imagens de rinomodelação não foram incluídas porque esse procedimento ainda não está confirmado entre os serviços divulgados.

**Antes de publicar:** confirme a autorização de uso de cada imagem e que os pares, categorias e legendas correspondem aos casos. O aviso do site informa que a publicação depende dessa autorização; não publique as imagens sem a confirmação.

## Pendências para a Dra. Mel

- Confirmar autorização de publicação das imagens já inseridas e validar o pareamento dos casos.
- Preencher formação, conselho profissional, número de registro, UF e tempo de experiência.
- Informar endereço, horários e link de mapa, caso queira exibi-los.
- Enviar depoimentos reais com autorização, antes de ativar `SHOW_TESTIMONIALS`.
- Revisar as respostas do FAQ e o aviso de imagens autorizadas.
