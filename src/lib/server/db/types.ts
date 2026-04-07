export type DatabaseProvider = 'neon' | 'postgresql' | 'rds' | 'unknown';
export type DatabaseConnectionIntent = 'runtime' | 'migration' | 'tooling';
export type DatabaseConnectionMode = 'pooled' | 'direct';

export type DatabaseDriverAdapter = 'unconfigured' | 'pg' | 'postgres-js' | 'neon-http' | 'drizzle';

export type DatabaseConfig = {
  provider: DatabaseProvider;
  branch?: string;
  sslMode?: string;
  runtimeUrl?: string;
  directUrl?: string;
  defaultIntent: DatabaseConnectionIntent;
  defaultMode: DatabaseConnectionMode;
  adapter: DatabaseDriverAdapter;
};

export type DatabaseHealthSnapshot = {
  configured: boolean;
  provider: DatabaseProvider;
  adapter: DatabaseDriverAdapter;
  defaultMode: DatabaseConnectionMode;
  runtimeUrlAvailable: boolean;
  directUrlAvailable: boolean;
  branch?: string;
};

export type DatabaseClientPlaceholder = {
  kind: 'database-client-placeholder';
  adapter: DatabaseDriverAdapter;
  mode: DatabaseConnectionMode;
  intent: DatabaseConnectionIntent;
  note: string;
};
