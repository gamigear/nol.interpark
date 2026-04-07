'use client';

import { useActionState, type ReactNode } from 'react';

type SaveState = { ok: true; saved: true; savedAt?: string; blockCount?: number; itemCount?: number } | { ok: false; error: string } | null;

type AdminPromoSaveWrapperProps = {
  children: ReactNode;
  action: (prevState: unknown, formData: FormData) => Promise<SaveState>;
};

function formatSavedAt(savedAt?: string) {
  if (!savedAt) return undefined;
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return savedAt;
  return date.toLocaleTimeString();
}

export function AdminPromoSaveWrapper({ children, action }: AdminPromoSaveWrapperProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const savedAt = state?.ok ? formatSavedAt(state.savedAt) : undefined;

  return (
    <form action={formAction} className="admin-module-stack">
      {state && !state.ok ? (
        <div className="admin-alert admin-alert--error" role="alert">
          <strong>Save failed:</strong> {state.error}
          <p>Please review CTA links, schedule details, and required headlines before trying again.</p>
          <p>Save stops before publish, so no public promo slots are updated until the form validates successfully.</p>
          <p>Try fixing one block at a time if the payload is large.</p>
        </div>
      ) : null}
      {state?.ok ? (
        <div className="admin-alert admin-alert--success" role="alert">
          <strong>Promos saved</strong>
          {savedAt ? <span> at {savedAt}</span> : null}
          {(state.blockCount || state.itemCount) ? (
            <span>
              {' '}
              · {state.blockCount ?? 0} block{state.blockCount === 1 ? '' : 's'} · {state.itemCount ?? 0} item{state.itemCount === 1 ? '' : 's'} saved
            </span>
          ) : null}
          <p><strong>Now check:</strong> live placements, CTA behavior, and one homepage promo slot.</p>
        </div>
      ) : null}
      {children}
      <section className="admin-module-card">
        <div className="admin-module-card__body">
          <div className="admin-module-actions">
            <button type="submit" className="admin-button" disabled={isPending} aria-busy={isPending} aria-label={isPending ? 'Saving promos, please wait' : 'Save promos'}>
              {isPending ? 'Saving…' : 'Save promos'}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
