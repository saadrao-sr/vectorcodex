import { useEffect, useId, useRef, useState, type CSSProperties, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { buttonClass } from '../ui/styles';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

const SERVICE_OPTIONS = [
  'SEO',
  'Local SEO',
  'Technical SEO',
  'E-commerce SEO',
  'AI SEO',
  'Web Development',
  'WordPress Development',
  'Shopify Development',
  'Social Media Marketing',
  'Content Creation',
  'PPC Management',
  'Not sure yet',
] as const;
const TIMELINE_OPTIONS = ['ASAP', '1–2 weeks', '1 month', '2–3 months', 'Flexible'] as const;

const BUDGET_MIN = 5;
const BUDGET_MAX = 100;

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  timeline?: string;
  human_check?: string;
}

interface Props {
  endpoint?: string;
}

interface DarkSelectProps {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
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

function DarkSelect({ id, name, value, placeholder, options, invalid, describedBy, onChange }: DarkSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = `${id}-listbox`;

  useEffect(() => {
    if (!open || !buttonRef.current) return undefined;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuHeight = Math.min(224, options.length * 44 + 16);
      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const openUp = spaceBelow < menuHeight && rect.top > spaceBelow;
      setMenuStyle({
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        top: openUp ? undefined : rect.bottom + 8,
        bottom: openUp ? window.innerHeight - rect.top + 8 : undefined,
        zIndex: 100,
      });
    };

    updatePosition();
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, options.length]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={`${fieldClass} flex cursor-pointer items-center justify-between gap-3 text-left ${
          invalid ? 'border-cta' : open ? 'border-highlight' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? 'text-white' : 'text-white/35'}>{value || placeholder}</span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={`shrink-0 text-highlight transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={id}
          style={menuStyle}
          className="max-h-56 overflow-auto rounded-2xl border border-white/12 bg-[#0D120C] p-1.5 shadow-[0_20px_50px_rgb(0_0_0_/0.55)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    selected
                      ? 'bg-highlight/15 text-highlight'
                      : 'text-white/85 hover:bg-highlight/10 hover:text-highlight'
                  }`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <span>{option}</span>
                  {selected && <Check aria-hidden="true" size={16} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatBudget(value: number) {
  return value >= BUDGET_MAX ? `£${BUDGET_MAX}K+` : `£${value}K`;
}

export default function QuoteModal({ endpoint = '' }: Props) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budgetMin, setBudgetMin] = useState(BUDGET_MIN);
  const [budgetMax, setBudgetMax] = useState(40);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-quote-open]');
      if (!trigger) return;
      event.preventDefault();
      const nextService = trigger.getAttribute('data-service')?.trim() || '';
      lastFocus.current = trigger;
      if (nextService) setService(nextService);
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
    closeRef.current?.focus();
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
    const company = String(data.get('company') ?? '').trim();
    const selectedService = String(data.get('service') ?? '').trim();
    const selectedTimeline = String(data.get('timeline') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.';
    if (company.length < 2) next.company = 'Enter your company name.';
    if (!selectedService) next.service = 'Select a service.';
    if (!selectedTimeline) next.timeline = 'Select a project timeline.';
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

    const website = String(new FormData(form).get('website') ?? '').trim();
    if (website) {
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
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setService('');
      setTimeline('');
      setBudgetMin(BUDGET_MIN);
      setBudgetMax(40);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const statusText =
    status === 'success'
      ? 'Thanks. Your quote request has been recorded.'
      : status === 'error'
        ? 'The request could not be sent. Please try again.'
        : status === 'unconfigured'
          ? 'The form is not connected to an inbox yet. Set PUBLIC_CONTACT_ENDPOINT to enable submissions. Your details were not sent.'
          : 'We use your details only to reply to this enquiry.';

  const statusTone =
    status === 'success'
      ? 'border-highlight/35 bg-highlight/10 text-highlight'
      : status === 'error' || status === 'unconfigured'
        ? 'border-cta/35 bg-cta/10 text-cta'
        : 'border-white/10 bg-white/[0.03] text-white/60';

  const budgetLabel = `${formatBudget(Math.min(budgetMin, budgetMax))} – ${formatBudget(Math.max(budgetMin, budgetMax))}`;
  const minPercent = ((Math.min(budgetMin, budgetMax) - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const maxPercent = ((Math.max(budgetMin, budgetMax) - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

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
              aria-label="Close quote form"
              onClick={() => setOpen(false)}
            />

            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="relative z-10 flex max-h-[100svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-bg shadow-[0_30px_80px_rgb(0_0_0_/0.55)] sm:max-h-[90svh] sm:rounded-[1.75rem]"
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(222_243_77_/0.16),transparent_70%)] blur-2xl" />
                <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(197_246_61_/0.1),transparent_70%)] blur-2xl" />
              </div>

              <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-highlight uppercase">
                    <span className="h-2 w-2 rounded-full bg-highlight" aria-hidden="true" />
                    Let's Get Started
                  </p>
                  <h2 id={titleId} className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl lg:text-[2.1rem]">
                    This Could Be the Start of Something <span className="text-highlight">Incredible!</span>
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-highlight hover:bg-highlight/10 hover:text-highlight"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" size={18} />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <form
                className="relative overflow-y-auto px-5 py-5 sm:px-8 sm:py-7"
                method="post"
                action={endpoint || undefined}
                onSubmit={onSubmit}
                noValidate
              >
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <input type="hidden" name="budget" value={budgetLabel} />
                <input type="hidden" name="form_type" value="quote" />

                <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                  <div>
                    <label htmlFor={`${baseId}-name`} className={labelClass}>
                      Name*
                    </label>
                    <input
                      id={`${baseId}-name`}
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Your full name"
                      className={fieldClass}
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
                    <label htmlFor={`${baseId}-company`} className={labelClass}>
                      Name of your company / organisation*
                    </label>
                    <input
                      id={`${baseId}-company`}
                      name="company"
                      autoComplete="organization"
                      required
                      placeholder="Company name"
                      className={fieldClass}
                      aria-invalid={Boolean(errors.company)}
                      aria-describedby={errors.company ? `${baseId}-company-error` : undefined}
                    />
                    {errors.company && (
                      <p id={`${baseId}-company-error`} className="mt-2 text-sm text-cta">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-phone`} className={labelClass}>
                      Phone No*
                    </label>
                    <input
                      id={`${baseId}-phone`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="+44…"
                      className={fieldClass}
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
                    <label htmlFor={`${baseId}-email`} className={labelClass}>
                      Email*
                    </label>
                    <input
                      id={`${baseId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      className={fieldClass}
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
                    <label htmlFor={`${baseId}-service`} className={labelClass}>
                      Service you are interested in*
                    </label>
                    <DarkSelect
                      id={`${baseId}-service`}
                      name="service"
                      value={service}
                      placeholder="Select a service"
                      options={SERVICE_OPTIONS}
                      invalid={Boolean(errors.service)}
                      describedBy={errors.service ? `${baseId}-service-error` : undefined}
                      onChange={setService}
                    />
                    {errors.service && (
                      <p id={`${baseId}-service-error`} className="mt-2 text-sm text-cta">
                        {errors.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-timeline`} className={labelClass}>
                      Project Timeline*
                    </label>
                    <DarkSelect
                      id={`${baseId}-timeline`}
                      name="timeline"
                      value={timeline}
                      placeholder="Select a timeline"
                      options={TIMELINE_OPTIONS}
                      invalid={Boolean(errors.timeline)}
                      describedBy={errors.timeline ? `${baseId}-timeline-error` : undefined}
                      onChange={setTimeline}
                    />
                    {errors.timeline && (
                      <p id={`${baseId}-timeline-error`} className="mt-2 text-sm text-cta">
                        {errors.timeline}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3 text-sm font-medium text-white/85">
                      <span>{formatBudget(BUDGET_MIN)}</span>
                      <span className="text-highlight">{budgetLabel}</span>
                      <span>{formatBudget(BUDGET_MAX)}</span>
                    </div>
                    <div className="relative h-8">
                      <div className="absolute top-1/2 right-0 left-0 h-2 -translate-y-1/2 rounded-full bg-white/10" />
                      <div
                        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-lime to-gold"
                        style={{ left: `${minPercent}%`, width: `${Math.max(0, maxPercent - minPercent)}%` }}
                      />
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={5}
                        value={budgetMin}
                        aria-label="Minimum budget"
                        className="pointer-events-none absolute inset-0 z-20 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-highlight [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-highlight"
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setBudgetMin(Math.min(value, budgetMax));
                        }}
                      />
                      <input
                        type="range"
                        min={BUDGET_MIN}
                        max={BUDGET_MAX}
                        step={5}
                        value={budgetMax}
                        aria-label="Maximum budget"
                        className="pointer-events-none absolute inset-0 z-10 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-highlight [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-highlight"
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setBudgetMax(Math.max(value, budgetMin));
                        }}
                      />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/50">
                      A transparent budget will help us ensure expectations are met. Not sure? Ballparks are fine.
                    </p>
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-message`} className={labelClass}>
                      Tell us about your project
                    </label>
                    <textarea
                      id={`${baseId}-message`}
                      name="message"
                      rows={5}
                      placeholder="Share goals, challenges, or anything we should know."
                      className={`${fieldClass} min-h-[8.5rem] resize-y py-3`}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  <BotCheckField error={errors.human_check} />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className={`${buttonClass.base} ${buttonClass.gradient} w-full px-8 shadow-[0_12px_40px_rgb(197_246_61_/0.2)] sm:w-auto`}
                    disabled={status === 'submitting'}
                    aria-busy={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Submit'}
                  </button>
                  <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 sm:max-w-md ${statusTone}`} aria-live="polite">
                    {statusText}
                  </p>
                  </div>
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
