import type { Sql } from 'postgres';
import { getDbSql } from '@/lib/server/db/driver';
import type { DatabaseConnectionIntent } from '@/lib/server/db/types';

export type DbClient = Sql;

export function getDbClient(intent: DatabaseConnectionIntent = 'runtime'): DbClient {
  return getDbSql(intent);
}
