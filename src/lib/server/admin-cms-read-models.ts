import type {
  AdminCmsModuleKey,
  AdminCmsModuleViewModel,
  AdminCmsStatus,
} from '@/components/admin/dashboard/admin-cms-modules';
import { adminCmsModules } from '@/components/admin/dashboard/admin-cms-modules';
import {
  persistAdminCmsWorkflowMock,
  type AdminCmsSharedSummaryContract,
} from './admin-cms-persistence';
import type { AdminCmsWorkflowValidatedPayload } from './admin-cms-workflow-validation';

export type AdminCmsModuleSummary = {
  key: AdminCmsModuleKey;
  title: string;
  updatedAt: string;
  statusBreakdown: Array<{ label: string; count: number }>;
  sharedSummary: AdminCmsSharedSummaryContract;
};

export type AdminCmsModuleReadModel = {
  module: AdminCmsModuleViewModel;
  summary: AdminCmsModuleSummary;
};

const mockWriteSeeds: Record<AdminCmsModuleKey, AdminCmsWorkflowValidatedPayload> = {
  homepage: {
    moduleKey: 'homepage',
    action: 'schedule',
    nextStatus: 'scheduled',
    selection: 'travel-guides-ar',
    note: 'Schedule travel guides release for tomorrow review window.',
    moduleSpecific: {
      moduleKey: 'homepage',
      locale: 'ar',
      sectionKey: 'travelGuides',
      sectionLabel: 'Travel guides',
    },
  },
  navigation: {
    moduleKey: 'navigation',
    action: 'publish',
    nextStatus: 'published',
    selection: 'primary-nav',
    note: 'Publish header navigation after internal QA sign-off.',
    moduleSpecific: {
      moduleKey: 'navigation',
      placement: 'header',
      href: '/journeys',
      hrefUniqueWithinPlacement: true,
    },
  },
  promos: {
    moduleKey: 'promos',
    action: 'schedule',
    nextStatus: 'scheduled',
    selection: 'ramadan-strip-ar',
    note: 'Schedule promo launch with release window for AR campaign.',
    moduleSpecific: {
      moduleKey: 'promos',
      placementKey: 'homepage-strip',
      ctaTarget: '/campaigns/ramadan',
      scheduleWindow: 'scheduled-window',
    },
  },
};

function summarizeStatuses(module: AdminCmsModuleViewModel) {
  const counts = new Map<AdminCmsStatus['label'], number>();

  for (const item of module.listItems) {
    counts.set(item.status.label, (counts.get(item.status.label) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
}

function buildSummary(moduleKey: AdminCmsModuleKey) {
  const outcome = persistAdminCmsWorkflowMock(mockWriteSeeds[moduleKey]);

  return {
    updatedAt: outcome.sharedSummary.updatedAt,
    sharedSummary: outcome.sharedSummary,
  };
}

export function getAdminCmsModuleSummary(moduleKey: AdminCmsModuleKey): AdminCmsModuleSummary {
  const module = adminCmsModules[moduleKey];
  const built = buildSummary(moduleKey);

  return {
    key: module.key,
    title: module.title,
    updatedAt: built.updatedAt,
    statusBreakdown: summarizeStatuses(module),
    sharedSummary: built.sharedSummary,
  };
}

export function getAdminCmsModuleReadModel(moduleKey: AdminCmsModuleKey): AdminCmsModuleReadModel {
  return {
    module: adminCmsModules[moduleKey],
    summary: getAdminCmsModuleSummary(moduleKey),
  };
}

export function getAdminCmsReadModels() {
  return {
    homepage: getAdminCmsModuleReadModel('homepage'),
    navigation: getAdminCmsModuleReadModel('navigation'),
    promos: getAdminCmsModuleReadModel('promos'),
  } as const;
}
