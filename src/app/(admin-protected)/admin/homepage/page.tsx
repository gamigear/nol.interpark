import { AdminPage } from '@/components/admin/layout/admin-page';
import { AdminPlaceholderCard } from '@/components/admin/layout/admin-placeholder-card';
import { AdminTopbar } from '@/components/admin/layout/admin-topbar';
import { AdminHomepageForm } from '@/components/admin/homepage/admin-homepage-form';
import { AdminHomepageSaveWrapper } from '@/components/admin/homepage/admin-homepage-save-wrapper';
import { saveHomepageAction } from '@/app/(admin-protected)/admin/homepage/actions';
import { getHomepageAdminFormData } from '@/lib/server/homepage/admin-form';

export default async function AdminHomepagePage() {
  const locale = 'en';
  const data = await getHomepageAdminFormData(locale, 'runtime');

  return (
    <>
      <AdminTopbar
        title="Homepage"
        description="Compose and manage the homepage sections, hero content, and featured shelves."
      />
      <AdminPage
        title="Homepage"
        description={`${data.totalBlocks} block${data.totalBlocks !== 1 ? 's' : ''} · ${data.totalItems} item${data.totalItems !== 1 ? 's' : ''} · Locale: ${locale}`}
      >
        {data.blocks.length === 0 ? (
          <>
            <AdminPlaceholderCard
              title="No homepage blocks yet"
              description="No homepage blocks found. Create content blocks in the database to start managing homepage content here."
            />
            <p className="admin-homepage-help">
              Tip: Homepage sections are managed via the seed/migration layer. Once blocks exist, you can edit content, reorder sections, and control publish state directly here.
            </p>
          </>
        ) : (
          <AdminHomepageSaveWrapper action={saveHomepageAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="intent" value="runtime" />
            <AdminHomepageForm data={data} locale={locale} />
            <section className="admin-editor-note">
              <p className="admin-editor-note__text">
                <strong>How it works:</strong> Edit section titles, CTAs, and item content below. Changes are saved when you submit. Sections marked as published will appear on the public site.
              </p>
            </section>
            <section className="admin-editor-note admin-editor-note--checklist">
              <p className="admin-editor-note__title">Quick checklist before publishing</p>
              <ul className="admin-editor-note__list">
                <li>Hero title reads well on mobile</li>
                <li>Featured tickets have valid links</li>
                <li>Editorial items have images and excerpts</li>
                <li>Travel guides point to real content</li>
              </ul>
            </section>
            <p className="admin-editor-note__text">
              <strong>Project note:</strong> Homepage save updates the shared public landing route, so even small copy edits are visible quickly after review.
            </p>
          </AdminHomepageSaveWrapper>
        )}
      </AdminPage>
    </>
  );
}
