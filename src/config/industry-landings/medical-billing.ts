import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const medicalBillingIndustry: IndustryLanding = {
  slug: 'medical-billing',
  name: 'Medical Billing',
  shortName: 'Medical Billing',
  path: '/industries/medical-billing/',
  seoTitle: 'Medical Billing Digital Marketing & Web Services',
  seoDescription:
    'Digital services for medical billing providers — SEO, websites, and marketing shaped around B2B trust, service clarity, and qualified enquiry. No invented results.',
  visualMotif: 'finance',
  hero: {
    eyebrow: 'Medical Billing',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Medical Billing Providers.',
    intro:
      'Healthcare operators research billing partners online before they shortlist. VectorCodex helps medical billing companies improve search visibility, explain services clearly, and attract qualified B2B enquiries — without invented performance claims.',
    primaryCtaLabel: 'Explore Billing Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Billing Providers',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for medical billing brands. Each one also points to a practical opportunity for clearer discovery and stronger B2B enquiry journeys.',
    items: [
      {
        icon: 'search',
        title: 'Service pages that sound interchangeable',
        problem: 'Generic billing copy fails to differentiate specialties, workflows, or operating models.',
        opportunity: 'Clearer service structures help the right healthcare buyers find the right partner.',
        featured: true,
      },
      {
        icon: 'shield',
        title: 'Trust cues that feel thin',
        problem: 'Security, process, and compliance language is buried or written for insiders only.',
        opportunity: 'Transparent positioning helps prospects evaluate fit with more confidence.',
        featured: true,
      },
      {
        icon: 'users',
        title: 'Buyer journeys that stall',
        problem: 'Sites talk about features but do not guide administrators toward a practical next step.',
        opportunity: 'Clearer CTAs and proof structures support qualified conversations.',
      },
      {
        icon: 'file',
        title: 'Content that does not support sales',
        problem: 'Thought leadership is irregular or disconnected from commercial service pages.',
        opportunity: 'Useful editorial systems can support authority without inventing outcomes.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns without landing-page fit',
        problem: 'Paid traffic lands on broad pages that dilute intent.',
        opportunity: 'Aligned landing pages keep message, offer, and next step connected.',
      },
      {
        icon: 'gauge',
        title: 'Lead quality that is hard to judge',
        problem: 'Forms and channel performance lack definitions sales teams can act on.',
        opportunity: 'Clearer tracking helps prioritise improvements without vanity reporting.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Medical billing journeys often move from operational pain to vendor comparison to a confidential conversation. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Practice and clinic administrators',
        text: 'Comparing billing partners for reliability, specialty fit, and onboarding clarity.',
      },
      {
        title: 'Healthcare operators and groups',
        text: 'Evaluating process maturity, reporting, and how professionally the brand presents online.',
      },
      {
        title: 'Referral and partnership contacts',
        text: 'Assessing credibility before recommending or co-selling services.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'An operational need or referral triggers search and shortlist building.' },
      { title: 'Evaluation', text: 'Buyers compare services, proof, process clarity, and trust cues.' },
      { title: 'Decision', text: 'They look for a low-friction enquiry or demo path they can trust.' },
      { title: 'Follow-through', text: 'Response quality and expectation setting determine whether the conversation continues.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'B2B Billing Growth.',
    intro:
      'We connect search, website experience, and marketing so medical billing providers can be found for the right queries and convert interest into clearer conversations.',
    items: [
      {
        title: 'Search foundations around services',
        text: 'SEO shaped to specialties, buyer questions, and commercial service clarity.',
      },
      {
        title: 'Websites built for B2B credibility',
        text: 'Clear service architecture, proof structures, and conversion paths that reduce enquiry friction.',
      },
      {
        title: 'Marketing aligned to intent',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful enquiry signals — not unverifiable ROI claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Medical Billing',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Billing Providers.',
    intro:
      'Explore the VectorCodex services most often relevant to medical billing organisations. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for billing services, specialties, and trusted content structures.',
      localSeo: 'Location and listing clarity when teams serve regional healthcare clients.',
      technicalSeo: 'Crawlability, performance, and structural foundations for B2B sites.',
      web: 'Fast, credible websites built for clarity and conversion-ready enquiry journeys.',
      wordpress: 'Editable sites with practical publishing workflows for marketing and sales enablement.',
      shopify: 'Commerce storefronts when providers sell packaged products or add-ons online.',
      social: 'Social strategy and content systems that support professional brand presence.',
      content: 'Editorial concepts and copy tuned to B2B trust and service clarity.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Credible B2B Brands.',
    intro: 'Medical billing providers need partners who respect trust, clarity, and scope — not inflated pipeline promises.',
    statement: 'Credibility first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around healthcare-adjacent buyer journeys and service clarity — not generic playbooks.',
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
    titleHighlight: 'Buyer Journeys.',
    intro: 'A five-stage path keeps medical billing projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your services, specialties, buyer audiences, compliance boundaries, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Medical Billing.',
    intro: 'Straight answers about how VectorCodex supports medical billing providers online.',
    items: [
      {
        id: 'mb-services',
        question: 'What digital services does VectorCodex offer for medical billing companies?',
        answer:
          'We support SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your services, markets, and goals.',
      },
      {
        id: 'mb-seo',
        question: 'Can SEO help a billing provider attract better B2B enquiries?',
        answer:
          'SEO can improve how clearly your services appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'mb-website',
        question: 'Do you build websites for medical billing firms?',
        answer:
          'Yes. We design and develop websites focused on credibility, mobile performance, and conversion-ready enquiry paths for B2B healthcare services brands.',
      },
      {
        id: 'mb-ads',
        question: 'Do you manage paid campaigns for medical billing?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement, within applicable advertising policies.',
      },
      {
        id: 'mb-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'mb-timeline',
        question: 'How long does a digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'mb-claims',
        question: 'How do you handle performance claims?',
        answer:
          'We work from the claims and information you approve. We avoid inventing collection rates, ROI, or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 'mb-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, markets, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow in Medical Billing?',
    titleBefore: 'Build Digital Journeys Buyers Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger visibility, a clearer website, or marketing aligned to your services, VectorCodex is ready to help medical billing providers take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
