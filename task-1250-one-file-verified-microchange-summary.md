# Task 1250 — One-file verified microchange for demo quality

## File changed
- `src/components/layout/public-breadcrumbs.tsx`

## Microchange
- normalized each breadcrumb item's `label` with `.trim()`
- normalized each breadcrumb item's `href` with `.trim()`
- filtered out breadcrumb items whose normalized label is empty
- render now uses the cleaned `visibleItems` list

## Impact
`PublicBreadcrumbs` is a shared public/layout helper.
This prevents blank breadcrumb crumbs or whitespace-only labels/hrefs from rendering, which keeps the public demo chrome cleaner and more stable when upstream breadcrumb data is slightly noisy.

## Verification
- re-read the file after editing
- confirmed the change is self-contained
- confirmed exactly one file was touched
