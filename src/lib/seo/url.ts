import { site } from '../../config/site';

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  if (withLeading === '/') return `${site.url}/`;
  const canonical = withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
  return `${site.url}${canonical}`;
}

export function isActivePath(path: string, href: string) {
  if (href === '/') return path === '/';
  const current = path.endsWith('/') ? path : `${path}/`;
  const target = href.endsWith('/') ? href : `${href}/`;
  return current === target || current.startsWith(target);
}

export function isExactPath(path: string, href: string) {
  const current = path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;
  const target = href === '/' ? '/' : href.endsWith('/') ? href : `${href}/`;
  return current === target;
}
