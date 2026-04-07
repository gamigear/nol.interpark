import Link from 'next/link';
import { AdminAuthCard } from '@/components/admin/auth/admin-auth-card';

export default function AdminForgotPasswordPage() {
  return (
    <AdminAuthCard
      eyebrow="Forgot password"
      title="Reset flow placeholder"
      description="Trang này giữ chỗ cho password reset flow nội bộ. Ở phase sau chỉ cần nối provider hoặc email action thật."
      footer={
        <>
          <Link href="/admin/sign-in">Back to sign in</Link>
          <span className="admin-auth-card__footer-divider">·</span>
          <Link href="/en" className="admin-auth-card__footer-subtle">
            Back to public homepage
          </Link>
        </>
      }
    >
      <div className="admin-auth-message">
        <p>
          MVP shell chưa gửi email thật. Khi auth stack được chọn, route này sẽ nhận email và trigger
          reset instructions cho admin users.
        </p>
        <p>
          <strong>Operator note:</strong> Use this page only as a handoff checkpoint for future auth work. Password reset emails, tokens, and expiry rules are still placeholder-only.
        </p>
        <p>
          <strong>Accessibility note:</strong> Keep the recovery copy short and scannable — this screen is meant to reassure operators quickly, not explain the full auth flow.
        </p>
      </div>
    </AdminAuthCard>
  );
}
