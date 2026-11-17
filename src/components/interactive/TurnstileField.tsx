import { useEffect, useId, useRef, useState } from 'react';
import {
  getTurnstileApi,
  getTurnstileSiteKey,
  isTurnstileConfigured,
  loadTurnstileScript,
} from '../../lib/forms/turnstile';

type Props = {
  /** Called whenever the token changes (including clear on expire/error/reset). */
  onTokenChange: (token: string | null) => void;
  /** Increment to reset the widget after success or token rejection. */
  resetSignal?: number;
  error?: string;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
};

/**
 * Explicit Turnstile widget. Renders nothing when PUBLIC_TURNSTILE_SITE_KEY is unset.
 * Loads the Cloudflare script once per page.
 */
export default function TurnstileField({
  onTokenChange,
  resetSignal = 0,
  error,
  className = '',
  theme = 'dark',
}: Props) {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const [loadError, setLoadError] = useState('');

  onTokenChangeRef.current = onTokenChange;

  const configured = isTurnstileConfigured();
  const siteKey = getTurnstileSiteKey();

  useEffect(() => {
    if (!configured || !siteKey) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled) return;
        const api = getTurnstileApi();
        const el = containerRef.current;
        if (!api || !el) return;

        if (widgetIdRef.current != null) {
          try {
            api.remove(widgetIdRef.current);
          } catch {
            /* widget already gone */
          }
          widgetIdRef.current = null;
        }

        el.innerHTML = '';
        widgetIdRef.current = api.render(el, {
          sitekey: siteKey,
          theme,
          callback: (token) => {
            if (!cancelled) onTokenChangeRef.current(token);
          },
          'expired-callback': () => {
            if (!cancelled) onTokenChangeRef.current(null);
          },
          'timeout-callback': () => {
            if (!cancelled) onTokenChangeRef.current(null);
          },
          'error-callback': () => {
            if (!cancelled) {
              onTokenChangeRef.current(null);
              setLoadError('Human verification failed to load. Please refresh and try again.');
            }
          },
        });
        setLoadError('');
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Human verification failed to load. Please refresh and try again.');
          onTokenChangeRef.current(null);
        }
      });

    return () => {
      cancelled = true;
      const api = getTurnstileApi();
      if (api && widgetIdRef.current != null) {
        try {
          api.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
      widgetIdRef.current = null;
    };
  }, [configured, siteKey, theme]);

  useEffect(() => {
    if (!resetSignal) return;
    const api = getTurnstileApi();
    if (api && widgetIdRef.current != null) {
      try {
        api.reset(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
    onTokenChangeRef.current(null);
  }, [resetSignal]);

  if (!configured) {
    return null;
  }

  const message = error || loadError;

  return (
    <div className={className} data-field-id="turnstile">
      <div ref={containerRef} id={`vc-turnstile-${reactId.replace(/:/g, '')}`} />
      {message && (
        <p className="mt-2 text-sm text-cta" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
