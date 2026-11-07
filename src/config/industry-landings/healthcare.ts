import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const healthcareIndustry: IndustryLanding = {
  slug: 'healthcare',
  name: 'Healthcare',
  shortName: 'Healthcare',
  path: '/industries/healthcare/',
  seoTitle: 'Healthcare Digital Marketing & Web Services',
  seoDescription:
    'Digital services for healthcare organisations — SEO, websites, and marketing shaped around trust, clarity, and patient-ready journeys. No invented results.',
  visualMotif: 'care',
  hero: {
    eyebrow: 'Healthcare Industry',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Healthcare Organisations.',
    intro:
      'Patients research care online before they enquire. VectorCodex helps healthcare organisations improve search visibility, build clearer websites, and run marketing that supports trust — without overclaiming outcomes.',
    primaryCtaLabel: 'Explore Healthcare Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Healthcare Brands',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers in healthcare. Each one also points to a practical opportunity for clearer discovery and stronger patient journeys.',
    items: [
      {
        icon: 'search',
        title: 'Service pages that do not match search intent',
        problem: 'Generic content fails to answer the questions people ask when researching treatments or specialties.',
        opportunity: 'Structured service pages can clarify offerings and support more relevant organic discovery.',
        featured: true,
      },
      {
        icon: 'map-pin',
        title: 'Weak local visibility',
        problem: 'Location details, listings, and local pages are incomplete or inconsistent across channels.',
        opportunity: 'Local SEO and accurate business information help nearby patients find the right site or clinic.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile journeys',
        problem: 'Slow pages, buried contact paths, and unclear CTAs interrupt enquiry when people are ready to act.',
        opportunity: 'Faster, clearer websites make booking or contact steps easier to complete.',
      },
      {
        icon: 'shield',
        title: 'Trust signals that feel thin',
        problem: 'Sites under-communicate credentials, process, and reassurance in language patients can understand.',
        opportunity: 'Transparent content structures help visitors evaluate care options with more confidence.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns disconnected from landing pages',
        problem: 'Paid traffic lands on broad pages that do not continue the promise of the advert.',
        opportunity: 'Aligned landing experiences improve relevance between spend, message, and next action.',
      },
      {
        icon: 'gauge',
        title: 'Measurement that is hard to act on',
        problem: 'Enquiry events, form completions, and channel performance are incomplete or poorly defined.',
        opportunity: 'Clearer tracking helps teams prioritise improvements without relying on vanity metrics.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Healthcare journeys often move from research to reassurance to contact. Understanding audience types and intent helps shape pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Patients researching a specific service',
        text: 'Looking for treatment clarity, suitability, and a credible next step at a nearby or preferred provider.',
      },
      {
        title: 'People comparing local options',
        text: 'Evaluating clinics by location, specialties, reviews signals, and how easy the site is to use.',
      },
      {
        title: 'Caregivers and referrers',
        text: 'Seeking practical information for someone else — pathways, contact routes, and service boundaries.',
      },
    ],
    journey: [
      {
        title: 'Awareness',
        text: 'A need or question triggers search, social discovery, or a referral recommendation.',
      },
      {
        title: 'Evaluation',
        text: 'Visitors compare services, locations, clinicians, and trust cues across sites and listings.',
      },
      {
        title: 'Decision',
        text: 'They look for clear contact, booking, or enquiry paths with minimal friction.',
      },
      {
        title: 'Follow-through',
        text: 'Confirmation, expectations, and next-step messaging determine whether the enquiry converts into attendance.',
      },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Healthcare Growth.',
    intro:
      'We connect search, website experience, and marketing so healthcare organisations can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations built around services',
        text: 'Technical and on-page SEO shaped to specialties, locations, and the questions patients already ask.',
      },
      {
        title: 'Websites designed for trust and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce enquiry friction.',
      },
      {
        title: 'Marketing aligned to intent',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking and reporting focused on useful signals — not unverifiable outcome claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Healthcare',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Healthcare Organisations.',
    intro:
      'Explore the VectorCodex services most often relevant to clinics, practices, and healthcare brands. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for services, specialties, and trusted content structures.',
      localSeo: 'Location pages and local discovery for practices serving nearby patients.',
      technicalSeo: 'Crawlability, performance, and structural foundations that support healthcare sites.',
      web: 'Fast, accessible websites built for clarity, trust, and conversion-ready journeys.',
      wordpress: 'Editable healthcare sites with practical publishing workflows for clinical teams.',
      shopify: 'Commerce storefronts when healthcare brands sell products or packages online.',
      social: 'Social strategy and content systems that support trust and patient enquiry journeys.',
      content: 'Editorial concepts, copy, and creative direction tuned to healthcare brand rules.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Careful, Clear Delivery.',
    intro: 'Healthcare brands need partners who respect trust, clarity, and scope — not inflated promises.',
    statement: 'Credibility first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around healthcare journeys, service clarity, and local discovery — not generic playbooks.',
      },
      {
        title: 'Integrated delivery',
        text: 'SEO, websites, and marketing stay connected so campaigns do not outrun the experience behind them.',
      },
      {
        title: 'Evidence over hype',
        text: 'Priorities follow available data and practical constraints. We do not invent rankings, patient volumes, or ROI claims.',
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
    titleHighlight: 'Healthcare Journeys.',
    intro: 'A five-stage path keeps healthcare projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your specialties, locations, audiences, compliance boundaries, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Healthcare.',
    intro: 'Straight answers about how VectorCodex supports healthcare organisations online.',
    items: [
      {
        id: 'hc-services',
        question: 'What digital services does VectorCodex offer for healthcare organisations?',
        answer:
          'We support SEO, local SEO, website development, WordPress builds, social media marketing, and paid campaign planning. Scope is tailored to your services, locations, and goals.',
      },
      {
        id: 'hc-seo',
        question: 'Can SEO help a clinic attract more local patients?',
        answer:
          'SEO can improve how clearly your services and locations appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'hc-website',
        question: 'Do you build healthcare websites?',
        answer:
          'Yes. We design and develop websites focused on clarity, mobile performance, and conversion-ready enquiry paths for clinics and healthcare brands.',
      },
      {
        id: 'hc-ads',
        question: 'Do you manage Google Ads or social campaigns for healthcare?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement, within the advertising policies that apply to your services.',
      },
      {
        id: 'hc-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'hc-timeline',
        question: 'How long does a healthcare digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'hc-compliance',
        question: 'How do you handle sensitive healthcare messaging?',
        answer:
          'We work from the claims and information you approve. We avoid inventing medical outcomes or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 'hc-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, locations, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow in Healthcare?',
    titleBefore: 'Build Digital Journeys Patients Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger local visibility, a clearer website, or marketing aligned to your services, VectorCodex is ready to help healthcare organisations take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
