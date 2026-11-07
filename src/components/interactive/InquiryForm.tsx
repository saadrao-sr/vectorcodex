import { useId, useState, type SubmitEvent } from 'react';
import { buttonClass } from '../ui/styles';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

interface Option {
  value: string;
  label: string;
}

interface Props {
  serviceOptions: Option[];
  budgetOptions: Option[];
  endpoint?: string;
  className?: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  human_check?: string;
}

const fieldClass =
  'min-h-12 w-full rounded-2xl border border-white/12 bg-[#121812] px-4 text-base text-white shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)] transition placeholder:text-white/35 hover:border-white/20 focus:border-highlight focus:bg-[#161d16] focus:outline-none';

const labelClass = 'mb-2 block text-sm font-medium text-white/85';

const selectClass = `${fieldClass} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`;

export default function InquiryForm({ serviceOptions, budgetOptions, endpoint = '', className = '' }: Props) {
  const baseId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const service = String(data.get('service') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number.';
    if (!service) next.service = 'Select a service.';
    if (message.length < 10) next.message = 'Add a short message, at least 10 characters.';
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
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const statusText =
    status === 'success'
      ? 'Thanks. Your enquiry has been recorded.'
      : status === 'error'
        ? 'The enquiry could not be sent. Please try again.'
        : status === 'unconfigured'
          ? 'The form is not connected to an inbox yet. Set PUBLIC_CONTACT_ENDPOINT to enable submissions. Your details were not sent.'
          : 'We use your details only to reply to this enquiry.';

  const statusTone =
    status === 'success'
      ? 'border-highlight/35 bg-highlight/10 text-highlight'
      : status === 'error' || status === 'unconfigured'
        ? 'border-cta/35 bg-cta/10 text-cta'
        : 'border-white/10 bg-white/[0.03] text-white/60';

  return (
    <form
      className={[
        'flex flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgb(0_0_0_/0.28)] sm:p-6 lg:p-7',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      method="post"
      action={endpoint || undefined}
      onSubmit={onSubmit}
      noValidate
    >
      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Tell us about your project
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/60">
          A few details help us understand the right next step.
        </p>
      </div>

      <div className="mt-5 grid flex-1 content-start gap-4 sm:mt-6 sm:grid-cols-2">
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
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
            Email
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

        <div>
          <label htmlFor={`${baseId}-service`} className={labelClass}>
            Service Required
          </label>
          <select
            id={`${baseId}-service`}
            name="service"
            required
            defaultValue=""
            className={selectClass}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? `${baseId}-service-error` : undefined}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id={`${baseId}-service-error`} className="mt-2 text-sm text-cta">
              {errors.service}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${baseId}-budget`} className={labelClass}>
            Budget
          </label>
          <select id={`${baseId}-budget`} name="budget" defaultValue="" className={selectClass}>
            <option value="">Select a range</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${baseId}-message`} className={labelClass}>
            Message
          </label>
          <textarea
            id={`${baseId}-message`}
            name="message"
            required
            rows={4}
            placeholder="Share goals, timeline, or anything we should know."
            className={`${fieldClass} min-h-28 resize-y py-3`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${baseId}-message-error` : undefined}
          />
          {errors.message && (
            <p id={`${baseId}-message-error`} className="mt-2 text-sm text-cta">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3 sm:mt-6">
        <BotCheckField error={errors.human_check} />
        <button
          type="submit"
          className={`${buttonClass.base} ${buttonClass.gradient} w-full shadow-[0_12px_40px_rgb(197_246_61_/0.16)]`}
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send Your Inquiry'}
        </button>
        <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${statusTone}`} aria-live="polite">
          {statusText}
        </p>
      </div>
    </form>
  );
}
