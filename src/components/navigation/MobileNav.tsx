import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, Sparkles, X } from 'lucide-react';
import { industriesMegaLinks } from '../../config/industries-mega-menu';
import { megaMenuCategories } from '../../config/mega-menu';
import { site } from '../../config/site';
import type { NavLink } from '../../types/content';
import { buttonClass } from '../ui/styles';

interface SocialLink {
  label: string;
  href: string;
  icon: 'instagram' | 'facebook' | 'linkedin' | 'youtube';
}

interface Props {
  links: NavLink[];
  currentPath: string;
  socials?: SocialLink[];
}

const socialPaths = {
  instagram:
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6.8a1.1 1.1 0 1 1-1.1 1.1 1.1 0 0 1 1.1-1.1z',
  facebook: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3.1l.9-3H13v-1.5c0-.8.7-1.5 1.5-1.5z',
  linkedin:
    'M6.9 8.5H4V20h2.9V8.5zM5.4 3.5A1.7 1.7 0 1 0 5.4 6.9 1.7 1.7 0 0 0 5.4 3.5zM20.5 20h-2.9v-5.7c0-1.6-.6-2.7-2.1-2.7-1.1 0-1.7.8-2 1.5-.1.3-.1.7-.1 1.1V20H10.5s0-9.4 0-10.4H13.4v1.5c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.2 1.6 4.2 5.1V20z',
  youtube:
    'M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2C0 9.1 0 12 0 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.6 15.5v-7l6.4 3.5-6.4 3.5z',
} as const;

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

function isCurrent(currentPath: string, href: string) {
  if (href === '/') return currentPath === '/' || currentPath === '';
  if (href.startsWith('/#')) return currentPath === '/' || currentPath === '';
  const current = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  const target = href.endsWith('/') ? href : `${href}/`;
  return current === target || current.startsWith(target);
}

