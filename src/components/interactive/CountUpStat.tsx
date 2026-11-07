import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  className?: string;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export default function CountUpStat({ value, suffix = '', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(easeOutCubic(progress) * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  const finalLabel = `${value}${suffix}`;

  return (
    <span ref={ref} className={`inline-grid tabular-nums ${className}`.trim()}>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {finalLabel}
      </span>
      <span className="col-start-1 row-start-1">
        {display}
        {suffix}
      </span>
    </span>
  );
}
