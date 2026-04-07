# Notes after reading 26 files

## What the repo currently looks like
- Next.js app router project with clear split between admin and public experiences.
- Admin routes live under `src/app/(admin-protected)/admin` and currently expose:
  - dashboard
  - homepage
  - navigation
  - promos
- Public localized routes live under `src/app/(public)/[lang]` and currently expose:
  - homepage
  - guides
  - stories/[slug]
  - tickets
  - top-picks

## Verified route/page status from code read
### Admin
- `src/app/(admin-protected)/admin/page.tsx`
  - simple redirect to `/admin/dashboard`.
- `src/app/(admin-protected)/admin/dashboard/page.tsx`
  - still a placeholder shell using `AdminDashboardPlaceholder`.
- `src/app/(admin-protected)/admin/homepage/page.tsx`
  - wired to real server data via `getHomepageAdminFormData`
  - renders placeholder when no blocks exist
  - otherwise renders save wrapper + homepage form.
- `src/app/(admin-protected)/admin/navigation/page.tsx`
  - same practical pattern as homepage, using navigation form data + save action.
- `src/app/(admin-protected)/admin/promos/page.tsx`
  - same practical pattern as homepage/navigation, using promos query + save action.

### Public
- `src/app/(public)/[lang]/page.tsx`
  - renders hero + promo banner + featured tickets + top picks + editorial + travel guides.
  - homepage already pulls runtime data through server view models.
- `guides/page.tsx`, `tickets/page.tsx`, `top-picks/page.tsx`
  - share the same page architecture:
    - `PublicPageHero`
    - `PublicBreadcrumbs`
    - `PublicPageSection`
    - `PublicRouteFrame`
    - card grid from listing view model.
  - This suggests route consistency work has already advanced quite a bit.

## Components/files observed
### Admin components
- homepage form/save wrapper exist
- navigation form/save wrapper exist
- promos form/save wrapper exist
- dashboard placeholder/stat cards/modules exist

### Public/shared components
- layout primitives exist:
  - breadcrumbs
  - empty state
  - info cards
  - meta list
  - page hero
  - page section
  - route frame
  - route chrome
  - header/footer
  - story body scaffold
- card components exist:
  - content card
  - product card
  - ticket card
- section components exist:
  - editorial
  - featured tickets
  - promo banner
  - section header/shell
  - top picks
  - travel guides

## What team-task history suggests
- Many older batches failed repeatedly due to over-broad scope / stale context / input-too-long / quota patterns.
- More recent batches in the 580–609 range are completing successfully when framed as very small practical micro-slices.
- So the working strategy is correct: keep tasks tiny, parallel, and centered on one focused implementation area each.

## Concrete completed-task signals seen
- Recent batches `600–609` are marked completed.
- Their subjects indicate successful continued progress in:
  - admin/homepage/dashboard
  - admin save-flow
  - public route work
  - shared/project consistency
  - checkpoint synthesis
- But detailed result bodies were redacted/truncated in the task `get` output, so I should not claim exact code changes from those tasks unless verified directly in repository files.

## Practical gaps still visible from repo structure
1. Dashboard is still explicitly placeholder-oriented.
2. Admin route coverage appears limited to homepage/navigation/promos; likely missing practical route implementations for localization/editorial/media/catalog.
3. Public listing pages are fairly consistent, so next work may be better spent on remaining unimplemented areas rather than repeating visual rhythm passes.
4. There are references in dashboard placeholder to routes like `/admin/localization` and `/admin/editorial/articles`, which may not yet be implemented.

## Best next-batch direction right now
Create another tiny parallel batch around unimplemented-but-signposted areas, for example:
- one dashboard placeholder refinement tied only to real existing routes/data framing
- one missing admin area shell/page implementation (localization OR editorial entry route)
- one remaining public route/article/story detail micro-slice
- one shared consistency pass for route chrome / cards / labels
- one checkpoint task after those finish

## Caution
- Do not claim exact edits from completed tasks unless directly verified from code.
- Avoid broad “finish CMS” tasks; that pattern historically fails.
