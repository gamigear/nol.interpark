import type { HomepageDbSnapshot } from './repository-db';
import type { HomepageViewModel } from './view-model';
import { mapHomepageSourceToHomePageData } from './adapter';
import { createHomepageAdapterSource } from './adapter';
import { resolveHomePageLocale } from '@/types/home';
import { mapNavigationSnapshotToViewModel } from '@/lib/server/navigation/adapter';
import { mapPromosSnapshotToViewModel } from '@/lib/server/promos/adapter';

export function mapHomepageSnapshotToViewModel(
  snapshot: HomepageDbSnapshot,
  locale: string,
): HomepageViewModel {
  const resolved = resolveHomePageLocale(locale);

  const adapterSource = createHomepageAdapterSource({
    page: snapshot.page,
    pageLocalization: snapshot.pageLocalization,
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  const adapted = mapHomepageSourceToHomePageData(adapterSource, {
    locale: resolved,
    fallbackData: undefined,
  });

  const navigation = mapNavigationSnapshotToViewModel({
    locale: resolved,
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  const promos = mapPromosSnapshotToViewModel({
    locale: resolved,
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  return {
    locale: resolved,
    hero: {
      title: adapted.data.heroTitle,
      description: adapted.data.heroDescription,
    },
    featuredTickets: adapted.data.featuredTickets,
    topPicks: adapted.data.topPicks,
    editorial: adapted.data.editorial,
    travelGuides: adapted.data.travelGuides,
    navigation,
    promos,
  };
}
