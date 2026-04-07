# Task 1183 — One-file shared/project microchange on recovered source path

## File touched
- `src/components/layout/public-empty-state.tsx`

## What changed
Applied a very small shared-layout hygiene improvement:
- normalized `eyebrow` with `.trim()` before rendering
- normalized `note` with `.trim()` before rendering
- only render eyebrow/note nodes when the normalized value is still non-empty

## Why this is practical
`PublicEmptyState` is a shared public/layout helper used by route shells and section fallbacks.
This microchange prevents noisy UI output when upstream props contain empty strings or whitespace-only values.

Practical effect:
- avoids rendering blank eyebrow rows
- avoids rendering empty note blocks
- keeps shared public fallback states cleaner without changing behavior for valid content

## Why this is safe
- one file only
- no refactor
- no speculative new feature
- logic is trivial and already consistent with normalization patterns used elsewhere in the project

## Confirmation
- exactly **one file** was touched
- no other source file was modified
