import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import BeforeAfterSlider, { ComparisonBoard } from './components/BeforeAfterSlider.jsx';
import {
  HoneycombMark,
  InstagramIcon,
  SectionReveal,
  WhatsAppIcon,
  WhatsAppLink,
} from './components/common.jsx';
import {
  AreaCards,
  InstagramBlock,
  Procedures,
  TeachingBand,
  Testimonials,
  Values,
} from './components/Sections.jsx';
import { cases } from './data/cases.js';
import {
  DISPLAY_NAME,
  IDENTITY_PORTRAITS,
  INSTAGRAM,
  PROFESSIONAL,
  SHORT_NAME,
  SHOW_CREDENTIALS,
  SHOW_IDENTITY_PORTRAITS,
  SITE_URL,
  WHATSAPP_PHONE,
} from './config/site.js';

gsap.registerPlugin(useGSAP);

const navItems = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#procedimentos', label: 'Procedimentos' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#atendimento', label: 'Atendimento' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contato', label: 'Contato' },
];

const steps = [
  {
    title: 'Avaliação',
    text: 'Uma conversa para entender suas expectativas e conhecer suas necessidades.',
  },
  {
    title: 'Planejamento personalizado',
    text: 'As possibilidades são discutidas de forma individual, respeitando suas características.',
  },
  {
    title: 'Procedimento',
    text: 'A realização depende da avaliação, da indicação e do planejamento acordado.',
  },
  {
    title: 'Acompanhamento',
    text: 'As orientações e o acompanhamento são definidos de acordo com cada caso.',
  },
];

