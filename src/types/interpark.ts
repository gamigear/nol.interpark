export type InterparkCloneTheme = 'light' | 'dark' | 'accent';
export type InterparkCardRatio = 'poster' | 'square' | 'wide';

export type InterparkLink = {
  id: string;
  label: string;
  href: string;
};

export type InterparkHeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  href?: string;
  ctaLabel?: string;
  badge?: string;
};

export type InterparkCategoryItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  image?: string;
};

export type InterparkRankingItem = {
  id: string;
  rank: number;
  title: string;
  image: string;
  href: string;
  meta?: string;
  badge?: string;
};

export type InterparkRankingBlock = {
  id: string;
  title: string;
  tabs?: InterparkLink[];
  items: InterparkRankingItem[];
};

export type InterparkEventCardItem = {
  id: string;
  title: string;
  image: string;
  href: string;
  venue?: string;
  dateText?: string;
  priceText?: string;
  badge?: string;
  ratio?: InterparkCardRatio;
};

export type InterparkCuratedBlock = {
  id: string;
  title: string;
  subtitle?: string;
  moreLabel?: string;
  moreHref?: string;
  items: InterparkEventCardItem[];
};

export type InterparkPromoBanner = {
  id: string;
  headline: string;
  subheadline?: string;
  image: string;
  mobileImage?: string;
  href?: string;
  ctaLabel?: string;
  theme?: InterparkCloneTheme;
};

export type InterparkBrandItem = {
  id: string;
  label: string;
  href?: string;
  logo?: string;
};

export type InterparkHomePageData = {
  hero: InterparkHeroSlide[];
  categories: InterparkCategoryItem[];
  rankingSections: InterparkRankingBlock[];
  promoBanners: InterparkPromoBanner[];
  curatedSections: InterparkCuratedBlock[];
  brands: InterparkBrandItem[];
};
