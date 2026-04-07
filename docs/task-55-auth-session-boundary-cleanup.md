# Task 55 — Admin auth/session mock boundary cleanup

## Files read
- `src/lib/admin-auth.ts`
- `src/lib/admin-session.ts`
- `src/lib/server/auth/config.ts`
- `src/app/(admin-auth)/admin/sign-in/page.tsx`
- `src/app/(admin-auth)/admin/forgot-password/page.tsx`
- `src/app/(admin-auth)/admin/reset-password/page.tsx`
- `src/app/(admin-protected)/admin/layout.tsx`
- `src/app/(admin-protected)/admin/page.tsx`
- `src/components/admin/dashboard/admin-dashboard-placeholder.tsx`

## Current boundary before cleanup
- Admin auth is still mock-only in practice.
- Protected access depends on a cookie value check plus bootstrap user fallback from env/auth config.
- `sign-in/page.tsx` was setting the mock cookie directly.
- `admin-session.ts` mixed together:
  - cookie reading
  - session validation
  - redirect decision
  - bootstrap actor construction
- session payload returned `{ user: ... }`, which works for now but is not the cleanest naming if phase sau wants actor/audit tracking separated from auth provider details.

## Cleanup applied

### 1) `src/lib/admin-auth.ts`
Improved naming and redirect boundary:
- renamed `ADMIN_SESSION_VALUE` -> `ADMIN_MOCK_SESSION_VALUE`
- renamed `isValidAdminSession()` -> `isValidAdminSessionValue()`
- added `ADMIN_AUTH_REDIRECTS` constant
- added inline comment to explain current mock boundary behavior

Why:
- makes it obvious which pieces are mock placeholders
- separates redirect expectations from page literals
- gives a cleaner seam for later provider-backed validation

### 2) `src/lib/admin-session.ts`
Separated actor/session concepts more clearly:
- introduced `AdminActor`
- introduced `AdminSession`
- renamed bootstrap helper to `buildAdminActorFallback()`
- added `readAdminSessionCookieValue()` helper
- added `buildMockAdminSession()` helper with boundary comment
- changed returned session shape from `{ user }` to `{ actor }`
- made `requireAdminSession()` call `getAdminSession()` instead of duplicating logic

Why:
- session concept is now explicit
- actor concept is now ready for a later phase where auth identity and audit actor may evolve separately
- cookie reading, validation, redirect, and mock materialization are easier to replace independently

### 3) `src/app/(admin-auth)/admin/sign-in/page.tsx`
Aligned sign-in page with the new boundary:
- uses `ADMIN_MOCK_SESSION_VALUE`
- uses `ADMIN_AUTH_REDIRECTS.dashboard`
- keeps the same mock sign-in behavior and redirect result

Why:
- removes hardcoded dashboard redirect strings
- keeps sign-in behavior consistent with the central mock auth boundary

## What stayed intentionally unchanged
- No real auth provider integration yet
- No RBAC enforcement yet beyond the placeholder role in bootstrap actor
- No sign-out flow added in this task
- No middleware/auth route handlers introduced
- Forgot/reset password pages remain placeholders

These are intentionally left for later phases so this cleanup stays low-risk.

## Redirect expectations after cleanup
- Unauthenticated admin access through protected layout:
  - `requireAdminSession()` -> redirect to `ADMIN_AUTH_REDIRECTS.signIn`
- Visiting sign-in while already authenticated:
  - redirect to `ADMIN_AUTH_REDIRECTS.dashboard`
- Successful mock sign-in submit:
  - set mock cookie
  - redirect to `ADMIN_AUTH_REDIRECTS.dashboard`

## Why this helps next phase
This cleanup leaves a cleaner seam for:
- replacing mock cookie validation with provider-backed session validation
- distinguishing auth session from audit actor
- adding actor tracking / request attribution later
- moving sign-in/out behavior to shared auth actions or route handlers without rewriting every page contract

## Files changed
- `src/lib/admin-auth.ts`
- `src/lib/admin-session.ts`
- `src/app/(admin-auth)/admin/sign-in/page.tsx`
