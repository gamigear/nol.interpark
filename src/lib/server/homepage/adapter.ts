import { getHomePageData } from '@/lib/mocks/home-data';
import type {
  BlockType,
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
  PublishStatus,
} from '@/lib/server/db/schema-types';
import {
  DEFAULT_HOME_PAGE_LOCALE,
  resolveHomePageLocale,
  type ContentItem,
  type HomePageData,
  type HomePageLocale,
  type HomeSection,
  type ProductItem,
  type TicketItem,
} from '@/types/home';

export type HomePageSectionKey = 'featuredTickets' | 'topPicks' | 'editorial' | 'travelGuides';

export type HomePageBlockInput = {
  block: ContentBlockRecord;
  localization?: ContentBlockLocalizationRecord;
  items?: ContentBlockItemRecord[];
};

export type HomePageAdapterSource = {
  page?: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks?: HomePageBlockInput[];
};

export type HomePageAdapterOptions = {
  locale: string;
  fallbackData?: HomePageData;
  now?: Date;
};

export type HomePageAdapterResult = {
  locale: HomePageLocale;
  source: 'mock-fallback' | 'content-blocks';
  data: HomePageData;
  missing: {
    hero: boolean;
    sections: HomePageSectionKey[];
  };
};

type SectionItem = TicketItem | ProductItem | ContentItem;

type SectionDefinition<TItem extends SectionItem> = {
  key: HomePageSectionKey;
  blockType: BlockType;
  preferredKeys: string[];
  fallback: (data: HomePageData) => HomeSection<TItem>;
  mapItems: (items: ContentBlockItemRecord[]) => TItem[];
};

const SECTION_DEFINITIONS: {
  featuredTickets: SectionDefinition<TicketItem>;
  topPicks: SectionDefinition<ProductItem>;
  editorial: SectionDefinition<ContentItem>;
  travelGuides: SectionDefinition<ContentItem>;
} = {
  featuredTickets: {
    key: 'featuredTickets',
    blockType: 'featured_catalog',
    preferredKeys: ['featured-tickets', 'home-featured-tickets'],
    fallback: (data) => data.featuredTickets,
    mapItems: (items) => items.map(mapTicketItemRecord).filter(Boolean),
  },
  topPicks: {
    key: 'topPicks',
    blockType: 'featured_catalog',
    preferredKeys: ['top-picks', 'home-top-picks'],
    fallback: (data) => data.topPicks,
    mapItems: (items) => items.map(mapProductItemRecord).filter(Boolean),
  },
  editorial: {
    key: 'editorial',
    blockType: 'editorial_grid',
    preferredKeys: ['editorial', 'home-editorial'],
    fallback: (data) => data.editorial,
    mapItems: (items) => items.map(mapContentItemRecord).filter(Boolean),
  },
  travelGuides: {
    key: 'travelGuides',
    blockType: 'travel_guides',
    preferredKeys: ['travel-guides', 'home-travel-guides'],
    fallback: (data) => data.travelGuides,
    mapItems: (items) => items.map(mapContentItemRecord).filter(Boolean),
  },
};

