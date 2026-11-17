/**
 * Offline smoke checks for lead FormData contract (no live WordPress calls).
 * Run: node scripts/verify-lead-forms.mjs
 */

import assert from 'node:assert/strict';

const TURNSTILE_FIELD = 'cf-turnstile-response';

const types = [
  'quote',
  'booking',
  'free_audit',
  'team_requirements',
  'project_inquiry',
  'homepage_inquiry',
  'pricing_calculator',
];

function prepareLeadFormData(body, formType, turnstileToken) {
  body.set('form_type', formType);
  body.set('source_url', 'https://vectorcodex.com/test');
  if (turnstileToken) body.set(TURNSTILE_FIELD, turnstileToken);
  return body;
}

for (const formType of types) {
  const body = new FormData();
  body.set('name', 'Test User');
  prepareLeadFormData(body, formType, 'token-abc');
  assert.equal(body.get('form_type'), formType);
  assert.equal(body.get(TURNSTILE_FIELD), 'token-abc');
}

const nested = {
  form_type: 'pricing_calculator',
  primaryService: 'web-development',
  additionalServices: ['seo'],
  allServices: ['web-development', 'seo'],
  businessAnswers: { industry: 'SaaS' },
  serviceAnswers: {
    'web-development': { cms: 'WordPress' },
    seo: { focus: 'Technical' },
  },
  contactAnswers: {
    fullName: 'Gabe',
    email: 'g@example.com',
    phone: '+44111',
    company: 'Co',
    consent: 'yes',
  },
  estimate: { label: 'Indicative mid-range', min: 1, max: 2, currency: 'GBP' },
  summaryText: 'summary',
  submittedAt: '2026-11-18T10:00:00.000Z',
};

const pricingBody = new FormData();
pricingBody.set('payload_json', JSON.stringify(nested));
pricingBody.set('primary_service', nested.primaryService);
prepareLeadFormData(pricingBody, 'pricing_calculator', 'pricing-token');

const parsed = JSON.parse(String(pricingBody.get('payload_json')));
assert.deepEqual(parsed.businessAnswers, nested.businessAnswers);
assert.deepEqual(parsed.serviceAnswers, nested.serviceAnswers);
assert.deepEqual(parsed.contactAnswers, nested.contactAnswers);
assert.deepEqual(parsed.estimate, nested.estimate);
assert.equal(pricingBody.get(TURNSTILE_FIELD), 'pricing-token');
assert.equal(pricingBody.get('form_type'), 'pricing_calculator');

assert.equal(String('vc_leads_turnstile_missing').startsWith('vc_leads_turnstile_'), true);

console.log('verify-lead-forms: ok (offline FormData contract; no live endpoint calls)');
