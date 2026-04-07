import type { Sql } from 'postgres';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';
import { getDatabaseConfig, getDatabaseConnectionString } from '@/lib/server/db/config';

const sqlCache: Partial<Record<DatabaseConnectionIntent, Sql>> = {};

function loadPostgresDriver() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('postgres');
  } catch (error) {
    throw new Error(
      "[db] Missing dependency 'postgres'. Install it (e.g. `npm i postgres`) or switch to a configured driver.",
    );
  }
}

export function getDbSql(intent: DatabaseConnectionIntent = 'runtime'): Sql {
  if (sqlCache[intent]) {
    return sqlCache[intent] as Sql;
  }

  const connectionString = getDatabaseConnectionString(intent);
  const config = getDatabaseConfig(intent);

  if (!connectionString) {
    throw new Error(
      `[db] Missing connection string for intent=${intent}. Set DATABASE_URL (runtime) and DATABASE_DIRECT_URL (tooling/migration).`,
    );
  }

  const postgres = loadPostgresDriver();
  const sql: Sql = postgres(connectionString, {
    max: intent === 'runtime' ? 2 : 4,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: config.sslMode || undefined,
  });

  sqlCache[intent] = sql;
  return sql;
}

export async function closeDbSql(intent: DatabaseConnectionIntent = 'runtime') {
  const cached = sqlCache[intent];
  if (cached) {
    await (cached as any).end?.();
    delete sqlCache[intent];
  }
}
