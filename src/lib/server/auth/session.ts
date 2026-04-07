import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { getAdminAuthConfig } from '@/lib/server/auth/config';

/**
 * Real session token format: {userId}.{expires}.{signature}
 *
 * This replaces the mock-only "magic string" approach with a
 * server-side verifiable token. Still cookie-based, but the
 * cookie value is now a signed token instead of a placeholder.
 */

export type AdminSessionToken = {
  userId: string;
  expiresAt: number;
  signature: string;
};

export type AdminSessionPayload = {
  userId: string;
  role: string;
  email?: string;
  name?: string;
  expiresAt: number;
};

function getSessionSecret(): string {
  const config = getAdminAuthConfig();
  // Fall back to a dev-only hardcoded secret — never use in production.
  const secret = config.sessionSecret;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error(
      'ADMIN_SESSION_SECRET is required in production. Set it in your environment.',
    );
  }
  return secret || 'dev-secret-do-not-use-in-production-change-me';
}

function signToken(payload: string): string {
  const secret = getSessionSecret();
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Create a signed session token string.
 * Format: {userId}:{expiresAt}:{signature}
 */
export function createSessionToken(userId: string, ttlSeconds: number): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const unsignedPayload = `${userId}:${expiresAt}`;
  const signature = signToken(unsignedPayload);
  return `${unsignedPayload}:${signature}`;
}

/**
 * Verify and parse a session token string.
 * Returns the payload if valid and not expired, null otherwise.
 * Uses timing-safe comparison for the signature to prevent timing attacks.
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return null;

    const [userId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (!userId || Number.isNaN(expiresAt)) return null;

    // Check expiry
    if (Date.now() / 1000 > expiresAt) return null;

    // Verify signature with timing-safe comparison
    const unsignedPayload = `${userId}:${expiresAt}`;
    const expectedSignature = signToken(unsignedPayload);

    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const config = getAdminAuthConfig();
    return {
      userId,
      role: config.bootstrapUser.role ?? 'super_admin',
      email: config.bootstrapUser.email,
      name: config.bootstrapUser.name,
      expiresAt,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a random CSRF token for form protection.
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}
