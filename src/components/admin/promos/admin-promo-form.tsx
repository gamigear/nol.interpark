import type { AdminPromoFormBlock } from '@/lib/server/promos/admin-form';

type AdminPromoFormProps = {
  blocks: AdminPromoFormBlock[];
  locale: string;
};

export function AdminPromoForm({ blocks, locale }: AdminPromoFormProps) {
  if (!blocks.length) return <p className="admin-card__meta">No promo blocks to edit.</p>;

  return (
    <div className="stack-lg">
      {blocks.map((block, blockIndex) => (
        <div key={block.id} className="admin-card">
          <div className="admin-card__header">
            <div>
              <p className="admin-card__meta">Key: {block.key}</p>
              <p className="admin-card__meta">Status / Order</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="admin-field">
                  <span>Status</span>
                  <input name={`blocks.${blockIndex}.status`} defaultValue={block.status} />
                </label>
                <label className="admin-field">
                  <span>Order</span>
                  <input name={`blocks.${blockIndex}.displayOrder`} type="number" defaultValue={block.displayOrder} />
                </label>
              </div>
            </div>
          </div>

          <div className="admin-card__body">
            <input type="hidden" name={`blocks.${blockIndex}.id`} defaultValue={block.id} />
            <input type="hidden" name={`blocks.${blockIndex}.key`} defaultValue={block.key} />
            <input type="hidden" name={`blocks.${blockIndex}.blockType`} defaultValue="promo_banner" />
            <input type="hidden" name={`blocks.${blockIndex}.pageId`} defaultValue={`homepage-${locale}`} />

            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field">
                <span>Title</span>
                <input name={`blocks.${blockIndex}.title`} defaultValue={block.title || ''} />
              </label>
              <label className="admin-field">
                <span>Subtitle</span>
                <input name={`blocks.${blockIndex}.subtitle`} defaultValue={block.subtitle || ''} />
              </label>
            </div>
            <p className="admin-card__meta">Use the block title/subtitle for placement-level context; item headlines should carry the campaign-specific message.</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field">
                <span>CTA label</span>
                <input name={`blocks.${blockIndex}.ctaLabel`} defaultValue={block.ctaLabel || ''} />
              </label>
              <label className="admin-field">
                <span>CTA href</span>
                <input name={`blocks.${blockIndex}.ctaHref`} defaultValue={block.ctaHref || ''} />
              </label>
            </div>
            <p className="admin-card__meta">Use concise CTA copy so promo buttons stay readable across homepage hero, strip, and compact card placements.</p>

            <div className="stack-sm">
              <p className="admin-card__meta">Items ({block.items.length})</p>
              <p className="admin-card__meta">
                Leave CTA fields empty for announcement-only promos. Headline is the minimum field required for an item to be saved.
              </p>
              <p className="admin-card__meta">
                Theme helps operators keep campaign variants visually consistent across hero, strip, and card placements.
              </p>
              <p className="admin-card__meta">
                Keep the first item strongest: the lead promo is the first card most visitors see in a placement.
              </p>
              <p className="admin-card__meta">
                Match status and order before editing items so campaign priority stays obvious while reviewing the form.
              </p>
              {block.items.length === 0 ? (
                <p className="admin-card__meta">No items</p>
              ) : (
                block.items.map((item, itemIndex) => (
                  <div key={item.id} className="admin-item-row">
                    <input type="hidden" name={`blocks.${blockIndex}.items.${itemIndex}.blockId`} defaultValue={block.id} />
                    <input type="hidden" name={`blocks.${blockIndex}.items.${itemIndex}.id`} defaultValue={item.id} />
                    <input type="hidden" name={`blocks.${blockIndex}.items.${itemIndex}.itemType`} defaultValue="promo" />
                    <div className="grid grid-cols-2 gap-2">
                      <label className="admin-field">
                        <span>Headline</span>
                        <input name={`blocks.${blockIndex}.items.${itemIndex}.headline`} defaultValue={item.headline} />
                      </label>
                      <label className="admin-field">
                        <span>Subheadline</span>
                        <input name={`blocks.${blockIndex}.items.${itemIndex}.subheadline`} defaultValue={item.subheadline || ''} />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="admin-field">
                        <span>CTA label</span>
                        <input name={`blocks.${blockIndex}.items.${itemIndex}.ctaLabel`} defaultValue={item.ctaLabel || ''} />
                      </label>
                      <label className="admin-field">
                        <span>CTA href</span>
                        <input name={`blocks.${blockIndex}.items.${itemIndex}.ctaHref`} defaultValue={item.ctaHref || ''} />
                      </label>
                    </div>
                    <p className="admin-card__meta">Only fill CTA href when the button should lead somewhere live right now; otherwise leave both CTA fields blank.</p>
                    <label className="admin-field">
                      <span>Theme</span>
                      <input name={`blocks.${blockIndex}.items.${itemIndex}.theme`} defaultValue={item.theme || ''} />
                    </label>
                    <p className="admin-card__meta">If a promo item is just an announcement, leave CTA blank but keep the headline explicit enough to stand alone.</p>
                    <p className="admin-card__meta">Use the theme field only when a placement needs a distinct visual treatment; otherwise keep it blank to inherit the default campaign style.</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
