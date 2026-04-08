import { getHomepageViewModel, type HomepageViewModelResult } from '@/lib/server/homepage';
import type { PublicMetaItem } from '@/components/layout/public-meta-list';
import type { PublicRouteEmptyState, PublicRouteHero, PublicRouteSectionHeader } from '@/components/layout/public-route-chrome';
import type { ContentItem, HomePageData, HomeSection, ProductItem, TicketItem } from '@/types/home';

export const PUBLIC_READ_PATHS = {
  homepageViewModel: 'homepage-view-model',
} as const;

export type PublicReadPath = (typeof PUBLIC_READ_PATHS)[keyof typeof PUBLIC_READ_PATHS];

export const PUBLIC_READ_SOURCE_LABEL = 'Homepage view-model seam';

export type PublicListingKind = 'tickets' | 'top-picks' | 'guides';

export type PublicReadDiagnostics = HomepageViewModelResult['diagnostics'] & {
  publicReadPath: PublicReadPath;
};

export type PublicNavItem = {
  label: string;
  href?: string;
};

export type PublicInfoCard = {
  title: string;
  description: string;
};

export type PublicListingViewModel<TItem> = {
  kind: PublicListingKind;
  locale: string;
  section: HomeSection<TItem>;
  homepage: HomePageData;
  diagnostics: PublicReadDiagnostics;
  hero: PublicRouteHero;
  sectionHeader: PublicRouteSectionHeader;
  introCards: PublicInfoCard[];
  collectionMetaItems: PublicMetaItem[];
  emptyState: PublicRouteEmptyState;
};

export type PublicStoryDetailViewModel = {
  locale: string;
  story: ContentItem | null;
  relatedStories: ContentItem[];
  homepage: HomePageData;
  diagnostics: PublicReadDiagnostics;
  hero: PublicRouteHero;
  overviewSectionHeader: PublicRouteSectionHeader;
  relatedSectionHeader: PublicRouteSectionHeader;
  overviewCards: PublicInfoCard[];
  relatedMetaItems: PublicMetaItem[];
  overviewEmptyState: PublicRouteEmptyState;
  relatedEmptyState: PublicRouteEmptyState;
};

const PUBLIC_COPY = {
  en: {
    home: 'Home',
    stories: 'Stories',
    unavailableStory: 'Unavailable story',
    sourceLabel: 'Source',
    countLabel: 'Count',
    routeLabel: 'Route',
    ctaMetaLabel: 'CTA',
    statusLabel: 'Status',
    status: {
      story: 'Story detail ready for CMS read',
      tickets: 'tickets listing ready for CMS read',
      topPicks: 'top-picks listing ready for CMS read',
      guides: 'guides listing ready for CMS read',
    },
  },
  ko: {
    home: '홈',
    stories: '스토리',
    unavailableStory: '준비 중인 스토리',
    sourceLabel: '소스',
    countLabel: '개수',
    routeLabel: '경로',
    ctaMetaLabel: 'CTA',
    statusLabel: '상태',
    status: {
      story: '스토리 상세 페이지가 CMS 읽기 경로에 연결되었습니다',
      tickets: '티켓 리스트가 CMS 읽기 경로에 연결되었습니다',
      topPicks: '추천 픽 리스트가 CMS 읽기 경로에 연결되었습니다',
      guides: '가이드 리스트가 CMS 읽기 경로에 연결되었습니다',
    },
  },
} as const;

function getPublicCopy(locale: string) {
  return locale === 'ko' ? PUBLIC_COPY.ko : PUBLIC_COPY.en;
}

function createPublicReadDiagnostics(homepage: HomepageViewModelResult): PublicReadDiagnostics {
  return {
    ...homepage.diagnostics,
    publicReadPath: PUBLIC_READ_PATHS.homepageViewModel,
  };
}

async function readPublicHomepageSource(locale: string) {
  const homepage = await getHomepageViewModel(locale);

  return {
    locale,
    homepage,
    data: homepage.data,
    diagnostics: createPublicReadDiagnostics(homepage),
  };
}

function createHomeBreadcrumb(locale: string): PublicNavItem {
  const copy = getPublicCopy(locale);
  return { label: copy.home, href: `/${locale}` };
}

