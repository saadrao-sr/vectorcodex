import type { StepDef } from './types';

export const contactSteps: StepDef[] = [
  {
    id: 'contact-details',
    title: 'Your Project Brief Is Almost Ready.',
    description: 'Share your contact details so our team can review your requirements and prepare a tailored proposal.',
    fields: [
      {
        id: 'fullName',
        label: 'Full name',
        type: 'text',
        required: true,
        placeholder: 'Your full name',
      },
      {
        id: 'email',
        label: 'Business email',
        type: 'email',
        required: true,
        placeholder: 'you@company.com',
      },
      {
        id: 'phone',
        label: 'Phone number',
        type: 'tel',
        required: true,
        placeholder: '+44…',
      },
      {
        id: 'company',
        label: 'Company name',
        type: 'text',
        required: true,
        placeholder: 'Company name',
      },
      {
        id: 'jobTitle',
        label: 'Job title / position',
        type: 'text',
        required: true,
        placeholder: 'Your role',
      },
      {
        id: 'country',
        label: 'Country',
        type: 'text',
        required: true,
        placeholder: 'Country',
      },
      {
        id: 'contactMethod',
        label: 'Preferred contact method',
        type: 'single',
        required: true,
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'whatsapp', label: 'WhatsApp' },
        ],
      },
      {
        id: 'contactTime',
        label: 'Preferred contact time',
        help: 'Optional',
        type: 'text',
        placeholder: 'e.g. Weekday mornings GMT',
      },
      {
        id: 'notes',
        label: 'Additional project notes',
        type: 'textarea',
        placeholder: 'Anything else we should know before preparing your proposal?',
      },
      {
        id: 'human_check',
        label: 'I am not a robot. Please check this box to confirm you are submitting this form yourself.',
        type: 'single',
        required: true,
        options: [{ value: 'yes', label: 'I am not a robot' }],
      },
      {
        id: 'consent',
        label: 'I agree to be contacted about this enquiry and understand my details will be used to prepare a proposal.',
        type: 'single',
        required: true,
        options: [{ value: 'yes', label: 'I agree to be contacted about this enquiry' }],
      },
    ],
  },
];
