/**
 * Desktop Services mega menu + mobile services accordion.
 * Child links come from publishedServiceChildren — parent-only capabilities stay on landing pages.
 */
import { publishedServiceChildren } from './published-service-children';

export type MegaMenuLink = {
  label: string;
  href: string;
};

export type MegaMenuCategory = {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Parent service page for the category */
  href: string;
  icon: 'search' | 'code' | 'share' | 'megaphone';
  links: MegaMenuLink[];
};

export const megaMenuCategories: MegaMenuCategory[] = [
  {
    id: 'seo',
    number: '01',
    title: 'SEO Services',
    description: 'Organic visibility, technical foundations, and search systems that scale.',
    href: '/services/seo/',
    icon: 'search',
    links: [...publishedServiceChildren.seo],
  },
  {
    id: 'web',
    number: '02',
    title: 'Web Development',
    description: 'Fast, conversion-focused websites built for performance and growth.',
    href: '/services/web-development/',
    icon: 'code',
    links: [...publishedServiceChildren.web],
  },
  {
    id: 'social',
    number: '03',
    title: 'Social Media Marketing',
    description: 'Strategy, content, and paid social that strengthen brand presence.',
    href: '/services/social-media-marketing/',
    icon: 'share',
    links: [...publishedServiceChildren.social],
  },
  {
    id: 'ppc',
    number: '04',
    title: 'PPC Management',
    description: 'High-intent paid campaigns with clear tracking and measurable outcomes.',
    href: '/services/ppc-management/',
    icon: 'megaphone',
    links: [...publishedServiceChildren.ppc],
  },
];

export const megaMenuFeatured = {
  label: 'Your Digital Growth Partner',
  heading: 'Everything Your Business Needs to Grow Online.',
  text: 'Combine SEO, web development, and digital marketing into one clear growth system — planned, built, and measured together.',
  ctaLabel: 'Explore All Services',
  ctaHref: '/services/',
} as const;
