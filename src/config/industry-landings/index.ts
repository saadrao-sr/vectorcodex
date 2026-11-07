/**
 * Industry landing pages — shared template driven by per-industry config.
 * Add new industries as modules here; routes render via `/industries/[slug]/`.
 * Do not invent clients, statistics, case results, or unverified claims.
 */
import { accountingIndustry } from './accounting';
import { carRentalIndustry } from './car-rental';
import { dentalIndustry } from './dental';
import { healthcareIndustry } from './healthcare';
import { medicalBillingIndustry } from './medical-billing';
import { minibusIndustry } from './minibus';
import { realEstateIndustry } from './real-estate';
import { tobaccoIndustry } from './tobacco';
import { tourismIndustry } from './tourism';
import type { IndustryLanding } from './types';

export type {
  IndustryAudienceSegment,
  IndustryChallenge,
  IndustryChallengeIcon,
  IndustryJourneyStep,
  IndustryLanding,
  IndustryProcessStep,
  IndustryServiceLink,
  IndustrySolution,
  IndustryVisualMotif,
  IndustryWhyPoint,
} from './types';

/** Published industry landings — order matches the industries directory listing. */
export const industries: IndustryLanding[] = [
  healthcareIndustry,
  accountingIndustry,
  tourismIndustry,
  tobaccoIndustry,
  realEstateIndustry,
  medicalBillingIndustry,
  dentalIndustry,
  minibusIndustry,
  carRentalIndustry,
];

export function getIndustry(slug: string) {
  return industries.find((item) => item.slug === slug);
}

export function getIndustryCaseStudies(industry: IndustryLanding) {
  if (!industry.caseStudySlugs.length) return [];
  return industry.caseStudySlugs;
}

/** Directory / nav cards derived from published landings. */
export function industryDirectoryLinks() {
  return industries.map((item) => ({
    id: item.slug,
    title: item.name,
    href: item.path,
  }));
}
