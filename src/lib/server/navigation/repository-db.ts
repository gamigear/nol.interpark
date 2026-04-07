import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import { getDbClient } from '@/lib/server/db/client';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';
import { isPublicChromeLocale, type PublicChromeLocale } from '@/types/home';

export type NavigationDbSnapshot = {
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export async function fetchNavigationBlocks(
  localeOrIntent: string | DatabaseConnectionIntent = 'runtime',
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<NavigationDbSnapshot> {
  const locale: PublicChromeLocale | undefined =
    typeof localeOrIntent === 'string' && isPublicChromeLocale(localeOrIntent)
      ? localeOrIntent
      : undefined;
  const resolvedIntent: DatabaseConnectionIntent =
    locale ? intent : (localeOrIntent as DatabaseConnectionIntent);

  const sql = getDbClient(resolvedIntent);

  const blocks = await sql<ContentBlockRecord[]>`
    select * from content_blocks
    where block_type = 'nav_highlight' and status = 'published'
    order by display_order asc
  `;

  const blockIds = blocks.map((b) => b.id);

  const blockLocalizations = blockIds.length
    ? locale
      ? await sql<ContentBlockLocalizationRecord[]>`
          select * from content_block_localizations
          where block_id = any(${blockIds}) and locale_code in (${locale}, 'en')
        `
      : await sql<ContentBlockLocalizationRecord[]>`
          select * from content_block_localizations
          where block_id = any(${blockIds})
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
