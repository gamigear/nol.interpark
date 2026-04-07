import type { PublicShellData } from '@/lib/server/navigation/query';
import { isPublicChromeLocale, type PublicChromeLocale } from '@/types/home';

type SiteHeaderProps = {
  lang: string;
  shell?: PublicShellData;
};

const fallbackLabels: Record<PublicChromeLocale, {
  subtitle: string;
  signIn: string;
  planTrip: string;
  stories: string;
}> = {
  en: {
    subtitle: 'Smart city discovery',
    signIn: 'Sign in',
    planTrip: 'Plan your trip',
    stories: 'Stories',
  },
  ar: {
    subtitle: 'اكتشف المدينة بذكاء',
    signIn: 'تسجيل الدخول',
    planTrip: 'خطط لرحلتك',
    stories: 'القصص',
  },
};

const fallbackHref = {
  home: (lang: string) => `/${lang}`,
  tickets: (lang: string) => `/${lang}/tickets`,
  stories: (lang: string) => `/${lang}/stories/dubai-first-timer-guide`,
};

export function SiteHeader({ lang, shell }: SiteHeaderProps) {
  const resolvedLang: PublicChromeLocale = isPublicChromeLocale(lang) ? lang : 'en';
  const copy = fallbackLabels[resolvedLang];

  const brandLabel = shell?.brandLabel || 'world.nol';
  const brandSubtitle = shell?.brandSubtitle || copy.subtitle;
  const primaryLinks = shell?.primary || [];
  const secondaryLinks = shell?.secondary || [];
  const signInLink =
    secondaryLinks.find((link) => link.id === 'sign-in') ||
    secondaryLinks.find((link) => /sign|login|account/i.test(link.id) || /sign|login|account/i.test(link.label)) ||
    secondaryLinks[0];
  const primaryAction =
    secondaryLinks.find((link) => link.id === 'plan-trip') ||
    secondaryLinks.find((link) => /plan|book|ticket/i.test(link.id) || /plan|book|ticket/i.test(link.label)) ||
    secondaryLinks.find((link) => link.id !== signInLink?.id) ||
    primaryLinks[0];
  const homeHref = `/${resolvedLang}`;
  const headerClassName = `site-header${primaryLinks.length ? ' site-header--wired' : ' site-header--fallback'}`;

  return (
    <header className={headerClassName}>
      <div className="container site-header-inner">
        <a className="site-brand" href={homeHref} aria-label="nol world home">
          <span className="site-brand-mark" aria-hidden="true">
            nol
          </span>
          <span className="site-brand-copy">
            <span className="site-brand-label">{brandLabel}</span>
            <span className="site-brand-subtitle">{brandSubtitle}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {primaryLinks.length ? (
            primaryLinks.map((link) => (
              <a key={link.id} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noreferrer' : undefined} aria-label={link.label}>
                {link.label}
              </a>
            ))
          ) : (
            <>
              <a href={fallbackHref.home(resolvedLang)} aria-label={`${brandLabel}: homepage`}>{brandLabel}</a>
              <a href={fallbackHref.tickets(resolvedLang)} aria-label={`${copy.planTrip}: tickets`}>{copy.planTrip}</a>
              <a href={fallbackHref.stories(resolvedLang)} aria-label={`${copy.stories}: stories`}>{copy.stories}</a>
            </>
          )}
        </nav>

        <div className="site-actions">
          <a className="site-action-link" href={signInLink?.href || fallbackHref.stories(resolvedLang)} target={signInLink?.target} rel={signInLink?.target === '_blank' ? 'noreferrer' : undefined} aria-label={`${signInLink?.label || copy.signIn}: account or sign-in`}>
            {signInLink?.label || copy.signIn}
          </a>
          <a className="site-action-button" href={primaryAction?.href || fallbackHref.tickets(resolvedLang)} target={primaryAction?.target} rel={primaryAction?.target === '_blank' ? 'noreferrer' : undefined} aria-label={`${primaryAction?.label || copy.planTrip}: primary public action`}>
            {primaryAction?.label || copy.planTrip}
          </a>
        </div>
      </div>
    </header>
  );
}
