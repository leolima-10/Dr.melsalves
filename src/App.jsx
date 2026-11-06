import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import BeforeAfterSlider, { ComparisonBoard } from './components/BeforeAfterSlider.jsx';
import { cases } from './data/cases.js';
import {
  CONTACT_INFO,
  getWhatsAppLink,
  SHOW_TESTIMONIALS,
  WHATSAPP_PHONE,
} from './config.js';

gsap.registerPlugin(useGSAP);

const navItems = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#procedimentos', label: 'Procedimentos' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#atendimento', label: 'Atendimento' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contato', label: 'Contato' },
];

const procedures = [
  {
    title: 'Harmonização facial',
    description:
      'Planejamento individual para buscar equilíbrio entre os traços, respeitando a expressão de cada pessoa.',
    context: 'harmonization',
  },
  {
    title: 'Preenchimento labial',
    description:
      'Uma abordagem personalizada para valorizar os lábios de forma compatível com o conjunto do rosto.',
    context: 'lip',
  },
  {
    title: 'Estética avançada',
    description:
      'Atendimento orientado por avaliação individual e pelas necessidades de cada pessoa.',
    context: 'general',
  },
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

// REVISAR COM A DRA.: respostas informativas, sem promessa de resultado.
const faqs = [
  {
    question: 'Como funciona a primeira avaliação?',
    answer:
      'É um momento para conversar sobre suas expectativas, conhecer seu histórico e avaliar suas necessidades. A indicação é individual.',
  },
  {
    question: 'O resultado fica natural?',
    answer:
      'Cada pessoa tem características e expectativas próprias. A avaliação ajuda a conversar sobre possibilidades e limites para o seu caso, sem garantir um resultado específico.',
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
    question: 'Como faço para agendar?',
    answer:
      'Toque em um dos botões de WhatsApp desta página para iniciar uma conversa com a Dra. Mel e solicitar uma avaliação.',
  },
];

function HoneycombMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Monograma MS em um hexágono"
    >
      <path d="M24 2.8 43 13.4v21.2L24 45.2 5 34.6V13.4z" />
      <text
        x="24"
        y="27"
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="13"
        fontWeight="600"
      >
        MS
      </text>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2 22l5.12-1.34A9.93 9.93 0 1 0 12.04 2Zm0 18.06c-1.47 0-2.91-.39-4.18-1.13l-.3-.18-3.04.8.81-2.96-.19-.31A8.14 8.14 0 1 1 12.04 20.06Zm4.47-6.1c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.3.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.07-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsAppLink({ context, className = '', children, label }) {
  return (
    <a
      className={className}
      href={getWhatsAppLink(context)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function SectionReveal({ className, children, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

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
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Dra. Mel Salves, início">
          <HoneycombMark className="brand__mark" />
          <span>Dra. Mel Salves</span>
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
          <WhatsAppLink context="general" className="button button--small button--gold">
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

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const markPath = heroRef.current?.querySelector('.hero__mini-mark path');
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      timeline
        .from('.hero__copy > *', {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.08,
        })
        .from(
          '.hero__portrait-wrap',
          { autoAlpha: 0, y: 12, duration: 0.75 },
          '-=0.42',
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
        timeline.to(markPath, { strokeDashoffset: 0, duration: 0.9 }, 0.65);
      }
    },
    { scope: heroRef, dependencies: [shouldReduceMotion], revertOnUpdate: true },
  );

  return (
    <section ref={heroRef} className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__inner page-width">
        <div className="hero__copy">
          <p className="hero__welcome">Harmonização facial & estética avançada</p>
          <h1 id="hero-title">Harmonização facial com naturalidade e equilíbrio.</h1>
          <p className="hero__description">
            Avaliação individual e planejamento personalizado para realçar a sua beleza.
          </p>
          <div className="hero__actions">
            <WhatsAppLink context="general" className="button button--gold">
              <WhatsAppIcon />
              Agendar avaliação no WhatsApp
            </WhatsAppLink>
            <a className="text-link text-link--light" href="#resultados">
              Ver resultados
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <div className="hero__portrait-wrap">
          <div className="hero__portrait-frame">
            <img
              className="hero__portrait"
              src="/img/dra-mel.webp"
              alt="Dra. Mel Salves em seu espaço de atendimento."
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero__portrait-note">
            <HoneycombMark className="hero__mini-mark" />
            <span>Dra. Mel<br />Salves</span>
          </div>
        </div>
        <div
          className="hero__credentials"
          aria-label="Atuação profissional"
        >
          <span>Especialista em Harmonização Facial</span>
          <span>Expert em Preenchimento Labial</span>
          <span>Professora na Rede Pro Cursos</span>
        </div>
      </div>
      <span className="hero__ornament" aria-hidden="true" />
    </section>
  );
}

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
            Sou a Dra. Mel Salves, especialista em Harmonização Facial, expert em
            Preenchimento Labial e professora na Rede Pro Cursos. Meu trabalho é guiado
            pela avaliação individual e por um planejamento que respeita as características
            de cada pessoa.
          </p>
          <div className="about-facts">
            <p><span>Formação</span><strong>[PREENCHER: formação]</strong></p>
            <p><span>Registro profissional</span><strong>[PREENCHER: conselho, nº e UF]</strong></p>
            <p><span>Experiência</span><strong>[PREENCHER: tempo de experiência]</strong></p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

function Procedures() {
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
          <p>As possibilidades são conversadas com cuidado, sempre a partir de uma avaliação.</p>
        </div>
        <div className="procedure-list">
          {procedures.map((procedure) => (
            <article className="procedure-item" key={procedure.title}>
              <div>
                <h3>{procedure.title}</h3>
                <p>{procedure.description}</p>
              </div>
              <WhatsAppLink
                context={procedure.context}
                className="procedure-item__link"
                label={`Conversar sobre ${procedure.title} no WhatsApp`}
              >
                Conversar
                <span aria-hidden="true">↗</span>
              </WhatsAppLink>
            </article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

function ResultGallery() {
  const [filter, setFilter] = useState('Todos');
  const filters = [
    'Todos',
    'Preenchimento labial',
    'Harmonização facial',
    'Rinomodelação',
  ];
  const visibleCases =
    filter === 'Todos' ? cases : cases.filter((item) => item.procedimento === filter);

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
              Arraste os pares interativos. Cada caso é único e depende de avaliação individual.
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
          <p className="section-kicker">Um passo de cada vez</p>
          <h2 id="care-title">Como funciona o atendimento</h2>
          <p>O cuidado é construído com diálogo, avaliação e acompanhamento.</p>
        </div>
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

function Testimonials() {
  if (!SHOW_TESTIMONIALS) return null;
  return (
    <SectionReveal className="section testimonials-section" aria-labelledby="testimonials-title">
      <div className="page-width section-heading section-heading--center">
        <p className="section-kicker">Experiências compartilhadas</p>
        <h2 id="testimonials-title">Depoimentos</h2>
        <p>Depoimentos reais serão incluídos após revisão e autorização.</p>
      </div>
    </SectionReveal>
  );
}

function TeachingBand() {
  return (
    <SectionReveal className="teaching-band" aria-label="Atuação como professora">
      <div className="page-width teaching-band__inner">
        <div>
          <p className="section-kicker">Compartilhando conhecimento</p>
          <h2>Professora na Rede Pro Cursos</h2>
        </div>
        <a href="https://www.instagram.com/redeprocursos/" target="_blank" rel="noopener noreferrer">
          Conheça a Rede Pro Cursos
          <span aria-hidden="true">↗</span>
        </a>
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
          <p>Fale com a Dra. Mel para conversar sobre suas expectativas.</p>
        </div>
        <div className="contact-panel__actions">
          <WhatsAppLink context="general" className="button button--gold">
            <WhatsAppIcon />
            Agendar pelo WhatsApp
          </WhatsAppLink>
          <a
            className="contact-instagram"
            href="https://www.instagram.com/dramelsalves"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            @dramelsalves
          </a>
          {(CONTACT_INFO.address || CONTACT_INFO.hours || CONTACT_INFO.mapUrl) && (
            <div className="contact-details">
              {CONTACT_INFO.address && <p>{CONTACT_INFO.address}</p>}
              {CONTACT_INFO.hours && <p>{CONTACT_INFO.hours}</p>}
              {CONTACT_INFO.mapUrl && (
                <a href={CONTACT_INFO.mapUrl} target="_blank" rel="noopener noreferrer">
                  Ver localização
                </a>
              )}
            </div>
          )}
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
          <span>Dra. Mel Salves</span>
        </a>
        <p className="footer-registration">
          [PREENCHER: conselho profissional + nº de registro + UF]
        </p>
        <div className="footer-links">
          <a href="https://www.instagram.com/dramelsalves" target="_blank" rel="noopener noreferrer">
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
        <span>© {new Date().getFullYear()} Dra. Mel Salves</span>
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
      label="Conversar com a Dra. Mel pelo WhatsApp"
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
    name: 'Dra. Mel Salves',
    telephone: `+${WHATSAPP_PHONE}`,
    sameAs: ['https://www.instagram.com/dramelsalves'],
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Procedures />
        <ResultGallery />
        <CarePath />
        <Testimonials />
        <TeachingBand />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
