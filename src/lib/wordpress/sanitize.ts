import sanitizeHtml from 'sanitize-html';

const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  ndash: '–',
  mdash: '—',
};

/** Stable VectorCodex editorial attributes from Classic Editor style formats / legacy HTML. */
const vcDataAttributes = [
  'data-vc-component',
  'data-vc-citation',
  'data-vc-source-name',
  'data-vc-source-url',
  'data-vc-label',
  'data-vc-title',
  'data-vc-publisher',
  'data-vc-url',
  'data-vc-date',
  'data-vc-eyebrow',
  'data-vc-value',
  'data-vc-description',
  'data-vc-heading',
  'data-vc-contact',
  'data-vc-primary-text',
  'data-vc-primary-url',
  'data-vc-secondary-text',
  'data-vc-secondary-url',
  'data-vc-quote',
  'data-vc-attribution',
] as const;

const vcClassAndData = ['class', 'role', 'aria-hidden', 'aria-level', ...vcDataAttributes];

export function decodeEntities(input: string) {
  return input
    .replace(/&#(\d+);/g, (_, value: string) => String.fromCodePoint(Number(value)))
    .replace(/&#x([0-9a-f]+);/gi, (_, value: string) => String.fromCodePoint(parseInt(value, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => namedEntities[name.toLowerCase()] ?? match);
}

export function toPlainText(html: string) {
  const stripped = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeEntities(stripped)
    .replace(/\s+/g, ' ')
    .replace(/\s+\[(?:\u2026|\.\.\.)\]\s*$/u, '')
    .trim();
}

function definedAttributes(attributes: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(attributes).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

export function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'strong',
      'em',
      'b',
      'i',
      'code',
      'pre',
      'br',
      'hr',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'sup',
      'sub',
      'span',
      'iframe',
      'div',
      'aside',
      'section',
      'footer',
      'cite',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'rel', 'target', ...vcClassAndData],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      h2: ['id', 'class'],
      h3: ['id', 'class'],
      h4: ['id', 'class'],
      h5: ['id', 'class'],
      h6: ['id', 'class'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'],
      div: vcClassAndData,
      aside: vcClassAndData,
      section: vcClassAndData,
      span: vcClassAndData,
      p: vcClassAndData,
      blockquote: vcClassAndData,
      footer: ['class'],
      cite: ['class'],
      sup: ['class'],
      '*': [],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
      iframe: ['https'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
    transformTags: {
      h1: 'h2',
      a: (_tagName, attribs) => {
        const className = attribs.class ?? '';
        const forceBlank =
          attribs.target === '_blank' ||
          className.includes('vc-inline-citation') ||
          className.includes('vc-source-reference__link') ||
          className.includes('vc-stat-item__source');
        return {
          tagName: 'a',
          attribs: definedAttributes({
            href: attribs.href,
            title: attribs.title,
            class: attribs.class,
            rel: 'noopener noreferrer',
            target: forceBlank ? '_blank' : undefined,
            ...Object.fromEntries(vcDataAttributes.map((key) => [key, attribs[key]])),
          }),
        };
      },
      img: (_tagName, attribs) => ({
        tagName: 'img',
        attribs: definedAttributes({
          src: attribs.src,
          alt: attribs.alt ?? '',
          width: attribs.width,
          height: attribs.height,
          loading: 'lazy',
          decoding: 'async',
        }),
      }),
    },
  });
}
