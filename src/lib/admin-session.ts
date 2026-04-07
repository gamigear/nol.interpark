import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_AUTH_REDIRECTS, ADMIN_SESSION_COOKIE, isValidAdminSessionValue } from '@/lib/admin-auth';
import { getAdminAuthConfig } from '@/lib/server/auth/config';
import { verifySessionToken, type AdminSessionPayload } from '@/lib/server/auth/session';
import { hasPermission, type AdminPermission } from '@/lib/server/auth/rbac';

export type AdminActorSource = 'mock-session-bootstrap' | 'provider-session' | 'token-session';

export type AdminActor = {
  id: string;
  name: string;
  email?: string;
  role: string;
  source: AdminActorSource;
};

export type AdminSession = {
  actor: AdminActor;
  payload?: AdminSessionPayload;
};

function buildAdminActorFallback(): AdminActor {
  const authConfig = getAdminAuthConfig();

  return {
    id: authConfig.bootstrapUser.email ?? 'bootstrap-admin',
    name: authConfig.bootstrapUser.name ?? 'Admin User',
    email: authConfig.bootstrapUser.email,
    role: authConfig.bootstrapUser.role ?? 'super_admin',
    source: 'mock-session-bootstrap',
  };
}

async function readAdminSessionCookieValue(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
}

/**
 * Hydrate an AdminSession from a signed token payload.
 * Falls back to bootstrap actor if the token is invalid but the cookie
 * passes the legacy mock check (backward compat during transition).
 */
function buildSessionFromPayload(payload: AdminSessionPayload): AdminSession {
  return {
    actor: {
      id: payload.userId,
      name: payload.name ?? payload.email ?? 'Admin',
      email: payload.email,
      role: payload.role,
      source: 'token-session',
    },
    payload,
  };
}

function buildMockAdminSession(): AdminSession {
  return {
    actor: buildAdminActorFallback(),
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect(ADMIN_AUTH_REDIRECTS.signIn);
  }

  return session;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const sessionValue = await readAdminSessionCookieValue();

  if (!isValidAdminSessionValue(sessionValue)) {
    return null;
  }

  // Try to parse as a real signed token first
  if (sessionValue && sessionValue.includes(':')) {
    const payload = verifySessionToken(sessionValue);
    if (payload) {
      return buildSessionFromPayload(payload);
    }
  }

  // Fall back to mock session for backward compat (mock mode + legacy cookie)
  return buildMockAdminSession();
}

/**
 * Server-side RBAC guard.
 * Redirects to dashboard if the current session lacks the required permission.
 */
export async function requireAdminPermission(permission: AdminPermission): Promise<AdminSession> {
  const session = await requireAdminSession();

  if (!hasPermission(session.actor.role, permission)) {
    // Insufficient permissions — redirect to dashboard with a note
    // In a full implementation, show a 403 page instead
    redirect(`${ADMIN_AUTH_REDIRECTS.dashboard}?error=insufficient_permissions`);
  }

  return session;
}

/**
 * Check if the current session has a permission (non-redirecting).
 */
export async function checkAdminPermission(permission: AdminPermission): Promise<boolean> {
  const session = await getAdminSession();
  if (!session) return false;
  return hasPermission(session.actor.role, permission);
}
