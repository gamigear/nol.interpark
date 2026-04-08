import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';
import { resolveHomePageLocale, type HomePageLocale } from '@/types/home';
import type { HomepageNavigationViewModel } from '@/lib/server/homepage/view-model';

function mapNavLinks(blockItems: ContentBlockItemRecord[], blockLocalizations: ContentBlockLocalizationRecord[], locale: HomePageLocale) {
  // Simplified: block items contain overrideJson with label/href/badge; localization may override ctaLabel/ctaHref at block level.
  return [...blockItems]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((item) => {
      const override = item.overrideJson || {};
      return {
        id: item.itemId || item.id,
        label: asString(override.label) || 'Nav item',
        href: asString(override.href) || '#',
        target: asOptionalTarget(override.target),
        badge: asOptionalString(override.badge),
      };
    });
}

export function mapNavigationSnapshotToViewModel(params: {
  locale: string;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
}): HomepageNavigationViewModel | undefined {
  const locale = resolveHomePageLocale(params.locale);
  const navBlocks = params.blocks
    .filter((b) => b.blockType === 'nav_highlight' && b.status === 'published')
    .sort((left, right) => left.displayOrder - right.displayOrder);

  if (navBlocks.length === 0) return undefined;

  // For MVP, take the first nav block as primary; rest as secondary.
  const [primaryBlock, ...secondaryBlocks] = navBlocks;

  const itemsByBlockId = groupItemsByBlockId(params.blockItems);

  const primaryItems = mapNavLinks(itemsByBlockId.get(primaryBlock.id) || [], params.blockLocalizations, locale);
  const secondaryItems = secondaryBlocks.flatMap((block) =>
    mapNavLinks(itemsByBlockId.get(block.id) || [], params.blockLocalizations, locale),
  );

  return {
    primary: primaryItems,
    secondary: secondaryItems,
  };
}

function groupItemsByBlockId(items: ContentBlockItemRecord[]) {
  const map = new Map<string, ContentBlockItemRecord[]>();
  for (const item of items) {
    const list = map.get(item.blockId);
    if (list) list.push(item);
    else map.set(item.blockId, [item]);
  }
  return map;
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function asOptionalTarget(value: unknown) {
  if (value === '_blank' || value === '_self') return value;
  return undefined;
}
