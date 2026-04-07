# Task 1133 — Public board 05: complete query/data path for header-navigation-footer shell

## Scope delivered
Hoàn thiện query/data path cho public shell gồm:
- header brand
- primary navigation
- secondary actions
- footer groups
- footer note/basic shell copy

Mục tiêu kiểm: locale-aware fetch, order đúng, fallback an toàn, và public render dùng data path thật thay vì hardcode trực tiếp ở layout.

---

## Files touched
### Modified
1. `src/lib/server/navigation/query.ts`
2. `src/components/layout/site-header.tsx`

### Already-aligned dependencies reviewed in this pass
3. `src/lib/server/navigation/repository-db.ts`
4. `src/app/(public)/[lang]/layout.tsx`
5. `src/components/layout/site-footer.tsx`

---

## What is now stable and DB-backed
### 1) Public shell layout
**File:** `src/app/(public)/[lang]/layout.tsx`

Current behavior:
- layout fetches shell data via `getPublicShellData(lang)`
- passes resolved shell object into `SiteHeader` + `SiteFooter`
- does not hardcode primary/secondary/footer links directly in layout

**Status:** DB-backed shell entrypoint stable

---

### 2) Navigation repository path
**File:** `src/lib/server/navigation/repository-db.ts`

Current behavior:
- fetches `nav_highlight` published blocks
- supports locale-aware localization fetch
- includes English fallback rows when locale-specific rows are absent
- keeps compatibility for admin/runtime/tooling style calls

**Status:** locale-aware repository path stable

---

### 3) Public shell query / mapping layer
**File:** `src/lib/server/navigation/query.ts`

Changes completed in this board pass:
- public shell already fetches navigation by locale route
- `mapLinks()` now explicitly re-sorts items by `displayOrder`
  - this makes ordering stable even if repository/query behavior shifts later
- shell mapper keeps key-based conventions for:
  - `header-primary`
  - `header-secondary`
  - `header-brand`
  - `footer-*`
  - `footer-legal`
- fallback shell remains available when imported data is incomplete

**Why this matters**
- The shell path is no longer overly dependent on upstream SQL ordering alone.
- Mapping layer now protects output ordering itself.

**Status:** DB-backed query/mapping path stable

---

### 4) Header render path
**File:** `src/components/layout/site-header.tsx`

Changes completed in this board pass:
- header still renders from `shell` object, not from static nav arrays in layout
- secondary actions no longer assume:
  - `secondaryLinks[0] === sign-in`
  - `secondaryLinks[1] === primary CTA`
- header now resolves actions by semantic ids first:
  - `sign-in`
  - `plan-trip`
- only if missing does it fallback to secondary/primary arrays
- home href is resolved more safely from locale + shell context

**Why this matters**
- Import batch/order changes will not silently swap the sign-in and CTA buttons.
- Header render is less brittle and more semantic.

**Status:** DB-backed header render stable

---

### 5) Footer render path
**File:** `src/components/layout/site-footer.tsx`

Current behavior:
- footer renders from shell footer groups + footer note
- brand/footer note flow through shell object
- safe fallback copy remains if shell footer note/groups are incomplete

**Status:** DB-backed footer/basic shell render stable

---

## Fallback behavior still present by design
These are not failures.

### Fallback shell triggers when imported shell data is incomplete
Examples:
- missing `header-primary`
- missing `header-secondary`
- missing `footer-*` groups
- missing `footer-legal`
- missing brand/subtitle rows

In those cases:
- fallback brand label/subtitle are used
- fallback nav actions are used
- fallback footer note/group is used

This is intentional to keep public shell alive during partial import states.

---

## Exact hardcode status after this pass
### Still hardcoded, but only as fallback/config — not as primary render source
- fallback copy in `src/lib/server/navigation/query.ts`
- fallback labels in `src/components/layout/site-header.tsx`
- fallback footer note in `src/components/layout/site-footer.tsx`

### No longer hardcoded as the main public shell path
- layout-level primary nav rendering
- layout-level footer links
- header action selection by fixed array positions only

So the shell now reads from the data path first, and hardcoded values only act as a safety net.

---

## Shell surfaces currently DB-backed and stable
### Header brand
- `header-brand` block localization
- fallback copy if absent

### Header primary navigation
- `header-primary` nav block items
- sorted by `displayOrder`
- locale-aware localizations

### Header secondary actions
- `header-secondary` nav block items
- semantic selection by `id` (`sign-in`, `plan-trip`)
- fallback if imported data incomplete

### Footer groups
- `footer-*` nav blocks
- locale-aware titles
- link items sorted by `displayOrder`

### Footer note/basic legal copy
- `footer-legal` localization subtitle/title
- fallback note if absent

---

## Final status
## STATUS: PASS

### Why pass
- public render path uses `getPublicShellData(lang)` end-to-end
- repository layer is locale-aware
- mapping layer is now order-stable
- header action resolution is no longer brittle to array ordering
- footer already consumes shell data path properly

### Remaining intentional fallback
- shell still degrades to fallback content if import data is partial
- this is expected for rebuild/demo runtime and not a blocker

---

## Short conclusion
Board 05 is effectively complete: public shell now uses a real query/data path for header/navigation/footer, with locale-aware fetch, stable ordering, and safer semantic mapping for header actions. The remaining hardcoded strings are fallback guardrails only, not the main render path anymore.
