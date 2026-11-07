import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CaseStudy } from '../../types/content';
import { buttonClass } from '../ui/styles';

interface Props {
  items: CaseStudy[];
}

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export default function CaseStudyCarousel({ items }: Props) {
  const labelId = useId();
  const statusId = useId();
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => wrapIndex(current + direction, count));
    },
    [count],
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

  const study = items[index];
  if (!study) return null;

  const results = (study.results ?? []).filter((result) => !result.placeholder).slice(0, 3);

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
        <button
          type="button"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight sm:inline-flex"
          aria-label="Previous case study"
          onClick={() => go(-1)}
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
            Case studies carousel. Use arrow keys or the previous and next buttons to browse.
          </p>
          <p id={statusId} className="sr-only" aria-live="polite">
            Showing case study {index + 1} of {count}: {study.title}
          </p>

          <article className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgb(0_0_0_/0.28)] sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-highlight/10 via-transparent to-transparent" aria-hidden="true" />

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-2xl font-semibold tracking-tight text-highlight sm:text-3xl">
                    {study.service}
                  </p>
                  {study.placeholder && (
                    <span className="rounded-full border border-highlight/40 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-highlight uppercase">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {study.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                  {study.summary}
                </p>
                <a
                  href={study.path}
                  className={`${buttonClass.base} ${buttonClass.gradient} mt-6 w-full shadow-[0_12px_40px_rgb(197_246_61_/0.18)] sm:w-auto`}
                >
                  Read Case Study
                </a>
              </div>

              <div className="relative">
                <div className="aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-surface">
                  {study.image ? (
                    <img
                      src={study.image.src}
                      alt={study.image.alt}
                      width={study.image.width ?? 1200}
                      height={study.image.height ?? 825}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end bg-gradient-to-br from-highlight/15 via-transparent to-transparent p-5">
                      <span className="text-sm font-semibold text-highlight">Case study</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {results.length > 0 && (
              <div className="relative z-10 mt-6 lg:-mt-10 lg:mr-auto lg:max-w-xl">
                <div className="rounded-2xl border border-white/12 bg-[#121912]/95 p-4 shadow-[0_20px_50px_rgb(0_0_0_/0.45)] backdrop-blur-md sm:p-5">
                  <p className="text-center text-[0.65rem] font-semibold tracking-[0.16em] text-white/50 uppercase">
                    Client Results
                  </p>
                  <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
                    {results.map((result, resultIndex) => (
                      <div
                        key={`${study.slug}-result-${resultIndex}`}
                        className={[
                          'text-center sm:px-3',
                          resultIndex > 0 ? 'border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pt-0' : '',
                        ].join(' ')}
                      >
                        <dt className="sr-only">{result.label}</dt>
                        <dd>
                          <p className="font-display text-2xl font-semibold tracking-tight text-highlight sm:text-[1.65rem]">
                            {result.value}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">{result.label}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </article>
        </div>

        <button
          type="button"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight sm:inline-flex"
          aria-label="Next case study"
          onClick={() => go(1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
          aria-label="Previous case study"
          onClick={() => go(-1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Case study slides">
          {items.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show case study ${itemIndex + 1} of ${count}`}
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
          aria-label="Next case study"
          onClick={() => go(1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 hidden justify-center gap-2 sm:flex" role="tablist" aria-label="Case study slides">
        {items.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <button
              key={`dot-${item.slug}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show case study ${itemIndex + 1} of ${count}`}
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
    </div>
  );
}
