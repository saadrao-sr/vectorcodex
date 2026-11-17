/**
 * Cloudflare Turnstile helpers for Astro/React forms.
 * Only the public Site Key is used in the browser — never a secret key.
 */

export const TURNSTILE_FIELD = 'cf-turnstile-response';

export const TURNSTILE_REQUIRED_ERROR =
  'Complete the human verification challenge to continue.';

export const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      'timeout-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact' | 'flexible';
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Public Site Key from Astro PUBLIC_ env (inlined at build time). */
export function getTurnstileSiteKey(): string {
  return String(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();
}

/** When a Site Key is present, the widget is shown and a token is required client-side. */
export function isTurnstileConfigured(): boolean {
  return getTurnstileSiteKey().length > 0;
}

/** Load the Turnstile script once for the whole page. */
export function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-vc-turnstile="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')), {
        once: true,
      });
      if (window.turnstile) resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.vcTurnstile = '1';
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function getTurnstileApi(): TurnstileApi | undefined {
  return typeof window !== 'undefined' ? window.turnstile : undefined;
}
