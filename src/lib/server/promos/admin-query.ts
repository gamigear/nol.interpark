import { fetchPromoBlocks } from '@/lib/server/promos/repository-db';
import { mapPromosSnapshotToAdminForm, type AdminPromoFormBlock } from '@/lib/server/promos/admin-form';

export type AdminPromosFormData = {
  blocks: AdminPromoFormBlock[];
  totalBlocks: number;
  totalItems: number;
};

export async function getPromosAdminFormData(locale: string, intent: 'runtime' | 'tooling' = 'runtime'): PromiseAdminPromosFormData {
  const snapshot = await fetchPromoBlocks(intent);
  const blocks = mapPromosSnapshotToAdminForm({
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  return {
    blocks,
    totalBlocks: blocks.length,
    totalItems: snapshot.blockItems.length,
  };
}
