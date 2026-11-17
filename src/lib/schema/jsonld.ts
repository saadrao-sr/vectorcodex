import { site } from '../../config/site';
import type { BlogPost, CaseStudy, Crumb, Service } from '../../types/content';
import { absoluteUrl } from '../seo/url';

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export function organizationSchema() {
  const logo = absoluteUrl(site.logo.path);
  const organization: Record<string, unknown> = {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': organizationId,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    image: logo,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: site.logo.width,
      height: site.logo.height,
    },
    areaServed: {
      '@type': 'Country',
      name: site.areaServed,
    },
    knowsAbout: site.knowsAbout,
  };

  if (site.email) organization.email = site.email;
  if (site.telephone) organization.telephone = site.telephone;
  if (site.address) {
    organization.address = {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${site.url}/`,
        name: site.name,
        description: site.description,
        inLanguage: site.locale,
        publisher: { '@id': organizationId },
      },
    ],
  };
}

export function webPageSchema(input: { title: string; description: string; path: string }) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    inLanguage: site.locale,
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl(service.path),
    provider: { '@id': organizationId },
    areaServed: {
      '@type': 'Country',
      name: site.areaServed,
    },
  };
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    inLanguage: site.locale,
    author: post.authorName
      ? {
          '@type': 'Person',
          name: post.authorName,
          ...(post.authorAvatar ? { image: post.authorAvatar } : {}),
        }
      : { '@id': organizationId },
    publisher: { '@id': organizationId },
    isPartOf: { '@id': websiteId },
  };

  if (post.image?.src) {
    data.image = {
      '@type': 'ImageObject',
      url: post.image.src,
      ...(post.image.width ? { width: post.image.width } : {}),
      ...(post.image.height ? { height: post.image.height } : {}),
    };
  }
  if (post.categories.length > 0) {
    data.articleSection = post.categories.map((category) => category.name);
  }
  if (post.tags?.length) data.keywords = post.tags.map((tag) => tag.name).join(', ');
  if (post.readingMinutes) data.timeRequired = `PT${post.readingMinutes}M`;

  return data;
}

export function caseStudySchema(study: CaseStudy) {
  const url = absoluteUrl(study.path);
  const image = study.ogImage ?? study.heroImage ?? study.image;
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#casestudy`,
    headline: study.seoTitle || study.title,
    name: study.title,
    description: study.seoDescription || study.summary,
    url,
    mainEntityOfPage: url,
    inLanguage: site.locale,
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
    isPartOf: { '@id': websiteId },
    about: study.industry || study.sector,
  };

  if (study.publishedAt) data.datePublished = study.publishedAt;
  if (study.modifiedAt || study.publishedAt) {
    data.dateModified = study.modifiedAt || study.publishedAt;
  }
  if (image?.src) {
    data.image = {
      '@type': 'ImageObject',
      url: absoluteUrl(image.src),
      ...(image.width ? { width: image.width } : {}),
      ...(image.height ? { height: image.height } : {}),
    };
  }
  if (study.servicesDelivered?.length) data.keywords = study.servicesDelivered.join(', ');

  return data;
}
