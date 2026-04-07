import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';
import type { HomePageLocale } from '@/types/home';
import type { HomepagePromoViewModel, HomepagePromoItem } from '@/lib/server/homepage/view-model';
import { resolveHomePageLocale } from '@/types/home';

function mapPromoItems(items: ContentBlockItemRecord[]): HomepagePromoItem[] {
  return [...items]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((item) => {
      const override = item.overrideJson || {};
      return {
        id: item.itemId || item.id,
        headline: asString(override.headline) || 'Promo',
        subheadline: asOptionalString(override.subheadline),
        ctaLabel: asOptionalString(override.ctaLabel),
        ctaHref: asOptionalString(override.ctaHref) || '#',
        theme: asOptionalString(override.theme),
      };
    });
}

export function mapPromosSnapshotToViewModel(params: {
  locale: string;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
}): HomepagePromoViewModel | undefined {
  const locale = resolveHomePageLocale(params.locale);
  const promoBlocks = params.blocks
    .filter((b) => b.blockType === 'promo_banner' && b.status === 'published')
    .sort((left, right) => left.displayOrder - right.displayOrder);
  if (promoBlocks.length === 0) return undefined;

  const blockLocalizationsByBlockId = new Map(params.blockLocalizations.map((l) => [l.blockId, l]));
  const itemsByBlockId = groupItemsByBlockId(params.blockItems);

  // Take the first promo block as primary for MVP
  const promoBlock = promoBlocks[0];
  const localization = blockLocalizationsByBlockId.get(promoBlock.id);
  const items = mapPromoItems(itemsByBlockId.get(promoBlock.id) || []);

  return {
    id: promoBlock.key || promoBlock.id,
    title: localization?.title || 'Promos',
    description: localization?.subtitle,
    ctaLabel: localization?.ctaLabel,
    ctaHref: localization?.ctaHref,
    items,
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
