import Link from 'next/link';

type AdminStatCardProps = {
  label: string;
  value: string;
  hint: string;
  href?: string;
};

export function AdminStatCard({ label, value, hint, href }: AdminStatCardProps) {
  const content = (
    <>
      <p className="admin-stat-card__label">{label}</p>
      <strong className="admin-stat-card__value">{value}</strong>
      <p className="admin-stat-card__hint">{hint}</p>
      {href ? <small className="admin-stat-card__cta">Open module →</small> : null}
      {href ? <small className="admin-stat-card__hint">Tip: open this module to review details and latest changes.</small> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="admin-stat-card">
        {content}
      </Link>
    );
  }

  return <div className="admin-stat-card">{content}</div>;
}