// REVISAR COM A CLIENTE: respostas informativas, sem promessa de resultado.
const faqs = [
  {
    question: 'Como funciona a primeira avaliação?',
    answer:
      'É uma conversa para entender o que você deseja, conhecer seu histórico e avaliar o que faz sentido para o seu caso. Só depois dessa avaliação é discutida a indicação, que é individual.',
  },
  {
    question: 'Como é buscada a beleza natural?',
    answer:
      'A proposta é respeitar suas características e a sua expressão, com um plano individual conversado antes de qualquer decisão. Os resultados variam de pessoa para pessoa e não é possível garantir um resultado específico.',
  },
  {
    question: 'Quais cuidados são necessários depois?',
    answer:
      'As orientações variam conforme a avaliação e o procedimento indicado. Você receberá recomendações específicas para o seu caso.',
  },
  {
    question: 'Para quem os procedimentos são indicados?',
    answer:
      'A indicação depende de avaliação individual, histórico e expectativas. Nem todo procedimento é adequado para todas as pessoas.',
  },
  {
    question: 'Em quais cidades é feito o atendimento?',
    answer:
      'Em Lauro de Freitas, Salvador, Praia do Forte e Barra do Pojuca. Para combinar local e horário, fale pelo WhatsApp.',
  },
  {
    question: 'Como faço para agendar?',
    answer:
      `Toque em um dos botões de WhatsApp desta página para iniciar uma conversa com a ${SHORT_NAME} e solicitar uma avaliação.`,
  },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled || menuOpen ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label={`${DISPLAY_NAME}, início`}>
          <HoneycombMark className="brand__mark" />
          <span>{DISPLAY_NAME}</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? ' primary-nav--open' : ''}`}
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <WhatsAppLink context="header" className="button button--small button--gold">
            Agendar avaliação
          </WhatsAppLink>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [imageOk, setImageOk] = useState(true);

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const markPath = heroRef.current?.querySelector('.hero__mini-mark path');
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      timeline
        .from('.hero__media img', { scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0)
        .from('.hero__frame', { autoAlpha: 0, duration: 0.8 }, 0.1)
        .from(
          '.hero__frame > *:not(.hero__mini-mark)',
          { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.09 },
          0.3,
        )
        .from(
          '.hero__credentials span',
          { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.07 },
          '-=0.3',
        );

      if (markPath) {
        const pathLength = markPath.getTotalLength();
        gsap.set(markPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
        timeline.to(markPath, { strokeDashoffset: 0, duration: 0.9 }, 0.4);
      }
    },
    { scope: heroRef, dependencies: [shouldReduceMotion], revertOnUpdate: true },
  );

  return (
    <section ref={heroRef} className="hero" id="inicio" aria-labelledby="hero-title">
      {imageOk && (
        <div className="hero__media" aria-hidden="true">
          <img
            src="/img/hero-identidade.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
            onError={() => setImageOk(false)}
          />
        </div>
      )}
      <div className="hero__inner page-width">
        <div className="hero__frame">
          <HoneycombMark className="hero__mini-mark" />
          <p className="hero__welcome">Harmonização facial &amp; estética avançada</p>
          <h1 id="hero-title">
            Seu rosto é sua <em>identidade.</em>
          </h1>
          <p className="hero__description">
            É o que chega antes da sua voz, do seu nome, da sua história.
          </p>
          <div className="hero__actions">
            <WhatsAppLink context="hero" className="button button--gold">
              <WhatsAppIcon />
              Agendar avaliação no WhatsApp
            </WhatsAppLink>
            <a className="text-link text-link--light" href="#resultados">
              Ver resultados
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <div className="hero__credentials" aria-label="Atuação profissional">
          {PROFESSIONAL.heroCredentials.map((credential) => (
            <span key={credential}>{credential}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function IdentityPortrait({ src }) {
  const [ok, setOk] = useState(true);

  return (
    <div className="identity__shot">
      {ok && <img src={src} alt="" loading="lazy" decoding="async" onError={() => setOk(false)} />}
    </div>
  );
}

function Identity() {
  return (
    <SectionReveal className="section identity-section" id="cuidado" aria-labelledby="identity-title">
      <div className="page-width">
        <h2 id="identity-title" className="identity__title">
          cuidado <span>{'{individual}'}</span>
          <br />
          em cada rosto
        </h2>
        {SHOW_IDENTITY_PORTRAITS && IDENTITY_PORTRAITS.length > 0 && (
          <div className="identity__strip">
            {IDENTITY_PORTRAITS.map((src) => (
              <IdentityPortrait key={src} src={src} />
            ))}
          </div>
        )}
        <p className="identity__text">
          Cada pessoa tem uma história própria. O cuidado começa pela <strong><em>escuta</em></strong>{' '}
          e pela avaliação individual.
        </p>
      </div>
    </SectionReveal>
  );
}

const aboutFacts = [
  { label: 'Formação', value: PROFESSIONAL.education },
  { label: 'Registro profissional', value: PROFESSIONAL.registration },
  { label: 'Experiência', value: PROFESSIONAL.experience },
].filter((fact) => fact.value);

function About() {
  return (
    <SectionReveal className="section about-section" id="sobre" aria-labelledby="about-title">
      <div className="page-width about-layout">
        <div className="section-heading">
          <p className="section-kicker">Cuidado que começa pela escuta</p>
          <h2 id="about-title">Beleza com identidade própria.</h2>
        </div>
        <div className="about-copy">
          <p>
            Sou a {DISPLAY_NAME}, {PROFESSIONAL.profession.toLowerCase()}. Sou graduada em
            Biomedicina e tenho especialização em estética avançada aplicada à saúde. Também sou
            professora na Rede Pro Cursos.
          </p>
          <p>
            Meu trabalho é guiado pela escuta, pela avaliação individual e por um planejamento
            que respeita as características de cada pessoa, sempre buscando uma beleza natural,
            com escolhas seguras.
          </p>
          {SHOW_CREDENTIALS && aboutFacts.length > 0 && (
            <div className="about-facts">
              {aboutFacts.map((fact) => (
                <p key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionReveal>
  );
}

function ResultGallery() {
  const [filter, setFilter] = useState('Todos');
  // Casos com `visible: false` (autorização retirada) somem da galeria e dos filtros.
  const publishedCases = cases.filter((item) => item.visible !== false);
  const filters = ['Todos', ...new Set(publishedCases.map((item) => item.procedimento))];
  const visibleCases =
    filter === 'Todos'
      ? publishedCases
      : publishedCases.filter((item) => item.procedimento === filter);

  if (publishedCases.length === 0) return null;

  const changeFilter = (nextFilter) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setFilter(nextFilter));
    } else {
      setFilter(nextFilter);
    }
  };

  return (
    <SectionReveal className="section results-section" id="resultados" aria-labelledby="results-title">
      <div className="page-width">
        <div className="results-heading">
          <div className="section-heading">
            <p className="section-kicker">Um olhar para cada detalhe</p>
            <h2 id="results-title">Resultados para comparar.</h2>
            <p>
              Arraste os pares interativos. Os resultados variam de pessoa para pessoa: cada caso
              é único e depende de avaliação individual.
            </p>
          </div>
          <div className="filter-list" role="group" aria-label="Filtrar casos por procedimento">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip${filter === item ? ' is-active' : ''}`}
                aria-pressed={filter === item}
                onClick={() => changeFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="results-grid" aria-live="polite">
          {visibleCases.map((item) => (
            <article className="result-card" key={item.id} style={{ viewTransitionName: item.id }}>
              {item.formato === 'prancha' ? (
                <ComparisonBoard item={item} />
              ) : (
                <BeforeAfterSlider item={item} />
              )}
              <div className="result-card__meta">
                <p>{item.procedimento}</p>
                <h3>{item.titulo}</h3>
                {item.legenda && <span>{item.legenda}</span>}
              </div>
            </article>
          ))}
        </div>
        <div className="results-disclaimer">
          <p>
            Os resultados variam de pessoa para pessoa. A publicação das imagens depende de
            autorização dos pacientes. Todo procedimento é realizado mediante avaliação individual.
          </p>
          <WhatsAppLink context="gallery" className="button button--dark">
            <WhatsAppIcon />
            Quero avaliar o meu caso
          </WhatsAppLink>
        </div>
      </div>
    </SectionReveal>
  );
}