function createPublicSourceMetaItem(locale: string): PublicMetaItem {
  const copy = getPublicCopy(locale);
  return { label: copy.sourceLabel, value: PUBLIC_READ_SOURCE_LABEL };
}

export type PublicReadinessKind = PublicListingKind | 'story-detail';

function createPublicReadinessMetaItem(kind: PublicReadinessKind, locale: string): PublicMetaItem {
  const copy = getPublicCopy(locale);
  return {
    label: copy.statusLabel,
    value:
      kind === 'story-detail'
        ? copy.status.story
        : kind === 'tickets'
          ? copy.status.tickets
          : kind === 'top-picks'
            ? copy.status.topPicks
            : copy.status.guides,
  };
}

function createPublicBoundaryMetaItems(params: {
  locale: string;
  kind: PublicListingKind | 'story-detail' | 'related-reading';
  count: number;
  route?: string;
  cta?: string;
}): PublicMetaItem[] {
  const copy = getPublicCopy(params.locale);
  const items: PublicMetaItem[] = [{ label: copy.countLabel, value: String(params.count) }];

  if (params.route) {
    items.push({ label: copy.routeLabel, value: params.route });
  }

  if (params.cta) {
    items.push({ label: copy.ctaMetaLabel, value: params.cta });
  }

  items.push(createPublicSourceMetaItem(params.locale));
  items.push(
    createPublicReadinessMetaItem(
      params.kind === 'related-reading' ? 'story-detail' : params.kind,
      params.locale,
    ),
  );

  return items;
}

function createListingMetaItems(section: HomeSection<unknown>, kind: PublicListingKind, locale: string): PublicMetaItem[] {
  return createPublicBoundaryMetaItems({
    locale,
    kind,
    count: section.items.length,
    route: section.ctaHref ?? 'Pending',
  });
}

function createListingIntroCards(kind: PublicListingKind, locale: string): PublicInfoCard[] {
  if (locale === 'ko') {
    if (kind === 'tickets') {
      return [
        {
          title: '이 라우트가 보여주는 것',
          description: '홈 앵커가 아니라 독립된 티켓 리스트 페이지로도 자연스럽게 동작하도록 정리되었습니다.',
        },
        {
          title: '읽기 경로',
          description: '홈페이지 리포지토리와 어댑터를 재사용하는 공용 서버 경로를 통해 데이터를 읽습니다.',
        },
      ];
    }

    if (kind === 'top-picks') {
      return [
        {
          title: '사용성 개선',
          description: '추천 픽 영역을 더 또렷한 인트로와 섹션 구조로 다듬어 머천다이징 감각을 강화했습니다.',
        },
        {
          title: '읽기 경로',
          description: '추천 픽은 페이지 내부 mock 대신 공용 서버 seam을 통해 읽히도록 정리되었습니다.',
        },
      ];
    }

    return [
      {
        title: '계획형 탐색',
        description: '가이드 카드들은 여행 준비 단계에서 필요한 정보를 먼저 찾게 만드는 구조로 정리되었습니다.',
      },
      {
        title: '읽기 경로',
        description: '가이드 역시 홈 인접 데이터 seam을 통해 읽히므로 이후 홈과 리스트를 함께 정교화하기 좋습니다.',
      },
    ];
  }

  if (kind === 'tickets') {
    return [
      {
        title: 'What this route proves',
        description: 'The public app now supports a standalone tickets listing instead of relying on homepage anchors only.',
      },
      {
        title: 'Read path',
        description: 'This page now reads through the shared public server seam built on top of the homepage repository + adapter path.',
      },
    ];
  }

  if (kind === 'top-picks') {
    return [
      {
        title: 'Usable upgrade',
        description: 'This page now has a clearer intro layer and stronger section framing for merchandising content.',
      },
      {
        title: 'Read path',
        description: 'The picks shelf now reuses the shared public server seam instead of reading mock data directly inside the route.',
      },
    ];
  }

  return [
    {
      title: 'Planning focus',
      description: 'These cards act as a starter information architecture for evergreen travel help content.',
    },
    {
      title: 'Read path',
      description: 'Guides now come through the shared public server seam so this route can converge with homepage-adjacent data access.',
    },
  ];
}

