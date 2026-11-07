import type { StepDef } from './types';

export const seoSteps: StepDef[] = [
  {
    id: 'seo-site',
    title: 'Your website',
    fields: [
      {
        id: 'currentUrl',
        label: 'Current website URL',
        type: 'url',
        required: true,
        placeholder: 'https://example.com',
      },
      {
        id: 'websiteType',
        label: 'Website type',
        type: 'single',
        required: true,
        options: [
          { value: 'business', label: 'Business' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'service', label: 'Service-based' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'pageCount',
        label: 'Approximate website size / number of pages',
        type: 'select',
        required: true,
        options: [
          { value: '1-10', label: '1–10 pages' },
          { value: '11-30', label: '11–30 pages' },
          { value: '31-100', label: '31–100 pages' },
          { value: '100+', label: '100+ pages' },
        ],
      },
      {
        id: 'seoStatus',
        label: 'Current SEO status',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'No SEO work yet' },
          { value: 'basic', label: 'Basic / occasional SEO' },
          { value: 'active', label: 'Active ongoing SEO' },
          { value: 'agency', label: 'Managed by another agency' },
        ],
      },
    ],
  },
  {
    id: 'seo-targets',
    title: 'Targets and locations',
    fields: [
      {
        id: 'targetLocations',
        label: 'Target locations and countries',
        type: 'text',
        required: true,
        placeholder: 'e.g. London, UK & Dubai, UAE',
      },
      {
        id: 'needsLocalSeo',
        label: 'Do you need Local SEO?',
        type: 'single',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'localLocationCount',
        label: 'Number of locations requiring Local SEO',
        type: 'number',
        required: true,
        min: 1,
        max: 500,
        showIf: (a) => a.needsLocalSeo === 'yes',
      },
      {
        id: 'keywordScope',
        label: 'Target keywords or keyword quantity',
        type: 'select',
        required: true,
        options: [
          { value: 'up-to-20', label: 'Up to 20 keywords' },
          { value: '21-50', label: '21–50 keywords' },
          { value: '51-100', label: '51–100 keywords' },
          { value: '100+', label: '100+ keywords' },
          { value: 'unsure', label: 'Not sure yet' },
        ],
      },
    ],
  },
  {
    id: 'seo-content',
    title: 'Content and technical scope',
    fields: [
      {
        id: 'monthlyBlogs',
        label: 'Monthly blog / content requirements',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'None' },
          { value: '1-2', label: '1–2 pieces / month' },
          { value: '3-4', label: '3–4 pieces / month' },
          { value: '5+', label: '5+ pieces / month' },
        ],
      },
      {
        id: 'landingPages',
        label: 'New landing pages required',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'None' },
          { value: 'monthly-1-2', label: '1–2 per month' },
          { value: 'quarterly-3-5', label: '3–5 per quarter' },
          { value: 'custom', label: 'Custom volume' },
        ],
      },
      {
        id: 'linkBuilding',
        label: 'Link building requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'light', label: 'Light / selective' },
          { value: 'ongoing', label: 'Ongoing programme' },
        ],
      },
      {
        id: 'technicalSeo',
        label: 'Technical SEO requirements',
        type: 'multi',
        options: [
          { value: 'audit', label: 'Full technical audit' },
          { value: 'speed', label: 'Speed / Core Web Vitals' },
          { value: 'indexation', label: 'Indexation / crawl fixes' },
          { value: 'schema', label: 'Structured data' },
          { value: 'migrations', label: 'Migration support' },
        ],
      },
    ],
  },
  {
    id: 'seo-extras',
    title: 'Research, AI search and extras',
    fields: [
      {
        id: 'competitorResearch',
        label: 'Competitor research requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'basic', label: 'Basic overview' },
          { value: 'detailed', label: 'Detailed competitor set' },
        ],
      },
      {
        id: 'aiSeo',
        label: 'AI SEO / AEO / GEO requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'advisory', label: 'Advisory / readiness' },
          { value: 'active', label: 'Active AI search optimisation' },
        ],
      },
      {
        id: 'seoAddons',
        label: 'Additional SEO-related services',
        type: 'multi',
        options: [
          { value: 'gbp', label: 'Google Business Profile' },
          { value: 'content', label: 'Content writing' },
          { value: 'pr', label: 'Digital PR' },
          { value: 'maintenance', label: 'Website maintenance' },
        ],
      },
      {
        id: 'seoChallenges',
        label: 'Current SEO challenges and primary goals',
        type: 'textarea',
        required: true,
        placeholder: 'What is blocking growth today, and what would success look like?',
      },
    ],
  },
];
