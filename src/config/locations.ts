export type LocationMapId = 'uae' | 'london' | 'pakistan';

export type LocationInsight = {
  title: string;
  text: string;
};

export type LocationLandscape = {
  intro: string;
  insights: LocationInsight[];
  closing: string;
  visualLabel: string;
};

export type LocationChallengeIcon =
  | 'search'
  | 'map-pin'
  | 'gauge'
  | 'mouse-pointer'
  | 'megaphone'
  | 'sparkles'
  | 'globe'
  | 'smartphone';

export type LocationChallenge = {
  icon: LocationChallengeIcon;
  title: string;
  problem: string;
  opportunity: string;
  /** Larger bento tile for priority challenges. */
  featured?: boolean;
};

export type LocationChallenges = {
  intro: string;
  items: LocationChallenge[];
};

export type LocationIndustryIcon =
  | 'healthcare'
  | 'accounting'
  | 'tourism'
  | 'real-estate'
  | 'dental'
  | 'car-rental'
  | 'tobacco'
  | 'medical-billing'
  | 'minibus';

export type LocationIndustry = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LocationIndustryIcon;
  /** Larger tile in the industries bento. */
  featured?: boolean;
};

export type LocationIndustries = {
  intro: string;
  items: LocationIndustry[];
};

export type LocationServiceItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type LocationServices = {
  intro: string;
  items: LocationServiceItem[];
};

export type LocationWhyPoint = {
  title: string;
  text: string;
};

export type LocationWhyChoose = {
  intro: string;
  statement: string;
  points: LocationWhyPoint[];
};

export type LocationFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type LocationFaqs = {
  intro: string;
  items: LocationFaqItem[];
};

export type LocationOffice = {
  slug: string;
  /** Short name used in cards and navigation (e.g. London, UAE). */
  name: string;
  /** Country / market label (e.g. United Kingdom). */
  market: string;
  /**
   * Phrase used in hero eyebrow/headline copy.
   * May include articles for natural English (e.g. "the UAE").
   */
  locationLabel: string;
  /** Small label on the hero visual (city and/or country). */
  visualLabel: string;
  /** Which geographic outline to render in the hero visual. */
  mapId: LocationMapId;
  address: string;
  phone: string;
  email: string;
  path: string;
  /** Unique hero supporting paragraph for this location page. */
  heroDescription: string;
  /** Short intro for lower sections and meta description. */
  summary: string;
  /** Market landscape section — unique copy per location. */
  landscape: LocationLandscape;
  /** Digital challenges section — unique barriers per location. */
  challenges: LocationChallenges;
  /** Local services directory — keyword-focused internal links. */
  services: LocationServices;
  /** Industries section — location-relevant sectors with valid routes. */
  industries: LocationIndustries;
  /** Why choose VectorCodex — location-aware differentiators. */
  whyChoose: LocationWhyChoose;
  /** FAQ accordion — location-aware Q&A. */
  faqs: LocationFaqs;
  focus: string[];
  placeholder: boolean;
};

