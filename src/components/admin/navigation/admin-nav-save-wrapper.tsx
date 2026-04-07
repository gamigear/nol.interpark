'use client';

import { useActionState, type ReactNode } from 'react';

type SaveState =
  | { ok: true; saved: true; savedAt?: string; blockCount?: number; linkCount?: number }
  | { ok: false; error: string }
  | null;

type AdminNavSaveWrapperProps = {
  children: ReactNode;
  action: (prevState: unknown, formData: FormData) => Promise<SaveState>;
};

function formatSavedAt(savedAt?: string) {
  if (!savedAt) return undefined;
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return savedAt;
  return date.toLocaleTimeString();
}

export function AdminNavSaveWrapper({ children, action }: AdminNavSaveWrapperProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const savedAt = state?.ok ? formatSavedAt(state.savedAt) : undefined;

  return (
    <form action={formAction} className="admin-module-stack">
      {state && !state.ok ? (
        <div className="admin-alert admin-alert--error" role="alert">
          <strong>Save failed:</strong> {state.error}
          <p>Check required labels, hrefs, and ordering values before saving again.</p>
          <p>Start by fixing the first invalid link so you can retest quickly.</p>
        </div>
      ) : null}
      {state?.ok ? (
        <div className="admin-alert admin-alert--success" role="alert">
          <strong>Navigation saved</strong>
          {savedAt ? <span> at {savedAt}</span> : null}
          {(state.blockCount || state.linkCount) ? (
            <span>
              {' '}
              · {state.blockCount ?? 0} block{state.blockCount === 1 ? '' : 's'} · {state.linkCount ?? 0} link{state.linkCount === 1 ? '' : 's'} saved
            </span>
          ) : null}
          <p>Review the public header and footer after saving to confirm labels still fit and links resolve correctly.</p>
          <p>Public readiness check: make sure any updated link still points to a live page in the current locale.</p>
          <p>If only one menu changed, verify that group first before doing a full navigation pass.</p>
        </div>
      ) : null}
      {children}
      <section className="admin-module-card">
        <div className="admin-module-card__body">
          <div className="admin-module-actions">
            <button type="submit" className="admin-button" disabled={isPending} aria-busy={isPending}>
              {isPending ? 'Saving…' : 'Save navigation'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
