import type { BlogPost } from '../types/content';
import { estimateReadingMinutes } from '../lib/blog/content';

const cover = {
  src: '/images/hero-tech.jpg',
  alt: 'Article cover placeholder',
  width: 1920,
  height: 1080,
};

function article(html: string) {
  return {
    contentHtml: html,
    readingMinutes: estimateReadingMinutes(html),
  };
}

const seoFoundationsHtml = `
<p>Search visibility compounds when the foundations are deliberate. This placeholder article shows how VectorCodex structures SEO work around technical health, content clarity, and measurement — without inventing rankings or traffic claims.</p>
<h2>Start with the commercial brief</h2>
<p>Before templates or keywords, confirm what the business sells, which locations or audiences matter, and how enquiries should arrive. SEO priorities should follow revenue paths, not vanity queries.</p>
<ul>
  <li>Map priority services and landing pages</li>
  <li>Note competitors that already own demand</li>
  <li>Define what a qualified enquiry looks like</li>
</ul>
<h2>Stabilise technical foundations</h2>
<p>Crawl, indexation, and page experience issues on money pages block progress. Fix the templates that carry commercial intent before scaling content volume.</p>
<h3>What to check first</h3>
<ol>
  <li>Indexation and canonical consistency on key URLs</li>
  <li>Internal linking from hub pages to service pages</li>
  <li>Core templates for speed and mobile usability</li>
</ol>
<blockquote>Technical health and content structure have to move together. Fixing one without the other rarely holds.</blockquote>
<h2>Structure content around buyer intent</h2>
<p>Each important URL should have a clear job: attract a specific intent, answer the right questions, and guide a next step. Thin or duplicated pages dilute that signal.</p>
<h3>Useful page roles</h3>
<ul>
  <li>Service pages that match how buyers search</li>
  <li>Supporting guides that earn topical trust</li>
  <li>Location pages only where there is a real market</li>
</ul>
<h2>Measure what the business can act on</h2>
<p>Reporting should connect Search Console and analytics to enquiry quality. Rankings alone do not prove commercial progress.</p>
<p>When this article is replaced by a published WordPress post, verified examples and visuals can sit here. Until then, treat this page as a structural preview of the VectorCodex blog detail template.</p>
<h2>Key takeaways</h2>
<ul>
  <li>SEO starts from market and page reality</li>
  <li>Technical and content work should be sequenced on money pages</li>
  <li>Measurement should track enquiry-quality signals</li>
</ul>
`.trim();

const brief = (lead: string, heading: string, body: string) =>
  article(`
<p>${lead}</p>
<h2>${heading}</h2>
<p>${body}</p>
<h2>What comes next</h2>
<p>This is placeholder copy for layout preview. Published WordPress content will replace it automatically when the API is connected.</p>
`.trim());

/**
 * Dummy journal cards + detail-page content until WordPress posts are connected.
 * Marked by negative ids so routes can stay noindex.
 */
