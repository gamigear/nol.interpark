type PublicEmptyStateProps = {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
  eyebrow?: string;
  note?: string;
  noteTone?: 'default' | 'muted';
  statusTone?: 'default' | 'quiet';
  ctaHint?: string;
};

export function PublicEmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  compact = false,
  eyebrow = 'Coming soon',
  note,
  noteTone = 'default',
  statusTone = 'default',
  ctaHint,
}: PublicEmptyStateProps) {
  const normalizedTitle = title.trim();
  const normalizedDescription = description?.trim() ?? '';
  const normalizedEyebrow = eyebrow?.trim();
  const normalizedNote = note?.trim();
  const normalizedCtaHint = ctaHint?.trim();

  return (
    <div className={`public-empty-state${compact ? ' public-empty-state--compact' : ''}${statusTone === 'quiet' ? ' public-empty-state--quiet' : ''}`} role="status" aria-live="polite">
      {normalizedEyebrow ? <span className="public-empty-state__eyebrow">{normalizedEyebrow}</span> : null}
      <h3>{normalizedTitle}</h3>
      <p>{normalizedDescription}</p>
      {normalizedNote ? <small className={`public-empty-state__note${noteTone === 'muted' ? ' public-empty-state__note--muted' : ''}`}>{normalizedNote}</small> : null}
      {ctaLabel && ctaHref ? (
        <>
          <a className="section-link" href={ctaHref} aria-label={`${ctaLabel}: ${normalizedTitle}`}>
            <span>{ctaLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
          {normalizedCtaHint ? <small className="public-empty-state__note public-empty-state__note--muted">{normalizedCtaHint}</small> : null}
        </>
      ) : null}
    </div>
  );
}
