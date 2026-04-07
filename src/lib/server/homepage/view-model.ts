import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
  PageLocalizationRecord,
  PageRecord,
} from '@/lib/server/db/schema-types';
import type { HomePageData, HomePageLocale } from '@/types/home';

export type HomepageSectionViewModel<TItem> = {
  id: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: TItem[];
};

export type HomepageHeroViewModel = {
  title: string;
  description: string;
};

export type HomepageNavigationLink = {
  id: string;
  label: string;
  href: string;
  target?: '_self' | '_blank';
  badge?: string;
};

export type HomepageNavigationViewModel = {
  primary: HomepageNavigationLink[];
  secondary: HomepageNavigationLink[];
};

export type HomepagePromoItem = {
  id: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme?: string;
};

export type HomepagePromoViewModel = HomepageSectionViewModel<HomepagePromoItem>;

export type HomepageViewModel = {
  locale: HomePageLocale;
  hero: HomepageHeroViewModel;
  featuredTickets: HomepageSectionViewModel<HomePageData['featuredTickets']['items'][number]>;
  topPicks: HomepageSectionViewModel<HomePageData['topPicks']['items'][number]>;
  editorial: HomepageSectionViewModel<HomePageData['editorial']['items'][number]>;
  travelGuides: HomepageSectionViewModel<HomePageData['travelGuides']['items'][number]>;
  navigation?: HomepageNavigationViewModel;
  promos?: HomepagePromoViewModel;
};

export type HomepageRecordsSnapshot = {
  page?: PageRecord;
  pageLocalization?: PageLocalizationRecord;
  blocks: ContentBlockRecord[];
  blockLocalizations: ContentBlockLocalizationRecord[];
  blockItems: ContentBlockItemRecord[];
};
