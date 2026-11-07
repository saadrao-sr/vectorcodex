export const buttonClass = {
  base: 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight',
  gradient: 'bg-gradient-to-r from-lime to-gold text-bg transition hover:brightness-105',
  cta: 'bg-cta text-bg transition hover:brightness-105',
  ghost: 'border border-white/20 bg-transparent text-white transition hover:border-highlight hover:text-highlight',
} as const;

export const eyebrowClass =
  'inline-flex items-center rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-white/85 uppercase backdrop-blur-sm transition-colors duration-200 hover:border-highlight/50 hover:bg-highlight/10 hover:text-highlight sm:text-xs';
