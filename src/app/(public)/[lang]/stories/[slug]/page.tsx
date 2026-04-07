import { PublicBreadcrumbs } from '@/components/layout/public-breadcrumbs';
import { PublicInfoCards } from '@/components/layout/public-info-cards';
import { PublicPageHero } from '@/components/layout/public-page-hero';
import { PublicPageSection } from '@/components/layout/public-page-section';
import { PublicRouteFrame } from '@/components/layout/public-route-frame';
import { StoryBodyScaffold } from '@/components/layout/story-body-scaffold';
import { ContentCard } from '@/components/cards/content-card';
import { getPublicStoryDetailViewModel } from '@/lib/server/public-content';

type StoryDetailPageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { lang, slug } = await params;
  const detail = await getPublicStoryDetailViewModel(lang, slug);
  const story = detail.story;
  const relatedStories = detail.relatedStories;
  const hasStory = Boolean(story);

  return (
    <div className="stack-xl">
      <PublicPageHero
        eyebrow={detail.hero.eyebrow}
        title={detail.hero.title}
        description={detail.hero.description}
        metaItems={detail.hero.metaItems}
        note={hasStory ? 'Continue below for the story body, then use related reading to keep planning.' : 'This slug is live in the route tree, but the story content is still unavailable right now.'}
      >
        <PublicBreadcrumbs items={detail.hero.breadcrumbs} />
      </PublicPageHero>

      <PublicPageSection
        title={detail.overviewSectionHeader.title}
        description={detail.overviewSectionHeader.description}
        kicker={detail.overviewSectionHeader.kicker}
        ctaLabel={detail.overviewSectionHeader.ctaLabel}
        ctaHref={detail.overviewSectionHeader.ctaHref}
      >
        <PublicRouteFrame isEmpty={!hasStory} emptyState={detail.overviewEmptyState}>
          <StoryBodyScaffold intro={story?.excerpt ?? 'Placeholder editorial intro.'}>
            <PublicInfoCards items={detail.overviewCards} />
          </StoryBodyScaffold>
        </PublicRouteFrame>
      </PublicPageSection>

      <PublicPageSection
        title={detail.relatedSectionHeader.title}
        description={detail.relatedSectionHeader.description}
        kicker={detail.relatedSectionHeader.kicker}
        ctaLabel={detail.relatedSectionHeader.ctaLabel}
        ctaHref={detail.relatedSectionHeader.ctaHref}
      >
        <PublicRouteFrame
          isEmpty={relatedStories.length === 0}
          emptyState={detail.relatedEmptyState}
          collectionMetaItems={detail.relatedMetaItems}
        >
          <div className="cards-grid">
            {relatedStories.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </PublicRouteFrame>
      </PublicPageSection>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Who this is for</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Is this story right for your trip?</h3>
            <ul aria-label="Who this story is for" style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Great for first-time visitors looking for a simple planning starting point.</li>
              <li>Useful if you want inspiration first and details later.</li>
              <li>Best paired with one practical guide and one ticket shortlist.</li>
              <li>Ideal for sharing with travel companions before making bookings.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Reading tips</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Getting the most from our travel stories</h3>
            <ul aria-label="Reading tips" style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Read the full story before planning — key details often appear near the end.</li>
              <li>Use the related stories section to discover complementary experiences.</li>
              <li>Check our guides section for actionable steps mentioned in this story.</li>
              <li>Save your favorite stories to build a personalized reading list.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>About this story</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>How to get the most out of this guide</h3>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Bookmark this page and check back for updates as conditions change.</li>
              <li>Pair this story with our travel guides for practical planning steps.</li>
              <li>Share with travel companions so everyone is on the same page.</li>
              <li>Explore related stories below for more inspiration.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="section-panel" style={{ marginBottom: 24 }}>
            <p className="card-eyebrow" style={{ marginBottom: 8 }}>Quick note</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', marginTop: 4 }}>Use this story as part of a bigger plan</h3>
            <ul style={{ marginTop: 16, paddingLeft: 20, color: 'var(--muted)', display: 'grid', gap: 8 }}>
              <li>Combine stories, guides, and tickets to build a balanced itinerary.</li>
              <li>Use this article for inspiration, then move into guides for practical details.</li>
              <li>Return to this page later if you need a quick refresher before your trip.</li>
              <li>Share it with companions to align on destinations and priorities.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="container">
          <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)' }}>
            <p className="card-eyebrow">Continue exploring</p>
            <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 2rem)' }}>More stories and guides</h3>
            <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.88)' }}>Browse our full collection of travel stories, guides, and curated recommendations.</p>
            <ul aria-label="Continue exploring actions" style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <li style={{ listStyle: 'none' }}><a href={`/${lang}/guides`} className="site-action-button">Browse all guides</a></li>
              <li style={{ listStyle: 'none' }}><a href={`/${lang}`} className="site-action-link">Back to homepage</a></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
