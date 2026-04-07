# Task 944 summary

## Files changed
- `src/components/sections/travel-guides-section.tsx`

## What changed
- Added `PublicMetaList` to the Travel Guides homepage section.
- The section now shows compact public-facing metadata before the cards/empty state:
  - item count
  - route target
  - shelf label (`Homepage planning guides`)

## Public slice improved
Travel Guides on the public homepage now behaves more like the already-improved Featured Tickets and Editorial sections:
- it exposes a clearer data/state surface
- it shows where the CTA route points
- it makes the section feel more CMS-backed and less like a static block

## Still placeholder
- No backend/data model changes
- No new route
- No deeper persistence wiring; this is a public-facing visibility improvement only
