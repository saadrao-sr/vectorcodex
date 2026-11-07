/**
 * Talent / team role cards (homepage carousel, Our Team, About people section).
 * Replace placeholder names, emails, LinkedIn URLs, and portrait files with verified details only.
 * Do not invent people — leave `name` / `email` / `linkedin` pending until confirmed.
 */
export type TalentProfile = {
  id: string;
  /** EDIT: verified name only */
  name: string;
  role: string;
  /** Role capability summary — keep factual; not a personal biography */
  expertise: string;
  /** EDIT: verified email, or null until confirmed */
  email: string | null;
  /** EDIT: verified LinkedIn profile URL, or null until confirmed */
  linkedin: string | null;
  /** Drop a portrait at this public path when available */
  image: string;
  /** Initials shown while portrait is a placeholder */
  initials: string;
};

export const talentProfiles: TalentProfile[] = [
  {
    id: 'seo-specialist',
    name: 'Name pending',
    role: 'SEO Specialist',
    expertise: 'Search visibility, technical foundations, and content signals that support sustainable organic growth.',
    email: null,
    linkedin: null,
    image: '/images/team/seo-specialist.svg',
    initials: 'SE',
  },
  {
    id: 'web-developer',
    name: 'Name pending',
    role: 'Web Developer',
    expertise: 'Fast, accessible websites and digital experiences built for performance, clarity, and conversion.',
    email: null,
    linkedin: null,
    image: '/images/team/web-developer.svg',
    initials: 'WD',
  },
  {
    id: 'digital-marketing',
    name: 'Name pending',
    role: 'Digital Marketing Specialist',
    expertise: 'Channel strategy, campaigns, and messaging that connect the right offers with the right audiences.',
    email: null,
    linkedin: null,
    image: '/images/team/digital-marketing.svg',
    initials: 'DM',
  },
  {
    id: 'ppc-specialist',
    name: 'Name pending',
    role: 'PPC Specialist',
    expertise: 'Paid search and media planning focused on qualified demand, measurement, and efficient spend.',
    email: null,
    linkedin: null,
    image: '/images/team/ppc-specialist.svg',
    initials: 'PP',
  },
  {
    id: 'content-strategist',
    name: 'Name pending',
    role: 'Content Strategist',
    expertise: 'Editorial direction, messaging systems, and content that supports discovery and trust.',
    email: null,
    linkedin: null,
    image: '/images/team/content-strategist.svg',
    initials: 'CS',
  },
  {
    id: 'uiux-designer',
    name: 'Name pending',
    role: 'UI/UX Designer',
    expertise: 'User-centred interfaces and flows that make complex digital products feel clear and purposeful.',
    email: null,
    linkedin: null,
    image: '/images/team/uiux-designer.svg',
    initials: 'UX',
  },
];