export const blogPlaceholders: BlogPost[] = [
  {
    id: -1,
    slug: 'seo-foundations-for-growth',
    title: 'SEO Foundations That Support Long-Term Growth',
    excerpt:
      'A practical look at technical health, content structure, and measurement habits that keep organic visibility moving in the right direction.',
    publishedAt: '2026-01-12T10:00:00.000Z',
    modifiedAt: '2026-01-12T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    authorSocials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: 'Facebook', href: 'https://www.facebook.com/' },
      { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    ],
    image: { ...cover, alt: 'SEO foundations article cover for VectorCodex insights' },
    categories: [{ name: 'SEO', slug: 'seo' }],
    tags: [
      { name: 'Technical SEO', slug: 'technical-seo' },
      { name: 'Content', slug: 'content' },
    ],
    ...article(seoFoundationsHtml),
  },
  {
    id: -2,
    slug: 'websites-built-for-clarity',
    title: 'Websites Built for Clarity, Speed, and Conversion',
    excerpt:
      'A placeholder look at how structure, performance, and user journeys turn a website into a reliable growth channel.',
    publishedAt: '2026-01-18T10:00:00.000Z',
    modifiedAt: '2026-01-18T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Web development article cover placeholder' },
    categories: [{ name: 'Web Development', slug: 'web-development' }],
    ...brief(
      'Clear sites help visitors understand the offer faster and enquire with less friction.',
      'Structure before decoration',
      'Information architecture, performance, and conversion paths should be designed together.',
    ),
  },
  {
    id: -3,
    slug: 'marketing-with-clear-messaging',
    title: 'Digital Marketing With Clear Messaging',
    excerpt:
      'A placeholder note on channel choices, creative direction, and reporting that keep campaigns aligned with business goals.',
    publishedAt: '2026-01-24T10:00:00.000Z',
    modifiedAt: '2026-01-24T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Digital marketing article cover placeholder' },
    categories: [{ name: 'Digital Marketing', slug: 'digital-marketing' }],
    ...brief(
      'Campaigns work harder when the message, channel, and offer stay aligned.',
      'Choose channels for the buyer journey',
      'Creative and reporting should reflect commercial goals, not vanity metrics alone.',
    ),
  },
  {
    id: -4,
    slug: 'ppc-that-protects-budget',
    title: 'PPC Programmes That Protect Budget and Demand',
    excerpt:
      'A placeholder outline of paid search structure, creative testing, and measurement that keep spend efficient.',
    publishedAt: '2026-02-02T10:00:00.000Z',
    modifiedAt: '2026-02-02T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'PPC article cover placeholder' },
    categories: [{ name: 'PPC', slug: 'ppc' }],
    ...brief(
      'Paid search can protect demand when structure and measurement stay disciplined.',
      'Budget follows intent',
      'Account structure, creative tests, and conversion tracking keep spend accountable.',
    ),
  },
  {
    id: -5,
    slug: 'content-that-earns-trust',
    title: 'Content Systems That Earn Trust and Traffic',
    excerpt:
      'A placeholder guide to editorial planning, topic clusters, and publishing cadence that support search and sales.',
    publishedAt: '2026-02-10T10:00:00.000Z',
    modifiedAt: '2026-02-10T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Content strategy article cover placeholder' },
    categories: [{ name: 'Content', slug: 'content' }],
    ...brief(
      'Useful content earns attention when topics map to real buyer questions.',
      'Plan clusters, not one-off posts',
      'Editorial cadence and internal links help topics compound over time.',
    ),
  },
  {
    id: -6,
    slug: 'local-seo-for-service-brands',
    title: 'Local SEO for Service-Led Brands',
    excerpt:
      'A placeholder brief on listings, location pages, and reputation signals that help nearby customers find the right offer.',
    publishedAt: '2026-02-18T10:00:00.000Z',
    modifiedAt: '2026-02-18T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Local SEO article cover placeholder' },
    categories: [{ name: 'SEO', slug: 'seo' }],
    ...brief(
      'Local visibility depends on accurate listings, relevant pages, and trustworthy signals.',
      'Serve nearby demand clearly',
      'Location pages and reputation cues should match how local customers search.',
    ),
  },
  {
    id: -7,
    slug: 'ecommerce-ux-that-converts',
    title: 'E-commerce UX That Converts Without Friction',
    excerpt:
      'A placeholder checklist for product discovery, checkout clarity, and performance cues that support online sales.',
    publishedAt: '2026-02-26T10:00:00.000Z',
    modifiedAt: '2026-02-26T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'E-commerce article cover placeholder' },
    categories: [{ name: 'E-commerce', slug: 'ecommerce' }],
    ...brief(
      'Storefronts convert when discovery and checkout feel obvious.',
      'Remove friction on the path to purchase',
      'Product pages, speed, and checkout clarity all shape completion rates.',
    ),
  },
  {
    id: -8,
    slug: 'analytics-that-teams-use',
    title: 'Analytics Setups Teams Actually Use',
    excerpt:
      'A placeholder overview of tracking, dashboards, and decision loops that keep marketing and product aligned.',
    publishedAt: '2026-03-04T10:00:00.000Z',
    modifiedAt: '2026-03-04T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Analytics article cover placeholder' },
    categories: [{ name: 'Strategy', slug: 'strategy' }],
    ...brief(
      'Analytics only help when teams can act on what they see.',
      'Build decision loops',
      'Tracking and dashboards should answer commercial questions, not just collect events.',
    ),
  },
  {
    id: -9,
    slug: 'brand-sites-that-scale',
    title: 'Brand Sites Built to Scale With the Business',
    excerpt:
      'A placeholder article on modular page systems, CMS discipline, and design systems that stay maintainable as teams grow.',
    publishedAt: '2026-03-12T10:00:00.000Z',
    modifiedAt: '2026-03-12T10:00:00.000Z',
    authorName: 'VectorCodex Editorial',
    image: { ...cover, alt: 'Brand website article cover placeholder' },
    categories: [{ name: 'Web Development', slug: 'web-development' }],
    ...brief(
      'Scalable sites need modular templates and clear publishing rules.',
      'Design for change',
      'CMS discipline and reusable components keep growth from creating chaos.',
    ),
  },
];

export function isPlaceholderPost(post: BlogPost) {
  return post.id < 0;
}

/** Use live WordPress posts when available; otherwise preview placeholders. */
export function resolveBlogPosts(livePosts: BlogPost[]) {
  return livePosts.length > 0 ? livePosts : blogPlaceholders;
}
