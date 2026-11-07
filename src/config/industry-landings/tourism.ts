import { industryServiceLinks, sharedProcessSteps, withDiscoverStep } from './shared';
import type { IndustryLanding } from './types';

export const tourismIndustry: IndustryLanding = {
  slug: 'tourism',
  name: 'Tourism & Travel',
  shortName: 'Tourism',
  path: '/industries/tourism/',
  seoTitle: 'Tourism & Travel Digital Marketing & Web Services',
  seoDescription:
    'Digital services for tourism and travel brands — SEO, websites, and marketing shaped around discovery, trust, and clearer booking journeys. No invented results.',
  visualMotif: 'travel',
  hero: {
    eyebrow: 'Tourism & Travel',
    titleBefore: 'Digital Growth for',
    titleHighlight: 'Tourism & Travel Brands.',
    intro:
      'Travellers research destinations, packages, and operators online before they book. VectorCodex helps tourism brands improve discovery, present offers clearly, and guide visitors toward enquiry or booking — without invented occupancy claims.',
    primaryCtaLabel: 'Explore Tourism Solutions',
    secondaryCtaLabel: 'Discuss Your Project',
  },
  challenges: {
    eyebrow: 'Challenges & Opportunities',
    titleBefore: 'What Holds Travel Brands',
    titleHighlight: 'Back Online.',
    intro:
      'These are common digital barriers in tourism and travel. Each one also points to a practical opportunity for clearer discovery and stronger booking journeys.',
    items: [
      {
        icon: 'search',
        title: 'Offers that do not match search intent',
        problem: 'Packages, tours, and destination pages bury the details travellers compare before booking.',
        opportunity: 'Clearer offer structures support more relevant organic and paid discovery.',
        featured: true,
      },
      {
        icon: 'smartphone',
        title: 'Friction on mobile booking paths',
        problem: 'Slow pages, unclear CTAs, and cluttered itineraries interrupt travellers ready to enquire.',
        opportunity: 'Faster, clearer journeys make the next step easier to complete.',
        featured: true,
      },
      {
        icon: 'map-pin',
        title: 'Weak local and destination visibility',
        problem: 'Location and experience pages are thin, duplicated, or inconsistent across channels.',
        opportunity: 'Local and destination SEO help nearby and inbound travellers find the right offer.',
      },
      {
        icon: 'users',
        title: 'Seasonal demand without a content system',
        problem: 'Campaigns spike then drop because editorial and creative planning is ad hoc.',
        opportunity: 'Repeatable content systems keep presence useful outside peak windows.',
      },
      {
        icon: 'megaphone',
        title: 'Campaigns disconnected from landing pages',
        problem: 'Ads promise experiences that the landing page does not continue cleanly.',
        opportunity: 'Aligned destinations improve relevance between spend, message, and enquiry.',
      },
      {
        icon: 'gauge',
        title: 'Measurement that is hard to act on',
        problem: 'Enquiry, booking-assist, and channel performance lack definitions teams can use.',
        opportunity: 'Clearer tracking helps prioritise improvements without vanity metrics.',
      },
    ],
  },
  audience: {
    eyebrow: 'Target Audience',
    titleBefore: 'Who You Need to Reach — and',
    titleHighlight: 'How They Decide.',
    intro:
      'Travel journeys often move from inspiration to comparison to booking. Audience clarity shapes pages, search strategy, and campaigns.',
    segments: [
      {
        title: 'Leisure travellers comparing experiences',
        text: 'Looking for destination clarity, inclusions, pricing cues, and trustworthy next steps.',
      },
      {
        title: 'Business and group travellers',
        text: 'Evaluating logistics, reliability, and enquiry paths that feel professional.',
      },
      {
        title: 'Partners and affiliates',
        text: 'Assessing brand credibility before recommending or co-selling an offer.',
      },
    ],
    journey: [
      { title: 'Awareness', text: 'Inspiration or need triggers search, social discovery, or a referral.' },
      { title: 'Evaluation', text: 'Travellers compare packages, destinations, proof, and booking ease.' },
      { title: 'Decision', text: 'They look for clear enquiry, reservation, or contact paths with minimal friction.' },
      { title: 'Follow-through', text: 'Confirmation and expectation setting determine whether the booking completes.' },
    ],
  },
  solutions: {
    eyebrow: 'Our Solutions',
    titleBefore: 'How VectorCodex Supports',
    titleHighlight: 'Travel Growth.',
    intro:
      'We connect search, website experience, and marketing so tourism brands can be found for the right queries and convert interest into clearer enquiries.',
    items: [
      {
        title: 'Search foundations around offers',
        text: 'SEO shaped to destinations, packages, and the questions travellers already ask.',
      },
      {
        title: 'Websites designed for discovery and action',
        text: 'Clear information architecture, mobile-ready journeys, and conversion paths that reduce booking friction.',
      },
      {
        title: 'Marketing aligned to intent',
        text: 'Social and paid activity planned against landing-page fit so spend supports qualified demand.',
      },
      {
        title: 'Measurement you can review',
        text: 'Practical tracking focused on useful enquiry signals — not unverifiable occupancy claims.',
      },
    ],
  },
  services: {
    eyebrow: 'Services for Tourism & Travel',
    titleBefore: 'Digital Services Tailored to',
    titleHighlight: 'Travel Brands.',
    intro:
      'Explore the VectorCodex services most often relevant to tourism operators, hotels, and travel brands. Every link points to an existing service page.',
    items: industryServiceLinks({
      seo: 'Organic visibility for destinations, packages, and experience-led content.',
      localSeo: 'Location and listing clarity for operators serving nearby or inbound travellers.',
      technicalSeo: 'Crawlability, performance, and structural foundations for travel sites.',
      web: 'Fast, inspiring websites built for clarity and conversion-ready booking journeys.',
      wordpress: 'Editable travel sites with practical publishing workflows for marketing teams.',
      shopify: 'Commerce storefronts when travel brands sell packages, merch, or add-ons online.',
      social: 'Social strategy and content systems that support inspiration and enquiry.',
      content: 'Editorial concepts and creative direction tuned to destination storytelling.',
      ppc: 'Paid campaigns planned around message, landing-page fit, and measurement.',
    }),
  },
  why: {
    eyebrow: 'Why VectorCodex',
    titleBefore: 'A Digital Partner Built for',
    titleHighlight: 'Clear Travel Journeys.',
    intro: 'Tourism brands need partners who respect seasonality, clarity, and scope — not inflated booking promises.',
    statement: 'Discovery first. Channels that earn their place.',
    points: [
      {
        title: 'Sector-aware strategy',
        text: 'We shape recommendations around travel journeys, offer clarity, and enquiry quality — not generic playbooks.',
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
    titleHighlight: 'Travel Journeys.',
    intro: 'A five-stage path keeps tourism projects clear on discovery, strategy, delivery, and ongoing improvement.',
    steps: withDiscoverStep(
      sharedProcessSteps,
      'We learn your destinations, packages, audiences, seasonality, and current digital foundations.',
    ),
  },
  caseStudySlugs: [],
  faqs: {
    eyebrow: 'Frequently Asked Questions',
    titleBefore: 'Questions About Digital Growth in',
    titleHighlight: 'Tourism & Travel.',
    intro: 'Straight answers about how VectorCodex supports travel brands online.',
    items: [
      {
        id: 'tour-services',
        question: 'What digital services does VectorCodex offer for tourism brands?',
        answer:
          'We support SEO, local SEO, website development, content systems, social media marketing, and paid campaign planning. Scope is tailored to your offers, destinations, and goals.',
      },
      {
        id: 'tour-seo',
        question: 'Can SEO help a travel brand attract more enquiries?',
        answer:
          'SEO can improve how clearly your offers and destinations appear for relevant searches. Results depend on competition, site quality, and scope — we focus on durable foundations rather than promising fixed ranking dates.',
      },
      {
        id: 'tour-website',
        question: 'Do you build tourism websites?',
        answer:
          'Yes. We design and develop websites focused on clarity, mobile performance, and conversion-ready enquiry or booking paths for travel brands.',
      },
      {
        id: 'tour-ads',
        question: 'Do you manage Google Ads or social campaigns for travel?',
        answer:
          'Yes. We can plan and manage paid campaigns with tighter message-to-landing alignment and clearer measurement, within the advertising policies that apply to your offers.',
      },
      {
        id: 'tour-combine',
        question: 'Can SEO, web development and marketing be combined?',
        answer:
          'Absolutely. Combined programmes often work best because search, site experience, and campaigns reinforce each other when planned together.',
      },
      {
        id: 'tour-timeline',
        question: 'How long does a tourism digital project take?',
        answer:
          'Timelines depend on scope. Website work can move once requirements are clear, while SEO and ongoing marketing usually improve across phased delivery.',
      },
      {
        id: 'tour-claims',
        question: 'How do you handle pricing and availability claims?',
        answer:
          'We work from the offers and information you approve. We avoid inventing rates, occupancy, or testimonials and keep messaging aligned with what your organisation can stand behind.',
      },
      {
        id: 'tour-start',
        question: 'How can we get started?',
        answer:
          'Use Discuss Your Project or Book a Free Consultation on this page and share your goals, destinations, and current website. We will follow up with a scoped next step.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Ready to Grow in Tourism & Travel?',
    titleBefore: 'Build Digital Journeys Travellers Can',
    titleHighlight: 'Trust and Follow.',
    text: 'Whether you need stronger discovery, a clearer website, or marketing aligned to your offers, VectorCodex is ready to help travel brands take the next step.',
    primaryLabel: 'Discuss Your Project',
    secondaryLabel: 'Book a Free Consultation',
  },
};
