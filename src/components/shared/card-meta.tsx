type CardMetaProps = {
  items: Array<string | undefined>;
};

function makeCardMetaKey(item: string, index: number) {
  return `${item}-${index}`;
}

export function CardMeta({ items }: CardMetaProps) {
  const visibleItems = items.filter(Boolean) as string[];

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="card-meta">
      {visibleItems.map((item, index) => (
        <span key={makeCardMetaKey(item, index)}>{item}</span>
      ))}
    </div>
  );
}
