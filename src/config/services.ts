import type { Service } from '../types/content';

export const services: Service[] = [
  {
    slug: 'seo',
    path: '/services/seo/',
    title: 'SEO',
    navLabel: 'SEO',
    group: 'Search',
    summary: 'Search strategy, site structure, and content for organisations that need a site search engines can understand.',
    description:
      'SEO for UK organisations. VectorCodex plans search strategy, site structure, and content so pages can be crawled, understood, and maintained.',
    intro:
      'Search engine optimisation at VectorCodex covers the decisions that make a site understandable: structure, content, internal links, and the technical base those depend on.',
    includes: [
      {
        title: 'Search strategy',
        text: 'Priorities based on the business, the current site, and the queries that matter. Recommendations stay tied to evidence you can review.',
      },
      {
        title: 'Site structure',
        text: 'Sections, page roles, and internal links that help people and crawlers reach the right URL.',
      },
      {
        title: 'On-page content',
        text: 'Titles, headings, and copy written for the reader first, with clear entities and a single intent per page.',
      },
      {
        title: 'Measurement',
        text: 'A practical reading of search and analytics data once access is agreed. We do not publish figures we cannot source.',
      },
    ],
    related: ['technical-seo', 'ai-seo', 'web-development'],
  },
  {
    slug: 'technical-seo',
    path: '/services/seo/technical-seo/',
    title: 'Technical SEO',
    navLabel: 'Technical SEO',
    group: 'Search',
    summary: 'Crawlability, indexation, architecture, Core Web Vitals, and structured data that matches the page.',
    description:
      'Technical SEO for crawlability, indexation, site architecture, Core Web Vitals, and structured data on UK websites.',
    intro:
      'Technical SEO removes the barriers that stop search engines from finding, rendering, and understanding a site. The work is specific to the stack you already run.',
    includes: [
      {
        title: 'Crawl and indexation',
        text: 'Robots rules, XML sitemaps, status codes, canonicals, and control of duplicate URLs.',
      },
      {
        title: 'Architecture',
        text: 'Templates, internal links, and pagination that can grow without orphaning important pages.',
      },
      {
        title: 'Performance',
        text: 'Core Web Vitals improvements that come from templates, images, fonts, and the scripts a page actually needs.',
      },
      {
        title: 'Structured data',
        text: 'JSON-LD that describes the same facts a person can see. Markup is not used to invent reviews, prices, or ratings.',
      },
    ],
    related: ['seo', 'ai-seo', 'web-development'],
  },
  {
    slug: 'local-seo',
    path: '/services/seo/local-seo/',
    title: 'Local SEO',
    navLabel: 'Local SEO',
    group: 'Search',
    summary: 'Location pages, business listings, and consistent local information for UK businesses with a real premises or service area.',
    description:
      'Local SEO for UK businesses with premises or service areas, including location pages, business listings, and consistent name, address, and phone data.',
    intro:
      'Local SEO helps a business with a real location or service area appear for relevant local searches. The work starts from accurate business information.',
    includes: [
      {
        title: 'Business information',
        text: 'Name, address, phone, hours, and categories kept consistent wherever they are published.',
      },
      {
        title: 'Location pages',
        text: 'Unique pages for real locations or service areas, with information a customer can use.',
      },
      {
        title: 'Listings',
        text: 'Google Business Profile and other listings you control, maintained with data you have confirmed.',
      },
      {
        title: 'Local links',
        text: 'Internal links from the main site and citations from sources that can be checked.',
      },
    ],
    related: ['seo', 'technical-seo', 'digital-marketing'],
  },
  {
    slug: 'ecommerce-seo',
    path: '/services/seo/ecommerce-seo/',
    title: 'E-commerce SEO',
    navLabel: 'E-commerce SEO',
    group: 'Search',
    summary: 'Category architecture, product content, faceted navigation, and internal linking for online catalogues.',
    description:
      'Ecommerce SEO for catalogues, category architecture, product content, faceted navigation, and internal linking.',
    intro:
      'Ecommerce SEO is the structure of a catalogue: categories, products, filters, and the internal links that help shoppers and crawlers reach the right page.',
    includes: [
      {
        title: 'Catalogue architecture',
        text: 'Category trees and URL patterns that match how people shop, without a new URL for every minor variant.',
      },
      {
        title: 'Product and category content',
        text: 'Useful copy, unique titles, and headings. Thin duplicates are consolidated rather than rewritten into noise.',
      },
      {
        title: 'Faceted navigation',
        text: 'Crawl rules for filters and sorts so the indexable set of URLs stays intentional.',
      },
      {
        title: 'Internal linking',
        text: 'Paths from categories, related products, and editorial pages into the URLs you want found.',
      },
    ],
    related: ['technical-seo', 'seo', 'web-development'],
  },
  {
    slug: 'ai-seo',
    path: '/services/seo/ai-seo/',
    title: 'AI SEO and GEO',
    navLabel: 'AI SEO & GEO',
    group: 'Search',
    summary: 'Entity clarity, crawlable answers, and machine-readable site information for traditional search and answer engines.',
    description:
      'AI SEO and generative engine optimisation for UK brands. Clear entities, crawlable pages, and machine-readable site information.',
    intro:
      'AI SEO and generative engine optimisation prepare a site to be interpreted by answer engines as well as traditional search. Inclusion in any AI answer is not guaranteed. The work is clarity: who you are, what you offer, and which page should be cited.',
    includes: [
      {
        title: 'Entity clarity',
        text: 'Consistent naming, descriptions, and relationships across visible copy and structured data.',
      },
      {
        title: 'Crawlable answers',
        text: 'Pages organised so the question, the answer, and the supporting detail are easy to extract.',
      },
      {
        title: 'Machine-readable files',
        text: 'robots.txt, llms.txt, and schema that describe the same business a person sees on the page.',
      },
      {
        title: 'Content governance',
        text: 'A way to update facts in one place so people and crawlers do not meet conflicting versions.',
      },
    ],
    related: ['technical-seo', 'seo', 'web-development'],
  },
  {
    slug: 'web-development',
    path: '/services/web-development/',
    title: 'Web development',
    navLabel: 'Web development',
    group: 'Build',
    summary: 'Fast, accessible, search-ready websites, statically rendered by default and edited through a CMS when you need one.',
    description:
      'Web development for fast, accessible, search-ready sites. VectorCodex builds with Astro, React where interaction needs it, and a CMS when editors need one.',
    intro:
      'We design and build websites that load quickly, read clearly, and give editors a sensible way to publish. JavaScript is added for interaction, not as the default for every page.',
    includes: [
      {
        title: 'Interface design',
        text: 'Responsive layouts, accessible components, and a visual system matched to the brand you supply.',
      },
      {
        title: 'Front-end engineering',
        text: 'Static HTML by default, with React used for components that hold state, such as menus and forms.',
      },
      {
        title: 'CMS and integrations',
        text: 'Headless WordPress or another editorial workflow when the content team needs it.',
      },
      {
        title: 'Quality',
        text: 'Semantic HTML, restrained scripts, and attention to Core Web Vitals and WCAG.',
      },
    ],
    related: ['wordpress-development', 'shopify-development', 'technical-seo'],
  },
  {
    slug: 'wordpress-development',
    path: '/services/web-development/wordpress-development/',
    title: 'WordPress development',
    navLabel: 'WordPress development',
    group: 'Build',
    summary: 'Themes, block editing, and headless WordPress delivered through the REST API to a fast public site.',
    description:
      'WordPress development for editorial sites and headless builds, including themes, the REST API, performance, and publishing workflow.',
    intro:
      'WordPress remains a strong editorial system. We build themes and headless front ends that keep authors in a familiar editor and ship a fast public site.',
    includes: [
      {
        title: 'Themes and blocks',
        text: 'Editor-friendly templates that do not depend on a stack of unused plugins.',
      },
      {
        title: 'Headless delivery',
        text: 'The WordPress REST API as the content source for a statically generated front end.',
      },
      {
        title: 'Performance',
        text: 'Lean presentation, controlled media, and caching that suits the host.',
      },
      {
        title: 'Care',
        text: 'Updates, roles, and a plugin policy so the site stays maintainable.',
      },
    ],
    related: ['web-development', 'technical-seo', 'seo'],
  },
  {
    slug: 'shopify-development',
    path: '/services/web-development/shopify-development/',
    title: 'Shopify development',
    navLabel: 'Shopify development',
    group: 'Build',
    summary: 'Shopify storefronts focused on clear product journeys, performance, and maintainable theme work.',
    description:
      'Shopify development for conversion-ready storefronts — theme customisation, product templates, and checkout-adjacent experience improvements without invented sales claims.',
    intro:
      'We build and refine Shopify experiences so product discovery, content, and checkout paths stay clear for shoppers and practical for the teams who run the store.',
    includes: [
      {
        title: 'Theme customisation',
        text: 'Storefront templates shaped around your catalogue, brand, and merchandising needs.',
      },
      {
        title: 'Product and collection templates',
        text: 'Clear product storytelling, media handling, and collection structures that stay maintainable.',
      },
      {
        title: 'Performance and UX',
        text: 'Lean presentation, mobile-first journeys, and practical speed improvements within Shopify constraints.',
      },
      {
        title: 'Launch support',
        text: 'Content migration notes, QA across key templates, and a scoped handoff for ongoing store edits.',
      },
    ],
    related: ['web-development', 'wordpress-development', 'ecommerce-seo'],
  },
  {
    slug: 'digital-marketing',
    path: '/services/digital-marketing/',
    title: 'Digital marketing',
    navLabel: 'Digital marketing',
    group: 'Marketing',
    summary: 'Messaging, landing pages, channel planning, and measurement defined before a campaign launches.',
    description:
      'Digital marketing for UK organisations: messaging, landing pages, campaign structure, and measurement. Results are reported only when they can be sourced.',
    intro:
      'Digital marketing at VectorCodex connects the offer, the page, and the channel. Campaigns are planned around a message you can stand behind and measurement you can access.',
    includes: [
      {
        title: 'Messaging',
        text: 'Offers, audiences, and page narratives written with the people who know the business.',
      },
      {
        title: 'Landing pages',
        text: 'Focused pages for campaigns, built to load quickly and to say one thing clearly.',
      },
      {
        title: 'Channel planning',
        text: 'Search, content, and paid activity where each channel has a reason to exist. Projected results are not presented as fact.',
      },
      {
        title: 'Measurement',
        text: 'Events, conversions, and reporting agreed before launch, using analytics tools you approve.',
      },
    ],
    related: ['seo', 'local-seo', 'web-development'],
  },
  {
    slug: 'social-media-marketing',
    path: '/services/social-media-marketing/',
    title: 'Social media marketing',
    navLabel: 'Social media marketing',
    group: 'Marketing',
    summary:
      'Social strategy, content systems, community management, and paid social planning aligned to brand positioning and journeys you can measure.',
    description:
      'Social media marketing for brands that need consistent creative, platform-aware planning, and reporting tied to signals you can verify — without invented engagement metrics.',
    intro:
      'VectorCodex aligns social programmes with clear audience positioning, sustainable publishing rhythms, and measurement your team agrees to — including organic presence, creative direction, and paid social when amplification is in scope.',
    includes: [
      {
        title: 'Platform and audience plan',
        text: 'Channel roles, messaging pillars, and format choices based on where your buyers already pay attention.',
      },
      {
        title: 'Content and creative direction',
        text: 'Feed-native concepts, copy, and visual rules that stay coherent as formats and campaigns change.',
      },
      {
        title: 'Community operations',
        text: 'Publishing, replies, and escalation paths so presence stays timely without losing governance.',
      },
      {
        title: 'Reporting you can audit',
        text: 'Reviews of creative, community, and campaign signals using definitions agreed up front — not vanity charts.',
      },
    ],
    related: ['content-creation', 'digital-marketing', 'ppc-management'],
  },
  {
    slug: 'content-creation',
    path: '/services/social-media-marketing/content-creation/',
    title: 'Content creation',
    navLabel: 'Content creation',
    group: 'Marketing',
    summary:
      'Social content systems covering message pillars, format planning, copy, and creative direction without invented engagement guarantees.',
    description:
      'Content creation for social programmes — editorial concepts, copy, and creative direction tuned to feed behaviour and brand rules.',
    intro:
      'VectorCodex plans and produces social content so posts stay on-brand, format-aware, and useful to the campaigns they support.',
    includes: [
      {
        title: 'Message pillars',
        text: 'Themes your brand can repeat without sounding robotic week to week.',
      },
      {
        title: 'Format planning',
        text: 'Which ideas belong in carousels, statics, short video, or threads.',
      },
      {
        title: 'Copy and creative direction',
        text: 'Hooks, body copy, CTAs, and visual guidance matched to platform norms.',
      },
      {
        title: 'Review and handoff',
        text: 'Approval checklists and publish-ready packages for social managers.',
      },
    ],
    related: ['social-media-marketing', 'seo', 'web-development'],
  },
  {
    slug: 'ppc-management',
    path: '/services/ppc-management/',
    title: 'PPC management',
    navLabel: 'PPC management',
    group: 'Marketing',
    summary:
      'Paid search campaign management with disciplined structure, conversion tracking, and optimisation grounded in live account data.',
    description:
      'PPC management and Google Ads services focused on qualified demand, clear tracking, and accountable optimisation — without invented ROAS or lead guarantees.',
    intro:
      'VectorCodex builds and tends paid campaigns when intent, offer clarity, and tracking readiness support scaling — from Google Ads inventory through Performance Max when the brief fits.',
    includes: [
      {
        title: 'Account architecture',
        text: 'Campaigns grouped by intent so learning is not split across overlapping keywords or audiences.',
      },
      {
        title: 'Creative and landing alignment',
        text: 'Ads, extensions, and destinations that continue one promise and a clear next step for the traffic source.',
      },
      {
        title: 'Conversion instrumentation',
        text: 'Event design and tag checks so optimisation targets conversions you define and can access.',
      },
      {
        title: 'Optimisation and reporting',
        text: 'Ongoing tests, waste reviews, and plain-language readouts of spend and conversions — never fabricated return figures.',
      },
    ],
    related: ['digital-marketing', 'social-media-marketing', 'web-development'],
  },
];

export function getService(slug: string) {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function relatedServices(service: Service) {
  return service.related
    .map((slug) => services.find((item) => item.slug === slug))
    .filter((item): item is Service => Boolean(item));
}
