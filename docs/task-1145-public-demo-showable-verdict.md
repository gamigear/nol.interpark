# Task #1145: Public Demo-Showable Verdict Checklist

**Date:** 2026-04-06  
**Purpose:** Minimum evidence for public-only demo-showable (no admin required)  
**Audience:** Leader — use to verify public phase completion  

---

## 🎬 PUBLIC DEMO-SHOWABLE

**What it means:** Public website works end-to-end. Real data from DB, navigation functional, content displays correctly. Safe to show to stakeholders.  
**Scope:** Public pages ONLY (no admin)  
**Who verifies:** Team lead  
**Timeline:** ~1–2 weeks  
**Risk:** Low — read-only, no auth required  

---

## Verdict Checklist (All must PASS)

### ✅ 1. Homepage Renders with Real Data
- [ ] Homepage loads without 500 error
- [ ] Page title + SEO metadata present
- [ ] At least ONE content block from DB (hero, featured section, promo)
- [ ] Images load (no broken icons)

**Fail if:** Mock data, hardcoded content, or 500 error.

---

### ✅ 2. Navigation & Footer from Database
- [ ] Header menu renders from DB (not hardcoded)
- [ ] Footer links render from DB (not hardcoded)
- [ ] At least ONE promo/banner section from DB
- [ ] Locale switcher visible (if multi-locale)

**Fail if:** Navigation hardcoded in JSX, promos don't reflect DB state.

---

### ✅ 3. Database-Backed Content Displays Correctly
- [ ] At least ONE entity type renders with all fields:
  - Catalog item: title, description, price, image
  - Article: title, summary, featured image
  - Promo: headline, CTA, image
- [ ] Localization fallback works (missing locale → default language)
- [ ] Published content visible, draft content hidden

**Fail if:** Content missing fields, wrong locale, or draft leaks to public.

---

### ✅ 4. No Console Errors
- [ ] DevTools Console clean (no errors, no warnings)
- [ ] Network tab shows successful API calls (no 404/500)
- [ ] Page renders without lag or visual glitches

**Fail if:** Console errors, failed API calls, or broken layout.

---

### ✅ 5. Seed Data Present
- [ ] At least 3 catalog items visible on public
- [ ] Navigation menu has 3+ items
- [ ] At least 1 promo/banner visible
- [ ] All content has images (no missing assets)

**Fail if:** Seed data incomplete or missing.

---

## Quick Verification (5 min)

1. Open homepage → real data visible? ✅
2. Click navigation → links work, from DB? ✅
3. Scroll page → content displays correctly? ✅
4. Open DevTools Console → clean? ✅
5. Switch locale (if multi-locale) → fallback works? ✅

---

## Evidence Checklist (For Team Before Verdict)

Provide to leader:
- [ ] Screenshot: Homepage with real data visible
- [ ] Screenshot: Navigation menu (DevTools showing DB API call)
- [ ] Screenshot: Content section with all fields (title, image, price/description)
- [ ] Screenshot: DevTools Console (clean, no errors)
- [ ] Screenshot: Locale switcher working (if multi-locale)
- [ ] DB seed status: Row count from each table
- [ ] Env check: `.env` has correct Neon connection string

---

## Verdict Sign-Off

```
VERDICT: ✅ PUBLIC DEMO-SHOWABLE

Date: [Date]
Verified by: [Lead name]
Blockers: None / [List]
Next: Show to stakeholders / Proceed to admin phase
```

---

## NOT Required for Public Demo-Showable

- ❌ Admin sign-in
- ❌ Admin edit forms
- ❌ Content publishing workflow
- ❌ Multi-user management
- ❌ RBAC
- ❌ Media upload
- ❌ Performance tuning
- ❌ Mobile polish
- ❌ Accessibility compliance
- ❌ SEO optimization

---

## Notes

- **Public demo-showable** = "Does the public site work?" (read-only proof)
- Focus on **data flow** (DB → public page)
- No auth, no editing — just display
- Once public passes, move to admin phase
- If public fails, identify which criterion regressed before proceeding

