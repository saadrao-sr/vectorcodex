import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';
import type { FaqItem } from '../../config/faqs';

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const expanded = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div
            key={item.id}
            className={[
              'overflow-hidden rounded-2xl border transition duration-300',
              expanded
                ? 'border-highlight/40 bg-white/[0.05] shadow-[0_12px_40px_rgb(0_0_0_/0.22)]'
                : 'border-white/10 bg-white/[0.03] hover:border-highlight/30',
            ].join(' ')}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenId(expanded ? null : item.id)}
              >
                <span className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                  {item.question}
                </span>
                <span
                  className={[
                    'mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition duration-300',
                    expanded
                      ? 'border-highlight/45 bg-highlight/15 text-highlight'
                      : 'border-white/15 bg-white/[0.04] text-white/70',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {expanded ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className={expanded ? 'border-t border-white/10' : undefined}
            >
              <p className="px-5 py-4 text-sm leading-6 text-white/65 sm:px-6 sm:pb-5 sm:text-[0.95rem] sm:leading-7">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
