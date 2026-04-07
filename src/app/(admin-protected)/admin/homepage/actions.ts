'use server';

import { saveHomepageUseCase } from '@/lib/server/homepage/use-case';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';

type SaveResult = { ok: true; saved: true } | { ok: false; error: string };

export async function saveHomepageAction(_prevState: unknown, formData: FormData): Promise<SaveResult> {
  try {
    const locale = (formData.get('locale') as string) || 'en';
    const intent = (formData.get('intent') as DatabaseConnectionIntent) || 'runtime';
    const now = new Date().toISOString();

    const pageId = ((formData.get('page.id') as string) || `home-${locale}`).trim();
    const page = {
      id: pageId,
      pageType: 'home' as const,
      slug: (formData.get('page.slug') as string) || 'home',
      status: ((formData.get('page.status') as string) || 'published') as any,
      visibility: ((formData.get('page.visibility') as string) || 'public') as any,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: undefined,
      updatedBy: undefined,
    };

    const pageLocalization = {
      id: `${pageId}-loc-${locale}`,
      pageId,
      localeCode: locale,
      title: (formData.get('page.title') as string) || 'Homepage',
      seoTitle: formFieldStr(formData, 'page.seoTitle'),
      seoDescription: formFieldStr(formData, 'page.seoDescription'),
      canonicalPath: (formData.get('page.canonicalPath') as string) || `/${locale}`,
      createdAt: now,
      updatedAt: now,
    };

    const blocks = collectBlocks(formData, pageId, now);
    const blockLocalizations = blocks.map((b) => ({
      id: `${b.id}-loc-${locale}`,
      blockId: b.id,
      localeCode: locale,
      eyebrow: undefined,
      title: formFieldStr(formData, `blocks.${b._idx}.title`),
      subtitle: formFieldStr(formData, `blocks.${b._idx}.subtitle`),
      ctaLabel: formFieldStr(formData, `blocks.${b._idx}.ctaLabel`),
      ctaHref: formFieldStr(formData, `blocks.${b._idx}.ctaHref`),
      createdAt: now,
      updatedAt: now,
    }));
    const blockItems = blocks.flatMap((b) => collectItems(formData, b._idx, b.id, now));

    const result = await saveHomepageUseCase({
      page,
      pageLocalization,
      blocks: blocks.map(({ _idx, ...rest }) => rest),
      blockLocalizations,
      blockItems,
    }, intent);

    if (!result.ok) return { ok: false, error: 'Save failed' };
    return { ok: true, saved: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function collectBlocks(formData: FormData, pageId: string, now: string) {
  const blocks: Array<any> = [];
  for (let i = 0; i < 50; i++) {
    const id = formData.get(`blocks.${i}.id`) as string;
    if (!id) break;
    blocks.push({
      _idx: i,
      id,
      pageId,
      blockType: (formData.get(`blocks.${i}.blockType`) as string) || 'hero',
      key: (formData.get(`blocks.${i}.key`) as string) || id,
      status: (formData.get(`blocks.${i}.status`) as string) || 'published',
      displayOrder: parseInt((formData.get(`blocks.${i}.displayOrder`) as string) || `${i + 1}`, 10),
      variant: null,
      settingsJson: null,
      visibilityRulesJson: null,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }
  return blocks;
}

function collectItems(formData: FormData, blockIdx: number, blockId: string, now: string) {
  const items: Array<any> = [];
  for (let j = 0; j < 50; j++) {
    const itemId = formData.get(`blocks.${blockIdx}.items.${j}.id`) as string;
    if (!itemId) break;
    items.push({
      id: `${blockId}-item-${j + 1}`,
      blockId,
      itemType: (formData.get(`blocks.${blockIdx}.items.${j}.itemType`) as string) || 'manual_link',
      itemId,
      displayOrder: j + 1,
      overrideJson: {
        title: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.title`),
        subtitle: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.subtitle`),
        href: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.href`),
        image: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.image`),
        badge: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.badge`),
        eyebrow: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.eyebrow`),
        description: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.description`),
      },
      createdAt: now,
      updatedAt: now,
    });
  }
  return items;
}

function formFieldStr(formData: FormData, name: string): string | undefined {
  const val = formData.get(name);
  if (typeof val === 'string' && val.trim().length > 0) return val.trim();
  return undefined;
}
