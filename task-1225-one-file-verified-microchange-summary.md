# Task 1225 — One-file verified microchange for demo quality

## File changed
- `src/components/admin/layout/admin-topbar.tsx`

## Microchange
- normalized `eyebrow` with `.trim()`
- only render the eyebrow element when the normalized value is still non-empty

## Why it helps
`AdminTopbar` is a shared admin shell component used across the admin surface.
This small change prevents blank or whitespace-only eyebrow rows from rendering, which keeps the admin demo UI cleaner without changing valid content behavior.

## Verification
- re-read the file after editing
- confirmed only this one file was touched
- confirmed the change is self-contained and follows normalization patterns already present in the same component (`description`, `metaChips`)