export function mapHomepageSourceToHomePageData(
  source: HomePageAdapterSource,
  options: HomePageAdapterOptions,
): HomePageAdapterResult {
  const locale = resolveHomePageLocale(options.locale);
  const fallbackData = options.fallbackData ?? getHomePageData(locale);
  const now = options.now ?? new Date();
  const activeBlocks = (source.blocks ?? []).filter(({ block }) => isBlockRenderable(block, now));

  const heroBlock = findBlockByType(activeBlocks, 'hero');

  const featuredTicketsBlock = findBlockForSection(activeBlocks, SECTION_DEFINITIONS.featuredTickets);
  const topPicksBlock = findBlockForSection(activeBlocks, SECTION_DEFINITIONS.topPicks);
  const editorialBlock = findBlockForSection(activeBlocks, SECTION_DEFINITIONS.editorial);
  const travelGuidesBlock = findBlockForSection(activeBlocks, SECTION_DEFINITIONS.travelGuides);

  const featuredTickets = mapSectionFromBlock({
    definition: SECTION_DEFINITIONS.featuredTickets,
    blockInput: featuredTicketsBlock,
    fallbackData,
  });

  const topPicks = mapSectionFromBlock({
    definition: SECTION_DEFINITIONS.topPicks,
    blockInput: topPicksBlock,
    fallbackData,
  });

  const editorial = mapSectionFromBlock({
    definition: SECTION_DEFINITIONS.editorial,
    blockInput: editorialBlock,
    fallbackData,
  });

  const travelGuides = mapSectionFromBlock({
    definition: SECTION_DEFINITIONS.travelGuides,
    blockInput: travelGuidesBlock,
    fallbackData,
  });

  const data: HomePageData = {
    heroTitle:
      heroBlock?.localization?.title?.trim() ||
      source.pageLocalization?.title?.trim() ||
      fallbackData.heroTitle,
    heroDescription:
      heroBlock?.localization?.subtitle?.trim() ||
      source.pageLocalization?.seoDescription?.trim() ||
      fallbackData.heroDescription,
    featuredTickets,
    topPicks,
    editorial,
    travelGuides,
  };

  const missingSections = (Object.keys(SECTION_DEFINITIONS) as HomePageSectionKey[]).filter((key) => {
    const definition = SECTION_DEFINITIONS[key];
    return !findBlockForSection(activeBlocks, definition);
  });

  return {
    locale,
    source: activeBlocks.length > 0 ? 'content-blocks' : 'mock-fallback',
    data,
    missing: {
      hero: !heroBlock,
      sections: missingSections,
    },
  };
}

export function createHomepageAdapterSource(params: {
  page?: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks?: ContentBlockRecord[];
  blockLocalizations?: ContentBlockLocalizationRecord[];
  blockItems?: ContentBlockItemRecord[];
}): HomePageAdapterSource {
  const blockLocalizationsByBlockId = new Map(
    (params.blockLocalizations ?? []).map((localization) => [localization.blockId, localization]),
  );

  const blockItemsByBlockId = groupItemsByBlockId(params.blockItems ?? []);

  return {
    page: params.page,
    pageLocalization: params.pageLocalization,
    blocks: (params.blocks ?? []).map((block) => ({
      block,
      localization: blockLocalizationsByBlockId.get(block.id),
      items: blockItemsByBlockId.get(block.id) ?? [],
    })),
  };
}

function mapSectionFromBlock<TItem extends SectionItem>({
  definition,
  blockInput,
  fallbackData,
}: {
  definition: SectionDefinition<TItem>;
  blockInput?: HomePageBlockInput;
  fallbackData: HomePageData;
}): HomeSection<TItem> {
  const fallbackSection = definition.fallback(fallbackData);

  if (!blockInput) {
    return fallbackSection;
  }

  const title = blockInput.localization?.title?.trim() || fallbackSection.title;
  const description = blockInput.localization?.subtitle?.trim() || fallbackSection.description;
  const ctaLabel = blockInput.localization?.ctaLabel?.trim() || fallbackSection.ctaLabel;
  const ctaHref = blockInput.localization?.ctaHref?.trim() || fallbackSection.ctaHref;
  const items = definition.mapItems(sortItems(blockInput.items ?? []));

  return {
    id: blockInput.block.key || fallbackSection.id,
    title,
    description,
    ctaLabel,
    ctaHref,
    items: items.length > 0 ? items : fallbackSection.items,
  };
}

function findBlockForSection(blocks: HomePageBlockInput[], definition: SectionDefinition<SectionItem>) {
  const preferredMatch = blocks
    .filter(({ block }) => block.blockType === definition.blockType)
    .find(({ block }) => definition.preferredKeys.includes(block.key));

  if (preferredMatch) {
    return preferredMatch;
  }

  return findBlockByType(blocks, definition.blockType);
}

