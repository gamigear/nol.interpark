import Link from 'next/link';

type AdminAuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AdminAuthCard({ eyebrow, title, description, children, footer }: AdminAuthCardProps) {
  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card">
        <p className="admin-auth-card__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="admin-auth-card__description">{description}</p>
        <div className="admin-auth-card__body">{children}</div>
        {footer ? <div className="admin-auth-card__footer">{footer}</div> : null}
      </div>

      <aside className="admin-auth-aside">
        <p className="admin-auth-aside__eyebrow">world.nol CMS</p>
        <h2>Admin shell foundation</h2>
        <p>
          Placeholder auth pages để tách admin surface khỏi public app ngay từ đầu. Khi auth thật
          sẵn sàng, khu này chỉ cần thay form handling và session wiring.
        </p>
        <p>
          <strong>Operator note:</strong> Use sign-in for normal access. Forgot/reset flows stay as
          support entry points until the production auth provider is fully wired.
        </p>
        <div className="admin-auth-aside__links">
          <Link href="/admin/sign-in">Sign in</Link>
          <Link href="/admin/forgot-password">Forgot password</Link>
          <Link href="/admin/reset-password">Reset password</Link>
        </div>
        <p className="admin-auth-aside__hint">
          Need a quick check? Start with <strong>Sign in</strong>. Use the other routes only to verify auth copy and URL handoff while reset logic is still placeholder-only.
        </p>
        <p className="admin-auth-aside__hint">
          If you only need access confirmation, return to <strong>Sign in</strong> instead of cycling through recovery steps.
        </p>
        <p className="admin-auth-aside__hint">
          Expected session behavior: once sign-in is successful, protected admin routes should open without showing this auth shell again.
        </p>
        <p className="admin-auth-aside__hint">
          Demo tip: if a route sends you back here unexpectedly, verify the session cookie first before assuming the page itself is broken.
        </p>
        <p className="admin-auth-aside__hint">
          Admin demo scope: authentication pages show access flow only — content editing confidence still comes from the protected Homepage, Navigation, and Promos routes.
        </p>
      </aside>
    </div>
  );
}
