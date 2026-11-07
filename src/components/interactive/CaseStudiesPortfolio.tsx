import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CaseStudy } from '../../types/content';
import { buttonClass, eyebrowClass } from '../ui/styles';

type ServiceFilter =
  | 'all'
  | 'seo'
  | 'web'
  | 'ecommerce'
  | 'marketing'
  | 'ppc';

type IndustryFilter =
  | 'all'
  | 'healthcare'
  | 'automotive'
  | 'ecommerce-retail'
  | 'finance'
  | 'travel'
  | 'professional';

type PortfolioItem = CaseStudy & {
  services: ServiceFilter[];
  industries: IndustryFilter[];
};

const serviceFilters: { id: ServiceFilter; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'seo', label: 'SEO' },
  { id: 'web', label: 'Web Development' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'marketing', label: 'Digital Marketing' },
  { id: 'ppc', label: 'PPC' },
];

const industryFilters: { id: IndustryFilter; label: string }[] = [
  { id: 'all', label: 'All Industries' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'ecommerce-retail', label: 'E-commerce & Retail' },
  { id: 'finance', label: 'Finance' },
  { id: 'travel', label: 'Travel & Tourism' },
  { id: 'professional', label: 'Professional Services' },
];

const PAGE_SIZE = 6;

function mapService(service: string): ServiceFilter[] {
  const value = service.toLowerCase();
  if (value.includes('seo') || value.includes('search')) return ['seo'];
  if (value.includes('ppc') || value.includes('paid')) return ['ppc'];
  if (value.includes('ecommerce') || value.includes('e-commerce')) return ['ecommerce'];
  if (value.includes('marketing') || value.includes('social')) return ['marketing'];
  if (value.includes('web') || value.includes('development')) return ['web'];
  return ['web'];
}

function mapIndustry(sector: string): IndustryFilter[] {
  const value = sector.toLowerCase();
  if (!value || value === 'to be confirmed') return [];
  if (value.includes('health') || value.includes('dental') || value.includes('medico')) return ['healthcare'];
  if (value.includes('auto') || value.includes('car')) return ['automotive'];
  if (value.includes('retail') || value.includes('ecommerce') || value.includes('e-commerce')) {
    return ['ecommerce-retail'];
  }
  if (value.includes('finance') || value.includes('account')) return ['finance'];
  if (value.includes('travel') || value.includes('tour')) return ['travel'];
  if (value.includes('consult') || value.includes('professional')) return ['professional'];
  return [];
}

function serviceLabel(id: ServiceFilter) {
  return serviceFilters.find((item) => item.id === id)?.label ?? id;
}

function industryLabel(id: IndustryFilter) {
  return industryFilters.find((item) => item.id === id)?.label ?? id;
}

interface Props {
  items: CaseStudy[];
}

export default function CaseStudiesPortfolio({ items }: Props) {
  const [service, setService] = useState<ServiceFilter>('all');
  const [industry, setIndustry] = useState<IndustryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const portfolio = useMemo<PortfolioItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        services: mapService(item.service),
        industries: mapIndustry(item.sector),
      })),
    [items],
  );

  const filtered = useMemo(() => {
    return portfolio.filter((item) => {
      const serviceMatch = service === 'all' || item.services.includes(service);
      const industryMatch =
        industry === 'all' || item.industries.includes(industry);
      return serviceMatch && industryMatch;
    });
  }, [portfolio, service, industry]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetVisible = (nextService: ServiceFilter, nextIndustry: IndustryFilter) => {
    setService(nextService);
    setIndustry(nextIndustry);
    setVisibleCount(PAGE_SIZE);
  };

  const filterButtonClass = (active: boolean) =>
    [
      'inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase transition duration-200 sm:text-[0.7rem]',
      active
        ? 'border-highlight/45 bg-highlight/15 text-highlight shadow-[0_0_24px_rgb(222_243_77_/0.12)]'
        : 'border-white/12 bg-white/[0.03] text-white/55 hover:border-white/25 hover:bg-white/[0.05] hover:text-white/80',
    ].join(' ');

  return (
    <div>
      <header className="mx-auto max-w-3xl text-center">
        <p className={`${eyebrowClass} mx-auto w-fit max-w-full`}>Our Project Portfolio</p>
        <h2
          id="case-studies-listing-heading"
          className="mt-4 font-display text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]"
        >
          Discover Projects Across
          <span className="text-highlight"> Industries.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
          Every business has different goals and challenges. Explore our work across industries and digital services to
          see how we create solutions tailored to different business needs.
        </p>
      </header>

      <div className="mt-8 space-y-4 sm:mt-10">
        <div>
          <p className="mb-2.5 text-[0.65rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
            Filter by service
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter projects by service"
          >
            {serviceFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={service === item.id}
                className={filterButtonClass(service === item.id)}
                onClick={() => resetVisible(item.id, industry)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[0.65rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
            Filter by industry
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter projects by industry"
          >
            {industryFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={industry === item.id}
                className={filterButtonClass(industry === item.id)}
                onClick={() => resetVisible(service, item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center sm:mt-12">
          <p className="font-display text-xl font-semibold text-white">No projects match these filters</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
            Try another service or industry, or reset to browse the full portfolio.
          </p>
          <button
            type="button"
            className={`${buttonClass.base} ${buttonClass.ghost} mt-6`}
            onClick={() => resetVisible('all', 'all')}
          >
            All Projects
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 md:grid-cols-3">
            {visible.map((item) => (
              <li key={item.slug} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.03] transition duration-300 hover:border-highlight/35">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-highlight/10 via-transparent to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />

                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/10">
                    {item.image ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width ?? 1920}
                        height={item.image.height ?? 1080}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-highlight/15 via-white/[0.04] to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D120C]/85 via-[#0D120C]/25 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center bg-[#0D120C]/55 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                      <a
                        href={item.path}
                        className={`${buttonClass.base} ${buttonClass.gradient} shadow-[0_12px_36px_rgb(197_246_61_/0.2)]`}
                      >
                        View Case Study
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="relative grid shrink-0 grid-rows-[auto_auto_auto] gap-2 px-5 pt-4 pb-5">
                    <div className="flex min-h-7 flex-wrap content-start gap-2">
                      {item.placeholder && (
                        <span className="rounded-full border border-highlight/40 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-highlight uppercase">
                          Coming soon
                        </span>
                      )}
                      {item.industries.map((id) => (
                        <span
                          key={id}
                          className="rounded-full border border-white/15 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-white/55 uppercase"
                        >
                          {industryLabel(id)}
                        </span>
                      ))}
                      {item.services.map((id) => (
                        <span
                          key={id}
                          className="rounded-full border border-white/15 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-white/55 uppercase"
                        >
                          {serviceLabel(id)}
                        </span>
                      ))}
                    </div>

                    <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-xl leading-snug font-semibold tracking-tight text-white">
                      <a href={item.path} className="transition hover:text-highlight">
                        {item.title}
                      </a>
                    </h3>
                    <p className="line-clamp-2 min-h-12 text-sm leading-6 text-white/60">{item.summary}</p>

                    <a
                      href={item.path}
                      className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-highlight transition hover:gap-2.5 sm:hidden"
                    >
                      View Case Study
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-9 flex justify-center sm:mt-11">
              <button
                type="button"
                className={`${buttonClass.base} ${buttonClass.ghost}`}
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
