export interface Crumb {
  name: string;
  href: string;
}

export interface ServiceInclude {
  title: string;
  text: string;
}

export interface Service {
  slug: string;
  path: string;
  title: string;
  navLabel: string;
  group: 'Search' | 'Build' | 'Marketing';
  summary: string;
  description: string;
  intro: string;
  includes: ServiceInclude[];
  related: string[];
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface CaseStudyResult {
  value: string;
  label: string;
  /** True until replaced with an approved, sourced metric. */
  placeholder?: boolean;
}

export interface CaseStudyImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudyMetric {
  value: string;
  label: string;
  /** Optional numeric value for animated counters — only when verified. */
  numericValue?: number;
  suffix?: string;
  /** True until replaced with an approved, sourced metric. */
  placeholder?: boolean;
  sourceNote?: string;
}

export interface CaseStudyStage {
  number: string;
  title: string;
  body: string;
  image?: CaseStudyImage;
}

export interface CaseStudyComparison {
  beforeLabel: string;
  afterLabel: string;
  beforeBody?: string;
  afterBody?: string;
  beforeImage?: CaseStudyImage;
  afterImage?: CaseStudyImage;
}

export interface CaseStudy {
  slug: string;
  path: string;
  title: string;
  summary: string;
  service: string;
  sector: string;
  placeholder: boolean;
  sections: CaseStudySection[];
  /** Optional cover used on homepage / listing cards. */
  image?: CaseStudyImage;
  /** Optional result metrics — omit or mark placeholder until verified. */
  results?: CaseStudyResult[];

  /** Unique SEO title (~50–60 chars). Falls back to title. */
  seoTitle?: string;
  /** Unique meta description (~140–160 chars). Falls back to summary. */
  seoDescription?: string;
  ogImage?: CaseStudyImage;
  publishedAt?: string;
  modifiedAt?: string;

  /** Hero / project metadata */
  industry?: string;
  clientLabel?: string;
  intro?: string;
  duration?: string;
  market?: string;
  audience?: string;
  servicesDelivered?: string[];
  serviceLinks?: CaseStudyLink[];
  heroImage?: CaseStudyImage;

  /** Optional storytelling blocks — omitted sections are not rendered. */
  metrics?: CaseStudyMetric[];
  clientOverview?: {
    body: string;
    audience?: string;
    objectives?: string[];
  };
  challenge?: {
    body: string;
    points?: string[];
  };
  strategy?: {
    body: string;
    points?: string[];
  };
  execution?: {
    body?: string;
    stages: CaseStudyStage[];
  };
  beforeAfter?: CaseStudyComparison;
  performance?: {
    body: string;
    metrics?: CaseStudyMetric[];
  };
  takeaways?: string[];
  relatedSlugs?: string[];
}

export interface BlogImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BlogTerm {
  /** WordPress term ID when available (used for category filtering). */
  id?: number;
  name: string;
  slug: string;
}

export interface BlogAuthorSocial {
  label: 'LinkedIn' | 'Facebook' | 'Pinterest' | string;
  href: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  modifiedAt: string;
  authorName?: string;
  authorAvatar?: string;
  /** Optional writer profile links shown on the article author card. */
  authorSocials?: BlogAuthorSocial[];
  image?: BlogImage;
  categories: BlogTerm[];
  tags?: BlogTerm[];
  readingMinutes?: number;
}

export interface BlogListResult {
  configured: boolean;
  ok: boolean;
  posts: BlogPost[];
  page: number;
  totalPages: number;
  total: number;
  /** Safe, non-secret diagnostic message for failed/missing WordPress config. */
  error?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}
