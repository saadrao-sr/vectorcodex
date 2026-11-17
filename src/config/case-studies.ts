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
 * Add approved metrics via `results` / `metrics` only when verified.
 * Empty optional detail blocks are omitted from the detail template.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'seo-engagement',
    path: '/case-studies/seo-engagement/',
    title: 'SEO Engagement Case Study',
    summary:
      'A structured SEO engagement case study template for VectorCodex. Client identity, sector detail, and verified outcomes will replace this placeholder when cleared for publication.',
    service: 'SEO',
    sector: 'To be confirmed',
    industry: 'To be confirmed',
    placeholder: true,
    seoTitle: 'SEO Engagement Case Study | VectorCodex',
    seoDescription:
      'See how VectorCodex structures SEO engagements — discovery, technical foundations, content, and measurement. Verified client outcomes will be published when approved.',
    publishedAt: '2026-11-06T10:00:00.000Z',
    modifiedAt: '2026-11-17T10:00:00.000Z',
    clientLabel: 'Client name to be confirmed',
    duration: 'Duration to be confirmed',
    market: 'United Kingdom',
    audience: 'Buyers researching services online before they enquire',
    intro:
      'This page is the reusable detail template for VectorCodex case studies. It shows how we frame an SEO engagement — from market context and constraints through strategy, delivery stages, and measured outcomes — without inventing results.',
    servicesDelivered: ['SEO', 'Technical SEO', 'Content structure'],
    serviceLinks: [
      { label: 'SEO', href: '/services/seo/' },
      { label: 'Technical SEO', href: '/services/seo/technical-seo/' },
      { label: 'Local SEO', href: '/services/seo/local-seo/' },
    ],
    image: { ...showcaseImage, alt: 'SEO engagement case study cover for VectorCodex' },
    heroImage: { ...showcaseImage, alt: 'SEO engagement project overview visual' },
    ogImage: { ...showcaseImage, alt: 'SEO engagement case study social preview' },
    metrics: [
      {
        value: 'TBC',
        label: 'Organic visibility',
        placeholder: true,
        sourceNote: 'Publish only with approved analytics evidence.',
      },
      {
        value: 'TBC',
        label: 'Qualified enquiries',
        placeholder: true,
        sourceNote: 'Publish only with approved CRM or form evidence.',
      },
      {
        value: 'TBC',
        label: 'Technical health',
        placeholder: true,
        sourceNote: 'Publish only with crawl or Search Console evidence.',
      },
      {
        value: 'TBC',
        label: 'Content coverage',
        placeholder: true,
        sourceNote: 'Publish only with indexed page or topic evidence.',
      },
    ],
    clientOverview: {
      body: 'Describe the organisation, what they sell, and where demand comes from. Keep names and claims unpublished until the client approves public reference.',
      audience: 'Decision-makers comparing providers online before they book a call or complete a form.',
      objectives: [
        'Improve search visibility for services people already buy',
        'Clarify service and location pages so enquiries are better qualified',
        'Build a measurement loop that reflects real enquiry behaviour',
      ],
    },
    challenge: {
      body: 'Outline the commercial and technical constraints that shaped the work — not a generic SEO problem list.',
      points: [
        'Important service pages were thin, duplicated, or hard for search engines to interpret',
        'Technical issues limited crawl efficiency or page experience on priority templates',
        'Content did not map cleanly to how buyers search for the offer',
        'Reporting focused on vanity metrics instead of enquiry-quality signals',
      ],
    },
    strategy: {
      body: 'Explain the project-specific plan: what was prioritised first, which channels supported SEO, and how success would be judged.',
      points: [
        'Map demand, competitors, and on-site gaps before changing templates',
        'Stabilise technical foundations on money pages and key templates',
        'Restructure service and supporting content around buyer intent',
        'Connect Search Console and analytics to enquiry outcomes',
      ],
    },
    execution: {
      body: 'Implementation is described stage by stage so readers can see the method, not only the headline outcome.',
      stages: [
        {
          number: '01',
          title: 'Discovery & demand mapping',
          body: 'Confirm services, locations, competitors, and the queries that already reflect buying intent. Align internal language with how customers search.',
          image: { ...showcaseImage, alt: 'Discovery workshop and demand mapping for SEO engagement' },
        },
        {
          number: '02',
          title: 'Technical foundations',
          body: 'Address crawl, indexation, speed, and template issues that block visibility on priority URLs before scaling content.',
          image: { ...showcaseImage, alt: 'Technical SEO foundations work on priority templates' },
        },
        {
          number: '03',
          title: 'Content & information architecture',
          body: 'Rebuild or refine service, location, and supporting pages so each URL has a clear job and a clear next step.',
          image: { ...showcaseImage, alt: 'Content structure and information architecture updates' },
        },
        {
          number: '04',
          title: 'Measurement & iteration',
          body: 'Review Search Console, analytics, and enquiry quality on a fixed cadence. Adjust priorities from evidence, not assumptions.',
          image: { ...showcaseImage, alt: 'Measurement dashboard review for SEO engagement' },
        },
      ],
    },
    beforeAfter: {
      beforeLabel: 'Before',
      afterLabel: 'After',
      beforeBody:
        'Summarise the starting state: unclear page roles, technical friction, or weak alignment between search demand and on-site structure.',
      afterBody:
        'Summarise what changed: clearer templates, healthier crawl paths, and content that matches how buyers research the offer. Add screenshots only when approved.',
      beforeImage: { ...showcaseImage, alt: 'Before state of the SEO engagement project' },
      afterImage: { ...showcaseImage, alt: 'After state of the SEO engagement project' },
    },
    performance: {
      body: 'Replace this block with dated, sourced metrics when available. Until then, VectorCodex does not publish invented rankings, traffic lifts, or revenue claims.',
      metrics: [
        {
          value: 'Pending approval',
          label: 'Primary KPI',
          placeholder: true,
        },
        {
          value: 'Pending approval',
          label: 'Secondary KPI',
          placeholder: true,
        },
      ],
    },
    takeaways: [
      'SEO work starts from market and page reality, not a recycled tactic list',
      'Technical health and content structure have to move together on money pages',
      'Measurement should connect search behaviour to enquiry quality',
      'Public case studies only include outcomes that can be sourced and approved',
    ],
    relatedSlugs: ['website-build', 'ppc-programme', 'marketing-programme'],
    sections: placeholderSections('SEO engagement'),
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
    relatedSlugs: ['seo-engagement', 'ecommerce-project', 'marketing-programme'],
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
    relatedSlugs: ['seo-engagement', 'ppc-programme', 'website-build'],
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
    relatedSlugs: ['website-build', 'seo-engagement', 'ppc-programme'],
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
    relatedSlugs: ['seo-engagement', 'marketing-programme', 'ecommerce-project'],
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

export function getRelatedCaseStudies(study: CaseStudy, limit = 3) {
  const related = (study.relatedSlugs ?? [])
    .map((slug) => caseStudies.find((item) => item.slug === slug))
    .filter((item): item is CaseStudy => Boolean(item));

  if (related.length >= limit) return related.slice(0, limit);

  const fillers = caseStudies.filter(
    (item) => item.slug !== study.slug && !related.some((entry) => entry.slug === item.slug),
  );

  return [...related, ...fillers].slice(0, limit);
}
