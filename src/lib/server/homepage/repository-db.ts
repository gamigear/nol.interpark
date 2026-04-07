import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
} from '@/lib/server/db/schema-types';
import { getDbClient } from '@/lib/server/db/client';
import type { HomePageLocale } from '@/types/home';

export type HomepageDbSnapshot = {
  page?: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};

export async function fetchHomepageSnapshot(
  locale: HomePageLocale,
  intent: DatabaseConnectionIntent = 'runtime',
): Promise<HomepageDbSnapshot> {
  const sql = getDbClient(intent);
  const slugCandidates = ['home', `home-${locale}`];

  const page = await sql<PageRecord[]>`
    select * from pages
    where page_type = 'home'
      and status = 'published'
      and slug = any(${slugCandidates})
    order by slug asc
    limit 1
  `;

  if (page.length === 0) {
    return emptySnapshot();
  }

  const pageId = page[0].id;

  const [pageLocalization] = await sql<PageLocalizationRecord[]>`
    select * from page_localizations
    where page_id = ${pageId} and locale_code = ${locale}
    order by created_at desc
    limit 1
  `;

  const blocks = await sql<ContentBlockRecord[]>`
    select * from content_blocks
    where page_id = ${pageId} and status = 'published'
    order by display_order asc
  `;

  const blockIds = blocks.map((b) => b.id);

  const blockLocalizations = blockIds.length
    ? await sql<ContentBlockLocalizationRecord[]>`
        select * from content_block_localizations
        where block_id = any(${blockIds}) and locale_code = ${locale}
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
    page: page[0],
    pageLocalization,
    blocks,
    blockLocalizations,
    blockItems,
  };
}

function emptySnapshot(): HomepageDbSnapshot {
  return {
    page: undefined,
    pageLocalization: undefined,
    blocks: [],
    blockLocalizations: [],
    blockItems: [],
  };
}
