import type { StepDef } from './types';

export const webSteps: StepDef[] = [
  {
    id: 'web-type',
    title: 'Website type',
    fields: [
      {
        id: 'siteType',
        label: 'Website type',
        type: 'single',
        required: true,
        options: [
          { value: 'business', label: 'Business Website' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'portfolio', label: 'Portfolio' },
          { value: 'booking', label: 'Booking Website' },
          { value: 'custom-app', label: 'Custom Web Application' },
        ],
      },
      {
        id: 'buildType',
        label: 'New website or redesign?',
        type: 'single',
        required: true,
        options: [
          { value: 'new', label: 'New website' },
          { value: 'redesign', label: 'Redesign / rebuild' },
        ],
      },
      {
        id: 'existingUrl',
        label: 'Existing website URL',
        type: 'url',
        placeholder: 'https://example.com',
        showIf: (a) => a.buildType === 'redesign',
      },
      {
        id: 'pageCount',
        label: 'Approximate number of pages',
        type: 'select',
        required: true,
        options: [
          { value: '1-5', label: '1–5 pages' },
          { value: '6-15', label: '6–15 pages' },
          { value: '16-40', label: '16–40 pages' },
          { value: '40+', label: '40+ pages' },
        ],
      },
      {
        id: 'productCount',
        label: 'Approximate number of products',
        type: 'select',
        required: true,
        showIf: (a) => a.siteType === 'ecommerce',
        options: [
          { value: '1-50', label: '1–50 products' },
          { value: '51-250', label: '51–250 products' },
          { value: '251-1000', label: '251–1,000 products' },
          { value: '1000+', label: '1,000+ products' },
        ],
      },
    ],
  },
  {
    id: 'web-features',
    title: 'Features and platform',
    fields: [
      {
        id: 'features',
        label: 'Required features',
        type: 'multi',
        options: [
          { value: 'forms', label: 'Contact Forms' },
          { value: 'booking', label: 'Booking' },
          { value: 'membership', label: 'Membership' },
          { value: 'accounts', label: 'User Accounts' },
          { value: 'payments', label: 'Payment Gateway' },
          { value: 'api', label: 'API Integrations' },
          { value: 'crm', label: 'CRM' },
          { value: 'inventory', label: 'Inventory Management' },
        ],
      },
      {
        id: 'platform',
        label: 'Preferred platform',
        type: 'single',
        required: true,
        options: [
          { value: 'wordpress', label: 'WordPress' },
          { value: 'woocommerce', label: 'WooCommerce' },
          { value: 'shopify', label: 'Shopify' },
          { value: 'custom', label: 'Custom Development' },
          { value: 'unsure', label: 'Not Sure' },
        ],
      },
      {
        id: 'designPreference',
        label: 'Design preference',
        type: 'single',
        required: true,
        options: [
          { value: 'template', label: 'Template-based' },
          { value: 'custom', label: 'Custom Design' },
          { value: 'premium', label: 'Premium Custom Design' },
        ],
      },
      {
        id: 'branding',
        label: 'Branding / logo availability',
        type: 'single',
        required: true,
        options: [
          { value: 'ready', label: 'Ready to use' },
          { value: 'partial', label: 'Partial / needs polish' },
          { value: 'needed', label: 'Need branding support' },
        ],
      },
    ],
  },
  {
    id: 'web-content',
    title: 'Content, languages and integrations',
    fields: [
      {
        id: 'copywriting',
        label: 'Content and copywriting requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'client', label: 'We will supply content' },
          { value: 'support', label: 'Need copywriting support' },
          { value: 'full', label: 'Full content production' },
        ],
      },
      {
        id: 'languages',
        label: 'Languages required',
        type: 'text',
        required: true,
        placeholder: 'e.g. English, Arabic',
      },
      {
        id: 'integrations',
        label: 'Third-party integrations',
        type: 'textarea',
        placeholder: 'CRM, payment tools, booking systems, analytics…',
      },
      {
        id: 'hosting',
        label: 'Hosting and domain requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'have', label: 'We already have hosting / domain' },
          { value: 'need', label: 'Need hosting guidance' },
          { value: 'managed', label: 'Prefer managed hosting' },
        ],
      },
    ],
  },
  {
    id: 'web-launch',
    title: 'Maintenance and timeline',
    fields: [
      {
        id: 'maintenance',
        label: 'Ongoing maintenance requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'basic', label: 'Basic updates & security' },
          { value: 'full', label: 'Full ongoing support' },
        ],
      },
      {
        id: 'timeline',
        label: 'Expected launch timeline',
        type: 'select',
        required: true,
        options: [
          { value: 'asap', label: 'ASAP' },
          { value: '1-2-months', label: '1–2 months' },
          { value: '3-4-months', label: '3–4 months' },
          { value: 'flexible', label: 'Flexible' },
        ],
      },
    ],
  },
];
