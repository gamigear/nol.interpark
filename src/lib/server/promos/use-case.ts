import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import { savePromosSnapshot, type PromosWritePayload } from './repository-write';

export type SavePromosResult =
  | { ok: true; savedBlockCount: number; savedItemCount: number; localeCodes: string[] }
  | { ok: false; error: string };

const PROMO_BLOCK_TYPE = 'promo_banner';

export async function savePromosCommand(
  payload: PromosWritePayload,
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<SavePromosResult> {
  try {
    const { blockIds, localeCodes } = validatePromosPayload(payload);
    await savePromosSnapshot(payload, intent);
    const itemCount = payload.blockItems.length;
    return { ok: true, savedBlockCount: blockIds.size, savedItemCount: itemCount, localeCodes: [...localeCodes] };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function validatePromosPayload(payload: PromosWritePayload) {
  if (!payload.blocks.length) {
    throw new Error('Promos requires at least one block');
  }

  const blockIds = new Set<string>();
  const localeCodes = new Set<string>();

  for (const block of payload.blocks) {
    ensureString(block.id, 'block.id');
    ensureString(block.pageId, 'block.pageId');
    ensureString(block.blockType, 'block.blockType');
    if (block.blockType !== PROMO_BLOCK_TYPE) {
      throw new Error(`Promo blockType must be '${PROMO_BLOCK_TYPE}'`);
    }
    blockIds.add(block.id);
  }

  for (const loc of payload.blockLocalizations) {
    ensureString(loc.id, 'blockLocalization.id');
    ensureString(loc.blockId, 'blockLocalization.blockId');
    ensureString(loc.localeCode, 'blockLocalization.localeCode');
    if (!blockIds.has(loc.blockId)) {
      throw new Error(`blockLocalization.blockId not in blocks: ${loc.blockId}`);
    }
    localeCodes.add(loc.localeCode);
  }

  for (const item of payload.blockItems) {
    ensureString(item.id, 'blockItem.id');
    ensureString(item.blockId, 'blockItem.blockId');
    ensureString(item.itemType, 'blockItem.itemType');
    if (!blockIds.has(item.blockId)) {
      throw new Error(`blockItem.blockId not in blocks: ${item.blockId}`);
    }
  }

  return { blockIds, localeCodes };
}

function ensureString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid ${field}`);
  }
}
