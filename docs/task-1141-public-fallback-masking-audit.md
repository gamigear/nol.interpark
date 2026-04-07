# Task 1141 — Public fallback masking audit

## Scope audited
- `src/app/(public)/[lang]/page.tsx`
- `src/lib/server/public-content.ts`
- `src/lib/server/navigation/query.ts`
- `src/lib/server/promos/query.ts`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/layout/public-empty-state.tsx`
- `src/components/sections/promo-banner-section.tsx`

## Quick findings

### 1) Homepage route — partial fallback masking
`src/app/(public)/[lang]/page.tsx`
- Homepage itself already reads through `getHomepageViewModel(lang)`.
- Promo slot is optional: if promos query returns nothing, homepage silently skips `PromoBannerSection`.
- There is a secondary empty-state block for homepage sections only when both promos are absent **and** featured tickets + top picks are empty.

**Impact:** promo absence is currently treated as normal, even when it may actually be a query/read failure instead of “no promo content”.

### 2) Promos query — strongest masking point
`src/lib/server/promos/query.ts`
- Current implementation wraps fetch in `try/catch` and returns `undefined` on any failure.
- No provenance/diagnostics is surfaced to caller.

**Impact:** public homepage cannot distinguish:
- promo content truly empty
- promos query failed
- repository returned nothing

This is the clearest fallback masking issue in the public demo flow.

### 3) Navigation query — fallback is explicit, therefore safer
`src/lib/server/navigation/query.ts`
- Has explicit `usedFallback` flag in `PublicShellData`.
- Fallback shell still carries source/fallback intent in code.

**Impact:** not ideal, but much less misleading than promos because fallback state is modeled and inspectable.

### 4) Public content view-models — mostly explicit
`src/lib/server/public-content.ts`
- Listing/story routes use typed view-models.
- Empty states and readiness/status meta are explicit in code.
- Still some copy is optimistic, but overall less likely to mask failures than promos.

## Safe conclusion for demo readiness

### Pass / fail snapshot
- **Homepage read path:** PASS with fallback caveat
- **Header/footer shell:** PASS with explicit fallback behavior
- **Listing/detail routes:** PASS with typed empty states
- **Promos read path:** PARTIAL FAIL for observability because failures collapse to `undefined`

## Recommended next fixes (ordered)
1. Add a small diagnostics-aware promos query result instead of plain `undefined` on catch.
2. Let homepage distinguish “promo unavailable” vs “promo empty”.
3. Only after that, tune user-facing copy/notes for promo slot fallback.

## Files touched in this task
- `docs/task-1141-public-fallback-masking-audit.md`

## What was intentionally not changed
- No runtime code changed in this task.
- No DB/query logic was altered.
- No public copy behavior was changed.

Reason: the main masking issue is in promos query semantics, and changing it safely would affect multiple files. This task records the exact gap so the next slice can fix it deliberately instead of guessing.
