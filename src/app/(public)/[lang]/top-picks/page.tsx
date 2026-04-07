import { PublicBreadcrumbs } from '@/components/layout/public-breadcrumbs';
import { PublicPageHero } from '@/components/layout/public-page-hero';
import { PublicPageSection } from '@/components/layout/public-page-section';
import { PublicRouteFrame } from '@/components/layout/public-route-frame';
import { ProductCard } from '@/components/cards/product-card';
import { getPublicListingViewModel } from '@/lib/server/public-content';

type TopPicksListingPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function TopPicksListingPage({ params }: TopPicksListingPageProps) {
  const { lang } = await params;
  const listing = await getPublicListingViewModel(lang, 'top-picks');
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
          introCards={listing.introCards}
          collectionMetaItems={listing.collectionMetaItems}
        >
          <div className="cards-grid">
            {section.items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </PublicRouteFrame>
      </PublicPageSection>
    </div>
  );
}
