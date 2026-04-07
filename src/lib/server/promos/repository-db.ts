import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import { getDbClient } from '@/lib/server/db/client';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';
import { resolveHomePageLocale } from '@/types/home';

export type PromosDbSnapshot = {
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export async function fetchPromoBlocks(
  locale: string,
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<PromosDbSnapshot> {
  const sql = getDbClient(intent);
  const resolvedLocale = resolveHomePageLocale(locale);

  const blocks = await sql<ContentBlockRecord[]>`
    select * from content_blocks
    where block_type = 'promo_banner' and status = 'published'
    order by display_order asc
  `;

  const blockIds = blocks.map((b) => b.id);

  const blockLocalizations = blockIds.length
    ? await sql<ContentBlockLocalizationRecord[]>`
        select * from content_block_localizations
        where block_id = any(${blockIds}) and locale_code = ${resolvedLocale}
      `
    : [];

  const blockItems = blockIds.length
    ? await sql<ContentBlockItemRecord[]>`
        select * from content_block_items
        where block_id = any(${blockIds})
        order by display_order asc
      `
    : [];

  return {
    blocks,
    blockLocalizations,
    blockItems,
  };
}
