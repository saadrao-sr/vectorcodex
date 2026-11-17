import { useEffect, useId, useMemo, useState } from 'react';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

interface Props {
  headings: TocHeading[];
  className?: string;
}

export default function BlogTableOfContents({ headings, className = '' }: Props) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');

  const ids = useMemo(() => headings.map((item) => item.id), [headings]);

  useEffect(() => {
    if (ids.length === 0) return undefined;

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target;
        if (top?.id) setActiveId(top.id);
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={className}>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left lg:cursor-default lg:pointer-events-none"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-highlight uppercase">
            On this page
          </span>
          <span className="text-xs font-semibold text-white/55 lg:hidden">{open ? 'Hide' : 'Show'}</span>
        </button>

        <div
          id={panelId}
          className={`${open ? 'block' : 'hidden'} border-t border-white/10 px-3 py-3 lg:block`}
        >
          <ol className="space-y-1">
            {headings.map((heading) => {
              const active = heading.id === activeId;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={[
                      'block rounded-xl px-2.5 py-2 text-sm leading-5 transition',
                      heading.level === 3 ? 'pl-4' : '',
                      heading.level === 4 ? 'pl-6' : '',
                      active
                        ? 'bg-highlight/10 font-semibold text-highlight'
                        : 'text-white/65 hover:bg-white/[0.04] hover:text-white',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={active ? 'location' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
