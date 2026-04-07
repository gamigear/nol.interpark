# Task 1347 — nol.interpark homepage responsive/detail completion pass

## Scope
Final QA/fix pass focused only on the homepage clone responsive/detail behavior for `nol.interpark`.

## Files changed
1. `src/app/globals.css`
2. `src/components/interactive/horizontal-carousel.tsx`

## Files already tuned earlier in the same responsive stream and reviewed again in this pass
3. `src/components/layout/responsive-image.tsx`
4. `src/components/layout/clone-section-shell.tsx`

---

## Final responsive/detail fixes
### 1) `src/app/globals.css`
Improved homepage shelf overflow and mobile/tablet detail behavior.

### Carousel track polish
Added to `.carousel-track`:
- `scroll-padding-inline: 2px`
- `overscroll-behavior-x: contain`
- `padding: 0 2px 4px`

Why:
- smoother edge alignment when snapping horizontally
- better containment for horizontal scroll behavior
- less awkward clipped start/end card edges

### Tablet tuning (`max-width: 960px`)
Updated carousel track to:
- `grid-auto-columns: minmax(320px, 42vw)`
- `gap: 18px`

Why:
- tablet no longer falls too abruptly between desktop and mobile shelf width behavior
- cards keep readable width while still allowing horizontal browsing rhythm

### Mobile tuning (`max-width: 640px`)
Refined:
- `.section-panel` now also uses `gap: 18px`
- `.carousel` gap reduced to `12px`
- `.carousel-head` hidden on mobile
- `.carousel-track` uses:
  - `grid-auto-columns: minmax(86%, 1fr)`
  - `gap: 14px`
  - `scroll-padding-inline: 0`
  - `padding-inline: 0`

Why:
- less wasted vertical space on mobile
- avoids tiny desktop-like carousel controls crowding the mobile viewport
- card shelf swipe feels more natural and less over-padded on small screens

---

### 2) `src/components/interactive/horizontal-carousel.tsx`
Completed interaction helper polish.

Changes:
- `controlsLabel` prop is now actually wired into the rendered controls container `aria-label`
- `className` and `trackClassName` remain available for section-level tuning

Why:
- lets homepage sections customize control semantics cleanly
- removes the last hardcoded controls label in the shared carousel helper
- keeps the interaction helper ready for multiple homepage shelf variants

---

## Responsive/detail state confirmed in this pass
### Hero/image ratio behavior
Reviewed and kept:
- `hero`: `5/6 -> 4/5 -> 16/10 -> 21/9`
- `wide`: `16/10 -> 16/9`

Effect:
- hero feels taller and less awkward on mobile
- wide promo/card media keeps better balance before reaching desktop

### Container / section rhythm
Reviewed and kept:
- clone section shell: `py-8 md:py-12 xl:py-16`
- container: `max-w-[1280px]`
- padding: `px-4 sm:px-5 md:px-6 xl:px-8`

Effect:
- homepage sections breathe more like a real commercial landing page
- mobile/tablet/desktop spacing progression is smoother

---

## Viewport improvements summary
### Mobile
- hero remains taller and less flattened
- section panels have tighter but cleaner internal rhythm
- carousel controls disappear to prioritize swipe interaction
- shelf cards use larger visible width with less dead spacing

### Tablet
- shelf/card overflow no longer jumps too harshly between desktop and mobile modes
- carousel card widths remain readable at mid-size screens
- section spacing remains balanced without feeling too sparse

### Desktop
- wide container and larger section rhythm remain intact
- hero still expands to wide visual treatment cleanly
- scrollable shelf behavior keeps edge alignment cleaner

---

## Verification
Verified by re-reading the edited files and confirming:
- `horizontal-carousel.tsx` now fully wires `controlsLabel`
- CSS rules align with the homepage-only responsive goals
- changes are self-contained and limited to homepage-responsive/layout scope
- no backend or unrelated app logic touched

## Final verdict
PASS

Homepage clone responsive/detail behavior is now materially cleaner across mobile / tablet / desktop, especially around hero proportion, section rhythm, horizontal shelf overflow, and interaction affordance.