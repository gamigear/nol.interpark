import { fetchNavigationBlocks } from './repository-db';
import { isPublicChromeLocale, type PublicChromeLocale } from '@/types/home';
import type {
  ContentBlockItemRecord,
  ContentBlockLocalizationRecord,
  ContentBlockRecord,
} from '@/lib/server/db/schema-types';

export type PublicShellNavLink = {
  id: string;
  label: string;
  href: string;
  target?: '_self' | '_blank';
  badge?: string;
};

export type PublicShellFooterGroup = {
  id: string;
  title: string;
  kind: 'info' | 'support' | 'legal' | 'social' | 'explore';
  links: PublicShellNavLink[];
};

export type PublicShellData = {
  locale: PublicChromeLocale;
  brandLabel: string;
  brandSubtitle: string;
  primary: PublicShellNavLink[];
  secondary: PublicShellNavLink[];
  footerGroups: PublicShellFooterGroup[];
  footerNote: string;
  usedFallback: boolean;
};

const FALLBACK_COPY: Record<PublicChromeLocale, Pick<PublicShellData, 'brandLabel' | 'brandSubtitle' | 'footerNote'>> = {
  en: {
    brandLabel: 'world.nol',
    brandSubtitle: 'Smart city discovery',
    footerNote: 'Connected public shell with DB-backed navigation/footer fallback for the demo runtime.',
  },
  ar: {
    brandLabel: 'world.nol',
    brandSubtitle: 'اكتشف المدينة بذكاء',
    footerNote: 'تم ربط واجهة التنقل والتذييل بمسار بيانات آمن مع بديل احتياطي للعرض التجريبي.',
  },
};

const FALLBACK_NAV: Record<PublicChromeLocale, { primary: PublicShellNavLink[]; secondary: PublicShellNavLink[] }> = {
  en: {
    primary: [
      { id: 'tickets', label: 'Tickets', href: '/en/tickets' },
      { id: 'top-picks', label: 'Top Picks', href: '/en/top-picks' },
      { id: 'stories', label: 'Stories', href: '/en/stories/dubai-first-timer-guide' },
      { id: 'guides', label: 'Travel Guides', href: '/en/guides' },
    ],
    secondary: [
      { id: 'sign-in', label: 'Sign in', href: '/en/stories/dubai-first-timer-guide' },
      { id: 'plan-trip', label: 'Plan your trip', href: '/en/tickets' },
    ],
  },
  ar: {
    primary: [
      { id: 'tickets', label: 'التذاكر', href: '/ar/tickets' },
      { id: 'top-picks', label: 'اختياراتنا', href: '/ar/top-picks' },
      { id: 'stories', label: 'القصص', href: '/ar/stories/dubai-first-timer-guide' },
      { id: 'guides', label: 'أدلة السفر', href: '/ar/guides' },
    ],
    secondary: [
      { id: 'sign-in', label: 'تسجيل الدخول', href: '/ar/stories/dubai-first-timer-guide' },
      { id: 'plan-trip', label: 'خطط لرحلتك', href: '/ar/tickets' },
    ],
  },
};

export async function getPublicShellData(locale: string): Promise<PublicShellData> {
  const resolvedLocale: PublicChromeLocale = isPublicChromeLocale(locale) ? locale : 'en';

  try {
    const snapshot = await fetchNavigationBlocks(resolvedLocale, 'runtime');
    const mapped = mapNavigationBlocksToShell(snapshot.blocks, snapshot.blockLocalizations, snapshot.blockItems, resolvedLocale);

    if (!mapped.primary.length && !mapped.footerGroups.length) {
      return createFallbackShellData(resolvedLocale);
    }

    const fallback = createFallbackShellData(resolvedLocale);
    const usedFallback =
      !mapped.brandLabel ||
      !mapped.brandSubtitle ||
      !mapped.primary.length ||
      !mapped.secondary.length ||
      !mapped.footerGroups.length ||
      !mapped.footerNote;

    return {
      locale: resolvedLocale,
      brandLabel: mapped.brandLabel || fallback.brandLabel,
      brandSubtitle: mapped.brandSubtitle || fallback.brandSubtitle,
      primary: mapped.primary.length ? mapped.primary : fallback.primary,
      secondary: mapped.secondary.length ? mapped.secondary : fallback.secondary,
      footerGroups: mapped.footerGroups.length ? mapped.footerGroups : fallback.footerGroups,
      footerNote: mapped.footerNote || fallback.footerNote,
      usedFallback,
    };
  } catch {
    return createFallbackShellData(resolvedLocale);
  }
}

function createFallbackShellData(locale: PublicChromeLocale): PublicShellData {
  const copy = FALLBACK_COPY[locale];
  const nav = FALLBACK_NAV[locale];

  return {
    locale,
    brandLabel: copy.brandLabel,
    brandSubtitle: copy.brandSubtitle,
    primary: nav.primary,
    secondary: nav.secondary,
    footerGroups: [
      {
        id: 'footer-explore',
        kind: 'explore',
        title: locale === 'ar' ? 'استكشف' : 'Explore',
        links: nav.primary,
      },
      {
        id: 'footer-support',
        kind: 'support',
        title: locale === 'ar' ? 'الدعم' : 'Support',
        links: [
          nav.secondary[0],
          { id: 'help', label: locale === 'ar' ? 'المساعدة' : 'Help', href: `/${locale}/guides` },
        ].filter(Boolean) as PublicShellNavLink[],
      },
      {
        id: 'footer-legal',
        kind: 'legal',
        title: locale === 'ar' ? 'قانوني' : 'Legal',
        links: [
          { id: 'privacy', label: locale === 'ar' ? 'الخصوصية' : 'Privacy', href: `/${locale}` },
          { id: 'terms', label: locale === 'ar' ? 'الشروط' : 'Terms', href: `/${locale}` },
        ],
      },
    ],
    footerNote: copy.footerNote,
    usedFallback: true,
  };
}

