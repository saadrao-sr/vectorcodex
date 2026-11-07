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
    ],
    allowedAttributes: {
      a: ['href', 'title', 'rel', 'target'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      '*': [],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    transformTags: {
      h1: 'h2',
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: definedAttributes({
          href: attribs.href,
          title: attribs.title,
          rel: 'noopener noreferrer',
          target: attribs.target === '_blank' ? '_blank' : undefined,
        }),
      }),
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
