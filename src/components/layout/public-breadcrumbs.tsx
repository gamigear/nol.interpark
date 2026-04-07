export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PublicBreadcrumbsProps = {
  items: BreadcrumbItem[];
  emptyLabel?: string;
};

function makeBreadcrumbKey(item: BreadcrumbItem, index: number) {
  return item.href ?? `${item.label}-${index}`;
}

export function PublicBreadcrumbs({ items, emptyLabel = 'Current page' }: PublicBreadcrumbsProps) {
  const visibleItems = items
    .map((item) => ({
      label: item.label.trim(),
      href: item.href?.trim() || undefined,
    }))
    .filter((item) => item.label.length > 0);

  if (visibleItems.length === 0) {
    return (
      <nav className="public-breadcrumbs" aria-label="Breadcrumb">
        <span className="public-breadcrumbs__item">
          <span aria-current="page">{emptyLabel}</span>
        </span>
      </nav>
    );
  }

  return (
    <nav className="public-breadcrumbs" aria-label="Breadcrumb">
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;

        return (
          <span key={makeBreadcrumbKey(item, index)} className="public-breadcrumbs__item">
            {item.href && !isLast ? (
              <a href={item.href} aria-label={`Go to ${item.label}`}>
                {item.label}
              </a>
            ) : (
              <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
            )}
            {!isLast ? <span aria-hidden="true">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
