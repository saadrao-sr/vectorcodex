import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type InsightSlide = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  publishedLabel: string;
  category?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  href?: string;
};

interface Props {
  items: InsightSlide[];
}

function usePerView() {
  const [perView, setPerView] = useState(2);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setPerView(media.matches ? 2 : 1);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return perView;
}

const navBtnClass =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:bg-white/[0.04] disabled:hover:text-white';

const cardClass =
  'group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-highlight/45 hover:bg-white/[0.05]';

function InsightCard({ item }: { item: InsightSlide }) {
  const cta = item.href ? 'Read Article' : 'Coming Soon';
  const body = (
    <>
      <div className="relative aspect-[2/1] overflow-hidden bg-surface">
        {item.image ? (
          <img
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width ?? 1200}
            height={item.image.height ?? 750}
            loading="lazy"
            decoding="async"
            className={
              item.href
                ? 'h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
                : 'h-full w-full object-cover'
            }
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-br from-highlight/15 via-transparent to-transparent p-4">
            <span className="text-sm font-semibold text-highlight">Article</span>
          </div>
        )}
        {item.publishedLabel ? (
          <time
            dateTime={item.publishedAt}
            className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-[#0D120C]/82 px-2.5 py-1.5 text-[0.7rem] font-semibold tracking-tight text-white backdrop-blur-sm"
          >
            {item.publishedLabel}
          </time>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.category ? (
          <span className="inline-flex w-fit rounded-full border border-highlight/30 bg-highlight/10 px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.14em] text-highlight uppercase">
            {item.category}
          </span>
        ) : null}
        <h3
          className={
            item.href
              ? 'mt-2.5 font-display text-lg leading-snug font-semibold tracking-tight text-white transition group-hover:text-highlight sm:text-xl'
              : 'mt-2.5 font-display text-lg leading-snug font-semibold tracking-tight text-white sm:text-xl'
          }
        >
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{item.excerpt}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-highlight">
          {cta}
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className={
              item.href
                ? 'transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                : undefined
            }
          />
        </span>
      </div>
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} className={cardClass}>
        {body}
      </a>
    );
  }

  return <div className={cardClass}>{body}</div>;
}

export default function InsightsCarousel({ items }: Props) {
  const labelId = useId();
  const statusId = useId();
  const perView = usePerView();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const count = items.length;
  const maxIndex = Math.max(0, count - perView);
  const pageCount = maxIndex + 1;

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => {
        const next = current + direction;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [maxIndex],
  );

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

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

  const visible = items.slice(index, index + perView);
  const statusTitles = visible.map((item) => item.title).join(', ');
  const gapPx = 24;
  const slideBasis = `calc((100% - ${(perView - 1) * gapPx}px) / ${perView})`;

  return (
    <div className="mt-5 sm:mt-6">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <button
          type="button"
          className={`${navBtnClass} hidden sm:inline-flex`}
          aria-label="Previous insights"
          onClick={() => go(-1)}
          disabled={count <= perView}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div
          ref={regionRef}
          className="min-w-0 flex-1 outline-none focus-visible:rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
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
            Insights carousel. Use arrow keys or the previous and next buttons to browse articles.
          </p>
          <p id={statusId} className="sr-only" aria-live="polite">
            Showing {statusTitles}. Slide {index + 1} of {pageCount}.
          </p>

          <div className="overflow-hidden">
            <ul
              className="flex"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${index} * (${slideBasis} + ${gapPx}px)))`,
                transition: reducedMotion ? undefined : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {items.map((item, itemIndex) => {
                const inView = itemIndex >= index && itemIndex < index + perView;
                return (
                  <li
                    key={item.id}
                    className="min-w-0 shrink-0"
                    style={{ flexBasis: slideBasis, width: slideBasis }}
                    aria-hidden={!inView}
                  >
                    <InsightCard item={item} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <button
          type="button"
          className={`${navBtnClass} hidden sm:inline-flex`}
          aria-label="Next insights"
          onClick={() => go(1)}
          disabled={count <= perView}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
        <button
          type="button"
          className={`${navBtnClass} sm:hidden`}
          aria-label="Previous insights"
          onClick={() => go(-1)}
          disabled={count <= perView}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Insight slides">
          {Array.from({ length: pageCount }, (_, pageIndex) => {
            const active = pageIndex === index;
            return (
              <button
                key={`insight-dot-${pageIndex}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show insight set ${pageIndex + 1} of ${pageCount}`}
                className={[
                  'h-2.5 rounded-full transition-[width,background-color,border-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight',
                  active
                    ? 'w-8 border border-highlight/50 bg-highlight'
                    : 'w-2.5 border border-white/20 bg-white/20 hover:border-highlight/40 hover:bg-highlight/40',
                ].join(' ')}
                onClick={() => setIndex(pageIndex)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className={`${navBtnClass} sm:hidden`}
          aria-label="Next insights"
          onClick={() => go(1)}
          disabled={count <= perView}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
