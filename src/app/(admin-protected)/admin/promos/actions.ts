'use server';

import { savePromosCommand } from '@/lib/server/promos/use-case';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';

type SaveResult = { ok: true; saved: true; savedBlockCount: number; savedItemCount: number } | { ok: false; error: string };

export async function savePromosAction(_prevState: unknown, formData: FormData): Promise<SaveResult> {
  try {
    const locale = (formData.get('locale') as string) || 'en';
    const intent = (formData.get('intent') as DatabaseConnectionIntent) || 'runtime';
    const now = new Date().toISOString();

    const blocks = collectBlocks(formData, locale, now);
    if (blocks.length === 0) {
      return { ok: false, error: 'No blocks found in form data' };
    }

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

    if (!blockItems.length) {
      return { ok: false, error: 'Each promo save must include at least one item.' };
    }

    const writePayload = {
      blocks: blocks.map(({ _idx, ...rest }) => rest),
      blockLocalizations,
      blockItems,
    };

    const result = await savePromosCommand(writePayload, intent);
    if (!result.ok) return result;
    return {
      ok: true,
      saved: true,
      savedBlockCount: writePayload.blocks.length,
      savedItemCount: writePayload.blockItems.length,
    };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function collectBlocks(formData: FormData, locale: string, now: string) {
  const blocks: Array<{
    _idx: number;
    id: string;
    pageId: string;
    blockType: string;
    key: string;
    status: string;
    displayOrder: number;
    variant: null;
    settingsJson: null;
    visibilityRulesJson: null;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const id = formData.get(`blocks.${i}.id`) as string;
    if (!id) break;

    blocks.push({
      _idx: i,
      id,
      pageId: (formData.get(`blocks.${i}.pageId`) as string) || `homepage-${locale}`,
      blockType: (formData.get(`blocks.${i}.blockType`) as string) || 'promo_banner',
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
  const items: Array<{
    id: string;
    blockId: string;
    itemType: string;
    itemId: string;
    displayOrder: number;
    overrideJson: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }> = [];

  for (let j = 0; j < 50; j++) {
    const itemId = formData.get(`blocks.${blockIdx}.items.${j}.id`) as string;
    if (!itemId) break;

    const headline = formFieldStr(formData, `blocks.${blockIdx}.items.${j}.headline`);
    const ctaHref = formFieldStr(formData, `blocks.${blockIdx}.items.${j}.ctaHref`);

    if (!headline) {
      continue;
    }

    items.push({
      id: `${blockId}-item-${j + 1}`,
      blockId,
      itemType: (formData.get(`blocks.${blockIdx}.items.${j}.itemType`) as string) || 'promo',
      itemId,
      displayOrder: j + 1,
      overrideJson: {
        headline,
        subheadline: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.subheadline`),
        ctaLabel: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.ctaLabel`),
        ctaHref,
        theme: formFieldStr(formData, `blocks.${blockIdx}.items.${j}.theme`),
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
