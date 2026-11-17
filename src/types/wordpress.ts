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

export interface WpMediaSize {
  source_url?: string;
  width?: number;
  height?: number;
}

export interface WpMedia {
  id?: number;
  source_url?: string;
  alt_text?: string;
  /** Present when `_embed` returns a REST error instead of media. */
  code?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WpMediaSize>;
  };
}

export interface WpAuthor {
  name?: string;
  avatar_urls?: Record<string, string>;
}

export interface WpFaq {
  question?: string;
  answer?: string;
}

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  featured_media?: number;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  /** Registered by VectorCodex Blog child theme. */
  vc_faqs?: WpFaq[];
  _embedded?: {
    author?: WpAuthor[];
    'wp:featuredmedia'?: WpMedia[];
    'wp:term'?: WpTerm[][];
  };
}
