import type { StepDef } from './types';

export const ppcSteps: StepDef[] = [
  {
    id: 'ppc-platforms',
    title: 'Platforms and campaigns',
    fields: [
      {
        id: 'platforms',
        label: 'Advertising platforms',
        type: 'multi',
        required: true,
        options: [
          { value: 'google', label: 'Google Ads' },
          { value: 'linkedin', label: 'LinkedIn Ads' },
          { value: 'microsoft', label: 'Microsoft Ads' },
          { value: 'youtube', label: 'YouTube' },
        ],
      },
      {
        id: 'campaignTypes',
        label: 'Campaign types required',
        type: 'multi',
        required: true,
        options: [
          { value: 'search', label: 'Search' },
          { value: 'display', label: 'Display' },
          { value: 'pmax', label: 'Performance Max' },
          { value: 'shopping', label: 'Shopping' },
          { value: 'video', label: 'Video' },
          { value: 'lead', label: 'Lead generation' },
        ],
      },
      {
        id: 'campaignCount',
        label: 'Number of campaigns',
        type: 'select',
        required: true,
        options: [
          { value: '1-2', label: '1–2' },
          { value: '3-5', label: '3–5' },
          { value: '6-10', label: '6–10' },
          { value: '10+', label: '10+' },
        ],
      },
    ],
  },
  {
    id: 'ppc-audience',
    title: 'Audience and spend',
    fields: [
      {
        id: 'targetLocations',
        label: 'Target countries / locations',
        type: 'text',
        required: true,
        placeholder: 'e.g. United Kingdom, UAE',
      },
      {
        id: 'targetAudience',
        label: 'Target audience',
        type: 'textarea',
        required: true,
        placeholder: 'Who should these campaigns reach?',
      },
      {
        id: 'monthlySpend',
        label: 'Estimated monthly advertising spend',
        type: 'select',
        required: true,
        options: [
          { value: 'under-1k', label: 'Under £1,000' },
          { value: '1k-3k', label: '£1,000–£3,000' },
          { value: '3k-10k', label: '£3,000–£10,000' },
          { value: '10k+', label: '£10,000+' },
          { value: 'unsure', label: 'Not sure yet' },
        ],
      },
      {
        id: 'objectives',
        label: 'Campaign objectives',
        type: 'multi',
        required: true,
        options: [
          { value: 'leads', label: 'Leads' },
          { value: 'sales', label: 'Sales' },
          { value: 'traffic', label: 'Traffic' },
          { value: 'awareness', label: 'Awareness' },
          { value: 'app', label: 'App Installs' },
        ],
      },
    ],
  },
  {
    id: 'ppc-conversion',
    title: 'Landing pages and tracking',
    fields: [
      {
        id: 'landingPages',
        label: 'Landing page requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'existing', label: 'Use existing pages' },
          { value: 'new', label: 'Need new landing pages' },
          { value: 'both', label: 'Mix of both' },
        ],
      },
      {
        id: 'conversionTracking',
        label: 'Conversion tracking requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'setup', label: 'Need full setup' },
          { value: 'review', label: 'Review / improve existing' },
          { value: 'ready', label: 'Already in place' },
        ],
      },
      {
        id: 'analyticsSetup',
        label: 'Google Analytics / Tag Manager setup',
        type: 'single',
        required: true,
        options: [
          { value: 'needed', label: 'Needed' },
          { value: 'review', label: 'Review existing' },
          { value: 'ready', label: 'Already configured' },
        ],
      },
      {
        id: 'remarketing',
        label: 'Remarketing requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
    ],
  },
  {
    id: 'ppc-ops',
    title: 'Creatives, optimisation and reporting',
    fields: [
      {
        id: 'creatives',
        label: 'Creative and ad copy requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'client', label: 'We supply creatives' },
          { value: 'support', label: 'Need creative support' },
          { value: 'full', label: 'Full creative production' },
        ],
      },
      {
        id: 'optimisation',
        label: 'Campaign optimisation frequency',
        type: 'single',
        required: true,
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'monthly', label: 'Monthly' },
        ],
      },
      {
        id: 'reporting',
        label: 'Monthly reporting requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'standard', label: 'Standard monthly report' },
          { value: 'detailed', label: 'Detailed performance reviews' },
          { value: 'live', label: 'Shared live dashboards' },
        ],
      },
      {
        id: 'crmIntegration',
        label: 'CRM integration requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'needed', label: 'Needed' },
          { value: 'existing', label: 'Improve existing setup' },
        ],
      },
    ],
  },
];
