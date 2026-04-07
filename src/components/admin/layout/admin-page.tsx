import type { ReactNode } from 'react';

type AdminPageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  helpText?: string;
  eyebrow?: string;
  children: ReactNode;
};

export function AdminPage({
  title,
  description,
  actions,
  backHref,
  backLabel = 'Back',
  helpText,
  eyebrow,
  children,
}: AdminPageProps) {
  const normalizedHelpText = helpText?.trim();
  const normalizedEyebrow = eyebrow?.trim();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          {backHref ? (
            <a href={backHref} className="admin-page__back-link">
              ← {backLabel}
            </a>
          ) : null}
          {normalizedEyebrow ? <p className="admin-page__eyebrow">{normalizedEyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
          {normalizedHelpText ? <p className="admin-page__help">{normalizedHelpText}</p> : null}
        </div>
        {actions ? <div className="admin-page__actions">{actions}</div> : null}
      </div>
      <div className="admin-page__body">{children}</div>
    </section>
  );
}
