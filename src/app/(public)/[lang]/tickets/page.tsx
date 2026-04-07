import { PublicBreadcrumbs } from '@/components/layout/public-breadcrumbs';
import { PublicPageHero } from '@/components/layout/public-page-hero';
import { PublicPageSection } from '@/components/layout/public-page-section';
import { PublicRouteFrame } from '@/components/layout/public-route-frame';
import { TicketCard } from '@/components/cards/ticket-card';
import { getPublicListingViewModel } from '@/lib/server/public-content';

type TicketsListingPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TicketsListingPage({ params }: TicketsListingPageProps) {
  const { lang } = await params;
  const listing = await getPublicListingViewModel(lang, 'tickets');
  const section = listing.section;
  const sectionHeader = listing.sectionHeader;

  return (
    <div className="stack-xl">
      <PublicPageHero
        eyebrow={listing.hero.eyebrow}
        title={listing.hero.title}
        description={listing.hero.description}
        metaItems={listing.hero.metaItems}
      >
        <PublicBreadcrumbs items={listing.hero.breadcrumbs} />
      </PublicPageHero>

      <PublicPageSection
        title={sectionHeader.title}
        description={sectionHeader.description}
        kicker={sectionHeader.kicker}
        ctaLabel={sectionHeader.ctaLabel}
        ctaHref={sectionHeader.ctaHref}
      >
        <PublicRouteFrame
          isEmpty={section.items.length === 0}
          emptyState={listing.emptyState}
          emptyStateNote="Open tickets first if you already know your dates, or return to the homepage to compare bundles and guidance."
          introCards={listing.introCards}
          collectionMetaItems={listing.collectionMetaItems}
          hideCollectionMeta={section.items.length === 0}
        >
          <div className="cards-grid">
            {section.items.map((item) => (
              <TicketCard key={item.id} item={item} />
            ))}
          </div>
        </PublicRouteFrame>
      </PublicPageSection>
    </div>
  );
}
