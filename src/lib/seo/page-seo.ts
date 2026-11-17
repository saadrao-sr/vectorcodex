import { absoluteUrl } from './url';

/**
 * Editable SEO fields for any route.
 * Change `title`, `description`, `robots`, and `canonical` when optimising a page.
 */
export type PageSeo = {
  /** Meta title (browser tab + SERP). Brand suffix is added unless already present. */
  title: string;
  /** Meta description (~140–160 characters). */
  description: string;
  /** Route path used for the default canonical, e.g. `/about/`. */
  path: string;
  /**
   * Canonical override. Absolute URL or site path.
   * Defaults to the absolute form of `path`.
   */
  canonical?: string;
  /**
   * Full robots directive.
   * Examples: `index, follow, max-image-preview:large`, `noindex, follow`, `noindex, nofollow`
   * When omitted, uses the indexable default unless `noindex` is true.
   */
  robots?: string;
  /** Shortcut for `noindex, follow`. Ignored when `robots` is set. */
  noindex?: boolean;
};

export const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large';
export const NOINDEX_ROBOTS = 'noindex, follow';

/** Identity helper so page SEO blocks stay typed and easy to find. */
export function definePageSeo(seo: PageSeo): PageSeo {
  return seo;
}

export function resolveRobots(seo: Pick<PageSeo, 'robots' | 'noindex'>): string {
  const custom = seo.robots?.trim();
  if (custom) return custom;
  if (seo.noindex) return NOINDEX_ROBOTS;
  return DEFAULT_ROBOTS;
}

export function resolveCanonical(seo: Pick<PageSeo, 'path' | 'canonical'>): string {
  const override = seo.canonical?.trim();
  if (override) return absoluteUrl(override);
  return absoluteUrl(seo.path);
}

/** Props commonly spread into BaseLayout / Seo. */
export function pageSeoToLayoutProps(seo: PageSeo) {
  return {
    title: seo.title,
    description: seo.description,
    path: seo.path,
    canonical: resolveCanonical(seo),
    robots: resolveRobots(seo),
    noindex: Boolean(seo.noindex) || resolveRobots(seo).includes('noindex'),
  };
}
