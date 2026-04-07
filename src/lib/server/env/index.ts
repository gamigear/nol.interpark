import { DEFAULT_DEFAULT_LOCALE, DEFAULT_SUPPORTED_LOCALES, ENV_NAMES } from './constants';

function readString(name: string) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function readBoolean(name: string, fallback = false) {
  const value = readString(name).toLowerCase();
  if (!value) return fallback;
  return value === '1' || value === 'true' || value === 'yes' || value === 'on';
}

function readNumber(name: string, fallback: number) {
  const value = Number(readString(name));
  return Number.isFinite(value) ? value : fallback;
}

function readCsv(name: string, fallback: readonly string[]) {
  const value = readString(name);
  if (!value) return [...fallback];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function isServerEnv() {
  return typeof window === 'undefined';
}

export type AppRuntimeEnv = {
  nodeEnv: string;
  appUrl: string;
  defaultLocale: string;
  supportedLocales: string[];
  vercelEnv: string;
  vercelProductionUrl?: string;
  vercelGitCommitRef?: string;
};

export type DatabaseRuntimeEnv = {
  provider: string;
  pooledUrl?: string;
  directUrl?: string;
  branch?: string;
  sslMode?: string;
};

export type AdminAuthRuntimeEnv = {
  mode: 'mock' | 'credentials' | 'external';
  sessionCookieName: string;
  sessionCookieSecure: boolean;
  sessionTtlSeconds: number;
  sessionSecret?: string;
  allowedEmailDomains: string[];
  bootstrapEmail?: string;
  bootstrapName?: string;
  bootstrapRole?: string;
  authUrl?: string;
  authSecret?: string;
  trustHost: boolean;
};

export type ServerEnv = {
  app: AppRuntimeEnv;
  database: DatabaseRuntimeEnv;
  adminAuth: AdminAuthRuntimeEnv;
  media: {
    provider: string;
    blobReadWriteToken?: string;
  };
  revalidate: {
    secret?: string;
  };
};

export function getServerEnv(): ServerEnv {
  if (!isServerEnv()) {
    throw new Error('getServerEnv() chỉ được gọi ở server runtime.');
  }

  return {
    app: {
      nodeEnv: readString(ENV_NAMES.nodeEnv) || 'development',
      appUrl: readString(ENV_NAMES.appUrl) || 'http://localhost:3000',
      defaultLocale: readString(ENV_NAMES.defaultLocale) || DEFAULT_DEFAULT_LOCALE,
      supportedLocales: readCsv(ENV_NAMES.supportedLocales, DEFAULT_SUPPORTED_LOCALES),
      vercelEnv: readString(ENV_NAMES.vercelEnv) || 'development',
      vercelProductionUrl: readString(ENV_NAMES.vercelProductionUrl) || undefined,
      vercelGitCommitRef: readString(ENV_NAMES.vercelGitCommitRef) || undefined,
    },
    database: {
      provider: readString(ENV_NAMES.databaseProvider) || 'neon',
      pooledUrl: readString(ENV_NAMES.databaseUrl) || undefined,
      directUrl: readString(ENV_NAMES.databaseDirectUrl) || undefined,
      branch: readString(ENV_NAMES.databaseBranch) || undefined,
      sslMode: readString(ENV_NAMES.databaseSslMode) || undefined,
    },
    adminAuth: {
      mode: (readString(ENV_NAMES.adminAuthMode) || 'mock') as AdminAuthRuntimeEnv['mode'],
      sessionCookieName: readString(ENV_NAMES.adminSessionCookieName) || 'world_admin_session',
      sessionCookieSecure: readBoolean(ENV_NAMES.adminSessionCookieSecure, false),
      sessionTtlSeconds: readNumber(ENV_NAMES.adminSessionTtlSeconds, 60 * 60 * 24 * 14),
      sessionSecret: readString(ENV_NAMES.adminSessionSecret) || undefined,
      allowedEmailDomains: readCsv(ENV_NAMES.adminAllowedEmailDomains, []),
      bootstrapEmail: readString(ENV_NAMES.adminBootstrapEmail) || undefined,
      bootstrapName: readString(ENV_NAMES.adminBootstrapName) || undefined,
      bootstrapRole: readString(ENV_NAMES.adminBootstrapRole) || undefined,
      authUrl: readString(ENV_NAMES.authUrl) || undefined,
      authSecret: readString(ENV_NAMES.authSecret) || undefined,
      trustHost: readBoolean(ENV_NAMES.authTrustHost, true),
    },
    media: {
      provider: readString(ENV_NAMES.mediaStorageProvider) || 'vercel_blob',
      blobReadWriteToken: readString(ENV_NAMES.blobReadWriteToken) || undefined,
    },
    revalidate: {
      secret: readString(ENV_NAMES.revalidateSecret) || undefined,
    },
  };
}
