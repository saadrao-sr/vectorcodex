import { useMemo, useState } from 'react';
import type { BlogTerm } from '../../types/content';

interface Props {
  categories: BlogTerm[];
  /** Element id of the articles grid section. */
  listingId?: string;
}

export default function BlogCategoryFilter({ categories, listingId = 'blog-articles' }: Props) {
  const [activeId, setActiveId] = useState<number | 'all'>('all');

  const options = useMemo(
    () => categories.filter((category) => typeof category.id === 'number' && category.id > 0),
    [categories],
  );

  function applyFilter(next: number | 'all') {
    setActiveId(next);
    const root = document.getElementById(listingId);
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>('[data-blog-card]');
    cards.forEach((card) => {
      if (next === 'all') {
        card.hidden = false;
        return;
      }
      const ids = (card.dataset.categoryIds || '')
        .split(',')
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
      card.hidden = !ids.includes(next);
    });
  }

  if (options.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8" role="group" aria-label="Filter articles by category">
      <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.14em] text-white/45 uppercase">Categories</p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            className={[
              'inline-flex min-h-9 items-center rounded-full border px-3.5 text-xs font-semibold tracking-tight transition',
              activeId === 'all'
                ? 'border-highlight/40 bg-highlight/15 text-highlight'
                : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-highlight/35 hover:text-highlight',
            ].join(' ')}
            aria-pressed={activeId === 'all'}
            onClick={() => applyFilter('all')}
          >
            All
          </button>
        </li>
        {options.map((category) => {
          const id = category.id as number;
          const active = activeId === id;
          return (
            <li key={id}>
              <button
                type="button"
                className={[
                  'inline-flex min-h-9 items-center rounded-full border px-3.5 text-xs font-semibold tracking-tight transition',
                  active
                    ? 'border-highlight/40 bg-highlight/15 text-highlight'
                    : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-highlight/35 hover:text-highlight',
                ].join(' ')}
                aria-pressed={active}
                onClick={() => applyFilter(id)}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
