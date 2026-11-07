import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Megaphone,
  RotateCcw,
  Search,
  Target,
  type LucideIcon,
} from 'lucide-react';
import {
  businessSteps,
  calculateIndicativeEstimate,
  contactSteps,
  formatAnswerValue,
  getService,
  services,
  validateStep,
  visibleFields,
  type Answers,
  type CalculatorState,
  type FieldDef,
  type ServiceId,
  type StepDef,
} from '../../config/pricing-calculator';
import { buildSummaryText, submitPricingEnquiry } from '../../lib/pricing-calculator/submit';
import { buttonClass } from '../ui/styles';

interface Props {
  endpoint?: string;
}

const STORAGE_KEY = 'vc-pricing-calculator-v1';

const icons: Record<ServiceDefIcon, LucideIcon> = {
  search: Search,
  code: Code2,
  megaphone: Megaphone,
  target: Target,
};

type ServiceDefIcon = (typeof services)[number]['icon'];

const initialState = (): CalculatorState => ({
  phase: 'pick',
  primaryService: null,
  additionalServices: [],
  businessAnswers: {},
  serviceAnswers: {},
  contactAnswers: {},
  activeServiceIndex: 0,
  stepIndex: 0,
});

function fieldClass(invalid?: boolean) {
  return [
    'min-h-12 w-full rounded-2xl border bg-[#121812] px-4 text-base text-white shadow-[inset_0_1px_0_rgb(255_255_255_/0.04)] transition placeholder:text-white/35 hover:border-white/20 focus:border-highlight focus:bg-[#161d16] focus:outline-none',
    invalid ? 'border-cta' : 'border-white/12',
  ].join(' ');
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs tracking-[0.12em] text-white/45 uppercase">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime to-gold transition-[width] duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldDef;
  value: Answers[string] | undefined;
  error?: string;
  onChange: (value: Answers[string]) => void;
}) {
  if (field.id === 'consent' || field.id === 'human_check') {
    const checked = value === 'yes';
    return (
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
          error ? 'border-cta/45 bg-cta/10' : 'border-white/12 bg-white/[0.03]'
        }`}
      >
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-highlight focus:ring-highlight"
          checked={checked}
          onChange={(event) => onChange(event.target.checked ? 'yes' : '')}
        />
        <span className="text-sm leading-6 text-white/80">{field.label}</span>
      </label>
    );
  }

  if (field.type === 'single') {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {(field.options ?? []).map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? 'border-highlight/45 bg-highlight/10 text-highlight'
                  : 'border-white/12 bg-white/[0.03] text-white/80 hover:border-white/25'
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === 'multi') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {(field.options ?? []).map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? 'border-highlight/45 bg-highlight/10 text-highlight'
                  : 'border-white/12 bg-white/[0.03] text-white/80 hover:border-white/25'
              }`}
              onClick={() => {
                onChange(
                  active ? selected.filter((item) => item !== option.value) : [...selected, option.value],
                );
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                    active ? 'border-highlight bg-highlight text-bg' : 'border-white/25'
                  }`}
                >
                  {active && <Check size={10} aria-hidden="true" />}
                </span>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <select
        className={fieldClass(Boolean(error))}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select an option</option>
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        rows={4}
        className={`${fieldClass(Boolean(error))} min-h-28 resize-y py-3`}
        value={String(value ?? '')}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        min={field.min}
        max={field.max}
        className={fieldClass(Boolean(error))}
        value={value == null || value === '' ? '' : String(value)}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
      />
    );
  }

  const inputType = field.type === 'email' || field.type === 'url' || field.type === 'tel' ? field.type : 'text';
  return (
    <input
      type={inputType}
      className={fieldClass(Boolean(error))}
      value={String(value ?? '')}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function StepFields({
  step,
  answers,
  errors,
  onChange,
}: {
  step: StepDef;
  answers: Answers;
  errors: Record<string, string>;
  onChange: (id: string, value: Answers[string]) => void;
}) {
  const fields = visibleFields(step.fields, answers);
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.id}>
          {field.id !== 'consent' && field.id !== 'human_check' && (
            <label className="mb-2 block text-sm font-medium text-white/85">
              {field.label}
              {field.required ? '*' : ''}
            </label>
          )}
          {field.help && <p className="mb-2 text-xs text-white/45">{field.help}</p>}
          <FieldControl
            field={field}
            value={answers[field.id]}
            error={errors[field.id]}
            onChange={(value) => onChange(field.id, value)}
          />
          {errors[field.id] && <p className="mt-2 text-sm text-cta">{errors[field.id]}</p>}
        </div>
      ))}
    </div>
  );
}

export default function PricingCalculator({ endpoint = '' }: Props) {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CalculatorState;
        if (parsed?.phase) setState({ ...initialState(), ...parsed, phase: parsed.phase === 'success' ? 'pick' : parsed.phase });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (state.phase === 'success') {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const serviceQueue = useMemo(() => {
    if (!state.primaryService) return [] as ServiceId[];
    return [state.primaryService, ...state.additionalServices.filter((id) => id !== state.primaryService)];
  }, [state.primaryService, state.additionalServices]);

  const activeServiceId = serviceQueue[state.activeServiceIndex] ?? null;
  const activeService = activeServiceId ? getService(activeServiceId) : null;

  const currentStep: StepDef | null =
    state.phase === 'business'
      ? businessSteps[state.stepIndex] ?? null
      : state.phase === 'service' && activeService
        ? activeService.steps[state.stepIndex] ?? null
        : state.phase === 'contact'
          ? contactSteps[0]
          : null;

  const progress = useMemo(() => {
    if (state.phase === 'pick') return 5;
    if (state.phase === 'business') return 10 + ((state.stepIndex + 1) / businessSteps.length) * 20;
    if (state.phase === 'service' && activeService) {
      const serviceWeight = 50 / Math.max(serviceQueue.length, 1);
      const base = 30 + state.activeServiceIndex * serviceWeight;
      return base + ((state.stepIndex + 1) / activeService.steps.length) * serviceWeight;
    }
    if (state.phase === 'addons') return 82;
    if (state.phase === 'contact') return 92;
    if (state.phase === 'success') return 100;
    return 0;
  }, [state, activeService, serviceQueue.length]);

  const estimate = calculateIndicativeEstimate({
    services: serviceQueue,
    businessAnswers: state.businessAnswers,
    serviceAnswers: state.serviceAnswers,
  });

  function updateAnswers(bucket: 'business' | 'service' | 'contact', id: string, value: Answers[string]) {
    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setState((current) => {
      if (bucket === 'business') {
        return { ...current, businessAnswers: { ...current.businessAnswers, [id]: value } };
      }
      if (bucket === 'contact') {
        return { ...current, contactAnswers: { ...current.contactAnswers, [id]: value } };
      }
      if (!activeServiceId) return current;
      return {
        ...current,
        serviceAnswers: {
          ...current.serviceAnswers,
          [activeServiceId]: { ...(current.serviceAnswers[activeServiceId] ?? {}), [id]: value },
        },
      };
    });
  }

  function restart() {
    setState(initialState());
    setErrors({});
    setStatus('idle');
    setErrorMessage('');
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function startService(id: ServiceId) {
    setState({
      ...initialState(),
      phase: 'business',
      primaryService: id,
      stepIndex: 0,
    });
    setErrors({});
  }

  function queueFrom(current: CalculatorState) {
    if (!current.primaryService) return [] as ServiceId[];
    return [current.primaryService, ...current.additionalServices.filter((id) => id !== current.primaryService)];
  }

  function goBack() {
    setErrors({});
    setState((current) => {
      const queue = queueFrom(current);
      if (current.phase === 'business') {
        if (current.stepIndex > 0) return { ...current, stepIndex: current.stepIndex - 1 };
        return { ...current, phase: 'pick', stepIndex: 0 };
      }
      if (current.phase === 'service') {
        if (current.stepIndex > 0) return { ...current, stepIndex: current.stepIndex - 1 };
        if (current.activeServiceIndex === 1) {
          return { ...current, phase: 'addons', stepIndex: 0, activeServiceIndex: 0 };
        }
        if (current.activeServiceIndex > 1) {
          const prevService = queue[current.activeServiceIndex - 1];
          const prevSteps = prevService ? getService(prevService).steps.length : 1;
          return {
            ...current,
            activeServiceIndex: current.activeServiceIndex - 1,
            stepIndex: Math.max(0, prevSteps - 1),
          };
        }
        return { ...current, phase: 'business', stepIndex: businessSteps.length - 1 };
      }
      if (current.phase === 'addons') {
        if (!current.primaryService) return current;
        const primarySteps = getService(current.primaryService).steps.length;
        return {
          ...current,
          phase: 'service',
          activeServiceIndex: 0,
          stepIndex: Math.max(0, primarySteps - 1),
        };
      }
      if (current.phase === 'contact') {
        const extras = current.additionalServices.filter((id) => id !== current.primaryService);
        if (extras.length > 0) {
          const lastExtra = extras[extras.length - 1];
          const lastSteps = lastExtra ? getService(lastExtra).steps.length : 1;
          return {
            ...current,
            phase: 'service',
            activeServiceIndex: 1 + extras.length - 1,
            stepIndex: Math.max(0, lastSteps - 1),
          };
        }
        return { ...current, phase: 'addons', stepIndex: 0 };
      }
      return current;
    });
  }

  function continueForward() {
    if (state.phase === 'business' && currentStep) {
      const nextErrors = validateStep(currentStep, state.businessAnswers);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
      if (state.stepIndex < businessSteps.length - 1) {
        setState((current) => ({ ...current, stepIndex: current.stepIndex + 1 }));
        return;
      }
      setState((current) => ({ ...current, phase: 'service', activeServiceIndex: 0, stepIndex: 0 }));
      return;
    }

    if (state.phase === 'service' && activeService && currentStep && activeServiceId) {
      const answers = state.serviceAnswers[activeServiceId] ?? {};
      const nextErrors = validateStep(currentStep, answers);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
      if (state.stepIndex < activeService.steps.length - 1) {
        setState((current) => ({ ...current, stepIndex: current.stepIndex + 1 }));
        return;
      }
      const queue = serviceQueue;
      if (state.activeServiceIndex < queue.length - 1) {
        setState((current) => ({
          ...current,
          activeServiceIndex: current.activeServiceIndex + 1,
          stepIndex: 0,
        }));
        return;
      }
      if (state.activeServiceIndex === 0) {
        setState((current) => ({ ...current, phase: 'addons', stepIndex: 0 }));
        return;
      }
      setState((current) => ({ ...current, phase: 'contact', stepIndex: 0 }));
      return;
    }

    if (state.phase === 'addons') {
      setState((current) => {
        const extras = current.additionalServices.filter((id) => id !== current.primaryService);
        if (extras.length === 0) {
          return { ...current, phase: 'contact', stepIndex: 0 };
        }
        return {
          ...current,
          phase: 'service',
          activeServiceIndex: 1,
          stepIndex: 0,
        };
      });
    }
  }

  async function submit() {
    if (!state.primaryService || !currentStep) return;
    const nextErrors = validateStep(currentStep, state.contactAnswers);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const honeypot = String(state.contactAnswers.company_website ?? '').trim();
    if (honeypot) {
      setState((current) => ({ ...current, phase: 'success' }));
      return;
    }

    const allServices = serviceQueue;
    const estimateResult = calculateIndicativeEstimate({
      services: allServices,
      businessAnswers: state.businessAnswers,
      serviceAnswers: state.serviceAnswers,
    });
    const base = {
      primaryService: state.primaryService,
      additionalServices: state.additionalServices,
      allServices,
      businessAnswers: state.businessAnswers,
      serviceAnswers: state.serviceAnswers,
      contactAnswers: state.contactAnswers,
      estimate: estimateResult,
    };
    const payload = {
      form_type: 'pricing_calculator' as const,
      ...base,
      summaryText: buildSummaryText(base),
      submittedAt: new Date().toISOString(),
    };

    setStatus('submitting');
    setErrorMessage('');
    const result = await submitPricingEnquiry(endpoint, payload);
    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.message);
      return;
    }
    setStatus('idle');
    setState((current) => ({ ...current, phase: 'success' }));
  }

  const labelLookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const step of [...businessSteps, ...contactSteps, ...services.flatMap((service) => service.steps)]) {
      for (const field of step.fields) map.set(field.id, field.label);
    }
    return map;
  }, []);

  const summaryEntries = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    if (serviceQueue.length) {
      rows.push({
        label: 'Services',
        value: serviceQueue.map((id) => getService(id).shortTitle).join(' + '),
      });
    }
    for (const [key, value] of Object.entries(state.businessAnswers)) {
      if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) continue;
      rows.push({ label: labelLookup.get(key) ?? key, value: formatAnswerValue(value) });
    }
    return rows.slice(0, 10);
  }, [state.businessAnswers, serviceQueue, labelLookup]);

  const reviewSections = useMemo(() => {
    const sections: { title: string; rows: { label: string; value: string }[] }[] = [
      {
        title: 'Business',
        rows: Object.entries(state.businessAnswers)
          .filter(([, value]) => value != null && value !== '' && !(Array.isArray(value) && value.length === 0))
          .map(([key, value]) => ({ label: labelLookup.get(key) ?? key, value: formatAnswerValue(value) })),
      },
    ];
    for (const serviceId of serviceQueue) {
      const answers = state.serviceAnswers[serviceId] ?? {};
      sections.push({
        title: getService(serviceId).title,
        rows: Object.entries(answers)
          .filter(([, value]) => value != null && value !== '' && !(Array.isArray(value) && value.length === 0))
          .map(([key, value]) => ({ label: labelLookup.get(key) ?? key, value: formatAnswerValue(value) })),
      });
    }
    return sections.filter((section) => section.rows.length > 0);
  }, [state.businessAnswers, state.serviceAnswers, serviceQueue, labelLookup]);

  if (!hydrated) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 text-sm text-white/55">
        Loading calculator…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 rounded-[1.75rem] border border-white/12 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgb(0_0_0_/0.28)] sm:p-7">
        {state.phase !== 'pick' && state.phase !== 'success' && (
          <div className="mb-6 space-y-4">
            <ProgressBar value={progress} label={`Step progress`} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" className={`${buttonClass.base} ${buttonClass.ghost}`} onClick={goBack}>
                <ArrowLeft size={16} aria-hidden="true" />
                Previous
              </button>
              <button type="button" className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-highlight" onClick={restart}>
                <RotateCcw size={14} aria-hidden="true" />
                Restart
              </button>
            </div>
          </div>
        )}

        {state.phase === 'pick' && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">Choose a starting point</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">Select a service to begin</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = icons[service.icon];
                return (
                  <li key={service.id}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-5 transition hover:border-highlight/40">
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${service.accent}`} aria-hidden="true" />
                      <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-highlight/25 bg-highlight/10 text-highlight">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <h4 className="relative mt-4 font-display text-xl font-semibold text-white">{service.title}</h4>
                      <p className="relative mt-2 flex-1 text-sm leading-6 text-white/65">{service.description}</p>
                      <button
                        type="button"
                        className={`${buttonClass.base} ${buttonClass.gradient} relative mt-5 w-full`}
                        onClick={() => startService(service.id)}
                      >
                        {service.cta}
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {(state.phase === 'business' || state.phase === 'service') && currentStep && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">
              {state.phase === 'business' ? 'Business details' : activeService?.title}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">{currentStep.title}</h3>
            {currentStep.description && <p className="mt-2 text-sm leading-6 text-white/60">{currentStep.description}</p>}
            <div className="mt-6">
              <StepFields
                step={currentStep}
                answers={
                  state.phase === 'business'
                    ? state.businessAnswers
                    : activeServiceId
                      ? (state.serviceAnswers[activeServiceId] ?? {})
                      : {}
                }
                errors={errors}
                onChange={(id, value) => updateAnswers(state.phase === 'business' ? 'business' : 'service', id, value)}
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" className={`${buttonClass.base} ${buttonClass.gradient}`} onClick={continueForward}>
                Continue
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {state.phase === 'addons' && state.primaryService && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">Additional services</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">Need anything else?</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Add cross-service requirements. Selected extras will add their calculator steps before you submit.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {services
                .filter((service) => service.id !== state.primaryService)
                .map((service) => {
                  const active = state.additionalServices.includes(service.id);
                  return (
                    <li key={service.id}>
                      <button
                        type="button"
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? 'border-highlight/45 bg-highlight/10'
                            : 'border-white/12 bg-white/[0.03] hover:border-white/25'
                        }`}
                        onClick={() => {
                          setState((current) => ({
                            ...current,
                            additionalServices: active
                              ? current.additionalServices.filter((id) => id !== service.id)
                              : [...current.additionalServices, service.id],
                          }));
                        }}
                      >
                        <p className={`font-display text-lg font-semibold ${active ? 'text-highlight' : 'text-white'}`}>
                          {service.title}
                        </p>
                        <p className="mt-1 text-sm text-white/55">{active ? 'Will add calculator steps' : 'Optional add-on'}</p>
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="mt-8 flex justify-end">
              <button type="button" className={`${buttonClass.base} ${buttonClass.gradient}`} onClick={continueForward}>
                Continue to contact details
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {state.phase === 'contact' && currentStep && (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">Final details</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">{currentStep.title}</h3>
            {currentStep.description && <p className="mt-2 text-sm leading-6 text-white/60">{currentStep.description}</p>}

            <div className="mt-5 space-y-4 rounded-2xl border border-white/10 bg-[#121912]/80 p-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">Selected services</p>
                <p className="mt-2 text-sm text-white/80">{serviceQueue.map((id) => getService(id).title).join(' · ')}</p>
              </div>
              <div className="max-h-64 space-y-4 overflow-y-auto border-t border-white/8 pt-4 pr-1">
                {reviewSections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs font-semibold tracking-[0.12em] text-highlight/80 uppercase">{section.title}</p>
                    <ul className="mt-2 space-y-2">
                      {section.rows.map((row) => (
                        <li key={`${section.title}-${row.label}`} className="text-sm leading-5 text-white/70">
                          <span className="text-white/45">{row.label}: </span>
                          {row.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="border-t border-white/8 pt-3 text-xs leading-5 text-white/50">{estimate.disclaimer}</p>
            </div>

            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={String(state.contactAnswers.company_website ?? '')}
              onChange={(event) => updateAnswers('contact', 'company_website', event.target.value)}
            />

            <div className="mt-6">
              <StepFields
                step={currentStep}
                answers={state.contactAnswers}
                errors={errors}
                onChange={(id, value) => updateAnswers('contact', id, value)}
              />
            </div>

            {status === 'error' && (
              <p className="mt-4 rounded-2xl border border-cta/35 bg-cta/10 px-4 py-3 text-sm text-cta" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className={`${buttonClass.base} ${buttonClass.gradient}`}
                disabled={status === 'submitting'}
                onClick={() => void submit()}
              >
                {status === 'submitting' ? 'Sending…' : 'Submit project brief'}
              </button>
            </div>
          </div>
        )}

        {state.phase === 'success' && (
          <div className="py-6 text-center sm:py-10">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-highlight/40 bg-highlight/10 text-highlight">
              <Check size={28} aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white">Brief received</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/65">
              Thanks — your calculator responses are with the VectorCodex team. We will review your requirements and follow up with a tailored proposal.
            </p>
            <button type="button" className={`${buttonClass.base} ${buttonClass.ghost} mt-7`} onClick={restart}>
              Start another calculation
            </button>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-28">
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-left text-sm text-white lg:hidden"
          onClick={() => setSummaryOpen((value) => !value)}
        >
          Live selection summary
          <span className="text-highlight">{summaryOpen ? 'Hide' : 'Show'}</span>
        </button>
        <div className={`${summaryOpen ? 'block' : 'hidden'} rounded-[1.5rem] border border-white/12 bg-white/[0.03] p-5 lg:block`}>
          <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-highlight uppercase">Summary</p>
          <ul className="mt-4 space-y-3">
            {summaryEntries.length === 0 ? (
              <li className="text-sm text-white/45">Select a service to begin building your brief.</li>
            ) : (
              summaryEntries.map((row) => (
                <li key={`${row.label}-${row.value}`} className="border-b border-white/8 pb-3 last:border-0 last:pb-0">
                  <p className="text-[0.65rem] tracking-[0.12em] text-white/40 uppercase">{row.label}</p>
                  <p className="mt-1 text-sm text-white/80">{row.value}</p>
                </li>
              ))
            )}
          </ul>
          <p className="mt-5 text-xs leading-5 text-white/45">{estimate.disclaimer}</p>
        </div>
      </aside>
    </div>
  );
}
