import type { PublicInfoCard } from '@/lib/server/public-content';

type PublicInfoCardsProps = {
  items: PublicInfoCard[];
};

function makeInfoCardKey(card: PublicInfoCard, index: number) {
  return `${card.title}-${index}`;
}

export function PublicInfoCards({ items }: PublicInfoCardsProps) {
  const visibleItems = items
    .map((card) => ({
      title: card.title.trim(),
      description: card.description.trim(),
    }))
    .filter((card) => card.title.length > 0 || card.description.length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="public-intro-grid">
      {visibleItems.map((card, index) => (
        <div key={makeInfoCardKey(card, index)} className="public-note-card">
          {card.title ? <strong>{card.title}</strong> : null}
          {card.description ? <p>{card.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
