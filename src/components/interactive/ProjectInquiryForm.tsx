import { useId, useState, type FormEvent } from 'react';
import { buttonClass } from '../ui/styles';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

interface Props {
  endpoint?: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  human_check?: string;
}

const serviceOptions = [
  'SEO',
  'Web Development',
  'E-commerce Development',
  'Social Media Marketing',
  'PPC Management',
  'Other',
] as const;

const budgetOptions = [
  'Under £500',
  '£500–£1,000',
  '£1,000–£3,000',
  '£3,000–£5,000',
  '£5,000+',
] as const;

const fieldClass =
  'min-h-12 w-full rounded-xl border border-white/15 bg-[#121812] px-4 text-base text-white shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)] placeholder:text-white/35 transition duration-200 hover:border-white/25 focus:border-highlight focus:bg-[#161d16] focus:shadow-[0_0_0_3px_rgb(222_243_77_/0.12)] focus:outline-none';

const selectClass = `${fieldClass} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11 [color-scheme:dark]`;

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23DEF34D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export default function ProjectInquiryForm({ endpoint = '' }: Props) {
  const baseId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid business email.';
    if (phone.length < 7) next.phone = 'Enter a valid phone number.';
    if (message.length < 10) next.message = 'Add project details of at least 10 characters.';
    if (!isBotCheckPassed(data)) next.human_check = BOT_CHECK_ERROR;
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus('idle');
      return;
    }

    const honeypot = String(new FormData(form).get('website_hp') ?? '').trim();
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
        body: new FormData(form),
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
      ? 'Thanks. Your project enquiry has been recorded.'
      : status === 'error'
        ? 'The enquiry could not be sent. Please try again.'
        : status === 'unconfigured'
          ? 'The form is not connected to an inbox yet. Your details were not sent.'
          : '';

  return (
    <form
      className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.03] p-5 sm:p-7 lg:p-8"
      method="post"
      action={endpoint || undefined}
      onSubmit={onSubmit}
      noValidate
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/10 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website_hp" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-name`} className="mb-2 block text-sm font-medium text-white/85">
              Full Name <span className="text-highlight">*</span>
            </label>
            <input
              id={`${baseId}-name`}
              name="name"
              autoComplete="name"
              required
              placeholder="Jane Smith"
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
            <label htmlFor={`${baseId}-email`} className="mb-2 block text-sm font-medium text-white/85">
              Business Email <span className="text-highlight">*</span>
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
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-company`} className="mb-2 block text-sm font-medium text-white/85">
              Company Name
            </label>
            <input
              id={`${baseId}-company`}
              name="company"
              autoComplete="organization"
              placeholder="Your company"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor={`${baseId}-phone`} className="mb-2 block text-sm font-medium text-white/85">
              Phone Number <span className="text-highlight">*</span>
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
        </div>

        <div className="mt-4">
          <label htmlFor={`${baseId}-website`} className="mb-2 block text-sm font-medium text-white/85">
            Website URL <span className="text-white/40">(optional)</span>
          </label>
          <input
            id={`${baseId}-website`}
            name="website_url"
            type="url"
            autoComplete="url"
            placeholder="https://"
            className={fieldClass}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${baseId}-service`} className="mb-2 block text-sm font-medium text-white/85">
              Service Required
            </label>
            <select
              id={`${baseId}-service`}
              name="service"
              className={selectClass}
              style={{ backgroundImage: selectChevron }}
              defaultValue=""
            >
              <option value="">Select a service</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option} className="bg-[#121812] text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${baseId}-budget`} className="mb-2 block text-sm font-medium text-white/85">
              Estimated Budget
            </label>
            <select
              id={`${baseId}-budget`}
              name="budget"
              className={selectClass}
              style={{ backgroundImage: selectChevron }}
              defaultValue=""
            >
              <option value="">Select a range</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option} className="bg-[#121812] text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor={`${baseId}-message`} className="mb-2 block text-sm font-medium text-white/85">
            Project Details / Message <span className="text-highlight">*</span>
          </label>
          <textarea
            id={`${baseId}-message`}
            name="message"
            required
            rows={6}
            placeholder="Tell us about your goals, timeline, and any constraints."
            className={`${fieldClass} min-h-36 resize-y py-3`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${baseId}-message-error` : undefined}
          />
          {errors.message && (
            <p id={`${baseId}-message-error`} className="mt-2 text-sm text-cta">
              {errors.message}
            </p>
          )}
        </div>

        <BotCheckField className="mt-6" error={errors.human_check} />

        <button
          type="submit"
          className={`${buttonClass.base} ${buttonClass.gradient} mt-4 w-full shadow-[0_14px_40px_rgb(197_246_61_/0.18)] sm:w-auto`}
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send Project Inquiry'}
        </button>

        <p className="mt-4 text-sm leading-6 text-white/55" aria-live="polite">
          {status === 'idle' ? 'We use your details only to reply to this enquiry.' : statusText}
        </p>
      </div>
    </form>
  );
}
