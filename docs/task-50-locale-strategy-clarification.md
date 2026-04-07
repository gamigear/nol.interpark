# Task 50 — App locale strategy vs homepage/public content locale strategy

## Files read
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/app/(public)/[lang]/layout.tsx`
- `src/app/(public)/[lang]/page.tsx`
- `src/lib/server/env/constants.ts`
- `src/lib/server/env/index.ts`
- `.env.example`
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/adapter.ts`

## Current strategy clarified

There are now **two intentionally different locale layers** in the repo:

### 1) App/runtime locale layer
Driven by env/runtime config:
- `.env.example` → `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
- `src/lib/server/env/constants.ts` → `DEFAULT_SUPPORTED_LOCALES = ['en', 'ko']`
- `src/lib/server/env/index.ts` reads these values into runtime env

This layer answers:
- which route locales the app/runtime can expose
- what the app considers supported globally at this phase

### 2) Homepage/public content + chrome locale layer
Driven by current mock/content coverage:
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/app/(public)/[lang]/layout.tsx`

This layer currently covers:
- homepage content fallback/normalization: `en`, `ar`
- public chrome copy: `en`, `ar`
- RTL logic for public chrome: `ar`

This layer answers:
- which locales currently have homepage/public copy coverage
- which locale should be used when homepage content data must resolve safely

## Important subtlety clarified

A route locale and a homepage content locale are **not the same thing** right now.

Example:
- route may be `/ko/...`
- homepage content may still resolve with English fallback data
- links can still preserve the current route locale context

So the current model is:
- **route locale** = runtime/app concern
- **homepage content locale** = content coverage concern

That difference is intentional during the rebuild phase and should not be silently collapsed.

## Safe code/doc cleanup applied

### 1) `src/types/home.ts`
Added a small explicit type/comment split:
- `AppRuntimeLocale = string`
- comment explaining the current intentional split:
  - app/runtime defaults: `en`, `ko`
  - homepage/public content + chrome coverage: `en`, `ar`

This makes the repo easier to read after previous cleanup and avoids the impression that one locale union controls everything.

### 2) `src/lib/mocks/home-data.ts`
Clarified naming and intent without changing broad behavior:
- import `AppRuntimeLocale`
- use `routeLocale: AppRuntimeLocale = lang`
- extract `buildPublicLocaleHref(locale, segment)`
- keep homepage data resolution via `resolveHomePageLocale(lang)`

Meaning:
- homepage data still resolves against homepage content locales
- generated hrefs are now clearly described as route-locale-based
- the code now documents the separation instead of hiding it in string interpolation

## What I intentionally did NOT change

### Not changed
- `.env.example` still says `en,ko`
- `DEFAULT_SUPPORTED_LOCALES` still says `['en', 'ko']`
- `src/app/(public)/[lang]/page.tsx` was not edited further in this task

### Why
- `page.tsx` has already been refactored by another stream to use `getHomepageViewModel()` from `src/lib/server/homepage`
- changing route-level behavior here risks colliding with active parallel work
- this task asked to clarify strategy, not to force a runtime-wide locale decision

## New repo reality discovered during this task

The homepage route no longer reads mocks directly only.
It now goes through:
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/adapter.ts`

Those files already resolve homepage locale with `resolveHomePageLocale(locale)` and fallback safely.
So the architecture is moving toward:
- route locale enters at query layer
- homepage content locale is normalized before mapping/fallback

That makes the app/runtime vs homepage/content split even more important to document clearly.

## Files changed
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`

## Recommendation for next step

If lead wants to continue this path safely, the next deliberate move should be one of:
1. introduce a small shared helper in server homepage query/adapter for `routeLocale` vs `resolvedContentLocale`, or
2. align env/runtime supported locales with current public content coverage, or
3. add `ko` coverage to homepage/public chrome so the split narrows naturally

Until then, the codebase is safer if it keeps these two locale layers explicit rather than pretending they are one.