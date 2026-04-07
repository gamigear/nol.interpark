import { fetchNavigationBlocks } from '@/lib/server/navigation/repository-db';
import { isPublicChromeLocale, resolveHomePageLocale } from '@/types/home';

export type AdminNavFormLink = {
  id: string;
  label: string;
  href: string;
  target: string;
  badge: string;
};

export type AdminNavFormBlock = {
  id: string;
  key: string;
  status: string;
  displayOrder: number;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  links: AdminNavFormLink[];
};

export function mapNavigationSnapshotToAdminForm(params: {
  blocks: any[];
  blockLocalizations: any[];
  blockItems: any[];
}): AdminNavFormBlock[] {
  return params.blocks.map((block) => {
    const loc = params.blockLocalizations.find((l: any) => l.blockId === block.id);
    const items = params.blockItems.filter((i: any) => i.blockId === block.id);

    return {
      id: block.id,
      key: block.key,
      status: block.status || 'draft',
      displayOrder: block.displayOrder ?? 0,
      title: loc?.title || block.key || '',
      ctaLabel: loc?.ctaLabel || '',
      ctaHref: loc?.ctaHref || '',
      links: items.map((item: any) => {
        const override = item.overrideJson || {};
        return {
          id: item.itemId || item.id,
          label: (override.label as string) || '',
          href: (override.href as string) || '',
          target: (override.target as string) || '_self',
          badge: (override.badge as string) || '',
        };
      }),
    };
  });
}

export type AdminNavFormData = {
  blocks: AdminNavFormBlock[];
  totalBlocks: number;
  totalLinks: number;
};

export async function getNavigationAdminFormData(
  locale: string,
  intent: 'runtime' | 'tooling' = 'runtime',
): Promise<AdminNavFormData> {
  const snapshot = await fetchNavigationBlocks(
    isPublicChromeLocale(locale) ? locale : resolveHomePageLocale(locale),
    intent,
  );
  const blocks = mapNavigationSnapshotToAdminForm({
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  return {
    blocks,
    totalBlocks: blocks.length,
    totalLinks: snapshot.blockItems.length,
  };
}
