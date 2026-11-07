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

export interface CaseStudy {
  slug: string;
  path: string;
  title: string;
  summary: string;
  service: string;
  sector: string;
  placeholder: boolean;
  sections: CaseStudySection[];
  /** Optional cover used on homepage showcase cards. */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /** Optional result metrics — omit or mark placeholder until verified. */
  results?: CaseStudyResult[];
}

export interface BlogImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BlogTerm {
  name: string;
  slug: string;
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
  image?: BlogImage;
  categories: BlogTerm[];
}

export interface BlogListResult {
  configured: boolean;
  ok: boolean;
  posts: BlogPost[];
  page: number;
  totalPages: number;
  total: number;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}
