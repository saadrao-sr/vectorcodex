import { DEFAULT_SITE_URL } from './defaults';

function siteUrl() {
  const value = import.meta.env.SITE_URL || DEFAULT_SITE_URL;
  return value.replace(/\/$/, '');
}

export const site = {
  name: 'VectorCodex',
  url: siteUrl(),
  locale: 'en-GB',
  description:
    'VectorCodex is a UK-focused digital agency specialising in SEO, web development, and digital marketing.',
  email: 'info@vectorcodex.com',
  telephone: '',
  /** Verified WhatsApp used across contact CTAs. */
  whatsapp: '923185730513',
  address: null as null | {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  },
  /**
   * Sticky sidebar + footer social links.
   * Placeholder platform homepages for now — replace `href` with VectorCodex profile URLs when ready.
   */
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' as const },
    { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' as const },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' as const },
    { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' as const },
  ],
  logo: {
    path: '/logo/vectorcodex.webp',
    width: 1095,
    height: 228,
    alt: 'VectorCodex',
  },
  areaServed: 'United Kingdom',
  knowsAbout: [
    'Search engine optimisation',
    'Technical SEO',
    'Local SEO',
    'Ecommerce SEO',
    'AI search optimisation',
    'Web development',
    'WordPress development',
    'Digital marketing',
  ],
};
