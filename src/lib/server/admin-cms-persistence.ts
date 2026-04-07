import type { PublishStatus } from '@/lib/server/db/schema-types';
import type {
  AdminCmsModuleKey,
  AdminCmsWorkflowAction,
} from '@/components/admin/dashboard/admin-cms-modules';
import type { AdminCmsWorkflowValidatedPayload } from './admin-cms-workflow-validation';

export type AdminCmsPersistenceRecordSnapshot = {
  recordId: string;
  moduleKey: AdminCmsModuleKey;
  selection: string;
  status: PublishStatus;
  revision: number;
  savedAt: string;
  savedBy: string;
};

export type AdminCmsPersistenceHistoryEntry = {
  id: string;
  action: AdminCmsWorkflowAction;
  status: PublishStatus;
  message: string;
  at: string;
};

export type AdminCmsPersistenceSummaryFragment = {
  recordId: string;
  latestStatus: PublishStatus;
  revisionLabel: string;
  publicationLabel: string;
  revalidationLabel: string;
  latestHistoryLabel: string;
  changedFieldsLabel: string;
  updatedAt: string;
};

export type AdminCmsSummarySemantics = {
  headline: string;
  statusTone: PublishStatus;
  supportingText: string;
  activityText: string;
  changeText: string;
};

export type AdminCmsSummaryRowSemanticKey =
  | 'latest-record'
  | 'latest-status'
  | 'revalidation-targets'
  | 'changed-fields';

export type AdminCmsSummaryLineItem = {
  key: AdminCmsSummaryRowSemanticKey;
  label: string;
  value: string;
  helper: string;
};

export type AdminCmsSharedSummaryContract = {
  updatedAt: string;
  items: AdminCmsSummaryLineItem[];
  semantics: AdminCmsSummarySemantics;
};

export type AdminCmsPersistenceOutcome = {
  kind: 'mock-persistence-outcome';
  placeholder: true;
  record: AdminCmsPersistenceRecordSnapshot;
  history: AdminCmsPersistenceHistoryEntry[];
  writeSummary: string;
  changedFields: string[];
  publication: {
    previousStatus: PublishStatus;
    nextStatus: PublishStatus;
    requiresReview: boolean;
    revalidationTargets: string[];
  };
  summary: AdminCmsPersistenceSummaryFragment;
  semantics: AdminCmsSummarySemantics;
  sharedSummary: AdminCmsSharedSummaryContract;
};

function createRecordId(payload: AdminCmsWorkflowValidatedPayload) {
  return `${payload.moduleKey}:${payload.selection}`;
}

function inferRevision(payload: AdminCmsWorkflowValidatedPayload) {
  return payload.selection.length + payload.note.length + payload.action.length;
}

function changedFieldsForPayload(payload: AdminCmsWorkflowValidatedPayload) {
  switch (payload.moduleSpecific.moduleKey) {
    case 'homepage':
      return ['heroTitle', 'heroDescription', `locale:${payload.moduleSpecific.locale}`];
    case 'navigation':
      return ['placement', 'href', payload.moduleSpecific.placement];
    case 'promos':
      return ['ctaTarget', 'scheduleWindow', payload.moduleSpecific.placementKey];
    default:
      return ['selection', 'note'];
  }
}

function previousStatusForAction(action: AdminCmsWorkflowAction): PublishStatus {
  switch (action) {
    case 'save_draft':
      return 'draft';
    case 'schedule':
      return 'draft';
    case 'publish':
      return 'scheduled';
    case 'archive':
      return 'published';
    default:
      return 'draft';
  }
}

function historyMessages(payload: AdminCmsWorkflowValidatedPayload, at: string) {
  return [
    {
      id: `${payload.selection}-validated`,
      action: payload.action,
      status: payload.nextStatus,
      message: `Validation boundary accepted ${payload.action} for ${payload.selection}.`,
      at,
    },
    {
      id: `${payload.selection}-write`,
      action: payload.action,
      status: payload.nextStatus,
      message: `Mock persistence outcome prepared for ${payload.moduleKey}.`,
      at,
    },
  ] satisfies AdminCmsPersistenceHistoryEntry[];
}

