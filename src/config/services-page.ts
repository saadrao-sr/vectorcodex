/**
 * Services directory page (`/services/`) content.
 * Child routes reuse published paths from the mega menu — no invented URLs.
 * Structure is reusable for future parent/child service pages.
 */
import { megaMenuCategories, type MegaMenuCategory, type MegaMenuLink } from './mega-menu';
import type { FaqItem } from './faqs';

export type ServicePillarIcon = MegaMenuCategory['icon'];

export type ServicePillar = {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  icon: ServicePillarIcon;
  children: MegaMenuLink[];
  /** Asymmetric bento placement hint. */
  featured?: boolean;
  span: 'wide' | 'narrow';
};

export type ServicesExpertiseItem = {
  id: string;
  title: string;
  text: string;
};

export type ServicesWhyPoint = {
  id: string;
  title: string;
  text: string;
};

export type ServicesProcessStep = {
  number: string;
  title: string;
  text: string;
};

const byId = Object.fromEntries(megaMenuCategories.map((item) => [item.id, item])) as Record<
  string,
  MegaMenuCategory
>;

function pillar(
  id: string,
  description: string,
  options: { featured?: boolean; span: 'wide' | 'narrow'; title?: string },
): ServicePillar {
  const source = byId[id];
  if (!source) throw new Error(`Unknown mega menu category: ${id}`);

  return {
    id: source.id,
    number: source.number,
    title: options.title ?? source.title.replace(/ Services$/, ''),
    description,
    href: source.href,
    icon: source.icon,
    children: source.links,
    featured: options.featured,
    span: options.span,
  };
}

export const servicesPageMeta = {
  title: 'Services',
  description:
    'Explore VectorCodex digital services — SEO, web development, social media marketing, and PPC management — planned and delivered as one growth system.',
  path: '/services/',
} as const;

export const servicesPageHero = {
  eyebrow: 'What We Do',
  titleBefore: 'Digital Solutions Built to Move Your',
  titleHighlight: 'Business Forward.',
  intro:
    'From search visibility and high-performing websites to social presence and paid media, VectorCodex helps organisations connect strategy, technology, and marketing into one clear growth path.',
  primaryCta: { label: 'Explore Our Services', href: '#service-pillars' },
  secondaryCta: { label: 'Discuss Your Project' },
} as const;

/** Four parent pillars — main visual focus of the services directory. */
export const servicePillars: ServicePillar[] = [
  pillar(
    'seo',
    'Strengthen organic discovery with technical foundations, clearer content architecture, and search systems built for long-term visibility.',
    { featured: true, span: 'wide', title: 'SEO' },
  ),
  pillar(
    'web',
    'Build fast, conversion-ready websites and digital experiences that support SEO, campaigns, and the journeys your customers actually take.',
    { span: 'narrow', title: 'Web Development' },
  ),
  pillar(
    'social',
    'Grow brand presence with social strategy, consistent content, and paid social that supports awareness and qualified engagement.',
    { span: 'narrow', title: 'Social Media Marketing' },
  ),
  pillar(
    'ppc',
    'Capture high-intent demand with structured paid campaigns, clearer landing-page fit, and tracking you can actually use.',
    { featured: true, span: 'wide', title: 'PPC Management' },
  ),
];

export const servicesExpertiseIntro = {
  eyebrow: 'Our Expertise',
  titleBefore: 'One Connected System for',
  titleHighlight: 'Digital Growth.',
  text: 'Strategy, development, search, and paid marketing work best when they reinforce each other — not when they run as separate silos.',
} as const;

export const servicesExpertiseItems: ServicesExpertiseItem[] = [
  {
    id: 'strategy',
    title: 'Strategy',
    text: 'Clarify goals, audiences, offers, and priorities before channels or campaigns are scaled.',
  },
  {
    id: 'development',
    title: 'Development',
    text: 'Ship sites and landing experiences that load quickly, communicate clearly, and convert demand.',
  },
  {
    id: 'search',
    title: 'Search Visibility',
    text: 'Improve crawlability, content clarity, and discovery so the right people can find you.',
  },
  {
    id: 'paid',
    title: 'Paid Marketing',
    text: 'Align media spend with intent, message, and measurement so traffic has somewhere useful to land.',
  },
];

