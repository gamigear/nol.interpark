import { getServerEnv } from '@/lib/server/env';

export type AdminAuthMode = 'mock' | 'credentials' | 'external';
export type AdminRole = 'super_admin' | 'editor' | 'translator' | 'analyst';

export type AdminBootstrapUser = {
  email?: string;
  name?: string;
  role?: AdminRole | string;
};

export type AdminAuthConfig = {
  mode: AdminAuthMode;
  sessionCookieName: string;
  sessionCookieSecure: boolean;
  sessionTtlSeconds: number;
  sessionSecret?: string;
  allowedEmailDomains: string[];
  bootstrapUser: AdminBootstrapUser;
  authUrl?: string;
  authSecret?: string;
  trustHost: boolean;
};

export function getAdminAuthConfig(): AdminAuthConfig {
  const env = getServerEnv();

  return {
    mode: env.adminAuth.mode,
    sessionCookieName: env.adminAuth.sessionCookieName,
    sessionCookieSecure: env.adminAuth.sessionCookieSecure,
    sessionTtlSeconds: env.adminAuth.sessionTtlSeconds,
    sessionSecret: env.adminAuth.sessionSecret,
    allowedEmailDomains: env.adminAuth.allowedEmailDomains,
    bootstrapUser: {
      email: env.adminAuth.bootstrapEmail,
      name: env.adminAuth.bootstrapName,
      role: env.adminAuth.bootstrapRole,
    },
    authUrl: env.adminAuth.authUrl,
    authSecret: env.adminAuth.authSecret,
    trustHost: env.adminAuth.trustHost,
  };
}
