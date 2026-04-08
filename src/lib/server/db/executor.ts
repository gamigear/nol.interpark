import type { Sql, ParameterOrFragment } from 'postgres';
import { getDbClient } from '@/lib/server/db/client';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';

export type DbQueryResult<T> = T[];
export type DbQueryArgs = readonly unknown[] | undefined;

export type DbExecutor = {
  sql: Sql;
  query: <TRow extends Record<string, unknown> = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: ParameterOrFragment<never>[]
  ) => Promise<DbQueryResult<TRow>>;
};

export function createDbExecutor(intent: DatabaseConnectionIntent = 'runtime'): DbExecutor {
  const sql = getDbClient(intent);

  return {
    sql,
    async query<TRow extends Record<string, unknown> = Record<string, unknown>>(
      strings: TemplateStringsArray,
      ...values: ParameterOrFragment<never>[]
    ): Promise<DbQueryResult<TRow>> {
      const result = await sql(strings, ...values);
      return result as unknown as DbQueryResult<TRow>;
    },
  };
}
