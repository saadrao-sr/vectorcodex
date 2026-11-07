import { useEffect, useState, type MouseEvent } from 'react';

export type LegalTocItem = {
  id: string;
  number: string;
  title: string;
};

interface Props {
  items: LegalTocItem[];
  /** Offset under the fixed site header when scrolling to a section. */
  scrollOffset?: number;
}

export default function LegalToc({ items, scrollOffset = 112 }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return undefined;

    const updateActive = () => {
      const marker = scrollOffset + 4;
      let current = items[0]?.id ?? '';

      for (const item of items) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= marker) {
          current = item.id;
        }
      }

      setActiveId((prev) => (prev === current ? prev : current));
    };

    const hashId = window.location.hash.replace(/^#/, '');
    if (hashId && items.some((item) => item.id === hashId)) {
      const section = document.getElementById(hashId);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - scrollOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
        setActiveId(hashId);
      }
    } else {
      updateActive();
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [items, scrollOffset]);

  function goToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    setActiveId(id);

    if (window.history.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    } else {
      window.location.hash = id;
    }
  }

  return (
    <nav aria-label="Privacy policy contents" className="legal-toc">
      <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">On this page</p>
      <ol className="mt-4 space-y-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => goToSection(event, item.id)}
                className={`group flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-sm leading-5 transition ${
                  active
                    ? 'bg-highlight/10 text-highlight'
                    : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
                aria-current={active ? 'location' : undefined}
              >
                <span
                  className={`mt-0.5 font-display text-[0.65rem] font-semibold tracking-[0.08em] ${
                    active ? 'text-highlight' : 'text-white/35 group-hover:text-white/55'
                  }`}
                >
                  {item.number}
                </span>
                <span className="min-w-0">{item.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
