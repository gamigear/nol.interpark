import { fetchPromoBlocks } from '@/lib/server/promos/repository-db';

export type AdminPromoSummaryItem = {
  id: string;
  key: string;
  title: string;
  status: string;
  displayOrder: number;
  itemCount: number;
  publishedAt?: string;
  updatedAt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: Array<{
    id: string;
    headline: string;
    ctaLabel?: string;
    ctaHref?: string;
  }>;
};

export type AdminPromosSummary = {
  items: AdminPromoSummaryItem[];
  totalBlocks: number;
  totalItems: number;
};

export async function getPromosAdminSummary(intent: 'runtime' | 'tooling' = 'runtime'): Promise<AdminPromosSummary> {
  const snapshot = await fetchPromoBlocks(intent);

  const items = snapshot.blocks.map((block) => {
    const loc = snapshot.blockLocalizations.find((l) => l.blockId === block.id);
    const blockItems = snapshot.blockItems.filter((i) => i.blockId === block.id);

    return {
      id: block.id,
      key: block.key,
      title: loc?.title || block.key || 'Promo',
      status: block.status,
      displayOrder: block.displayOrder,
      itemCount: blockItems.length,
      publishedAt: block.publishedAt,
      updatedAt: block.updatedAt,
      ctaLabel: loc?.ctaLabel,
      ctaHref: loc?.ctaHref,
      items: blockItems.map((item) => {
        const override = item.overrideJson || {};
        return {
          id: item.itemId || item.id,
          headline: (override.headline as string) || 'Promo item',
          ctaLabel: (override.ctaLabel as string) || undefined,
          ctaHref: (override.ctaHref as string) || undefined,
        };
      }),
    };
  });

  return {
    items,
    totalBlocks: items.length,
    totalItems: snapshot.blockItems.length,
  };
}
