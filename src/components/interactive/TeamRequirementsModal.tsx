import { useEffect, useId, useRef, useState, type CSSProperties, type SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { buttonClass } from '../ui/styles';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

const BUDGET_OPTIONS = [
  'Under £2,000 / month',
  '£2,000–£5,000 / month',
  '£5,000–£10,000 / month',
  '£10,000+ / month',
  'Project-based (discuss)',
] as const;

const RESOURCE_OPTIONS = ['1 specialist', '2–3 specialists', '4–5 specialists', '6+ specialists', 'Not sure yet'] as const;

const DEPARTMENT_OPTIONS = [
  'SEO',
  'Web Development',
  'PPC',
  'Content Strategy',
  'Digital Marketing',
  'UI/UX Design',
  'Multiple departments',
] as const;

const ENGAGEMENT_OPTIONS = [
  'Full-time dedicated',
  'Part-time dedicated',
  'Project-based',
  'Mixed / flexible',
] as const;

const TIMELINE_OPTIONS = ['ASAP', 'Within 2 weeks', 'Within 1 month', 'Flexible'] as const;

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  resources?: string;
  budget?: string;
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
        zIndex: 90,
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

export default function TeamRequirementsModal({ endpoint = '' }: Props) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [budget, setBudget] = useState('');
  const [resources, setResources] = useState('');
  const [department, setDepartment] = useState('');
  const [engagement, setEngagement] = useState('');
  const [timeline, setTimeline] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>('[data-team-requirements-open]');
      if (!trigger) return;
      event.preventDefault();
      lastFocus.current = trigger;
      setBudget('');
      setResources('');
      setDepartment('');
      setEngagement('');
      setTimeline('');
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
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid work email.';
    if (phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.';
    if (!department) next.department = 'Select a department.';
    if (!resources) next.resources = 'Select how many resources you need.';
    if (!budget) next.budget = 'Select a budget range.';
    if (!isBotCheckPassed(data)) next.human_check = BOT_CHECK_ERROR;
    return next;
  }

  function resetSelects() {
    setBudget('');
    setResources('');
    setDepartment('');
    setEngagement('');
    setTimeline('');
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
      resetSelects();
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
      resetSelects();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const statusText =
    status === 'success'
      ? 'Thanks. Your team requirements have been recorded. We will follow up with a scoped next step.'
      : status === 'error'
        ? 'The request could not be sent. Please try again.'
        : status === 'unconfigured'
          ? 'This form is not connected to an inbox yet. Set PUBLIC_CONTACT_ENDPOINT to enable submissions. Your details were not sent.'
          : 'Share the roles, headcount, and budget so we can propose the right team mix.';

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
            className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-[#0D120C]/82 backdrop-blur-md"
              aria-label="Close team requirements form"
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
              className="relative z-10 flex max-h-[min(100svh,100dvh)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-[#0D120C] shadow-[0_30px_80px_rgb(0_0_0_/0.55)] sm:max-h-[min(90svh,90dvh)] sm:rounded-3xl"
            >
              <div className="relative shrink-0 overflow-hidden border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/18 via-lime/5 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -top-10 right-8 h-32 w-32 rounded-full bg-highlight/10 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-highlight uppercase">Team Requirements</p>
                    <h2 id={titleId} className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Build Your Extended Team
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                      Tell us the department, headcount, budget, and timeline. We will reply with a tailored staffing plan.
                    </p>
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
              </div>

              <form
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6"
                method="post"
                action={endpoint || undefined}
                onSubmit={onSubmit}
                noValidate
              >
                <input type="hidden" name="formType" value="team-requirements" />
                <input type="hidden" name="subject" value="Team requirements enquiry" />

                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="sm:col-span-2">
                    <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">Contact details</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-name`} className={labelClass}>
                      Full Name
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
                    <label htmlFor={`${baseId}-email`} className={labelClass}>
                      Work Email
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
                    <label htmlFor={`${baseId}-phone`} className={labelClass}>
                      Phone Number
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

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-company`} className={labelClass}>
                      Company Name <span className="text-white/40">(optional)</span>
                    </label>
                    <input
                      id={`${baseId}-company`}
                      name="company"
                      autoComplete="organization"
                      placeholder="Organisation name"
                      className={fieldClass}
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">Team brief</p>
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-department`} className={labelClass}>
                      Department Needed
                    </label>
                    <DarkSelect
                      id={`${baseId}-department`}
                      name="department"
                      value={department}
                      placeholder="Select a department"
                      options={DEPARTMENT_OPTIONS}
                      invalid={Boolean(errors.department)}
                      describedBy={errors.department ? `${baseId}-department-error` : undefined}
                      onChange={setDepartment}
                    />
                    {errors.department && (
                      <p id={`${baseId}-department-error`} className="mt-2 text-sm text-cta">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-resources`} className={labelClass}>
                      Resources Required
                    </label>
                    <DarkSelect
                      id={`${baseId}-resources`}
                      name="resources"
                      value={resources}
                      placeholder="Select headcount"
                      options={RESOURCE_OPTIONS}
                      invalid={Boolean(errors.resources)}
                      describedBy={errors.resources ? `${baseId}-resources-error` : undefined}
                      onChange={setResources}
                    />
                    {errors.resources && (
                      <p id={`${baseId}-resources-error`} className="mt-2 text-sm text-cta">
                        {errors.resources}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-budget`} className={labelClass}>
                      Monthly Budget
                    </label>
                    <DarkSelect
                      id={`${baseId}-budget`}
                      name="budget"
                      value={budget}
                      placeholder="Select a budget range"
                      options={BUDGET_OPTIONS}
                      invalid={Boolean(errors.budget)}
                      describedBy={errors.budget ? `${baseId}-budget-error` : undefined}
                      onChange={setBudget}
                    />
                    {errors.budget && (
                      <p id={`${baseId}-budget-error`} className="mt-2 text-sm text-cta">
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${baseId}-engagement`} className={labelClass}>
                      Engagement Type
                    </label>
                    <DarkSelect
                      id={`${baseId}-engagement`}
                      name="engagement"
                      value={engagement}
                      placeholder="Select engagement type"
                      options={ENGAGEMENT_OPTIONS}
                      onChange={setEngagement}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-timeline`} className={labelClass}>
                      Ideal Start Timeline
                    </label>
                    <DarkSelect
                      id={`${baseId}-timeline`}
                      name="timeline"
                      value={timeline}
                      placeholder="When do you need people?"
                      options={TIMELINE_OPTIONS}
                      onChange={setTimeline}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${baseId}-message`} className={labelClass}>
                      Additional Context <span className="text-white/40">(optional)</span>
                    </label>
                    <textarea
                      id={`${baseId}-message`}
                      name="message"
                      rows={4}
                      placeholder="Tools, seniority, timezone, or outcomes the team should support."
                      className={`${fieldClass} min-h-28 resize-y py-3`}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
                  <BotCheckField error={errors.human_check} />
                  <button
                    type="submit"
                    className={`${buttonClass.base} ${buttonClass.gradient} w-full whitespace-nowrap px-6 shadow-[0_12px_40px_rgb(197_246_61_/0.16)] sm:w-auto`}
                    disabled={status === 'submitting'}
                    aria-busy={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Submit requirements'}
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
