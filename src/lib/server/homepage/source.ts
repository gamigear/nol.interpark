import { getHomePageData } from '@/lib/mocks/home-data';
import type { HomePageData, HomePageLocale } from '@/types/home';

export type HomepageSeedSourceKind = 'mock-seed';

export type HomepageSeedSnapshot = {
  locale: HomePageLocale;
  source: HomepageSeedSourceKind;
  data: HomePageData;
};

export interface HomepageSeedSource {
  read(locale: HomePageLocale): Promise<HomepageSeedSnapshot>;
}

export function createHomepageSeedSource(): HomepageSeedSource {
  return {
    async read(locale) {
      return {
        locale,
        source: 'mock-seed',
        data: getHomePageData(locale),
      };
    },
  };
}

export async function readHomepageSeed(locale: HomePageLocale): Promise<HomepageSeedSnapshot> {
  return createHomepageSeedSource().read(locale);
}
