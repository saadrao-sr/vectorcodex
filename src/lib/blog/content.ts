import { toPlainText } from '../wordpress/sanitize';

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

/** Estimate reading time from HTML body. */
export function estimateReadingMinutes(html: string) {
  const words = toPlainText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Inject stable ids into h2–h4 and return a TOC list.
 * Safe to run after sanitizeContent.
 */
export function enrichArticleContent(html: string): { html: string; headings: BlogHeading[] } {
  const used = new Map<string, number>();
  const headings: BlogHeading[] = [];

  const nextHtml = html.replace(/<(h([2-4]))(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (_match, tag: string, levelRaw: string, attrs = '', inner: string) => {
    const level = Number(levelRaw) as 2 | 3 | 4;
    const text = toPlainText(inner);
    if (!text) return `<${tag}${attrs}>${inner}</${tag}>`;

    const existingId = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];
    const base = existingId || slugify(text) || `section-${headings.length + 1}`;
    const count = used.get(base) ?? 0;
    const id = count > 0 ? `${base}-${count + 1}` : base;
    used.set(base, count + 1);

    headings.push({ id, text, level });

    const withoutId = attrs.replace(/\s+id=["'][^"']*["']/i, '');
    return `<${tag}${withoutId} id="${id}">${inner}</${tag}>`;
  });

  return { html: nextHtml, headings };
}

export function getRelatedPosts(
  current: { slug: string; categories: { slug: string }[]; tags?: { slug: string }[] },
  pool: Array<{
    slug: string;
    categories: { slug: string }[];
    tags?: { slug: string }[];
    publishedAt: string;
  }>,
  limit = 3,
) {
  const categorySet = new Set(current.categories.map((item) => item.slug));
  const tagSet = new Set((current.tags ?? []).map((item) => item.slug));

  const scored = pool
    .filter((item) => item.slug !== current.slug)
    .map((item) => {
      const categoryScore = item.categories.reduce((sum, term) => sum + (categorySet.has(term.slug) ? 3 : 0), 0);
      const tagScore = (item.tags ?? []).reduce((sum, term) => sum + (tagSet.has(term.slug) ? 2 : 0), 0);
      return { item, score: categoryScore + tagScore, date: Date.parse(item.publishedAt) || 0 };
    })
    .sort((a, b) => b.score - a.score || b.date - a.date);

  const related = scored.filter((entry) => entry.score > 0).map((entry) => entry.item);
  if (related.length >= limit) return related.slice(0, limit);

  const fillers = scored
    .filter((entry) => entry.score === 0)
    .map((entry) => entry.item)
    .filter((item) => !related.some((entry) => entry.slug === item.slug));

  return [...related, ...fillers].slice(0, limit);
}

export function getAdjacentPosts<T extends { slug: string; publishedAt: string }>(currentSlug: string, pool: T[]) {
  const ordered = [...pool].sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  const index = ordered.findIndex((item) => item.slug === currentSlug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: ordered[index + 1] ?? null,
    next: ordered[index - 1] ?? null,
  };
}

/** Map common category/topic names to internal service links. */
export function getContextualServiceLinks(categories: { name: string; slug: string }[]) {
  const haystack = categories.map((item) => `${item.name} ${item.slug}`).join(' ').toLowerCase();
  const links: { label: string; href: string }[] = [];

  const push = (label: string, href: string) => {
    if (!links.some((item) => item.href === href)) links.push({ label, href });
  };

  if (/seo|search|ranking|organic/.test(haystack)) push('SEO Services', '/services/seo/');
  if (/web|wordpress|shopify|development|website/.test(haystack)) push('Web Development', '/services/web-development/');
  if (/social|content|marketing|ppc|ads/.test(haystack)) push('Social Media Marketing', '/services/social-media-marketing/');
  if (links.length === 0) {
    push('Explore Services', '/services/');
    push('Case Studies', '/case-studies/');
  }

  return links.slice(0, 3);
}
