import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import BeforeAfterSlider, { ComparisonBoard } from './components/BeforeAfterSlider.jsx';
import Favo from './components/Favo.jsx';
import GooeyNav from './components/GooeyNav.jsx';
import BeeFlight from './components/BeeFlight.jsx';
import {
  DESKTOP_MOTION,
  FINE_POINTER,
  Flip,
  gsap,
  MOTION_OK,
  ScrollTrigger,
  useIsoLayoutEffect,
} from './lib/gsap.js';
import {
  BrandLogo,
  FooterInstagramButton,
  FooterWhatsAppButton,
  InstagramCard,
  SectionReveal,
  WhatsAppIcon,
  WhatsAppLink,
} from './components/common.jsx';
import {
  AreaCards,
  Procedures,
  TeachingNote,
  Testimonials,
  ValuePillars,
} from './components/Sections.jsx';
import { cases } from './data/cases.js';
import {
  BRAND_PHRASE,
  BRAND_SIGNATURE,
  DISPLAY_NAME,
  HERO_IMAGE,
  IDENTITY_PORTRAITS,
  PROFESSIONAL,
  SHORT_NAME,
  SHOW_CREDENTIALS,
  SHOW_IDENTITY_PORTRAITS,
} from './config/site.js';

// Mesma ordem das seções na página.
const navItems = [
  { href: '#resultados', label: 'Resultados' },
  { href: '#procedimentos', label: 'Procedimentos' },
  { href: '#sobre', label: 'Sobre' },
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

  // Cabeçalho inteligente: some ao rolar para baixo e volta ao rolar para cima. Fica visível
  // com o menu aberto ou quando o foco do teclado entra nele.
  const headerRef = useRef(null);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const setHidden = gsap.quickTo(header, 'yPercent', { duration: 0.35, ease: 'power2.out' });
      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (menuOpenRef.current) return;
          if (self.direction === 1 && self.scroll() > 240) setHidden(-100);
          else if (self.direction === -1) setHidden(0);
        },
      });
      const showOnFocus = () => setHidden(0);
      header.addEventListener('focusin', showOnFocus);
      return () => {
        trigger.kill();
        header.removeEventListener('focusin', showOnFocus);
        gsap.set(header, { clearProps: 'transform' });
      };
    });
    return () => mm.revert();
  }, []);

  // Scrollspy: a pílula do GooeyNav acompanha a seção que ocupa o meio da tela.
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = navItems.findIndex((item) => item.href === `#${entry.target.id}`);
          if (index >= 0) setActiveIdx(index);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    navItems.forEach((item) => {
      const section = document.getElementById(item.href.slice(1));
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const gooeyStyle = scrolled
    ? { '--gn-frame': 'rgba(241, 228, 207, 0.72)', '--gn-ink': '#2a1d14', '--gn-muted': 'rgba(42, 29, 20, 0.7)' }
    : { '--gn-frame': 'rgba(42, 29, 20, 0.5)' };

  return (
    <header
      ref={headerRef}
      className={`site-header${scrolled || menuOpen ? ' site-header--scrolled' : ''}`}
    >
      <div className="site-header__inner">
        <a className="brand" href="#inicio" onClick={closeMenu}>
          <BrandLogo animate />
          <span className="sr-only">, início</span>
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
            <a key={item.href} href={item.href} className="primary-nav__link" onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <div className="primary-nav__gooey">
            <GooeyNav
              items={navItems}
              activeIndex={activeIdx}
              onChange={setActiveIdx}
              theme={scrolled ? 'light' : 'dark'}
              color="#c9973f"
              activeTextColor="#2a1d14"
              colors={['#c9973f', '#e0b866', '#f1e4cf']}
              size="sm"
              style={gooeyStyle}
            />
          </div>
          <WhatsAppLink context="header" className="button button--small button--gold">
            Agendar avaliação
          </WhatsAppLink>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  // A entrada do hero é feita só com CSS (ver "hero-*" em styles.css), para funcionar já no
  // HTML pré-renderizado, sem esperar o JavaScript nem "piscar" depois da hidratação.
  const [imageOk, setImageOk] = useState(true);

  return (
    <section
      className={`hero${HERO_IMAGE && imageOk ? ' hero--photo' : ''}`}
      id="inicio"
      aria-labelledby="hero-title"
    >
      {HERO_IMAGE && imageOk && (
        <div className="hero__media" aria-hidden="true">
          <img
            src={HERO_IMAGE.src}
            srcSet={HERO_IMAGE.srcSet}
            sizes="(min-width: 861px) 54vw, 100vw"
            alt=""
            width={HERO_IMAGE.width}
            height={HERO_IMAGE.height}
            fetchPriority="high"
            decoding="async"
            onError={() => setImageOk(false)}
          />
        </div>
      )}
      <div className="hero__inner page-width">
        <div className="hero__frame">
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
              Agendar pelo WhatsApp
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

const aboutFacts = [
  { label: 'Formação', value: PROFESSIONAL.education },
  { label: 'Registro profissional', value: PROFESSIONAL.registration },
  { label: 'Experiência', value: PROFESSIONAL.experience },
].filter((fact) => fact.value);

// Sobre: reúne a apresentação, a assinatura da marca ("Beleza natural"), os pilares e a
// Rede Pro Cursos, que antes eram quatro seções repetindo a mesma mensagem.
function About() {
  return (
    <SectionReveal className="section about-section favo-host" id="sobre" aria-labelledby="about-title">
      <Favo side="left" anchor="mid" seed={2} accents={3} />
      <div className="page-width about-layout">
        <div className="about-intro">
          <p className="section-kicker">Sobre a {SHORT_NAME}</p>
          <h2 id="about-title" className="about-title">
            cuidado{' '}
            <span className="about-title__accent">
              <span aria-hidden="true">{'{'}</span>individual<span aria-hidden="true">{'}'}</span>
            </span>
            <br />
            em cada rosto
          </h2>
          <p className="about-signature">
            <em>{BRAND_SIGNATURE}.</em> {BRAND_PHRASE}
          </p>
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
          <ValuePillars />
          <TeachingNote />
        </div>
      </div>
      {SHOW_IDENTITY_PORTRAITS && IDENTITY_PORTRAITS.length > 0 && (
        <div className="page-width identity__strip">
          {IDENTITY_PORTRAITS.map((src) => (
            <IdentityPortrait key={src} src={src} />
          ))}
        </div>
      )}
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

  const gridRef = useRef(null);
  const flipState = useRef(null);

  // Filtro: guarda a posição dos cards, o React troca a lista e o Flip anima do estado
  // antigo para o novo (cards que ficam deslizam; os novos aparecem com fade).
  const changeFilter = (nextFilter) => {
    if (nextFilter === filter) return;
    if (gridRef.current && window.matchMedia(MOTION_OK).matches) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll('.result-card'));
    }
    setFilter(nextFilter);
  };

  useIsoLayoutEffect(() => {
    const state = flipState.current;
    const grid = gridRef.current;
    if (!state || !grid) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.querySelectorAll('.result-card'),
      duration: 0.6,
      ease: 'power2.inOut',
      onEnter: (entering) =>
        gsap.fromTo(entering, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, clearProps: 'all' }),
    });
  }, [filter]);

  // Entrada da galeria: a foto de cada card é "descoberta" de cima para baixo ao entrar na tela.
  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(grid.querySelectorAll('.compare-slider, .comparison-board'), {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1,
        ease: 'power3.inOut',
        stagger: 0.12,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      });
    });
    return () => mm.revert();
  }, []);

  if (publishedCases.length === 0) return null;

  return (
    <SectionReveal className="section results-section favo-host" id="resultados" aria-labelledby="results-title">
      <Favo side="right" anchor="mid" seed={1} accents={1} />
      <div className="page-width">
        <div className="results-heading">
          <div className="section-heading">
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
        <div className="results-grid" ref={gridRef} aria-live="polite">
          {visibleCases.map((item) => (
            <article className="result-card" key={item.id} data-flip-id={item.id}>
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
  const stepsRef = useRef(null);

  // Linha de progresso: conforme a pessoa rola, a linha dourada de cada passo se preenche e o
  // texto "acende" (de 40% para 100%). Desktop: os 4 passos em sequência, num só scrub.
  // Mobile (passos empilhados): cada passo acende quando chega ao meio da tela.
  useIsoLayoutEffect(() => {
    const list = stepsRef.current;
    if (!list) return undefined;
    const steps = gsap.utils.toArray('.care-step', list);
    const parts = (step) => step.querySelectorAll('.care-step__number, h4, p');
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      gsap.set(steps.flatMap((step) => [...parts(step)]), { opacity: 0.4 });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: list, start: 'top 80%', end: 'top 35%', scrub: 0.6 },
      });
      steps.forEach((step, index) => {
        timeline
          .fromTo(step.querySelector('.care-step__line'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, index)
          .to(parts(step), { opacity: 1, duration: 0.6 }, index + 0.2);
      });
    });

    mm.add(`${MOTION_OK} and (max-width: 860px)`, () => {
      steps.forEach((step) => {
        gsap.set(parts(step), { opacity: 0.4 });
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: step, start: 'top 85%', end: 'top 55%', scrub: true },
          })
          .fromTo(step.querySelector('.care-step__line'), { scaleX: 0 }, { scaleX: 1 })
          .to(parts(step), { opacity: 1 }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <SectionReveal
      curtain
      className="section care-section favo-host"
      id="atendimento"
      aria-labelledby="care-title"
    >
      <Favo side="left" anchor="bottom" variant="dark" seed={3} accents={1} />
      <Favo side="right" anchor="top" variant="dark" seed={4} accents={1} />
      <div className="page-width">
        <div className="care-top">
          <div className="section-heading">
            <h2 id="care-title">Atendimento em Salvador e região metropolitana</h2>
            <p>
              Também em Praia do Forte e Barra do Pojuca. Fale pelo WhatsApp para combinar o
              local e o horário.
            </p>
          </div>
          <AreaCards />
        </div>
        <h3 className="care-steps-title">Como funciona o atendimento</h3>
        <ol className="care-steps" ref={stepsRef}>
          {steps.map((step, index) => (
            <li className="care-step" key={step.title}>
              <span className="care-step__line" aria-hidden="true" />
              <span className="care-step__number">{String(index + 1).padStart(2, '0')}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionReveal>
  );
}

// Divide a resposta em palavras > letras (só no cliente, na primeira abertura, para o HTML
// pré-renderizado seguir com texto simples). O texto original fica em .sr-only para leitores de tela.
function splitFaqAnswer(paragraph) {
  if (paragraph.dataset.split) return;
  paragraph.dataset.split = 'true';
  const text = paragraph.textContent;
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  text.split(' ').forEach((word, index) => {
    if (index > 0) visual.append(' ');
    const wordEl = document.createElement('span');
    wordEl.className = 'faq-word';
    Array.from(word).forEach((char) => {
      const charEl = document.createElement('span');
      charEl.className = 'faq-char';
      charEl.textContent = char;
      wordEl.append(charEl);
    });
    visual.append(wordEl);
  });
  const readable = document.createElement('span');
  readable.className = 'sr-only';
  readable.textContent = text;
  paragraph.replaceChildren(readable, visual);
}

// Abre e fecha o <details> animando a altura do corpo (GSAP). Com reduced motion mantém o
// comportamento nativo (sem preventDefault). O ícone usa data-closing para girar já no início.
// Ao abrir, as letras da resposta surgem com blur → nítido.
function toggleFaq(event) {
  if (!window.matchMedia(MOTION_OK).matches) return;
  event.preventDefault();
  const details = event.currentTarget.parentElement;
  const body = details.querySelector('.faq-item__body');
  gsap.killTweensOf(body);

  if (details.open && !details.hasAttribute('data-closing')) {
    details.setAttribute('data-closing', '');
    gsap.to(body, {
      height: 0,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        details.open = false;
        details.removeAttribute('data-closing');
        gsap.set(body, { clearProps: 'height,opacity' });
      },
    });
  } else {
    details.removeAttribute('data-closing');
    details.open = true;
    gsap.fromTo(
      body,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'height,opacity' },
    );
    const answer = body.querySelector('p');
    if (answer) {
      splitFaqAnswer(answer);
      const chars = answer.querySelectorAll('.faq-char');
      gsap.killTweensOf(chars);
      gsap.fromTo(
        chars,
        { opacity: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          ease: 'power1.out',
          stagger: { amount: 0.6 },
          clearProps: 'opacity,filter',
        },
      );
    }
  }
}

function FAQ() {
  return (
    <SectionReveal className="section faq-section favo-host" id="faq" aria-labelledby="faq-title">
      <Favo side="right" anchor="mid" seed={5} accents={3} />
      <div className="page-width faq-layout">
        <div className="section-heading">
          <h2 id="faq-title">Perguntas frequentes</h2>
          <p className="faq-intro">Informações gerais. A avaliação individual orienta cada decisão.</p>
          <p className="faq-help faq-help--desktop">
            Não encontrou o que procura?{' '}
            <WhatsAppLink context="faq" className="faq-help__link">
              Fale pelo WhatsApp
            </WhatsAppLink>
            .
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary onClick={toggleFaq}>{item.question}<span aria-hidden="true" /></summary>
              <div className="faq-item__body">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
        <p className="faq-help faq-help--mobile">
          Não encontrou o que procura?{' '}
          <WhatsAppLink context="faq" className="faq-help__link">
            Fale pelo WhatsApp
          </WhatsAppLink>
          .
        </p>
      </div>
    </SectionReveal>
  );
}

function Contact() {
  return (
    <SectionReveal className="section contact-section favo-host" id="contato" aria-labelledby="contact-title">
      <Favo side="left" anchor="bottom" seed={6} accents={2} />
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
          <InstagramCard />
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
          <BrandLogo />
        </a>
        {SHOW_CREDENTIALS && PROFESSIONAL.registration && (
          <p className="footer-registration">{PROFESSIONAL.registration}</p>
        )}
        <div className="footer-links">
          <FooterInstagramButton />
          <FooterWhatsAppButton />
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

  // Pulso discreto no ícone a cada poucos segundos para lembrar do botão sem distrair.
  useEffect(() => {
    const icon = document.querySelector('.floating-whatsapp svg');
    if (!icon) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(icon, {
        scale: 1.18,
        duration: 0.45,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        repeatDelay: 0,
        delay: 4,
        repeatRefresh: false,
        onComplete: function replay() {
          this.delay(7).restart(true);
        },
      });
    });
    return () => mm.revert();
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
    // Lenis e ScrollTrigger no mesmo relógio: o GSAP conduz o rAF do Lenis.
    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      respectReducedMotion: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Botões dourados "magnéticos": seguem o ponteiro de leve (até ~6 px) e voltam com elástico.
  // Só com mouse (hover + ponteiro fino); no toque não existe.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(FINE_POINTER, () => {
      const cleanups = gsap.utils.toArray('.button--gold').map((button) => {
        const moveX = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3.out' });
        const moveY = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3.out' });
        const onMove = (event) => {
          const rect = button.getBoundingClientRect();
          moveX(((event.clientX - rect.left) / rect.width - 0.5) * 12);
          moveY(((event.clientY - rect.top) / rect.height - 0.5) * 8);
        };
        const onLeave = () => gsap.to(button, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        button.addEventListener('pointermove', onMove);
        button.addEventListener('pointerleave', onLeave);
        return () => {
          button.removeEventListener('pointermove', onMove);
          button.removeEventListener('pointerleave', onLeave);
          gsap.set(button, { clearProps: 'x,y' });
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <ResultGallery />
        <Procedures />
        <About />
        <CarePath />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BeeFlight />
      <FloatingWhatsApp />
    </>
  );
}
