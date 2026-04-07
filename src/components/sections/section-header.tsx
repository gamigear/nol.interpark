type SectionHeaderProps = {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  kicker?: string;
  headingLevel?: 2 | 3;
};

const headingTags: Record<NonNullable<SectionHeaderProps['headingLevel']>, 'h2' | 'h3'> = {
  2: 'h2',
  3: 'h3',
};

export function SectionHeader({ title, description, ctaLabel, ctaHref, kicker, headingLevel = 2 }: SectionHeaderProps) {
  const HeadingTag = headingTags[headingLevel];

  return (
    <div className="section-header">
      <div className="section-header-copy">
        {kicker ? <span className="section-kicker">{kicker}</span> : null}
        <HeadingTag>{title}</HeadingTag>
        {description ? <p>{description}</p> : null}
      </div>

      {ctaLabel && ctaHref ? (
        <a className="section-link" href={ctaHref}>
          <span>{ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </div>
  );
}
