export type AdminTopbarProps = {
  title: string;
  description?: string;
  metaChips?: string[];
  eyebrow?: string;
};

export function AdminTopbar({ title, description, metaChips, eyebrow = 'world.nol CMS' }: AdminTopbarProps) {
  const normalizedDescription = description?.trim();
  const normalizedEyebrow = eyebrow?.trim();
  const chips = metaChips?.length ? metaChips.map((chip) => chip.trim()).filter(Boolean) : ['Admin shell', 'Session active'];

  return (
    <header className="admin-topbar">
      <div>
        {normalizedEyebrow ? <p className="admin-topbar__eyebrow">{normalizedEyebrow}</p> : null}
        <h1>{title}</h1>
        {normalizedDescription ? <p className="admin-topbar__description">{normalizedDescription}</p> : null}
      </div>

      <div className="admin-topbar__meta">
        {chips.map((chip) => (
          <span key={chip} className={`admin-chip${chip.includes('placeholder') ? ' admin-chip--muted' : ''}`}>
            {chip}
          </span>
        ))}
      </div>
    </header>
  );
}
