# Task 1118 — Demo-critical source-site parity checkpoint

## Source checked
- `https://world.nol.com/en` (homepage snapshot via web fetch)

## Rebuild files reviewed
- `src/app/(public)/[lang]/layout.tsx`
- `src/app/(public)/[lang]/page.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/sections/promo-banner-section.tsx`
- `src/lib/server/navigation/query.ts`

## Files touched
- No code changes

---

## Short parity checkpoint

### What is already close enough for demo
1. **Core homepage slice lineup is broadly aligned**
   - Source has the same high-level demo-critical slices the rebuild is already centered on:
     - header/nav
     - hero
     - This Week’s Top Tickets
     - K-POP Fans Top Picks
     - promo/banner strip
     - Busan/product shelf
     - editorial/K-food style content shelf
     - Travel Guides
     - footer
   - For a demo framed as **content/CMS vertical slice**, the rebuild is covering the right backbone.

2. **Content-family mapping is directionally correct**
   - ticket cards in source map well to rebuild `featured tickets`
   - product/activity cards map well to `top picks` / Busan shelf
   - article/editorial cards map well to `editorial` + `travel guides`
   - promo strip concept exists in both source and rebuild

3. **Public shell is wired enough to support source-backed demo data**
   - rebuild already has DB-backed/fallback-aware shell for nav/footer
   - homepage already composes homepage + promo server reads
   - recent adapter fixes reduced mismatch risk around ordering/text-field aliases

---

## Important parity gaps before demo

### 1) Hero parity is the biggest visible gap
**Source site**
- rich hero/campaign carousel
- multiple slides / visual campaign states
- strong above-the-fold marketing feel

**Rebuild now**
- simplified static hero panel with title + description only
- no visual carousel/campaign treatment from source

**Risk for demo:** high visual mismatch
- This is the first thing people notice.
- Even if content slices below are correct, the homepage can still feel obviously “not source-parity”.

**Recommendation:**
- If only one thing gets polished before show, polish hero presentation or explicitly frame it as a content-layer demo, not homepage visual parity.

---

### 2) Source homepage is much denser than rebuild
**Source site currently includes extra shelves/modules beyond the rebuild subset**, e.g.
- This Week's Concert
- birthday cafe / seasonal promo modules
- cherry blossom / spring festival shelves
- venue/location highlights
- fan tour shelves
- K-beauty shelves
- extra editorial/product modules

**Rebuild now**
- intentionally keeps a smaller vertical slice subset

**Risk for demo:** medium
- Not a blocker if the story is “rebuild/CMS demo for core content slices”.
- Becomes a problem only if the demo is presented as “homepage already matches source closely”.

**Recommendation:**
- Frame current state as **subset parity on demo-critical slices**, not full homepage parity.

---

### 3) Header parity is functional, not source-faithful yet
**Source site**
- richer chrome and utility affordances (e.g. account presence, richer campaign/header behavior)
- more polished brand/navigation experience

**Rebuild now**
- clean shell with brand, primary nav, and two action links
- fallback-driven and DB-shell capable
- but still much thinner than source in affordance richness

**Risk for demo:** medium
- Navigation works as a shell, but it does not yet feel like the source header.

**Recommendation:**
- Fine for demo if positioned as data-wired navigation shell.
- Not fine if expecting header parity review from stakeholders focused on polish.

---

### 4) Footer parity is the weakest structural slice after hero
**Source site**
- richer footer information architecture and branding depth

**Rebuild now**
- shell/footer groups + note
- enough for demo plumbing, but visibly simplified

**Risk for demo:** low-to-medium
- Usually less damaging than hero/header, but still obviously not source-level.

**Recommendation:**
- Acceptable if footer is not a focal point in demo.
- Do not oversell footer parity.

---

### 5) Promo parity is conceptually right but materially thinner
**Source site**
- multiple seasonal/marketing blocks and more varied promo forms

**Rebuild now**
- one promo banner/strip section pattern
- enough to prove CMS/content wiring

**Risk for demo:** low
- This is acceptable for a vertical slice demo.
- Bigger issue is quantity/variety, not wrong direction.

---

## Demo-risk summary

### Safe enough to show
- homepage content vertical slice narrative
- source-backed tickets/products/editorial/travel-guides concept
- basic nav/footer shell wiring
- promo strip wiring

### Needs careful framing
- overall homepage parity claim
- header/footer sophistication
- campaign/hero experience

### Most likely to be noticed immediately
1. hero is much simpler than source
2. homepage has fewer modules than source
3. header/footer are thinner than source chrome

---

## Recommended wording for lead/demo framing
Current rebuild is **not full source-site parity**.
It is **good partial parity on demo-critical content slices**:
- core homepage shelves
- navigation shell
- promo wiring
- footer shell

The rebuild is strongest when framed as:
- **content-layer / CMS-read-path demo**
- **vertical slice proving source-backed homepage composition**

Not as:
- pixel-complete homepage clone
- full homepage/module parity with current world.nol production

---

## Bottom line
For the upcoming show, parity is **good enough at the slice level** but **not yet convincing at the full homepage experience level**. The most important mismatch to watch is the **hero/campaign experience**, followed by the **missing extra homepage modules** and the still-thin **header/footer chrome**.
