import { useEffect } from 'react';

/** Adds data-scrolled to the site header after a short scroll for stronger glass. */
export default function HeaderScroll() {
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return undefined;

    const update = () => {
      header.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return null;
}
