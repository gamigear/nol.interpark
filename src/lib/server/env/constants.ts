export const ENV_NAMES = {
  nodeEnv: 'NODE_ENV',
  appUrl: 'NEXT_PUBLIC_APP_URL',
  defaultLocale: 'NEXT_PUBLIC_DEFAULT_LOCALE',
  supportedLocales: 'NEXT_PUBLIC_SUPPORTED_LOCALES',
  databaseUrl: 'DATABASE_URL',
  databaseDirectUrl: 'DATABASE_DIRECT_URL',
  databaseProvider: 'DATABASE_PROVIDER',
  databaseBranch: 'DATABASE_BRANCH',
  databaseSslMode: 'DATABASE_SSL_MODE',
  adminAuthMode: 'ADMIN_AUTH_MODE',
  adminSessionCookieName: 'ADMIN_SESSION_COOKIE_NAME',
  adminSessionCookieSecure: 'ADMIN_SESSION_COOKIE_SECURE',
  adminSessionTtlSeconds: 'ADMIN_SESSION_TTL_SECONDS',
  adminSessionSecret: 'ADMIN_SESSION_SECRET',
  adminAllowedEmailDomains: 'ADMIN_ALLOWED_EMAIL_DOMAINS',
  adminBootstrapEmail: 'ADMIN_BOOTSTRAP_EMAIL',
  adminBootstrapName: 'ADMIN_BOOTSTRAP_NAME',
  adminBootstrapRole: 'ADMIN_BOOTSTRAP_ROLE',
  authTrustHost: 'AUTH_TRUST_HOST',
  authUrl: 'AUTH_URL',
  authSecret: 'AUTH_SECRET',
  vercelEnv: 'VERCEL_ENV',
  vercelProductionUrl: 'VERCEL_PROJECT_PRODUCTION_URL',
  vercelGitCommitRef: 'VERCEL_GIT_COMMIT_REF',
  mediaStorageProvider: 'MEDIA_STORAGE_PROVIDER',
  blobReadWriteToken: 'BLOB_READ_WRITE_TOKEN',
  revalidateSecret: 'REVALIDATE_SECRET',
} as const;

export const DEFAULT_SUPPORTED_LOCALES = ['en', 'ko'] as const;
export const DEFAULT_DEFAULT_LOCALE = 'en';

export type EnvName = (typeof ENV_NAMES)[keyof typeof ENV_NAMES];
