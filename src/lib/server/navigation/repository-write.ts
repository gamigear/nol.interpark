import type { Sql } from 'postgres';
import { getDbClient } from '@/lib/server/db/client';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';

export type NavigationWritePayload = {
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export async function saveNavigationSnapshot(
  payload: NavigationWritePayload,
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<void> {
  const sql = getDbClient(intent);

  await sql.begin(async (trx: Sql) => {
    const blockIds = payload.blocks.map((b) => b.id);
    if (blockIds.length) {
      await trx`delete from content_block_items where block_id = any(${blockIds})`;
      await trx`delete from content_block_localizations where block_id = any(${blockIds})`;
      await trx`delete from content_blocks where id = any(${blockIds})`;
    }

    for (const block of payload.blocks) {
      await insertBlock(trx, block);
    }

    for (const loc of payload.blockLocalizations) {
      await insertBlockLocalization(trx, loc);
    }

    for (const item of payload.blockItems) {
      await insertBlockItem(trx, item);
    }
  });
}

async function insertBlock(trx: Sql, block: ContentBlockRecord) {
  await trx`
    insert into content_blocks (id, page_id, block_type, key, status, display_order, variant, settings_json, visibility_rules_json, published_at, created_at, updated_at)
    values (${block.id}, ${block.pageId}, ${block.blockType}, ${block.key}, ${block.status}, ${block.displayOrder}, ${block.variant || null},
            ${block.settingsJson || null}, ${block.visibilityRulesJson || null}, ${block.publishedAt || null},
            ${block.createdAt}, ${block.updatedAt || block.createdAt})
  `;
}

async function insertBlockLocalization(trx: Sql, loc: ContentBlockLocalizationRecord) {
  await trx`
    insert into content_block_localizations (id, block_id, locale_code, eyebrow, title, subtitle, cta_label, cta_href, created_at, updated_at)
    values (${loc.id}, ${loc.blockId}, ${loc.localeCode}, ${loc.eyebrow || null}, ${loc.title || null}, ${loc.subtitle || null},
            ${loc.ctaLabel || null}, ${loc.ctaHref || null}, ${loc.createdAt}, ${loc.updatedAt || loc.createdAt})
  `;
}

async function insertBlockItem(trx: Sql, item: ContentBlockItemRecord) {
  await trx`
    insert into content_block_items (id, block_id, item_type, item_id, display_order, override_json, created_at, updated_at)
    values (${item.id}, ${item.blockId}, ${item.itemType}, ${item.itemId || null}, ${item.displayOrder}, ${item.overrideJson || null},
            ${item.createdAt}, ${item.updatedAt || item.createdAt})
  `;
}
