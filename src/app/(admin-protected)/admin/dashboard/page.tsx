import { AdminDashboardPlaceholder } from '@/components/admin/dashboard/admin-dashboard-placeholder';
import { AdminPage } from '@/components/admin/layout/admin-page';
import { AdminTopbar } from '@/components/admin/layout/admin-topbar';

export default function AdminDashboardPage() {
  return (
    <>
      <AdminTopbar
        title="Dashboard"
        description="Operational dashboard nhẹ cho admin shell MVP, ưu tiên quick entry points thay vì demo analytics."
      />
      <AdminPage
        title="world.nol CMS admin"
        description="Foundation screen để team tiếp tục nối auth, CMS modules, và data layer ở bước sau."
        backHref="/admin"
        backLabel="Admin home"
      >
        <AdminDashboardPlaceholder />
        <section className="admin-quick-status">
          <h3 className="admin-quick-status__title">Quick status</h3>
          <ul className="admin-quick-status__list">
            <li><strong>Homepage:</strong> composer + save flow usable</li>
            <li><strong>Navigation:</strong> read + save flow usable</li>
            <li><strong>Promos:</strong> read + save flow usable</li>
            <li><strong>Localization:</strong> scaffold + toolbar</li>
            <li><strong>DB/Neon:</strong> config + query seams ready</li>
            <li><strong>Auth:</strong> credentials foundation + session</li>
          </ul>
          <p className="admin-quick-status__note">Modules marked usable have working form → save paths. Others are scaffold or read-only.</p>
        </section>
        <section className="admin-next-steps">
          <h3 className="admin-next-steps__title">Next steps</h3>
          <ul className="admin-next-steps__list">
            <li>Wire DB driver/ORM to query seams</li>
            <li>Add editor previews for homepage sections</li>
            <li>Extend localization to multi-locale editing</li>
            <li>Build publish/schedule workflow for content blocks</li>
          </ul>
        </section>
        <section className="admin-operator-note">
          <p><strong>Operator tip:</strong> Use the Quick status section above to check which modules are production-ready. Click any module name in the sidebar to jump directly to its editor.</p>
        </section>
        <section className="admin-dashboard-focus-note">
          <p>
            <strong>Today’s focus:</strong> Prioritize Homepage, Navigation, and Promos first — they already have the clearest save/read path coverage in this shell.
          </p>
        </section>
        <section className="admin-quick-links">
          <h3 className="admin-quick-links__title">Quick links</h3>
          <div className="admin-quick-links__grid">
            <a href="/admin/homepage" className="admin-quick-link">Homepage editor</a>
            <a href="/admin/navigation" className="admin-quick-link">Navigation editor</a>
            <a href="/admin/promos" className="admin-quick-link">Promos editor</a>
          </div>
        </section>
        <p className="admin-dashboard__build-tag">
          Admin shell MVP · world.nol rebuild/CMS
        </p>
      </AdminPage>
    </>
  );
}
