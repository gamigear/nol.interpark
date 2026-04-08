export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type LocaleDirection = 'ltr' | 'rtl';
export type BlockType =
  | 'hero'
  | 'featured_catalog'
  | 'editorial_grid'
  | 'promo_banner'
  | 'travel_guides'
  | 'nav_highlight';

export type ContentItemType = 'catalog_item' | 'article' | 'promo' | 'manual_link' | 'nav_link';
export type CatalogItemKind = 'ticket' | 'product' | 'activity' | 'experience';
export type ArticleType = 'editorial' | 'travel_guide' | 'listicle' | 'campaign_story';
export type PromoType = 'banner' | 'strip' | 'campaign_card' | 'hero_slide';
export type AdminRoleKey = 'super_admin' | 'editor' | 'translator' | 'analyst';

export type BaseRecord = {
  id: string;
  createdAt: string;
  updatedAt?: string;
};

export type LocalizedFieldRecord = {
  localeCode: string;
};

export type LocaleRecord = BaseRecord & {
  code: string;
  name: string;
  direction: LocaleDirection;
  isDefault: boolean;
  isActive: boolean;
};

export type AdminUserRecord = BaseRecord & {
  email: string;
  name: string;
  avatarUrl?: string;
  status: 'active' | 'invited' | 'disabled';
  lastLoginAt?: string;
};

export type PageRecord = BaseRecord & {
  pageType: 'home' | 'landing' | 'guide_index';
  slug: string;
  status: PublishStatus;
  visibility: 'public' | 'private_preview';
  publishedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};

export type PageLocalizationRecord = BaseRecord &
  LocalizedFieldRecord & {
    pageId: string;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    canonicalPath: string;
  };

export type ContentBlockRecord = BaseRecord & {
  pageId: string;
  blockType: BlockType;
  key: string;
  status: PublishStatus;
  displayOrder: number;
  variant?: string;
  settingsJson?: Record<string, unknown>;
  visibilityRulesJson?: Record<string, unknown>;
  publishedAt?: string;
};

export type ContentBlockLocalizationRecord = BaseRecord &
  LocalizedFieldRecord & {
    blockId: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };

export type ContentBlockItemRecord = BaseRecord & {
  blockId: string;
  itemType: ContentItemType;
  itemId?: string;
  displayOrder: number;
  overrideJson?: Record<string, unknown>;
};
