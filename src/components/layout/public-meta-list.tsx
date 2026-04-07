export type PublicMetaTone = 'default' | 'source' | 'path' | 'status';

export type PublicMetaItem = {
  label: string;
  value: string;
  tone?: PublicMetaTone;
  ariaLabel?: string;
};

type PublicMetaListProps = {
  items?: PublicMetaItem[];
  compact?: boolean;
};

export type { PublicMetaListProps };

function getMetaTone(item: PublicMetaItem): PublicMetaTone {
  if (item.tone) return item.tone;

  const normalized = item.label.trim().toLowerCase();

  if (normalized === 'source') return 'source';
  if (normalized === 'route' || normalized === 'slug') return 'path';
  if (normalized === 'status') return 'status';
  return 'default';
}

export function PublicMetaList({ items = [], compact = false }: PublicMetaListProps) {
  const visibleItems = items.filter((item) => item.label.trim().length > 0 && item.value.trim().length > 0);

  if (visibleItems.length === 0) return null;

  return (
    <dl className={`public-meta-list${compact ? ' public-meta-list--compact' : ''}`}>
      {visibleItems.map((item, index) => {
        const tone = getMetaTone(item);
        const normalizedLabel = item.label.trim();
        const normalizedValue = item.value.trim();

        return (
          <div
            key={`${normalizedLabel}-${normalizedValue}-${index}`}
            className={`public-meta-list__item public-meta-list__item--${tone}`}
            aria-label={item.ariaLabel}
          >
            <dt>{normalizedLabel}</dt>
            <dd>{normalizedValue}</dd>
          </div>
        );
      })}
    </dl>
  );
}
