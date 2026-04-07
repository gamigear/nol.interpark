import { fetchNavigationBlocks } from '@/lib/server/navigation/repository-db';
import { isPublicChromeLocale, resolveHomePageLocale } from '@/types/home';

export type AdminNavSummaryLink = {
  id: string;
  label: string;
  href: string;
  target?: string;
  badge?: string;
};

export type AdminNavSummaryItem = {
  id: string;
  key: string;
  title: string;
  status: string;
  displayOrder: number;
  linkCount: number;
  publishedAt?: string;
  updatedAt?: string;
  links: AdminNavSummaryLink[];
};

export type AdminNavSummary = {
  items: AdminNavSummaryItem[];
  totalBlocks: number;
  totalLinks: number;
};

export async function getNavigationAdminSummary(
  localeOrIntent: string | 'runtime' | 'tooling' = 'runtime',
  intent: 'runtime' | 'tooling' = 'runtime',
): Promise<AdminNavSummary> {
  const locale =
    typeof localeOrIntent === 'string' && localeOrIntent !== 'runtime' && localeOrIntent !== 'tooling'
      ? localeOrIntent
      : undefined;
  const resolvedIntent = locale ? intent : (localeOrIntent as 'runtime' | 'tooling');
  const snapshot = await fetchNavigationBlocks(
    locale ? (isPublicChromeLocale(locale) ? locale : resolveHomePageLocale(locale)) : resolvedIntent,
    resolvedIntent,
  );

  const items = snapshot.blocks.map((block) => {
    const loc = snapshot.blockLocalizations.find((l) => l.blockId === block.id);
    const blockItems = snapshot.blockItems.filter((i) => i.blockId === block.id);

    return {
      id: block.id,
      key: block.key,
      title: loc?.title || block.key || 'Nav block',
      status: block.status,
      displayOrder: block.displayOrder,
      linkCount: blockItems.length,
      publishedAt: block.publishedAt,
      updatedAt: block.updatedAt,
      links: blockItems.map((item) => {
        const override = item.overrideJson || {};
        return {
          id: item.itemId || item.id,
          label: (override.label as string) || 'Nav item',
          href: (override.href as string) || '#',
          target: (override.target as string) || undefined,
          badge: (override.badge as string) || undefined,
        };
      }),
    };
  });

  return {
    items,
    totalBlocks: items.length,
    totalLinks: snapshot.blockItems.length,
  };
}
