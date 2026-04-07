# Task 1236 — Public stability one-file microchange

## Exact file changed
- `src/app/(public)/[lang]/page.tsx`

## Technical microchange
Tightened homepage empty-state logic so it reflects overall homepage content presence, not just the first two shelves.

Before:
- empty-state showed when:
  - no promo
  - `featuredTickets.items.length === 0`
  - `topPicks.items.length === 0`
- This ignored that homepage may still have meaningful content in:
  - `editorial`
  - `travelGuides`

After:
- the page now derives:
  - `hasPrimaryShelves`
  - `hasEditorialShelves`
  - `shouldShowEmptyState`
- empty-state only renders when:
  - no promo
  - no primary shelves
  - no editorial/travel-guide shelves

## Why this is safe
- one file only
- no schema change
- no data-flow refactor
- no component API change
- server route stays the same
- logic is local to page rendering only

## Verification
Re-read the patched file after edit and verified:
- only `src/app/(public)/[lang]/page.tsx` changed
- empty-state condition now includes editorial/travel-guides presence
- render structure, imports, and route contract remain unchanged

## Practical improvement
This makes homepage data-state clearer and avoids a misleading empty-state when the page still has valid content from editorial or travel-guide sections.
