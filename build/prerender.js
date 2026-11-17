// Pré-renderiza as rotas de src/routes.js no HTML final (SSG sem framework extra).
// Fluxo (ver "build" no package.json):
//   1. vite build                      -> dist/ (cliente)
//   2. vite build --ssr entry-server   -> .ssr/ (bundle de servidor, temporário)
//   3. node build/prerender.js         -> injeta o HTML de cada rota em dist/ e apaga .ssr/
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routes } from '../src/routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, '.ssr');

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error('prerender: marcador do #root não encontrado');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

for (const route of routes) {
  const html = template.replace(marker, `<div id="root">${render(route.path)}</div>`);
  const target =
    route.path === '/'
      ? path.join(dist, 'index.html')
      : path.join(dist, route.path.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html);
  console.log(`prerender: ${route.path} -> ${path.relative(root, target)} (${html.length} bytes)`);
}

await fs.rm(ssrDir, { recursive: true, force: true });
