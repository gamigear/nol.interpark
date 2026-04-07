# Task 1246 — One-file verified microchange for demo quality

## File changed
- `src/components/layout/public-info-cards.tsx`

## Microchange
- normalized `title` with `.trim()` when building visible items
- normalized `description` with `.trim()` when building visible items
- only render `<strong>` / `<p>` when the normalized field is still non-empty

## Impact
`PublicInfoCards` is a shared public/layout helper used by route chrome and intro/support surfaces.
This prevents cards from rendering blank title or description rows when upstream content contains whitespace-only values.

Practical demo effect:
- cleaner public support/info card UI
- less noisy layout when content is partially empty
- no behavior change for valid content

## Verification
- re-read the file after editing
- confirmed the change is self-contained
- confirmed exactly one file was touched
