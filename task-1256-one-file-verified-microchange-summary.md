# Task 1256 — One-file verified microchange for demo quality

## File changed
- `src/components/layout/public-meta-list.tsx`

## Microchange
- `visibleItems` now requires both `label` and `value` to remain non-empty after `.trim()`
- normalized `label` before rendering
- normalized `value` before rendering
- render key now uses normalized label/value instead of raw whitespace-sensitive strings

## Impact
`PublicMetaList` is a shared public/layout helper used in route chrome and section support metadata.
This prevents meta rows with empty/whitespace-only labels from rendering, and keeps displayed labels/values cleaner when upstream data is slightly noisy.

Practical demo effect:
- cleaner public metadata UI
- fewer awkward blank labels with visible values
- more stable render keys when incoming strings contain stray whitespace

## Verification
- re-read the file after editing
- confirmed the change is self-contained
- confirmed exactly one file was touched
