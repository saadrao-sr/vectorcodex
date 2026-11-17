/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_MAP_EMBED_URL?: string;
  /** VectorCodex Lead Manager REST endpoint (multipart FormData POST). */
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  /**
   * Cloudflare Turnstile public Site Key only.
   * Never put the Turnstile Secret Key in PUBLIC_ or any browser-facing env var.
   */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
