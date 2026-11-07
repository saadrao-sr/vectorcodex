import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  Code2,
  Megaphone,
  Search,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { megaMenuCategories, megaMenuFeatured, type MegaMenuCategory } from '../../config/mega-menu';
import { isActivePath, isExactPath } from '../../lib/seo/url';
import { buttonClass } from '../ui/styles';

interface Props {
  currentPath: string;
}

const icons: Record<MegaMenuCategory['icon'], LucideIcon> = {
  search: Search,
  code: Code2,
  share: Share2,
  megaphone: Megaphone,
};

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

export default function ServicesMegaMenu({ currentPath }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelTop, setPanelTop] = useState(80);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const panelId = useId();
  const labelId = useId();
  const servicesActive = isActivePath(currentPath, '/services/');
  const triggerActive = open || servicesActive;

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
        rootRef.current?.querySelector<HTMLElement>('a[aria-haspopup]')?.focus();
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
            <div className="mx-auto w-full max-w-[90rem] overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#0D120C] shadow-[0_32px_90px_rgb(0_0_0_/0.55)]">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-highlight/45 to-transparent" />
                <div className="absolute top-0 right-[12%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(222_243_77_/0.14),transparent_70%)] blur-2xl" />
                <div className="absolute bottom-0 left-[8%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(197_246_61_/0.08),transparent_70%)] blur-2xl" />
              </div>

              <p id={labelId} className="sr-only">
                Services mega menu
              </p>

              <div className="relative grid xl:grid-cols-[minmax(0,1fr)_17.5rem]">
                <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
                  {megaMenuCategories.map((category) => {
                    const Icon = icons[category.icon];
                    const categoryActive = isActivePath(currentPath, category.href);
                    return (
                      <section
                        key={category.id}
                        className="flex min-h-0 flex-col bg-[#0D120C] p-4 lg:p-5"
                        aria-labelledby={`${panelId}-${category.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-highlight/30 bg-highlight/10 text-highlight shadow-[0_0_24px_rgb(222_243_77_/0.12)]">
                            <Icon size={17} aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-[0.65rem] font-semibold tracking-[0.16em] text-highlight">
                              {category.number}
                            </p>
                            <h3
                              id={`${panelId}-${category.id}`}
                              className={`mt-1 font-display text-[0.95rem] leading-tight font-semibold tracking-tight ${
                                categoryActive ? 'text-highlight' : 'text-white'
                              }`}
                            >
                              <a href={category.href} className="transition hover:text-highlight" onClick={closeMenu}>
                                {category.title}
                              </a>
                            </h3>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-white/50">{category.description}</p>

                        {category.links.length > 0 ? (
                          <ul className="mt-4 flex flex-1 flex-col gap-0.5 border-t border-white/10 pt-3">
                            {category.links.map((link) => {
                              const active = isExactPath(currentPath, link.href);
                              return (
                                <li key={`${category.id}-${link.label}`}>
                                  <a
                                    href={link.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`group flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-[0.8125rem] transition ${
                                      active
                                        ? 'bg-highlight/10 text-highlight'
                                        : 'text-white/75 hover:bg-white/[0.04] hover:text-highlight'
                                    }`}
                                    onClick={closeMenu}
                                  >
                                    <span className="leading-snug">{link.label}</span>
                                    <ArrowUpRight
                                      size={13}
                                      aria-hidden="true"
                                      className="shrink-0 text-white/15 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-highlight group-hover:opacity-100"
                                    />
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </section>
                    );
                  })}
                </div>

                <aside className="relative flex flex-col justify-between overflow-hidden border-t border-white/10 bg-gradient-to-b from-highlight/[0.14] via-[#121812] to-[#0D120C] p-5 lg:p-6 xl:border-t-0 xl:border-l xl:border-white/10">
                  <div
                    className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-highlight/20 blur-3xl"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute right-4 bottom-8 h-20 w-20 rotate-12 rounded-[1.25rem] border border-highlight/20 bg-highlight/5"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">
                      {megaMenuFeatured.label}
                    </p>
                    <h3 className="mt-3 font-display text-xl leading-snug font-semibold tracking-tight text-balance text-white">
                      {megaMenuFeatured.heading}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">{megaMenuFeatured.text}</p>
                  </div>
                  <a
                    href={megaMenuFeatured.ctaHref}
                    className={`${buttonClass.base} ${buttonClass.gradient} relative mt-6 w-full shadow-[0_12px_36px_rgb(197_246_61_/0.18)]`}
                    onClick={closeMenu}
                  >
                    {megaMenuFeatured.ctaLabel}
                    <ArrowUpRight size={15} aria-hidden="true" />
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
        <a
          href="/services/"
          className={`inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full px-3.5 text-[0.8125rem] font-medium whitespace-nowrap transition ${
            triggerActive
              ? 'bg-white text-[#0D120C]'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={open ? panelId : undefined}
          aria-current={servicesActive ? 'page' : undefined}
          onFocus={openMenu}
          onClick={closeMenu}
        >
          <span>Services</span>
          <ChevronDown
            aria-hidden="true"
            size={14}
            className={`shrink-0 transition duration-300 ${open ? 'rotate-180' : ''} ${
              triggerActive ? 'text-[#0D120C]' : 'text-current'
            }`}
          />
        </a>
        {panel}
      </div>
    </LazyMotion>
  );
}
