import { services } from './services';
import type { NavGroup, NavLink } from '../types/content';

/** Top-level header links in display order. Services is rendered as a dropdown between Home and About. */
export const headerLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/industries/', label: 'Industries' },
  { href: '/case-studies/', label: 'Case Studies' },
  { href: '/contact/', label: 'Contact' },
  { href: '/blog/', label: 'Blog' },
];

/** Full-screen mobile menu links (desktop nav stays on headerLinks). */
export const mobileMenuLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/services/', label: 'Services' },
  { href: '/industries/', label: 'Industries' },
  { href: '/case-studies/', label: 'Case Studies' },
  { href: '/blog/', label: 'Insights' },
  { href: '/contact/', label: 'Contact' },
];

export const primaryLinks = headerLinks.filter((link) => link.href !== '/');

/** Desktop header CTA label — opens Free Audit modal via `data-audit-open`. */
export const ctaLink: NavLink = { href: '#free-audit', label: 'Get Free Audit' };

export const serviceGroups: NavGroup[] = ['Search', 'Build', 'Marketing'].map((label) => ({
  label,
  links: services.filter((service) => service.group === label).map((service) => ({
    href: service.path,
    label: service.navLabel,
  })),
}));

export const legalLinks: NavLink[] = [
  { href: '/privacy-policy/', label: 'Privacy Policy' },
];

export const companyLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/services/', label: 'Our Services' },
  { href: '/industries/', label: 'Industries' },
  { href: '/blog/', label: 'Insights' },
  { href: '/contact/', label: 'Contact' },
];

/** Footer services: parent pillars only — child routes stay in the mega menu. */
export const footerServiceLinks: NavLink[] = [
  { href: '/services/seo/', label: 'SEO' },
  { href: '/services/web-development/', label: 'Web Development' },
  { href: '/services/social-media-marketing/', label: 'Social Media Marketing' },
  { href: '/services/ppc-management/', label: 'PPC Management' },
];
