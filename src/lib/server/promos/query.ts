import { mapPromosSnapshotToViewModel } from '@/lib/server/promos/adapter';
import { fetchPromoBlocks } from '@/lib/server/promos/repository-db';

export async function getPromosViewModel(locale: string) {
  try {
    const snapshot = await fetchPromoBlocks(locale, 'runtime');
    const promos = mapPromosSnapshotToViewModel({
      locale,
      blocks: snapshot.blocks,
      blockLocalizations: snapshot.blockLocalizations,
      blockItems: snapshot.blockItems,
    });

    return promos;
  } catch {
    return undefined;
  }
}
