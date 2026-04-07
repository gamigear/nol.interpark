# Task 1274 — Shared layout/frontend consistency pass

## Scope
Focused frontend consistency pass across shared layout/presentation helpers in `src/components/layout` and related public shell rendering.

## Files changed
1. `src/components/layout/public-route-frame.tsx`
2. `src/components/layout/public-page-hero.tsx`

## What changed
### 1) `src/components/layout/public-route-frame.tsx`
Updated `hasVisibleMeta()` so it now requires **both**:
- `label.trim().length > 0`
- `value.trim().length > 0`

Previously it only checked `value`, which could still trigger the meta wrapper even when the label was blank.

### 2) `src/components/layout/public-page-hero.tsx`
Updated `hasMeta` so it follows the same rule as `PublicMetaList` and `PublicRouteFrame`:
- only consider meta visible when both label and value are non-empty after trim

Previously hero-level meta visibility still depended only on `value`.

## Shared frontend consistency improvements
These two fixes align three related helpers around the same visibility rule:
- `PublicMetaList`
- `PublicRouteFrame`
- `PublicPageHero`

Practical effect:
- no more inconsistent render decision where wrapper/meta area appears even though `PublicMetaList` itself would hide blank-label rows
- better shell rhythm and spacing consistency across route hero + route frame
- cleaner public presentation when upstream metadata is partially empty or whitespace-only

## Verification
I verified by re-reading the changed files after editing and checking them against the current `PublicMetaList` behavior.

Confirmed:
- file-level changes are self-contained
- visibility logic is now consistent across helper layers
- no speculative refactor; only targeted rendering-rule alignment

## Final note
This pass stayed focused on shared layout/presentation consistency in the current workspace and avoided wider refactor. The improvement is small but directly useful for demo quality because metadata blocks now behave consistently across public chrome surfaces.
