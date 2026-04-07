'use client';

import { useActionState, type ReactNode } from 'react';

type SaveState =
  | { ok: true; saved: true; savedAt?: string }
  | { ok: false; error: string }
  | null;

function formatSavedAt(savedAt?: string) {
  if (!savedAt) return undefined;
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return savedAt;
  return date.toLocaleTimeString();
}

type AdminHomepageSaveWrapperProps = {
  children: ReactNode;
  action: (prevState: unknown, formData: FormData) => Promise<SaveState>;
};

export function AdminHomepageSaveWrapper({ children, action }: AdminHomepageSaveWrapperProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const savedAt = state?.ok ? formatSavedAt(state.savedAt) : undefined;

  return (
    <form action={formAction} className="admin-module-stack">
      {state && !state.ok ? (
        <div className="admin-alert admin-alert--error" role="alert">
          <strong>Save failed:</strong> {state.error}
          <p>Check hero copy, section order, and required item titles before saving again.</p>
        </div>
      ) : null}
      {state?.ok ? (
        <div className="admin-alert admin-alert--success" role="alert">
          <strong>Homepage saved</strong>
          {savedAt ? <span> at {savedAt}</span> : null}
          <span> · Review the public homepage after publishing to confirm section order and hero copy.</span>
          <p>Tip: if only one shelf changed, scan that section first before doing a full-page pass.</p>
          <p>Content check: compare the hero and first visible shelf against the intended locale before marking the update done.</p>
        </div>
      ) : null}
      {children}
      <section className="admin-module-card">
        <div className="admin-module-card__body">
          <div className="admin-module-actions">
            <button type="submit" className="admin-button" disabled={isPending} aria-busy={isPending}>
              {isPending ? 'Saving…' : 'Save homepage'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