export const servicesWhyIntro = {
  eyebrow: 'Why VectorCodex',
  titleBefore: 'A Digital Partner Built for',
  titleHighlight: 'Joined-Up Delivery.',
  text: 'We combine the practices businesses usually buy separately — so discovery, experience, and demand stay aligned.',
} as const;

export const servicesWhyPoints: ServicesWhyPoint[] = [
  {
    id: 'integrated',
    title: 'Integrated Expertise',
    text: 'SEO, web development, social, and paid media planned together under one team and one roadmap.',
  },
  {
    id: 'tailored',
    title: 'Tailored Strategies',
    text: 'Engagements are scoped around your goals, market, and current foundations — not generic packages.',
  },
  {
    id: 'data',
    title: 'Data-Led Decisions',
    text: 'Priorities follow journey friction, intent signals, and measurable evidence you can review.',
  },
  {
    id: 'transparent',
    title: 'Transparent Communication',
    text: 'Plain-language updates on what changed, what we learned, and what comes next.',
  },
  {
    id: 'optimize',
    title: 'Continuous Optimization',
    text: 'After launch, we refine based on performance so channels keep earning their place.',
  },
];

export const servicesProcessIntro = {
  eyebrow: 'How We Work',
  titleBefore: 'A Clear Path from Brief to',
  titleHighlight: 'Better Outcomes.',
  text: 'Four focused stages keep projects moving without losing clarity on scope, ownership, or next steps.',
} as const;

export const servicesProcessSteps: ServicesProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    text: 'We learn your business, audience, goals, constraints, and the digital foundations already in place.',
  },
  {
    number: '02',
    title: 'Strategise',
    text: 'We shape a practical roadmap that connects the right services to the outcomes that matter.',
  },
  {
    number: '03',
    title: 'Execute',
    text: 'Our team delivers the agreed SEO, website, social, or paid work with clear ownership.',
  },
  {
    number: '04',
    title: 'Optimize',
    text: 'We monitor what the data shows, refine the work, and keep improving what is already live.',
  },
];

export const servicesFaqsIntro = {
  eyebrow: 'Frequently Asked Questions',
  titleBefore: 'Questions About Our',
  titleHighlight: 'Digital Services.',
  text: 'Straight answers about how VectorCodex scopes, combines, and delivers digital work.',
} as const;

export const servicesFaqs: FaqItem[] = [
  {
    id: 'what-services',
    question: 'What digital services does VectorCodex offer?',
    answer:
      'We provide SEO, web development, social media marketing, and PPC management. Each area can be engaged on its own or combined into one growth plan.',
  },
  {
    id: 'choose-right',
    question: 'How do I choose the right service for my business?',
    answer:
      'Start with the outcome you need — visibility, a stronger website, brand presence, or qualified demand. We help map that goal to the right mix after understanding your audience and current setup.',
  },
  {
    id: 'pricing',
    question: 'How does pricing work?',
    answer:
      'Pricing depends on scope, complexity, and the channels involved. Share your goals and current site or campaign context and we will propose a scoped next step rather than a one-size quote.',
  },
  {
    id: 'timelines',
    question: 'How long do projects usually take?',
    answer:
      'Timelines vary by service and starting point. Website builds and campaigns can move faster once scope is clear, while SEO and ongoing marketing programmes typically improve over phased work.',
  },
  {
    id: 'combine',
    question: 'Can I combine SEO, web development and marketing?',
    answer:
      'Yes. Combined programmes often work best because search, site experience, social, and paid media reinforce each other when planned together.',
  },
  {
    id: 'get-started',
    question: 'How can I get started?',
    answer:
      'Use Discuss Your Project or Book a Free Consultation on this page and tell us what you need. We will follow up with a clear, scoped next step.',
  },
];

export const servicesFinalCta = {
  eyebrow: "Let's Build What's Next",
  titleBefore: 'Ready to Build Your Next',
  titleHighlight: 'Digital Growth Story?',
  text: 'Whether you need stronger search visibility, a high-performing website, social presence, or paid media that converts, VectorCodex is ready to help you take the next step.',
  secondaryLabel: 'Book a Free Consultation',
} as const;

/** Helper for future parent pages that need a single pillar by id. */
export function getServicePillar(id: string) {
  const pillarItem = servicePillars.find((item) => item.id === id);
  if (!pillarItem) throw new Error(`Unknown service pillar: ${id}`);
  return pillarItem;
}
