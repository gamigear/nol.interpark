import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ContentCard } from '@/components/cards/content-card';
import { HorizontalCarousel } from '@/components/interactive/horizontal-carousel';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { ContentItem, HomeSection } from '@/types/home';

type EditorialSectionProps = {
  section: HomeSection<ContentItem>;
  locale?: 'en' | 'ko';
};

const EDITORIAL_COPY = {
  en: {
    kicker: 'This week\'s concert',
    shelf: 'Homepage editorial rail',
    emptyTitle: 'Stories will appear here soon',
    emptyDescription: 'Editorial framing is ready, but there is no story content to surface yet.',
    emptyCta: 'See travel guides',
    emptyNote: 'This rail will automatically surface published editorial content as soon as stories are available.',
    cardCta: 'Read story',
  },
  ko: {
    kicker: '이번 주 공연',
    shelf: '홈페이지 에디토리얼 레일',
    emptyTitle: '스토리 콘텐츠가 곧 노출됩니다',
    emptyDescription: '에디토리얼 영역은 준비되어 있지만 현재 노출할 스토리가 없습니다.',
    emptyCta: '여행 가이드 보기',
    emptyNote: '스토리 콘텐츠가 연결되면 이 레일에 자동으로 노출됩니다.',
    cardCta: '스토리 보기',
  },
} as const;

export function EditorialSection({ section, locale = 'en' }: EditorialSectionProps) {
  const copy = EDITORIAL_COPY[locale];

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
        <HorizontalCarousel>
          {section.items.map((item) => (
            <ContentCard key={item.id} item={item} ctaLabel={copy.cardCta} />
          ))}
        </HorizontalCarousel>
      ) : (
        <PublicEmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          ctaLabel={copy.emptyCta}
          ctaHref={section.ctaHref ?? '/en/guides'}
          note={copy.emptyNote}
          noteTone="muted"
          compact
        />
      )}
    </SectionShell>
  );
}
