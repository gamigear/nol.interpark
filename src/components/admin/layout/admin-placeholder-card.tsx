import type { ReactNode } from 'react';

type AdminPlaceholderCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  operatorNote?: string;
  children?: ReactNode;
};

export function AdminPlaceholderCard({
  title,
  description,
  eyebrow = 'Placeholder module',
  operatorNote,
  children,
}: AdminPlaceholderCardProps) {
  const normalizedTitle = title.trim();
  const normalizedDescription = description.trim();
  const normalizedEyebrow = eyebrow?.trim();
  const normalizedOperatorNote = operatorNote?.trim();

  return (
    <div className="admin-placeholder-card">
      {normalizedEyebrow ? <p className="admin-placeholder-card__eyebrow">{normalizedEyebrow}</p> : null}
      <h3>{normalizedTitle}</h3>
      <p>{normalizedDescription}</p>
      {normalizedOperatorNote ? (
        <p className="admin-placeholder-card__operator-note" role="note">
          <strong>Operator note:</strong> {normalizedOperatorNote}
        </p>
      ) : null}
      {children ? <div className="admin-placeholder-card__body">{children}</div> : null}
    </div>
  );
}
