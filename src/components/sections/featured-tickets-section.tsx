import { PublicMetaList } from '@/components/layout/public-meta-list';
import { TicketCard } from '@/components/cards/ticket-card';
import { HorizontalCarousel } from '@/components/interactive/horizontal-carousel';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { HomeSection, TicketItem } from '@/types/home';

type FeaturedTicketsSectionProps = {
  section: HomeSection<TicketItem>;
  locale?: 'en' | 'ko';
};

const FEATURED_COPY = {
  en: {
    kicker: 'Top tickets',
    shelf: 'Homepage featured rail',
    emptyTitle: 'Ticket highlights are on the way',
    emptyDescription: 'This homepage shelf is ready, but there are no featured tickets to display yet.',
    emptyCta: 'Browse all tickets',
    emptyNote: 'Featured tickets will populate here automatically once ticket content is available.',
  },
  ko: {
    kicker: '이번 주 인기 티켓',
    shelf: '홈페이지 대표 티켓 레일',
    emptyTitle: '대표 티켓이 곧 노출될 예정입니다',
    emptyDescription: '홈 주요 티켓 영역은 준비되어 있지만 아직 노출할 대표 티켓이 없습니다.',
    emptyCta: '전체 티켓 보기',
    emptyNote: '콘텐츠가 연결되면 이 영역에 대표 티켓이 자동으로 노출됩니다.',
  },
} as const;

export function FeaturedTicketsSection({ section, locale = 'en' }: FeaturedTicketsSectionProps) {
  const copy = FEATURED_COPY[locale];

  return (
    <SectionShell id={section.id} tone="plain">
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
            <TicketCard key={item.id} item={item} ctaLabel={locale === 'ko' ? '티켓 보기' : 'View ticket'} />
          ))}
        </HorizontalCarousel>
      ) : (
        <PublicEmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          ctaLabel={copy.emptyCta}
          ctaHref={section.ctaHref ?? '/en/tickets'}
          note={copy.emptyNote}
          noteTone="muted"
          compact
        />
      )}
    </SectionShell>
  );
}
