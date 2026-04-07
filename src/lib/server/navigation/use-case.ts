import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';
import { saveNavigationSnapshot, type NavigationWritePayload } from './repository-write';

const NAV_BLOCK_TYPE = 'nav_highlight';

export async function saveNavigationUseCase(payload: NavigationWritePayload, intent: DatabaseConnectionIntent = 'runtime') {
  validateNavigationPayload(payload);
  await saveNavigationSnapshot(payload, intent);
  return { ok: true } as const;
}

function validateNavigationPayload(payload: NavigationWritePayload) {
  if (!payload.blocks.length) {
    throw new Error('Navigation requires at least one block');
  }

  const blockIds = new Set<string>();

  for (const block of payload.blocks) {
    ensureString(block.id, 'block.id');
    ensureString(block.pageId, 'block.pageId');
    ensureString(block.blockType, 'block.blockType');
    if (block.blockType !== NAV_BLOCK_TYPE) {
      throw new Error(`Navigation blockType must be '${NAV_BLOCK_TYPE}'`);
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
  }

  for (const item of payload.blockItems) {
    ensureString(item.id, 'blockItem.id');
    ensureString(item.blockId, 'blockItem.blockId');
    ensureString(item.itemType, 'blockItem.itemType');
    if (!blockIds.has(item.blockId)) {
      throw new Error(`blockItem.blockId not in blocks: ${item.blockId}`);
    }
  }
}

function ensureString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid ${field}`);
  }
}
