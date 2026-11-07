import type { IndustryProcessStep, IndustryServiceLink } from './types';

export const sharedProcessSteps: IndustryProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    text: 'We learn your services, locations, audiences, competitive context, and current digital foundations.',
  },
  {
    number: '02',
    title: 'Research',
    text: 'We review search demand, journey friction, site quality, and channel opportunities that matter for your sector.',
  },
  {
    number: '03',
    title: 'Strategise',
    text: 'We shape a practical roadmap connecting SEO, website, and marketing work to clear business priorities.',
  },
  {
    number: '04',
    title: 'Execute',
    text: 'Our team delivers the agreed scope with clear ownership across search, development, and campaigns.',
  },
  {
    number: '05',
    title: 'Grow',
    text: 'We refine based on performance signals so channels keep improving after launch.',
  },
];

/** Standard service grid used across industry landings — every href is a live route. */
export function industryServiceLinks(copy: {
  seo: string;
  localSeo: string;
  technicalSeo: string;
  web: string;
  wordpress: string;
  shopify: string;
  social: string;
  content: string;
  ppc: string;
}): IndustryServiceLink[] {
  return [
    { label: 'SEO', href: '/services/seo/', description: copy.seo },
    { label: 'Local SEO', href: '/services/seo/local-seo/', description: copy.localSeo },
    { label: 'Technical SEO', href: '/services/seo/technical-seo/', description: copy.technicalSeo },
    { label: 'Web Development', href: '/services/web-development/', description: copy.web },
    {
      label: 'WordPress Development',
      href: '/services/web-development/wordpress-development/',
      description: copy.wordpress,
    },
    {
      label: 'Shopify Development',
      href: '/services/web-development/shopify-development/',
      description: copy.shopify,
    },
    {
      label: 'Social Media Marketing',
      href: '/services/social-media-marketing/',
      description: copy.social,
    },
    {
      label: 'Content Creation',
      href: '/services/social-media-marketing/content-creation/',
      description: copy.content,
    },
    { label: 'PPC Management', href: '/services/ppc-management/', description: copy.ppc },
  ];
}

export function withDiscoverStep(
  steps: IndustryProcessStep[],
  discoverText: string,
): IndustryProcessStep[] {
  return steps.map((step, index) => (index === 0 ? { ...step, text: discoverText } : step));
}
