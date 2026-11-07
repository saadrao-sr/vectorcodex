/**
 * Homepage client testimonials.
 * Edit these placeholders only after quotes are sourced and approved.
 * Do not publish invented names, companies, photos, or ratings.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  /** Optional path under /public when a verified logo or avatar is available. */
  logoSrc?: string;
  logoAlt?: string;
  /** True until replaced with an approved client quote. */
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: 'placeholder-1',
    quote:
      '[Placeholder] Replace with approved client feedback describing the engagement, outcome, and working relationship.',
    name: 'Client Name',
    role: 'Role / Title',
    company: 'Company Name',
    initials: 'CN',
    placeholder: true,
  },
  {
    id: 'placeholder-2',
    quote:
      '[Placeholder] Replace with approved client feedback on strategy, delivery quality, and communication.',
    name: 'Client Name',
    role: 'Role / Title',
    company: 'Company Name',
    initials: 'CN',
    placeholder: true,
  },
  {
    id: 'placeholder-3',
    quote:
      '[Placeholder] Replace with approved client feedback covering results, process clarity, and next steps.',
    name: 'Client Name',
    role: 'Role / Title',
    company: 'Company Name',
    initials: 'CN',
    placeholder: true,
  },
  {
    id: 'placeholder-4',
    quote:
      '[Placeholder] Replace with approved client feedback about website, SEO, or marketing collaboration.',
    name: 'Client Name',
    role: 'Role / Title',
    company: 'Company Name',
    initials: 'CN',
    placeholder: true,
  },
  {
    id: 'placeholder-5',
    quote:
      '[Placeholder] Replace with approved client feedback once permission and final wording are confirmed.',
    name: 'Client Name',
    role: 'Role / Title',
    company: 'Company Name',
    initials: 'CN',
    placeholder: true,
  },
];
