import type { PublicShellData } from '@/lib/server/navigation/query';
import { isPublicChromeLocale, type PublicChromeLocale } from '@/types/home';

type SiteFooterProps = {
  lang: string;
  note?: string;
  shell?: PublicShellData;
};

const fallbackLabels: Record<PublicChromeLocale, string> = {
  en: 'Connected public shell with DB-backed navigation/footer fallback for the demo runtime.',
  ar: 'تم ربط واجهة التنقل والتذييل بمسار بيانات آمن مع بديل احتياطي للعرض التجريبي.',
};

export function SiteFooter({ lang, note, shell }: SiteFooterProps) {
  const resolvedLang: PublicChromeLocale = isPublicChromeLocale(lang) ? lang : 'en';
  const fallbackNote = fallbackLabels[resolvedLang];
  const resolvedNote = note?.trim() || shell?.footerNote?.trim() || fallbackNote;
  const footerGroups = shell?.footerGroups || [];
  const brandLabel = shell?.brandLabel?.trim() || 'world.nol';
  const brandSubtitle = shell?.brandSubtitle?.trim();
  const legalGroup = footerGroups.find((group) => group.kind === 'legal');
  const primaryGroups = footerGroups.filter((group) => group.kind !== 'legal');
  const footerClassName = `site-footer${primaryGroups.length ? ' site-footer--wired' : ' site-footer--fallback'}`;

  return (
    <footer className={footerClassName}>
      <div className="container site-footer-inner" style={{ display: 'grid', gap: 24 }}>
        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(0, 2fr)',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <strong>{brandLabel}</strong>
            {brandSubtitle ? <span style={{ opacity: 0.8 }}>{brandSubtitle}</span> : null}
            <span>{resolvedNote}</span>
            {shell?.usedFallback ? (
              <small style={{ opacity: 0.72 }}>Showing fallback navigation and footer content for this locale.</small>
            ) : shell?.footerGroups?.length ? (
              <small style={{ opacity: 0.72 }}>Links and legal notes are being served from the live navigation/footer source.</small>
            ) : shell?.brandSubtitle ? null : (
              <small style={{ opacity: 0.72 }}>Footer links are not available yet for this locale.</small>
            )}
          </div>

          {primaryGroups.length ? (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {primaryGroups.map((group) => (
                <div key={group.id} style={{ display: 'grid', gap: 8 }}>
                  <strong>{group.title}</strong>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {group.links.map((link) => (
                      <a key={link.id} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noreferrer' : undefined}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {legalGroup?.links.length ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.12)',
              alignItems: 'center',
            }}
          >
            <strong style={{ marginRight: 8 }}>{legalGroup.title}</strong>
            {legalGroup.links.map((link) => (
              <a key={link.id} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noreferrer' : undefined}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
