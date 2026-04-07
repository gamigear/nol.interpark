# Task 46 — Homepage/Public Chrome locale-content boundary cleanup

## Files read
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
- `src/app/(public)/[lang]/layout.tsx`
- `src/app/(public)/[lang]/page.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/lib/server/env/constants.ts`
- `.env.example`

## What I changed

### 1) Extended shared locale helpers in `src/types/home.ts`
Added a clearer public-chrome locale layer alongside the existing homepage mock locale helpers:
- `PublicChromeLocale`
- `PUBLIC_CHROME_RTL_LOCALES`
- `PublicChromeRtlLocale`
- `isPublicChromeLocale(value)`
- `isPublicChromeRtlLocale(value)`

This separates two concerns more clearly:
- **app/runtime locales** (still broader, env-driven, currently `en,ko` by default)
- **homepage/public chrome locales** (current content/copy coverage: `en,ar`)

### 2) Updated public layout to use shared RTL helper
File changed:
- `src/app/(public)/[lang]/layout.tsx`

Cleanup:
- removed local `new Set(['ar'])`
- replaced with shared `isPublicChromeRtlLocale(lang)`

Effect:
- public layout direction logic now follows the same locale boundary source as the homepage/public chrome copy layer
- no render behavior change for current routes

### 3) Tightened `site-header.tsx` around public-chrome locale boundary
File changed:
- `src/components/layout/site-header.tsx`

Cleanup:
- typed labels as `Record<PublicChromeLocale, ...>`
- resolve incoming `lang` through `isPublicChromeLocale()` before reading copy
- use `resolvedLang` for homepage brand href and section links

Effect:
- removes the looser `labels[lang as keyof typeof labels] ?? labels.en` pattern
- makes fallback explicit and type-safe at the public chrome boundary
- avoids accidentally building chrome links from an unsupported locale string

### 4) Tightened `site-footer.tsx` with the same boundary pattern
File changed:
- `src/components/layout/site-footer.tsx`

Cleanup:
- typed labels as `Record<PublicChromeLocale, string>`
- resolve incoming `lang` via `isPublicChromeLocale()`
- read copy using resolved locale only

Effect:
- footer now follows the same locale resolution strategy as header and homepage mock content
- public chrome consistency is better, with no render change for supported locales

## What remained intentionally unchanged

### Still unchanged on purpose
- `.env.example` keeps `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
- `src/lib/server/env/constants.ts` keeps `DEFAULT_SUPPORTED_LOCALES = ['en', 'ko']`
- `getHomePageData()` still resolves unknown locales into the homepage mock locale set (`en/ar`) via `resolveHomePageLocale()`

### Why I did not change env/runtime defaults here
Because that belongs to a broader app/runtime locale strategy decision and could create ripple effects across parallel streams.
This task was safer and cleaner if limited to:
- homepage mock/content boundary
- public chrome copy boundary
- shared helper reuse

## Current state after cleanup

### Clearer now
- homepage mock locale contract: `en/ar`
- public chrome copy contract: `en/ar`
- public layout RTL logic: driven by shared helper instead of local hard-code
- header/footer fallback: explicit and typed

### Still intentionally split
- **runtime/app locale defaults**: `en/ko`
- **homepage/public chrome content coverage**: `en/ar`

That mismatch is now more visible and better isolated in code, instead of being spread as ad hoc conditions.

## Files changed
- `src/types/home.ts`
- `src/app/(public)/[lang]/layout.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

## Summary
This step did not try to “solve” the entire locale strategy for the app. Instead, it safely improved the current boundary:
- homepage mock content and public chrome now share clearer locale helpers
- header/footer/layout are more consistent with homepage mock locale handling
- render behavior remains intact
- env-level locale mismatch is intentionally left for a broader decision by the lead
