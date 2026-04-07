import { dbRuntime, createDatabaseClientPlaceholder, getDatabaseConnectionString, getDatabaseHealthSnapshot } from '@/lib/server/db';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
} from '@/lib/server/db/schema-types';
import type {
  DatabaseClientPlaceholder,
  DatabaseConnectionIntent,
  DatabaseConfig,
  DatabaseHealthSnapshot,
} from '@/lib/server/db/types';
import type { HomePageData, HomePageLocale } from '@/types/home';
import { fetchHomepageSnapshot } from './repository-db';

export type HomepageDbQueryTables = {
  pages: string;
  pageLocalizations: string;
  contentBlocks: string;
  contentBlockLocalizations: string;
  contentBlockItems: string;
};

export type HomepageDbQueryPlan = {
  locale: HomePageLocale;
  intent: DatabaseConnectionIntent;
  tables: HomepageDbQueryTables;
  filters: {
    pageType: 'home';
    localeCode: HomePageLocale;
    status: 'published';
  };
  orderBy: {
    blocks: 'displayOrder asc';
    blockItems: 'displayOrder asc';
  };
};

export type HomepageDbRuntimeBinding = {
  client: DatabaseClientPlaceholder;
  config: DatabaseConfig;
  health: DatabaseHealthSnapshot;
  connectionString?: string;
};

export type HomepageDbQueryContext = {
  runtime: HomepageDbRuntimeBinding;
  intent: DatabaseConnectionIntent;
  plan: HomepageDbQueryPlan;
};

