import type { PublicInfoCard } from '@/lib/server/public-content';
import type { PublicMetaItem } from '@/components/layout/public-meta-list';

export type RouteBreadcrumbItem = {
  label: string;
  href?: string;
};

export type RouteCtaTarget = {
  ctaLabel?: string;
  ctaHref?: string;
};

export type RouteLabelTarget = {
  title: string;
  description?: string;
};

export type PublicRouteEmptyState = RouteLabelTarget & RouteCtaTarget;

export type RouteMetaCollection = {
  metaItems?: PublicMetaItem[];
};

export type PublicRouteHero = RouteLabelTarget & {
  eyebrow: string;
  breadcrumbs: RouteBreadcrumbItem[];
} & RouteMetaCollection;

export type PublicRouteSectionHeader = RouteLabelTarget & {
  kicker?: string;
} & RouteCtaTarget;

export type PublicRouteChromeProps = {
  hero: PublicRouteHero;
  sectionHeader?: PublicRouteSectionHeader;
  introCards?: PublicInfoCard[];
  collectionMetaItems?: PublicMetaItem[];
  emptyState?: PublicRouteEmptyState;
};
