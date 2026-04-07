# Task 1098 progress summary

## What I learned so far

### Public shell status
- `src/app/(public)/[lang]/layout.tsx` is the correct injection point for public shell data.
- It is already an async server layout, but still passes only `lang` into `SiteHeader` and `SiteFooter`.
- `src/components/layout/site-header.tsx` and `site-footer.tsx` are fully static/hardcoded today.

### Existing server seams relevant to this task
- DB runtime foundation is already present under `src/lib/server/db/*`.
- Homepage has a real/fallback read path and public-facing VM seam through `src/lib/server/public-content.ts` and `src/lib/server/homepage/*`.
- Navigation server modules exist under `src/lib/server/navigation/*`:
  - `repository-db.ts` reads `content_blocks`, `content_block_localizations`, `content_block_items` for `block_type = 'nav_highlight'`
  - `adapter.ts` maps nav items from `overrideJson.label/href/target/badge`
  - `use-case.ts` is admin/write oriented, not a public read API
  - `admin-read.ts` confirms snapshot shape and current assumptions
- Promos modules exist, but current task scope is navigation + footer/basic shell, not promos hardening.

### Key gaps identified
- There is no clean public-facing `getNavigationViewModel(locale)` function exported for the layout/header to use directly.
- `fetchNavigationBlocks()` currently does **not** filter localizations by locale, so any public read helper should choose locale carefully and include safe fallback.
- `mapNavigationSnapshotToViewModel()` currently treats the first `nav_highlight` block as primary and all others as secondary. This is usable for demo-first wiring, but it is a simplification.
- Footer has no dedicated server seam yet. Based on task 1092 mapping, pragmatic demo path is to reuse `nav_highlight` blocks with footer key conventions like `footer-*`, or at minimum derive footer note/links from available shell data with safe fallback.

### Notes from blocker docs
- Task 1091 checklist confirms header/footer are the most obvious static placeholders and should be wired through layout.
- Task 1092 mapping says current schema is sufficient for demo if we follow block key conventions:
  - navigation: `header-primary`, `header-secondary`, possibly locale blocks
  - footer: `footer-column-*`, `footer-legal`, `footer-social`
- Inventory task 1090 prioritizes header/nav as P0 and footer/basic shell as P1-but-still-important for demo completeness.

### Likely implementation direction
Minimal-risk approach touching few files:
1. Add a public read helper in `src/lib/server/navigation/*` that:
   - fetches nav blocks from DB
   - filters/chooses locale-safe localizations
   - exposes header primary/secondary and footer groups/note with fallback
2. Update `src/app/(public)/[lang]/layout.tsx` to fetch shell data server-side.
3. Refactor `src/components/layout/site-header.tsx` to accept data props instead of only hardcoded labels.
4. Refactor `src/components/layout/site-footer.tsx` to accept server-fed footer data with fallback.

### Constraints / risks
- Possible semantic conflict: `nav_highlight` is also mentioned elsewhere as a temporary shortcut for homepage top-picks. Need to avoid broad behavior changes outside shell wiring.
- Keep fallback behavior safe so demo still renders even if DB has partial/missing nav/footer rows.
