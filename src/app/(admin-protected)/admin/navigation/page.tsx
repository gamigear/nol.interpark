import { AdminPage } from '@/components/admin/layout/admin-page';
import { AdminPlaceholderCard } from '@/components/admin/layout/admin-placeholder-card';
import { AdminTopbar } from '@/components/admin/layout/admin-topbar';
import { AdminNavForm } from '@/components/admin/navigation/admin-nav-form';
import { AdminNavSaveWrapper } from '@/components/admin/navigation/admin-nav-save-wrapper';
import { saveNavigationAction } from '@/app/(admin-protected)/admin/navigation/actions';
import { getNavigationAdminFormData } from '@/lib/server/navigation/admin-form';

export default async function AdminNavigationPage() {
  const locale = 'en';
  const { blocks, totalBlocks, totalLinks } = await getNavigationAdminFormData(locale, 'runtime');

  return (
    <>
      <AdminTopbar
        title="Navigation"
        description="Configure global navigation menus, link groups, and site-wide navigation structure."
      />
      <AdminPage
        title="Navigation"
        description={`${totalBlocks} block${totalBlocks !== 1 ? 's' : ''} · ${totalLinks} link${totalLinks !== 1 ? 's' : ''} · Locale: ${locale}`}
        backHref="/admin"
        backLabel="Admin home"
      >
        {blocks.length === 0 ? (
          <>
            <AdminPlaceholderCard
              title="No navigation blocks yet"
              description="No navigation blocks found. Create content blocks in the database to start managing navigation here."
            />
            <p className="admin-nav-help">
              Tip: Navigation blocks are managed via the seed/migration layer. Once blocks exist, they will appear here for editing and reordering.
            </p>
          </>
        ) : (
          <AdminNavSaveWrapper action={saveNavigationAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="intent" value="runtime" />
            <section className="admin-editor-note">
              <p className="admin-editor-note__text">
                <strong>Editing scope:</strong> You are updating {totalBlocks} navigation block{totalBlocks !== 1 ? 's' : ''} with {totalLinks} total link{totalLinks !== 1 ? 's' : ''} for locale <strong>{locale}</strong>.
              </p>
            </section>
            <AdminNavForm blocks={blocks} locale={locale} />
            <section className="admin-editor-note">
              <p className="admin-editor-note__text">
                <strong>Navigation structure:</strong> Primary links appear in the main header menu. Secondary links populate the footer or overflow menus. Update labels, hrefs, and order below.
              </p>
            </section>
            <section className="admin-publish-checklist">
              <h4 className="admin-publish-checklist__title">Before publishing navigation</h4>
              <ul className="admin-publish-checklist__items">
                <li>Verify all hrefs resolve to valid routes</li>
                <li>Check for duplicate labels or broken links</li>
                <li>Confirm locale-specific menus are consistent</li>
              </ul>
            </section>
          </AdminNavSaveWrapper>
        )}
      </AdminPage>
    </>
  );
}
