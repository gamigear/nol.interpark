import { getServerEnv } from '@/lib/server/env';
import type {
  DatabaseClientPlaceholder,
  DatabaseConfig,
  DatabaseConnectionIntent,
  DatabaseConnectionMode,
  DatabaseHealthSnapshot,
  DatabaseProvider,
  DatabaseDriverAdapter,
} from './types';

function resolveMode(intent: DatabaseConnectionIntent): DatabaseConnectionMode {
  return intent === 'runtime' ? 'pooled' : 'direct';
}

function normalizeProvider(provider: string): DatabaseProvider {
  switch (provider) {
    case 'neon':
    case 'postgresql':
    case 'rds':
      return provider;
    default:
      return 'unknown';
  }
}

function resolveAdapter(provider: DatabaseProvider, runtimeUrl?: string, directUrl?: string): DatabaseDriverAdapter {
  if (!provider || provider === 'unknown') return 'unconfigured';
  if (!runtimeUrl && !directUrl) return 'unconfigured';

  switch (provider) {
    case 'neon':
      return 'neon-http';
    case 'postgresql':
    case 'rds':
      return 'pg';
    default:
      return 'unconfigured';
  }
}

export function getDatabaseConfig(intent: DatabaseConnectionIntent = 'runtime'): DatabaseConfig {
  const env = getServerEnv();
  const provider = normalizeProvider(env.database.provider);
  const defaultMode = resolveMode(intent);
  const adapter = resolveAdapter(provider, env.database.pooledUrl, env.database.directUrl);

  return {
    provider,
    branch: env.database.branch,
    sslMode: env.database.sslMode,
    runtimeUrl: env.database.pooledUrl,
    directUrl: env.database.directUrl,
    defaultIntent: intent,
    defaultMode,
    adapter,
  };
}

export function getDatabaseConnectionString(intent: DatabaseConnectionIntent = 'runtime') {
  const config = getDatabaseConfig(intent);
  return config.defaultMode === 'pooled' ? config.runtimeUrl : config.directUrl;
}

export function getDatabaseHealthSnapshot(
  intent: DatabaseConnectionIntent = 'runtime',
): DatabaseHealthSnapshot {
  const config = getDatabaseConfig(intent);

  return {
    configured: Boolean(config.runtimeUrl || config.directUrl),
    provider: config.provider,
    adapter: config.adapter,
    defaultMode: config.defaultMode,
    runtimeUrlAvailable: Boolean(config.runtimeUrl),
    directUrlAvailable: Boolean(config.directUrl),
    branch: config.branch,
  };
}

export function createDatabaseClientPlaceholder(
  intent: DatabaseConnectionIntent = 'runtime',
): DatabaseClientPlaceholder {
  const config = getDatabaseConfig(intent);

  return {
    kind: 'database-client-placeholder',
    adapter: config.adapter,
    mode: config.defaultMode,
    intent,
    note:
      config.defaultMode === 'pooled'
        ? 'Dùng pooled connection cho serverless runtime trên Vercel. Gắn driver/ORM thật ở phase tiếp theo.'
        : 'Dùng direct connection cho migration/tooling. Gắn driver/ORM thật ở phase tiếp theo.',
  };
}
