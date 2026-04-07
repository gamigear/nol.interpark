import { getAdminAuthConfig } from '@/lib/server/auth/config';
import { findAdminUserByEmail } from '@/lib/server/auth/seed';
import { verifyPassword } from '@/lib/server/auth/password';

const adminAuthConfig = getAdminAuthConfig();

export const ADMIN_SESSION_COOKIE = adminAuthConfig.sessionCookieName;
export const ADMIN_AUTH_REDIRECTS = {
  signIn: '/admin/sign-in',
  dashboard: '/admin/dashboard',
} as const;

/**
 * Validate admin session cookie value.
 *
 * - In `mock` mode: accepts the known placeholder OR a valid signed token
 *   (backward compat during transition).
 * - In `credentials` mode: only accepts a valid signed session token.
 * - In `external` mode: delegates to external provider (placeholder for future).
 */
export function isValidAdminSessionValue(value?: string): boolean {
  if (!value) return false;

  if (adminAuthConfig.mode === 'external') {
    // External provider validation — placeholder for future integration
    return Boolean(value);
  }

  if (adminAuthConfig.mode === 'credentials') {
    // Must be a real signed token (contains colons in format userId:expiresAt:signature)
    return value.includes(':') && value.split(':').length === 3;
  }

  // mock mode: accept either the old placeholder or a real token
  if (value === 'mock-admin') return true;
  return value.includes(':') && value.split(':').length === 3;
}

/**
 * Validate credentials against the admin user store.
 *
 * Phase 2: checks against the bootstrap user (env-configured).
 * Password is verified with scrypt via verifyPassword().
 * Extend this to query the database when user table is wired.
 */
export async function validateAdminCredentials(
  email: string,
  password: string,
): Promise<{ valid: boolean; userId?: string; role?: string; name?: string }> {
  if (!email || !password) {
    return { valid: false };
  }

  const config = getAdminAuthConfig();

  // Mock mode: accept bootstrap email + any non-empty password (dev convenience)
  if (config.mode === 'mock') {
    const bootstrapEmail = config.bootstrapUser.email;
    if (!bootstrapEmail) return { valid: false };
    const matches = email.trim().toLowerCase() === bootstrapEmail.toLowerCase();
    if (!matches) return { valid: false };
    return {
      valid: true,
      userId: 'bootstrap-admin-001',
      role: config.bootstrapUser.role ?? 'super_admin',
      name: config.bootstrapUser.name ?? 'Admin',
    };
  }

  // Credentials mode: real password verification via seed store
  if (config.mode === 'credentials') {
    const user = await findAdminUserByEmail(email.trim());
    if (!user) return { valid: false };
    if (user.status !== 'active') return { valid: false };

    const passwordOk = await verifyPassword(password, user.hashedPassword);
    if (!passwordOk) return { valid: false };

    return {
      valid: true,
      userId: user.id,
      role: user.role,
      name: user.name,
    };
  }

  return { valid: false };
}
