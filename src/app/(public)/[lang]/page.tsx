import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { EditorialSection } from '@/components/sections/editorial-section';
import { FeaturedTicketsSection } from '@/components/sections/featured-tickets-section';
import { TopPicksSection } from '@/components/sections/top-picks-section';
import { TravelGuidesSection } from '@/components/sections/travel-guides-section';
import { PromoBannerSection } from '@/components/sections/promo-banner-section';
import { getHomepageViewModel } from '@/lib/server/homepage';
import { getPromosViewModel } from '@/lib/server/promos/query';

export const revalidate = 300;

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

const topBenefits = [
  'Monthly travel benefits',
  'Coupon events',
  'Live promotions',
  'Hotel hot deals',
  'Ticket benefits',
];

const quickCategories = [
  { label: 'Tour deals', href: '#featured-tickets' },
  { label: 'Travel picks', href: '#top-picks' },
  { label: 'Ticket ranking', href: '#editorial' },
  { label: 'Travel guides', href: '#travel-guides' },
];

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const [homepage, promos] = await Promise.all([getHomepageViewModel(lang), getPromosViewModel(lang)]);
  const data = homepage.data;
  const hasPrimaryShelves = data.featuredTickets.items.length > 0 || data.topPicks.items.length > 0;
  const hasEditorialShelves = data.editorial.items.length > 0 || data.travelGuides.items.length > 0;
  const shouldShowEmptyState = !promos && !hasPrimaryShelves && !hasEditorialShelves;

  return (
    <div className="stack-xl">
      <section className="hero" style={{ paddingTop: 20 }}>
        <div className="container">
          <div
            className="section-panel"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              padding: 18,
              borderRadius: 24,
            }}
          >
            {topBenefits.map((item) => (
              <a
                key={item}
                href={`/${lang}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 44,
                  padding: '0 14px',
                  borderRadius: 999,
                  background: 'rgba(17, 24, 39, 0.03)',
                  border: '1px solid rgba(17, 24, 39, 0.08)',
                  fontWeight: 700,
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hero" style={{ paddingTop: 20 }}>
        <div className="container">
          <div className="hero-panel">
            <p className="card-eyebrow">NOL travel & tickets</p>
            <h1>{data.heroTitle}</h1>
            <p>{data.heroDescription}</p>
          </div>
        </div>
      </section>

      <section className="hero" style={{ paddingTop: 12 }}>
        <div className="container">
          <div
            className="section-panel"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              padding: 18,
              borderRadius: 24,
            }}
          >
            {quickCategories.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 48,
                  padding: '0 16px',
                  borderRadius: 18,
                  background: 'rgba(255, 255, 255, 0.88)',
                  border: '1px solid rgba(17, 24, 39, 0.08)',
                  fontWeight: 700,
                }}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {promos ? <PromoBannerSection promo={promos} /> : null}

      <FeaturedTicketsSection section={data.featuredTickets} />
      <TopPicksSection section={data.topPicks} />
      <EditorialSection section={data.editorial} />
      <TravelGuidesSection section={data.travelGuides} />

      {shouldShowEmptyState ? (
        <section className="hero">
          <div className="container">
            <PublicEmptyState
              eyebrow="Homepage content"
              title="Homepage sections are ready for source-backed content"
              description="The homepage route is now wired to DB-backed homepage and promo read paths. Publish homepage blocks in the content tables to replace fallback content with source-backed records."
              ctaLabel="Browse tickets"
              ctaHref={`/${lang}/tickets`}
              note="This fallback only stays visible while promo inventory is empty and the primary homepage shelves are still using source-backed defaults."
              noteTone="muted"
              statusTone="quiet"
              ctaHint="Once content is published, the homepage sections above will replace this fallback automatically."
              compact
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
