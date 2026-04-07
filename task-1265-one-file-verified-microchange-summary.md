# Task 1265 — One-file verified microchange for demo quality

## File changed
- `src/components/admin/layout/admin-shell.tsx`

## Microchange
- moved the two repeated admin hint strings into a local `hints` array
- render hint paragraphs via `.map()` instead of hardcoding two repeated `<p>` blocks

## Impact
`AdminShell` is a shared admin shell component.
This does not change visible behavior, but it removes duplicated markup structure and makes the shell hints easier to keep consistent if wording changes later.

Practical demo effect:
- cleaner shared shell implementation
- lower chance of tiny drift between repeated hint blocks
- no behavior change for the admin demo UI

## Verification
- re-read the file after editing
- confirmed the change is self-contained
- confirmed exactly one file was touched
- confirmed render structure remains equivalent (`admin-shell__hint` paragraphs still render twice with same content)
