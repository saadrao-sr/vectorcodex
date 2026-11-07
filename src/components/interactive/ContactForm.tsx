import { useId, useState, type SubmitEvent } from 'react';
import BotCheckField, { BOT_CHECK_ERROR, isBotCheckPassed } from './BotCheckField';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  endpoint?: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
  human_check?: string;
}

const fieldClass =
  'min-h-12 w-full rounded-xl border border-white/15 bg-surface px-4 text-base text-white placeholder:text-white/35 focus:border-highlight focus:outline-none';

export default function ContactForm({ options, endpoint = '' }: Props) {
  const baseId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (message.length < 10) next.message = 'Add a short note about the work, at least 10 characters.';
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
          ? 'The form is not connected to an inbox yet. Your details were not sent.'
          : '';

  return (
    <form className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" method="post" action={endpoint || undefined} onSubmit={onSubmit} noValidate>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input id={`${baseId}-name`} name="name" autoComplete="name" required className={fieldClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${baseId}-name-error` : undefined} />
          {errors.name && (
            <p id={`${baseId}-name-error`} className="mt-2 text-sm text-cta">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${baseId}-email`} className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input id={`${baseId}-email`} name="email" type="email" autoComplete="email" required className={fieldClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${baseId}-email-error` : undefined} />
          {errors.email && (
            <p id={`${baseId}-email-error`} className="mt-2 text-sm text-cta">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor={`${baseId}-company`} className="mb-2 block text-sm font-medium">
          Company <span className="text-white/45">(optional)</span>
        </label>
        <input id={`${baseId}-company`} name="company" autoComplete="organization" className={fieldClass} />
      </div>
      <div className="mt-4">
        <label htmlFor={`${baseId}-service`} className="mb-2 block text-sm font-medium">
          Service
        </label>
        <select id={`${baseId}-service`} name="service" className={fieldClass} defaultValue="">
          <option value="">Not sure yet</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor={`${baseId}-message`} className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea id={`${baseId}-message`} name="message" required rows={6} className={`${fieldClass} min-h-36 py-3`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${baseId}-message-error` : undefined} />
        {errors.message && (
          <p id={`${baseId}-message-error`} className="mt-2 text-sm text-cta">
            {errors.message}
          </p>
        )}
      </div>
      <BotCheckField className="mt-5" error={errors.human_check} />
      <button type="submit" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-lime to-gold px-5 text-sm font-semibold text-bg sm:w-auto" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </button>
      <p className="mt-4 text-sm leading-6 text-white/55" aria-live="polite">
        {status === 'idle' ? 'We use your details only to reply to this enquiry.' : statusText}
      </p>
    </form>
  );
}
