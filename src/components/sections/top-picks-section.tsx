import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ProductCard } from '@/components/cards/product-card';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { HomeSection, ProductItem } from '@/types/home';

type TopPicksSectionProps = {
  section: HomeSection<ProductItem>;
  locale?: 'en' | 'ko';
};

const TOP_PICKS_COPY = {
  en: {
    kicker: 'K-pop fan picks',
    shelf: 'Homepage curated picks',
    emptyTitle: 'Top picks are being curated',
    emptyDescription: 'This shelf is ready for merchandising, but there are no curated picks available yet.',
    emptyCta: 'Browse tickets',
  },
  ko: {
    kicker: 'K-POP 팬 추천 픽',
    shelf: '홈페이지 추천 픽 그리드',
    emptyTitle: '추천 픽이 곧 준비됩니다',
    emptyDescription: '머천다이징 영역은 준비되어 있지만 현재 노출할 추천 상품이 없습니다.',
    emptyCta: '티켓 둘러보기',
  },
} as const;

export function TopPicksSection({ section, locale = 'en' }: TopPicksSectionProps) {
  const copy = TOP_PICKS_COPY[locale];

  return (
    <SectionShell id={section.id}>
      <SectionHeader
        title={section.title}
        description={section.description}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        kicker={copy.kicker}
      />
      <PublicMetaList
        items={[
          { label: 'Items', value: String(section.items.length) },
          { label: 'Route', value: section.ctaHref ?? 'Pending' },
          { label: 'Shelf', value: copy.shelf },
        ]}
        compact
      />
      {section.items.length > 0 ? (
        <div className="homepage-top-picks-grid cards-grid cards-grid--top-picks">
          {section.items.map((item) => (
            <ProductCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          ctaLabel={copy.emptyCta}
          ctaHref={section.ctaHref ?? '/en/tickets'}
          compact
        />
      )}
    </SectionShell>
  );
}
