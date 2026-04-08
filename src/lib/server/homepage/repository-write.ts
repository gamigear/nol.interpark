import type { Sql, TransactionSql } from 'postgres';
import { getDbClient } from '@/lib/server/db/client';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
} from '@/lib/server/db/schema-types';

export type HomepageWritePayload = {
  page: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export async function saveHomepageSnapshot(
  payload: HomepageWritePayload,
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<void> {
  const sql = getDbClient(intent);
  await sql.begin(async (trx: TransactionSql<any>) => {
    await upsertPage(trx, payload.page);

    if (payload.pageLocalization) {
      await upsertPageLocalization(trx, payload.pageLocalization);
    }

    await trx`
      delete from content_block_items where block_id in (
        select id from content_blocks where page_id = ${payload.page.id}
      )
    `;
    await trx`
      delete from content_block_localizations where block_id in (
        select id from content_blocks where page_id = ${payload.page.id}
      )
    `;
    await trx`
      delete from content_blocks where page_id = ${payload.page.id}
    `;

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

async function upsertPage(trx: TransactionSql<any>, page: PageRecord) {
  await trx`
    insert into pages (id, page_type, slug, status, visibility, published_at, created_at, updated_at, created_by, updated_by)
    values (${page.id}, ${page.pageType}, ${page.slug}, ${page.status}, ${page.visibility}, ${page.publishedAt},
            ${page.createdAt}, ${page.updatedAt || page.createdAt}, ${page.createdBy || null}, ${page.updatedBy || null})
    on conflict (id) do update set
      page_type = excluded.page_type,
      slug = excluded.slug,
      status = excluded.status,
      visibility = excluded.visibility,
      published_at = excluded.published_at,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `;
}

async function upsertPageLocalization(trx: TransactionSql<any>, loc: PageLocalizationRecord) {
  await trx`
    insert into page_localizations (id, page_id, locale_code, title, seo_title, seo_description, canonical_path, created_at, updated_at)
    values (${loc.id}, ${loc.pageId}, ${loc.localeCode}, ${loc.title}, ${loc.seoTitle || null}, ${loc.seoDescription || null},
            ${loc.canonicalPath}, ${loc.createdAt}, ${loc.updatedAt || loc.createdAt})
    on conflict (id) do update set
      title = excluded.title,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      canonical_path = excluded.canonical_path,
      updated_at = excluded.updated_at
  `;
}

async function insertBlock(trx: TransactionSql<any>, block: ContentBlockRecord) {
  await trx`
    insert into content_blocks (id, page_id, block_type, key, status, display_order, variant, settings_json, visibility_rules_json, published_at, created_at, updated_at)
    values (${block.id}, ${block.pageId}, ${block.blockType}, ${block.key}, ${block.status}, ${block.displayOrder}, ${block.variant || null},
            ${block.settingsJson || null}, ${block.visibilityRulesJson || null}, ${block.publishedAt || null},
            ${block.createdAt}, ${block.updatedAt || block.createdAt})
  `;
}

async function insertBlockLocalization(trx: TransactionSql<any>, loc: ContentBlockLocalizationRecord) {
  await trx`
    insert into content_block_localizations (id, block_id, locale_code, eyebrow, title, subtitle, cta_label, cta_href, created_at, updated_at)
    values (${loc.id}, ${loc.blockId}, ${loc.localeCode}, ${loc.eyebrow || null}, ${loc.title || null}, ${loc.subtitle || null},
            ${loc.ctaLabel || null}, ${loc.ctaHref || null}, ${loc.createdAt}, ${loc.updatedAt || loc.createdAt})
  `;
}

async function insertBlockItem(trx: TransactionSql<any>, item: ContentBlockItemRecord) {
  await trx`
    insert into content_block_items (id, block_id, item_type, item_id, display_order, override_json, created_at, updated_at)
    values (${item.id}, ${item.blockId}, ${item.itemType}, ${item.itemId || null}, ${item.displayOrder}, ${item.overrideJson || null},
            ${item.createdAt}, ${item.updatedAt || item.createdAt})
  `;
}