function mapNavigationBlocksToShell(
  blocks: ContentBlockRecord[],
  blockLocalizations: ContentBlockLocalizationRecord[],
  blockItems: ContentBlockItemRecord[],
  locale: PublicChromeLocale,
) {
  const localizedByBlockId = new Map<string, ContentBlockLocalizationRecord>();

  for (const loc of blockLocalizations) {
    if (loc.localeCode === locale && !localizedByBlockId.has(loc.blockId)) {
      localizedByBlockId.set(loc.blockId, loc);
    }
  }

  for (const loc of blockLocalizations) {
    if (loc.localeCode === 'en' && !localizedByBlockId.has(loc.blockId)) {
      localizedByBlockId.set(loc.blockId, loc);
    }
  }

  const itemsByBlockId = new Map<string, ContentBlockItemRecord[]>();
  for (const item of blockItems) {
    const list = itemsByBlockId.get(item.blockId);
    if (list) list.push(item);
    else itemsByBlockId.set(item.blockId, [item]);
  }

  const navBlocks = blocks
    .filter((block) => block.blockType === 'nav_highlight' && block.status === 'published')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const primaryBlock = navBlocks.find((block) => block.key === 'header-primary') ?? navBlocks[0];
  const secondaryBlock = navBlocks.find((block) => block.key === 'header-secondary') ?? navBlocks[1];
  const footerBlocks = navBlocks
    .filter((block) => block.key?.startsWith('footer-'))
    .sort((a, b) => footerGroupRank(a.key) - footerGroupRank(b.key) || a.displayOrder - b.displayOrder);
  const brandBlock = navBlocks.find((block) => block.key === 'header-brand');
  const footerLegalBlock = navBlocks.find((block) => block.key === 'footer-legal');

  return {
    brandLabel: localizedByBlockId.get(brandBlock?.id || '')?.title || undefined,
    brandSubtitle: localizedByBlockId.get(brandBlock?.id || '')?.subtitle || undefined,
    primary: mapLinks(itemsByBlockId.get(primaryBlock?.id || '') || []),
    secondary: mapLinks(itemsByBlockId.get(secondaryBlock?.id || '') || []),
    footerGroups: footerBlocks
      .map((block) => {
        const kind = inferFooterGroupKind(block.key);
        return {
          id: block.id,
          kind,
          title: localizedByBlockId.get(block.id)?.title || fallbackFooterGroupTitle(kind, locale, block.key),
          links: mapLinks(itemsByBlockId.get(block.id) || []),
        };
      })
      .filter((group) => group.links.length > 0),
    footerNote:
      localizedByBlockId.get(footerLegalBlock?.id || '')?.subtitle ||
      localizedByBlockId.get(footerLegalBlock?.id || '')?.title ||
      undefined,
  };
}

function mapLinks(items: ContentBlockItemRecord[]): PublicShellNavLink[] {
  return [...items]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((item) => {
      const override = item.overrideJson || {};
      const label = asString(override.label);
      const href = asString(override.href);

      if (!label || !href || href === '#') {
        return null;
      }

      return {
        id: item.itemId || item.id,
        label,
        href,
        target: asOptionalTarget(override.target),
        badge: asOptionalString(override.badge),
      };
    })
    .filter((link): link is PublicShellNavLink => Boolean(link));
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asOptionalTarget(value: unknown): PublicShellNavLink['target'] {
  return value === '_blank' || value === '_self' ? value : undefined;
}

function inferFooterGroupKind(key?: string): PublicShellFooterGroup['kind'] {
  if (!key) return 'explore';
  if (key.includes('support')) return 'support';
  if (key.includes('legal')) return 'legal';
  if (key.includes('social')) return 'social';
  if (key.includes('info') || key.includes('about')) return 'info';
  return 'explore';
}

function footerGroupRank(key?: string) {
  const order: PublicShellFooterGroup['kind'][] = ['explore', 'info', 'support', 'social', 'legal'];
  return order.indexOf(inferFooterGroupKind(key));
}

function fallbackFooterGroupTitle(
  kind: PublicShellFooterGroup['kind'],
  locale: PublicChromeLocale,
  key?: string,
) {
  const localized: Record<PublicChromeLocale, Record<PublicShellFooterGroup['kind'], string>> = {
    en: {
      explore: 'Explore',
      info: 'About',
      support: 'Support',
      social: 'Social',
      legal: 'Legal',
    },
    ar: {
      explore: 'استكشف',
      info: 'حول',
      support: 'الدعم',
      social: 'اجتماعي',
      legal: 'قانوني',
    },
  };

  return localized[locale][kind] || key || 'Footer';
}