export type HomepageDbQueryRawResult = {
  page?: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export type HomepageDbQueryResult = HomepageDbQueryRawResult & {
  source: 'db-query';
  diagnostics: {
    clientKind: DatabaseClientPlaceholder['kind'];
    adapter: string;
    note: string;
    intent: DatabaseConnectionIntent;
    runtimeUrlAvailable: boolean;
    tables: HomepageDbQueryTables;
    configured: boolean;
    provider: string;
    branch?: string;
  };
};

export interface HomepageDbQueryReader {
  readHomepageRecords(
    locale: HomePageLocale,
    fallbackData: HomePageData,
    context: HomepageDbQueryContext,
  ): Promise<HomepageDbQueryRawResult>;
}

export interface HomepageDbRecordSource {
  read(
    locale: HomePageLocale,
    fallbackData: HomePageData,
    context: HomepageDbQueryContext,
  ): Promise<HomepageDbQueryRawResult>;
}

export function createHomepageDbQueryTables(): HomepageDbQueryTables {
  return {
    pages: 'pages',
    pageLocalizations: 'page_localizations',
    contentBlocks: 'content_blocks',
    contentBlockLocalizations: 'content_block_localizations',
    contentBlockItems: 'content_block_items',
  };
}

export function createHomepageDbQueryPlan(
  locale: HomePageLocale,
  intent: DatabaseConnectionIntent = 'runtime',
): HomepageDbQueryPlan {
  return {
    locale,
    intent,
    tables: createHomepageDbQueryTables(),
    filters: {
      pageType: 'home',
      localeCode: locale,
      status: 'published',
    },
    orderBy: {
      blocks: 'displayOrder asc',
      blockItems: 'displayOrder asc',
    },
  };
}

export function createHomepageDbRuntimeBinding(
  intent: DatabaseConnectionIntent = 'runtime',
): HomepageDbRuntimeBinding {
  if (intent === 'runtime') {
    return {
      client: createDatabaseClientPlaceholder(intent),
      config: dbRuntime.config,
      health: dbRuntime.health,
      connectionString: dbRuntime.connectionString,
    };
  }

  return {
    client: createDatabaseClientPlaceholder(intent),
    config: dbRuntime.config,
    health: getDatabaseHealthSnapshot(intent),
    connectionString: getDatabaseConnectionString(intent),
  };
}

export function createHomepageDbQueryContext(
  locale: HomePageLocale,
  intent: DatabaseConnectionIntent = 'runtime',
): HomepageDbQueryContext {
  return {
    runtime: createHomepageDbRuntimeBinding(intent),
    intent,
    plan: createHomepageDbQueryPlan(locale, intent),
  };
}

export function createHomepageDbQueryReader(source: HomepageDbRecordSource = createRealSqlHomepageDbRecordSource()): HomepageDbQueryReader {
  return {
    async readHomepageRecords(locale, fallbackData, context) {
      return source.read(locale, fallbackData, context);
    },
  };
}

export function createSyntheticHomepageDbRecordSource(): HomepageDbRecordSource {
  return {
    async read(locale, fallbackData) {
      return createSyntheticHomepageDbQueryRawResult(locale, fallbackData);
    },
  };
}

/**
 * Real SQL record source — delegates to fetchHomepageSnapshot from repository-db.ts.
 * Returns an empty snapshot on error so the adapter falls back to seed/mock data safely.
 */
export function createRealSqlHomepageDbRecordSource(): HomepageDbRecordSource {
  return {
    async read(locale) {
      try {
        const snapshot = await fetchHomepageSnapshot(locale);
        return {
          page: snapshot.page,
          pageLocalization: snapshot.pageLocalization,
          blocks: snapshot.blocks,
          blockLocalizations: snapshot.blockLocalizations,
          blockItems: snapshot.blockItems,
        };
      } catch {
        // DB query failed — return empty result so the adapter uses fallbackData.
        return {
          page: undefined,
          pageLocalization: undefined,
          blocks: [],
          blockLocalizations: [],
          blockItems: [],
        };
      }
    },
  };
}

export async function executeHomepageDbQuery(
  locale: HomePageLocale,
  fallbackData: HomePageData,
  context: HomepageDbQueryContext = createHomepageDbQueryContext(locale),
  reader: HomepageDbQueryReader = createHomepageDbQueryReader(),
): Promise<HomepageDbQueryRawResult> {
  return reader.readHomepageRecords(locale, fallbackData, context);
}

export async function readHomepageDbQuery(
  locale: HomePageLocale,
  fallbackData: HomePageData,
  context: HomepageDbQueryContext = createHomepageDbQueryContext(locale),
  reader: HomepageDbQueryReader = createHomepageDbQueryReader(),
): Promise<HomepageDbQueryResult> {
  const rawResult = await executeHomepageDbQuery(locale, fallbackData, context, reader);

  return {
    source: 'db-query',
    page: rawResult.page,
    pageLocalization: rawResult.pageLocalization,
    blocks: rawResult.blocks,
    blockLocalizations: rawResult.blockLocalizations,
    blockItems: rawResult.blockItems,
    diagnostics: {
      clientKind: context.runtime.client.kind,
      adapter: context.runtime.client.adapter,
      intent: context.intent,
      runtimeUrlAvailable: Boolean(context.runtime.connectionString),
      configured: context.runtime.health.configured,
      provider: context.runtime.health.provider,
      branch: context.runtime.health.branch,
      tables: context.plan.tables,
      note:
        'Default reader là createRealSqlHomepageDbRecordSource (gọi fetchHomepageSnapshot qua postgres driver). Nếu DB không có data hoặc lỗi, source trả empty snapshot → adapter fallback sang seed/mock data. Synthetic source vẫn available để inject khi cần test.',
    },
  };
}

function createSyntheticHomepageDbQueryRawResult(
  locale: HomePageLocale,
  fallbackData: HomePageData,
): HomepageDbQueryRawResult {
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
      blockType: 'nav_highlight' as const,
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

  return {
    page,
    pageLocalization,
    blocks: blockDefinitions.map((definition) => ({
      id: `${pageId}-${definition.storageId}`,
      createdAt,
      updatedAt: createdAt,
      pageId,
      blockType: definition.blockType,
      key: definition.key,
      status: 'published',
      displayOrder: definition.order,
      settingsJson: { enabled: true },
      publishedAt: createdAt,
    })),
    blockLocalizations: blockDefinitions.map((definition) => ({
      id: `${pageId}-${definition.storageId}-localization-${locale}`,
      createdAt,
      updatedAt: createdAt,
      blockId: `${pageId}-${definition.storageId}`,
      localeCode: locale,
      title: definition.title,
      subtitle: definition.subtitle,
      ctaLabel: definition.ctaLabel,
      ctaHref: definition.ctaHref,
    })),
    blockItems: blockDefinitions.flatMap((definition) =>
      definition.items.map((item) => ({
        ...item,
        blockId: `${pageId}-${definition.storageId}`,
      })),
    ),
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