function buildSummaryFragment(
  record: AdminCmsPersistenceRecordSnapshot,
  history: AdminCmsPersistenceHistoryEntry[],
  changedFields: string[],
  publication: AdminCmsPersistenceOutcome['publication'],
): AdminCmsPersistenceSummaryFragment {
  const latestHistory = history[history.length - 1];
  const publicationLabel = publication.requiresReview
    ? `${publication.previousStatus} → ${publication.nextStatus} · review required`
    : `${publication.previousStatus} → ${publication.nextStatus}`;

  return {
    recordId: record.recordId,
    latestStatus: record.status,
    revisionLabel: `Revision ${record.revision} by ${record.savedBy}`,
    publicationLabel,
    revalidationLabel: publication.revalidationTargets.join(', '),
    latestHistoryLabel: latestHistory
      ? `${latestHistory.at} · ${latestHistory.action} · ${latestHistory.message}`
      : 'No history available.',
    changedFieldsLabel: changedFields.join(', '),
    updatedAt: record.savedAt,
  };
}

function buildSummarySemantics(
  payload: AdminCmsWorkflowValidatedPayload,
  summary: AdminCmsPersistenceSummaryFragment,
): AdminCmsSummarySemantics {
  return {
    headline: `${payload.moduleKey} · ${payload.action} → ${payload.nextStatus}`,
    statusTone: payload.nextStatus,
    supportingText: summary.publicationLabel,
    activityText: summary.latestHistoryLabel,
    changeText: summary.changedFieldsLabel,
  };
}

export function toAdminCmsSummaryItems(summary: AdminCmsPersistenceSummaryFragment): AdminCmsSummaryLineItem[] {
  return [
    {
      key: 'latest-record',
      label: 'Latest record',
      value: summary.recordId,
      helper: summary.revisionLabel,
    },
    {
      key: 'latest-status',
      label: 'Latest status',
      value: summary.latestStatus,
      helper: summary.publicationLabel,
    },
    {
      key: 'revalidation-targets',
      label: 'Revalidation targets',
      value: summary.revalidationLabel,
      helper: summary.latestHistoryLabel,
    },
    {
      key: 'changed-fields',
      label: 'Changed fields',
      value: summary.changedFieldsLabel,
      helper: 'Shared summary item normalized from persistence-like workflow output.',
    },
  ];
}

export function createAdminCmsSharedSummaryContract(
  summary: AdminCmsPersistenceSummaryFragment,
  semantics: AdminCmsSummarySemantics,
): AdminCmsSharedSummaryContract {
  return {
    updatedAt: summary.updatedAt,
    items: toAdminCmsSummaryItems(summary),
    semantics,
  };
}

export function persistAdminCmsWorkflowMock(
  payload: AdminCmsWorkflowValidatedPayload,
): AdminCmsPersistenceOutcome {
  const savedAt = new Date().toISOString();
  const recordId = createRecordId(payload);
  const changedFields = changedFieldsForPayload(payload);
  const history = historyMessages(payload, savedAt);
  const publication = {
    previousStatus: previousStatusForAction(payload.action),
    nextStatus: payload.nextStatus,
    requiresReview: payload.action === 'publish' || payload.action === 'archive',
    revalidationTargets: ['/admin/dashboard', `/admin/${payload.moduleKey}`],
  };
  const record = {
    recordId,
    moduleKey: payload.moduleKey,
    selection: payload.selection,
    status: payload.nextStatus,
    revision: inferRevision(payload),
    savedAt,
    savedBy: 'admin-placeholder-operator',
  } satisfies AdminCmsPersistenceRecordSnapshot;
  const summary = buildSummaryFragment(record, history, changedFields, publication);
  const semantics = buildSummarySemantics(payload, summary);

  return {
    kind: 'mock-persistence-outcome',
    placeholder: true,
    record,
    history,
    writeSummary: `Saved ${payload.selection} in ${payload.moduleKey} as ${payload.nextStatus}.`,
    changedFields,
    publication,
    summary,
    semantics,
    sharedSummary: createAdminCmsSharedSummaryContract(summary, semantics),
  };
}
