import type { FaqItem } from '../faqs';
import type { ParentServiceId } from '../service-parents/types';

/** Values must match QuoteModal SERVICE_OPTIONS (extend modal when adding new ones). */
export type ChildServiceEnquiryValue = string;

export type ChildServiceLink = {
  label: string;
  href: string;
  text?: string;
};

export type ChildServiceSectionKey =
  | 'hero'
  | 'problems'
  | 'outcomes'
  | 'includes'
  | 'framework'
  | 'deliverables'
  | 'audience'
  | 'process'
  | 'caseStudies'
  | 'faqs'
  | 'related'
  | 'finalCta';

export type ChildServiceVisual =
  | 'local-search'
  | 'technical-crawl'
  | 'ecommerce-catalog'
  | 'ai-answer'
  | 'wordpress-editor'
  | 'shopify-store'
  | 'content-studio'
  | 'default';

export type ChildServiceLanding = {
  id: string;
  slug: string;
  /** Public path, e.g. `/services/seo/local-seo/` */
  path: string;
  name: string;
  parentId: ParentServiceId;
  parentLabel: string;
  parentPath: string;
  enquiryValue: ChildServiceEnquiryValue;
  seoTitle: string;
  seoDescription: string;
  schemaSummary: string;
  /** Ordered section keys. Omit a key to hide that section. */
  sectionOrder: ChildServiceSectionKey[];
  visual: ChildServiceVisual;
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    primaryCtaLabel: string;
    /** Omit to hide the secondary CTA. */
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    proofLine?: string;
  };
  problems: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: { title: string; text: string }[];
    compare: {
      weakLabel: string;
      strongLabel: string;
      weakPoints: string[];
      strongPoints: string[];
      note: string;
    };
  };
  outcomes: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: { title: string; text: string; motif: string }[];
  };
  includes: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: { number: string; title: string; text: string }[];
  };
  framework: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    hubLabel: string;
    hubText: string;
    nodes: { title: string; text: string }[];
  };
  deliverables: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    scopeNote: string;
    items: { title: string; text: string }[];
  };
  audience: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    profiles: { title: string; text: string; focus: string }[];
  };
  process: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    stages: { number: string; title: string; text: string }[];
  };
  /** Empty or missing → case studies section stays hidden. */
  caseStudySlugs: string[];
  faqs: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: FaqItem[];
  };
  related: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    intro: string;
    items: ChildServiceLink[];
  };
  finalCta: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    text: string;
    primaryLabel: string;
  };
};
