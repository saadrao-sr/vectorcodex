import { caseStudies } from '../../config/case-studies';
import { services } from '../../config/services';
import { site } from '../../config/site';
import { absoluteUrl } from './url';

const introParagraph =
  'VectorCodex plans and builds search-ready websites and marketing programmes for organisations in the United Kingdom. Pages are server-rendered HTML. The public site does not publish client statistics, testimonials, or results unless they are sourced.';

const companyLinks = [
  { title: 'Home', path: '/', blurb: 'Overview of VectorCodex and its services.' },
  { title: 'Services', path: '/services/', blurb: 'Index of SEO, web development, and digital marketing services.' },
  { title: 'About', path: '/about/', blurb: 'What the agency does and how engagements are run.' },
  {
    title: 'Industries',
    path: '/industries/',
    blurb: 'Sector overview. Named industry pages are added when published work is confirmed.',
  },
  { title: 'Contact', path: '/contact/', blurb: 'Enquiry form. Company contact details are added when confirmed.' },
  {
    title: 'Case studies',
    path: '/case-studies/',
    blurb: 'Published work. Current entries are labelled placeholders.',
  },
  { title: 'Blog', path: '/blog/', blurb: 'Articles loaded from the WordPress REST API at build time.' },
  { title: 'Privacy policy', path: '/privacy-policy/', blurb: 'How the site handles personal data.' },
];

function header() {
  return [`# ${site.name}`, '', `> ${site.description}`, '', introParagraph, ''].join('\n');
}

function servicesIndex() {
  const lines = ['## Services', ''];
  for (const service of services) {
    lines.push(`- [${service.title}](${absoluteUrl(service.path)}): ${service.summary}`);
  }
  lines.push('');
  return lines.join('\n');
}

function companyIndex() {
  const lines = ['## Company', ''];
  for (const link of companyLinks) {
    lines.push(`- [${link.title}](${absoluteUrl(link.path)}): ${link.blurb}`);
  }
  lines.push('');
  return lines.join('\n');
}

function notes() {
  return [
    '## Notes for crawlers',
    '',
    `- Canonical origin: ${site.url}/`,
    `- Language: ${site.locale}`,
    `- Area served: ${site.areaServed}`,
    '- Blog content is published from WordPress and is not hardcoded in the repository.',
    '- Case study pages marked as placeholders are not offers of verified client results.',
    `- Machine-readable companion: ${absoluteUrl('/llms-full.txt')}`,
    `- Sitemap: ${site.url}/sitemap-index.xml`,
    '',
  ].join('\n');
}

function contactBlock() {
  const lines = [
    '## Contact',
    '',
    `Enquiries are collected through ${absoluteUrl('/contact/')}.`,
  ];

  lines.push(site.email ? `Email: ${site.email}` : 'A public email address has not been added yet.');
  lines.push(site.telephone ? `Telephone: ${site.telephone}` : 'A public telephone number has not been added yet.');
  lines.push(
    site.address
      ? `Address: ${[site.address.street, site.address.locality, site.address.region, site.address.postalCode, site.address.country].filter(Boolean).join(', ')}`
      : 'A registered office address has not been added yet.',
  );
  lines.push('');
  return lines.join('\n');
}

export function renderLlms() {
  return [header(), servicesIndex(), companyIndex(), notes()].join('\n').trimEnd() + '\n';
}

export function renderLlmsFull() {
  const serviceSections = services
    .map((service) => {
      const includes = service.includes.map((item) => `- ${item.title}: ${item.text}`).join('\n');
      return [
        `## ${service.title}`,
        '',
        `URL: ${absoluteUrl(service.path)}`,
        '',
        service.intro,
        '',
        includes,
        '',
      ].join('\n');
    })
    .join('\n');

  const caseStudyLines = [
    '## Case studies',
    '',
    ...caseStudies.map(
      (study) =>
        `- ${study.title} (${absoluteUrl(study.path)}): ${study.summary} Placeholder: ${study.placeholder ? 'yes' : 'no'}.`,
    ),
    '',
  ].join('\n');

  const technology = [
    '## Technology',
    '',
    'The marketing site is a static Astro build. Interactive pieces, including the mobile menu and contact form, hydrate as React components. Article HTML is fetched from the WordPress REST API on the server at build time, sanitised, and written into static pages.',
    '',
  ].join('\n');

  return (
    [
      renderLlms().trimEnd(),
      '',
      '# Full site brief',
      '',
      'VectorCodex is a UK-focused digital agency. The services below are descriptions of the work offered. They are not performance claims.',
      '',
      serviceSections,
      caseStudyLines,
      contactBlock(),
      technology,
    ].join('\n').trimEnd() + '\n'
  );
}
