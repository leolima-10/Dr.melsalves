import {
  BRAND_PHRASE,
  BRAND_SIGNATURE,
  INSTAGRAM,
  REDE_PRO_CURSOS,
  SERVICE_AREAS,
  SHOW_RHINOMODELING,
  SHOW_TESTIMONIALS,
  TESTIMONIALS,
  VALUES,
} from '../config/site.js';
import { serviceGroups, services } from '../data/services.js';
import { InstagramIcon, SectionReveal, WhatsAppLink } from './common.jsx';

const flags = { SHOW_RHINOMODELING };
const isServiceVisible = (service) => !service.requiresFlag || flags[service.requiresFlag];

/* ------------------------------------------------------------------ */
/* Procedimentos: 8 serviços agrupados em Face, Pele e Corpo           */
/* ------------------------------------------------------------------ */
export function Procedures() {
  const visibleServices = services.filter(isServiceVisible);

  return (
    <SectionReveal
      className="section procedures-section"
      id="procedimentos"
      aria-labelledby="procedures-title"
    >
      <div className="page-width">
        <div className="section-heading section-heading--center">
          <p className="section-kicker">Caminhos possíveis</p>
          <h2 id="procedures-title">Procedimentos</h2>
          <p>
            As possibilidades são conversadas com cuidado, sempre a partir de uma avaliação
            individual. A indicação, o planejamento e os resultados variam de pessoa para pessoa.
          </p>
        </div>
        {serviceGroups.map((group) => {
          const items = visibleServices.filter((service) => service.group === group.id);
          if (!items.length) return null;
          return (
            <div className="procedure-group" key={group.id}>
              <h3 className="procedure-group__title">{group.title}</h3>
              <div className="procedure-list">
                {items.map((service) => (
                  <article className="procedure-item" key={service.slug}>
                    <div>
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                    </div>
                    <WhatsAppLink
                      context="procedures"
                      service={service.name}
                      className="procedure-item__link"
                      label={`Conversar sobre ${service.name} no WhatsApp`}
                    >
                      Conversar
                      <span aria-hidden="true">↗</span>
                    </WhatsAppLink>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/* Valores da marca                                                    */
/* ------------------------------------------------------------------ */
const valueIcons = {
  ear: (
    <path d="M7 9a5 5 0 1 1 9.6 2c-.7 1.6-2.1 2.3-2.6 3.6-.4 1.1-.2 2.4-1.4 3.4-1.2 1-3 .6-3.6-.8M11 9.5a1.9 1.9 0 0 1 3.5 1" />
  ),
  plan: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.4 5.2 8 4.6 4.5 4.8v13c3.5-.2 5.9.4 7.5 1.7 1.6-1.3 4-1.9 7.5-1.7v-13c-3.5-.2-5.9.4-7.5 1.7Z" />
      <path d="M12 6.5v13" />
    </>
  ),
};

export function Values() {
  return (
    <SectionReveal className="section values-section" id="valores" aria-labelledby="values-title">
      <div className="page-width">
        <div className="values-signature">
          <p className="section-kicker">Nossa assinatura</p>
          <h2 id="values-title">{BRAND_SIGNATURE}</h2>
          <p className="values-phrase">{BRAND_PHRASE}</p>
        </div>
        <ul className="values-list">
          {VALUES.map((value) => (
            <li className="value-item" key={value.title}>
              <svg
                className="value-item__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                {valueIcons[value.icon]}
              </svg>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/* Locais de atendimento: endereço, horário e mapa são opcionais       */
/* ------------------------------------------------------------------ */
export function AreaCards() {
  return (
    <ul className="area-list">
      {SERVICE_AREAS.map((area) => (
        <li className="area-item" key={area.slug}>
          <h3>{area.name}</h3>
          {area.address && <p>{area.address}</p>}
          {area.hours && <p>{area.hours}</p>}
          {area.mapUrl && (
            <a href={area.mapUrl} target="_blank" rel="noopener noreferrer">
              Ver no mapa<span className="sr-only"> de {area.name}</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Depoimentos: só aparecem com flag ligada e depoimentos autorizados  */
/* ------------------------------------------------------------------ */
export function Testimonials() {
  if (!SHOW_TESTIMONIALS || TESTIMONIALS.length === 0) return null;
  return (
    <SectionReveal
      className="section testimonials-section"
      id="depoimentos"
      aria-labelledby="testimonials-title"
    >
      <div className="page-width">
        <div className="section-heading section-heading--center">
          <p className="section-kicker">Experiências compartilhadas</p>
          <h2 id="testimonials-title">Depoimentos</h2>
        </div>
        <ul className="testimonial-list">
          {TESTIMONIALS.map((item) => (
            <li key={`${item.name}-${item.source}`}>
              <figure className="testimonial-card">
                <blockquote>{item.text}</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  {item.source && <span>{item.source}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="testimonial-note">
          Depoimentos publicados com autorização. Cada experiência é individual e não representa
          garantia de resultado.
        </p>
      </div>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/* Instagram em destaque                                               */
/* ------------------------------------------------------------------ */
export function InstagramBlock() {
  return (
    <SectionReveal
      className="instagram-band"
      id="instagram"
      aria-labelledby="instagram-title"
    >
      <div className="page-width instagram-band__inner">
        <div>
          <p className="section-kicker">Acompanhe de perto</p>
          <h2 id="instagram-title">@{INSTAGRAM.handle}</h2>
          <p>Conheça mais sobre o trabalho e acompanhe as novidades no Instagram.</p>
        </div>
        <a
          className="button button--dark"
          href={INSTAGRAM.url}
          target="_blank"
          rel="noopener noreferrer"
          data-link-origin="instagram-band"
        >
          <InstagramIcon />
          Seguir no Instagram
        </a>
      </div>
    </SectionReveal>
  );
}

/* ------------------------------------------------------------------ */
/* Rede Pro Cursos: separa ensino de atendimento                       */
/* ------------------------------------------------------------------ */
export function TeachingBand() {
  return (
    <SectionReveal className="teaching-band" aria-labelledby="teaching-title">
      <div className="page-width teaching-band__inner">
        <div>
          <p className="section-kicker">Compartilhando conhecimento</p>
          <h2 id="teaching-title">Professora na Rede Pro Cursos</h2>
          <p className="teaching-band__text">{REDE_PRO_CURSOS.description}</p>
        </div>
        <a href={REDE_PRO_CURSOS.url} target="_blank" rel="noopener noreferrer">
          Conheça a Rede Pro Cursos
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </SectionReveal>
  );
}
