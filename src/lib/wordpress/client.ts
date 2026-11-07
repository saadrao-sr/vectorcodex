/**
 * Server-only WordPress REST client.
 * Do not import this module from React components.
 * WORDPRESS_API_KEY is not prefixed with PUBLIC_ and is not sent to the browser.
 */
import type { BlogListResult, BlogPost, BlogTerm } from '../../types/content';
import type { WpPost, WpTerm } from '../../types/wordpress';
import { summarize } from '../seo/format';
import { sanitizeContent, toPlainText } from './sanitize';

export const BLOG_PAGE_SIZE = 9;

interface CacheEntry {
  status: number;
  total: number;
  totalPages: number;
  data: unknown;
}

const cache = new Map<string, Promise<CacheEntry>>();

function assertServer() {
  if (!import.meta.env.SSR) {
    throw new Error('The WordPress client can only run on the server.');
  }
}

function apiRoot() {
  const raw = import.meta.env.WORDPRESS_API_URL?.trim();
  if (!raw) return null;
  let url = raw.replace(/\/$/, '');
  url = url.replace(/\/wp\/v2$/, '');
  if (!url.endsWith('/wp-json')) url = `${url}/wp-json`;
  return url;
}

function authHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'VectorCodexWebsite/1.0',
  };
  const key = import.meta.env.WORDPRESS_API_KEY?.trim();
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
  const existing = cache.get(requestUrl);
  if (existing) return existing;

  const pending = (async () => {
    const response = await fetch(requestUrl, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(20000),
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

  cache.set(requestUrl, pending);
  try {
    return await pending;
  } catch (error) {
    cache.delete(requestUrl);
    throw error;
  }
}

function mapPost(post: WpPost): BlogPost | null {
  if (!post?.slug || !post.title?.rendered) return null;
  const title = toPlainText(post.title.rendered);
  const excerpt = summarize(toPlainText(post.excerpt?.rendered ?? ''), 220);
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const terms = post._embedded?.['wp:term']?.[0] ?? [];
  const authorName = post._embedded?.author?.[0]?.name?.trim();
  const image = media?.source_url
    ? {
        src: media.source_url,
        alt: media.alt_text?.trim() || title,
        width: media.media_details?.width,
        height: media.media_details?.height,
      }
    : undefined;

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt,
    contentHtml: sanitizeContent(post.content?.rendered ?? ''),
    publishedAt: post.date,
    modifiedAt: post.modified || post.date,
    authorName: authorName || undefined,
    image,
    categories: terms
      .filter((term) => term.taxonomy === 'category' || !term.taxonomy)
      .map((term) => ({ name: toPlainText(term.name), slug: term.slug })),
  };
}

export async function getPostsPage(page: number, perPage = BLOG_PAGE_SIZE): Promise<BlogListResult> {
  const safePage = Math.max(1, page);
  const safePerPage = Math.min(100, Math.max(1, perPage));
  if (!apiRoot()) {
    return { configured: false, ok: true, posts: [], page: safePage, totalPages: 0, total: 0 };
  }

  try {
    const result = await wpGet(
      `/wp/v2/posts?_embed=1&orderby=date&order=desc&page=${safePage}&per_page=${safePerPage}`,
    );
    const posts = Array.isArray(result.data)
      ? result.data.map((item) => mapPost(item as WpPost)).filter((item): item is BlogPost => Boolean(item))
      : [];
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
    console.error('[wordpress] post list unavailable', error instanceof Error ? error.message : error);
    return { configured: true, ok: false, posts: [], page: safePage, totalPages: 0, total: 0 };
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
      .filter((term) => term.slug && term.name && (term.count ?? 1) > 0)
      .map((term) => ({ name: toPlainText(term.name), slug: term.slug }));
  } catch (error) {
    console.error('[wordpress] categories unavailable', error instanceof Error ? error.message : error);
    return [];
  }
}
