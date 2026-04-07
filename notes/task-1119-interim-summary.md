# Task 1119 interim summary

## Scope reviewed so far
- Build/runtime config:
  - `package.json`
  - `tsconfig.json`
  - `next.config.mjs`
  - `.env.example`
- Public demo critical paths:
  - `src/app/(public)/[lang]/layout.tsx`
  - `src/app/(public)/[lang]/page.tsx`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/site-footer.tsx`
- Server query/runtime paths:
  - `src/lib/server/db/config.ts`
  - `src/lib/server/db/driver.ts`
  - `src/lib/server/homepage/query.ts`
  - `src/lib/server/homepage/repository.ts`
  - `src/lib/server/promos/query.ts`
  - `src/lib/server/promos/repository-db.ts`
  - `src/lib/server/navigation/query.ts`
  - `src/lib/server/navigation/repository-db.ts`
- Admin auth related:
  - `src/lib/server/auth/config.ts`
  - `src/lib/server/auth/session.ts`

## What I learned

### 1) Build/deploy commands are minimal
- `package.json` only has:
  - `dev`
  - `build`
  - `start`
  - `lint`
- No dedicated `typecheck`, `test`, `db:migrate`, or `seed` scripts.
- This means build/verify runbook must explicitly note that verification is mostly `next build` + route smoke checks unless team adds scripts.

### 2) TypeScript is strict, so small type/import issues can block build
- `tsconfig.json` has `strict: true`, `noEmit: true`, `moduleResolution: bundler`.
- Any missing import or malformed type syntax can break build immediately.

### 3) DB runtime is critical and uses `postgres`
- `src/lib/server/db/driver.ts` loads `postgres` dynamically and throws if missing.
- Build/runtime depends on valid `DATABASE_URL` / `DATABASE_DIRECT_URL` through env.
- `.env.example` confirms critical vars:
  - `DATABASE_URL`
  - `DATABASE_DIRECT_URL`
  - `DATABASE_PROVIDER`
  - `DATABASE_BRANCH`
  - `DATABASE_SSL_MODE`
- Without DB env, app may fall back in some read paths, but server paths still rely on DB driver presence.

### 4) Public shell now depends on navigation query at layout level
- `src/app/(public)/[lang]/layout.tsx` calls `getPublicShellData(lang)`.
- So build/runtime verification must include:
  - navigation query path works,
  - shell fallback is safe,
  - header/footer compile and render correctly.

### 5) Homepage public route depends on homepage + promos query concurrently
- `src/app/(public)/[lang]/page.tsx` uses `Promise.all([getHomepageViewModel(lang), getPromosViewModel(lang)])`.
- For deploy verification, homepage route is now the main integration surface for:
  - homepage query
  - promos query
  - shell query from layout
- If homepage loads, much of the demo wiring batch is proven at once.

### 6) Promos repository file now looks syntactically sane
- `src/lib/server/promos/repository-db.ts` currently reads cleanly and is locale-aware.
- It filters localizations by resolved locale.
- This previously looked corrupted in earlier audit, so this appears improved.

### 7) Navigation query has safe fallback behavior
- `src/lib/server/navigation/query.ts` wraps DB read in try/catch and returns fallback shell data.
- It still relies on `nav_highlight` blocks and specific keys such as:
  - `header-primary`
  - `header-secondary`
  - `header-brand`
  - `footer-*`
  - `footer-legal`
- Therefore, build may pass without seeded nav data, but demo quality will degrade to fallback shell.

### 8) Homepage repository still has possible technical risk
- `src/lib/server/homepage/repository.ts` uses `HomepagePersistenceReason` in `buildSyntheticSnapshot(...)` signature, but in the visible imports I did not see the type imported explicitly.
- This may be a real compile blocker if not resolved elsewhere.
- Also current behavior silently falls back to synthetic if DB has no page/blocks or throws; that is runtime-safe but risky for demo because it can hide missing real data.

### 9) Public shell components may contain placeholder-token artifacts in tool readout
- `site-header.tsx`, `site-footer.tsx`, auth files, and some others show `[REDACTED]` fragments in content returned by the tool.
- Need to verify whether these are tool redactions only or literal source artifacts.
- Because TS is strict, any literal malformed syntax here would block build.

### 10) Admin auth runtime is sensitive to env
- `.env.example` now includes `ADMIN_SESSION_SECRET` and bootstrap auth fields.
- `src/lib/server/auth/session.ts` explicitly throws in production if session secret is missing.
- Therefore `ADMIN_SESSION_SECRET` is a true deployment-critical env for production/demo hosting.

## Preliminary critical files for build/verify/deploy
1. `.env.example` (as checklist for real env)
2. `package.json`
3. `src/lib/server/db/driver.ts`
4. `src/lib/server/db/config.ts`
5. `src/app/(public)/[lang]/layout.tsx`
6. `src/app/(public)/[lang]/page.tsx`
7. `src/lib/server/navigation/query.ts`
8. `src/lib/server/promos/query.ts`
9. `src/lib/server/homepage/repository.ts`
10. `src/lib/server/auth/config.ts`
11. `src/lib/server/auth/session.ts`

## Preliminary blockers / risks before build
- Possible missing type import in `src/lib/server/homepage/repository.ts`
- Possible malformed syntax due to `[REDACTED]`-looking fragments in source readouts (needs actual compile verification)
- Missing envs: `DATABASE_URL`, `DATABASE_DIRECT_URL`, `ADMIN_SESSION_SECRET`
- Silent synthetic fallback could make demo appear working while not actually using DB-backed homepage data
- Navigation/public shell may compile and run on fallback even if DB data is not seeded correctly
