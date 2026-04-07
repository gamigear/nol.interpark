import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/sections/section-header';
import { SectionShell } from '@/components/sections/section-shell';
import { PublicEmptyState } from '@/components/layout/public-empty-state';
import type { PublicRouteEmptyState, PublicRouteSectionHeader } from '@/components/layout/public-route-chrome';

type PublicPageSectionProps = PublicRouteSectionHeader & {
  children?: ReactNode;
  isEmpty?: boolean;
  emptyState?: PublicRouteEmptyState;
  tone?: 'default' | 'plain';
  compactEmptyState?: boolean;
  emptyStateNote?: string;
  headingLevel?: 2 | 3;
};

export function PublicPageSection({
  title,
  description,
  kicker,
  ctaLabel,
  ctaHref,
  children,
  isEmpty = false,
  emptyState,
  tone = 'default',
  compactEmptyState = false,
  emptyStateNote,
  headingLevel = 3,
}: PublicPageSectionProps) {
  return (
    <SectionShell tone={tone}>
      <SectionHeader
        title={title}
        description={description}
        kicker={kicker}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        headingLevel={headingLevel}
      />
      {isEmpty ? (
        emptyState ? (
          <PublicEmptyState
            title={emptyState.title}
            description={emptyState.description}
            ctaLabel={emptyState.ctaLabel}
            ctaHref={emptyState.ctaHref}
            compact={compactEmptyState}
            note={emptyStateNote}
            eyebrow={kicker}
            ctaHint={emptyState.ctaHref ? `This action takes you to ${emptyState.ctaHref}.` : undefined}
          />
        ) : null
      ) : (
        children
      )}
    </SectionShell>
  );
}
