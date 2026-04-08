import {
  HOMEPAGE_ADAPTER_PATHS,
  HOMEPAGE_REVALIDATE_SECONDS,
  type HomepageViewModelDiagnostics,
} from '@/lib/server/homepage/contracts';
import {
  createHomepageAdapterSource,
  mapHomepageSourceToHomePageData,
  type HomePageAdapterResult,
} from '@/lib/server/homepage/adapter';
import { readHomepagePersistence } from '@/lib/server/homepage/repository';
import type { HomePageData } from '@/types/home';

export type HomepageViewModelResult = HomePageAdapterResult & {
  revalidateSeconds: number;
  diagnostics: HomepageViewModelDiagnostics;
};

export async function getHomepageViewModel(locale: string): Promise<HomepageViewModelResult> {
  const snapshot = await readHomepagePersistence(locale);

  const adapterSource = createHomepageAdapterSource({
    page: snapshot.page,
    pageLocalization: snapshot.pageLocalization,
    blocks: snapshot.blocks,
    blockLocalizations: snapshot.blockLocalizations,
    blockItems: snapshot.blockItems,
  });

  const adaptedResult = mapHomepageSourceToHomePageData(adapterSource, {
    locale: snapshot.locale,
    fallbackData: snapshot.fallbackData,
  });

  return {
    ...adaptedResult,
    revalidateSeconds: HOMEPAGE_REVALIDATE_SECONDS,
    diagnostics: {
      usedFallback: adaptedResult.source !== 'content-blocks',
      repositorySource: snapshot.source,
      dbConfigured: snapshot.diagnostics.dbConfigured,
      reason: snapshot.diagnostics.reason,
      adapterPath: HOMEPAGE_ADAPTER_PATHS.repositoryAdapter,
    },
  };
}

export async function getHomepageData(locale: string): Promise<HomePageData> {
  const result = await getHomepageViewModel(locale);
  return result.data;
}
