export type ServiceId = 'seo' | 'web' | 'social' | 'ppc';

export type AnswerValue = string | string[] | number | boolean;

export type Answers = Record<string, AnswerValue>;

export type FieldOption = {
  value: string;
  label: string;
};

export type FieldType = 'text' | 'url' | 'email' | 'tel' | 'number' | 'textarea' | 'single' | 'multi' | 'select';

export type FieldDef = {
  id: string;
  label: string;
  help?: string;
  type: FieldType;
  options?: FieldOption[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  /** Show field only when this returns true. */
  showIf?: (answers: Answers) => boolean;
};

export type StepDef = {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
};

export type ServiceDef = {
  id: ServiceId;
  title: string;
  shortTitle: string;
  description: string;
  includes: string[];
  icon: 'search' | 'code' | 'megaphone' | 'target';
  accent: string;
  cta: string;
  steps: StepDef[];
};

export type CalculatorPhase = 'pick' | 'business' | 'service' | 'addons' | 'contact' | 'success';

export type CalculatorState = {
  phase: CalculatorPhase;
  primaryService: ServiceId | null;
  additionalServices: ServiceId[];
  businessAnswers: Answers;
  serviceAnswers: Partial<Record<ServiceId, Answers>>;
  contactAnswers: Answers;
  activeServiceIndex: number;
  stepIndex: number;
};