function findBlockByType(blocks: HomePageBlockInput[], blockType: BlockType) {
  return blocks
    .filter(({ block }) => block.blockType === blockType)
    .sort((left, right) => left.block.displayOrder - right.block.displayOrder)[0];
}

function groupItemsByBlockId(items: ContentBlockItemRecord[]) {
  const itemsByBlockId = new Map<string, ContentBlockItemRecord[]>();

  for (const item of items) {
    const group = itemsByBlockId.get(item.blockId);

    if (group) {
      group.push(item);
    } else {
      itemsByBlockId.set(item.blockId, [item]);
    }
  }

  return itemsByBlockId;
}

function sortItems(items: ContentBlockItemRecord[]) {
  return [...items].sort((left, right) => left.displayOrder - right.displayOrder);
}

function isBlockRenderable(block: ContentBlockRecord, now: Date) {
  if (!isPublishedLikeStatus(block.status)) {
    return false;
  }

  const settings = readBlockSettings(block.settingsJson);

  if (settings.enabled === false) {
    return false;
  }

  if (settings.publishStartAt && new Date(settings.publishStartAt) > now) {
    return false;
  }

  if (settings.publishEndAt && new Date(settings.publishEndAt) < now) {
    return false;
  }

  return true;
}

function isPublishedLikeStatus(status: PublishStatus) {
  return status === 'published' || status === 'scheduled';
}

function readBlockSettings(settingsJson?: Record<string, unknown>) {
  return {
    enabled: asBoolean(settingsJson?.enabled),
    publishStartAt: asString(settingsJson?.publishStartAt),
    publishEndAt: asString(settingsJson?.publishEndAt),
  };
}

function mapTicketItemRecord(item: ContentBlockItemRecord): TicketItem {
  const override = item.overrideJson ?? {};

  return {
    id: item.itemId || item.id,
    title: asString(override.title) || 'Untitled ticket',
    subtitle: asOptionalString(override.subtitle),
    priceLabel: asOptionalString(override.priceLabel),
    badge: asOptionalString(override.badge),
    image: asString(override.image) || fallbackImage('ticket'),
    href: asString(override.href) || '#',
  };
}

function mapProductItemRecord(item: ContentBlockItemRecord): ProductItem {
  const override = item.overrideJson ?? {};

  return {
    id: item.itemId || item.id,
    title: asString(override.title) || 'Untitled product',
    category: asOptionalString(override.category),
    priceLabel: asOptionalString(override.priceLabel),
    description: asOptionalString(override.description) || asOptionalString(override.subtitle),
    image: asString(override.image) || fallbackImage('product'),
    href: asString(override.href) || '#',
  };
}

function mapContentItemRecord(item: ContentBlockItemRecord): ContentItem {
  const override = item.overrideJson ?? {};

  return {
    id: item.itemId || item.id,
    title: asString(override.title) || 'Untitled content',
    excerpt: asOptionalString(override.excerpt) || asOptionalString(override.summary) || asOptionalString(override.description),
    eyebrow: asOptionalString(override.eyebrow),
    image: asString(override.image) || fallbackImage('content'),
    href: asString(override.href) || '#',
  };
}

function fallbackImage(kind: 'ticket' | 'product' | 'content') {
  if (kind === 'ticket') {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80';
  }

  if (kind === 'product') {
    return 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1200&q=80';
  }

  return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function asBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

export function getHomepageMockAdapterResult(locale: string = DEFAULT_HOME_PAGE_LOCALE): HomePageAdapterResult {
  const resolvedLocale = resolveHomePageLocale(locale);

  return {
    locale: resolvedLocale,
    source: 'mock-fallback',
    data: getHomePageData(resolvedLocale),
    missing: {
      hero: true,
      sections: ['featuredTickets', 'topPicks', 'editorial', 'travelGuides'],
    },
  };
}
