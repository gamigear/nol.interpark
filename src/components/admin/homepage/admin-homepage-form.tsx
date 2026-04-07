import type { AdminHomepageFormData } from '@/lib/server/homepage/admin-form';

type AdminHomepageFormProps = {
  data: AdminHomepageFormData;
  locale: string;
};

export function AdminHomepageForm({ data, locale }: AdminHomepageFormProps) {
  return (
    <div className="stack-lg">
      <p className="admin-editor-note">
        <strong>Editor guide:</strong> Page settings control SEO and routing. Each block below maps to a homepage section (hero, tickets, picks, editorial, guides). Update titles, CTAs, and item details to change what visitors see on the public homepage.
      </p>
      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <p className="admin-card__meta">Page settings</p>
            <h2>Homepage metadata</h2>
          </div>
        </div>
        <div className="admin-card__body">
          <input type="hidden" name="page.id" defaultValue={data.page.id} />
          <div className="grid grid-cols-2 gap-2">
            <label className="admin-field">
              <span>Slug</span>
              <input name="page.slug" defaultValue={data.page.slug} />
            </label>
            <label className="admin-field">
              <span>Status</span>
              <input name="page.status" defaultValue={data.page.status} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="admin-field">
              <span>Title</span>
              <input name="page.title" defaultValue={data.page.title} />
            </label>
            <label className="admin-field">
              <span>Canonical path</span>
              <input name="page.canonicalPath" defaultValue={data.page.canonicalPath} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="admin-field">
              <span>SEO title</span>
              <input name="page.seoTitle" defaultValue={data.page.seoTitle} />
            </label>
            <label className="admin-field">
              <span>Visibility</span>
              <input name="page.visibility" defaultValue={data.page.visibility} />
            </label>
          </div>
          <label className="admin-field">
            <span>SEO description</span>
            <input name="page.seoDescription" defaultValue={data.page.seoDescription} />
          </label>
        </div>
      </section>

      {data.blocks.map((block, blockIndex) => (
        <section key={block.id} className="admin-card">
          <div className="admin-card__header">
            <div>
              <p className="admin-card__meta">{block.blockType} · {block.key}</p>
              <h2>{block.title || block.key}</h2>
            </div>
          </div>
          <div className="admin-card__body">
            <input type="hidden" name={`blocks.${blockIndex}.id`} defaultValue={block.id} />
            <input type="hidden" name={`blocks.${blockIndex}.key`} defaultValue={block.key} />
            <input type="hidden" name={`blocks.${blockIndex}.blockType`} defaultValue={block.blockType} />
            <input type="hidden" name={`blocks.${blockIndex}.pageId`} defaultValue={data.page.id} />
            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field"><span>Status</span><input name={`blocks.${blockIndex}.status`} defaultValue={block.status} /></label>
              <label className="admin-field"><span>Order</span><input type="number" name={`blocks.${blockIndex}.displayOrder`} defaultValue={block.displayOrder} /></label>
            </div>
            <p className="admin-card__meta">Block key stays stable so the public data layer can map the same homepage section after each save.</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field"><span>Title</span><input name={`blocks.${blockIndex}.title`} defaultValue={block.title} /></label>
              <label className="admin-field"><span>Subtitle</span><input name={`blocks.${blockIndex}.subtitle`} defaultValue={block.subtitle} /></label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field"><span>CTA label</span><input name={`blocks.${blockIndex}.ctaLabel`} defaultValue={block.ctaLabel} /></label>
              <label className="admin-field"><span>CTA href</span><input name={`blocks.${blockIndex}.ctaHref`} defaultValue={block.ctaHref} /></label>
            </div>
            <p className="admin-card__meta">Canonical path should stay locale-aware so the published homepage keeps a stable route per market.</p>

            <div className="stack-sm">
              <p className="admin-card__meta">Items ({block.items.length})</p>
              <p className="admin-card__meta">Keep item order aligned with public homepage priority. The first item in each block appears as the lead card in most shelves.</p>
              {block.items.map((item, itemIndex) => (
                <div key={item.id} className="admin-item-row">
                  <input type="hidden" name={`blocks.${blockIndex}.items.${itemIndex}.id`} defaultValue={item.id} />
                  <input type="hidden" name={`blocks.${blockIndex}.items.${itemIndex}.itemType`} defaultValue={item.itemType} />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="admin-field"><span>Title</span><input name={`blocks.${blockIndex}.items.${itemIndex}.title`} defaultValue={item.title} /></label>
                    <label className="admin-field"><span>Subtitle</span><input name={`blocks.${blockIndex}.items.${itemIndex}.subtitle`} defaultValue={item.subtitle} /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="admin-field"><span>Href</span><input name={`blocks.${blockIndex}.items.${itemIndex}.href`} defaultValue={item.href} /></label>
                    <label className="admin-field"><span>Image</span><input name={`blocks.${blockIndex}.items.${itemIndex}.image`} defaultValue={item.image} /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="admin-field"><span>Badge</span><input name={`blocks.${blockIndex}.items.${itemIndex}.badge`} defaultValue={item.badge} /></label>
                    <label className="admin-field"><span>Eyebrow</span><input name={`blocks.${blockIndex}.items.${itemIndex}.eyebrow`} defaultValue={item.eyebrow} /></label>
                  </div>
                  <label className="admin-field"><span>Description</span><input name={`blocks.${blockIndex}.items.${itemIndex}.description`} defaultValue={item.description} /></label>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
