import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const carRentalIndustry: IndustryLanding = {
  slug: 'car-rental',
  name: 'Car Rental Services',
  shortName: 'Car Rental',
  path: '/industries/car-rental/',
  seoTitle: 'Car Rental Digital Marketing & Web Services',
  seoDescription:
    'Digital services for car rental brands — SEO, websites, and marketing shaped around fleet clarity, local discovery, and clearer booking enquiries. No invented results.',
  visualMotif: 'travel',
  hero: {
    eyebrow: 'Car Rental Services',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Car Rental Brands.',
    intro:
      'Drivers research hire options online before they book. VectorCodex helps car rental operators improve search visibility, present fleet and locations clearly, and guide visitors toward reservation enquiries — without invented booking claims.',
    primaryCtaLabel: 'Explore Car Rental Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Rental Brands',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers for car rental operators. Each one also points to a practical opportunity for clearer discovery and stronger booking journeys.',
    items: [
      {
        icon: 'search',
        title: 'Fleet and location pages that underperform',
        problem: 'Vehicle categories and branch pages bury the details drivers compare before booking.',
        opportunity: 'Clearer fleet and location structures support more relevant organic discovery.',
        featured: true,
      },
      {
        icon: 'map-pin',
        title: 'Weak local and airport visibility',
        problem: 'Branch details, listings, and pickup information are incomplete or inconsistent.',
        opportunity: 'Local SEO and accurate location data help nearby and inbound drivers find the right operator.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile booking paths',
        problem: 'Slow pages, cluttered forms, and unclear CTAs interrupt reservation intent.',
        opportunity: 'Faster, clearer journeys make hire enquiries easier to complete.',
      },
      {
        icon: 'users',
        title: 'Leisure and business needs mixed together',
        problem: 'One generic journey serves neither tourist nor corporate bookers well.',
        opportunity: 'Audience-aware pathways clarify offers without inventing conversion rates.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns disconnected from inventory',
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
      'Car hire journeys often move from trip planning to operator comparison to reservation. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Leisure travellers booking vehicles',
        text: 'Comparing categories, pickup locations, pricing cues, and booking ease.',
      },
      {
        title: 'Business and corporate bookers',
        text: 'Evaluating reliability, coverage, and professional enquiry paths.',
      },
      {
        title: 'Local drivers needing temporary mobility',
        text: 'Looking for nearby availability, clear contact routes, and trustworthy next steps.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'A trip need triggers search, comparison sites, or referrals.' },
      { title: 'Evaluation', text: 'Drivers compare fleet, locations, proof, and reservation ease.' },
      { title: 'Decision', text: 'They look for clear booking or enquiry paths with minimal friction.' },
      { title: 'Follow-through', text: 'Confirmation and pickup messaging determine whether the hire completes smoothly.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Rental Growth.',
    intro:
      'We connect search, website experience, and marketing so car rental brands can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations around hire intent',
        text: 'SEO shaped to vehicle categories, locations, and the questions drivers already ask.',
      },
      {
        title: 'Websites designed for fleet and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce booking friction.',
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
    eyebrow: 'Services for Car Rental',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Rental Brands.',
    intro:
      'Explore the VectorCodex services most often relevant to car rental operators. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for vehicle categories, locations, and hire content.',
      localSeo: 'Branch and pickup discovery for operators serving nearby and inbound drivers.',
      technicalSeo: 'Crawlability, performance, and structural foundations for rental sites.',
      web: 'Fast, clear websites built for fleet clarity and conversion-ready booking journeys.',
      wordpress: 'Editable rental sites with practical publishing workflows for operations teams.',
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
    intro: 'Car rental brands need partners who respect local competition, clarity, and scope — not inflated booking promises.',
    statement: 'Clarity first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around hire journeys, location clarity, and enquiry quality — not generic playbooks.',
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
    intro: 'A five-stage path keeps car rental projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your fleet, branches, audiences, seasonal demand, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Car Rental.',
    intro: 'Straight answers about how VectorCodex supports rental brands online.',
    items: [
      {
        id: 'car-services',
        question: 'What digital services does VectorCodex offer for car rental brands?',
        answer:
          'We support SEO, local SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your fleet, locations, and goals.',
      },
      {
        id: 'car-seo',
        question: 'Can SEO help a rental company attract more bookings?',
        answer:
          'SEO can improve how clearly your fleet and locations appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'car-website',
        question: 'Do you build car rental websites?',
        answer:
          'Yes. We design and develop websites focused on fleet clarity, mobile performance, and conversion-ready enquiry or booking paths.',
      },
      {
        id: 'car-ads',
        question: 'Do you manage Google Ads or social campaigns for rental brands?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement.',
      },
      {
        id: 'car-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'car-timeline',
        question: 'How long does a digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'car-claims',
        question: 'How do you handle pricing and availability claims?',
        answer:
          'We work from the fleet and information you approve. We avoid inventing rates, occupancy, or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 'car-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, locations, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow Car Rental Enquiries?',
    titleBefore: 'Build Digital Journeys Drivers Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger local visibility, a clearer fleet website, or marketing aligned to your branches, VectorCodex is ready to help rental brands take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
