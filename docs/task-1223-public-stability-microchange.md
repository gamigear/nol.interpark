# Task 1223 — Public stability one-file microchange

## Exact file changed
- `src/lib/server/navigation/query.ts`

## Technical microchange
Updated `getPublicShellData()` so `usedFallback` reflects fallback usage across the full public shell, not just nav/footer subsets.

Before:
- `usedFallback` became `true` only when one of these mapped slices was missing:
  - primary
  - secondary
  - footerGroups
  - footerNote
- This missed branding fallback cases where:
  - `brandLabel` was empty
  - `brandSubtitle` was empty
- Result: shell could still be partially fallback-driven while `usedFallback` incorrectly looked “clean”.

After:
- `usedFallback` is now `true` if any important shell slice is missing from mapped data:
  - `brandLabel`
  - `brandSubtitle`
  - `primary`
  - `secondary`
  - `footerGroups`
  - `footerNote`

## Why this is safe
- one file only
- no schema changes
- no route/layout restructuring
- no refactor
- no package changes
- stays entirely inside existing shell assembly logic

## Verification
Verified by reading the patched file after edit:
- `usedFallback` now includes `brandLabel` + `brandSubtitle` checks
- rest of shell fallback merge behavior remains unchanged
- route consumers (`[lang]/layout`, `SiteHeader`, `SiteFooter`) continue using the same `shell.usedFallback` contract

## Practical improvement
This makes public shell state reporting more truthful during partial DB-backed states.

That improves:
- data-state clarity in shared shell rendering
- operator confidence during demo when branding is still coming from fallback
- consistency between what the shell is actually doing and what `usedFallback` claims
