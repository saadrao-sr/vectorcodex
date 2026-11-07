import type { FaqItem } from '../faqs';

export type IndustryVisualMotif = 'care' | 'finance' | 'travel' | 'property' | 'generic';

export type IndustryChallengeIcon =
  | 'search'
  | 'shield'
  | 'users'
  | 'file'
  | 'smartphone'
  | 'megaphone'
  | 'gauge'
  | 'map-pin';

export type IndustryChallenge = {
  icon: IndustryChallengeIcon;
  title: string;
  problem: string;
  opportunity: string;
  featured?: boolean;
};

export type IndustryAudienceSegment = {
  title: string;
  text: string;
};

export type IndustryJourneyStep = {
  title: string;
  text: string;
};

export type IndustrySolution = {
  title: string;
  text: string;
};

export type IndustryServiceLink = {
  label: string;
  href: string;
  description: string;
};

export type IndustryWhyPoint = {
  title: string;
  text: string;
};

export type IndustryProcessStep = {
  number: string;
  title: string;
  text: string;
};

export type IndustryLanding = {
  slug: string;
  name: string;
  /** Short label for eyebrows and UI chips. */
  shortName: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  /** Visual motif for hero composition. */
  visualMotif: IndustryVisualMotif;
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  challenges: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: IndustryChallenge[];
  };
  audience: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    segments: IndustryAudienceSegment[];
    journey: IndustryJourneyStep[];
  };
  solutions: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: IndustrySolution[];
  };
  services: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: IndustryServiceLink[];
  };
  why: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    statement: string;
    points: IndustryWhyPoint[];
  };
  process: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    steps: IndustryProcessStep[];
  };
  /** Case study slugs from `case-studies.ts`. Empty hides the section. */
  caseStudySlugs: string[];
  faqs: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: FaqItem[];
  };
  finalCta: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};
