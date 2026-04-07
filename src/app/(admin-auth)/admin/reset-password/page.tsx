import Link from 'next/link';
import { AdminAuthCard } from '@/components/admin/auth/admin-auth-card';

export default function AdminResetPasswordPage() {
  return (
    <AdminAuthCard
      eyebrow="Reset password"
      title="New password screen placeholder"
      description="Trang giữ chỗ cho token-based reset flow hoặc magic-link completion."
      footer={<Link href="/admin/sign-in">Back to sign in</Link>}
    >
      <div className="admin-auth-message">
        <p>
          Chưa có token validation hay submit handler thật. Mục tiêu của route này là chốt App Router
          structure và URL contract cho admin auth surface.
        </p>
        <p>
          <strong>Operator note:</strong> Use this route to verify copy and URL handoff only. Password submission, token expiry, and security checks will be wired in a later auth phase.
        </p>
        <p>
          <strong>Next step:</strong> Once auth provider wiring is ready, this screen should be the only place where operators confirm token expiry, password rules, and successful reset completion copy.
        </p>
      </div>
    </AdminAuthCard>
  );
}
