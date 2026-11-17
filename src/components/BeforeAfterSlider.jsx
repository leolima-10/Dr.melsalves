import { useEffect, useRef, useState } from 'react';
import { gsap, MOTION_OK, ScrollTrigger } from '../lib/gsap.js';

function PlaceholderPhoto({ label }) {
  return (
    <div className="compare-placeholder" aria-hidden="true">
      <span className="compare-placeholder__hex compare-placeholder__hex--one" />
      <span className="compare-placeholder__hex compare-placeholder__hex--two" />
      <span className="compare-placeholder__label">{label}</span>
      <span className="compare-placeholder__caption">Imagem indisponível</span>
    </div>
  );
}

export function ComparisonBoard({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete && img.naturalWidth === 0) setImageFailed(true);
  }, []);

  return (
    <div className="comparison-board">
      {!imageFailed ? (
        <img
          ref={imageRef}
          src={item.imagem}
          alt={item.alt}
          width={item.largura}
          height={item.altura}
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <PlaceholderPhoto label="Comparação" />
      )}
    </div>
  );
}

export default function BeforeAfterSlider({ item }) {
  const frameRef = useRef(null);
  const animationFrameRef = useRef(0);
  const hintRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [imageFailed, setImageFailed] = useState({ before: false, after: false });

  // Interrompe a dica animada e deixa o estado do React igual ao que a pessoa está vendo.
  const stopHint = () => {
    const hint = hintRef.current;
    if (!hint) return;
    hint.timeline.kill();
    hintRef.current = null;
    setPosition(Math.round(hint.proxy.value));
  };

  const updatePosition = (nextPosition) => {
    const boundedPosition = Math.max(0, Math.min(100, nextPosition));
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      frameRef.current?.style.setProperty('--pos', `${boundedPosition}%`);
      setPosition(boundedPosition);
    });
  };

  const positionFromPointer = (event) => {
    const bounds = frameRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return position;
    return ((event.clientX - bounds.left) / bounds.width) * 100;
  };

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    stopHint();
    draggingRef.current = true;
    setDragging(true);
    setHintVisible(false);
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(positionFromPointer(event));
  };

  const handlePointerMove = (event) => {
    if (draggingRef.current) updatePosition(positionFromPointer(event));
  };

  const endPointer = (event) => {
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event) => {
    stopHint();
    // O estado do React pode estar defasado se a dica acabou de ser interrompida: lê o valor visível.
    const visible = parseFloat(frameRef.current?.style.getPropertyValue('--pos') ?? '');
    let nextPosition = Number.isNaN(visible) ? position : visible;
    const step = event.shiftKey ? 10 : 5;

    if (event.key === 'ArrowLeft') nextPosition -= step;
    else if (event.key === 'ArrowRight') nextPosition += step;
    else if (event.key === 'Home') nextPosition = 0;
    else if (event.key === 'End') nextPosition = 100;
    else return;

    event.preventDefault();
    setHintVisible(false);
    updatePosition(nextPosition);
  };

  // Dica de uso: ao entrar na tela, o divisor vai e volta uma vez (GSAP), ensinando a arrastar.
  // Qualquer toque, clique ou tecla interrompe a dica (stopHint) para não brigar com a pessoa.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const proxy = { value: 50 };
      const timeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.55, ease: 'power2.inOut' },
        onUpdate: () => frame.style.setProperty('--pos', `${proxy.value}%`),
        onComplete: () => setPosition(50),
      });
      timeline
        .to(proxy, { value: 35 })
        .to(proxy, { value: 65, duration: 0.8 })
        .to(proxy, { value: 50 });
      hintRef.current = { timeline, proxy };

      const trigger = ScrollTrigger.create({
        trigger: frame,
        start: 'top 70%',
        once: true,
        onEnter: () => timeline.play(),
      });

      return () => {
        trigger.kill();
        timeline.kill();
        hintRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => () => cancelAnimationFrame(animationFrameRef.current), []);

  const markImageFailed = (side) => {
    setImageFailed((previous) => ({ ...previous, [side]: true }));
  };

  // O HTML é pré-renderizado: se uma imagem falhou antes da hidratação, o evento onError já
  // passou. Confere ao montar para manter o placeholder.
  useEffect(() => {
    const failed = (img) => img && img.complete && img.naturalWidth === 0;
    const after = frameRef.current?.querySelector('.compare-slider__image--after img');
    const before = frameRef.current?.querySelector('.compare-slider__before img');
    if (failed(after)) markImageFailed('after');
    if (failed(before)) markImageFailed('before');
  }, []);

  return (
    <div
      ref={frameRef}
      className={`compare-slider${dragging ? ' is-dragging' : ''}`}
      style={{ '--pos': `${position}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      aria-describedby={`${item.id}-compare-help`}
    >
      <div className="compare-slider__image compare-slider__image--after">
        {!item.placeholder && !imageFailed.after && item.depois && (
          <img
            src={item.depois}
            alt={`${item.alt} Depois.`}
            width={item.largura}
            height={item.altura}
            loading="lazy"
            decoding="async"
            draggable="false"
            onError={() => markImageFailed('after')}
          />
        )}
        {(item.placeholder || imageFailed.after || !item.depois) && (
          <PlaceholderPhoto label="Depois" />
        )}
      </div>
      <div className="compare-slider__before">
        <div className="compare-slider__image">
          {!item.placeholder && !imageFailed.before && item.antes && (
            <img
              src={item.antes}
              alt={`${item.alt} Antes.`}
              width={item.largura}
              height={item.altura}
              loading="lazy"
              decoding="async"
              draggable="false"
              onError={() => markImageFailed('before')}
            />
          )}
          {(item.placeholder || imageFailed.before || !item.antes) && (
            <PlaceholderPhoto label="Antes" />
          )}
        </div>
      </div>
      <div className="compare-slider__labels" aria-hidden="true">
        <span>Antes</span>
        <span>Depois</span>
      </div>
      <span className="compare-slider__line" aria-hidden="true" />
      <div
        className="compare-slider__grip"
        role="slider"
        tabIndex={0}
        aria-label={`Comparar antes e depois: ${item.titulo}`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`Divisor em ${Math.round(position)} por cento`}
        onKeyDown={handleKeyDown}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
        </svg>
      </div>
      {hintVisible && (
        <span className="compare-slider__hint" aria-hidden="true">
          ‹ arraste ›
        </span>
      )}
      <span id={`${item.id}-compare-help`} className="sr-only">
        Arraste para comparar. Use as setas do teclado para mover o divisor, Shift mais seta
        para passos maiores, Home para o início e End para o fim.
      </span>
    </div>
  );
}
