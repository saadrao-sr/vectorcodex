import { definePageSeo, type PageSeo } from '../lib/seo/page-seo';

/**
 * Central SEO registry for static marketing pages.
 * Edit `title`, `description`, `robots`, and `canonical` here when optimising.
 *
 * Dynamic routes (services, industries, locations, case studies, blog posts)
 * keep their SEO next to their content config — see those files / page frontmatter.
 */
export const pageSeo = {
  home: definePageSeo({
    title: 'VectorCodex | SEO, web development and digital marketing',
    description:
      'VectorCodex is a UK digital agency for SEO, web development, and digital marketing. Clear strategy, fast websites, and search-ready structure.',
    path: '/',
    // robots: 'index, follow, max-image-preview:large',
    // canonical: 'https://vectorcodex.com/',
  }),

  about: definePageSeo({
    title: 'About',
    description:
      'About VectorCodex — a UK digital growth partner combining SEO, web development, and marketing to help businesses grow online.',
    path: '/about/',
  }),

  contact: definePageSeo({
    title: 'Contact',
    description: 'Contact VectorCodex about SEO, web development, or digital marketing for a UK organisation.',
    path: '/contact/',
  }),

  pricing: definePageSeo({
    title: 'Pricing',
    description:
      'Calculate your VectorCodex digital project requirements and request a tailored proposal for SEO, websites, social media, and PPC.',
    path: '/pricing/',
  }),

  industries: definePageSeo({
    title: 'Industries',
    description:
      'VectorCodex works with UK organisations across sectors that need clear search, websites, and marketing. Sector detail will expand as published work is approved.',
    path: '/industries/',
  }),

  caseStudies: definePageSeo({
    title: 'Case studies',
    description:
      'VectorCodex case studies are published only when an engagement can be described accurately. Current entries are structural placeholders.',
    path: '/case-studies/',
  }),

  services: definePageSeo({
    title: 'Services',
    description:
      'Explore VectorCodex digital services — SEO, web development, social media marketing, and PPC management — planned and delivered as one growth system.',
    path: '/services/',
  }),

  ourTeam: definePageSeo({
    title: 'Our Team',
    description:
      'Explore VectorCodex talent solutions — dedicated specialists across SEO, web development, PPC, content, digital marketing, and UI/UX.',
    path: '/our-team/',
  }),

  privacyPolicy: definePageSeo({
    title: 'Privacy Policy',
    description:
      'How VectorCodex collects, uses, stores, and protects personal information submitted through this website, including enquiries and ordinary hosting logs.',
    path: '/privacy-policy/',
  }),

  blog: definePageSeo({
    title: 'Blog',
    description:
      'Articles on SEO, websites, and digital marketing from VectorCodex. Posts are published from WordPress.',
    path: '/blog/',
  }),

  notFound: definePageSeo({
    title: 'Page not found',
    description: 'The page you requested could not be found on VectorCodex.',
    path: '/404/',
    robots: 'noindex, follow',
    noindex: true,
  }),
} as const satisfies Record<string, PageSeo>;

/** Paginated blog listing SEO (page 2+). */
export function blogListingSeo(page: number): PageSeo {
  if (page <= 1) return pageSeo.blog;
  return definePageSeo({
    title: `Blog, page ${page}`,
    description: pageSeo.blog.description,
    path: `/blog/page/${page}/`,
    // Point paginated listings at the main blog index when consolidating signals:
    // canonical: pageSeo.blog.path,
  });
}