export async function getPublicListingViewModel(
  locale: string,
  kind: 'tickets',
): Promise<PublicListingViewModel<TicketItem>>;
export async function getPublicListingViewModel(
  locale: string,
  kind: 'top-picks',
): Promise<PublicListingViewModel<ProductItem>>;
export async function getPublicListingViewModel(
  locale: string,
  kind: 'guides',
): Promise<PublicListingViewModel<ContentItem>>;
export async function getPublicListingViewModel(locale: string, kind: PublicListingKind) {
  const source = await readPublicHomepageSource(locale);

  const section =
    kind === 'tickets'
      ? source.data.featuredTickets
      : kind === 'top-picks'
        ? source.data.topPicks
        : source.data.travelGuides;

  const eyebrow = kind === 'tickets' ? 'Tickets listing' : kind === 'top-picks' ? 'Curated picks' : 'Travel guides';
  const description =
    kind === 'tickets'
      ? 'Bookable highlights, attraction passes, and transport-friendly placeholders grouped into a cleaner listing scaffold.'
      : kind === 'top-picks'
        ? 'A more polished listing shell for curated offers, bundles, and reusable merchandising blocks.'
        : 'Planning-oriented guide listings with stronger intro framing, breadcrumbs, and a more reusable content shell.';

  return {
    kind,
    locale: source.locale,
    section,
    homepage: source.data,
    diagnostics: source.diagnostics,
    hero: {
      eyebrow,
      title: section.title,
      description,
      breadcrumbs: [createHomeBreadcrumb(source.locale), { label: section.title }],
      metaItems: createListingMetaItems(section, kind, source.locale),
    },
    sectionHeader: {
      title: section.title,
      description: section.description,
      kicker: kind === 'tickets' ? 'Book now' : kind === 'top-picks' ? 'Curated offers' : 'Plan ahead',
      ctaLabel: kind === 'tickets' ? 'Back to homepage' : kind === 'top-picks' ? 'Plan your trip' : 'Browse featured stories',
      ctaHref:
        kind === 'tickets'
          ? `/${source.locale}`
          : kind === 'top-picks'
            ? `/${source.locale}/tickets`
            : `/${source.locale}/stories/dubai-first-timer-guide`,
    },
    introCards: createListingIntroCards(kind, source.locale),
    collectionMetaItems: createPublicBoundaryMetaItems({
      locale: source.locale,
      kind,
      count: section.items.length,
      cta: section.ctaLabel ?? 'Open',
    }),
    emptyState: {
      title:
        kind === 'tickets'
          ? 'No tickets are available yet'
          : kind === 'top-picks'
            ? 'Curated picks will land here soon'
            : 'Guide content is being assembled',
      description:
        kind === 'tickets'
          ? 'This listing route is live, but the ticket collection is still waiting for richer inventory data.'
          : kind === 'top-picks'
            ? 'The route is ready, but no promotional or bundled products are available yet.'
            : 'This planning route is ready, but there are no guides to show yet.',
      ctaLabel: kind === 'tickets' ? 'Back to homepage' : kind === 'top-picks' ? 'Browse tickets' : 'Browse featured stories',
      ctaHref:
        kind === 'tickets'
          ? `/${source.locale}`
          : kind === 'top-picks'
            ? `/${source.locale}/tickets`
            : `/${source.locale}/stories/dubai-first-timer-guide`,
    },
  };
}

