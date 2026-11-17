import {
  REDE_PRO_CURSOS,
  SERVICE_AREAS,
  SHOW_RHINOMODELING,
  SHOW_TESTIMONIALS,
  TESTIMONIALS,
  VALUES,
} from '../config/site.js';
import { serviceGroups, services } from '../data/services.js';
import { SectionReveal, WhatsAppIcon, WhatsAppLink } from './common.jsx';

const flags = { SHOW_RHINOMODELING };
const isServiceVisible = (service) => !service.requiresFlag || flags[service.requiresFlag];

/* ------------------------------------------------------------------ */
/* Procedimentos: lista editorial agrupada em Face, Pele e Corpo        */
/* ------------------------------------------------------------------ */
// Lista em linhas (e não cards iguais): o nome do serviço é o que a paciente procura, então
// ele ganha o peso tipográfico; o grupo fica numa coluna própria, em itálico, como índice.
export function Procedures() {
  const visibleServices = services.filter(isServiceVisible);

  return (
    <SectionReveal
      className="section procedures-section"
      id="procedimentos"
      aria-labelledby="procedures-title"
    >
      <div className="page-width">
        <div className="section-heading procedures-heading">
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
                    <div className="procedure-item__text">
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                    </div>
                    <WhatsAppLink
                      context="procedures"
                      service={service.name}
                      className="procedure-item__link"
                      label={`Conversar sobre ${service.name} no WhatsApp`}
                    >
                      <WhatsAppIcon />
                      Conversar
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
/* Pilares da marca (dentro da seção Sobre)                            */
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

export function ValuePillars() {
  return (
    <ul className="value-list">
      {VALUES.map((value) => (
        <li className="value-item" key={value.title}>
          <svg className="value-item__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {valueIcons[value.icon]}
          </svg>
          <div>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Rede Pro Cursos: separa ensino de atendimento (dentro de Sobre)     */
/* ------------------------------------------------------------------ */
export function TeachingNote() {
  return (
    <aside className="teaching-note" aria-label="Rede Pro Cursos">
      <p>{REDE_PRO_CURSOS.description}</p>
      {/* A seta indica link externo (abre o Instagram da escola em nova aba). */}
      <a href={REDE_PRO_CURSOS.url} target="_blank" rel="noopener noreferrer">
        Conheça a Rede Pro Cursos
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Locais de atendimento: endereço, horário e mapa são opcionais       */
/* ------------------------------------------------------------------ */
// Lista tipográfica com marcador hexagonal (motivo de favo de mel). Sem endereço confirmado,
// caixas vazias pareceriam placeholders; quando houver dados, eles aparecem sob o nome.
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

