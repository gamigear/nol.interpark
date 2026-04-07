# Task 1200 — Public stability one-file microchange

## File touched
- `src/lib/server/navigation/query.ts`

## Microchange
Patched `mapLinks()` so public shell links are only emitted when both fields are genuinely usable:
- require non-empty `label`
- require non-empty `href`
- drop items whose href resolves to `#`

Before:
- invalid/missing DB item data became placeholder public anchors:
  - `label: 'Link'`
  - `href: '#'`

After:
- invalid items are filtered out entirely
- only real links reach header/footer shell rendering

## Why this is safe
- one file only
- no schema change
- no refactor
- no package change
- no public route structure change
- no new dependency on other modules

It is a stability/data-state clarity fix inside the existing shell mapping layer.

## Practical improvement
This avoids dead/fake links appearing in public header/footer when DB-backed nav/footer items are incomplete or partially imported.

That improves:
- public fallback clarity
- operator confidence during partial content states
- resilience of shell rendering when content data is thin/incomplete

## Remaining edge case
If a block contains only invalid links, that block now renders as empty and higher-level shell fallback behavior decides what to show. That is preferable to rendering clickable fake placeholders.
