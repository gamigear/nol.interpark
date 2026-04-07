import type { ReactNode } from 'react';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import { PublicInfoCards } from '@/components/layout/public-info-cards';
import { PublicMetaList } from '@/components/layout/public-meta-list';
import type { PublicRouteChromeProps } from '@/components/layout/public-route-chrome';

type PublicRouteFrameProps = Pick<PublicRouteChromeProps, 'introCards' | 'collectionMetaItems' | 'emptyState'> & {
  isEmpty?: boolean;
  children?: ReactNode;
  emptyStateNote?: string;
  emptyStateEyebrow?: string;
  hideCollectionMeta?: boolean;
};

function hasVisibleMeta(items: NonNullable<PublicRouteFrameProps['collectionMetaItems']>) {
  return items.some((item) => item.value.trim().length > 0);
}

function hasVisibleInfoCards(items: PublicRouteFrameProps['introCards']) {
  return items?.some((item) => item.title.trim().length > 0 || item.description.trim().length > 0) ?? false;
}

export function PublicRouteFrame({
  introCards = [],
  collectionMetaItems = [],
  emptyState,
  isEmpty = false,
  children,
  emptyStateNote,
  hideCollectionMeta = false,
}: PublicRouteFrameProps) {
  const hasCollectionMeta = !hideCollectionMeta && hasVisibleMeta(collectionMetaItems);
  const hasIntroCards = hasVisibleInfoCards(introCards);

  if (isEmpty) {
    return emptyState ? (
      <PublicEmptyState
        title={emptyState.title}
        description={emptyState.description}
        ctaLabel={emptyState.ctaLabel}
        ctaHref={emptyState.ctaHref}
        note={emptyStateNote}
        eyebrow={emptyStateNote ? 'Ready when content arrives' : undefined}
      />
    ) : null;
  }

  return (
    <div className="public-route-frame">
      {hasIntroCards ? <PublicInfoCards items={introCards} /> : null}
      {hasCollectionMeta ? (
        <div className="public-route-frame__meta">
          <PublicMetaList items={collectionMetaItems} compact />
        </div>
      ) : null}
      {children}
    </div>
  );
}
