import { z } from 'zod';

const promoItemSchema = z.object({
  id: z.string(),
  blockId: z.string(),
  itemType: z.literal('promo'),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  theme: z.string().optional(),
  displayOrder: z.number().int().positive(),
});

const promoBlockSchema = z.object({
  id: z.string(),
  pageId: z.string(),
  blockType: z.literal('promo_banner'),
  key: z.string(),
  status: z.string(),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  items: z.array(promoItemSchema),
});

export const promosFormSchema = z.object({
  locale: z.string().default('en'),
  blocks: z.array(promoBlockSchema),
});
