'use client';

import { useActionState } from 'react';
import { initialAdminCmsWorkflowState, runAdminCmsWorkflowAction } from '@/lib/server/admin-cms-workflow';
import type { AdminCmsModuleViewModel, AdminCmsSubmissionPreset } from '../dashboard/admin-cms-modules';
import { AdminCmsSharedSummaryView, createAdminCmsSharedSummaryViewLens } from './admin-cms-shared-summary-view';

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
};

function humanStatus(raw: string) {
  return statusLabels[raw] ?? raw;
}

function WorkflowSubmitButton({ preset, disabled }: { preset: AdminCmsSubmissionPreset; disabled: boolean }) {
  return (
    <button type="submit" className="admin-button" name="action" value={preset.action} disabled={disabled}>
      <input type="hidden" name="nextStatus" value={preset.nextStatus} />
      {disabled ? 'Saving…' : preset.submitLabel}
    </button>
  );
}

export function AdminCmsWorkflowClient({ module }: { module: AdminCmsModuleViewModel }) {
  const [state, formAction, pending] = useActionState(runAdminCmsWorkflowAction, {
    ...initialAdminCmsWorkflowState,
    moduleKey: module.key,
  });

  const workflowLens = state.sharedSummary
    ? createAdminCmsSharedSummaryViewLens('workflow', state.sharedSummary)
    : null;

  const hasSubmitted = Boolean(state.timestamp);
  const feedbackClassName = `admin-workflow-feedback${state.success ? ' admin-workflow-feedback--success' : ''}${hasSubmitted && !state.success && state.issues.length ? ' admin-workflow-feedback--error' : ''}`;

  return (
    <form action={formAction} className="admin-workflow-form">
      <input type="hidden" name="moduleKey" value={module.key} />

      <div className="admin-workflow-form__grid">
        <label className="admin-workflow-form__field">
          <span>Target item</span>
          <select name="selection" defaultValue={module.listItems[0]?.id ?? ''}>
            {module.listItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <small className="admin-form-hint">Pick the content row you are reviewing before changing workflow status.</small>
          {state.fieldErrors.selection ? <small className="admin-form-error">{state.fieldErrors.selection}</small> : null}
        </label>

        <label className="admin-workflow-form__field admin-workflow-form__field--full">
          <span>Operator note</span>
          <textarea name="note" rows={4} placeholder="Review reason, scheduled intent, publish context…" />
          {state.fieldErrors.note ? <small className="admin-form-error">{state.fieldErrors.note}</small> : null}
        </label>
      </div>

      {state.issues.length ? (
        <div className="admin-form-errors" aria-live="polite">
          <strong>⚠ Action blocked — please fix before retrying:</strong>
          <ul>
            {state.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="admin-workflow-presets">
        {module.submissionPresets.map((preset) => (
          <WorkflowSubmitButton key={preset.action} preset={preset} disabled={pending} />
        ))}
      </div>

      <div className={feedbackClassName} aria-live="polite">
        <div className="admin-workflow-feedback__status">
          {state.success ? (
            <span className="admin-status admin-status--published">✓ Saved</span>
          ) : hasSubmitted && state.issues.length ? (
            <span className="admin-status admin-status--draft">✗ Not saved</span>
          ) : (
            <span className="admin-status admin-status--neutral">Ready</span>
          )}
          <span className={`admin-status admin-status--${state.nextStatus}`}>
            {humanStatus(state.nextStatus)}
          </span>
        </div>
        <strong>{state.success ? `✓ ${state.message}` : state.message}</strong>
        <p>{state.detail}</p>
        {state.timestamp ? (
          <p className="admin-workflow-feedback__timestamp">
            {state.success ? 'Completed' : 'Attempted'} at {new Date(state.timestamp).toLocaleTimeString()}
          </p>
        ) : null}
        {state.sharedSummary && workflowLens ? <AdminCmsSharedSummaryView lens={workflowLens} summary={state.sharedSummary} /> : null}
      </div>
    </form>
  );
}
