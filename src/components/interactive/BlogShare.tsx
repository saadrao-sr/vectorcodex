import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Props {
  url: string;
  title: string;
}

const iconPaths = {
  linkedin:
    'M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.84v1.98h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.67c0-1.59-.03-3.63-2.21-3.63-2.21 0-2.55 1.73-2.55 3.51V23h-4V8.5z',
  facebook: 'M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3.1l.9-3H13v-1.5c0-.8.7-1.5 1.5-1.5z',
  x: 'M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L4.9 22H1.64l8.03-9.17L1.5 2h6.75l4.66 6.17L18.244 2Zm-1.16 18h1.82L7.04 3.94H5.09L17.084 20Z',
} as const;

function SocialIcon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function BlogShare({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encoded = useMemo(
    () => ({
      url: encodeURIComponent(url),
      title: encodeURIComponent(title),
    }),
    [url, title],
  );

  const links = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
      path: iconPaths.linkedin,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
      path: iconPaths.facebook,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encoded.url}&text=${encoded.title}`,
      path: iconPaths.x,
    },
  ] as const;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-white/45 uppercase">Share</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/75 transition hover:border-highlight/40 hover:text-highlight"
            aria-label={`Share on ${link.label}`}
          >
            <SocialIcon path={link.path} />
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 text-xs font-semibold text-white/75 transition hover:border-highlight/40 hover:text-highlight"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
