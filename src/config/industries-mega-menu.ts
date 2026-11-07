/**
 * Desktop Industries mega menu + mobile industries accordion.
 * Links point at published `/industries/[slug]/` landings.
 * Do not invent industries, ratings, or partner logos.
 */
import { industries } from './industry-landings';

export type IndustryMegaLink = {
  id: string;
  label: string;
  href: string;
};

export type IndustryProofLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const industriesMegaLinks: IndustryMegaLink[] = industries.map((item) => ({
  id: item.slug,
  label: item.name,
  href: item.path,
}));

export const industriesMegaProof = {
  heading: 'Trusted Brands',
  subheading: "We've Worked With",
  text: 'Driving digital growth across different industries.',
  ctaLabel: 'View All Industries',
  ctaHref: '/industries/',
  logos: [
    { src: '/images/fonesavers.webp', alt: 'Fonesavers', width: 320, height: 120 },
    { src: '/images/galaxyways.webp', alt: 'Galaxyways', width: 320, height: 120 },
    { src: '/images/melahut.webp', alt: 'MelaHut', width: 320, height: 120 },
    { src: '/images/nten8.webp', alt: 'NTEN8', width: 320, height: 120 },
  ] satisfies IndustryProofLogo[],
} as const;
