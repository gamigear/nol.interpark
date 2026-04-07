import { fetchHomepageSnapshot } from '@/lib/server/homepage/repository-db';

export type AdminHomepageFormItem = {
  id: string;
  itemType: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  badge: string;
  description: string;
  eyebrow: string;
};

export type AdminHomepageFormBlock = {
  id: string;
  key: string;
  blockType: string;
  status: string;
  displayOrder: number;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  items: AdminHomepageFormItem[];
};

export type AdminHomepageFormData = {
  page: {
    id: string;
    slug: string;
    status: string;
    visibility: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
    canonicalPath: string;
  };
  blocks: AdminHomepageFormBlock[];
  totalBlocks: number;
  totalItems: number;
};

export async function getHomepageAdminFormData(
  locale: string,
  intent: 'runtime' | 'tooling' = 'runtime',
): Promise<AdminHomepageFormData> {
  const snapshot = await fetchHomepageSnapshot(locale as any, intent);

  const pageId = snapshot.page?.id || `home-${locale}`;
  const page = {
    id: pageId,
    slug: snapshot.page?.slug || 'home',
    status: snapshot.page?.status || 'published',
    visibility: snapshot.page?.visibility || 'public',
    title: snapshot.pageLocalization?.title || 'Homepage',
    seoTitle: snapshot.pageLocalization?.seoTitle || '',
    seoDescription: snapshot.pageLocalization?.seoDescription || '',
    canonicalPath: snapshot.pageLocalization?.canonicalPath || `/${locale}`,
  };

  const blocks = snapshot.blocks.map((block) => {
    const loc = snapshot.blockLocalizations.find((l) => l.blockId === block.id);
    const items = snapshot.blockItems.filter((i) => i.blockId === block.id);

    return {
      id: block.id,
      key: block.key,
      blockType: block.blockType,
      status: block.status,
      displayOrder: block.displayOrder,
      title: loc?.title || '',
      subtitle: loc?.subtitle || '',
      ctaLabel: loc?.ctaLabel || '',
      ctaHref: loc?.ctaHref || '',
      items: items.map((item) => {
        const override = item.overrideJson || {};
        return {
          id: item.itemId || item.id,
          itemType: item.itemType,
          title: (override.title as string) || '',
          subtitle: ((override.subtitle as string) || (override.excerpt as string) || '') as string,
          href: (override.href as string) || '',
          image: (override.image as string) || '',
          badge: (override.badge as string) || '',
          description: (override.description as string) || '',
          eyebrow: (override.eyebrow as string) || '',
        };
      }),
    };
  });

  return {
    page,
    blocks,
    totalBlocks: blocks.length,
    totalItems: snapshot.blockItems.length,
  };
}
