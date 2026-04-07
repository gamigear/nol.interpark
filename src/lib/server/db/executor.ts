import type { Sql } from 'postgres';
import { getDbClient } from '@/lib/server/db/client';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';

export type DbQueryResult<T> = T[];
export type DbQueryArgs = readonly unknown[] | undefined;

export type DbExecutor = {
  sql: Sql;
  query: <T = unknown>(strings: TemplateStringsArray, ...values: unknown[]) => Promise<DbQueryResult<T>>;
};

export function createDbExecutor(intent: DatabaseConnectionIntent = 'runtime'): DbExecutor {
  const sql = getDbClient(intent);

  return {
    sql,
    async query<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<DbQueryResult<T>> {
      const result = await sql(strings, ...values);
      return result as unknown as DbQueryResult<T>;
    },
  };
}
