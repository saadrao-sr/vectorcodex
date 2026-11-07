import type { StepDef } from './types';

export const INDUSTRY_OPTIONS = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'travel', label: 'Travel' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'education', label: 'Education' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'other', label: 'Other' },
] as const;

export const businessSteps: StepDef[] = [
  {
    id: 'business-profile',
    title: 'About your business',
    description: 'These details help us tailor the proposal to your market and goals.',
    fields: [
      {
        id: 'companyName',
        label: 'Company / business name',
        type: 'text',
        required: true,
        placeholder: 'Your company name',
      },
      {
        id: 'industry',
        label: 'Industry / business sector',
        type: 'select',
        required: true,
        options: [...INDUSTRY_OPTIONS],
      },
      {
        id: 'industryOther',
        label: 'Tell us your industry',
        type: 'text',
        required: true,
        placeholder: 'Your industry',
        showIf: (a) => a.industry === 'other',
      },
      {
        id: 'businessType',
        label: 'Business type',
        type: 'single',
        required: true,
        options: [
          { value: 'b2b', label: 'B2B' },
          { value: 'b2c', label: 'B2C' },
          { value: 'both', label: 'B2B & B2C' },
        ],
      },
    ],
  },
  {
    id: 'business-market',
    title: 'Market and goals',
    description: 'Share where you operate and what success looks like.',
    fields: [
      {
        id: 'websiteUrl',
        label: 'Business website URL',
        help: 'Optional if you do not have a live site yet.',
        type: 'url',
        placeholder: 'https://example.com',
      },
      {
        id: 'targetMarket',
        label: 'Target market / location',
        type: 'text',
        required: true,
        placeholder: 'e.g. United Kingdom, UAE, Global',
      },
      {
        id: 'primaryGoal',
        label: 'Primary business goal',
        type: 'textarea',
        required: true,
        placeholder: 'What should this engagement achieve in the next 6–12 months?',
      },
    ],
  },
];
