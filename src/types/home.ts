export type Locale = 'en' | 'ar' | 'ko';
export type PublicChromeLocale = Locale;

/**
 * App/runtime locales come from env (`NEXT_PUBLIC_SUPPORTED_LOCALES`) and can be broader
 * than the homepage/public content coverage during the rebuild phase.
 *
 * Current intentional split:
 * - app/runtime defaults: `en`, `ko`
 * - homepage/public content + chrome coverage: `en`, `ko`, `ar`
 */
export type AppRuntimeLocale = string;

export const PUBLIC_CHROME_RTL_LOCALES = ['ar'] as const;
export type PublicChromeRtlLocale = (typeof PUBLIC_CHROME_RTL_LOCALES)[number];

export function isPublicChromeLocale(value: string): value is PublicChromeLocale {
  return value === 'en' || value === 'ar' || value === 'ko';
}

export function isPublicChromeRtlLocale(value: string): value is PublicChromeRtlLocale {
  return PUBLIC_CHROME_RTL_LOCALES.includes(value as PublicChromeRtlLocale);
}

export const HOME_PAGE_LOCALES = ['en', 'ar', 'ko'] as const;
export type HomePageLocale = (typeof HOME_PAGE_LOCALES)[number];
export const DEFAULT_HOME_PAGE_LOCALE: HomePageLocale = 'en';

export function isHomePageLocale(value: string): value is HomePageLocale {
  return HOME_PAGE_LOCALES.includes(value as HomePageLocale);
}

export function resolveHomePageLocale(value: string): HomePageLocale {
  return isHomePageLocale(value) ? value : DEFAULT_HOME_PAGE_LOCALE;
}

export type TicketItem = {
  id: string;
  title: string;
  subtitle?: string;
  priceLabel?: string;
  badge?: string;
  image: string;
  href: string;
};

export type ProductItem = {
  id: string;
  title: string;
  category?: string;
  priceLabel?: string;
  description?: string;
  image: string;
  href: string;
};

export type ContentItem = {
  id: string;
  title: string;
  excerpt?: string;
  eyebrow?: string;
  image: string;
  href: string;
};

export type HomeSection<T> = {
  id: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: T[];
};

export type HomePageData = {
  heroTitle: string;
  heroDescription: string;
  featuredTickets: HomeSection<TicketItem>;
  topPicks: HomeSection<ProductItem>;
  editorial: HomeSection<ContentItem>;
  travelGuides: HomeSection<ContentItem>;
};
