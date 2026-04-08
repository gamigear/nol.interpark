import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ContentCard } from '@/components/cards/content-card';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { ContentItem, HomeSection } from '@/types/home';

type TravelGuidesSectionProps = {
  section: HomeSection<ContentItem>;
  locale?: 'en' | 'ko';
};

const TRAVEL_GUIDES_COPY = {
  en: {
    kicker: 'Travel guides',
    shelf: 'Homepage planning guides',
    emptyTitle: 'Travel guides are being prepared',
    emptyDescription: 'This guide shelf is ready, but the planning content set is still empty.',
    emptyCta: 'Back to homepage',
    cardCta: 'Read guide',
  },
  ko: {
    kicker: '여행 가이드',
    shelf: '홈페이지 여행 가이드 그리드',
    emptyTitle: '여행 가이드가 곧 준비됩니다',
    emptyDescription: '가이드 섹션은 준비되어 있지만 아직 노출할 계획형 콘텐츠가 없습니다.',
    emptyCta: '홈으로 돌아가기',
    cardCta: '가이드 보기',
  },
} as const;

export function TravelGuidesSection({ section, locale = 'en' }: TravelGuidesSectionProps) {
  const copy = TRAVEL_GUIDES_COPY[locale];

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
        <div className="cards-grid cards-grid--guides">
          {section.items.map((item) => (
            <ContentCard key={item.id} item={item} ctaLabel={copy.cardCta} />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          ctaLabel={copy.emptyCta}
          ctaHref={section.ctaHref ?? '/en'}
          compact
        />
      )}
    </SectionShell>
  );
}
