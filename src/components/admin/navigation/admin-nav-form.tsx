import type { AdminNavFormBlock } from '@/lib/server/navigation/admin-form';

type AdminNavFormProps = {
  blocks: AdminNavFormBlock[];
  locale: string;
};

export function AdminNavForm({ blocks, locale }: AdminNavFormProps) {
  if (!blocks.length) return <p className="admin-card__meta">No navigation blocks to edit.</p>;

  return (
    <div className="stack-lg">
      <p className="admin-editor-help">
        <strong>Navigation editor:</strong> Each block represents a menu group. Update status, order, titles, and CTAs below. Links populate sub-menus or overflow items.
      </p>
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
            <input type="hidden" name={`blocks.${blockIndex}.blockType`} defaultValue="nav_highlight" />
            <input type="hidden" name={`blocks.${blockIndex}.pageId`} defaultValue={`homepage-${locale}`} />

            <div className="grid grid-cols-2 gap-2">
              <label className="admin-field">
                <span>Title</span>
                <input name={`blocks.${blockIndex}.title`} defaultValue={block.title || ''} />
              </label>
              <label className="admin-field">
                <span>CTA label</span>
                <input name={`blocks.${blockIndex}.ctaLabel`} defaultValue={block.ctaLabel || ''} />
              </label>
            </div>
            <label className="admin-field">
              <span>CTA href</span>
              <input name={`blocks.${blockIndex}.ctaHref`} defaultValue={block.ctaHref || ''} />
            </label>

            <div className="stack-sm">
              <p className="admin-card__meta">Links ({block.links.length})</p>
              <p className="admin-card__meta">Keep labels short for header space. Use badges sparingly so the main menu stays scannable.</p>
              <p className="admin-card__meta">Use <strong>Target</strong> only for links that truly need a new tab; most primary navigation should stay in the same browsing flow.</p>
              {block.links.length === 0 ? (
                <p className="admin-card__meta">No links</p>
              ) : (
                block.links.map((link, linkIndex) => (
                  <div key={link.id} className="admin-item-row">
                    <input type="hidden" name={`blocks.${blockIndex}.links.${linkIndex}.id`} defaultValue={link.id} />
                    <p className="admin-card__meta">Link {linkIndex + 1} of {block.links.length}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="admin-field">
                        <span>Label</span>
                        <input name={`blocks.${blockIndex}.links.${linkIndex}.label`} defaultValue={link.label} />
                      </label>
                      <label className="admin-field">
                        <span>Href</span>
                        <input name={`blocks.${blockIndex}.links.${linkIndex}.href`} defaultValue={link.href} />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="admin-field">
                        <span>Target</span>
                        <input name={`blocks.${blockIndex}.links.${linkIndex}.target`} defaultValue={link.target} />
                      </label>
                      <label className="admin-field">
                        <span>Badge</span>
                        <input name={`blocks.${blockIndex}.links.${linkIndex}.badge`} defaultValue={link.badge} />
                      </label>
                    </div>
                    <p className="admin-card__meta">Leave badge empty unless the link needs a short visual tag like New or Hot.</p>
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
