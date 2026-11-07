/**
 * Homepage results figures.
 * Edit these placeholders as verified data becomes available.
 * Do not present unverified claims as established facts.
 */
export const resultsStats = [
  {
    id: 'projects',
    value: 50,
    suffix: '+',
    label: 'Projects Delivered',
    detail: 'Placeholder figure — update when verified.',
    icon: 'briefcase' as const,
    featured: true,
  },
  {
    id: 'experience',
    value: 8,
    suffix: '+',
    label: 'Years of Digital Experience',
    detail: 'Placeholder figure — update when verified.',
    icon: 'calendar' as const,
    featured: false,
  },
  {
    id: 'services',
    value: 4,
    suffix: '+',
    label: 'Digital Service Areas',
    detail: 'Placeholder figure — update when verified.',
    icon: 'layers' as const,
    featured: false,
  },
  {
    id: 'quality',
    value: 100,
    suffix: '%',
    label: 'Commitment to Quality',
    detail: 'Placeholder figure — update when verified.',
    icon: 'sparkles' as const,
    featured: false,
  },
] as const;
