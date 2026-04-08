import type { PublicShellData, PublicShellFooterGroup, PublicShellNavLink } from './query';
import type { PublicChromeLocale } from '@/types/home';

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

export function createFallbackShellData(locale: PublicChromeLocale): PublicShellData {
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
    ] as PublicShellFooterGroup[],
    footerNote: copy.footerNote,
    usedFallback: true,
  };
}
