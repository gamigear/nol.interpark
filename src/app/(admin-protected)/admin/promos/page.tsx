import { AdminPage } from '@/components/admin/layout/admin-page';
import { AdminPlaceholderCard } from '@/components/admin/layout/admin-placeholder-card';
import { AdminTopbar } from '@/components/admin/layout/admin-topbar';
import { AdminPromoForm } from '@/components/admin/promos/admin-promo-form';
import { AdminPromoSaveWrapper } from '@/components/admin/promos/admin-promo-save-wrapper';
import { savePromosAction } from '@/app/(admin-protected)/admin/promos/actions';
import { getPromosAdminFormData } from '@/lib/server/promos/admin-query';

export default async function AdminPromosPage() {
  const locale = 'en';
  const { blocks, totalBlocks, totalItems } = await getPromosAdminFormData(locale, 'runtime');

  return (
    <>
      <AdminTopbar
        title="Promos"
        description="Manage promotional banners and campaign blocks displayed across the public site."
      />
      <AdminPage
        title="Promos"
        description={`${totalBlocks} block${totalBlocks !== 1 ? 's' : ''} · ${totalItems} item${totalItems !== 1 ? 's' : ''} · Locale: ${locale}`}
      >
        {blocks.length === 0 ? (
          <>
            <AdminPlaceholderCard
              title="No promo blocks yet"
              description="No promo blocks found. Create content blocks in the database to start managing promotions here."
            />
            <p className="admin-promo-help">
              Tip: Promo blocks are seeded via the migration layer. Once created, they appear here with placement targeting and scheduling controls.
            </p>
          </>
        ) : (
          <AdminPromoSaveWrapper action={savePromosAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="intent" value="runtime" />
            <AdminPromoForm blocks={blocks} locale={locale} />
            <section className="admin-editor-note">
              <p className="admin-editor-note__text">
                <strong>Placement:</strong> Promo blocks render between homepage sections. Each block supports headline, subheadline, CTA, and theme for seasonal campaigns.
              </p>
            </section>
            <section className="admin-publish-checklist">
              <h4 className="admin-publish-checklist__title">Before publishing promos</h4>
              <ul className="admin-publish-checklist__items">
                <li>Verify CTA links resolve to live pages</li>
                <li>Confirm schedule windows don't overlap incorrectly</li>
                <li>Check locale-specific copy accuracy</li>
              </ul>
            </section>
            <p className="admin-editor-note__text">
              <strong>Operator reminder:</strong> Hero-style promos are the most visible. Review those first after save before checking smaller placements.
            </p>
          </AdminPromoSaveWrapper>
        )}
      </AdminPage>
    </>
  );
}
