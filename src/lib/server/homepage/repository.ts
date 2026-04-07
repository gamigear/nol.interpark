import { dbRuntime } from '@/lib/server/db';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
} from '@/lib/server/db/schema-types';
import { resolveHomePageLocale, type HomePageData, type HomePageLocale } from '@/types/home';
import {
  HOMEPAGE_PERSISTENCE_REASONS,
  HOMEPAGE_READ_SOURCES,
  type HomepageRepositorySnapshot,
} from './contracts';
import { readHomepageDbQuery } from './db-query';
import { fetchHomepageSnapshot } from './repository-db';
import { readHomepageSeed } from './source';

export type HomepagePersistenceSnapshot = HomepageRepositorySnapshot<
  PageRecord,
  PageLocalizationRecord,
  ContentBlockRecord,
  ContentBlockLocalizationRecord,
  ContentBlockItemRecord
> & {
  fallbackData: HomePageData;
};

export interface HomepageReadRepository {
  read(locale: HomePageLocale): Promise<HomepagePersistenceSnapshot>;
}

export async function readHomepagePersistence(locale: string): Promise<HomepagePersistenceSnapshot> {
  const resolvedLocale = resolveHomePageLocale(locale);
  const repository = createHomepageReadRepository();

  return repository.read(resolvedLocale);
}

export function createHomepageReadRepository(): HomepageReadRepository {
  if (dbRuntime.health.configured) {
    return createDbQueryHomepageRepository();
  }

  return createMockHomepageRepository();
}

export function createMockHomepageRepository(): HomepageReadRepository {
  return {
    async read(locale) {
      const seed = await readHomepageSeed(locale);

      return {
        locale,
        source: HOMEPAGE_READ_SOURCES.mockPersistence,
        page: undefined,
        pageLocalization: createFallbackPageLocalization(locale, seed.data),
        blocks: [],
        blockLocalizations: [],
        blockItems: [],
        fallbackData: seed.data,
        diagnostics: {
          dbConfigured: false,
          reason: HOMEPAGE_PERSISTENCE_REASONS.mockSeed,
        },
      };
    },
  };
}

export function createDbQueryHomepageRepository(): HomepageReadRepository {
  return {
    async read(locale) {
      const seed = await readHomepageSeed(locale);

      try {
        // Real SQL-backed query
        const snapshot = await fetchHomepageSnapshot(locale);

        // Nếu DB không có data => fallback synthetic
        if (!snapshot.page && snapshot.blocks.length === 0) {
          return buildSyntheticSnapshot(locale, seed.data, HOMEPAGE_PERSISTENCE_REASONS.databaseQueryNotImplemented);
        }

        return {
          locale,
          source: HOMEPAGE_READ_SOURCES.dbQuery,
          page: snapshot.page,
          pageLocalization: snapshot.pageLocalization,
          blocks: snapshot.blocks,
          blockLocalizations: snapshot.blockLocalizations,
          blockItems: snapshot.blockItems,
          fallbackData: seed.data,
          diagnostics: {
            dbConfigured: true,
            reason: HOMEPAGE_PERSISTENCE_REASONS.dbQueryPlaceholder,
          },
        };
      } catch {
        // DB error (connection, query, etc.) => fallback an toàn
        return buildSyntheticSnapshot(locale, seed.data, HOMEPAGE_PERSISTENCE_REASONS.databaseNotConfigured);
      }
    },
  };
}

function buildSyntheticSnapshot(
  locale: HomePageLocale,
  fallbackData: HomePageData,
  reason: HomepagePersistenceReason,
): HomepagePersistenceSnapshot {
  const recordSet = createDbLikeHomepageRecordSet(locale, fallbackData);
  return {
    locale,
    source: HOMEPAGE_READ_SOURCES.dbLikeRecords,
    ...recordSet,
    fallbackData,
    diagnostics: {
      dbConfigured: false,
      reason,
    },
  };
}

