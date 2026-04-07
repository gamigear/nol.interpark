# Task 948 summary

## Files changed
- `src/components/sections/top-picks-section.tsx`

## What changed
- Added `PublicMetaList` to the Top Picks homepage section.
- The section now shows compact public-facing metadata before the cards/empty state:
  - item count
  - route target
  - shelf label (`Homepage curated picks`)

## Public slice improved
Top Picks on the public homepage now exposes a clearer data/path surface instead of only cards or empty-state. This makes the section feel more CMS-backed and consistent with the already-improved Featured Tickets, Editorial, and Travel Guides sections.

## Still placeholder
- No backend/data model changes
- No new route
- No deeper persistence wiring; this is a public-facing visibility improvement only
