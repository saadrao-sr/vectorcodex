import { childLabels } from '../published-service-children';
import { businessSteps } from './common';
import { contactSteps } from './contact';
import { ppcSteps } from './ppc';
import { seoSteps } from './seo';
import { socialSteps } from './social';
import type { Answers, FieldDef, ServiceDef, ServiceId, StepDef } from './types';
import { webSteps } from './web';

export * from './types';
export * from './pricing-rules';
export { businessSteps, INDUSTRY_OPTIONS } from './common';
export { contactSteps } from './contact';

const seoChildren = childLabels('seo');
const webChildren = childLabels('web');
const socialChildren = childLabels('social');

export const services: ServiceDef[] = [
  {
    id: 'seo',
    title: 'SEO Services',
    shortTitle: 'SEO',
    description: `${seoChildren.join(', ')}.`,
    includes: seoChildren,
    icon: 'search',
    accent: 'from-highlight/18 via-transparent to-transparent',
    cta: 'Calculate My Cost',
    steps: seoSteps,
  },
  {
    id: 'web',
    title: 'Website Development',
    shortTitle: 'Web',
    description: `${webChildren.join(', ')}.`,
    includes: webChildren,
    icon: 'code',
    accent: 'from-lime/16 via-transparent to-transparent',
    cta: 'Calculate My Cost',
    steps: webSteps,
  },
  {
    id: 'social',
    title: 'Social Media Marketing',
    shortTitle: 'Social',
    description: `${socialChildren.join(', ')}.`,
    includes: socialChildren,
    icon: 'megaphone',
    accent: 'from-gold/14 via-transparent to-transparent',
    cta: 'Calculate My Cost',
    steps: socialSteps,
  },
  {
    id: 'ppc',
    title: 'PPC Management',
    shortTitle: 'PPC',
    description: 'Google Ads campaign management with clear tracking and accountable optimisation.',
    includes: ['PPC Management'],
    icon: 'target',
    accent: 'from-cta/12 via-transparent to-transparent',
    cta: 'Calculate My Cost',
    steps: ppcSteps,
  },
];

export function getService(id: ServiceId) {
  const service = services.find((item) => item.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

export function visibleFields(fields: FieldDef[], answers: Answers) {
  return fields.filter((field) => !field.showIf || field.showIf(answers));
}

export function validateStep(step: StepDef, answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of visibleFields(step.fields, answers)) {
    if (!field.required) continue;
    const value = answers[field.id];
    if (field.type === 'multi') {
      if (!Array.isArray(value) || value.length === 0) {
        errors[field.id] = 'Select at least one option.';
      }
      continue;
    }
    if (field.type === 'number') {
      const num = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(num)) {
        errors[field.id] = 'Enter a valid number.';
      } else if (field.min != null && num < field.min) {
        errors[field.id] = `Enter at least ${field.min}.`;
      } else if (field.max != null && num > field.max) {
        errors[field.id] = `Enter at most ${field.max}.`;
      }
      continue;
    }
    if (field.type === 'email') {
      const email = String(value ?? '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors[field.id] = 'Enter a valid email address.';
      }
      continue;
    }
    if (field.type === 'url') {
      const url = String(value ?? '').trim();
      if (!url) {
        errors[field.id] = 'Enter a website URL.';
      }
      continue;
    }
    if (field.id === 'human_check' && value !== 'yes') {
      errors[field.id] = 'Confirm you are not a robot to continue.';
      continue;
    }
    if (field.id === 'consent' && value !== 'yes') {
      errors[field.id] = 'Consent is required to submit this enquiry.';
      continue;
    }
    if (String(value ?? '').trim().length < 1) {
      errors[field.id] = 'This field is required.';
    }
  }
  return errors;
}

export function formatAnswerValue(value: AnswerValue | undefined): string {
  if (value == null) return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  const text = String(value).trim();
  return text || '—';
}

type AnswerValue = Answers[string];
