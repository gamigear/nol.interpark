import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ContentCard } from '@/components/cards/content-card';
import { HorizontalCarousel } from '@/components/interactive/horizontal-carousel';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { ContentItem, HomeSection } from '@/types/home';

type EditorialSectionProps = {
  section: HomeSection<ContentItem>;
};

export function EditorialSection({ section }: EditorialSectionProps) {
  return (
    <SectionShell id={section.id}>
      <SectionHeader
        title={section.title}
        description={section.description}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        kicker="Inspiration"
      />
      <PublicMetaList
        items={[
          { label: 'Items', value: String(section.items.length) },
          { label: 'Route', value: section.ctaHref ?? 'Pending' },
          { label: 'Shelf', value: 'Homepage editorial rail' },
        ]}
        compact
      />
      {section.items.length > 0 ? (
        <HorizontalCarousel>
          {section.items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </HorizontalCarousel>
      ) : (
        <PublicEmptyState
          title="Stories will appear here soon"
          description="Editorial framing is ready, but there is no story content to surface yet."
          ctaLabel="See travel guides"
          ctaHref={section.ctaHref ?? '/en/guides'}
          note="This rail will automatically surface published editorial content as soon as stories are available."
          noteTone="muted"
          compact
        />
      )}
    </SectionShell>
  );
}
