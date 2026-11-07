import type { StepDef } from './types';

export const socialSteps: StepDef[] = [
  {
    id: 'social-platforms',
    title: 'Platforms and accounts',
    fields: [
      {
        id: 'platforms',
        label: 'Social platforms required',
        type: 'multi',
        required: true,
        options: [
          { value: 'facebook', label: 'Facebook' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'tiktok', label: 'TikTok' },
          { value: 'youtube', label: 'YouTube' },
          { value: 'x', label: 'X' },
        ],
      },
      {
        id: 'accountCount',
        label: 'Number of accounts',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
      },
      {
        id: 'publishingFrequency',
        label: 'Monthly publishing frequency',
        type: 'select',
        required: true,
        options: [
          { value: 'light', label: 'Light (a few posts / week)' },
          { value: 'steady', label: 'Steady (most weekdays)' },
          { value: 'high', label: 'High (daily / multi-daily)' },
        ],
      },
    ],
  },
  {
    id: 'social-volume',
    title: 'Content volume',
    fields: [
      {
        id: 'staticPosts',
        label: 'Monthly static posts required',
        type: 'select',
        required: true,
        options: [
          { value: '0', label: 'None' },
          { value: '4-8', label: '4–8' },
          { value: '9-16', label: '9–16' },
          { value: '17+', label: '17+' },
        ],
      },
      {
        id: 'videoPosts',
        label: 'Monthly video / animation posts',
        type: 'select',
        required: true,
        options: [
          { value: '0', label: 'None' },
          { value: '1-4', label: '1–4' },
          { value: '5-8', label: '5–8' },
          { value: '9+', label: '9+' },
        ],
      },
      {
        id: 'reels',
        label: 'Monthly reels / short-form videos',
        type: 'select',
        required: true,
        options: [
          { value: '0', label: 'None' },
          { value: '1-4', label: '1–4' },
          { value: '5-12', label: '5–12' },
          { value: '13+', label: '13+' },
        ],
      },
      {
        id: 'stories',
        label: 'Stories requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'daily', label: 'Daily / near-daily' },
        ],
      },
    ],
  },
  {
    id: 'social-production',
    title: 'Production and management',
    fields: [
      {
        id: 'contentCreation',
        label: 'Content creation requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'client', label: 'We supply assets' },
          { value: 'mixed', label: 'Mixed / collaborative' },
          { value: 'full', label: 'Full content production' },
        ],
      },
      {
        id: 'copywriting',
        label: 'Caption and copywriting requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'support', label: 'Support needed' },
          { value: 'full', label: 'Full copywriting' },
        ],
      },
      {
        id: 'graphicDesign',
        label: 'Graphic design requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'templates', label: 'Template-led design' },
          { value: 'custom', label: 'Custom creative' },
        ],
      },
      {
        id: 'community',
        label: 'Community management requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'business-hours', label: 'Business hours' },
          { value: 'extended', label: 'Extended coverage' },
        ],
      },
    ],
  },
  {
    id: 'social-ads',
    title: 'Ads, shoots and extras',
    fields: [
      {
        id: 'paidSocial',
        label: 'Paid social advertising requirements',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'boost', label: 'Boost / light spend' },
          { value: 'full', label: 'Full campaign management' },
        ],
      },
      {
        id: 'shoots',
        label: 'Video / photo shoots required',
        type: 'single',
        required: true,
        options: [
          { value: 'none', label: 'Not needed' },
          { value: 'occasional', label: 'Occasional' },
          { value: 'monthly', label: 'Monthly' },
        ],
      },
      {
        id: 'contentLanguage',
        label: 'Content language requirements',
        type: 'text',
        required: true,
        placeholder: 'e.g. English, Arabic',
      },
      {
        id: 'socialExtras',
        label: 'Additional services required',
        type: 'multi',
        options: [
          { value: 'influencer', label: 'Influencer coordination' },
          { value: 'ugc', label: 'UGC sourcing' },
          { value: 'reporting', label: 'Advanced reporting' },
          { value: 'strategy', label: 'Quarterly strategy workshops' },
        ],
      },
    ],
  },
];
