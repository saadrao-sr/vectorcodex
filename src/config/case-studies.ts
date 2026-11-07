import type { CaseStudy } from '../types/content';

const placeholderSections = (kind: string): CaseStudy['sections'] => [
  {
    heading: 'The brief',
    body: `The client, market, and constraints for this ${kind} will be added when an engagement is cleared for publication.`,
  },
  {
    heading: 'The work',
    body: 'This section will describe the scope that was delivered. It will not include estimated or unverified figures.',
  },
  {
    heading: 'Publication standard',
    body: 'Rankings, traffic, revenue, and testimonials are omitted until they can be sourced and approved.',
  },
];

const showcaseImage = {
  src: '/images/hero-tech.jpg',
  alt: '',
  width: 1920,
  height: 1080,
};

/**
 * Single source for `/case-studies/` listing, detail pages, and the homepage carousel.
 * Add approved metrics via `results` only when verified.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'seo-engagement',
    path: '/case-studies/seo-engagement/',
    title: 'SEO engagement',
    summary: 'A published SEO case study will replace this placeholder.',
    service: 'SEO',
    sector: 'To be confirmed',
    placeholder: true,
    sections: placeholderSections('SEO engagement'),
    image: { ...showcaseImage, alt: 'SEO engagement case study cover' },
  },
  {
    slug: 'website-build',
    path: '/case-studies/website-build/',
    title: 'Website build',
    summary: 'A published web development case study will replace this placeholder.',
    service: 'Web development',
    sector: 'To be confirmed',
    placeholder: true,
    sections: placeholderSections('website build'),
    image: { ...showcaseImage, alt: 'Website build case study cover' },
  },
  {
    slug: 'marketing-programme',
    path: '/case-studies/marketing-programme/',
    title: 'Marketing programme',
    summary: 'A published digital marketing case study will replace this placeholder.',
    service: 'Social Media Marketing',
    sector: 'To be confirmed',
    placeholder: true,
    sections: placeholderSections('marketing programme'),
    image: { ...showcaseImage, alt: 'Marketing programme case study cover' },
  },
  {
    slug: 'ecommerce-project',
    path: '/case-studies/ecommerce-project/',
    title: 'E-commerce project',
    summary: 'A published e-commerce case study will replace this placeholder.',
    service: 'E-commerce',
    sector: 'To be confirmed',
    placeholder: true,
    sections: placeholderSections('e-commerce project'),
    image: { ...showcaseImage, alt: 'E-commerce project case study cover' },
  },
  {
    slug: 'ppc-programme',
    path: '/case-studies/ppc-programme/',
    title: 'PPC programme',
    summary: 'A published PPC case study will replace this placeholder.',
    service: 'PPC',
    sector: 'To be confirmed',
    placeholder: true,
    sections: placeholderSections('PPC programme'),
    image: { ...showcaseImage, alt: 'PPC programme case study cover' },
  },
];

export function getCaseStudy(slug: string) {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) throw new Error(`Unknown case study: ${slug}`);
  return study;
}

/** Homepage showcase — same records as the case studies page. */
export function getHomepageCaseStudies(limit = caseStudies.length) {
  return caseStudies.slice(0, Math.max(0, limit));
}
