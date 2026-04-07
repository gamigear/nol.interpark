import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getPublicShellData } from '@/lib/server/navigation/query';
import { isPublicChromeRtlLocale } from '@/types/home';

type LangLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const dir = isPublicChromeRtlLocale(lang) ? 'rtl' : 'ltr';
  const shell = await getPublicShellData(lang);

  return (
    <div className="page-shell" lang={lang} dir={dir} data-public-locale={lang} data-public-dir={dir} data-shell-fallback={shell.usedFallback ? 'true' : 'false'}>
      <SiteHeader lang={lang} shell={shell} />
      <main data-public-surface="content" aria-label={`${lang} public content`}>{children}</main>
      <SiteFooter lang={lang} shell={shell} />
    </div>
  );
}
