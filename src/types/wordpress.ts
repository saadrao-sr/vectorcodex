export interface WpRendered {
  rendered: string;
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
  count?: number;
}

export interface WpMedia {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WpAuthor {
  name?: string;
}

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  _embedded?: {
    author?: WpAuthor[];
    'wp:featuredmedia'?: WpMedia[];
    'wp:term'?: WpTerm[][];
  };
}
