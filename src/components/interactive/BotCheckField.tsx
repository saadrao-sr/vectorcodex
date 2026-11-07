import { useId } from 'react';

export const BOT_CHECK_FIELD = 'human_check';

export const BOT_CHECK_ERROR = 'Confirm you are not a robot to continue.';

export function isBotCheckPassed(data: FormData | Record<string, FormDataEntryValue>) {
  const value =
    data instanceof FormData ? String(data.get(BOT_CHECK_FIELD) ?? '') : String(data[BOT_CHECK_FIELD] ?? '');
  return value === 'on' || value === 'yes' || value === 'true' || value === '1';
}

type Props = {
  error?: string;
  className?: string;
  name?: string;
};

/** Visible human-verification checkbox shared across site forms. */
export default function BotCheckField({ error, className = '', name = BOT_CHECK_FIELD }: Props) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
          error
            ? 'border-cta/45 bg-cta/10'
            : 'border-white/12 bg-white/[0.03] hover:border-white/25'
        }`}
      >
        <input
          id={id}
          type="checkbox"
          name={name}
          value="yes"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-transparent text-highlight focus:ring-highlight"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className="text-sm leading-6 text-white/80">
          I am not a robot. Please check this box to confirm you are submitting this form yourself.
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-cta" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
