# Phase-2b: Wire Real Admin Sign-In + Session Flow

## Date
2026-04-05

## Scope
Nối sign-in page với credential validation + signed session token, thay thế mock "set cookie bất chấp" flow.

## Files Changed

### Modified

| File | What changed |
|---|---|
| `src/lib/admin-auth.ts` | `validateAdminCredentials()` giờ trả về `{ valid, userId, role, name }` thay vì `boolean`. Mock mode vẫn chấp nhận bootstrap email + bất kỳ password nào (dev convenience). Credentials mode dùng `findAdminUserByEmail()` + `verifyPassword()` (scrypt timing-safe) để validate thật. |
| `src/app/(admin-auth)/admin/sign-in/page.tsx` | Rewrite từ server component + inline server action → **client component** dùng `useActionState` import server action từ `src/lib/server/auth/actions.ts`. Form có error display, disabled state, styling cơ bản. |
| `.env.example` | Thêm `ADMIN_BOOTSTRAP_PASSWORD=changeme-dev-only` và `ADMIN_SESSION_SECRET=` (required production). |

### Created

| File | Purpose |
|---|---|
| `src/lib/server/auth/actions.ts` | `'use server'` — `signInAction`: nhận email/password → `validateAdminCredentials()` → nếu valid thì `createSessionToken()` → set signed token cookie → redirect dashboard. Return error state nếu fail. |

## Auth Flow (now)

```
User enters email + password on /admin/sign-in
  ↓
signInAction (server) calls validateAdminCredentials(email, password)
  ↓
  ├─ mock mode: check email == bootstrap email, password non-empty → return { valid, userId, role, name }
  └─ credentials mode: findAdminUserByEmail(email) → verifyPassword(password, storedHash) → return result
  ↓
If valid: createSessionToken(userId, ttl) → "userId:expiresAt:hmac-sha256-signature"
  ↓
Set cookie: world_admin_session = signed token (httpOnly, sameSite=lax, secure=prod, maxAge=ttl)
  ↓
Redirect → /admin/dashboard
  ↓
Dashboard layout calls requireAdminSession()
  ↓
getAdminSession() reads cookie → isValidAdminSessionValue() checks format
  ↓
  ├─ Token format (has colons): verifySessionToken() → HMAC verify + expiry check → build session from payload
  └─ Mock format ("mock-admin"): fallback to bootstrap actor (backward compat)
  ↓
Session established or redirect back to sign-in
```

## What's Protected Now

| Threat | Status |
|---|---|
| Unauthenticated access to /admin/* | ✅ `requireAdminSession()` trong layout redirect về sign-in |
| Fake/tampered session cookie | ✅ HMAC signature verification — đổi 1 ký tự là fail |
| Expired session token | ✅ `expiresAt` checked trong `verifySessionToken()` |
| Timing attack on signature | ✅ `timingSafeEqual()` trong verify |
| Wrong credentials | ✅ `validateAdminCredentials()` rejects invalid email/password |
| Password stored in plaintext | ✅ scrypt hash (seed.ts) — không có plaintext trong code |
| RBAC per-route | ✅ `requireAdminPermission()` + `checkAdminPermission()` có sẵn |
| Session secret required in prod | ✅ `getSessionSecret()` throws nếu thiếu `ADMIN_SESSION_SECRET` |

## What's NOT Yet (known gaps)

- **DB-backed user store**: `findAdminUserByEmail()` vẫn trả về bootstrap user từ env. Cần nối Drizzle + admin_users table.
- **No rate limiting**: Chưa có brute-force protection trên sign-in.
- **No CSRF token**: Form action chưa có CSRF protection (Next.js form action đã có built-in protection nhưng nên add explicit).
- **No logout**: Chưa có sign-out endpoint để clear cookie.
- **No 403 page**: `requireAdminPermission()` redirect dashboard với query param thay vì render 403.
- **No password reset**: Forgot/reset password flow là placeholder.
- **Single user only**: Chỉ có bootstrap user, chưa có multi-user management.

## Next Steps (for follow-up tasks)

1. Wire Drizzle ORM → `admin_users` table → replace `findAdminUserByEmail()` with real DB query
2. Add rate limiting on sign-in (e.g. 5 attempts per 15 min per IP)
3. Implement sign-out action (clear cookie)
4. Build proper 403 page for insufficient permissions
5. Add CSRF token validation (optional with Next.js server actions)
6. Seed script to run bootstrap user insert on deploy
