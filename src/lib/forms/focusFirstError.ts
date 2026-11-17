/**
 * Scroll the nearest scroll container to the first invalid field and focus it.
 * Prefers `[data-field-id]`, then `[name]`, including DarkSelect (hidden + listbox button).
 */
export function focusFirstFormError(
  root: HTMLElement,
  errors: { readonly [key: string]: string | null | undefined } | object,
) {
  const record = errors as Record<string, string | null | undefined>;
  const firstKey = Object.keys(record).find((key) => Boolean(record[key]));
  if (!firstKey) return;

  const byData = root.querySelector<HTMLElement>(`[data-field-id="${CSS.escape(firstKey)}"]`);
  const named = root.querySelector<HTMLElement>(`[name="${CSS.escape(firstKey)}"]`);

  let scrollTarget: HTMLElement | null = byData;
  let focusTarget: HTMLElement | null = null;

  if (byData) {
    focusTarget =
      byData.querySelector<HTMLElement>(
        'input:not([type="hidden"]), textarea, select, button[aria-haspopup="listbox"], button',
      ) ?? byData;
  } else if (named instanceof HTMLInputElement && named.type === 'hidden') {
    focusTarget =
      named.parentElement?.querySelector<HTMLElement>('button[aria-haspopup="listbox"]') ?? null;
    scrollTarget = focusTarget ?? named.parentElement;
  } else if (
    named instanceof HTMLInputElement ||
    named instanceof HTMLTextAreaElement ||
    named instanceof HTMLSelectElement ||
    named instanceof HTMLButtonElement
  ) {
    focusTarget = named;
    scrollTarget = named.closest('label') ?? named.closest('div') ?? named;
  }

  if (!scrollTarget) {
    const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]');
    scrollTarget = invalid;
    focusTarget = invalid;
  }

  if (!scrollTarget) return;

  const run = () => {
    scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focusTarget?.focus({ preventScroll: true });
  };

  requestAnimationFrame(() => requestAnimationFrame(run));
}
