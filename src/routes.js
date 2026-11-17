// Rotas do site (plain JS: lido pelo build para prerender e sitemap).
// Hoje só existe a home. Para ativar páginas futuras, adicione itens aqui, crie o componente
// da página e trate o caminho em src/entry-server.jsx e src/main.jsx.
import { SERVICE_AREAS } from './config/site.js';
import { services } from './data/services.js';

export const routes = [{ path: '/', changefreq: 'monthly', priority: 1 }];

// ---------------------------------------------------------------------------
// PREPARADO, NÃO ATIVADO: páginas por serviço e por cidade.
// Gera caminhos como /harmonizacao-facial-lauro-de-freitas a partir de
// services.js (slug) × SERVICE_AREAS (slug). Para ativar, concatene o retorno
// em `routes` e crie o template da página (com texto próprio, não duplicado).
// ---------------------------------------------------------------------------
export function buildServiceRoutes() {
  return services.map((service) => ({ path: `/${service.slug}`, service: service.slug }));
}

export function buildServiceCityRoutes() {
  return services.flatMap((service) =>
    SERVICE_AREAS.map((area) => ({
      path: `/${service.slug}-${area.slug}`,
      service: service.slug,
      area: area.slug,
    })),
  );
}
