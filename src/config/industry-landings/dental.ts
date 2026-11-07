import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const dentalIndustry: IndustryLanding = {
  slug: 'dental',
  name: 'Dental Practices',
  shortName: 'Dental',
  path: '/industries/dental/',
  seoTitle: 'Dental Practice Digital Marketing & Web Services',
  seoDescription:
    'Digital services for dental practices — SEO, websites, and marketing shaped around trust, local discovery, and clearer patient enquiry journeys. No invented results.',
  visualMotif: 'care',
  hero: {
    eyebrow: 'Dental Practices',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Dental Practices.',
    intro:
      'Patients research dentists online before they book. VectorCodex helps practices improve local visibility, present treatments clearly, and guide visitors toward appointment enquiries — without overclaiming clinical outcomes.',
    primaryCtaLabel: 'Explore Dental Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Dental Practices',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for dental brands. Each one also points to a practical opportunity for clearer discovery and stronger patient journeys.',
    items: [
      {
        icon: 'map-pin',
        title: 'Weak local visibility',
        problem: 'Listings, hours, and treatment pages are incomplete or inconsistent across channels.',
        opportunity: 'Local SEO and accurate practice information help nearby patients find the right clinic.',
        featured: true,
      },
      {
        icon: 'search',
        title: 'Treatment pages that do not match intent',
        problem: 'Generic copy fails to answer the questions people ask when researching dental services.',
        opportunity: 'Structured treatment pages can clarify offerings and support more relevant discovery.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile booking paths',
        problem: 'Slow pages, buried CTAs, and unclear contact options interrupt enquiry.',
        opportunity: 'Faster, clearer websites make appointment requests easier to complete.',
      },
      {
        icon: 'shield',
        title: 'Trust signals that feel thin',
        problem: 'Credentials, process, and reassurance are under-communicated in patient-friendly language.',
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
      'Dental journeys often move from symptom or need to reassurance to booking. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Patients researching a treatment',
        text: 'Looking for suitability, process clarity, and a credible next step nearby.',
      },
      {
        title: 'Families comparing local practices',
        text: 'Evaluating location, hours, team trust cues, and how easy the site is to use.',
      },
      {
        title: 'Patients seeking urgent or routine care',
        text: 'Needing fast clarity on availability, contact routes, and what happens next.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A need, reminder, or referral triggers search and shortlist building.' },
      { title: 'Evaluation', text: 'Visitors compare treatments, locations, clinicians, and trust cues.' },
      { title: 'Decision', text: 'They look for clear booking or enquiry paths with minimal friction.' },
      { title: 'Follow-through', text: 'Confirmation and expectation setting influence whether the appointment sticks.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Dental Growth.',
    intro:
      'We connect search, website experience, and marketing so dental practices can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations around treatments',
        text: 'SEO shaped to services, locations, and the questions patients already ask.',
      },
      {
        title: 'Websites designed for trust and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce booking friction.',
      },
      {
        title: 'Marketing aligned to intent',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful enquiry signals — not unverifiable patient-volume claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Dental Practices',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Dental Brands.',
    intro:
      'Explore the VectorCodex services most often relevant to dental clinics and groups. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for treatments, specialties, and trusted content structures.',
      localSeo: 'Location pages and local discovery for practices serving nearby patients.',
      technicalSeo: 'Crawlability, performance, and structural foundations that support dental sites.',
      web: 'Fast, accessible websites built for clarity, trust, and conversion-ready booking journeys.',
      wordpress: 'Editable practice sites with practical publishing workflows for clinic teams.',
      shopify: 'Commerce storefronts when practices sell products or packages online.',
      social: 'Social strategy and content systems that support trust and patient enquiry journeys.',
      content: 'Editorial concepts, copy, and creative direction tuned to dental brand rules.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Careful, Clear Delivery.',
    intro: 'Dental brands need partners who respect trust, clarity, and scope — not inflated promises.',
    statement: 'Credibility first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around dental journeys, treatment clarity, and local discovery — not generic playbooks.',
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
    titleHighlight: 'Patient Journeys.',
    intro: 'A five-stage path keeps dental projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your treatments, locations, audiences, compliance boundaries, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth for',
    titleHighlight: 'Dental Practices.',
    intro: 'Straight answers about how VectorCodex supports dental organisations online.',
    items: [
      {
        id: 'den-services',
        question: 'What digital services does VectorCodex offer for dental practices?',
        answer:
          'We support SEO, local SEO, website development, WordPress builds, social media marketing, and paid campaign planning. Scope is tailored to your treatments, locations, and goals.',
      },
      {
        id: 'den-seo',
        question: 'Can SEO help a dental practice attract more local patients?',
        answer:
          'SEO can improve how clearly your treatments and locations appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'den-website',
        question: 'Do you build dental practice websites?',
        answer:
          'Yes. We design and develop websites focused on clarity, mobile performance, and conversion-ready enquiry paths for dental brands.',
      },
      {
        id: 'den-ads',
        question: 'Do you manage Google Ads or social campaigns for dental practices?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement, within the advertising policies that apply to your services.',
      },
      {
        id: 'den-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'den-timeline',
        question: 'How long does a dental digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'den-compliance',
        question: 'How do you handle sensitive dental messaging?',
        answer:
          'We work from the claims and information you approve. We avoid inventing clinical outcomes or testimonials and keep messaging aligned with what your practice can stand behind.',
      },
      {
        id: 'den-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, locations, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow Your Dental Practice?',
    titleBefore: 'Build Digital Journeys Patients Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger local visibility, a clearer website, or marketing aligned to your treatments, VectorCodex is ready to help dental practices take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
