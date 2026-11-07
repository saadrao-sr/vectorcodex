import { ppcParentService } from './ppc-management';
import { seoParentService } from './seo';
import { socialMediaParentService } from './social-media-marketing';
import type { ParentServiceLanding, ParentServiceId } from './types';
import { webDevelopmentParentService } from './web-development';

export type { ParentServiceLanding, ParentServiceId, ParentServiceEnquiryValue } from './types';

export const parentServices: ParentServiceLanding[] = [
  seoParentService,
  webDevelopmentParentService,
  socialMediaParentService,
  ppcParentService,
];

export function getParentService(id: ParentServiceId): ParentServiceLanding {
  const match = parentServices.find((item) => item.id === id);
  if (!match) throw new Error(`Unknown parent service: ${id}`);
  return match;
}

export {
  seoParentService,
  webDevelopmentParentService,
  socialMediaParentService,
  ppcParentService,
};
