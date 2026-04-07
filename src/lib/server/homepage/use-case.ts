import type { ContentBlockItemRecord, ContentBlockLocalizationRecord, ContentBlockRecord, PageLocalizationRecord, PageRecord } from '@/lib/server/db/schema-types';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import { saveHomepageSnapshot, type HomepageWritePayload } from './repository-write';

const ALLOWED_BLOCK_TYPES = new Set(['hero', 'featured_catalog', 'nav_highlight', 'editorial_grid', 'travel_guides', 'promo_banner']);

export async function saveHomepageUseCase(payload: HomepageWritePayload, intent: DatabaseConnectionIntent = 'runtime') {
  validateHomepagePayload(payload);
  await saveHomepageSnapshot(payload, intent);
  return { ok: true } as const;
}

function validateHomepagePayload(payload: HomepageWritePayload) {
  ensureString(payload.page.id, 'page.id');
  ensureString(payload.page.slug, 'page.slug');
  ensureString(payload.page.pageType, 'page.pageType');

  if (payload.pageLocalization) {
    ensureString(payload.pageLocalization.id, 'pageLocalization.id');
    ensureString(payload.pageLocalization.localeCode, 'pageLocalization.localeCode');
    ensureString(payload.pageLocalization.pageId, 'pageLocalization.pageId');
  }

  for (const block of payload.blocks) {
    ensureString(block.id, 'block.id');
    ensureString(block.pageId, 'block.pageId');
    ensureString(block.blockType, 'block.blockType');
    if (!ALLOWED_BLOCK_TYPES.has(block.blockType)) {
      throw new Error(`Unsupported blockType: ${block.blockType}`);
    }
  }

  const blockIds = new Set(payload.blocks.map((b) => b.id));

  for (const loc of payload.blockLocalizations) {
    ensureString(loc.id, 'blockLocalization.id');
    ensureString(loc.blockId, 'blockLocalization.blockId');
    if (!blockIds.has(loc.blockId)) {
      throw new Error(`blockLocalization.blockId not in blocks: ${loc.blockId}`);
    }
  }

  for (const item of payload.blockItems) {
    ensureString(item.id, 'blockItem.id');
    ensureString(item.blockId, 'blockItem.blockId');
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
