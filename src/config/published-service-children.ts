/**
 * Published parent → child service links used by nav, home pills, and directory UIs.
 * Only real (or intentionally staged) child routes belong here — parent-only capabilities stay on landings.
 */
export type PublishedChildLink = {
  label: string;
  href: string;
};

export const publishedServiceChildren = {
  seo: [
    { label: 'Local SEO', href: '/services/seo/local-seo/' },
    { label: 'Technical SEO', href: '/services/seo/technical-seo/' },
    { label: 'E-commerce SEO', href: '/services/seo/ecommerce-seo/' },
    { label: 'AEO SEO', href: '/services/seo/ai-seo/' },
    { label: 'GEO SEO', href: '/services/seo/ai-seo/' },
  ],
  web: [
    { label: 'WordPress Development', href: '/services/web-development/wordpress-development/' },
    { label: 'Shopify Development', href: '/services/web-development/shopify-development/' },
  ],
  social: [{ label: 'Content Creation', href: '/services/social-media-marketing/content-creation/' }],
  ppc: [] as PublishedChildLink[],
} as const satisfies Record<string, readonly PublishedChildLink[]>;

export type PublishedChildGroup = keyof typeof publishedServiceChildren;

/** Full published child links for a pillar (prefer this when rendering clickable pills). */
export function publishedChildren(group: PublishedChildGroup): readonly PublishedChildLink[] {
  return publishedServiceChildren[group];
}

export function childLabels(group: PublishedChildGroup): string[] {
  return publishedServiceChildren[group].map((item) => item.label);
}
