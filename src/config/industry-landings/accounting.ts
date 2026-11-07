import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const accountingIndustry: IndustryLanding = {
  slug: 'accounting',
  name: 'Accounting & Finance',
  shortName: 'Accounting',
  path: '/industries/accounting/',
  seoTitle: 'Accounting & Finance Digital Marketing & Web Services',
  seoDescription:
    'Digital services for accounting and finance firms — SEO, websites, and marketing shaped around trust, clarity, and qualified enquiry. No invented results.',
  visualMotif: 'finance',
  hero: {
    eyebrow: 'Accounting & Finance',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Accounting & Finance Firms.',
    intro:
      'Clients research advisors online before they book a call. VectorCodex helps accounting and finance firms improve search visibility, present services clearly, and attract qualified enquiries — without overclaiming outcomes.',
    primaryCtaLabel: 'Explore Accounting Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Professional Firms',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for accounting and finance brands. Each one also points to a practical opportunity for clearer discovery and stronger enquiry journeys.',
    items: [
      {
        icon: 'search',
        title: 'Service pages that sound interchangeable',
        problem: 'Generic practice copy fails to differentiate tax, audit, advisory, or niche specialisms.',
        opportunity: 'Clearer service structures help the right clients find the right expertise.',
        featured: true,
      },
      {
        icon: 'shield',
        title: 'Trust cues that feel thin',
        problem: 'Credentials, process, and team clarity are buried or written for insiders only.',
        opportunity: 'Transparent positioning helps prospects evaluate fit with more confidence.',
        featured: true,
      },
      {
        icon: 'map-pin',
        title: 'Weak local and regional discovery',
        problem: 'Listings and location pages do not match how clients search for nearby advisors.',
        opportunity: 'Local SEO and consistent firm information support nearby enquiry.',
      },
      {
        icon: 'file',
        title: 'Content that does not earn attention',
        problem: 'Thought leadership is irregular, thin, or disconnected from commercial services.',
        opportunity: 'Useful editorial systems can support authority without inventing expertise claims.',
      },
      {
        icon: 'megaphone',
        title: 'Paid demand without landing-page fit',
        problem: 'Campaigns send traffic to broad homepage experiences that dilute intent.',
        opportunity: 'Aligned landing pages keep message, offer, and next step connected.',
      },
      {
        icon: 'gauge',
        title: 'Lead quality that is hard to judge',
        problem: 'Forms, calls, and channel performance lack definitions teams can act on.',
        opportunity: 'Clearer tracking helps prioritise improvements without vanity reporting.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Finance journeys often move from research to reassurance to a confidential conversation. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Business owners seeking advice',
        text: 'Comparing specialists for tax, compliance, growth planning, or operational finance support.',
      },
      {
        title: 'Individuals researching personal services',
        text: 'Looking for clarity on process, fees framing, and whether the firm feels approachable.',
      },
      {
        title: 'Referral partners',
        text: 'Evaluating credibility and service boundaries before recommending a practice.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A need, deadline, or referral triggers search and shortlist building.' },
      { title: 'Evaluation', text: 'Prospects compare services, people, proof, and how clearly the firm explains next steps.' },
      { title: 'Decision', text: 'They look for a low-friction enquiry or consultation path they can trust.' },
      { title: 'Follow-through', text: 'Response quality and expectation setting determine whether the conversation continues.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Professional Growth.',
    intro:
      'We connect search, website experience, and marketing so accounting and finance firms can be found for the right queries and convert interest into clearer conversations.',
    items: [
      {
        title: 'Search foundations around services',
        text: 'SEO shaped to specialisms, locations, and the questions prospects already ask.',
      },
      {
        title: 'Websites built for credibility',
        text: 'Clear service architecture, team clarity, and conversion paths that reduce enquiry friction.',
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
    eyebrow: 'Services for Accounting & Finance',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Professional Firms.',
    intro:
      'Explore the VectorCodex services most often relevant to accounting and finance organisations. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for advisory services, specialisms, and trusted content structures.',
      localSeo: 'Location and listing clarity for firms serving nearby clients.',
      technicalSeo: 'Crawlability, performance, and structural foundations for professional sites.',
      web: 'Fast, credible websites built for clarity and conversion-ready enquiry journeys.',
      wordpress: 'Editable firm sites with practical publishing workflows for partners and marketers.',
      shopify: 'Commerce storefronts when firms sell packaged products or digital offerings online.',
      social: 'Social strategy and content systems that support professional brand presence.',
      content: 'Editorial concepts and copy tuned to regulated, trust-sensitive messaging.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Credible Professional Brands.',
    intro: 'Accounting and finance firms need partners who respect trust, clarity, and scope — not inflated promises.',
    statement: 'Credibility first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around professional journeys, service clarity, and qualified enquiry — not generic playbooks.',
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
    titleHighlight: 'Client Journeys.',
    intro: 'A five-stage path keeps accounting and finance projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your services, locations, audiences, compliance boundaries, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Accounting & Finance.',
    intro: 'Straight answers about how VectorCodex supports professional firms online.',
    items: [
      {
        id: 'acc-services',
        question: 'What digital services does VectorCodex offer for accounting firms?',
        answer:
          'We support SEO, local SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your services, locations, and goals.',
      },
      {
        id: 'acc-seo',
        question: 'Can SEO help an accounting firm attract better enquiries?',
        answer:
          'SEO can improve how clearly your services and locations appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'acc-website',
        question: 'Do you build websites for finance firms?',
        answer:
          'Yes. We design and develop websites focused on credibility, mobile performance, and conversion-ready enquiry paths for professional services brands.',
      },
      {
        id: 'acc-ads',
        question: 'Do you manage paid campaigns for accounting or finance?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement, within the advertising policies that apply to your services.',
      },
      {
        id: 'acc-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'acc-timeline',
        question: 'How long does a digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'acc-claims',
        question: 'How do you handle regulated or sensitive claims?',
        answer:
          'We work from the claims and information you approve. We avoid inventing outcomes or testimonials and keep messaging aligned with what your firm can stand behind.',
      },
      {
        id: 'acc-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, locations, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow in Accounting & Finance?',
    titleBefore: 'Build Digital Journeys Clients Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger visibility, a clearer website, or marketing aligned to your services, VectorCodex is ready to help professional firms take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
