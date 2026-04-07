import type { ContentBlockItemRecord, ContentBlockLocalizationRecord, ContentBlockRecord } from '@/lib/server/db/schema-types';

export type AdminPromoFormItem = {
  id: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme?: string;
};

export type AdminPromoFormBlock = {
  id: string;
  key: string;
  status: string;
  displayOrder: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: AdminPromoFormItem[];
};

export function mapPromosSnapshotToAdminForm(params: {
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
}): AdminPromoFormBlock[] {
  const blockLocalizationsByBlockId = new Map(params.blockLocalizations.map((l) => [l.blockId, l]));
  const itemsByBlockId = groupItemsByBlockId(params.blockItems);

  return params.blocks.map((block) => {
    const loc = blockLocalizationsByBlockId.get(block.id);
    const items = (itemsByBlockId.get(block.id) || []).map((item) => mapBlockItemToFormItem(item));

    return {
      id: block.id,
      key: block.key,
      status: block.status,
      displayOrder: block.displayOrder,
      title: loc?.title,
      subtitle: loc?.subtitle,
      ctaLabel: loc?.ctaLabel,
      ctaHref: loc?.ctaHref,
      items,
    };
  });
}

function mapBlockItemToFormItem(item: ContentBlockItemRecord): AdminPromoFormItem {
  const override = item.overrideJson || {};
  return {
    id: item.itemId || item.id,
    headline: asString(override.headline) || 'Promo item',
    subheadline: asOptionalString(override.subheadline),
    ctaLabel: asOptionalString(override.ctaLabel),
    ctaHref: asOptionalString(override.ctaHref),
    theme: asOptionalString(override.theme),
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
