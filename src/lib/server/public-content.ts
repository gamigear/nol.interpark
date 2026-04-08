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
  return { label: 'Home', href: `/${locale}` };
}

function createPublicSourceMetaItem(): PublicMetaItem {
  return { label: 'Source', value: PUBLIC_READ_SOURCE_LABEL };
}

export type PublicReadinessKind = PublicListingKind | 'story-detail';

function createPublicReadinessMetaItem(kind: PublicReadinessKind): PublicMetaItem {
  return {
    label: 'Status',
    value: kind === 'story-detail' ? 'Story detail ready for CMS read' : `${kind} listing ready for CMS read`,
  };
}

function createPublicBoundaryMetaItems(params: {
  kind: PublicListingKind | 'story-detail' | 'related-reading';
  count: number;
  route?: string;
  cta?: string;
}): PublicMetaItem[] {
  const items: PublicMetaItem[] = [{ label: 'Count', value: String(params.count) }];

  if (params.route) {
    items.push({ label: 'Route', value: params.route });
  }

  if (params.cta) {
    items.push({ label: 'CTA', value: params.cta });
  }

  items.push(createPublicSourceMetaItem());
  items.push(
    createPublicReadinessMetaItem(
      params.kind === 'related-reading' ? 'story-detail' : params.kind,
    ),
  );

  return items;
}

function createListingMetaItems(section: HomeSection<unknown>, kind: PublicListingKind): PublicMetaItem[] {
  return createPublicBoundaryMetaItems({
    kind,
    count: section.items.length,
    route: section.ctaHref ?? 'Pending',
  });
}

function createListingIntroCards(kind: PublicListingKind): PublicInfoCard[] {
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
      metaItems: createListingMetaItems(section, kind),
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
    introCards: createListingIntroCards(kind),
    collectionMetaItems: createPublicBoundaryMetaItems({
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
  const story = source.data.editorial.items.find((item) => item.href.endsWith(`/${slug}`)) ?? null;
  const hasStory = Boolean(story);

  return {
    locale: source.locale,
    story,
    relatedStories: source.data.travelGuides.items.slice(0, 3),
    homepage: source.data,
    diagnostics: source.diagnostics,
    hero: {
      eyebrow: 'Story detail',
      title: story ? story.title : 'Story is being prepared',
      description: story
        ? story.excerpt ?? 'Thin editorial detail placeholder built for public route-tree expansion.'
        : 'This route is live, but the requested editorial item is not available yet.',
      breadcrumbs: [
        createHomeBreadcrumb(source.locale),
        { label: 'Stories', href: `/${source.locale}/stories/dubai-first-timer-guide` },
        { label: hasStory ? story.title : 'Unavailable story' },
      ],
      metaItems: createPublicBoundaryMetaItems({
        kind: 'story-detail',
        count: source.data.travelGuides.items.slice(0, 3).length,
        route: slug,
      }),
    },
    overviewSectionHeader: {
      title: 'Article overview',
      description: 'This upgraded placeholder adds a clearer reading body, contextual notes, and stronger internal linking.',
      kicker: hasStory ? story?.eyebrow ?? 'Editorial' : 'Content status',
      ctaLabel: 'Browse all guides',
      ctaHref: `/${source.locale}/guides`,
    },
    relatedSectionHeader: {
      title: 'Related reading',
      description: 'Reused cards keep the detail page visually aligned with the current clone while giving users a next step.',
      kicker: 'Keep exploring',
      ctaLabel: 'View guides',
      ctaHref: `/${source.locale}/guides`,
    },
    overviewCards: [
      {
        title: 'Read path',
        description: 'This detail page now resolves story content through the shared public server seam on top of the homepage view-model.',
      },
      {
        title: 'Slug',
        description: slug,
      },
    ],
    relatedMetaItems: createPublicBoundaryMetaItems({
      kind: 'related-reading',
      count: source.data.travelGuides.items.slice(0, 3).length,
      cta: 'View guides',
    }),
    overviewEmptyState: {
      title: 'This story is not ready yet',
      description: 'The detail route exists, but there is no matching story content for this slug at the moment.',
      ctaLabel: 'Back to stories',
      ctaHref: `/${source.locale}/stories/dubai-first-timer-guide`,
    },
    relatedEmptyState: {
      title: 'Related reading will appear here',
      description: 'There are no related guide cards available yet, but the follow-up shelf is already scaffolded.',
      ctaLabel: 'Browse guides',
      ctaHref: `/${source.locale}/guides`,
    },
  };
}
