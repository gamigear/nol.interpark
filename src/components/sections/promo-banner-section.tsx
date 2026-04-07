import { SectionShell } from '@/components/sections/section-shell';
import { SectionHeader } from '@/components/sections/section-header';
import type { HomepagePromoViewModel } from '@/lib/server/homepage/view-model';

type PromoBannerSectionProps = {
  promo: HomepagePromoViewModel;
};

export function PromoBannerSection({ promo }: PromoBannerSectionProps) {
  const firstItem = promo.items[0];

  return (
    <SectionShell id={promo.id} tone="highlight">
      <SectionHeader
        title={promo.title || firstItem?.headline || 'Promotions'}
        description={promo.description || firstItem?.subheadline}
        ctaLabel={promo.ctaLabel || firstItem?.ctaLabel}
        ctaHref={promo.ctaHref || firstItem?.ctaHref}
        kicker="Promotions"
      />
      <div className="promo-banner">
        <div className="promo-banner__body">
          {firstItem?.theme ? <p className="card-eyebrow">{firstItem.theme}</p> : null}
          <h3 className="promo-banner__headline">{firstItem?.headline ?? 'Special offer'}</h3>
          {firstItem?.subheadline ? <p className="promo-banner__subheadline">{firstItem.subheadline}</p> : null}
        </div>
        {firstItem?.ctaLabel ? (
          <a
            className="promo-banner__cta"
            href={firstItem.ctaHref ?? promo.ctaHref ?? '#'}
            aria-label={`${firstItem.ctaLabel}: ${firstItem?.headline ?? promo.title ?? 'Promotion'}`}
          >
            {firstItem.ctaLabel}
          </a>
        ) : null}
      </div>
    </SectionShell>
  );
}