export default function MobileNav({ links, currentPath, socials = site.socials }: Props) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const titleId = useId();
  const servicesPanelId = useId();
  const industriesPanelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
    setServicesOpen(false);
    setIndustriesOpen(false);
    if (wasOpen.current) buttonRef.current?.focus();
    return undefined;
  }, [open]);

  const menu = mounted
    ? createPortal(
        <AnimatePresence>
          {open && (
            <m.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
              className="fixed inset-0 z-[110] flex flex-col overflow-hidden bg-[#070a07] lg:hidden"
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(222_243_77_/0.12),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgb(255_222_93_/0.08),transparent_45%)]" />
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.08) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                  }}
                />
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-highlight via-cta/70 to-transparent" />
                <div className="absolute top-24 right-6 h-28 w-28 rounded-full border border-highlight/20" />
                <div className="absolute top-32 right-14 h-12 w-12 rotate-12 rounded-xl border border-cta/25" />
              </div>

              <m.div
                className="relative flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 sm:px-6"
                initial={reduced ? false : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.28, delay: reduced ? 0 : 0.04 }}
              >
                <a
                  href="/"
                  className="inline-flex items-center rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2 shadow-[0_10px_30px_rgb(0_0_0_/0.25)] backdrop-blur-md"
                  aria-label="VectorCodex, home"
                  onClick={() => setOpen(false)}
                >
                  <img
                    src={site.logo.path}
                    alt=""
                    width={site.logo.width}
                    height={site.logo.height}
                    className="h-7 w-auto max-w-[9.5rem] object-contain object-left"
                  />
                </a>
                <h2 id={titleId} className="sr-only">
                  Mobile navigation
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] text-white transition hover:border-highlight/45 hover:bg-highlight/10 hover:text-highlight"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </m.div>

              <div className="relative px-4 pb-3 sm:px-6">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent px-4 py-3.5">
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">Navigate</p>
                  <p className="mt-1 font-display text-lg font-semibold tracking-tight text-white">
                    Explore VectorCodex
                  </p>
                </div>
              </div>

              <nav aria-label="Mobile" className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 sm:px-6">
                <ul className="flex flex-col gap-2 py-1">
                  {links.map((link, index) => {
                    const number = String(index + 1).padStart(2, '0');
                    const isServices = link.href === '/services/' || link.label === 'Services';
                    const isIndustries = link.href === '/industries/' || link.label === 'Industries';

                    if (isServices) {
                      const active = isCurrent(currentPath, '/services/');
                      return (
                        <m.li
                          key="mobile-services"
                          initial={reduced ? false : { opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: reduced ? 0 : 0.28,
                            delay: reduced ? 0 : 0.06 + index * 0.035,
                          }}
                        >
                          <button
                            type="button"
                            className={`group relative flex min-h-[3.35rem] w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-2.5 text-left transition duration-300 ${
                              active || servicesOpen
                                ? 'border-highlight/40 bg-highlight/10 shadow-[0_0_28px_rgb(222_243_77_/0.08)]'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]'
                            }`}
                            aria-expanded={servicesOpen}
                            aria-controls={servicesPanelId}
                            onClick={() => setServicesOpen((value) => !value)}
                          >
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-[0.7rem] font-semibold tracking-[0.08em] ${
                                active || servicesOpen
                                  ? 'border-highlight/40 bg-highlight/15 text-highlight'
                                  : 'border-white/12 bg-white/[0.04] text-white/45'
                              }`}
                            >
                              {number}
                            </span>
                            <span
                              className={`flex-1 font-display text-[1.45rem] leading-none font-semibold tracking-tight sm:text-[1.6rem] ${
                                active || servicesOpen ? 'text-highlight' : 'text-white'
                              }`}
                            >
                              Services
                            </span>
                            <ChevronDown
                              size={18}
                              aria-hidden="true"
                              className={`shrink-0 transition duration-300 ${
                                servicesOpen ? 'rotate-180 text-highlight' : 'text-white/35'
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {servicesOpen && (
                              <m.div
                                id={servicesPanelId}
                                initial={reduced ? false : { height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.22 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 space-y-4 rounded-[1.35rem] border border-white/10 bg-[#0D120C]/80 px-3 py-4 backdrop-blur-sm sm:px-4">
                                  {megaMenuCategories.map((category) => (
                                    <div key={category.id}>
                                      <a
                                        href={category.href}
                                        className="flex items-center justify-between gap-2 font-display text-sm font-semibold tracking-tight text-highlight"
                                        onClick={() => setOpen(false)}
                                      >
                                        <span>
                                          {category.number} · {category.title}
                                        </span>
                                        <ArrowUpRight size={14} aria-hidden="true" />
                                      </a>
                                      {category.links.length > 0 ? (
                                        <ul className="mt-2 space-y-1 border-t border-white/8 pt-2">
                                          {category.links.map((item) => (
                                            <li key={`${category.id}-${item.label}`}>
                                              <a
                                                href={item.href}
                                                className="block rounded-lg px-2 py-2 text-sm text-white/70 transition hover:bg-white/[0.04] hover:text-highlight"
                                                onClick={() => setOpen(false)}
                                              >
                                                {item.label}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : null}
                                    </div>
                                  ))}
                                  <a
                                    href="/services/"
                                    className={`${buttonClass.base} ${buttonClass.ghost} w-full`}
                                    onClick={() => setOpen(false)}
                                  >
                                    Explore All Services
                                  </a>
                                </div>
                              </m.div>
                            )}
                          </AnimatePresence>
                        </m.li>
                      );
                    }

                    if (isIndustries) {
                      const active = isCurrent(currentPath, '/industries/');
                      return (
                        <m.li
                          key="mobile-industries"
                          initial={reduced ? false : { opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: reduced ? 0 : 0.28,
                            delay: reduced ? 0 : 0.06 + index * 0.035,
                          }}
                        >
                          <button
                            type="button"
                            className={`group relative flex min-h-[3.35rem] w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-2.5 text-left transition duration-300 ${
                              active || industriesOpen
                                ? 'border-highlight/40 bg-highlight/10 shadow-[0_0_28px_rgb(222_243_77_/0.08)]'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]'
                            }`}
                            aria-expanded={industriesOpen}
                            aria-controls={industriesPanelId}
                            onClick={() => setIndustriesOpen((value) => !value)}
                          >
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-[0.7rem] font-semibold tracking-[0.08em] ${
                                active || industriesOpen
                                  ? 'border-highlight/40 bg-highlight/15 text-highlight'
                                  : 'border-white/12 bg-white/[0.04] text-white/45'
                              }`}
                            >
                              {number}
                            </span>
                            <span
                              className={`flex-1 font-display text-[1.45rem] leading-none font-semibold tracking-tight sm:text-[1.6rem] ${
                                active || industriesOpen ? 'text-highlight' : 'text-white'
                              }`}
                            >
                              Industries
                            </span>
                            <ChevronDown
                              size={18}
                              aria-hidden="true"
                              className={`shrink-0 transition duration-300 ${
                                industriesOpen ? 'rotate-180 text-highlight' : 'text-white/35'
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {industriesOpen && (
                              <m.div
                                id={industriesPanelId}
                                initial={reduced ? false : { height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.22 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 space-y-1 rounded-[1.35rem] border border-white/10 bg-[#0D120C]/80 px-3 py-3 backdrop-blur-sm sm:px-4">
                                  {industriesMegaLinks.map((item) => (
                                    <a
                                      key={item.id}
                                      href={item.href}
                                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-white/75 transition hover:bg-white/[0.04] hover:text-highlight"
                                      onClick={() => setOpen(false)}
                                    >
                                      <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-highlight shadow-[0_0_10px_rgb(222_243_77_/0.45)]"
                                        aria-hidden="true"
                                      />
                                      <span className="flex-1">{item.label}</span>
                                      <ArrowUpRight size={13} aria-hidden="true" className="text-white/20" />
                                    </a>
                                  ))}
                                  <a
                                    href="/industries/"
                                    className={`${buttonClass.base} ${buttonClass.ghost} mt-2 w-full`}
                                    onClick={() => setOpen(false)}
                                  >
                                    View All Industries
                                  </a>
                                </div>
                              </m.div>
                            )}
                          </AnimatePresence>
                        </m.li>
                      );
                    }

                    const active = isCurrent(currentPath, link.href);
                    return (
                      <m.li
                        key={`${link.href}-${link.label}`}
                        initial={reduced ? false : { opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.28,
                          delay: reduced ? 0 : 0.06 + index * 0.035,
                        }}
                      >
                        <a
                          href={link.href}
                          aria-current={active ? 'page' : undefined}
                          className={`group relative flex min-h-[3.35rem] items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-2.5 transition duration-300 ${
                            active
                              ? 'border-highlight/40 bg-highlight/10 shadow-[0_0_28px_rgb(222_243_77_/0.08)]'
                              : 'border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]'
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          <span
                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-display text-[0.7rem] font-semibold tracking-[0.08em] ${
                              active
                                ? 'border-highlight/40 bg-highlight/15 text-highlight'
                                : 'border-white/12 bg-white/[0.04] text-white/45 group-hover:border-highlight/30 group-hover:text-highlight'
                            }`}
                          >
                            {number}
                          </span>
                          <span
                            className={`flex-1 font-display text-[1.45rem] leading-none font-semibold tracking-tight sm:text-[1.6rem] ${
                              active ? 'text-highlight' : 'text-white group-hover:text-highlight'
                            }`}
                          >
                            {link.label}
                          </span>
                          <ArrowUpRight
                            size={17}
                            aria-hidden="true"
                            className={`shrink-0 transition duration-300 ${
                              active
                                ? 'text-highlight'
                                : 'text-white/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-highlight'
                            }`}
                          />
                        </a>
                      </m.li>
                    );
                  })}
                </ul>

                <m.div
                  className="mt-auto space-y-4 border-t border-white/10 pt-5"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.28 }}
                >
                  <div className="overflow-hidden rounded-[1.5rem] border border-cta/25 bg-gradient-to-br from-cta/15 via-white/[0.03] to-transparent p-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cta/35 bg-cta/15 text-cta">
                        <Sparkles size={18} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-display text-base font-semibold tracking-tight text-white">Free website audit</p>
                        <p className="mt-1 text-sm leading-5 text-white/60">
                          Share your site details and we will send a clear growth readout.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-audit-open
                      className={`${buttonClass.base} ${buttonClass.cta} mt-4 w-full shadow-[0_12px_36px_rgb(255_222_93_/0.2)]`}
                      onClick={() => setOpen(false)}
                    >
                      Get Free Audit
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </div>

                  {socials.length > 0 && (
                    <ul className="flex flex-wrap gap-2.5" aria-label="Social media">
                      {socials.map((social) => (
                        <li key={social.label}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.03] text-white transition duration-300 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                              <path d={socialPaths[social.icon]} />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="max-w-sm text-sm leading-6 text-white/55">
                    Let&apos;s build something that moves your business forward.
                  </p>
                </m.div>
              </nav>
            </m.div>
          )}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <LazyMotion features={domAnimation}>
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-300 lg:hidden ${
          open
            ? 'border border-highlight/40 bg-highlight/10 text-highlight'
            : 'text-white hover:bg-white/10'
        }`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>
      {menu}
    </LazyMotion>
  );
}