export function createDbLikeHomepageRepository(): HomepageReadRepository {
  return {
    async read(locale) {
      const seed = await readHomepageSeed(locale);
      const recordSet = createDbLikeHomepageRecordSet(locale, seed.data);

      return {
        locale,
        source: HOMEPAGE_READ_SOURCES.dbLikeRecords,
        page: recordSet.page,
        pageLocalization: recordSet.pageLocalization,
        blocks: recordSet.blocks,
        blockLocalizations: recordSet.blockLocalizations,
        blockItems: recordSet.blockItems,
        fallbackData: seed.data,
        diagnostics: {
          dbConfigured: true,
          reason: HOMEPAGE_PERSISTENCE_REASONS.dbLikeRecordsFromSeed,
        },
      };
    },
  };
}

export type HomepageDbLikeRecordSet = Pick<
  HomepagePersistenceSnapshot,
  'page' | 'pageLocalization' | 'blocks' | 'blockLocalizations' | 'blockItems'
>;

export function createDbLikeHomepageRecordSet(
  locale: HomePageLocale,
  fallbackData: HomePageData,
): HomepageDbLikeRecordSet {
  const pageId = `homepage-${locale}`;
  const createdAt = new Date(0).toISOString();

  const page: PageRecord = {
    id: pageId,
    createdAt,
    updatedAt: createdAt,
    pageType: 'home',
    slug: locale === 'en' ? 'home' : `home-${locale}`,
    status: 'published',
    visibility: 'public',
    publishedAt: createdAt,
    createdBy: 'system-seed',
    updatedBy: 'system-seed',
  };

  const pageLocalization: PageLocalizationRecord = {
    id: `${pageId}-localization-${locale}`,
    createdAt,
    updatedAt: createdAt,
    pageId,
    localeCode: locale,
    title: fallbackData.heroTitle,
    seoTitle: fallbackData.heroTitle,
    seoDescription: fallbackData.heroDescription,
    canonicalPath: `/${locale}`,
  };

  const blockDefinitions = [
    {
      blockType: 'hero' as const,
      key: 'hero',
      storageId: 'hero',
      order: 1,
      title: fallbackData.heroTitle,
      subtitle: fallbackData.heroDescription,
      ctaLabel: undefined,
      ctaHref: undefined,
      items: [] as ContentBlockItemRecord[],
    },
    {
      blockType: 'featured_catalog' as const,
      key: fallbackData.featuredTickets.id,
      storageId: 'featured-catalog',
      order: 2,
      title: fallbackData.featuredTickets.title,
      subtitle: fallbackData.featuredTickets.description,
      ctaLabel: fallbackData.featuredTickets.ctaLabel,
      ctaHref: fallbackData.featuredTickets.ctaHref,
      items: fallbackData.featuredTickets.items.map((item, index) =>
        createBlockItemRecord({
          createdAt,
          blockId: `${pageId}-featured-catalog`,
          itemId: item.id,
          itemType: 'catalog_item',
          displayOrder: index + 1,
          overrideJson: {
            title: item.title,
            subtitle: item.subtitle,
            priceLabel: item.priceLabel,
            badge: item.badge,
            image: item.image,
            href: item.href,
          },
        }),
      ),
    },
    {
      blockType: 'featured_catalog' as const,
      key: fallbackData.topPicks.id,
      storageId: 'top-picks',
      order: 3,
      title: fallbackData.topPicks.title,
      subtitle: fallbackData.topPicks.description,
      ctaLabel: fallbackData.topPicks.ctaLabel,
      ctaHref: fallbackData.topPicks.ctaHref,
      items: fallbackData.topPicks.items.map((item, index) =>
        createBlockItemRecord({
          createdAt,
          blockId: `${pageId}-top-picks`,
          itemId: item.id,
          itemType: 'catalog_item',
          displayOrder: index + 1,
          overrideJson: {
            title: item.title,
            category: item.category,
            priceLabel: item.priceLabel,
            description: item.description,
            image: item.image,
            href: item.href,
          },
        }),
      ),
    },
    {
      blockType: 'editorial_grid' as const,
      key: fallbackData.editorial.id,
      storageId: 'editorial',
      order: 4,
      title: fallbackData.editorial.title,
      subtitle: fallbackData.editorial.description,
      ctaLabel: fallbackData.editorial.ctaLabel,
      ctaHref: fallbackData.editorial.ctaHref,
      items: fallbackData.editorial.items.map((item, index) =>
        createBlockItemRecord({
          createdAt,
          blockId: `${pageId}-editorial`,
          itemId: item.id,
          itemType: 'article',
          displayOrder: index + 1,
          overrideJson: {
            title: item.title,
            excerpt: item.excerpt,
            eyebrow: item.eyebrow,
            image: item.image,
            href: item.href,
          },
        }),
      ),
    },
    {
      blockType: 'travel_guides' as const,
      key: fallbackData.travelGuides.id,
      storageId: 'travel-guides',
      order: 5,
      title: fallbackData.travelGuides.title,
      subtitle: fallbackData.travelGuides.description,
      ctaLabel: fallbackData.travelGuides.ctaLabel,
      ctaHref: fallbackData.travelGuides.ctaHref,
      items: fallbackData.travelGuides.items.map((item, index) =>
        createBlockItemRecord({
          createdAt,
          blockId: `${pageId}-travel-guides`,
          itemId: item.id,
          itemType: 'article',
          displayOrder: index + 1,
          overrideJson: {
            title: item.title,
            excerpt: item.excerpt,
            eyebrow: item.eyebrow,
            image: item.image,
            href: item.href,
          },
        }),
      ),
    },
  ];

  const blocks: ContentBlockRecord[] = blockDefinitions.map((definition) => ({
    id: `${pageId}-${definition.storageId}`,
    createdAt,
    updatedAt: createdAt,
    pageId,
    blockType: definition.blockType,
    key: definition.key,
    status: 'published',
    displayOrder: definition.order,
    settingsJson: {
      enabled: true,
    },
    publishedAt: createdAt,
  }));

  const blockLocalizations: ContentBlockLocalizationRecord[] = blockDefinitions.map((definition) => ({
    id: `${pageId}-${definition.storageId}-localization-${locale}`,
    createdAt,
    updatedAt: createdAt,
    blockId: `${pageId}-${definition.storageId}`,
    localeCode: locale,
    title: definition.title,
    subtitle: definition.subtitle,
    ctaLabel: definition.ctaLabel,
    ctaHref: definition.ctaHref,
  }));

  const blockItems = blockDefinitions.flatMap((definition) =>
    definition.items.map((item) => ({
      ...item,
      blockId: `${pageId}-${definition.storageId}`,
    })),
  );

  return {
    page,
    pageLocalization,
    blocks,
    blockLocalizations,
    blockItems,
  };
}

function createBlockItemRecord(params: {
  createdAt: string;
  blockId: string;
  itemId: string;
  itemType: ContentBlockItemRecord['itemType'];
  displayOrder: number;
  overrideJson: Record<string, unknown>;
}): ContentBlockItemRecord {
  return {
    id: `${params.blockId}-item-${params.displayOrder}`,
    createdAt: params.createdAt,
    updatedAt: params.createdAt,
    blockId: params.blockId,
    itemId: params.itemId,
    itemType: params.itemType,
    displayOrder: params.displayOrder,
    overrideJson: params.overrideJson,
  };
}

function createFallbackPageLocalization(locale: HomePageLocale, fallbackData: HomePageData): PageLocalizationRecord {
  return {
    id: `homepage-localization-${locale}`,
    createdAt: new Date(0).toISOString(),
    pageId: `homepage-${locale}`,
    localeCode: locale,
    title: fallbackData.heroTitle,
    seoDescription: fallbackData.heroDescription,
    canonicalPath: `/${locale}`,
  };
}
