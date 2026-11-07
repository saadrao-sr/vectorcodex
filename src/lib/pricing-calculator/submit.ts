import type { Answers, ServiceId } from '../../config/pricing-calculator';
import { calculateIndicativeEstimate, formatAnswerValue, getService } from '../../config/pricing-calculator';

export type PricingEnquiryPayload = {
  form_type: 'pricing_calculator';
  primaryService: ServiceId;
  additionalServices: ServiceId[];
  allServices: ServiceId[];
  businessAnswers: Answers;
  serviceAnswers: Partial<Record<ServiceId, Answers>>;
  contactAnswers: Answers;
  estimate: ReturnType<typeof calculateIndicativeEstimate>;
  summaryText: string;
  submittedAt: string;
};

export function buildSummaryText(payload: Omit<PricingEnquiryPayload, 'form_type' | 'summaryText' | 'submittedAt' | 'estimate'> & {
  estimate: ReturnType<typeof calculateIndicativeEstimate>;
}) {
  const lines: string[] = [];
  lines.push('VectorCodex pricing calculator enquiry');
  lines.push(`Services: ${payload.allServices.map((id) => getService(id).title).join(' + ')}`);
  lines.push(`Estimate mode: ${payload.estimate.label}`);
  lines.push('');
  lines.push('— Business —');
  for (const [key, value] of Object.entries(payload.businessAnswers)) {
    lines.push(`${key}: ${formatAnswerValue(value)}`);
  }
  for (const serviceId of payload.allServices) {
    lines.push('');
    lines.push(`— ${getService(serviceId).title} —`);
    const answers = payload.serviceAnswers[serviceId] ?? {};
    for (const [key, value] of Object.entries(answers)) {
      lines.push(`${key}: ${formatAnswerValue(value)}`);
    }
  }
  lines.push('');
  lines.push('— Contact —');
  for (const [key, value] of Object.entries(payload.contactAnswers)) {
    if (key === 'consent' || key === 'human_check') continue;
    lines.push(`${key}: ${formatAnswerValue(value)}`);
  }
  return lines.join('\n');
}

export async function submitPricingEnquiry(
  endpoint: string,
  payload: PricingEnquiryPayload,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!endpoint.trim()) {
    return {
      ok: false,
      message:
        'Submissions are not connected yet. Set PUBLIC_CONTACT_ENDPOINT to a secure server endpoint that emails VectorCodex and sends the visitor an acknowledgement.',
    };
  }

  try {
    const body = new FormData();
    body.set('form_type', payload.form_type);
    body.set('primary_service', payload.primaryService);
    body.set('additional_services', payload.additionalServices.join(','));
    body.set('all_services', payload.allServices.join(','));
    body.set('summary', payload.summaryText);
    body.set('estimate_label', payload.estimate.label);
    body.set('submitted_at', payload.submittedAt);
    body.set('payload_json', JSON.stringify(payload));
    body.set('name', String(payload.contactAnswers.fullName ?? ''));
    body.set('email', String(payload.contactAnswers.email ?? ''));
    body.set('phone', String(payload.contactAnswers.phone ?? ''));
    body.set('company', String(payload.contactAnswers.company ?? ''));

    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return {
        ok: false,
        message: 'We could not send your project brief. Please try again in a moment.',
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'Network error while sending your project brief. Please check your connection and try again.',
    };
  }
}
