import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { TalentProfile } from '../../config/team-talent';

interface Props {
  items: TalentProfile[];
}

const linkedinPath =
  'M6.9 8.5H4V20h2.9V8.5zM5.4 3.5A1.7 1.7 0 1 0 5.4 6.9 1.7 1.7 0 0 0 5.4 3.5zM20.5 20h-2.9v-5.7c0-1.6-.6-2.7-2.1-2.7-1.1 0-1.7.8-2 1.5-.1.3-.1.7-.1 1.1V20H10.5s0-9.4 0-10.4H13.4v1.5c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.2 1.6 4.2 5.1V20z';

const iconBtnClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-highlight/28 bg-highlight/10 text-highlight transition hover:border-highlight/55 hover:bg-highlight/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight';

const iconBtnPendingClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-highlight/20 bg-highlight/[0.07] text-highlight/70';

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function ContactIcon({
  href,
  label,
  pendingLabel,
  children,
}: {
  href: string | null;
  label: string;
  pendingLabel: string;
  children: ReactNode;
}) {
  const value = href?.trim() || null;
  if (value) {
    return (
      <a
        href={value.startsWith('mailto:') || value.startsWith('http') ? value : value.includes('@') ? `mailto:${value}` : value}
        className={iconBtnClass}
        target={value.startsWith('http') ? '_blank' : undefined}
        rel={value.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-label={label}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={iconBtnPendingClass} title={pendingLabel} aria-label={pendingLabel}>
      {children}
    </span>
  );
}

export default function AboutTeamCarousel({ items }: Props) {
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
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0D120C]/85 text-white shadow-[0_8px_22px_rgb(0_0_0_/0.35)] backdrop-blur-sm transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight sm:h-10 sm:w-10';

  return (
    <div className="relative mx-auto w-full max-w-[18.5rem] sm:max-w-[20rem]">
      <div
        ref={regionRef}
        className="relative outline-none focus-visible:rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
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
          Team profile carousel. Use arrow keys or the previous and next buttons to browse profiles.
        </p>
        <p id={statusId} className="sr-only" aria-live="polite">
          Showing profile {index + 1} of {count}: {profile.role}
        </p>

        <article
          key={profile.id}
          className={`group relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/[0.03] sm:rounded-[1.4rem] ${
            reducedMotion ? '' : 'about-team-slide'
          }`}
        >
          <div className="relative aspect-[4/4.15] overflow-hidden bg-surface">
            <img
              src={profile.image}
              alt=""
              width={480}
              height={500}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D120C] via-[#0D120C]/45 to-transparent"
              aria-hidden="true"
            />

            <span className="absolute top-2.5 left-2.5 inline-flex max-w-[70%] truncate items-center rounded-full border border-highlight/35 bg-[#0D120C]/75 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] text-highlight uppercase backdrop-blur-sm">
              {profile.role}
            </span>
            <span className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#0D120C]/7 text-[0.65rem] font-semibold tracking-[0.1em] text-white/80 backdrop-blur-sm">
              {profile.initials}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
              <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                {profile.name}
                {isPlaceholderName && (
                  <span className="sr-only"> — replace with verified name in team-talent config</span>
                )}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-5 text-white/68">{profile.expertise}</p>

              <div className="mt-3 flex items-center gap-2">
                <ContactIcon
                  href={profile.linkedin}
                  label={`${profile.name} on LinkedIn`}
                  pendingLabel="LinkedIn link pending — add in team-talent config"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                    <path d={linkedinPath} />
                  </svg>
                </ContactIcon>
                <ContactIcon
                  href={profile.email ? `mailto:${profile.email}` : null}
                  label={`Email ${profile.name}`}
                  pendingLabel="Email pending — add in team-talent config"
                >
                  <Mail size={14} aria-hidden="true" />
                </ContactIcon>
              </div>
            </div>
          </div>
        </article>

        <div className="pointer-events-none absolute inset-y-0 -left-1 -right-1 z-10 flex items-center justify-between sm:-left-2 sm:-right-2">
          <button
            type="button"
            className={`pointer-events-auto ${navBtnClass}`}
            aria-label="Previous team profile"
            onClick={() => go(-1)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`pointer-events-auto ${navBtnClass}`}
            aria-label="Next team profile"
            onClick={() => go(1)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 sm:mt-3.5">
        <p className="text-[0.65rem] tracking-[0.14em] text-white/45 uppercase" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5" role="tablist" aria-label="Team profiles">
          {items.map((item, dotIndex) => {
            const active = dotIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show ${item.role}`}
                className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${
                  active ? 'w-5 bg-highlight' : 'w-1.5 bg-white/25 hover:bg-white/45'
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