export const locations: LocationOffice[] = [
  {
    slug: 'uae',
    name: 'UAE',
    market: 'United Arab Emirates',
    locationLabel: 'the UAE',
    visualLabel: 'Dubai, UAE',
    mapId: 'uae',
    address: 'Business Bay, Dubai, United Arab Emirates',
    phone: '+971 4 000 0000',
    email: 'uae@vectorcodex.com',
    path: '/locations/uae/',
    heroDescription:
      'From building high-performing websites to improving search visibility and generating qualified leads, VectorCodex helps businesses in the UAE strengthen their digital presence through tailored SEO, web development, and digital marketing strategies suited to Gulf-market audiences and competitive local search.',
    summary:
      'Digital growth support for organisations across the UAE — SEO, websites, and marketing scoped to regional goals and channels.',
    landscape: {
      visualLabel: 'UAE market signals',
      intro:
        'The UAE digital market moves quickly. Buyers often research across mobile-first journeys, compare providers in both English and Arabic contexts, and expect polished websites that feel credible for finance, property, hospitality, healthcare, and professional services. Visibility is competitive around commercial hubs such as Dubai and Abu Dhabi, where search intent can shift between local discovery and regional decision-making.',
      insights: [
        {
          title: 'Multi-language discovery',
          text: 'Search and content often need to serve English-first commercial journeys while remaining clear for Arabic-speaking audiences and mixed-language browsing habits.',
        },
        {
          title: 'Trust-led buying behaviour',
          text: 'Prospects tend to scrutinise proof, clarity, and brand presentation before enquiry — weak site structure or vague service pages can stall momentum.',
        },
        {
          title: 'Sector-driven demand',
          text: 'Real estate, tourism, healthcare, and B2B services create distinct content and keyword patterns that generic national messaging rarely covers well.',
        },
        {
          title: 'Performance expectations',
          text: 'Fast, conversion-ready websites and measurable paid/organic pipelines matter when competitors already invest in polished digital experiences.',
        },
      ],
      closing:
        'VectorCodex adapts SEO, web development, and digital marketing around UAE buyer journeys — prioritising clear positioning, technical quality, and channel choices that fit each organisation’s market, language needs, and growth goals.',
    },
    challenges: {
      intro:
        'In the UAE, many organisations invest in digital activity without a clear path from discovery to enquiry. Competitive search, bilingual buyer journeys, and high presentation standards mean weak foundations show up quickly — in missed visibility, slow sites, and campaigns that attract curiosity instead of qualified demand.',
      items: [
        {
          icon: 'search',
          title: 'Hard to stand out in competitive search',
          problem:
            'Service and location queries around Dubai and other hubs are contested, so generic pages struggle to earn consistent visibility.',
          opportunity: 'Sharper intent-focused pages and technical SEO can reclaim discovery.',
          featured: true,
        },
        {
          icon: 'globe',
          title: 'Mixed-language journeys feel fragmented',
          problem:
            'English and Arabic audiences often share the same decision path, but sites and content are rarely structured for both cleanly.',
          opportunity: 'Clearer language pathways improve trust and navigation.',
        },
        {
          icon: 'gauge',
          title: 'Websites look polished but convert poorly',
          problem:
            'Visually heavy builds can still hide weak offers, unclear next steps, or friction on mobile.',
          opportunity: 'Conversion-led structure turns attention into enquiry.',
          featured: true,
        },
        {
          icon: 'map-pin',
          title: 'Local discovery is underused',
          problem:
            'Google Business Profile and local signals are often incomplete while competitors capture nearby demand.',
          opportunity: 'Stronger local presence supports map and “near me” discovery.',
        },
        {
          icon: 'megaphone',
          title: 'Paid media spends without clear landing paths',
          problem:
            'Ads can drive traffic into broad homepages that do not match the promise of the campaign.',
          opportunity: 'Tighter creative-to-landing alignment reduces wasted spend.',
        },
        {
          icon: 'sparkles',
          title: 'Thin presence in AI-assisted discovery',
          problem:
            'Brands with shallow, unclear content are harder to surface when buyers ask AI tools for recommendations.',
          opportunity: 'Useful, structured content strengthens future discoverability.',
        },
      ],
    },
    services: {
      intro:
        'Looking for SEO, web development, or digital marketing support in the UAE? VectorCodex helps organisations improve search visibility, rebuild underperforming websites, and run campaigns that connect discovery to qualified enquiry across Dubai and the wider Emirates.',
      items: [
        {
          id: 'seo',
          title: 'SEO Services in the UAE',
          description:
            'Strengthen organic visibility for competitive commercial and location queries with technical foundations, clear service pages, and content shaped around UAE buyer journeys.',
          href: '/services/seo/',
          linkLabel: 'Explore SEO Services',
        },
        {
          id: 'local-seo',
          title: 'Local SEO Services in the UAE',
          description:
            'Improve map and nearby discovery for multi-location or city-focused brands with consistent local signals, profile optimisation, and location-ready landing pages.',
          href: '/services/seo/local-seo/',
          linkLabel: 'Explore Local SEO',
        },
        {
          id: 'ecommerce-seo',
          title: 'E-commerce SEO in the UAE',
          description:
            'Help online stores rank for product and category demand with cleaner site architecture, indexation control, and conversion-minded product content.',
          href: '/services/seo/ecommerce-seo/',
          linkLabel: 'Explore E-commerce SEO',
        },
        {
          id: 'ai-seo',
          title: 'AI SEO & GEO Services in the UAE',
          description:
            'Prepare brand and service content for AI-assisted discovery with clearer topical coverage, structured answers, and search-ready entity signals.',
          href: '/services/seo/ai-seo/',
          linkLabel: 'Explore AI SEO',
        },
        {
          id: 'web',
          title: 'Web Development in the UAE',
          description:
            'Build fast, credible websites for Gulf-market audiences — from redesigns to custom builds focused on performance, clarity, and lead capture.',
          href: '/services/web-development/',
          linkLabel: 'Explore Web Development',
        },
        {
          id: 'technical-seo',
          title: 'Technical SEO in the UAE',
          description:
            'Improve crawlability, indexation, and site performance so UAE commercial pages can compete without technical blockers.',
          href: '/services/seo/technical-seo/',
          linkLabel: 'Explore Technical SEO',
        },
        {
          id: 'wordpress',
          title: 'WordPress Development in the UAE',
          description:
            'Deliver flexible WordPress sites that marketing teams can manage, with clean templates, stronger UX, and room to scale content and campaigns.',
          href: '/services/web-development/wordpress-development/',
          linkLabel: 'Explore WordPress Development',
        },
        {
          id: 'shopify',
          title: 'Shopify Development in the UAE',
          description:
            'Build and refine Shopify storefronts with clearer product journeys, theme discipline, and conversion-ready merchandising for Gulf shoppers.',
          href: '/services/web-development/shopify-development/',
          linkLabel: 'Explore Shopify Development',
        },
        {
          id: 'social',
          title: 'Social Media Marketing in the UAE',
          description:
            'Connect social discovery to trustworthy web journeys with content, creative, and campaign structure that supports enquiry — not vanity engagement alone.',
          href: '/services/social-media-marketing/',
          linkLabel: 'Explore Social Media Marketing',
        },
        {
          id: 'content-creation',
          title: 'Content Creation in the UAE',
          description:
            'Editorial concepts, copy, and creative direction tuned to feed behaviour and brand rules for UAE audiences.',
          href: '/services/social-media-marketing/content-creation/',
          linkLabel: 'Explore Content Creation',
        },
        {
          id: 'ppc',
          title: 'PPC Management in the UAE',
          description:
            'Run Google Ads with tighter keyword-to-landing alignment so paid spend supports qualified UAE demand, not just traffic.',
          href: '/services/ppc-management/',
          linkLabel: 'Explore PPC Management',
        },
      ],
    },
    industries: {
      intro:
        'UAE organisations often compete across property, hospitality, healthcare, and professional services — sectors where clear digital positioning, trustworthy websites, and measurable demand generation matter as much as brand presentation.',
      items: [
        {
          id: 'real-estate',
          title: 'Real Estate',
          description: 'Property listings, developer brands, and agency sites that need sharp local and project-led visibility.',
          href: '/industries/real-estate/',
          icon: 'real-estate',
          featured: true,
        },
        {
          id: 'tourism',
          title: 'Tourism & Travel',
          description: 'Hotels, tours, and travel operators competing for high-intent leisure and business travellers.',
          href: '/industries/tourism/',
          icon: 'tourism',
          featured: true,
        },
        {
          id: 'healthcare',
          title: 'Healthcare',
          description: 'Clinics and medical brands that need credible content, clear service paths, and patient-ready websites.',
          href: '/industries/healthcare/',
          icon: 'healthcare',
        },
        {
          id: 'accounting',
          title: 'Accounting & Finance',
          description: 'Advisory and finance firms where trust, clarity, and lead quality outweigh vanity traffic.',
          href: '/industries/accounting/',
          icon: 'accounting',
        },
        {
          id: 'dental',
          title: 'Dental Practices',
          description: 'Dental clinics seeking local discovery, treatment clarity, and conversion-ready enquiry flows.',
          href: '/industries/dental/',
          icon: 'dental',
        },
        {
          id: 'car-rental',
          title: 'Car Rental',
          description: 'Fleet and rental brands that depend on fast mobile journeys and strong local search coverage.',
          href: '/industries/car-rental/',
          icon: 'car-rental',
        },
        {
          id: 'tobacco',
          title: 'Tobacco & Vape',
          description: 'Retail and brand sites that need careful positioning, compliant messaging, and clear product journeys.',
          href: '/industries/tobacco/',
          icon: 'tobacco',
        },
        {
          id: 'medical-billing',
          title: 'Medical Billing',
          description: 'Billing and admin providers supporting healthcare operations with B2B-focused digital presence.',
          href: '/industries/medical-billing/',
          icon: 'medical-billing',
        },
      ],
    },
    whyChoose: {
      intro:
        'Businesses in the UAE need digital partners who can balance presentation standards with measurable growth. VectorCodex focuses on clear strategy, practical delivery, and honest reporting — without inflated promises.',
      statement: 'Clarity over noise. Strategy before spend.',
      points: [
        {
          title: 'Strategy Built Around Your Goals',
          text: 'We shape SEO, websites, and campaigns around the outcomes that matter for your UAE market — not generic packages.',
        },
        {
          title: 'SEO + AI Search Expertise',
          text: 'Classic search foundations and clearer content structures help your brand stay discoverable as search behaviour evolves.',
        },
        {
          title: 'Development and Marketing Under One Roof',
          text: 'Site performance, messaging, and demand channels stay aligned so campaigns do not outrun the experience behind them.',
        },
        {
          title: 'Data-Driven Decisions',
          text: 'Priorities come from intent, journey friction, and measurable signals — so effort goes where it can improve enquiry quality.',
        },
        {
          title: 'Transparent Communication and Reporting',
          text: 'You get plain-language updates on what changed, what we learned, and what comes next.',
        },
      ],
    },
    faqs: {
      intro: 'Straight answers about how VectorCodex supports digital growth for organisations in the UAE.',
      items: [
        {
          id: 'services-uae',
          question: 'What digital marketing services does VectorCodex offer in the UAE?',
          answer:
            'We support SEO, web development, WordPress builds, social media marketing, and paid media planning for organisations targeting UAE audiences. Engagements are scoped around your goals, channels, and current digital foundations.',
        },
        {
          id: 'seo-uae',
          question: 'Do you provide SEO services in the UAE?',
          answer:
            'Yes. Our SEO work covers technical foundations, on-page structure, content clarity, and local discovery where relevant — shaped around competitive commercial and location-led search journeys in the UAE.',
        },
        {
          id: 'local-customers-uae',
          question: 'How can SEO help my business attract local customers?',
          answer:
            'SEO improves how clearly your services, locations, and offers appear when people search. Stronger pages, local signals, and useful content help nearby or city-focused audiences find and evaluate your business more easily.',
        },
        {
          id: 'seo-timeline-uae',
          question: 'How long does SEO take to deliver results?',
          answer:
            'Timelines depend on your site, competition, and scope. We usually prioritise foundations first and track progress against available data rather than promising fixed ranking dates.',
        },
        {
          id: 'websites-uae',
          question: 'Do you develop WordPress and e-commerce websites?',
          answer:
            'Yes. We build and redesign WordPress, custom, and e-commerce websites focused on performance, clarity, and conversion — including sites that need to support mobile-first and mixed-language journeys.',
        },
        {
          id: 'google-ads-uae',
          question: 'Do you manage Google Ads campaigns?',
          answer:
            'Yes. We can plan and manage Google Ads with clearer keyword-to-landing alignment so paid spend supports qualified demand rather than disconnected traffic.',
        },
        {
          id: 'combined-uae',
          question: 'Can I combine SEO, web development and digital marketing?',
          answer:
            'Absolutely. Many UAE projects benefit from combining site improvements with SEO and campaign work so discovery, experience, and conversion stay aligned under one plan.',
        },
        {
          id: 'quote-uae',
          question: 'How can I request a project quote?',
          answer:
            'Use Start Your Project or Book a Free Consultation on this page, or contact us directly. Share your goals, current website, and service interest so we can propose a scoped next step.',
        },
      ],
    },
    focus: ['SEO & local visibility', 'Website builds and redesigns', 'Paid media and social growth'],
    placeholder: true,
  },
  {
    slug: 'london',
    name: 'London',
    market: 'United Kingdom',
    locationLabel: 'London',
    visualLabel: 'London, United Kingdom',
    mapId: 'london',
    address: 'Canary Wharf, London, United Kingdom',
    phone: '+44 20 0000 0000',
    email: 'london@vectorcodex.com',
    path: '/locations/london/',
    heroDescription:
      'From building high-performing websites to improving search visibility and generating qualified leads, VectorCodex helps businesses in London strengthen their digital presence through tailored SEO, web development, and digital marketing strategies shaped around UK buyer behaviour and clear project briefs.',
    summary:
      'SEO, web development, and marketing engagements for London and UK organisations built around a clear brief.',
    landscape: {
      visualLabel: 'London market signals',
      intro:
        'London’s digital environment is dense and competitive. Buyers compare options quickly, expect transparent service pages, and move between organic search, paid media, and referrals before contacting a supplier. Professional services, technology, property, healthcare, and consumer brands all compete for attention in a market where credibility, speed, and clear positioning matter as much as creative execution.',
      insights: [
        {
          title: 'High-intent search competition',
          text: 'Category and service queries are contested. Pages need sharp intent matching, useful content depth, and technical foundations that support sustained visibility.',
        },
        {
          title: 'Evidence before enquiry',
          text: 'UK buyers often look for process clarity, relevant case framing, and practical next steps before sharing contact details or booking a call.',
        },
        {
          title: 'Channel overlap',
          text: 'Organic, paid, and social often reinforce the same decision journey — messaging and landing experiences need to stay consistent across those touchpoints.',
        },
        {
          title: 'Conversion-sensitive websites',
          text: 'Slow, confusing, or template-heavy sites struggle when audiences are used to polished competitor experiences and short attention windows.',
        },
      ],
      closing:
        'VectorCodex shapes London-focused engagements around clear briefs: SEO that matches real search intent, websites built for conversion, and marketing programmes that stay accountable to qualified demand — without inflated claims or one-size-fits-all packages.',
    },
    challenges: {
      intro:
        'London businesses often compete in crowded categories where buyers research quickly and expect clarity. The barrier is rarely a lack of channels — it is weak search positioning, outdated site experiences, and campaigns that do not connect cleanly to proof-led conversion paths.',
      items: [
        {
          icon: 'search',
          title: 'Search visibility loses ground to sharper competitors',
          problem:
            'High-intent commercial queries are contested, and thin service pages rarely hold position against better-structured rivals.',
          opportunity: 'Intent-matched SEO and content depth rebuild relevance.',
          featured: true,
        },
        {
          icon: 'gauge',
          title: 'Outdated or slow websites undermine trust',
          problem:
            'Buyers abandon experiences that feel dated, heavy, or unclear before they ever contact the team.',
          opportunity: 'Faster, clearer sites keep serious prospects in the journey.',
          featured: true,
        },
        {
          icon: 'mouse-pointer',
          title: 'Traffic arrives without converting',
          problem:
            'Visits from search or ads stall when offers, proof, and next steps are hard to find.',
          opportunity: 'UX and message clarity turn interest into qualified leads.',
        },
        {
          icon: 'megaphone',
          title: 'Paid budgets leak into poorly matched landing pages',
          problem:
            'Campaigns can attract clicks while sending people to pages that do not answer the ad’s promise.',
          opportunity: 'Aligned landing experiences protect media spend.',
        },
        {
          icon: 'sparkles',
          title: 'Content is not ready for AI search surfaces',
          problem:
            'Scattered or shallow content makes it harder for AI-assisted tools to summarise what the business actually offers.',
          opportunity: 'Clear topical coverage improves discoverability beyond classic SERPs.',
        },
        {
          icon: 'map-pin',
          title: 'Local and multi-location signals feel inconsistent',
          problem:
            'Service-area or multi-office businesses often publish incomplete local information across profiles and site pages.',
          opportunity: 'Consistent local signals support nearby discovery.',
        },
      ],
    },
    services: {
      intro:
        'Need SEO, website development, or digital marketing in London? VectorCodex supports UK organisations with search programmes, conversion-focused builds, and paid or social campaigns shaped around clear briefs and competitive local demand.',
      items: [
        {
          id: 'seo',
          title: 'SEO Services in London',
          description:
            'Compete for high-intent commercial search with technical SEO, sharper service architecture, and content that matches how London buyers compare providers.',
          href: '/services/seo/',
          linkLabel: 'Explore SEO Services',
        },
        {
          id: 'local-seo',
          title: 'Local SEO Services in London',
          description:
            'Strengthen nearby discovery for service-area and multi-location brands with consistent profiles, local pages, and map-ready signals.',
          href: '/services/seo/local-seo/',
          linkLabel: 'Explore Local SEO',
        },
        {
          id: 'ecommerce-seo',
          title: 'E-commerce SEO in London',
          description:
            'Improve category and product visibility for UK online stores with cleaner taxonomy, indexation hygiene, and conversion-minded merchandising pages.',
          href: '/services/seo/ecommerce-seo/',
          linkLabel: 'Explore E-commerce SEO',
        },
        {
          id: 'ai-seo',
          title: 'AI SEO & GEO Services in London',
          description:
            'Make service expertise easier to surface in AI-assisted recommendations through structured, useful content and stronger topical clarity.',
          href: '/services/seo/ai-seo/',
          linkLabel: 'Explore AI SEO',
        },
        {
          id: 'web',
          title: 'Web Development in London',
          description:
            'Design and build websites that keep pace with UK buyer expectations — fast, credible, and structured for enquiry rather than decoration alone.',
          href: '/services/web-development/',
          linkLabel: 'Explore Web Development',
        },
        {
          id: 'technical-seo',
          title: 'Technical SEO in London',
          description:
            'Improve crawlability, indexation, and site performance so London commercial pages can compete without technical blockers.',
          href: '/services/seo/technical-seo/',
          linkLabel: 'Explore Technical SEO',
        },
        {
          id: 'wordpress',
          title: 'WordPress Development in London',
          description:
            'Launch or rebuild WordPress sites with flexible editing, stronger UX, and a foundation ready for SEO and campaign landing pages.',
          href: '/services/web-development/wordpress-development/',
          linkLabel: 'Explore WordPress Development',
        },
        {
          id: 'shopify',
          title: 'Shopify Development in London',
          description:
            'Build and refine Shopify storefronts with clearer product journeys, theme discipline, and conversion-ready merchandising for UK shoppers.',
          href: '/services/web-development/shopify-development/',
          linkLabel: 'Explore Shopify Development',
        },
        {
          id: 'social',
          title: 'Social Media Marketing in London',
          description:
            'Use social content and advertising to support brand discovery while routing interest into clear, proof-led website journeys.',
          href: '/services/social-media-marketing/',
          linkLabel: 'Explore Social Media Marketing',
        },
        {
          id: 'content-creation',
          title: 'Content Creation in London',
          description:
            'Editorial concepts, copy, and creative direction tuned to feed behaviour and brand rules for UK audiences.',
          href: '/services/social-media-marketing/content-creation/',
          linkLabel: 'Explore Content Creation',
        },
        {
          id: 'ppc',
          title: 'PPC Management in London',
          description:
            'Manage Google Ads with tighter intent matching and landing-page alignment so London campaigns protect budget and pursue qualified leads.',
          href: '/services/ppc-management/',
          linkLabel: 'Explore PPC Management',
        },
      ],
    },
    industries: {
      intro:
        'London’s market spans professional services, healthcare, property, and specialist consumer brands. Digital programmes need to match how buyers research, compare, and request proposals in a competitive UK environment.',
      items: [
        {
          id: 'accounting',
          title: 'Accounting & Finance',
          description: 'Firms that need authority-led content, clear service architecture, and qualified enquiry paths.',
          href: '/industries/accounting/',
          icon: 'accounting',
          featured: true,
        },
        {
          id: 'healthcare',
          title: 'Healthcare',
          description: 'Private clinics and care brands competing on trust, clarity, and searchable treatment journeys.',
          href: '/industries/healthcare/',
          icon: 'healthcare',
          featured: true,
        },
        {
          id: 'real-estate',
          title: 'Real Estate',
          description: 'Agencies and property brands that rely on location visibility and conversion-ready listing experiences.',
          href: '/industries/real-estate/',
          icon: 'real-estate',
        },
        {
          id: 'dental',
          title: 'Dental Practices',
          description: 'Dental practices looking to strengthen local search, patient education, and appointment enquiries.',
          href: '/industries/dental/',
          icon: 'dental',
        },
        {
          id: 'tourism',
          title: 'Tourism & Travel',
          description: 'Travel and hospitality operators competing for seasonal demand and high-intent booking journeys.',
          href: '/industries/tourism/',
          icon: 'tourism',
        },
        {
          id: 'medical-billing',
          title: 'Medical Billing',
          description: 'Specialist B2B providers that need precise positioning and credible digital proof points.',
          href: '/industries/medical-billing/',
          icon: 'medical-billing',
        },
        {
          id: 'car-rental',
          title: 'Car Rental',
          description: 'Rental operators focused on local discovery, mobile booking flow, and campaign landing clarity.',
          href: '/industries/car-rental/',
          icon: 'car-rental',
        },
        {
          id: 'minibus',
          title: 'Minibus Rentals',
          description: 'Transport operators that benefit from clear fleet offers, local SEO, and enquiry-led websites.',
          href: '/industries/minibus/',
          icon: 'minibus',
        },
      ],
    },
    whyChoose: {
      intro:
        'In London’s competitive market, businesses need a partner who can connect search, website quality, and campaign delivery without overclaiming. VectorCodex works from clear briefs, practical priorities, and transparent reporting.',
      statement: 'Proof over promises. Progress you can follow.',
      points: [
        {
          title: 'Strategy Built Around Your Goals',
          text: 'Every engagement starts with the commercial outcome you need — visibility, conversion, or qualified demand — then builds the path to get there.',
        },
        {
          title: 'SEO + AI Search Expertise',
          text: 'We strengthen traditional SEO while making your expertise easier to surface in AI-assisted discovery journeys.',
        },
        {
          title: 'Development and Marketing Under One Roof',
          text: 'Web builds and marketing programmes stay connected, so traffic lands on pages ready to convert.',
        },
        {
          title: 'Data-Driven Decisions',
          text: 'Recommendations follow performance signals and journey evidence, not guesswork or vanity metrics.',
        },
        {
          title: 'Transparent Communication and Reporting',
          text: 'Updates stay clear and actionable, so stakeholders understand progress without decoding jargon.',
        },
      ],
    },
    faqs: {
      intro: 'Clear answers about VectorCodex digital services for organisations working in and around London.',
      items: [
        {
          id: 'services-london',
          question: 'What digital marketing services does VectorCodex offer in London?',
          answer:
            'We provide SEO, website development, WordPress builds, social media marketing, and paid campaign support for London and UK organisations. Each engagement is scoped to your brief, audience, and current digital setup.',
        },
        {
          id: 'seo-london',
          question: 'Do you provide SEO services in London?',
          answer:
            'Yes. SEO programmes typically include technical improvements, clearer service architecture, content refinement, and measurement against the data available for your site and market.',
        },
        {
          id: 'local-customers-london',
          question: 'How can SEO help my business attract local customers?',
          answer:
            'SEO helps your business appear for the searches local buyers already use. Stronger pages, local information, and useful content make it easier for nearby prospects to find, trust, and contact you.',
        },
        {
          id: 'seo-timeline-london',
          question: 'How long does SEO take to deliver results?',
          answer:
            'It depends on competition, site health, and scope. We focus on foundational work first and report progress honestly rather than guaranteeing specific ranking timelines.',
        },
        {
          id: 'websites-london',
          question: 'Do you develop WordPress and e-commerce websites?',
          answer:
            'Yes. We design and develop WordPress, custom, and e-commerce websites with an emphasis on speed, clarity, and conversion-ready journeys for UK buyers.',
        },
        {
          id: 'google-ads-london',
          question: 'Do you manage Google Ads campaigns?',
          answer:
            'Yes. Google Ads management focuses on intent matching, landing-page fit, and clearer reporting so media spend supports qualified demand.',
        },
        {
          id: 'combined-london',
          question: 'Can I combine SEO, web development and digital marketing?',
          answer:
            'Yes. Combined programmes often work best in London’s competitive market, because search, site experience, and campaigns reinforce each other when planned together.',
        },
        {
          id: 'quote-london',
          question: 'How can I request a project quote?',
          answer:
            'Click Start Your Project or Book a Free Consultation on this page and share your goals, website, and preferred services. We will follow up with a scoped next step.',
        },
      ],
    },
    focus: ['Search and content programmes', 'Custom and WordPress development', 'PPC and campaign management'],
    placeholder: true,
  },
  {
    slug: 'pakistan',
    name: 'Pakistan',
    market: 'Pakistan',
    locationLabel: 'Pakistan',
    visualLabel: 'Rawalpindi, Pakistan',
    mapId: 'pakistan',
    address: 'Rawalpindi, Punjab, Pakistan',
    phone: '+92 51 0000000',
    email: 'pakistan@vectorcodex.com',
    path: '/locations/pakistan/',
    heroDescription:
      'From building high-performing websites to improving search visibility and generating qualified leads, VectorCodex helps businesses in Pakistan strengthen their digital presence through tailored SEO, web development, and digital marketing strategies that support both regional growth and international reach.',
    summary:
      'SEO, development, and digital marketing delivery for organisations connected to the Pakistan market.',
    landscape: {
      visualLabel: 'Pakistan market signals',
      intro:
        'Pakistan’s digital landscape spans local service businesses, growing e-commerce brands, education and healthcare providers, and organisations selling to international clients. Audiences discover companies through search, social platforms, and referrals, then judge credibility through website quality, clear offers, and responsive follow-up. Many teams need digital systems that work for domestic visibility while remaining ready for cross-border enquiry.',
      insights: [
        {
          title: 'Mobile-first journeys',
          text: 'A large share of research and contact happens on mobile. Sites and landing pages need to load cleanly, read clearly, and convert without friction on smaller screens.',
        },
        {
          title: 'Local and export audiences',
          text: 'Some organisations sell primarily within Pakistan; others pursue overseas clients. Messaging, SEO targets, and site structure should reflect that dual reality.',
        },
        {
          title: 'Social-assisted discovery',
          text: 'Social platforms often introduce brands before a website visit. Content and paid social need to hand off cleanly into trustworthy web experiences.',
        },
        {
          title: 'Foundation before scale',
          text: 'Technical SEO, stable hosting, and clear service architecture frequently unlock more growth than adding channels on top of a weak digital base.',
        },
      ],
      closing:
        'VectorCodex adapts strategy for Pakistan-connected businesses by aligning SEO, development, and marketing to the audience they serve — strengthening foundations first, then scaling the channels that support measurable enquiry and growth.',
    },
    challenges: {
      intro:
        'For many Pakistan-connected businesses, digital growth stalls when foundations are incomplete. Mobile journeys, social discovery, and mixed local/export audiences create pressure — especially when websites are slow, search presence is thin, or campaigns start before the conversion path is ready.',
      items: [
        {
          icon: 'smartphone',
          title: 'Mobile experiences create drop-off',
          problem:
            'Prospects often research on phones, yet many sites remain hard to read, slow to load, or awkward to contact from mobile.',
          opportunity: 'Mobile-first UX recovers enquiries already in motion.',
          featured: true,
        },
        {
          icon: 'search',
          title: 'Organic visibility stays limited',
          problem:
            'Without clear service pages and technical basics, competitors capture the search demand that should reach the business.',
          opportunity: 'Focused SEO builds durable discovery.',
          featured: true,
        },
        {
          icon: 'gauge',
          title: 'Sites feel unfinished for serious buyers',
          problem:
            'Outdated design, weak hosting, or unclear offers reduce confidence for both local and international audiences.',
          opportunity: 'Stronger web foundations raise credibility quickly.',
        },
        {
          icon: 'megaphone',
          title: 'Social and paid spend outruns the website',
          problem:
            'Traffic from social or ads often lands on pages that do not explain the offer or capture leads cleanly.',
          opportunity: 'Better landing paths make channel spend work harder.',
        },
        {
          icon: 'globe',
          title: 'Local and export messaging collide',
          problem:
            'One generic website rarely serves domestic buyers and overseas prospects with equal clarity.',
          opportunity: 'Audience-specific pathways keep both journeys coherent.',
        },
        {
          icon: 'sparkles',
          title: 'Thin content limits modern discovery',
          problem:
            'Sparse answers about services, process, and expertise make it harder to appear in AI-assisted recommendations.',
          opportunity: 'Useful content strengthens long-term findability.',
        },
      ],
    },
    services: {
      intro:
        'Searching for SEO, web development, or digital marketing in Pakistan? VectorCodex helps businesses strengthen mobile-ready websites, improve organic discovery, and connect social or paid activity to clearer enquiry paths for local and export audiences.',
      items: [
        {
          id: 'seo',
          title: 'SEO Services in Pakistan',
          description:
            'Build durable organic visibility with technical foundations, clearer service pages, and content that supports both domestic and international search journeys.',
          href: '/services/seo/',
          linkLabel: 'Explore SEO Services',
        },
        {
          id: 'local-seo',
          title: 'Local SEO Services in Pakistan',
          description:
            'Improve local discovery for city and service-area brands with stronger profiles, location pages, and consistent business information.',
          href: '/services/seo/local-seo/',
          linkLabel: 'Explore Local SEO',
        },
        {
          id: 'ecommerce-seo',
          title: 'E-commerce SEO in Pakistan',
          description:
            'Help online stores grow category and product demand with cleaner site structure, better indexation, and pages built for mobile shoppers.',
          href: '/services/seo/ecommerce-seo/',
          linkLabel: 'Explore E-commerce SEO',
        },
        {
          id: 'ai-seo',
          title: 'AI SEO & GEO Services in Pakistan',
          description:
            'Strengthen discoverability beyond classic search by improving how services, process, and expertise are explained for AI-assisted recommendations.',
          href: '/services/seo/ai-seo/',
          linkLabel: 'Explore AI SEO',
        },
        {
          id: 'web',
          title: 'Web Development in Pakistan',
          description:
            'Create fast, credible websites that work for mobile-first audiences and support local sales as well as overseas enquiry.',
          href: '/services/web-development/',
          linkLabel: 'Explore Web Development',
        },
        {
          id: 'technical-seo',
          title: 'Technical SEO in Pakistan',
          description:
            'Improve crawlability, indexation, and site performance so commercial pages can compete without technical blockers.',
          href: '/services/seo/technical-seo/',
          linkLabel: 'Explore Technical SEO',
        },
        {
          id: 'wordpress',
          title: 'WordPress Development in Pakistan',
          description:
            'Deliver WordPress builds that teams can update confidently, with stronger UX, cleaner templates, and room to grow content programmes.',
          href: '/services/web-development/wordpress-development/',
          linkLabel: 'Explore WordPress Development',
        },
        {
          id: 'shopify',
          title: 'Shopify Development in Pakistan',
          description:
            'Build and refine Shopify storefronts with clearer product journeys, theme discipline, and conversion-ready merchandising for mobile shoppers.',
          href: '/services/web-development/shopify-development/',
          linkLabel: 'Explore Shopify Development',
        },
        {
          id: 'social',
          title: 'Social Media Marketing in Pakistan',
          description:
            'Turn social discovery into website visits that convert by aligning content, creative, and landing experiences with real buyer intent.',
          href: '/services/social-media-marketing/',
          linkLabel: 'Explore Social Media Marketing',
        },
        {
          id: 'content-creation',
          title: 'Content Creation in Pakistan',
          description:
            'Editorial concepts, copy, and creative direction tuned to feed behaviour and brand rules for local and overseas audiences.',
          href: '/services/social-media-marketing/content-creation/',
          linkLabel: 'Explore Content Creation',
        },
        {
          id: 'ppc',
          title: 'PPC Management in Pakistan',
          description:
            'Run Google Ads with clearer targeting and landing-page fit so media spend supports qualified demand instead of disconnected traffic.',
          href: '/services/ppc-management/',
          linkLabel: 'Explore PPC Management',
        },
      ],
    },
    industries: {
      intro:
        'Across Pakistan, digital demand spans healthcare, professional services, travel, and retail categories — often with both local customers and international prospects in the same growth plan. Sector-aware websites and marketing keep those journeys clear.',
      items: [
        {
          id: 'healthcare',
          title: 'Healthcare',
          description: 'Clinics and health brands that need trustworthy sites, clear services, and stronger search discovery.',
          href: '/industries/healthcare/',
          icon: 'healthcare',
          featured: true,
        },
        {
          id: 'dental',
          title: 'Dental Practices',
          description: 'Dental clinics competing for local patients through clearer treatment pages and enquiry flows.',
          href: '/industries/dental/',
          icon: 'dental',
          featured: true,
        },
        {
          id: 'accounting',
          title: 'Accounting & Finance',
          description: 'Finance and advisory firms building credibility for domestic and cross-border clients.',
          href: '/industries/accounting/',
          icon: 'accounting',
        },
        {
          id: 'tourism',
          title: 'Tourism & Travel',
          description: 'Travel brands that need stronger organic visibility and conversion-ready booking journeys.',
          href: '/industries/tourism/',
          icon: 'tourism',
        },
        {
          id: 'real-estate',
          title: 'Real Estate',
          description: 'Property businesses focused on project visibility, local search, and lead capture.',
          href: '/industries/real-estate/',
          icon: 'real-estate',
        },
        {
          id: 'car-rental',
          title: 'Car Rental',
          description: 'Rental operators that depend on mobile performance, local discovery, and clear fleet offers.',
          href: '/industries/car-rental/',
          icon: 'car-rental',
        },
        {
          id: 'medical-billing',
          title: 'Medical Billing',
          description: 'Billing providers supporting healthcare teams with focused B2B digital positioning.',
          href: '/industries/medical-billing/',
          icon: 'medical-billing',
        },
        {
          id: 'tobacco',
          title: 'Tobacco & Vape',
          description: 'Retail brands that need careful messaging, structured catalogues, and reliable web foundations.',
          href: '/industries/tobacco/',
          icon: 'tobacco',
        },
      ],
    },
    whyChoose: {
      intro:
        'Organisations connected to Pakistan often need digital foundations that work for mobile audiences, local demand, and overseas enquiry. VectorCodex focuses on practical strategy, unified delivery, and transparent progress — without unverified claims.',
      statement: 'Foundations first. Channels that earn their keep.',
      points: [
        {
          title: 'Strategy Built Around Your Goals',
          text: 'We prioritise the growth path that fits your audience mix — domestic, export, or both — before scaling activity.',
        },
        {
          title: 'SEO + AI Search Expertise',
          text: 'Search programmes cover technical basics and clearer content structures that support modern discovery habits.',
        },
        {
          title: 'Development and Marketing Under One Roof',
          text: 'Websites, SEO, and campaigns are planned together so spend is not wasted on weak landing experiences.',
        },
        {
          title: 'Data-Driven Decisions',
          text: 'We use journey and performance signals to decide what to fix, what to publish, and what to pause.',
        },
        {
          title: 'Transparent Communication and Reporting',
          text: 'You receive straightforward updates that explain work completed and the next recommended step.',
        },
      ],
    },
    faqs: {
      intro: 'Helpful answers about VectorCodex services for businesses connected to the Pakistan market.',
      items: [
        {
          id: 'services-pakistan',
          question: 'What digital marketing services does VectorCodex offer in Pakistan?',
          answer:
            'We offer SEO, web development, WordPress builds, social media marketing, and paid media support for organisations serving local and international audiences. Scope is tailored to your goals and current digital foundations.',
        },
        {
          id: 'seo-pakistan',
          question: 'Do you provide SEO services in Pakistan?',
          answer:
            'Yes. SEO support includes technical foundations, clearer service pages, content improvements, and local discovery work where it fits the business model.',
        },
        {
          id: 'local-customers-pakistan',
          question: 'How can SEO help my business attract local customers?',
          answer:
            'SEO helps local buyers find you through search by improving page clarity, local information, and mobile-ready journeys that make contact easier once someone discovers your brand.',
        },
        {
          id: 'seo-timeline-pakistan',
          question: 'How long does SEO take to deliver results?',
          answer:
            'Results depend on competition, site quality, and scope. We prioritise durable foundations and report progress against available data instead of promising fixed ranking dates.',
        },
        {
          id: 'websites-pakistan',
          question: 'Do you develop WordPress and e-commerce websites?',
          answer:
            'Yes. We build and redesign WordPress, custom, and e-commerce websites with a focus on mobile performance, clarity, and conversion for domestic and export audiences.',
        },
        {
          id: 'google-ads-pakistan',
          question: 'Do you manage Google Ads campaigns?',
          answer:
            'Yes. We can manage Google Ads with tighter targeting and landing-page alignment so spend supports qualified enquiry rather than unfocused traffic.',
        },
        {
          id: 'combined-pakistan',
          question: 'Can I combine SEO, web development and digital marketing?',
          answer:
            'Yes. Combined programmes are often the most effective when websites, search, and campaigns need to support both local customers and overseas prospects.',
        },
        {
          id: 'quote-pakistan',
          question: 'How can I request a project quote?',
          answer:
            'Use Start Your Project or Book a Free Consultation on this page and tell us about your goals, website, and required services. We will reply with a scoped next step.',
        },
      ],
    },
    focus: ['Technical and on-page SEO', 'Website development and maintenance', 'Social and performance marketing'],
    placeholder: true,
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
