import { getServerEnv } from '@/lib/server/env';
import { hashPassword } from '@/lib/server/auth/password';

/**
 * Bootstrap admin user seed.
 *
 * Creates the initial admin user in the database if it doesn't exist.
 * The password is hashed using the same utility as the credential flow.
 *
 * In production, this should be run as a migration/seed step, not on every request.
 * For now, it's idempotent — checks existence before inserting.
 */

type BootstrapAdminUser = {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  role: string;
  status: 'active' | 'invited' | 'disabled';
};

/**
 * Generate a deterministic bootstrap user with a hashed password.
 * Password is read from env ADMIN_BOOTSTRAP_PASSWORD (default: 'changeme-dev-only').
 */
export async function buildBootstrapAdminUser(): Promise<BootstrapAdminUser> {
  const env = getServerEnv();
  const rawPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'changeme-dev-only';
  const hashedPassword = await hashPassword(rawPassword);

  return {
    id: 'bootstrap-admin-001',
    email: env.adminAuth.bootstrapEmail || 'admin@example.com',
    name: env.adminAuth.bootstrapName || 'Admin User',
    hashedPassword,
    role: env.adminAuth.bootstrapRole || 'super_admin',
    status: 'active',
  };
}

/**
 * Check if the bootstrap admin user has been seeded.
 * This is a placeholder — replace with actual DB query once Drizzle/ORM is wired.
 *
 * For now, we store a flag in a simple JSON file for development.
 */
export async function isBootstrapAdminSeeded(): Promise<boolean> {
  // TODO: Replace with actual DB query: SELECT 1 FROM admin_users WHERE id = 'bootstrap-admin-001'
  // For now, return false to indicate seeding is needed.
  return false;
}

/**
 * Seed the bootstrap admin user.
 * TODO: Replace with actual DB insert once Drizzle/ORM is wired.
 */
export async function seedBootstrapAdmin(): Promise<BootstrapAdminUser> {
  const user = await buildBootstrapAdminUser();

  // TODO: Replace with actual DB insert:
  // await dbRuntime.insert(adminUsersTable).values({
  //   id: user.id,
  //   email: user.email,
  //   name: user.name,
  //   hashedPassword: user.hashedPassword,
  //   role: user.role,
  //   status: user.status,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // });

  return user;
}

/**
 * Find admin user by email.
 * TODO: Replace with actual DB query once Drizzle/ORM is wired.
 */
export async function findAdminUserByEmail(email: string): Promise<{
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  role: string;
  status: string;
} | null> {
  const env = getServerEnv();
  const bootstrapEmail = env.adminAuth.bootstrapEmail || 'admin@example.com';

  // For now, only the bootstrap user exists
  if (email !== bootstrapEmail) {
    return null;
  }

  const bootstrap = await buildBootstrapAdminUser();
  return {
    id: bootstrap.id,
    email: bootstrap.email,
    name: bootstrap.name,
    hashedPassword: bootstrap.hashedPassword,
    role: bootstrap.role,
    status: bootstrap.status,
  };
}
