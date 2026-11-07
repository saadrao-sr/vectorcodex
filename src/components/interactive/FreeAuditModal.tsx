import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { X } from 'lucide-react';
import { buttonClass } from '../ui/styles';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  human_check?: string;
}

interface Props {
  endpoint?: string;
}

const fieldClass =
  'min-h-12 w-full rounded-2xl border border-white/12 bg-[#121812] px-4 text-base text-white shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)] transition placeholder:text-white/35 hover:border-white/20 focus:border-highlight focus:bg-[#161d16] focus:outline-none';

const labelClass = 'mb-2 block text-sm font-medium text-white/85';

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

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export default function FreeAuditModal({ endpoint = '' }: Props) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-audit-open]');
      if (!trigger) return;
      event.preventDefault();
      lastFocus.current = trigger;
      setErrors({});
      setStatus('idle');
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previous;
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
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
    if (open) return;
    lastFocus.current?.focus();
  }, [open]);

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const website = String(data.get('website') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid contact number.';
    if (website.length < 3) next.website = 'Enter your website name or URL.';
    if (!isBotCheckPassed(data)) next.human_check = BOT_CHECK_ERROR;
    return next;
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus('idle');
      return;
    }

    const data = new FormData(form);
    data.set('form_type', 'free_audit');
    data.set('website', normalizeWebsite(String(data.get('website') ?? '')));

    const honeypot = String(data.get('company_website') ?? '').trim();
    if (honeypot) {
      setStatus('success');
      form.reset();
      return;
    }

    if (!endpoint) {
      setStatus('unconfigured');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const statusText =
    status === 'success'
      ? 'Thanks. Your free audit request has been recorded. We will review your site and follow up.'
      : status === 'error'
        ? 'The request could not be sent. Please try again.'
        : status === 'unconfigured'
          ? 'The audit form is not connected to an inbox yet. Set PUBLIC_CONTACT_ENDPOINT to enable submissions. Your details were not sent.'
          : 'Share your site details and we will prepare a free digital audit overview.';

  const statusTone =
    status === 'success'
      ? 'border-highlight/35 bg-highlight/10 text-highlight'
      : status === 'error' || status === 'unconfigured'
        ? 'border-cta/35 bg-cta/10 text-cta'
        : 'border-white/10 bg-white/[0.03] text-white/60';

  if (!mounted) return null;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-bg/80 backdrop-blur-md"
              aria-label="Close free audit form"
              onClick={() => setOpen(false)}
            />
            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="relative z-10 flex max-h-[100svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-bg shadow-[0_30px_80px_rgb(0_0_0_/0.55)] sm:max-h-[90svh] sm:rounded-3xl"
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(255_222_93_/0.12),transparent_70%)] blur-2xl" />
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(222_243_77_/0.08),transparent_70%)] blur-2xl" />
              </div>

              <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
                <div>
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-cta uppercase">Free Digital Audit</p>
                  <h2 id={titleId} className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                    Get a Free Audit of Your Website
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                    Tell us about your site and goals. We will review visibility, structure, and opportunities — then share clear next steps.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-highlight/45 hover:text-highlight"
                  aria-label="Close free audit form"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <form
                className="relative overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
                onSubmit={onSubmit}
                noValidate
              >
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input type="hidden" name="form_type" value="free_audit" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-website`} className={labelClass}>
                      Website name / URL*
                    </label>
                    <input
                      id={`${baseId}-website`}
                      name="website"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="example.com or https://example.com"
                      className={`${fieldClass} ${errors.website ? 'border-cta' : ''}`}
                      aria-invalid={Boolean(errors.website)}
                      aria-describedby={errors.website ? `${baseId}-website-error` : undefined}
                    />
                    {errors.website && (
                      <p id={`${baseId}-website-error`} className="mt-2 text-sm text-cta">
                        {errors.website}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-name`} className={labelClass}>
                      Full name*
                    </label>
                    <input
                      id={`${baseId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      className={`${fieldClass} ${errors.name ? 'border-cta' : ''}`}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
                    />
                    {errors.name && (
                      <p id={`${baseId}-name-error`} className="mt-2 text-sm text-cta">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-email`} className={labelClass}>
                      Email*
                    </label>
                    <input
                      id={`${baseId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={`${fieldClass} ${errors.email ? 'border-cta' : ''}`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
                    />
                    {errors.email && (
                      <p id={`${baseId}-email-error`} className="mt-2 text-sm text-cta">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-phone`} className={labelClass}>
                      Contact number*
                    </label>
                    <input
                      id={`${baseId}-phone`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+44…"
                      className={`${fieldClass} ${errors.phone ? 'border-cta' : ''}`}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? `${baseId}-phone-error` : undefined}
                    />
                    {errors.phone && (
                      <p id={`${baseId}-phone-error`} className="mt-2 text-sm text-cta">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-company`} className={labelClass}>
                      Company <span className="text-white/40">(optional)</span>
                    </label>
                    <input
                      id={`${baseId}-company`}
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company name"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-focus`} className={labelClass}>
                      Primary focus <span className="text-white/40">(optional)</span>
                    </label>
                    <input
                      id={`${baseId}-focus`}
                      name="focus"
                      type="text"
                      placeholder="SEO, website performance, conversions, local visibility…"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-message`} className={labelClass}>
                      Message <span className="text-white/40">(optional)</span>
                    </label>
                    <textarea
                      id={`${baseId}-message`}
                      name="message"
                      rows={4}
                      placeholder="Share goals, challenges, or anything we should know before the audit."
                      className={`${fieldClass} min-h-28 resize-y py-3`}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  <BotCheckField error={errors.human_check} />
                  <button
                    type="submit"
                    className={`${buttonClass.base} ${buttonClass.cta} w-full whitespace-nowrap px-6 shadow-[0_12px_40px_rgb(255_222_93_/0.18)] sm:w-auto`}
                    disabled={status === 'submitting'}
                    aria-busy={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Request Free Audit'}
                  </button>
                  <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${statusTone}`} aria-live="polite">
                    {statusText}
                  </p>
                </div>
              </form>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}
