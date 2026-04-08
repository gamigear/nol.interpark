/**
 * DB runtime bootstrap — entrypoint cho server-side usage.
 *
 * Export 3 binding chính:
 * - db       : pooled connection, dùng cho runtime queries (Next.js server components, route handlers)
 * - dbAdmin  : direct connection, dùng cho migration / admin tooling
 * - dbHealth : health snapshot để check trạng thái connection
 *
 * Các module khác chỉ cần import từ file này, không cần biết driver internals.
 */

export { getDbClient } from './client';
export { closeDbSql } from './driver';
export { createDbExecutor } from './executor';
export { getDatabaseConfig, getDatabaseConnectionString, getDatabaseHealthSnapshot, createDatabaseClientPlaceholder } from './config';
export type { DbClient } from './client';
export type { DbExecutor, DbQueryResult } from './executor';
export type * from './types';
export type * from './schema-types';

// ── Real runtime bindings (lazy) ──────────────────────────────────

import { getDbClient, type DbClient } from './client';
import { createDbExecutor, type DbExecutor } from './executor';
import { getDatabaseConfig, getDatabaseHealthSnapshot, getDatabaseConnectionString } from './config';
import type { DatabaseConnectionIntent } from './types';

/**
 * Full binding cho một connection intent.
 * Bao gồm: raw Sql client, typed executor, config, health.
 */
export interface DbBinding {
  /** Raw postgres-js Sql instance — dùng cho tagged template literal queries */
  readonly sql: DbClient;
  /** Typed executor wrapper — db.executor.query<T>`SELECT ...` */
  readonly executor: DbExecutor;
  /** Pooled hoặc direct connection string */
  readonly connectionString: string | undefined;
  /** Database config snapshot */
  readonly config: ReturnType<typeof getDatabaseConfig>;
  /** Health snapshot (không ping DB, chỉ kiểm tra cấu hình) */
  readonly health: ReturnType<typeof getDatabaseHealthSnapshot>;
}

/** Internal cache — connection chỉ được tạo khi lần đầu truy cập */
const _bindingCache = new Map<DatabaseConnectionIntent, DbBinding>();

function getOrCreateBinding(intent: DatabaseConnectionIntent): DbBinding {
  if (!_bindingCache.has(intent)) {
    _bindingCache.set(intent, {
      sql: getDbClient(intent),
      executor: createDbExecutor(intent),
      connectionString: getDatabaseConnectionString(intent),
      config: getDatabaseConfig(intent),
      health: getDatabaseHealthSnapshot(intent),
    });
  }
  return _bindingCache.get(intent)!;
}

/**
 * db — pooled connection cho runtime queries.
 *
 * Usage:
 *   import { db } from '@/lib/server/db';
 *   const rows = await db.sql`SELECT * FROM locales WHERE is_active = true`;
 *   // hoặc qua executor:
 *   const result = await db.executor.query<{ id: string }>(db.sql`SELECT id FROM locales`);
 */
export const db = new Proxy({} as DbBinding, {
  get(_target, prop) {
    return Reflect.get(getOrCreateBinding('runtime'), prop);
  },
});

/** @deprecated Use `db` instead — kept for backward compatibility */
export const dbRuntime = db;

/**
 * dbAdmin — direct connection cho migration / tooling / admin operations.
 *
 * Usage:
 *   import { dbAdmin } from '@/lib/server/db';
 *   await dbAdmin.sql`ALTER TABLE ...`;
 */
export const dbAdmin = new Proxy({} as DbBinding, {
  get(_target, prop) {
    return Reflect.get(getOrCreateBinding('tooling'), prop);
  },
});

/**
 * dbHealth — health snapshot cho cả hai intent.
 * Dùng cho /api/health endpoint hoặc startup check.
 * Không tạo connection, chỉ đọc config.
 */
export const dbHealth = {
  runtime: getDatabaseHealthSnapshot('runtime'),
  tooling: getDatabaseHealthSnapshot('tooling'),
};
