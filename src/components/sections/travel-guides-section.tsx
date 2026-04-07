import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ContentCard } from '@/components/cards/content-card';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { ContentItem, HomeSection } from '@/types/home';

type TravelGuidesSectionProps = {
  section: HomeSection<ContentItem>;
};

export function TravelGuidesSection({ section }: TravelGuidesSectionProps) {
  return (
    <SectionShell id={section.id}>
      <SectionHeader
        title={section.title}
        description={section.description}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        kicker="Plan ahead"
      />
      <PublicMetaList
        items={[
          { label: 'Items', value: String(section.items.length) },
          { label: 'Route', value: section.ctaHref ?? 'Pending' },
          { label: 'Shelf', value: 'Homepage planning guides' },
        ]}
        compact
      />
      {section.items.length > 0 ? (
        <div className="cards-grid">
          {section.items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="Travel guides are being prepared"
          description="This guide shelf is ready, but the planning content set is still empty."
          ctaLabel="Back to homepage"
          ctaHref={section.ctaHref ?? '/en'}
          compact
        />
      )}
    </SectionShell>
  );
}
