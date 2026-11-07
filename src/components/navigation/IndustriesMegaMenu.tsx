import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { industriesMegaLinks, industriesMegaProof } from '../../config/industries-mega-menu';
import { isActivePath } from '../../lib/seo/url';
import { buttonClass } from '../ui/styles';

interface Props {
  currentPath: string;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function IndustriesMegaMenu({ currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelTop, setPanelTop] = useState(80);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const panelId = useId();
  const labelId = useId();
  const industriesActive = isActivePath(currentPath, '/industries/');
  const triggerActive = open || industriesActive;

  function clearCloseTimer() {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearCloseTimer();
    setOpen(true);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  }

  function closeMenu() {
    clearCloseTimer();
    setOpen(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const trigger = rootRef.current?.getBoundingClientRect();
      if (!trigger) return;
      setPanelTop(Math.round(trigger.bottom + 12));
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        rootRef.current?.querySelector<HTMLElement>('button[aria-haspopup]')?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      closeMenu();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  const panel =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id={panelId}
            role="region"
            aria-labelledby={labelId}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 z-[60] hidden lg:block xl:inset-x-6"
            style={{ top: panelTop }}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <div className="relative mx-auto w-full max-w-[72rem] overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0D120C] shadow-[0_32px_90px_rgb(0_0_0_/0.55)]">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-highlight/45 to-transparent" />
                <div className="absolute top-0 left-[18%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgb(222_243_77_/0.12),transparent_70%)] blur-2xl" />
                <div className="absolute right-[8%] bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(197_246_61_/0.08),transparent_70%)] blur-2xl" />
              </div>

              <p id={labelId} className="sr-only">
                Industries mega menu
              </p>

              <div className="relative grid lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
                <div className="p-5 sm:p-6 lg:p-7">
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">
                    Industries We Serve
                  </p>
                  <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                    {industriesMegaLinks.map((item) => (
                      <li key={item.id} className="border-b border-white/10">
                        <a
                          href={item.href}
                          className="group flex min-h-12 items-center gap-3 py-3 text-[0.95rem] font-medium text-white/85 transition hover:text-highlight"
                          onClick={closeMenu}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-highlight shadow-[0_0_12px_rgb(222_243_77_/0.55)] transition group-hover:scale-125"
                            aria-hidden="true"
                          />
                          <span className="flex-1 leading-snug">{item.label}</span>
                          <ChevronRight
                            size={15}
                            aria-hidden="true"
                            className="shrink-0 text-white/25 transition duration-300 group-hover:translate-x-0.5 group-hover:text-highlight"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="relative flex flex-col justify-between overflow-hidden border-t border-white/10 bg-gradient-to-b from-highlight/[0.1] via-[#121812] to-[#0D120C] p-5 sm:p-6 lg:border-t-0 lg:border-l lg:border-white/10 lg:p-7">
                  <div
                    className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-highlight/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <h3 className="font-display text-xl leading-snug font-semibold tracking-tight text-balance text-white sm:text-[1.35rem]">
                      <span className="text-highlight">{industriesMegaProof.heading}</span>
                      <br />
                      <span className="text-white/85">{industriesMegaProof.subheading}</span>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{industriesMegaProof.text}</p>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0D120C]/55">
                      <ul className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-2">
                        {industriesMegaProof.logos.map((logo) => (
                          <li
                            key={logo.src}
                            className="flex min-h-[4.25rem] items-center justify-center px-3 py-3 sm:min-h-[4.75rem]"
                          >
                            <img
                              src={logo.src}
                              alt={logo.alt}
                              width={logo.width}
                              height={logo.height}
                              loading="lazy"
                              decoding="async"
                              className="h-7 w-auto max-w-[6.5rem] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-8 sm:max-w-[7.5rem]"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={industriesMegaProof.ctaHref}
                    className={`${buttonClass.base} ${buttonClass.ghost} relative mt-5 w-full`}
                    onClick={closeMenu}
                  >
                    {industriesMegaProof.ctaLabel}
                    <ChevronRight size={15} aria-hidden="true" />
                  </a>
                </aside>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <LazyMotion features={domAnimation}>
      <div ref={rootRef} className="relative hidden lg:block" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
        <div
          className={`inline-flex min-h-9 items-center rounded-full transition ${
            triggerActive
              ? 'bg-white text-[#0D120C]'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <a
            href="/industries/"
            className="inline-flex min-h-9 cursor-pointer items-center rounded-full py-0 pl-3.5 pr-1 text-[0.8125rem] font-medium whitespace-nowrap"
            aria-current={industriesActive ? 'page' : undefined}
            onFocus={openMenu}
          >
            Industries
          </a>
          <button
            type="button"
            className="inline-flex min-h-9 items-center rounded-full py-0 pr-3 pl-0.5"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls={open ? panelId : undefined}
            aria-label={open ? 'Close industries menu' : 'Open industries menu'}
            onClick={() => {
              clearCloseTimer();
              setOpen((value) => !value);
            }}
          >
            <ChevronDown
              aria-hidden="true"
              size={14}
              className={`shrink-0 transition duration-300 ${open ? 'rotate-180' : ''} ${
                triggerActive ? 'text-[#0D120C]' : 'text-current'
              }`}
            />
          </button>
        </div>
        {panel}
      </div>
    </LazyMotion>
  );
}
