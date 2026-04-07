import { CardImage } from '@/components/shared/card-image';
import { CardMeta } from '@/components/shared/card-meta';
import type { TicketItem } from '@/types/home';

type TicketCardProps = {
  item: TicketItem;
  ctaLabel?: string;
};

export function TicketCard({ item, ctaLabel = 'View ticket' }: TicketCardProps) {
  return (
    <a className="card" href={item.href} aria-label={`${ctaLabel}: ${item.title}`}>
      <CardImage src={item.image} alt={item.title} wide />
      <div className="card-copy card-copy--spacious">
        <div className="card-topline">
          {item.badge ? <span className="card-badge">{item.badge}</span> : <span className="card-eyebrow">Featured</span>}
          <CardMeta items={[item.priceLabel]} />
        </div>
        <h3 className="card-title line-clamp-2">{item.title}</h3>
        {item.subtitle ? <p className="card-text line-clamp-2">{item.subtitle}</p> : null}
      </div>
    </a>
  );
}
