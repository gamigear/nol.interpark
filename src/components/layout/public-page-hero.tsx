import type { ReactNode } from 'react';
import { PublicMetaList, type PublicMetaItem } from '@/components/layout/public-meta-list';

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  metaItems?: PublicMetaItem[];
  note?: string;
  emptySupportCopy?: string;
};

export function PublicPageHero({
  eyebrow,
  title,
  description,
  children,
  metaItems = [],
  note,
  emptySupportCopy = 'Details for this section are being prepared.',
}: PublicPageHeroProps) {
  const normalizedEyebrow = eyebrow.trim();
  const normalizedTitle = title.trim();
  const normalizedDescription = description.trim();
  const normalizedNote = note?.trim();
  const normalizedEmptySupportCopy = emptySupportCopy.trim();
  const hasMeta = metaItems.some((item) => item.label.trim().length > 0 && item.value.trim().length > 0);
  const hasAside = Boolean(children);
  const hasSupportCopy = Boolean(normalizedDescription || normalizedNote);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-panel public-page-hero">
          <div className="public-page-hero__copy">
            {normalizedEyebrow ? <p className="card-eyebrow">{normalizedEyebrow}</p> : null}
            <h1>{normalizedTitle}</h1>
            {hasSupportCopy ? (
              <div className="public-page-hero__support-copy">
                {normalizedDescription ? <p>{normalizedDescription}</p> : null}
                {normalizedNote ? <p className="public-page-hero__note">{normalizedNote}</p> : null}
              </div>
            ) : null}
            {hasMeta ? <PublicMetaList items={metaItems} compact /> : null}
            {!hasSupportCopy && !hasMeta && normalizedEmptySupportCopy ? (
              <p className="public-page-hero__note">{normalizedEmptySupportCopy}</p>
            ) : null}
          </div>
          {hasAside ? <div className="public-page-hero__aside">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
