import { PublicBreadcrumbs } from '@/components/layout/public-breadcrumbs';
import { PublicPageHero } from '@/components/layout/public-page-hero';
import { PublicPageSection } from '@/components/layout/public-page-section';
import { PublicRouteFrame } from '@/components/layout/public-route-frame';
import { ContentCard } from '@/components/cards/content-card';
import { getPublicListingViewModel } from '@/lib/server/public-content';

type GuidesListingPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function GuidesListingPage({ params }: GuidesListingPageProps) {
  const { lang } = await params;
  const listing = await getPublicListingViewModel(lang, 'guides');
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
          emptyStateNote="Use one guide first, then branch into tickets or stories once your plan is clearer."
          introCards={listing.introCards}
          collectionMetaItems={listing.collectionMetaItems}
          hideCollectionMeta={section.items.length === 0}
        >
          <div className="cards-grid">
            {section.items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </PublicRouteFrame>
      </PublicPageSection>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Guide types</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Choose the guide that fits your trip stage</h3>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Use beginner guides when you are still deciding what to prioritize.</li>
              <li>Open neighborhood guides when you already know where you want to stay or visit.</li>
              <li>Check planning guides before booking transport, tickets, or timed attractions.</li>
              <li>Save evergreen guides for quick reference during the trip itself.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Planning reassurance</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>You don't need to figure it all out today</h3>
            <ul aria-label="Planning reassurance" style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Bookmark this page and come back when you're ready to plan in detail.</li>
              <li>Most guides are evergreen — they stay relevant across seasons.</li>
              <li>Start with one guide and build your itinerary gradually.</li>
              <li>Our ticket picks and stories below can fill in the gaps later.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Before you go</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Quick planning checklist</h3>
            <ul aria-label="Quick planning checklist" style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Check attraction opening hours and booking requirements.</li>
              <li>Save the guides you want to revisit while planning.</li>
              <li>Match your route with transport or ticket options in advance.</li>
              <li>Keep one practical guide open for the day of your trip.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)' }}>
            <p className="card-eyebrow">Need help planning?</p>
            <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 2rem)' }}>Talk to our travel guides</h3>
            <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.88)' }}>Not sure where to start? Browse our curated guides or reach out for personalized trip advice.</p>
            <ul aria-label="Need help planning" style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <li style={{ listStyle: 'none' }}><a href={`/${lang}/stories/dubai-first-timer-guide`} className="site-action-button">Read featured stories</a></li>
              <li style={{ listStyle: 'none' }}><a href={`/${lang}/tickets`} className="site-action-link">Browse tickets</a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>How to use guides</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Making the most of your trip</h3>
            <ul aria-label="How to use guides" style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Start with a first-timer guide if this is your first visit.</li>
              <li>Check neighborhood guides for area-specific recommendations.</li>
              <li>Read planning tips before booking to avoid common mistakes.</li>
              <li>Pair guides with our curated ticket picks for a complete itinerary.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
