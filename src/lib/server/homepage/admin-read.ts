import { fetchHomepageSnapshot } from '@/lib/server/homepage/repository-db';

export type AdminHomepageSummaryItem = {
  id: string;
  key: string;
  blockType: string;
  status: string;
  displayOrder: number;
  title: string;
  itemCount: number;
  publishedAt?: string;
  updatedAt?: string;
};

export type AdminHomepageSummary = {
  items: AdminHomepageSummaryItem[];
  totalBlocks: number;
  totalItems: number;
};

export async function getHomepageAdminSummary(
  locale: string,
  intent: 'runtime' | 'tooling' = 'runtime',
): Promise<AdminHomepageSummary> {
  const snapshot = await fetchHomepageSnapshot(locale as any, intent);

  const items = snapshot.blocks.map((block) => {
    const loc = snapshot.blockLocalizations.find((l) => l.blockId === block.id);
    const blockItems = snapshot.blockItems.filter((i) => i.blockId === block.id);

    return {
      id: block.id,
      key: block.key,
      blockType: block.blockType,
      status: block.status,
      displayOrder: block.displayOrder,
      title: loc?.title || block.key || 'Homepage block',
      itemCount: blockItems.length,
      publishedAt: block.publishedAt,
      updatedAt: block.updatedAt,
    };
  });

  return {
    items,
    totalBlocks: items.length,
    totalItems: snapshot.blockItems.length,
  };
}
