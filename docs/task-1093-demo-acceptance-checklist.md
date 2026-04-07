# Task #1093: Demo Acceptance Checklist — world.nol.com Runnable Demo

**Date:** 2026-04-06  
**Purpose:** Minimum pass/fail criteria for a runnable demo of world.nol.com rebuild.  
**Audience:** Leader for coordination & decision-making.

---

## Acceptance Criteria (Pass/Fail)

### 1. Public Homepage Renders with Real Data ✓ PASS
- [ ] Homepage loads without 500 error
- [ ] Page title + SEO metadata render correctly
- [ ] At least one content block displays data from database (not mock/hardcoded)
  - Example: hero section, featured tickets section, or promo banner
- [ ] Images load and display (media assets from DB or CDN)

**Fail condition:** Homepage shows mock data, hardcoded content, or database query fails.

---

### 2. Navigation & Promos Load from Database ✓ PASS
- [ ] Header navigation menu renders from `navigation_menus` + `navigation_items` tables
- [ ] Footer links render from `footer_config` or equivalent DB record
- [ ] At least one promo/banner section pulls from `promos` table and displays correctly
- [ ] Locale switcher works (if multi-locale seeded)

**Fail condition:** Navigation hardcoded in component, promos don't reflect DB state.

---

### 3. Admin Sign-In Works (Basic Level) ✓ PASS
- [ ] `/admin/sign-in` page loads
- [ ] Form accepts email + password input
- [ ] Valid credentials (bootstrap or DB user) allow sign-in
- [ ] Invalid credentials show error message
- [ ] Successful sign-in redirects to `/admin/dashboard`
- [ ] Session cookie set and persists across page reload

**Fail condition:** Sign-in form broken, credentials not validated, no session established.

---

### 4. Admin Can Edit & Publish Content (Minimum) ✓ PASS
- [ ] Admin dashboard loads after sign-in
- [ ] Admin can access at least one content edit form (e.g., promo, section title, or hero text)
- [ ] Admin can modify content (e.g., change promo title, update section heading)
- [ ] Admin can save/publish changes
- [ ] Public homepage reflects the change within 1–2 page reloads (cache revalidation works)

**Fail condition:** No edit UI, changes don't save, public page doesn't reflect updates.

---

### 5. Database-Backed Content Displays Correctly ✓ PASS
- [ ] At least one entity type renders from DB:
  - Catalog item (ticket/product/experience) with title, image, price
  - Article/guide with title, summary, image
  - Promo with headline, CTA, image
- [ ] Localization fallback works (if multi-locale: missing locale falls back to default)
- [ ] Published state respected (draft content not visible on public page)

**Fail condition:** Content missing, wrong locale, or draft content leaks to public.

---

## Demo Flow (Suggested)

1. **Show public homepage** → point out real data from DB (hero, cards, promo)
2. **Show admin sign-in** → log in with valid credentials
3. **Show admin dashboard** → navigate to content editor
4. **Edit one piece of content** → change title or toggle visibility
5. **Publish/save** → show change reflected on public page (refresh to see cache revalidation)
6. **Verify navigation** → click header/footer links, show they're from DB

---

## Out of Scope (Not Required for Demo)

- ❌ Multi-user admin management
- ❌ Full RBAC (role-based access control)
- ❌ Audit logs / revision history
- ❌ Media upload UI
- ❌ Bulk content import
- ❌ Advanced CMS features (page builder, workflow approval)
- ❌ Performance optimization / CDN caching tuning
- ❌ Mobile responsiveness polish
- ❌ Accessibility compliance

---

## Technical Readiness Checklist (For Dev Team)

Before demo, ensure:

- [ ] Neon PostgreSQL schema deployed (tables exist)
- [ ] Seed data inserted (homepage, sections, navigation, promos, at least 3 catalog items)
- [ ] Next.js app connects to Neon (connection string in `.env`)
- [ ] Public homepage query layer works (`getHomePageData(locale)` or equivalent)
- [ ] Admin auth flow wired (sign-in action, session validation, dashboard layout)
- [ ] At least one admin edit form implemented (promo title, section heading, or hero text)
- [ ] Publish/save action updates DB and triggers cache revalidation
- [ ] No console errors on public or admin pages

---

## Pass/Fail Decision

**PASS:** All 5 acceptance criteria met.  
**FAIL:** Any criterion not met (e.g., homepage still mock data, admin sign-in broken, changes don't reflect).

---

## Notes for Leader

- This checklist is **minimal** — it proves the rebuild is runnable, not feature-complete.
- Focus on **data flow** (DB → public) and **admin workflow** (edit → publish → reflect).
- If any criterion fails, identify blocker and reassign to relevant team member.
- Once demo passes, next phase can expand: multi-user admin, advanced CMS, performance tuning.
