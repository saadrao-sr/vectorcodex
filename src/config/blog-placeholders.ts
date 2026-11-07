import type { BlogPost } from '../types/content';

const cover = {
  src: '/images/hero-tech.jpg',
  alt: 'Article cover placeholder',
  width: 1920,
  height: 1080,
};

/**
 * Dummy journal cards for the blog listing until WordPress posts are connected.
 * Titles and copy are placeholders — replace via WordPress publishing.
 */
export const blogPlaceholders: BlogPost[] = [
  {
    id: -1,
    slug: 'seo-foundations-for-growth',
    title: 'SEO Foundations That Support Long-Term Growth',
    excerpt:
      'A placeholder brief on technical health, content structure, and measurement habits that keep organic visibility moving in the right direction.',
    contentHtml: '',
    publishedAt: '2026-01-12T10:00:00.000Z',
    modifiedAt: '2026-01-12T10:00:00.000Z',
    image: { ...cover, alt: 'SEO article cover placeholder' },
    categories: [{ name: 'SEO', slug: 'seo' }],
  },
  {
    id: -2,
    slug: 'websites-built-for-clarity',
    title: 'Websites Built for Clarity, Speed, and Conversion',
    excerpt:
      'A placeholder look at how structure, performance, and user journeys turn a website into a reliable growth channel.',
    contentHtml: '',
    publishedAt: '2026-01-18T10:00:00.000Z',
    modifiedAt: '2026-01-18T10:00:00.000Z',
    image: { ...cover, alt: 'Web development article cover placeholder' },
    categories: [{ name: 'Web Development', slug: 'web-development' }],
  },
  {
    id: -3,
    slug: 'marketing-with-clear-messaging',
    title: 'Digital Marketing With Clear Messaging',
    excerpt:
      'A placeholder note on channel choices, creative direction, and reporting that keep campaigns aligned with business goals.',
    contentHtml: '',
    publishedAt: '2026-01-24T10:00:00.000Z',
    modifiedAt: '2026-01-24T10:00:00.000Z',
    image: { ...cover, alt: 'Digital marketing article cover placeholder' },
    categories: [{ name: 'Digital Marketing', slug: 'digital-marketing' }],
  },
  {
    id: -4,
    slug: 'ppc-that-protects-budget',
    title: 'PPC Programmes That Protect Budget and Demand',
    excerpt:
      'A placeholder outline of paid search structure, creative testing, and measurement that keep spend efficient.',
    contentHtml: '',
    publishedAt: '2026-02-02T10:00:00.000Z',
    modifiedAt: '2026-02-02T10:00:00.000Z',
    image: { ...cover, alt: 'PPC article cover placeholder' },
    categories: [{ name: 'PPC', slug: 'ppc' }],
  },
  {
    id: -5,
    slug: 'content-that-earns-trust',
    title: 'Content Systems That Earn Trust and Traffic',
    excerpt:
      'A placeholder guide to editorial planning, topic clusters, and publishing cadence that support search and sales.',
    contentHtml: '',
    publishedAt: '2026-02-10T10:00:00.000Z',
    modifiedAt: '2026-02-10T10:00:00.000Z',
    image: { ...cover, alt: 'Content strategy article cover placeholder' },
    categories: [{ name: 'Content', slug: 'content' }],
  },
  {
    id: -6,
    slug: 'local-seo-for-service-brands',
    title: 'Local SEO for Service-Led Brands',
    excerpt:
      'A placeholder brief on listings, location pages, and reputation signals that help nearby customers find the right offer.',
    contentHtml: '',
    publishedAt: '2026-02-18T10:00:00.000Z',
    modifiedAt: '2026-02-18T10:00:00.000Z',
    image: { ...cover, alt: 'Local SEO article cover placeholder' },
    categories: [{ name: 'SEO', slug: 'seo' }],
  },
  {
    id: -7,
    slug: 'ecommerce-ux-that-converts',
    title: 'E-commerce UX That Converts Without Friction',
    excerpt:
      'A placeholder checklist for product discovery, checkout clarity, and performance cues that support online sales.',
    contentHtml: '',
    publishedAt: '2026-02-26T10:00:00.000Z',
    modifiedAt: '2026-02-26T10:00:00.000Z',
    image: { ...cover, alt: 'E-commerce article cover placeholder' },
    categories: [{ name: 'E-commerce', slug: 'ecommerce' }],
  },
  {
    id: -8,
    slug: 'analytics-that-teams-use',
    title: 'Analytics Setups Teams Actually Use',
    excerpt:
      'A placeholder overview of tracking, dashboards, and decision loops that keep marketing and product aligned.',
    contentHtml: '',
    publishedAt: '2026-03-04T10:00:00.000Z',
    modifiedAt: '2026-03-04T10:00:00.000Z',
    image: { ...cover, alt: 'Analytics article cover placeholder' },
    categories: [{ name: 'Strategy', slug: 'strategy' }],
  },
  {
    id: -9,
    slug: 'brand-sites-that-scale',
    title: 'Brand Sites Built to Scale With the Business',
    excerpt:
      'A placeholder article on modular page systems, CMS discipline, and design systems that stay maintainable as teams grow.',
    contentHtml: '',
    publishedAt: '2026-03-12T10:00:00.000Z',
    modifiedAt: '2026-03-12T10:00:00.000Z',
    image: { ...cover, alt: 'Brand website article cover placeholder' },
    categories: [{ name: 'Web Development', slug: 'web-development' }],
  },
];
