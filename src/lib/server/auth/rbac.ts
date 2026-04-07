import { AdminRole } from '@/lib/server/auth/config';

/**
 * RBAC permission matrix for world.nol admin.
 *
 * Each role maps to a set of permission keys.
 * This is the foundation — extend the permission list as modules grow.
 */

export type AdminPermission =
  | 'admin:access'
  | 'homepage:read'
  | 'homepage:write'
  | 'homepage:publish'
  | 'navigation:read'
  | 'navigation:write'
  | 'promos:read'
  | 'promos:write'
  | 'promos:publish'
  | 'users:read'
  | 'users:write'
  | 'users:manage'
  | 'settings:read'
  | 'settings:write'
  | 'content:read'
  | 'content:write'
  | 'content:publish'
  | 'audit:read';

/**
 * Role → permission mapping.
 *
 * - super_admin: full access, including user management and settings
 * - editor: can read/write/publish content, homepage, navigation, promos
 * - translator: can read content, write translations (no publish)
 * - analyst: read-only access to content and audit logs
 */
const ROLE_PERMISSIONS: Record<AdminRole | string, AdminPermission[]> = {
  super_admin: [
    'admin:access',
    'homepage:read', 'homepage:write', 'homepage:publish',
    'navigation:read', 'navigation:write',
    'promos:read', 'promos:write', 'promos:publish',
    'users:read', 'users:write', 'users:manage',
    'settings:read', 'settings:write',
    'content:read', 'content:write', 'content:publish',
    'audit:read',
  ],
  editor: [
    'admin:access',
    'homepage:read', 'homepage:write', 'homepage:publish',
    'navigation:read', 'navigation:write',
    'promos:read', 'promos:write', 'promos:publish',
    'content:read', 'content:write', 'content:publish',
  ],
  translator: [
    'admin:access',
    'content:read', 'content:write',
    'homepage:read',
    'navigation:read',
    'promos:read',
  ],
  analyst: [
    'admin:access',
    'content:read',
    'homepage:read',
    'navigation:read',
    'promos:read',
    'audit:read',
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: AdminPermission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function hasAllPermissions(role: string, permissions: AdminPermission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the given permissions.
 */
export function hasAnyPermission(role: string, permissions: AdminPermission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role.
 */
export function getPermissionsForRole(role: string): ReadonlyArray<AdminPermission> {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

/**
 * Validate that a string is a known admin role.
 */
export function isValidAdminRole(value: string): value is AdminRole {
  return value in ROLE_PERMISSIONS;
}
