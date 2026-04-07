import { CardImage } from '@/components/shared/card-image';
import { CardMeta } from '@/components/shared/card-meta';
import type { ProductItem } from '@/types/home';

type ProductCardProps = {
  item: ProductItem;
  locale?: string;
};

function resolveProductHref(href: string, locale?: string) {
  if (!locale || href.startsWith('http') || href.startsWith(`/${locale}/`) || !href.startsWith('/')) {
    return href;
  }

  return `/${locale}${href}`;
}

export function ProductCard({ item, locale }: ProductCardProps) {
  return (
    <a className="card" href={resolveProductHref(item.href, locale)}>
      <CardImage src={item.image} alt={item.title} />
      <div className="card-copy card-copy--spacious">
        <div className="card-topline">
          {item.category ? <span className="card-eyebrow">{item.category}</span> : null}
          <CardMeta items={[item.priceLabel]} />
        </div>
        <h3 className="card-title line-clamp-2">{item.title}</h3>
        {item.description ? <p className="card-text line-clamp-3">{item.description}</p> : null}
      </div>
    </a>
  );
}
