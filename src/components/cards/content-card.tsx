import { CardImage } from '@/components/shared/card-image';
import { CardMeta } from '@/components/shared/card-meta';
import type { ContentItem } from '@/types/home';

type ContentCardProps = {
  item: ContentItem;
  ctaLabel?: string;
};

export function ContentCard({ item, ctaLabel = 'Read story' }: ContentCardProps) {
  return (
    <a className="card" href={item.href} aria-label={`${ctaLabel}: ${item.title}`}>
      <CardImage src={item.image} alt={item.title} />
      <div className="card-copy card-copy--spacious">
        <div className="card-topline">
          {item.eyebrow ? <span className="card-eyebrow">{item.eyebrow}</span> : null}
        </div>
        <h3 className="card-title line-clamp-2">{item.title}</h3>
        {item.excerpt ? <p className="card-text line-clamp-3">{item.excerpt}</p> : null}
        <CardMeta items={[ctaLabel]} />
      </div>
    </a>
  );
}
