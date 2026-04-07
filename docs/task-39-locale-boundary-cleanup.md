# Task 39 — Locale strategy cleanup at homepage mock/content boundary

## Files read
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
- `src/lib/server/env/constants.ts`
- `src/lib/server/env/index.ts`
- `.env.example`
- `src/app/(public)/[lang]/layout.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

## What was mismatched before

### 1) Homepage mock locale contract vs env/runtime defaults
- Homepage mock/content layer currently supports only: `en`, `ar`
- This is visible in:
  - `src/lib/mocks/home-data.ts`
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/site-footer.tsx`
  - `src/app/(public)/[lang]/layout.tsx` RTL handling (`ar` only)
- But env defaults still point to:
  - `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
  - `DEFAULT_SUPPORTED_LOCALES = ['en', 'ko']`

### 2) Fallback logic was explicit but too local
- Batch trước đã làm tốt hơn bằng cách thêm `HomePageLocale` và fallback rõ trong `getHomePageData()`.
- Tuy nhiên locale handling của homepage mock boundary vẫn hơi phân tán:
  - supported locale union nằm một chỗ
  - default locale nằm trong `home-data.ts`
  - fallback logic cũng nằm trong `home-data.ts`
- Điều này khiến boundary chưa tự mô tả rõ ràng bằng type/helper chung.

## Safe cleanup applied in this task

### Updated `src/types/home.ts`
Added shared homepage-locale helpers:
- `DEFAULT_HOME_PAGE_LOCALE`
- `isHomePageLocale(value)`
- `resolveHomePageLocale(value)`

Meaning:
- homepage mock/content boundary now owns its own locale contract explicitly
- supported locale + default locale + fallback resolution are colocated
- future homepage mock consumers can reuse the same helper instead of re-implementing fallback logic

### Updated `src/lib/mocks/home-data.ts`
Refactored to use shared locale helper instead of local fallback logic:
- import `DEFAULT_HOME_PAGE_LOCALE`
- import `resolveHomePageLocale`
- keep `Record<HomePageLocale, HomePageData>`
- replace hardcoded conditional fallback with:

```ts
return homeDataByLocale[resolveHomePageLocale(lang)]
```

## Why this is safe
- No render behavior change for current supported locales
- Unknown locale values still safely fall back to English
- Public API remains unchanged: `getHomePageData(lang: string): HomePageData`
- Cleanup is limited to homepage mock boundary; no env/runtime behavior was changed

## Mismatch resolved vs intentionally left

### Resolved in code
- Homepage mock locale strategy is now clearer and centralized:
  - supported locales: `HOME_PAGE_LOCALES`
  - default locale: `DEFAULT_HOME_PAGE_LOCALE`
  - guard + fallback helper: `isHomePageLocale`, `resolveHomePageLocale`
- `home-data.ts` no longer carries its own ad hoc locale fallback logic

### Intentionally left unchanged
- `.env.example` and `src/lib/server/env/constants.ts` still default to `en,ko`
- `site-header.tsx`, `site-footer.tsx`, and public layout still only provide homepage copy/behavior for `en/ar`

This mismatch is still real, but I left it untouched on purpose because:
1. it belongs to a broader app/runtime locale strategy, not just homepage mock cleanup
2. changing env defaults to `en,ar` could affect other parallel workstreams
3. adding `ko` homepage copy/mock data in this task would be larger than the requested “small safe cleanup”

## Recommendation for lead
- Short-term: keep current cleanup and treat homepage mock locale contract as explicitly `en/ar`
- Next deliberate decision should be one of:
  1. align env defaults to `en,ar` for the current homepage skeleton phase, or
  2. expand homepage mock/header/footer/public copy to support `ko`

## Files changed
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
