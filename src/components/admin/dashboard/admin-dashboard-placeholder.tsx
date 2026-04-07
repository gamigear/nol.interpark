import { AdminStatCard } from './admin-stat-card';

const operationalCards = [
  {
    label: 'Homepage locales live',
    value: '2',
    hint: 'EN và AR đang publish bằng mock content hiện tại.',
    href: '/admin/homepage',
  },
  {
    label: 'Promo windows to review',
    value: '3',
    hint: 'Placeholder cho campaign expiring và scheduling.',
    href: '/admin/promos',
  },
  {
    label: 'Missing translations',
    value: '12',
    hint: 'Sẽ nối translation completeness thật ở phase sau.',
    href: '/admin/localization',
  },
  {
    label: 'Recent editorial updates',
    value: '5',
    hint: 'Dùng để dẫn vào Articles và Travel Guides.',
    href: '/admin/editorial/articles',
  },
];

const nextSteps = [
  'Nối auth thật vào /admin thay cho cookie placeholder.',
  'Dựng Homepage Composer, Navigation và Promos managers theo canonical admin IA MVP.',
  'Chuyển homepage public từ mock data sang service layer + Neon.',
];

export function AdminDashboardPlaceholder() {
  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__hero">
        <div>
          <p className="admin-dashboard__eyebrow">Dashboard placeholder</p>
          <h3>Foundation admin shell đã tách riêng khỏi public branch.</h3>
          <p>
            Khu này chỉ giữ operational entry points nhẹ để team tiếp tục nối auth, CMS screens,
            và publish workflow ở bước sau.
          </p>
        </div>
      </section>

      <section className="admin-stats-grid" aria-label="Operational overview">
        {operationalCards.map((card) => (
          <AdminStatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="admin-placeholder-grid">
        <article className="admin-placeholder-card">
          <p className="admin-placeholder-card__eyebrow">Planned CMS modules</p>
          <h3>Ưu tiên implement tiếp</h3>
          <ul>
            <li>Homepage Composer</li>
            <li>Navigation manager</li>
            <li>Promos manager</li>
            <li>Catalog tickets/products</li>
            <li>Editorial, media, localization</li>
          </ul>
        </article>

        <article className="admin-placeholder-card">
          <p className="admin-placeholder-card__eyebrow">Foundation notes</p>
          <h3>Những gì đang tạm thời placeholder</h3>
          <ul>
            <li>Cookie mock session cho protected layout.</li>
            <li>Sign-in form chưa nối auth provider thật.</li>
            <li>Homepage, Navigation, Promos đã có form → save path. Các module khác còn scaffold.</li>
          </ul>
          <p className="admin-placeholder-card__cue">
            <strong>Quick guide:</strong> Edit modules with save flows to test content changes. Scaffold-only modules show read-only data until editor surfaces are built.
          </p>
        </article>

        <article className="admin-placeholder-card">
          <p className="admin-placeholder-card__eyebrow">Module status</p>
          <h3>CMS modules at a glance</h3>
          <ul>
            <li><strong>Homepage:</strong> editor + save usable</li>
            <li><strong>Navigation:</strong> editor + save usable</li>
            <li><strong>Promos:</strong> editor + save usable</li>
            <li><strong>Localization:</strong> scaffold + toolbar</li>
            <li><strong>Editorial:</strong> route shell + list mock</li>
          </ul>
        </article>

        <article className="admin-placeholder-card">
          <p className="admin-placeholder-card__eyebrow">Next steps</p>
          <h3>Checklist gần nhất</h3>
          <ul>
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="admin-placeholder-card__cue">
            <strong>Operator cue:</strong> If only one admin module is stable enough for demo, start with Homepage or Navigation before opening deeper CMS routes.
          </p>
        </article>
      </section>
    </div>
  );
}
