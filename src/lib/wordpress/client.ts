/**
 * Server-only WordPress REST client.
 * Do not import this module from React components.
 * WORDPRESS_API_KEY is not prefixed with PUBLIC_ and is not sent to the browser.
 */
import { getSecret } from 'astro:env/server';
import type { BlogFaq, BlogImage, BlogListResult, BlogPost, BlogTerm } from '../../types/content';
import type { WpFaq, WpMedia, WpPost, WpTerm } from '../../types/wordpress';
import { estimateReadingMinutes } from '../blog/content';
import { summarize } from '../seo/format';
import { sanitizeContent, toPlainText } from './sanitize';

export const BLOG_PAGE_SIZE = 9;

interface CacheEntry {
  status: number;
  total: number;
  totalPages: number;
  data: unknown;
}

/** Build-time only. Disabled in `astro dev` so WordPress edits appear on refresh. */
const cache = new Map<string, Promise<CacheEntry>>();
const isDev = import.meta.env.DEV;

function assertServer() {
  if (!import.meta.env.SSR) {
    throw new Error('The WordPress client can only run on the server.');
  }
}

/** Read server secrets via Astro's env schema (`astro:env/server`). */
function readServerEnv(name: 'WORDPRESS_API_URL' | 'WORDPRESS_API_KEY') {
  const fromSchema = getSecret(name);
  if (typeof fromSchema === 'string' && fromSchema.trim()) return fromSchema.trim();
  if (typeof process !== 'undefined' && typeof process.env?.[name] === 'string' && process.env[name]!.trim()) {
    return process.env[name]!.trim();
  }
  return '';
}

/**
 * Normalise WORDPRESS_API_URL to the wp-json root.
 * Accepts:
 * - https://blog.vectorcodex.com
 * - https://blog.vectorcodex.com/wp-json
 * - https://blog.vectorcodex.com/wp-json/wp/v2
 */
function apiRoot() {
  const raw = readServerEnv('WORDPRESS_API_URL');
  if (!raw) return null;
  let url = raw.replace(/\/$/, '');
  url = url.replace(/\/wp\/v2\/?$/, '');
  if (!url.endsWith('/wp-json')) url = `${url}/wp-json`;
  return url;
}

function authHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'VectorCodexWebsite/1.0',
  };
  const key = readServerEnv('WORDPRESS_API_KEY');
  if (key) {
    headers.Authorization = key.startsWith('Basic ') || key.startsWith('Bearer ') ? key : `Bearer ${key}`;
  }
  return headers;
}

async function wpGet(path: string): Promise<CacheEntry> {
  assertServer();
  const root = apiRoot();
  if (!root) throw new Error('WordPress is not configured.');

  const requestUrl = `${root}${path.startsWith('/') ? path : `/${path}`}`;
  // Process-lifetime cache freezes featured images / titles after the first hit in `astro dev`.
  if (!isDev) {
    const existing = cache.get(requestUrl);
    if (existing) return existing;
  }

  const pending = (async () => {
    const response = await fetch(requestUrl, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(20000),
      ...(isDev ? { cache: 'no-store' as RequestCache } : {}),
    });
    const body = await response.text();
    let data: unknown = null;
    if (body) {
      try {
        data = JSON.parse(body) as unknown;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      console.error(`[wordpress] ${response.status} for ${path}`);
      throw new Error(`WordPress request failed with status ${response.status}.`);
    }
    if (data === null) {
      console.error(`[wordpress] non-JSON response for ${path}`);
      throw new Error('WordPress returned a non-JSON response.');
    }
    const total = Number(response.headers.get('x-wp-total') ?? 0);
    const totalPages = Number(response.headers.get('x-wp-totalpages') ?? 0);
    return {
      status: response.status,
      total: Number.isFinite(total) ? total : 0,
      totalPages: Number.isFinite(totalPages) ? totalPages : 0,
      data,
    };
  })();

  if (!isDev) cache.set(requestUrl, pending);
  try {
    return await pending;
  } catch (error) {
    if (!isDev) cache.delete(requestUrl);
    throw error;
  }
}

