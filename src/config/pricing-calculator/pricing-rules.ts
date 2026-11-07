import type { Answers, ServiceId } from './types';

/**
 * Central pricing rules hook.
 * Leave `enabled` false until verified pricing rules are approved.
 * When enabled, return an indicative estimate from selected requirements.
 */
export const pricingRulesConfig = {
  enabled: false,
  currency: 'GBP',
  disclaimer:
    'Any calculated amount is an estimate only. Final pricing depends on project scope and review.',
} as const;

export type IndicativeEstimate = {
  amount: number | null;
  currency: string;
  label: string;
  disclaimer: string;
};

export function calculateIndicativeEstimate(_input: {
  services: ServiceId[];
  businessAnswers: Answers;
  serviceAnswers: Partial<Record<ServiceId, Answers>>;
}): IndicativeEstimate {
  if (!pricingRulesConfig.enabled) {
    return {
      amount: null,
      currency: pricingRulesConfig.currency,
      label: 'Personalised quotation',
      disclaimer:
        'We will review your requirements and prepare a tailored proposal. No instant price is shown until verified pricing rules are configured.',
    };
  }

  // Placeholder for future verified rules — do not invent package prices here.
  return {
    amount: null,
    currency: pricingRulesConfig.currency,
    label: 'Personalised quotation',
    disclaimer: pricingRulesConfig.disclaimer,
  };
}
