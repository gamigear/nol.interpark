import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/layout/admin-shell';
import { requireAdminSession } from '@/lib/admin-session';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}
