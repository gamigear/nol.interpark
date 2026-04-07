import type { ReactNode } from 'react';
import { AdminSidebar } from './admin-sidebar';

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const hints = [
    'CMS changes here stay internal until routed through public rendering or publish flow.',
    'Operator view: use the sidebar for module jumps and treat this shell as a staging workspace before content appears on the public site.',
    'Demo rule: if a module feels unstable, fall back to Homepage or Navigation first before opening deeper editors live.',
    'Quick check: save feedback in each module is the safest signal before opening the public site for spot-checks.',
  ];

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-shell__content" role="main" aria-label="Admin workspace">
        {hints.map((hint) => (
          <p key={hint} className="admin-shell__hint">
            {hint}
          </p>
        ))}
        {children}
      </div>
    </div>
  );
}
