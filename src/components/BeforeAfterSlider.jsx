import { useEffect, useRef, useState } from 'react';

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

  return (
    <div className="comparison-board">
      {!imageFailed ? (
        <img
          src={item.imagem}
          alt={item.alt}
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
  const timersRef = useRef([]);
  const animatedRef = useRef(false);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [imageFailed, setImageFailed] = useState({ before: false, after: false });

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
    let nextPosition = position;
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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !('IntersectionObserver' in window) || animatedRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;
        const sequence = [
          [35, 360],
          [65, 360],
          [50, 360],
        ];
        let delay = 80;
        sequence.forEach(([nextPosition, duration]) => {
          timersRef.current.push(
            window.setTimeout(() => updatePosition(nextPosition), delay),
          );
          delay += duration;
        });
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(animationFrameRef.current);
      timersRef.current.forEach(window.clearTimeout);
    },
    [],
  );

  const markImageFailed = (side) => {
    setImageFailed((previous) => ({ ...previous, [side]: true }));
  };

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
