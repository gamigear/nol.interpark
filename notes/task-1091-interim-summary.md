# Task 1091 interim summary

## Scope reviewed so far
- Public homepage route: `src/app/(public)/[lang]/page.tsx`
- Public layout shell: `src/app/(public)/[lang]/layout.tsx`
- Public listing/detail routes:
  - `src/app/(public)/[lang]/tickets/page.tsx`
  - `src/app/(public)/[lang]/top-picks/page.tsx`
  - `src/app/(public)/[lang]/guides/page.tsx`
  - `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- Public chrome components:
  - `src/components/layout/site-header.tsx`
  - `src/components/layout/site-footer.tsx`
- Public server seams:
  - `src/lib/server/public-content.ts`
  - `src/lib/server/homepage/query.ts`
  - `src/lib/server/homepage/repository.ts`
  - `src/lib/server/homepage/repository-db.ts`
  - `src/lib/server/homepage/adapter.ts`
  - `src/lib/server/navigation/adapter.ts`
  - `src/lib/server/navigation/repository-db.ts`
  - `src/lib/server/navigation/admin-read.ts`
  - `src/lib/server/promos/adapter.ts`
  - `src/lib/server/promos/query.ts`
  - `src/lib/server/promos/repository-db.ts`
  - `src/lib/server/promos/admin-read.ts`

## What I learned

### 1. Homepage public route is only partially data-driven
- `src/app/(public)/[lang]/page.tsx` does use real server queries:
  - `getHomepageViewModel(lang)`
  - `getPromosViewModel(lang)`
- But large parts of the page are still hardcoded/static copy:
  - eyebrow `world.nol.com clone skeleton`
  - CMS-powered explainer section
  - new visitor orientation section
  - final CTA section
- So even if homepage shelf data comes from DB/query, the page still does not fully reflect real website content.

### 2. Homepage data path is mixed real+fallback
- `src/lib/server/homepage/repository-db.ts` has real SQL for pages/page_localizations/content_blocks/content_block_localizations/content_block_items.
- `src/lib/server/homepage/repository.ts` now prefers real SQL snapshot when DB is configured.
- If SQL returns no homepage page/blocks or throws, it falls back to synthetic/db-like seed data.
- `src/lib/server/homepage/adapter.ts` maps block types:
  - hero
  - featured_catalog
  - nav_highlight -> currently reused as homepage `topPicks`
  - editorial_grid
  - travel_guides
- Important observation: `nav_highlight` is overloaded between homepage `topPicks` content and navigation module, so demo wiring must clarify whether same block type is intended or needs separation.

### 3. Public route shells for tickets/top-picks/guides/stories still contain lots of placeholder static copy
- `tickets/page.tsx`, `top-picks/page.tsx`, `guides/page.tsx`, `stories/[slug]/page.tsx` do consume server-side view models from `public-content.ts`.
- But each route appends multiple static marketing/info sections and final CTA blocks that are not query-backed.
- These will visibly diverge from the source site during demo unless replaced or removed.

### 4. `public-content.ts` is a reusable seam, but still seeded by homepage structure
- Listing/detail routes derive from homepage view model, not dedicated collections.
- Story detail lookup is based on `source.data.editorial.items.find((item) => item.href.endsWith(...))`.
- Related stories are currently taken from `travelGuides.items.slice(0, 3)`.
- Breadcrumbs and many titles/labels are hardcoded English strings.
- So route shell/data seam exists, but it is still a placeholder architecture rather than true content modeling.

### 5. Header is still fully static and not wired to navigation query
- `src/components/layout/site-header.tsx` hardcodes:
  - labels in EN/AR
  - nav item href builders
  - brand subtitle
  - sign-in / plan trip actions
- It does not call navigation read/query at all.
- `src/lib/server/navigation/repository-db.ts` already has real SQL read path for `nav_highlight` blocks/items.
- `src/lib/server/navigation/adapter.ts` can map nav blocks into a `HomepageNavigationViewModel`.
- But public header is not consuming that data, so navigation for demo remains static.

### 6. Footer is also static
- `src/components/layout/site-footer.tsx` only renders hardcoded locale copy plus optional note prop.
- No query/data seam is connected.

### 7. Promos public seam exists, but has issues
- `src/lib/server/promos/query.ts` calls `fetchPromoBlocks('runtime')` and maps first published promo block via `mapPromosSnapshotToViewModel(...)`.
- `src/lib/server/promos/adapter.ts` is a simple first-block mapper.
- `src/app/(public)/[lang]/page.tsx` renders `PromoBannerSection` when query returns data, else renders a static empty-state placeholder.
- `src/lib/server/promos/repository-db.ts` has real SQL intent, but the file content appears corrupted in current workspace readout (odd control characters around generic annotations and arrow syntax). Needs verification/fix before trusting for demo.
- Query is not locale-filtered even though block localizations are fetched; it reads all localizations for matching blocks.

### 8. Admin read modules exist for navigation/promos
- `navigation/admin-read.ts` and `promos/admin-read.ts` summarize blocks/items from DB.
- This suggests admin foundations exist, but public consumption is still incomplete.

## Preliminary demo wiring risk areas
1. Static public header/footer will make demo feel fake even if homepage shelves are DB-backed.
2. Homepage route still contains obvious placeholder sections/copy.
3. Listing/detail routes are structurally reusable but still padded with static explainer content.
4. Story detail is not backed by true story records; it piggybacks on homepage editorial items.
5. Promos DB file may be syntactically corrupted and query is not locale-aware.
6. Navigation block type overlaps with homepage top picks (`nav_highlight`), which may complicate “real website data” replacement.
