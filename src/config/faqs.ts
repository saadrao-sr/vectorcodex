/**
 * Homepage FAQ content.
 * Edit answers carefully — keep claims aligned with published service pages.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: 'what-you-do',
    question: 'What services does VectorCodex offer?',
    answer:
      'We focus on SEO, web development, and digital marketing for UK organisations — including technical SEO, WordPress and custom builds, social media marketing, and PPC management.',
  },
  {
    id: 'how-engagement-starts',
    question: 'How does a project usually start?',
    answer:
      'We begin by understanding your business, audience, goals, and current site or campaign constraints. From there we propose a scoped plan that names what is in and what is not.',
  },
  {
    id: 'seo-timeline',
    question: 'How long does SEO take to show results?',
    answer:
      'Timelines depend on the site, competition, and scope. We prioritise foundational work first and measure progress against the data we can access, rather than promising fixed ranking dates.',
  },
  {
    id: 'websites',
    question: 'Do you build and redesign websites?',
    answer:
      'Yes. We design and develop fast, responsive sites — including WordPress, custom development, ecommerce builds, redesigns, and ongoing maintenance — focused on performance and conversions.',
  },
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer:
      'Send an enquiry with your name, contact details, service interest, and a short note about the work. We will reply with a scoped next step based on what you share.',
  },
];
