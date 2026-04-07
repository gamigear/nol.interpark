'use server';

import { revalidatePath } from 'next/cache';
import type { PublishStatus } from '@/lib/server/db/schema-types';
import type { AdminCmsModuleKey, AdminCmsWorkflowAction } from '@/components/admin/dashboard/admin-cms-modules';
import {
  formatAdminCmsWorkflowIssues,
  validateAdminCmsWorkflowFormData,
  type AdminCmsWorkflowPayload,
  type AdminCmsWorkflowValidationIssue,
  type AdminCmsWorkflowValidatedPayload,
} from './admin-cms-workflow-validation';
import {
  persistAdminCmsWorkflowMock,
  type AdminCmsPersistenceOutcome,
  type AdminCmsSharedSummaryContract,
} from './admin-cms-persistence';

export type AdminCmsWorkflowState = {
  success: boolean;
  moduleKey: AdminCmsModuleKey;
  action: AdminCmsWorkflowAction;
  nextStatus: PublishStatus;
  message: string;
  detail: string;
  revalidatedPaths: string[];
  placeholder: true;
  timestamp: string;
  issues: string[];
  fieldErrors: Partial<
    Record<
      | 'moduleKey'
      | 'action'
      | 'nextStatus'
      | 'selection'
      | 'note'
      | 'moduleSpecific'
      | 'locale'
      | 'sectionKey'
      | 'placement'
      | 'href'
      | 'ctaTarget'
      | 'scheduleWindow',
      string
    >
  >;
  payload?: AdminCmsWorkflowPayload;
  validatedPayload?: AdminCmsWorkflowValidatedPayload;
  persistence?: AdminCmsPersistenceOutcome;
  sharedSummary?: AdminCmsSharedSummaryContract;
};

const moduleRoutes: Record<AdminCmsModuleKey, string> = {
  homepage: '/admin/homepage',
  navigation: '/admin/navigation',
  promos: '/admin/promos',
};

const moduleLabels: Record<AdminCmsModuleKey, string> = {
  homepage: 'Homepage Composer',
  navigation: 'Navigation',
  promos: 'Promos',
};

const actionMessages: Record<AdminCmsWorkflowAction, string> = {
  save_draft: 'Draft changes captured in placeholder workflow.',
  schedule: 'Scheduled release intent captured in placeholder workflow.',
  publish: 'Publish intent captured. Revalidation placeholder triggered.',
  archive: 'Archive intent captured in placeholder workflow.',
};

function emptyFieldErrors(): AdminCmsWorkflowState['fieldErrors'] {
  return {};
}

function issuesToFieldErrors(issues: AdminCmsWorkflowValidationIssue[]) {
  const fieldErrors: AdminCmsWorkflowState['fieldErrors'] = {};

  for (const issue of issues) {
    if (!fieldErrors[issue.field]) {
      fieldErrors[issue.field] = issue.message;
    }
  }

  return fieldErrors;
}

function describeValidatedPayload(validatedPayload: AdminCmsWorkflowValidatedPayload) {
  switch (validatedPayload.moduleSpecific.moduleKey) {
    case 'homepage':
      return `Homepage section ${validatedPayload.moduleSpecific.sectionLabel} (${validatedPayload.moduleSpecific.locale}) ready for ${validatedPayload.action}.`;
    case 'navigation':
      return `Navigation placement ${validatedPayload.moduleSpecific.placement} targeting ${validatedPayload.moduleSpecific.href}.`;
    case 'promos':
      return `Promo placement ${validatedPayload.moduleSpecific.placementKey} using CTA ${validatedPayload.moduleSpecific.ctaTarget}.`;
    default:
      return 'Validated payload accepted.';
  }
}

export async function runAdminCmsWorkflowAction(
  _previousState: AdminCmsWorkflowState | null,
  formData: FormData,
): Promise<AdminCmsWorkflowState> {
  const validation = validateAdminCmsWorkflowFormData(formData);

  if (!validation.success) {
    const fieldErrors = issuesToFieldErrors(validation.issues);

    return {
      ...initialAdminCmsWorkflowState,
      success: false,
      message: 'Workflow submission failed validation.',
      detail: formatAdminCmsWorkflowIssues(validation.issues),
      issues: validation.issues.map((issue) => issue.message),
      fieldErrors,
      timestamp: new Date().toISOString(),
    };
  }

  const validatedPayload = validation.data;
  const route = moduleRoutes[validatedPayload.moduleKey] ?? '/admin';
  const persistence = persistAdminCmsWorkflowMock(validatedPayload);

  revalidatePath(route);
  revalidatePath('/admin/dashboard');

  return {
    success: true,
    moduleKey: validatedPayload.moduleKey,
    action: validatedPayload.action,
    nextStatus: validatedPayload.nextStatus,
    message: `${moduleLabels[validatedPayload.moduleKey]} · ${actionMessages[validatedPayload.action]}`,
    detail: `${describeValidatedPayload(validatedPayload)} ${persistence.writeSummary} Note: ${validatedPayload.note}`,
    revalidatedPaths: [route, '/admin/dashboard'],
    placeholder: true,
    timestamp: new Date().toISOString(),
    issues: [],
    fieldErrors: emptyFieldErrors(),
    payload: {
      moduleKey: validatedPayload.moduleKey,
      action: validatedPayload.action,
      nextStatus: validatedPayload.nextStatus,
      selection: validatedPayload.selection,
      note: validatedPayload.note,
    },
    validatedPayload,
    persistence,
    sharedSummary: persistence.sharedSummary,
  };
}

export const initialAdminCmsWorkflowState: AdminCmsWorkflowState = {
  success: false,
  moduleKey: 'homepage',
  action: 'save_draft',
  nextStatus: 'draft',
  message: 'No workflow action submitted yet.',
  detail: 'Use the placeholder form to simulate save/publish transitions.',
  revalidatedPaths: [],
  placeholder: true,
  timestamp: '',
  issues: [],
  fieldErrors: {},
};
