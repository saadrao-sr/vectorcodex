import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const tobaccoIndustry: IndustryLanding = {
  slug: 'tobacco',
  name: 'Tobacco & Vape',
  shortName: 'Tobacco & Vape',
  path: '/industries/tobacco/',
  seoTitle: 'Tobacco & Vape Digital Marketing & Web Services',
  seoDescription:
    'Digital services for tobacco and vape brands — websites, SEO foundations, and carefully scoped marketing shaped around compliance-aware journeys. No invented results.',
  visualMotif: 'generic',
  hero: {
    eyebrow: 'Tobacco & Vape',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Tobacco & Vape Brands.',
    intro:
      'Regulated retail still needs clear websites, discoverable product information where allowed, and journeys customers can follow. VectorCodex helps tobacco and vape brands improve digital foundations within the policies that apply — without inventing reach or sales claims.',
    primaryCtaLabel: 'Explore Sector Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Regulated Retail',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for tobacco and vape brands. Each one also points to a practical opportunity for clearer, policy-aware customer journeys.',
    items: [
      {
        icon: 'shield',
        title: 'Policy constraints that stall delivery',
        problem: 'Teams are unsure what can be published, promoted, or tracked without creating risk.',
        opportunity: 'Scoped digital work can stay aligned to approved claims and platform rules.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Storefront friction',
        problem: 'Slow pages, unclear navigation, and weak product presentation interrupt purchase journeys where commerce is allowed.',
        opportunity: 'Faster, clearer websites make approved next steps easier to complete.',
        featured: true,
      },
      {
        icon: 'search',
        title: 'Discoverability without reckless tactics',
        problem: 'SEO and content efforts either overreach policy or under-serve legitimate informational needs.',
        opportunity: 'Careful search foundations focus on crawlable structure and approved information.',
      },
      {
        icon: 'file',
        title: 'Inconsistent product and brand information',
        problem: 'Details drift across site, marketplace, and offline channels.',
        opportunity: 'Governed content systems keep facts consistent where publishing is permitted.',
      },
      {
        icon: 'megaphone',
        title: 'Campaign channels with hard limits',
        problem: 'Paid and social options are restricted, leaving teams without a clear digital plan.',
        opportunity: 'Scoped programmes prioritise allowed channels and strong owned experiences.',
      },
      {
        icon: 'gauge',
        title: 'Measurement that is hard to act on',
        problem: 'Commerce and enquiry signals lack definitions teams can review responsibly.',
        opportunity: 'Clearer tracking helps prioritise improvements without vanity reporting.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Where advertising is constrained, owned experiences matter more. Audience clarity still shapes site structure, content, and permitted channels.',
    segments: [
      {
        title: 'Existing customers returning to buy',
        text: 'Need fast product clarity, stock cues where shown, and a trustworthy checkout or store path.',
      },
      {
        title: 'Adult shoppers comparing retailers',
        text: 'Evaluating brand credibility, fulfilment clarity, and how easy the site is to use.',
      },
      {
        title: 'Partners and trade contacts',
        text: 'Looking for professional digital presence before working with the brand.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A need or referral brings people to an owned site or approved listing.' },
      { title: 'Evaluation', text: 'Visitors compare products, policies, and trust cues within allowed surfaces.' },
      { title: 'Decision', text: 'They look for clear purchase, store, or contact paths with minimal friction.' },
      { title: 'Follow-through', text: 'Fulfilment messaging and support clarity determine whether the relationship continues.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Regulated Retail Growth.',
    intro:
      'We strengthen websites, technical foundations, and carefully scoped marketing so tobacco and vape brands can operate clearer digital journeys within applicable rules.',
    items: [
      {
        title: 'Technical and site foundations',
        text: 'Performance, structure, and crawlability that keep approved pages usable and maintainable.',
      },
      {
        title: 'Commerce and content clarity',
        text: 'Storefront and content systems shaped around what you can publish — not reckless growth tactics.',
      },
      {
        title: 'Channel planning within limits',
        text: 'Marketing scoped to platforms and formats your policies allow, with landing-page fit as the priority.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful signals — not unverifiable sales forecasts.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Tobacco & Vape',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Regulated Brands.',
    intro:
      'Explore the VectorCodex services most often relevant to tobacco and vape organisations. Scope always follows platform and legal constraints you confirm.',
    items: industryServiceLinks({
      seo: 'Technical and informational SEO foundations scoped to what you can publish.',
      localSeo: 'Store and listing clarity for retailers with physical locations.',
      technicalSeo: 'Crawlability, performance, and structural foundations for retail sites.',
      web: 'Fast, clear websites built for approved journeys and conversion-ready paths.',
      wordpress: 'Editable sites with practical publishing workflows and content governance.',
      shopify: 'Shopify storefronts when ecommerce is in scope and policy-compliant.',
      social: 'Social planning only where platform rules and your policies allow.',
      content: 'Copy and creative direction tuned to approved claims and brand rules.',
      ppc: 'Paid campaigns only where advertising policies and your brief allow.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Careful, Scoped Delivery.',
    intro: 'Regulated retail needs partners who respect policy boundaries, clarity, and scope — not reckless growth promises.',
    statement: 'Compliance-aware clarity. Channels that earn their place.',
    points: [
      {
        title: 'Policy-aware strategy',
        text: 'We shape recommendations around what you can publish and promote — not generic aggressive playbooks.',
      },
      {
        title: 'Integrated delivery',
        text: 'Websites, SEO foundations, and allowed marketing stay connected so channels do not conflict with owned experience.',
      },
      {
        title: 'Evidence over hype',
        text: 'Priorities follow available data and practical constraints. We do not invent rankings, sales volumes, or ROI claims.',
      },
      {
        title: 'Transparent communication',
        text: 'You get plain-language updates on what changed, what we learned, and what comes next.',
      },
    ],
  },
  process: {
    eyebrow: 'Our Process',
    titleBefore: 'From Brief to Better',
    titleHighlight: 'Owned Journeys.',
    intro: 'A five-stage path keeps regulated retail projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your products, markets, policy constraints, audiences, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Tobacco & Vape.',
    intro: 'Straight answers about how VectorCodex supports regulated retail brands online.',
    items: [
      {
        id: 'tob-services',
        question: 'What digital services can VectorCodex provide for tobacco or vape brands?',
        answer:
          'We commonly support website development, technical foundations, content governance, and carefully scoped marketing where platforms and your policies allow. Exact channels depend on jurisdiction and advertising rules.',
      },
      {
        id: 'tob-ads',
        question: 'Can you run paid social or search ads for vape products?',
        answer:
          'Only where platform policies and your legal requirements allow. We will not invent workarounds. If paid is restricted, we focus on owned experiences and permitted channels.',
      },
      {
        id: 'tob-website',
        question: 'Do you build ecommerce sites for this sector?',
        answer:
          'Yes, when ecommerce is legally and operationally in scope. We build clear, maintainable storefronts and avoid unverified sales claims.',
      },
      {
        id: 'tob-seo',
        question: 'Is SEO possible in a regulated category?',
        answer:
          'Technical and informational foundations can still matter. Content and promotional SEO tactics are scoped to what you can publish and stand behind.',
      },
      {
        id: 'tob-combine',
        question: 'Can website and marketing work be combined?',
        answer:
          'Yes, within allowed channels. Combined programmes work best when owned experiences and permitted campaigns reinforce each other.',
      },
      {
        id: 'tob-timeline',
        question: 'How long does a project take?',
        answer:
          'Timelines depend on scope, compliance review needs, and platform constraints. We agree a scoped plan before production.',
      },
      {
        id: 'tob-claims',
        question: 'How do you handle product claims?',
        answer:
          'We work from the claims and information you approve. We avoid inventing health, performance, or sales outcomes.',
      },
      {
        id: 'tob-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your markets, constraints, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Improve Your Digital Foundations?',
    titleBefore: 'Build Clearer Journeys Within',
    titleHighlight: 'the Rules That Apply.',
    text: 'Whether you need a stronger website, technical foundations, or carefully scoped marketing, VectorCodex is ready to help tobacco and vape brands take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
