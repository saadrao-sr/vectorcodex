/**
 * Shared legal-page configuration.
 * Replace placeholder fields when VectorCodex confirms company and privacy contacts.
 * Do not invent registration numbers, addresses, or tool names that are not in use.
 */
import { site } from './site';

export type LegalPlaceholder = {
  /** Human-readable label shown in UI. */
  label: string;
  /** True until a confirmed value replaces the placeholder. */
  pending: boolean;
  value: string;
};

export const legalPlaceholders = {
  legalEntityName: {
    label: 'Legal entity name',
    pending: true,
    value: '[Legal entity name to be confirmed]',
  },
  companyNumber: {
    label: 'Company registration number',
    pending: true,
    value: '[Company number to be confirmed]',
  },
  registeredOffice: {
    label: 'Registered office address',
    pending: true,
    value: '[Registered office address to be confirmed]',
  },
  privacyEmail: {
    label: 'Privacy contact email',
    pending: true,
    value: '[Privacy contact email to be confirmed]',
  },
  governingLaw: {
    label: 'Governing law / jurisdiction',
    pending: true,
    value: '[Governing law and jurisdiction to be confirmed]',
  },
  icoRegistration: {
    label: 'ICO registration',
    pending: true,
    value: '[ICO registration details to be confirmed, if applicable]',
  },
} as const satisfies Record<string, LegalPlaceholder>;

/** Centrally configurable policy revision date (ISO + display). */
export const privacyPolicyMeta = {
  path: '/privacy-policy/',
  seoTitle: 'Privacy Policy',
  seoDescription:
    'How VectorCodex collects, uses, stores, and protects personal information submitted through this website, including enquiries and ordinary hosting logs.',
  lastUpdatedIso: '2026-11-06',
  lastUpdatedDisplay: '6 November 2026',
  /** Public enquiry inbox currently published on the site — not a dedicated privacy mailbox until confirmed. */
  publicEmail: site.email,
  contactPath: '/contact/',
} as const;

export type PrivacyTocItem = {
  id: string;
  number: string;
  title: string;
};

export const privacyPolicyToc: PrivacyTocItem[] = [
  { id: 'introduction', number: '01', title: 'Introduction' },
  { id: 'who-we-are', number: '02', title: 'Who We Are' },
  { id: 'information-we-collect', number: '03', title: 'Information We Collect' },
  { id: 'automatically-collected', number: '04', title: 'Automatically Collected Information' },
  { id: 'how-we-use', number: '05', title: 'How We Use Your Information' },
  { id: 'lawful-bases', number: '06', title: 'Lawful Bases for Processing' },
  { id: 'cookies', number: '07', title: 'Cookies and Tracking Technologies' },
  { id: 'sharing', number: '08', title: 'Sharing Your Information' },
  { id: 'international-transfers', number: '09', title: 'International Data Transfers' },
  { id: 'retention', number: '10', title: 'Data Retention' },
  { id: 'security', number: '11', title: 'Data Security' },
  { id: 'your-rights', number: '12', title: 'Your Privacy Rights' },
  { id: 'third-party-websites', number: '13', title: 'Third-Party Websites' },
  { id: 'children', number: '14', title: "Children's Privacy" },
  { id: 'changes', number: '15', title: 'Changes to This Privacy Policy' },
  { id: 'contact-us', number: '16', title: 'Contact Us' },
];
