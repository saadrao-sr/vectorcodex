import { TURNSTILE_FIELD } from './turnstile';

export type LeadFormType =
  | 'quote'
  | 'booking'
  | 'free_audit'
  | 'team_requirements'
  | 'project_inquiry'
  | 'homepage_inquiry'
  | 'pricing_calculator';

export type LeadSubmitResult =
  | { ok: true; message?: string }
  | {
      ok: false;
      message: string;
      code?: string;
      errors?: Record<string, string>;
    };

type LeadApiBody = {
  ok?: boolean;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
};

const UNCONFIGURED_MESSAGE =
  'The form is not connected to an inbox yet. Set PUBLIC_CONTACT_ENDPOINT to enable submissions. Your details were not sent.';

/**
 * Attach form_type, source_url, and optional Turnstile token to FormData.
 * Does not remove existing fields.
 */
export function prepareLeadFormData(
  body: FormData,
  formType: LeadFormType,
  options?: { turnstileToken?: string | null },
): FormData {
  body.set('form_type', formType);
  if (typeof window !== 'undefined' && window.location?.href) {
    body.set('source_url', window.location.href);
  }
  const token = options?.turnstileToken?.trim() ?? '';
  if (token) {
    body.set(TURNSTILE_FIELD, token);
  } else {
    body.delete(TURNSTILE_FIELD);
  }
  return body;
}

export function isTurnstileFailureCode(code?: string): boolean {
  return typeof code === 'string' && code.startsWith('vc_leads_turnstile_');
}

/**
 * POST multipart FormData to the VectorCodex Lead Manager endpoint.
 * Parses JSON success/error bodies from the plugin contract.
 */
export async function submitLeadFormData(
  endpoint: string,
  body: FormData,
): Promise<LeadSubmitResult> {
  if (!endpoint.trim()) {
    return { ok: false, message: UNCONFIGURED_MESSAGE, code: 'unconfigured' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });

    const contentType = response.headers.get('content-type') ?? '';
    let data: LeadApiBody | null = null;

    if (contentType.includes('application/json')) {
      try {
        data = (await response.json()) as LeadApiBody;
      } catch {
        data = null;
      }
    }

    const success = response.ok && (data == null || data.ok !== false);
    if (success) {
      const successMessage =
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : 'Thank you. Your submission has been received.';
      return { ok: true, message: successMessage };
    }

    const apiMessage = typeof data?.message === 'string' ? data.message.trim() : '';
    const message =
      apiMessage ||
      (response.status === 429
        ? 'Too many submissions. Please try again later.'
        : 'The request could not be sent. Please try again.');

    const errors =
      data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)
        ? data.errors
        : undefined;

    return {
      ok: false,
      message,
      code: typeof data?.code === 'string' ? data.code : undefined,
      errors,
    };
  } catch {
    return {
      ok: false,
      message: 'Network error while sending. Please check your connection and try again.',
      code: 'network_error',
    };
  }
}