export async function getPublicStoryDetailViewModel(
  locale: string,
  slug: string,
): Promise<PublicStoryDetailViewModel> {
  const source = await readPublicHomepageSource(locale);
  const copy = getPublicCopy(source.locale);
  const story = source.data.editorial.items.find((item) => item.href.endsWith(`/${slug}`)) ?? null;
  const hasStory = Boolean(story);

  return {
    locale: source.locale,
    story,
    relatedStories: source.data.travelGuides.items.slice(0, 3),
    homepage: source.data,
    diagnostics: source.diagnostics,
    hero: {
      eyebrow: source.locale === 'ko' ? '스토리 상세' : 'Story detail',
      title: story ? story.title : (source.locale === 'ko' ? '스토리를 준비 중입니다' : 'Story is being prepared'),
      description: story
        ? story.excerpt ?? (source.locale === 'ko' ? '상세 페이지를 위한 기본 에디토리얼 소개 영역입니다.' : 'Thin editorial detail placeholder built for public route-tree expansion.')
        : (source.locale === 'ko' ? '이 라우트는 열려 있지만 요청한 에디토리얼 콘텐츠는 아직 준비되지 않았습니다.' : 'This route is live, but the requested editorial item is not available yet.'),
      breadcrumbs: [
        createHomeBreadcrumb(source.locale),
        { label: copy.stories, href: `/${source.locale}/stories/dubai-first-timer-guide` },
        { label: story ? story.title : copy.unavailableStory },
      ],
      metaItems: createPublicBoundaryMetaItems({
        locale: source.locale,
        kind: 'story-detail',
        count: source.data.travelGuides.items.slice(0, 3).length,
        route: slug,
      }),
    },
    overviewSectionHeader: {
      title: source.locale === 'ko' ? '아티클 개요' : 'Article overview',
      description: source.locale === 'ko'
        ? '더 읽기 쉬운 본문 구조와 맥락 정보, 내부 이동 흐름을 갖춘 디테일 페이지로 정리했습니다.'
        : 'This upgraded placeholder adds a clearer reading body, contextual notes, and stronger internal linking.',
      kicker: hasStory ? story?.eyebrow ?? (source.locale === 'ko' ? '에디토리얼' : 'Editorial') : (source.locale === 'ko' ? '콘텐츠 상태' : 'Content status'),
      ctaLabel: source.locale === 'ko' ? '전체 가이드 보기' : 'Browse all guides',
      ctaHref: `/${source.locale}/guides`,
    },
    relatedSectionHeader: {
      title: source.locale === 'ko' ? '함께 읽기' : 'Related reading',
      description: source.locale === 'ko'
        ? '관련 카드들을 함께 노출해 디테일 페이지에서도 다음 탐색 흐름이 자연스럽게 이어지도록 구성했습니다.'
        : 'Reused cards keep the detail page visually aligned with the current clone while giving users a next step.',
      kicker: source.locale === 'ko' ? '계속 둘러보기' : 'Keep exploring',
      ctaLabel: source.locale === 'ko' ? '가이드 보기' : 'View guides',
      ctaHref: `/${source.locale}/guides`,
    },
    overviewCards: [
      {
        title: source.locale === 'ko' ? '읽기 경로' : 'Read path',
        description: source.locale === 'ko'
          ? '이 상세 페이지는 홈 뷰모델 위의 공용 서버 seam을 통해 스토리 콘텐츠를 읽도록 정리되었습니다.'
          : 'This detail page now resolves story content through the shared public server seam on top of the homepage view-model.',
      },
      {
        title: 'Slug',
        description: slug,
      },
    ],
    relatedMetaItems: createPublicBoundaryMetaItems({
      locale: source.locale,
      kind: 'related-reading',
      count: source.data.travelGuides.items.slice(0, 3).length,
      cta: source.locale === 'ko' ? '가이드 보기' : 'View guides',
    }),
    overviewEmptyState: {
      title: source.locale === 'ko' ? '이 스토리는 아직 준비되지 않았습니다' : 'This story is not ready yet',
      description: source.locale === 'ko'
        ? '상세 라우트는 준비되었지만 현재 slug와 일치하는 스토리 콘텐츠가 없습니다.'
        : 'The detail route exists, but there is no matching story content for this slug at the moment.',
      ctaLabel: source.locale === 'ko' ? '스토리로 돌아가기' : 'Back to stories',
      ctaHref: `/${source.locale}/stories/dubai-first-timer-guide`,
    },
    relatedEmptyState: {
      title: source.locale === 'ko' ? '관련 읽을거리가 곧 표시됩니다' : 'Related reading will appear here',
      description: source.locale === 'ko'
        ? '관련 가이드 카드가 아직 없지만 후속 탐색 영역은 이미 준비되어 있습니다.'
        : 'There are no related guide cards available yet, but the follow-up shelf is already scaffolded.',
      ctaLabel: source.locale === 'ko' ? '가이드 둘러보기' : 'Browse guides',
      ctaHref: `/${source.locale}/guides`,
    },
  };
}
