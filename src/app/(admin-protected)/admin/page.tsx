import Link from 'next/link';
import { AdminPage } from '@/components/admin/layout/admin-page';
import { AdminTopbar } from '@/components/admin/layout/admin-topbar';

export default function AdminIndexPage() {
  return (
    <>
      <AdminTopbar title="Admin home" description="Entry point for world.nol CMS admin surfaces." />
      <AdminPage title="world.nol CMS admin" description="Choose a module below to start editing content.">
        <div className="admin-module-grid">
          <Link href="/admin/dashboard" className="admin-module-card">
            <h3>Dashboard</h3>
            <p>Operational overview and quick status.</p>
          </Link>
          <Link href="/admin/homepage" className="admin-module-card">
            <h3>Homepage</h3>
            <p>Compose sections, hero, and featured shelves.</p>
          </Link>
          <Link href="/admin/navigation" className="admin-module-card">
            <h3>Navigation</h3>
            <p>Manage header/footer link groups and ordering.</p>
          </Link>
          <Link href="/admin/promos" className="admin-module-card">
            <h3>Promos</h3>
            <p>Edit promotional banners and campaign blocks.</p>
          </Link>
        </div>
        <p className="admin-index-note">
          <strong>Note:</strong> Modules marked with save flows support form → submit → DB. Others are read-only or scaffold.
        </p>
        <p className="admin-index-note">
          <strong>Tip:</strong> Start in Dashboard for current readiness, then jump into Homepage, Navigation, or Promos when you want to make content changes.
        </p>
      </AdminPage>
    </>
  );
}
