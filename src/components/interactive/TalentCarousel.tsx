import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { site } from '../../config/site';
import type { TalentProfile } from '../../config/team-talent';

interface Props {
  items: TalentProfile[];
}

const linkedinPath =
  'M6.9 8.5H4V20h2.9V8.5zM5.4 3.5A1.7 1.7 0 1 0 5.4 6.9 1.7 1.7 0 0 0 5.4 3.5zM20.5 20h-2.9v-5.7c0-1.6-.6-2.7-2.1-2.7-1.1 0-1.7.8-2 1.5-.1.3-.1.7-.1 1.1V20H10.5s0-9.4 0-10.4H13.4v1.5c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.2 1.6 4.2 5.1V20z';

const iconBtnClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-highlight/28 bg-highlight/10 text-highlight transition hover:border-highlight/55 hover:bg-highlight/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight';

const generalLinkedIn = site.socials.find((item) => item.icon === 'linkedin')?.href ?? 'https://www.linkedin.com/';
const generalEmail = `mailto:${site.email}`;

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export default function TalentCarousel({ items }: Props) {
  const labelId = useId();
  const statusId = useId();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => wrapIndex(current + direction, count));
    },
    [count],
  );

  const goTo = useCallback(
    (next: number) => {
      setIndex(wrapIndex(next, count));
    },
    [count],
  );

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

  const profile = items[index];
  if (!profile) return null;

  const isPlaceholderName = profile.name.toLowerCase().includes('pending');

  const navBtnClass =
    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight sm:h-11 sm:w-11';

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_20%,rgb(222_243_77_/0.08),transparent_55%)] sm:-inset-4"
        aria-hidden="true"
      />

      <div
        ref={regionRef}
        className="relative flex min-h-0 flex-1 flex-col outline-none focus-visible:rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
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
          Team talent carousel. Use arrow keys or the previous and next buttons to browse profiles.
        </p>
        <p id={statusId} className="sr-only" aria-live="polite">
          Showing profile {index + 1} of {count}: {profile.role}
        </p>

        <article
          key={profile.id}
          className={`group relative flex min-h-[20rem] flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgb(0_0_0_/0.28)] transition duration-300 hover:border-highlight/45 hover:bg-white/[0.05] sm:min-h-[22rem] sm:rounded-[1.75rem] lg:min-h-0 ${
            reducedMotion ? '' : 'talent-slide'
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/12 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-highlight/10 blur-3xl transition duration-500 group-hover:bg-highlight/16"
            aria-hidden="true"
          />

          <div className="relative min-h-[11rem] flex-[1.15] overflow-hidden bg-surface sm:min-h-[12.5rem]">
            <img
              src={profile.image}
              alt=""
              width={640}
              height={520}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D120C]/85 via-[#0D120C]/25 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute top-3 left-3 inline-flex max-w-[75%] truncate items-center rounded-full border border-highlight/35 bg-[#0D120C]/75 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-highlight uppercase backdrop-blur-sm sm:top-4 sm:left-4">
              {profile.role}
            </span>
            <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0D120C]/7 text-[0.7rem] font-semibold tracking-[0.1em] text-white/80 backdrop-blur-sm sm:top-4 sm:right-4 sm:h-10 sm:w-10">
              {profile.initials}
            </span>
          </div>

          <div className="relative shrink-0 px-4 py-4 sm:px-5 sm:py-5">
            <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              {profile.name}
              {isPlaceholderName && (
                <span className="sr-only"> — replace with verified name in team-talent config</span>
              )}
            </h3>
            <p className="mt-1 text-sm font-medium text-highlight">{profile.role}</p>

            <div className="mt-3.5 flex items-center gap-2.5">
              <a
                href={generalLinkedIn}
                className={iconBtnClass}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VectorCodex on LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                  <path d={linkedinPath} />
                </svg>
              </a>
              <a href={generalEmail} className={iconBtnClass} aria-label={`Email ${site.email}`}>
                <Mail size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <div className="relative mt-4 flex shrink-0 flex-wrap items-center gap-3 sm:mt-5">
        <div className="flex items-center gap-2">
          <button type="button" className={navBtnClass} aria-label="Previous team profile" onClick={() => go(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className={navBtnClass} aria-label="Next team profile" onClick={() => go(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs tracking-[0.14em] text-white/45 uppercase" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>

        <div
          className="ml-auto flex flex-wrap items-center justify-end gap-1.5"
          role="tablist"
          aria-label="Team profiles"
        >
          {items.map((item, dotIndex) => {
            const active = dotIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show ${item.role}`}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${
                  active ? 'w-6 bg-highlight' : 'w-2 bg-white/25 hover:bg-white/45'
                }`}
                onClick={() => goTo(dotIndex)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
