import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const realEstateIndustry: IndustryLanding = {
  slug: 'real-estate',
  name: 'Real Estate',
  shortName: 'Real Estate',
  path: '/industries/real-estate/',
  seoTitle: 'Real Estate Digital Marketing & Web Services',
  seoDescription:
    'Digital services for real estate brands — SEO, websites, and marketing shaped around listings clarity, local discovery, and qualified enquiry. No invented results.',
  visualMotif: 'property',
  hero: {
    eyebrow: 'Real Estate Industry',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Real Estate Brands.',
    intro:
      'Buyers and renters research property online before they enquire. VectorCodex helps agencies and developers improve search visibility, present listings clearly, and guide visitors toward viewing requests — without invented sales claims.',
    primaryCtaLabel: 'Explore Real Estate Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Property Brands',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers in real estate. Each one also points to a practical opportunity for clearer discovery and stronger enquiry journeys.',
    items: [
      {
        icon: 'search',
        title: 'Area and listing pages that underperform',
        problem: 'Thin location copy and duplicated listing templates fail to match how people search.',
        opportunity: 'Clearer area and property structures support more relevant organic discovery.',
        featured: true,
      },
      {
        icon: 'map-pin',
        title: 'Weak local visibility',
        problem: 'Branch details, listings profiles, and local pages are inconsistent across channels.',
        opportunity: 'Local SEO and accurate business information help nearby enquirers find the right team.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile enquiry paths',
        problem: 'Slow pages, buried contact CTAs, and cluttered filters interrupt viewing requests.',
        opportunity: 'Faster, clearer journeys make enquiry steps easier to complete.',
      },
      {
        icon: 'file',
        title: 'Listing experiences that feel dated',
        problem: 'Media, details, and next steps are hard to scan on the devices buyers actually use.',
        opportunity: 'Modern listing templates improve clarity without inventing conversion rates.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns disconnected from inventory',
        problem: 'Paid traffic lands on broad pages that do not continue the promise of the advert.',
        opportunity: 'Aligned landing experiences improve relevance between spend, message, and enquiry.',
      },
      {
        icon: 'gauge',
        title: 'Lead quality that is hard to judge',
        problem: 'Form and call tracking lack definitions teams can use to improve programmes.',
        opportunity: 'Clearer measurement helps prioritise improvements without vanity metrics.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Property journeys often move from area research to listing comparison to enquiry. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Buyers researching areas and homes',
        text: 'Comparing locations, property details, and how easy it is to request a viewing.',
      },
      {
        title: 'Renters seeking availability',
        text: 'Looking for clear listings, criteria, and trustworthy contact paths.',
      },
      {
        title: 'Sellers and landlords evaluating agents',
        text: 'Assessing market presence, credibility, and how professionally the brand presents online.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A move, investment need, or referral triggers search and shortlist building.' },
      { title: 'Evaluation', text: 'Visitors compare areas, listings, agents, and trust cues across sites and portals.' },
      { title: 'Decision', text: 'They look for clear enquiry, viewing, or valuation paths with minimal friction.' },
      { title: 'Follow-through', text: 'Response quality and expectation setting determine whether the conversation continues.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Property Growth.',
    intro:
      'We connect search, website experience, and marketing so real estate brands can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations around areas and services',
        text: 'SEO shaped to locations, property types, and the questions buyers already ask.',
      },
      {
        title: 'Websites designed for listings and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce enquiry friction.',
      },
      {
        title: 'Marketing aligned to inventory',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful enquiry signals — not unverifiable sales claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Real Estate',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Property Brands.',
    intro:
      'Explore the VectorCodex services most often relevant to agencies, developers, and property brands. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for areas, property types, and trusted content structures.',
      localSeo: 'Branch and listing discovery for teams serving nearby buyers and renters.',
      technicalSeo: 'Crawlability, performance, and structural foundations for property sites.',
      web: 'Fast, conversion-ready websites built for listings clarity and enquiry journeys.',
      wordpress: 'Editable property sites with practical publishing workflows for marketing teams.',
      shopify: 'Commerce storefronts when property brands sell packages, merch, or add-ons online.',
      social: 'Social strategy and content systems that support listing promotion and brand trust.',
      content: 'Editorial concepts and creative direction tuned to property storytelling.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Property Demand Journeys.',
    intro: 'Real estate brands need partners who respect local competition, clarity, and scope — not inflated sales promises.',
    statement: 'Clarity first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around property journeys, area clarity, and enquiry quality — not generic playbooks.',
      },
      {
        title: 'Integrated delivery',
        text: 'SEO, websites, and marketing stay connected so campaigns do not outrun the experience behind them.',
      },
      {
        title: 'Evidence over hype',
        text: 'Priorities follow available data and practical constraints. We do not invent rankings, lead volumes, or ROI claims.',
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
    titleHighlight: 'Property Journeys.',
    intro: 'A five-stage path keeps real estate projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your markets, inventory types, audiences, branch footprint, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Real Estate.',
    intro: 'Straight answers about how VectorCodex supports property brands online.',
    items: [
      {
        id: 're-services',
        question: 'What digital services does VectorCodex offer for real estate brands?',
        answer:
          'We support SEO, local SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your markets, branches, and goals.',
      },
      {
        id: 're-seo',
        question: 'Can SEO help an agency attract more viewing enquiries?',
        answer:
          'SEO can improve how clearly your areas and services appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 're-website',
        question: 'Do you build real estate websites?',
        answer:
          'Yes. We design and develop websites focused on listings clarity, mobile performance, and conversion-ready enquiry paths for property brands.',
      },
      {
        id: 're-ads',
        question: 'Do you manage Google Ads or social campaigns for property?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement.',
      },
      {
        id: 're-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 're-timeline',
        question: 'How long does a real estate digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 're-claims',
        question: 'How do you handle pricing and sales claims?',
        answer:
          'We work from the listings and information you approve. We avoid inventing sales volumes, valuations, or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 're-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, markets, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow in Real Estate?',
    titleBefore: 'Build Digital Journeys Buyers Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger local visibility, clearer listing experiences, or marketing aligned to your inventory, VectorCodex is ready to help property brands take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
