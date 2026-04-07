import { PublicMetaList } from '@/components/layout/public-meta-list';
import { TicketCard } from '@/components/cards/ticket-card';
import { HorizontalCarousel } from '@/components/interactive/horizontal-carousel';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { HomeSection, TicketItem } from '@/types/home';

type FeaturedTicketsSectionProps = {
  section: HomeSection<TicketItem>;
};

export function FeaturedTicketsSection({ section }: FeaturedTicketsSectionProps) {
  return (
    <SectionShell id={section.id} tone="plain">
      <SectionHeader
        title={section.title}
        description={section.description}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        kicker="Book now"
      />
      <PublicMetaList
        items={[
          { label: 'Items', value: String(section.items.length) },
          { label: 'Route', value: section.ctaHref ?? 'Pending' },
          { label: 'Shelf', value: 'Homepage featured rail' },
        ]}
        compact
      />
      {section.items.length > 0 ? (
        <HorizontalCarousel>
          {section.items.map((item) => (
            <TicketCard key={item.id} item={item} />
          ))}
        </HorizontalCarousel>
      ) : (
        <PublicEmptyState
          title="Ticket highlights are on the way"
          description="This homepage shelf is ready, but there are no featured tickets to display yet."
          ctaLabel="Browse all tickets"
          ctaHref={section.ctaHref ?? '/en/tickets'}
          note="Featured tickets will populate here automatically once ticket content is available."
          noteTone="muted"
          compact
        />
      )}
    </SectionShell>
  );
}
