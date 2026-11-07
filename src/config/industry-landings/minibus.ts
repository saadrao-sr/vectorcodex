import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const minibusIndustry: IndustryLanding = {
  slug: 'minibus',
  name: 'Minibus Rentals',
  shortName: 'Minibus',
  path: '/industries/minibus/',
  seoTitle: 'Minibus Rental Digital Marketing & Web Services',
  seoDescription:
    'Digital services for minibus rental operators — SEO, websites, and marketing shaped around local discovery, fleet clarity, and clearer booking enquiries. No invented results.',
  visualMotif: 'travel',
  hero: {
    eyebrow: 'Minibus Rentals',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Minibus Rental Operators.',
    intro:
      'Groups research hire options online before they enquire. VectorCodex helps minibus rental brands improve local visibility, present fleet and coverage clearly, and guide visitors toward booking requests — without invented occupancy claims.',
    primaryCtaLabel: 'Explore Minibus Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Hire Operators',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for minibus rental brands. Each one also points to a practical opportunity for clearer discovery and stronger booking journeys.',
    items: [
      {
        icon: 'map-pin',
        title: 'Weak local and coverage visibility',
        problem: 'Service areas, depots, and hire pages are incomplete or inconsistent across channels.',
        opportunity: 'Local SEO and clear coverage information help nearby groups find the right operator.',
        featured: true,
      },
      {
        icon: 'search',
        title: 'Fleet pages that do not match intent',
        problem: 'Generic hire copy fails to answer questions about capacity, routes, and booking steps.',
        opportunity: 'Structured vehicle and service pages support more relevant discovery.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile enquiry paths',
        problem: 'Slow pages, buried CTAs, and unclear forms interrupt booking requests.',
        opportunity: 'Faster, clearer websites make hire enquiries easier to complete.',
      },
      {
        icon: 'users',
        title: 'Group and corporate journeys underserved',
        problem: 'Sites speak to everyone and convince no one — especially schools, events, and corporate bookers.',
        opportunity: 'Audience-specific pathways clarify offers without inventing conversion rates.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns disconnected from landing pages',
        problem: 'Paid traffic lands on broad pages that do not continue the promise of the advert.',
        opportunity: 'Aligned landing experiences improve relevance between spend, message, and enquiry.',
      },
      {
        icon: 'gauge',
        title: 'Measurement that is hard to act on',
        problem: 'Calls, forms, and channel performance lack definitions teams can use.',
        opportunity: 'Clearer tracking helps prioritise improvements without vanity metrics.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Minibus hire journeys often move from trip planning to operator comparison to enquiry. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Event and leisure groups',
        text: 'Comparing capacity, pricing cues, and how easy it is to request a quote.',
      },
      {
        title: 'Schools and organisations',
        text: 'Evaluating reliability, coverage, and professional trust cues before booking.',
      },
      {
        title: 'Corporate travel coordinators',
        text: 'Looking for clear fleet options, service areas, and responsive enquiry paths.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A trip need triggers search, referral, or shortlist building.' },
      { title: 'Evaluation', text: 'Bookers compare fleet, coverage, proof, and booking ease.' },
      { title: 'Decision', text: 'They look for clear quote or reservation paths with minimal friction.' },
      { title: 'Follow-through', text: 'Response quality and expectation setting determine whether the hire completes.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Hire Growth.',
    intro:
      'We connect search, website experience, and marketing so minibus operators can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations around hire intent',
        text: 'SEO shaped to fleet types, coverage areas, and the questions bookers already ask.',
      },
      {
        title: 'Websites designed for clarity and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce enquiry friction.',
      },
      {
        title: 'Marketing aligned to intent',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful enquiry signals — not unverifiable booking claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Minibus Rentals',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Hire Operators.',
    intro:
      'Explore the VectorCodex services most often relevant to minibus rental brands. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for hire services, fleet types, and coverage content.',
      localSeo: 'Depot and service-area discovery for operators serving nearby groups.',
      technicalSeo: 'Crawlability, performance, and structural foundations for hire sites.',
      web: 'Fast, clear websites built for fleet clarity and conversion-ready enquiry journeys.',
      wordpress: 'Editable hire sites with practical publishing workflows for operations teams.',
      shopify: 'Commerce storefronts when operators sell add-ons or packaged offers online.',
      social: 'Social strategy and content systems that support awareness and enquiry.',
      content: 'Editorial concepts and creative direction tuned to fleet and trip storytelling.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Clear Hire Journeys.',
    intro: 'Minibus operators need partners who respect local competition, clarity, and scope — not inflated booking promises.',
    statement: 'Clarity first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around hire journeys, coverage clarity, and enquiry quality — not generic playbooks.',
      },
      {
        title: 'Integrated delivery',
        text: 'SEO, websites, and marketing stay connected so campaigns do not outrun the experience behind them.',
      },
      {
        title: 'Evidence over hype',
        text: 'Priorities follow available data and practical constraints. We do not invent rankings, booking volumes, or ROI claims.',
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
    titleHighlight: 'Booking Journeys.',
    intro: 'A five-stage path keeps minibus projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your fleet, coverage areas, audiences, seasonal demand, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth for',
    titleHighlight: 'Minibus Rentals.',
    intro: 'Straight answers about how VectorCodex supports hire operators online.',
    items: [
      {
        id: 'mbus-services',
        question: 'What digital services does VectorCodex offer for minibus rental operators?',
        answer:
          'We support SEO, local SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your fleet, coverage, and goals.',
      },
      {
        id: 'mbus-seo',
        question: 'Can SEO help a hire company attract more enquiries?',
        answer:
          'SEO can improve how clearly your services and coverage appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'mbus-website',
        question: 'Do you build minibus rental websites?',
        answer:
          'Yes. We design and develop websites focused on fleet clarity, mobile performance, and conversion-ready enquiry paths for hire brands.',
      },
      {
        id: 'mbus-ads',
        question: 'Do you manage Google Ads or social campaigns for hire operators?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement.',
      },
      {
        id: 'mbus-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'mbus-timeline',
        question: 'How long does a digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'mbus-claims',
        question: 'How do you handle pricing and availability claims?',
        answer:
          'We work from the fleet and information you approve. We avoid inventing rates, occupancy, or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 'mbus-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, coverage, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow Minibus Enquiries?',
    titleBefore: 'Build Digital Journeys Bookers Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger local visibility, a clearer fleet website, or marketing aligned to your coverage, VectorCodex is ready to help hire operators take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
