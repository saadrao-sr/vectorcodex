import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Testimonial } from '../../config/testimonials';

interface Props {
  items: Testimonial[];
}

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return reduced;
}

function useDesktopCarousel() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return desktop;
}

function Avatar({ item }: { item: Testimonial }) {
  if (item.logoSrc) {
    return (
      <img
        src={item.logoSrc}
        alt={item.logoAlt ?? `${item.company} logo`}
        width={44}
        height={44}
        className="h-11 w-11 rounded-full border border-white/15 object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-highlight/30 bg-highlight/10 font-display text-sm font-semibold text-highlight"
      aria-hidden="true"
    >
      {item.initials}
    </span>
  );
}

function TestimonialCard({
  item,
  featured = false,
  reducedMotion = false,
}: {
  item: Testimonial;
  featured?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <article
      className={[
        'group relative flex h-full min-h-[18.5rem] flex-col overflow-hidden rounded-[1.75rem] border bg-white/[0.03] p-5 sm:p-6',
        reducedMotion ? '' : 'transition duration-300',
        featured
          ? 'border-highlight/45 bg-white/[0.05] shadow-[0_20px_60px_rgb(0_0_0_/0.35),0_0_40px_rgb(222_243_77_/0.08)] lg:scale-[1.03]'
          : 'border-white/10 hover:border-highlight/40 hover:bg-white/[0.05]',
        !reducedMotion && featured ? 'lg:transition-transform' : '',
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90',
          reducedMotion ? '' : 'transition duration-300 group-hover:opacity-100',
          featured ? 'from-highlight/18 via-transparent to-transparent' : 'from-lime/12 via-transparent to-transparent',
        ].join(' ')}
        aria-hidden="true"
      />
      <div
        className={[
          'pointer-events-none absolute -top-14 -right-12 h-32 w-32 rounded-full bg-highlight/10 blur-3xl',
          reducedMotion ? '' : 'transition duration-500 group-hover:bg-highlight/16',
        ].join(' ')}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <Quote
          size={28}
          className={featured ? 'text-highlight' : 'text-highlight/70'}
          aria-hidden="true"
        />
        {item.placeholder && (
          <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-white/55 uppercase">
            Placeholder
          </span>
        )}
      </div>

      <blockquote className="relative mt-5 flex-1">
        <p
          className={[
            'leading-7 text-white/80',
            featured ? 'text-base sm:text-[1.05rem] sm:leading-8' : 'text-sm sm:text-[0.95rem]',
          ].join(' ')}
        >
          {item.quote}
        </p>
      </blockquote>

      <footer className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <Avatar item={item} />
        <div className="min-w-0 text-left">
          <cite className="block font-display text-base font-semibold not-italic tracking-tight text-white">
            {item.name}
          </cite>
          <p className="mt-0.5 truncate text-sm text-white/60">
            {item.role}
            <span className="text-white/35"> · </span>
            {item.company}
          </p>
        </div>
      </footer>
    </article>
  );
}

export default function TestimonialsCarousel({ items }: Props) {
  const labelId = useId();
  const statusId = useId();
  const desktop = useDesktopCarousel();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const visibleCount = desktop ? Math.min(3, count) : 1;

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => wrapIndex(current + direction, count));
    },
    [count],
  );

  const visibleIndexes =
    visibleCount === 1
      ? [index]
      : Array.from({ length: visibleCount }, (_, offset) =>
          wrapIndex(index - Math.floor(visibleCount / 2) + offset, count),
        );

  useEffect(() => {
    const node = regionRef.current;
    if (!node) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [go]);

  if (count === 0) return null;

  const activeItem = items[index];

  return (
    <div className="mt-8 sm:mt-10">
      <div
        ref={regionRef}
        className="outline-none focus-visible:rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        aria-describedby={statusId}
        tabIndex={0}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start == null || end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < 48) return;
          go(delta < 0 ? 1 : -1);
        }}
      >
        <p id={labelId} className="sr-only">
          Client testimonials carousel. Use arrow keys or the previous and next buttons to browse.
        </p>
        <p id={statusId} className="sr-only" aria-live="polite">
          Showing testimonial {index + 1} of {count}
          {activeItem ? `: ${activeItem.name}, ${activeItem.company}` : ''}
        </p>

        <div className={['grid gap-4 lg:gap-5', visibleCount === 3 ? 'lg:grid-cols-3' : 'grid-cols-1'].join(' ')}>
          {visibleIndexes.map((itemIndex, position) => {
            const item = items[itemIndex];
            if (!item) return null;
            const featured = visibleCount === 3 ? position === 1 : true;
            return (
              <div key={`${item.id}-${itemIndex}-${position}`}>
                <TestimonialCard item={item} featured={featured} reducedMotion={reducedMotion} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
          {items.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show testimonial ${itemIndex + 1} of ${count}`}
                className={[
                  'h-2.5 rounded-full transition-[width,background-color,border-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight',
                  active
                    ? 'w-8 border border-highlight/50 bg-highlight'
                    : 'w-2.5 border border-white/20 bg-white/20 hover:border-highlight/40 hover:bg-highlight/40',
                ].join(' ')}
                onClick={() => setIndex(itemIndex)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
          aria-label="Next testimonial"
          onClick={() => go(1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