function CarePath() {
  return (
    <SectionReveal
      className="section care-section"
      id="atendimento"
      aria-labelledby="care-title"
    >
      <div className="page-width">
        <div className="section-heading section-heading--center">
          <p className="section-kicker">Onde atendo</p>
          <h2 id="care-title">Atendimento em Lauro de Freitas e Salvador</h2>
          <p>
            Também em Praia do Forte e Barra do Pojuca. Fale pelo WhatsApp para combinar o local
            e o horário.
          </p>
        </div>
        <AreaCards />
        <h3 className="care-steps-title">Como funciona o atendimento</h3>
        <ol className="care-steps">
          {steps.map((step, index) => (
            <li className="care-step" key={step.title}>
              <span className="care-step__number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionReveal>
  );
}

function FAQ() {
  return (
    <SectionReveal className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="page-width faq-layout">
        <div className="section-heading">
          <p className="section-kicker">Antes de conversar</p>
          <h2 id="faq-title">Perguntas frequentes</h2>
          <p>Informações gerais. A avaliação individual orienta cada decisão.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<span aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

function Contact() {
  return (
    <SectionReveal className="section contact-section" id="contato" aria-labelledby="contact-title">
      <div className="page-width contact-panel">
        <div className="contact-panel__copy">
          <p className="section-kicker">Vamos conversar?</p>
          <h2 id="contact-title">O primeiro passo é uma avaliação.</h2>
          <p>Fale com a {SHORT_NAME} para conversar sobre suas expectativas.</p>
        </div>
        <div className="contact-panel__actions">
          <WhatsAppLink context="contact" className="button button--gold">
            <WhatsAppIcon />
            Agendar pelo WhatsApp
          </WhatsAppLink>
          <a
            className="contact-instagram"
            href={INSTAGRAM.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            @{INSTAGRAM.handle}
          </a>
        </div>
      </div>
    </SectionReveal>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width site-footer__top">
        <a className="brand brand--footer" href="#inicio">
          <HoneycombMark className="brand__mark" />
          <span>{DISPLAY_NAME}</span>
        </a>
        {SHOW_CREDENTIALS && PROFESSIONAL.registration && (
          <p className="footer-registration">{PROFESSIONAL.registration}</p>
        )}
        <div className="footer-links">
          <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <WhatsAppLink context="footer">WhatsApp</WhatsAppLink>
        </div>
      </div>
      <div className="page-width site-footer__bottom">
        <p>
          Os resultados variam de pessoa para pessoa. A publicação das imagens depende de
          autorização dos pacientes. Todo procedimento é realizado mediante avaliação individual.
        </p>
        <span>© {new Date().getFullYear()} {DISPLAY_NAME}</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const [mainCtaVisible, setMainCtaVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const buttons = document.querySelectorAll(
      '.hero__actions .button, .results-disclaimer .button, .contact-panel__actions .button',
    );
    if (!buttons.length) return undefined;

    const visibleButtons = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleButtons.add(entry.target);
          else visibleButtons.delete(entry.target);
        });
        setMainCtaVisible(visibleButtons.size > 0);
      },
      { threshold: 0.1 },
    );
    buttons.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, []);

  return (
    <WhatsAppLink
      context="floating"
      className={`floating-whatsapp${mainCtaVisible ? ' floating-whatsapp--hidden' : ''}`}
      label={`Conversar com a ${SHORT_NAME} pelo WhatsApp`}
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </WhatsAppLink>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      respectReducedMotion: true,
    });

    return () => lenis.destroy();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: DISPLAY_NAME,
    url: SITE_URL,
    telephone: `+${WHATSAPP_PHONE}`,
    sameAs: [INSTAGRAM.url],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Values />
        <Identity />
        <Procedures />
        <ResultGallery />
        <CarePath />
        <Testimonials />
        <InstagramBlock />
        <TeachingBand />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
