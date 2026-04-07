# Task 1290 — nol.interpark clone frontend foundation pass

## Scope
Implemented frontend-only foundation for a new `nol.interpark.com` UI clone using mock data and shared support files.
No backend work.

## Files created
1. `src/types/interpark.ts`
2. `src/lib/mocks/interpark-home.ts`
3. `src/components/layout/responsive-image.tsx`
4. `src/components/layout/clone-section-shell.tsx`
5. `src/lib/interpark.ts`

---

## What was added
### 1) `src/types/interpark.ts`
Typed contracts for the clone foundation:
- `InterparkHeroSlide`
- `InterparkCategoryItem`
- `InterparkRankingItem`
- `InterparkRankingBlock`
- `InterparkEventCardItem`
- `InterparkCuratedBlock`
- `InterparkPromoBanner`
- `InterparkBrandItem`
- `InterparkHomePageData`
- shared enums/types for ratio/theme/link

Why useful:
- gives the clone a clean typed mock-data boundary
- keeps homepage/section/card implementation from devolving into `any` soup

---

### 2) `src/lib/mocks/interpark-home.ts`
Added practical homepage mock data for clone implementation.
Includes:
- hero slides
- category items
- ranking block with tabs/items
- promo banner
- curated sections
- brand strip items

Why useful:
- enough structured mock data to build the homepage clone immediately
- mirrors the planned UI zones from the skeleton plan

---

### 3) `src/components/layout/responsive-image.tsx`
Added shared image helper around `next/image`.
Supports:
- ratio presets: `poster | square | wide | hero`
- shared rounded container
- `priority`
- `sizes`
- className extension

Why useful:
- centralizes image ratio behavior for hero/cards/promo sections
- prevents every clone component from re-implementing the same wrapper

---

### 4) `src/components/layout/clone-section-shell.tsx`
Added shared section wrapper for clone pages.
Supports:
- tone variants: `default | subtle | dark`
- consistent vertical rhythm
- consistent max-width/container padding

Why useful:
- gives the clone page a reusable shell for all major homepage sections
- keeps spacing/tone rhythm consistent from the start

---

### 5) `src/lib/interpark.ts`
Added a tiny barrel seam exporting:
- `interparkHomeMockData`
- all interpark typed contracts

Why useful:
- clone page/components can import from one place instead of reaching into multiple files
- cleaner foundation seam for future UI implementation

---

## Verification
I verified by re-reading the created files and checking consistency with the current workspace setup.

Confirmed:
- all new files are frontend-only
- no backend/db/auth logic was touched
- imports align with existing project utilities (`@/lib/utils/cn`, Next Image, existing `src/lib/mocks` and `src/types` patterns)
- foundation is parallel to the existing world.nol app structure rather than destructive to it

---

## Practical outcome
The repo now has enough clean foundation to start implementing a mock-data-first homepage clone for `nol.interpark.com` without inventing contracts mid-way.

Ready next steps after this foundation:
- homepage page composition
- hero section
- category grid
- ranking section
- promo banner
- curated card sections
- brand strip

## Verdict
PASS — frontend mock-data/shared foundation for the new clone is now in place and usable.
