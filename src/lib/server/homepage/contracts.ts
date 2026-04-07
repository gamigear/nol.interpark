import type { HomePageLocale } from '@/types/home';

export type HomepageLocaleScope = {
  locale: HomePageLocale;
};

export const HOMEPAGE_REVALIDATE_SECONDS = 300;

export const HOMEPAGE_ADAPTER_PATHS = {
  repositoryAdapter: 'repository-adapter',
} as const;

export type HomepageAdapterPath =
  (typeof HOMEPAGE_ADAPTER_PATHS)[keyof typeof HOMEPAGE_ADAPTER_PATHS];

export const HOMEPAGE_PERSISTENCE_REASONS = {
  mockSeed: 'mock-seed',
  databaseNotConfigured: 'database-not-configured',
  databaseQueryNotImplemented: 'database-query-not-implemented',
  dbLikeRecordsFromSeed: 'db-like-records-from-seed',
  dbQueryPlaceholder: 'db-query-placeholder',
} as const;

export type HomepagePersistenceReason =
  (typeof HOMEPAGE_PERSISTENCE_REASONS)[keyof typeof HOMEPAGE_PERSISTENCE_REASONS];

export const HOMEPAGE_READ_SOURCES = {
  mockPersistence: 'mock-persistence',
  dbLikeRecords: 'db-like-records',
  dbQuery: 'db-query',
} as const;

export type HomepageReadSourceKind =
  (typeof HOMEPAGE_READ_SOURCES)[keyof typeof HOMEPAGE_READ_SOURCES];

export type HomepageReadDiagnostics = {
  dbConfigured: boolean;
  reason: HomepagePersistenceReason;
};

export type HomepageViewModelDiagnostics = HomepageReadDiagnostics & {
  usedFallback: boolean;
  repositorySource: HomepageReadSourceKind;
  adapterPath: HomepageAdapterPath;
};

export type HomepageRepositorySnapshot<TPage, TPageLocalization, TBlock, TBlockLocalization, TBlockItem> = HomepageLocaleScope & {
  source: HomepageReadSourceKind;
  page?: TPage;
  pageLocalization?: TPageLocalization;
  blocks: TBlock[];
  blockLocalizations: TBlockLocalization[];
  blockItems: TBlockItem[];
  diagnostics: HomepageReadDiagnostics;
};
