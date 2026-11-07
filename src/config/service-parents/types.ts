import type { FaqItem } from '../faqs';

export type ParentServiceId = 'seo' | 'web-development' | 'social-media-marketing' | 'ppc-management';

/** Values must match QuoteModal / BookingModal SERVICE_OPTIONS. */
export type ParentServiceEnquiryValue =
  | 'SEO'
  | 'Web Development'
  | 'Social Media Marketing'
  | 'PPC Management';

export type ParentServiceLink = {
  label: string;
  href: string;
  text: string;
};

export type ParentServiceProblem = {
  title: string;
  text: string;
};

export type ParentServiceCapability = {
  title: string;
  text: string;
  href?: string;
};

export type ParentServiceStep = {
  number: string;
  title: string;
  text: string;
};

export type ParentServiceDeliverable = {
  title: string;
  text: string;
};

export type ParentServiceLanding = {
  id: ParentServiceId;
  slug: string;
  path: string;
  name: string;
  enquiryValue: ParentServiceEnquiryValue;
  seoTitle: string;
  seoDescription: string;
  schemaSummary: string;
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    proofLine: string;
  };
  problems: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: ParentServiceProblem[];
  };
  capabilities: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: ParentServiceCapability[];
  };
  method: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    steps: ParentServiceStep[];
  };
  showcase: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    panels: { title: string; text: string; points: string[] }[];
  };
  children: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: ParentServiceLink[];
  };
  deliverables: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: ParentServiceDeliverable[];
  };
  /** Empty hides the case-study section. Only non-placeholder slugs should be listed. */
  caseStudySlugs: string[];
  faqs: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: FaqItem[];
  };
  midCta: {
    titleBefore: string;
    titleHighlight: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  finalCta: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    text: string;
    /** Omit or leave empty to hide the primary action. */
    primaryLabel?: string;
    /** When set, primary renders as a link (e.g. pricing calculator) instead of the quote modal. */
    primaryHref?: string;
    /** Omit or leave empty to hide the secondary booking button. */
    secondaryLabel?: string;
  };
};
