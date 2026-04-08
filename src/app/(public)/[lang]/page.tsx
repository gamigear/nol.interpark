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

const HOMEPAGE_COPY = {
  en: {
    topBenefits: ['Concert presale', 'Coupon events', 'Live promotions', 'Hotel hot deals', 'Ticket benefits'],
    quickCategories: [
      { label: 'Top tickets', href: '#featured-tickets' },
      { label: 'Top picks', href: '#top-picks' },
      { label: 'This week\'s concert', href: '#editorial' },
      { label: 'Travel guides', href: '#travel-guides' },
    ],
    eyebrow: 'NOL World · All ways to Joy',
    heroTitle: 'Discover Korea\'s latest concerts, pop-ups, and travel moments in one place',
    heroDescription:
      'From K-pop shows and festivals to curated travel ideas, explore a homepage flow shaped to feel closer to the original NOL experience.',
    heroBadgeTitle: 'This week\'s hot concerts',
    heroBadgeText: 'Concerts, pop-ups, and travel perks in one view',
    emptyState: {
      eyebrow: 'Homepage content',
      title: 'Homepage shelves are ready for live content',
      description:
        'This frontend is prepared for production-ready homepage inventory. As content is restored, these rails can be swapped in without changing the customer-facing layout.',
      ctaLabel: 'Browse tickets',
      note:
        'This fallback only appears while promotional inventory and primary shelves are still relying on temporary source data.',
      ctaHint: 'Once live content is restored, the homepage above will reflect it automatically.',
    },
  },
  ko: {
    topBenefits: ['공연 선예매', '쿠폰 이벤트', '실시간 프로모션', '호텔 특가', '티켓 혜택'],
    quickCategories: [
      { label: '인기 티켓', href: '#featured-tickets' },
      { label: '추천 픽', href: '#top-picks' },
      { label: '이번 주 공연', href: '#editorial' },
      { label: '여행 가이드', href: '#travel-guides' },
    ],
    eyebrow: 'NOL World · All ways to Joy',
    heroTitle: '콘서트, 팝업, 페스티벌부터 한국 여행의 최신 소식까지 한 번에 만나보세요',
    heroDescription:
      'K-POP 공연과 전시, 여행 아이디어를 한곳에 모아 원본 NOL 홈페이지와 최대한 비슷한 흐름으로 탐색할 수 있게 구성했습니다.',
    heroBadgeTitle: '이번 주 인기 공연',
    heroBadgeText: '공연 · 팝업 · 여행 혜택을 빠르게 둘러보세요',
    emptyState: {
      eyebrow: '홈 콘텐츠',
      title: '라이브 콘텐츠를 연결할 준비가 완료되었어요',
      description:
        '현재 프론트엔드는 운영용 홈페이지 구조에 맞춰 준비되어 있습니다. 콘텐츠만 연결되면 고객이 익숙한 동일한 레이아웃으로 바로 교체할 수 있습니다.',
      ctaLabel: '티켓 둘러보기',
      note:
        '프로모션과 주요 홈 진열대 데이터가 임시 소스에 의존하는 동안에만 이 안내가 표시됩니다.',
      ctaHint: '라이브 콘텐츠가 복원되면 위 섹션이 자동으로 실제 데이터로 바뀝니다.',
    },
  },
} as const;

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const locale = lang === 'ko' ? 'ko' : 'en';
  const copy = HOMEPAGE_COPY[locale];
  const [homepage, promos] = await Promise.all([getHomepageViewModel(lang), getPromosViewModel(lang)]);
  const data = homepage.data;
  const hasPrimaryShelves = data.featuredTickets.items.length > 0 || data.topPicks.items.length > 0;
  const hasEditorialShelves = data.editorial.items.length > 0 || data.travelGuides.items.length > 0;
  const shouldShowEmptyState = !promos && !hasPrimaryShelves && !hasEditorialShelves;

  return (
    <div className="homepage-stack">
      <section className="homepage-topbar-strip">
        <div className="container">
          <div className="homepage-pill-grid homepage-pill-grid--benefits">
            {copy.topBenefits.map((item) => (
              <a key={item} href={`/${lang}`} className="homepage-pill homepage-pill--soft">
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hero homepage-hero-section">
        <div className="container">
          <div className="hero-panel homepage-hero-panel">
            <div className="homepage-hero-copy">
              <p className="card-eyebrow">{copy.eyebrow}</p>
              <h1>{locale === 'ko' ? copy.heroTitle : data.heroTitle}</h1>
              <p>{locale === 'ko' ? copy.heroDescription : data.heroDescription}</p>
            </div>
            <div className="homepage-hero-media" aria-hidden="true">
              <div className="homepage-hero-orb homepage-hero-orb--primary" />
              <div className="homepage-hero-orb homepage-hero-orb--secondary" />
              <div className="homepage-hero-card">
                <strong>{copy.heroBadgeTitle}</strong>
                <span>{copy.heroBadgeText}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-topbar-strip homepage-topbar-strip--categories">
        <div className="container">
          <div className="homepage-pill-grid homepage-pill-grid--categories">
            {copy.quickCategories.map((item) => (
              <a key={item.href} href={item.href} className="homepage-pill homepage-pill--category">
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {promos ? <PromoBannerSection promo={promos} /> : null}

      <FeaturedTicketsSection section={data.featuredTickets} locale={locale} />
      <TopPicksSection section={data.topPicks} locale={locale} />
      <EditorialSection section={data.editorial} locale={locale} />
      <TravelGuidesSection section={data.travelGuides} locale={locale} />

      {shouldShowEmptyState ? (
        <section className="hero">
          <div className="container">
            <PublicEmptyState
              eyebrow={copy.emptyState.eyebrow}
              title={copy.emptyState.title}
              description={copy.emptyState.description}
              ctaLabel={copy.emptyState.ctaLabel}
              ctaHref={`/${lang}/tickets`}
              note={copy.emptyState.note}
              noteTone="muted"
              statusTone="quiet"
              ctaHint={copy.emptyState.ctaHint}
              compact
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
