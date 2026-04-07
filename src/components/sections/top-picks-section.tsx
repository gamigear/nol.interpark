import { PublicMetaList } from '@/components/layout/public-meta-list';
import { ProductCard } from '@/components/cards/product-card';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import type { HomeSection, ProductItem } from '@/types/home';

type TopPicksSectionProps = {
  section: HomeSection<ProductItem>;
};

export function TopPicksSection({ section }: TopPicksSectionProps) {
  return (
    <SectionShell id={section.id}>
      <SectionHeader
        title={section.title}
        description={section.description}
        ctaLabel={section.ctaLabel}
        ctaHref={section.ctaHref}
        kicker="Curated offers"
      />
      <PublicMetaList
        items={[
          { label: 'Items', value: String(section.items.length) },
          { label: 'Route', value: section.ctaHref ?? 'Pending' },
          { label: 'Shelf', value: 'Homepage curated picks' },
        ]}
        compact
      />
      {section.items.length > 0 ? (
        <div
          className="cards-grid"
          style={{
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {section.items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="Top picks are being curated"
          description="This shelf is ready for merchandising, but there are no curated picks available yet."
          ctaLabel="Browse tickets"
          ctaHref={section.ctaHref ?? '/en/tickets'}
          compact
        />
      )}
    </SectionShell>
  );
}
