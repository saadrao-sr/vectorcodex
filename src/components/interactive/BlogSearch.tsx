import { Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import type { BlogPost } from '../../types/content';

export type BlogSearchItem = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'publishedAt' | 'image' | 'categories'
>;

interface Props {
  posts: BlogSearchItem[];
  /** Placeholder journal cards are not linked until WordPress posts exist. */
  placeholders?: boolean;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(date);
}

export default function BlogSearch({ posts, placeholders = false }: Props) {
  const inputId = useId();
  const statusId = useId();
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  const matches = useMemo(() => {
    if (!searching) return [];
    const needle = trimmed.toLowerCase();
    return posts.filter((post) => post.title.toLowerCase().includes(needle));
  }, [posts, searching, trimmed]);

  useEffect(() => {
    const listing = document.getElementById('blog-articles');
    if (!listing) return undefined;
    if (searching) {
      listing.setAttribute('hidden', '');
      listing.setAttribute('aria-hidden', 'true');
    } else {
      listing.removeAttribute('hidden');
      listing.removeAttribute('aria-hidden');
    }
    return () => {
      listing.removeAttribute('hidden');
      listing.removeAttribute('aria-hidden');
    };
  }, [searching]);

  return (
    <div className="blog-search mt-5 w-full sm:mt-6">
      <div className="mx-auto max-w-2xl">
        <label htmlFor={inputId} className="sr-only">
          Search articles by name
        </label>
        <div className="relative">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-highlight/80"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles by name…"
            autoComplete="off"
            spellCheck={false}
            aria-controls={statusId}
            aria-describedby={statusId}
            className="min-h-11 w-full rounded-full border border-white/12 bg-white/[0.04] py-2.5 pr-12 pl-11 text-sm text-white shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)] transition placeholder:text-white/40 hover:border-white/20 focus:border-highlight focus:bg-white/[0.06] focus:outline-none"
          />
          {searching && (
            <button
              type="button"
              className="absolute top-1/2 right-3 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition hover:border-highlight/40 hover:text-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <p id={statusId} className="mt-2 text-center text-xs text-white/50 sm:text-sm" aria-live="polite">
          {searching
            ? matches.length === 0
              ? `No articles match “${trimmed}”.`
              : `${matches.length} article${matches.length === 1 ? '' : 's'} found`
            : posts.length > 0
              ? 'Type an article name to filter the journal.'
              : 'Articles will appear here once published.'}
        </p>
      </div>

      {searching && matches.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((post) => {
            const href = placeholders ? undefined : `/blog/${post.slug}/`;
            const date = formatDate(post.publishedAt);
            const body = (
              <>
                <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                  {post.image ? (
                    <img
                      src={post.image.src}
                      alt={post.image.alt}
                      width={post.image.width}
                      height={post.image.height}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-4 text-sm font-semibold text-highlight">Article</div>
                  )}
                  {placeholders && (
                    <span className="absolute top-3 left-3 rounded-full border border-highlight/40 bg-[#0D120C]/75 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-highlight uppercase backdrop-blur-sm">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {post.categories[0] && (
                    <p className="text-xs font-semibold tracking-[0.16em] text-highlight uppercase">
                      {post.categories[0].name}
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-xl leading-tight font-semibold tracking-tight sm:text-2xl group-hover:text-highlight">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">{post.excerpt}</p>
                  )}
                  {date && (
                    <time dateTime={post.publishedAt} className="mt-5 text-sm text-white/50">
                      {date}
                    </time>
                  )}
                </div>
              </>
            );

            return (
              <li key={post.id} className="h-full">
                <article className="h-full">
                  {href ? (
                    <a
                      href={href}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-highlight/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      {body}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