function mapMediaImage(media: WpMedia | undefined, fallbackAlt: string): BlogImage | undefined {
  if (!media || media.code || typeof media.source_url !== 'string' || !media.source_url.trim()) {
    return undefined;
  }
  const sizes = media.media_details?.sizes;
  const preferred =
    sizes?.['blog-thumb'] ||
    sizes?.medium_large ||
    sizes?.large ||
    sizes?.medium ||
    undefined;
  const src = preferred?.source_url?.trim() || media.source_url.trim();
  if (!src) return undefined;
  return {
    src,
    alt: media.alt_text?.trim() || fallbackAlt,
    width: preferred?.width ?? media.media_details?.width,
    height: preferred?.height ?? media.media_details?.height,
  };
}

async function resolveFeaturedImage(post: WpPost, title: string): Promise<BlogImage | undefined> {
  const embedded = mapMediaImage(post._embedded?.['wp:featuredmedia']?.[0], title);
  if (embedded) return embedded;

  const mediaId = post.featured_media;
  if (!mediaId || mediaId <= 0) return undefined;

  try {
    const result = await wpGet(`/wp/v2/media/${mediaId}`);
    return mapMediaImage(result.data as WpMedia, title);
  } catch (error) {
    console.error(
      `[wordpress] featured media ${mediaId} unavailable`,
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}

function mapFaqs(raw: WpFaq[] | undefined, slug: string): BlogFaq[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;

  const faqs = raw
    .map((item, index) => {
      const question = toPlainText(item?.question ?? '').trim();
      const answer = toPlainText(item?.answer ?? '').trim();
      if (!question || !answer) return null;
      return {
        id: `${slug}-faq-${index + 1}`,
        question,
        answer,
      };
    })
    .filter((item): item is BlogFaq => Boolean(item));

  return faqs.length > 0 ? faqs : undefined;
}

async function mapPost(post: WpPost): Promise<BlogPost | null> {
  if (!post?.slug || !post.title?.rendered) return null;
  const title = toPlainText(post.title.rendered);
  const excerpt = summarize(toPlainText(post.excerpt?.rendered ?? ''), 220);
  const termGroups = post._embedded?.['wp:term'] ?? [];
  const flatTerms = termGroups.flat();
  const author = post._embedded?.author?.[0];
  const authorName = author?.name?.trim();
  const authorAvatar = author?.avatar_urls?.['96'] || author?.avatar_urls?.['48'] || author?.avatar_urls?.['24'];
  const contentHtml = sanitizeContent(post.content?.rendered ?? '');
  const image = await resolveFeaturedImage(post, title);

  const mapTerm = (term: WpTerm) => ({
    id: typeof term.id === 'number' ? term.id : undefined,
    name: toPlainText(term.name),
    slug: term.slug,
  });

  const categories = flatTerms
    .filter((term) => term.taxonomy === 'category')
    .map(mapTerm);

  const tags = flatTerms.filter((term) => term.taxonomy === 'post_tag').map(mapTerm);

  // WordPress embeds categories in group 0; fall back if taxonomy is omitted.
  const resolvedCategories =
    categories.length > 0
      ? categories
      : (termGroups[0] ?? []).map(mapTerm);

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt,
    contentHtml,
    publishedAt: post.date,
    modifiedAt: post.modified || post.date,
    authorName: authorName || undefined,
    authorAvatar: authorAvatar || undefined,
    image,
    categories: resolvedCategories,
    tags: tags.length > 0 ? tags : undefined,
    readingMinutes: estimateReadingMinutes(contentHtml),
    faqs: mapFaqs(post.vc_faqs, post.slug),
  };
}

async function mapPosts(data: unknown): Promise<BlogPost[]> {
  if (!Array.isArray(data)) return [];
  const mapped = await Promise.all(data.map((item) => mapPost(item as WpPost)));
  return mapped.filter((item): item is BlogPost => Boolean(item));
}

export async function getPostsPage(page: number, perPage = BLOG_PAGE_SIZE): Promise<BlogListResult> {
  const safePage = Math.max(1, page);
  const safePerPage = Math.min(100, Math.max(1, perPage));
  const root = apiRoot();
  if (!root) {
    return {
      configured: false,
      ok: false,
      posts: [],
      page: safePage,
      totalPages: 0,
      total: 0,
      error: 'WORDPRESS_API_URL is missing. Set it in the project root .env file.',
    };
  }

  try {
    const result = await wpGet(
      `/wp/v2/posts?status=publish&_embed=1&orderby=date&order=desc&page=${safePage}&per_page=${safePerPage}`,
    );
    const posts = await mapPosts(result.data);
    const totalPages = result.totalPages > 0 ? result.totalPages : posts.length > 0 ? 1 : 0;
    return {
      configured: true,
      ok: true,
      posts,
      page: safePage,
      totalPages,
      total: result.total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown WordPress request error';
    console.error('[wordpress] post list unavailable', message);
    return {
      configured: true,
      ok: false,
      posts: [],
      page: safePage,
      totalPages: 0,
      total: 0,
      error: `WordPress request failed (${root}): ${message}`,
    };
  }
}

export async function getAllPosts() {
  const first = await getPostsPage(1, 100);
  if (!first.configured || !first.ok) return [];
  const posts = [...first.posts];
  const pageCount = Math.min(first.totalPages, 50);
  for (let page = 2; page <= pageCount; page += 1) {
    const next = await getPostsPage(page, 100);
    if (!next.ok) break;
    posts.push(...next.posts);
  }
  return posts;
}

export async function getCategories(): Promise<BlogTerm[]> {
  if (!apiRoot()) return [];
  try {
    const result = await wpGet('/wp/v2/categories?per_page=100&hide_empty=true&orderby=count&order=desc');
    if (!Array.isArray(result.data)) return [];
    return (result.data as WpTerm[])
      .filter((term) => term.slug && term.name && term.slug !== 'uncategorized' && (term.count ?? 1) > 0)
      .map((term) => ({
        id: typeof term.id === 'number' ? term.id : undefined,
        name: toPlainText(term.name),
        slug: term.slug,
      }));
  } catch (error) {
    console.error('[wordpress] categories unavailable', error instanceof Error ? error.message : error);
    return [];
  }
}

/** Fetch a page of published posts filtered by WordPress category ID. */
export async function getPostsByCategoryId(
  categoryId: number,
  page = 1,
  perPage = BLOG_PAGE_SIZE,
): Promise<BlogListResult> {
  const safePage = Math.max(1, page);
  const safePerPage = Math.min(100, Math.max(1, perPage));
  if (!apiRoot() || !Number.isFinite(categoryId) || categoryId <= 0) {
    return { configured: Boolean(apiRoot()), ok: false, posts: [], page: safePage, totalPages: 0, total: 0 };
  }

  try {
    const result = await wpGet(
      `/wp/v2/posts?status=publish&_embed=1&categories=${categoryId}&orderby=date&order=desc&page=${safePage}&per_page=${safePerPage}`,
    );
    const posts = await mapPosts(result.data);
    const totalPages = result.totalPages > 0 ? result.totalPages : posts.length > 0 ? 1 : 0;
    return {
      configured: true,
      ok: true,
      posts,
      page: safePage,
      totalPages,
      total: result.total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown WordPress request error';
    console.error('[wordpress] category posts unavailable', message);
    return {
      configured: true,
      ok: false,
      posts: [],
      page: safePage,
      totalPages: 0,
      total: 0,
      error: message,
    };
  }
}
