/**
 * Public industry landing API.
 * Implementations live in `./industry-landings/` — keep this file so imports of
 * `config/industries` resolve reliably (especially on Windows + Vite).
 */
export {
  getIndustry,
  getIndustryCaseStudies,
  industries,
  industryDirectoryLinks,
} from './industry-landings';

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
} from './industry-landings';
