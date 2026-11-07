import { aiSeoChildService } from './ai-seo';
import { contentCreationChildService } from './content-creation';
import { ecommerceSeoChildService } from './ecommerce-seo';
import { localSeoChildService } from './local-seo';
import { shopifyDevelopmentChildService } from './shopify-development';
import { technicalSeoChildService } from './technical-seo';
import { wordpressDevelopmentChildService } from './wordpress-development';
import type { ChildServiceLanding } from './types';

export type { ChildServiceLanding, ChildServiceSectionKey, ChildServiceVisual } from './types';

/** Nest under a parent when the child has a dedicated premium landing. */
export const childServiceLandings: ChildServiceLanding[] = [
  localSeoChildService,
  technicalSeoChildService,
  ecommerceSeoChildService,
  aiSeoChildService,
  wordpressDevelopmentChildService,
  shopifyDevelopmentChildService,
  contentCreationChildService,
];

export function getChildServiceBySlug(slug: string): ChildServiceLanding | undefined {
  return childServiceLandings.find((item) => item.slug === slug);
}

export function getChildServiceByPath(path: string): ChildServiceLanding | undefined {
  const normalised = path.endsWith('/') ? path : `${path}/`;
  return childServiceLandings.find((item) => item.path === normalised);
}

/** Slugs that use nested child landings instead of the generic `/services/[slug]/` view. */
export const CHILD_LANDING_SLUGS = new Set(childServiceLandings.map((item) => item.slug));

export {
  aiSeoChildService,
  contentCreationChildService,
  ecommerceSeoChildService,
  localSeoChildService,
  shopifyDevelopmentChildService,
  technicalSeoChildService,
  wordpressDevelopmentChildService,
};
