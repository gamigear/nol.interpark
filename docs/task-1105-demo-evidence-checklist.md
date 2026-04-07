# Task #1105: Demo Evidence Checklist — Ready-to-Show Verdict

**Date:** 2026-04-06  
**Purpose:** Minimum evidence leader must verify before declaring demo "ready to show"  
**Audience:** Leader (reviewer) — use this to sign off on demo readiness  

---

## Evidence Checklist (Reviewer Verification)

### ✅ CRITERION 1: Public Homepage Renders with Real Data

**Evidence needed:**
- [ ] Homepage loads without 500 error (browser shows page, no crash)
- [ ] Page title visible in browser tab (SEO metadata rendered)
- [ ] At least ONE content block shows data from DB:
  - Hero section has dynamic text/image (not placeholder)
  - Featured section displays catalog items with title + price
  - Promo banner shows headline from DB
- [ ] Images load (no broken image icons)

**How to verify:** Open `https://world.nol.com/` (or staging URL) → inspect page source or DevTools Network tab → confirm data comes from API/DB, not hardcoded in HTML.

**Fail if:** Page shows "Loading...", mock data, or 500 error.

---

### ✅ CRITERION 2: Navigation & Promos Load from Database

**Evidence needed:**
- [ ] Header menu items render (Home, About, Contact, etc.)
- [ ] Footer links render (Privacy, Terms, etc.)
- [ ] At least ONE promo/banner section displays:
  - Headline text from DB
  - CTA button with correct link
  - Image asset loads
- [ ] Locale switcher visible and functional (if multi-locale)

**How to verify:** 
- Inspect page HTML → check `<nav>`, `<footer>` contain dynamic content (not hardcoded)
- Check DevTools Network → confirm API calls to `/api/navigation`, `/api/promos`, etc.
- Click locale switcher → page reloads with correct language

**Fail if:** Navigation hardcoded in JSX, promos don't change when DB is updated.

---

### ✅ CRITERION 3: Admin Sign-In Works

**Evidence needed:**
- [ ] `/admin/sign-in` page loads (no 404, no error)
- [ ] Sign-in form has email + password fields
- [ ] Valid credentials accepted (show successful login)
- [ ] Invalid credentials rejected (show error message)
- [ ] After sign-in, redirects to `/admin/dashboard`
- [ ] Session persists (reload page → still logged in)

**How to verify:**
- Navigate to `/admin/sign-in`
- Try invalid credentials → error shown
- Try valid credentials → redirected to dashboard
- Reload page → still on dashboard (session cookie present)
- Check DevTools Cookies → `session` or `auth` cookie exists

**Fail if:** Sign-in form broken, no error on invalid creds, session not persisted.

---

### ✅ CRITERION 4: Admin Can Edit & Publish Content

**Evidence needed:**
- [ ] Admin dashboard loads after sign-in
- [ ] At least ONE content edit form accessible (e.g., promo editor, hero section editor)
- [ ] Form allows editing (text input, image picker, toggle, etc.)
- [ ] Save/Publish button works (no error, shows success message)
- [ ] Public homepage reflects change within 1–2 reloads

**How to verify:**
- Sign in → navigate to admin dashboard
- Open content editor (e.g., "Edit Promo" or "Edit Hero Section")
- Change a value (e.g., promo title from "Summer Sale" to "Spring Sale")
- Click Save/Publish
- Go back to public homepage
- Reload page → new title appears

**Fail if:** No edit form, save fails, public page doesn't update.

---

### ✅ CRITERION 5: Database-Backed Content Displays Correctly

**Evidence needed:**
- [ ] At least ONE entity type renders from DB with all fields:
  - **Catalog item:** title, description, price, image
  - **Article:** title, summary, featured image
  - **Promo:** headline, CTA text, image
- [ ] Localization works (if multi-locale):
  - Missing locale falls back to default language
  - Content displays in correct language
- [ ] Draft content NOT visible on public page
- [ ] Published content visible on public page

**How to verify:**
- Inspect page source → confirm data structure matches DB schema
- Check DevTools Network → API response shows correct fields
- If multi-locale: switch language → content updates
- Admin: create draft content → public page doesn't show it
- Admin: publish content → public page shows it

**Fail if:** Content missing fields, wrong locale, draft leaks to public.

---

## Quick Verdict Template

Use this to sign off:

```
DEMO VERDICT: [READY / NOT READY]

Evidence Summary:
✅ Criterion 1 (Homepage Real Data): PASS / FAIL
✅ Criterion 2 (Navigation from DB): PASS / FAIL
✅ Criterion 3 (Admin Sign-In): PASS / FAIL
✅ Criterion 4 (Edit & Publish): PASS / FAIL
✅ Criterion 5 (DB Content Display): PASS / FAIL

Blockers (if any):
- [List any failed criteria or issues]

Next Steps:
- [Reassign to team member if blocker found]
- [Schedule demo date if READY]
```

---

## Evidence Collection Checklist (For Team Before Demo)

Before submitting to leader, team must provide:

- [ ] **Screenshot 1:** Public homepage with real data visible
- [ ] **Screenshot 2:** Admin sign-in page + successful login
- [ ] **Screenshot 3:** Admin dashboard + content editor open
- [ ] **Screenshot 4:** Content edited + saved + public page updated
- [ ] **Screenshot 5:** Navigation/footer from DB (DevTools Network tab showing API call)
- [ ] **Console log:** No errors on public or admin pages (DevTools Console clean)
- [ ] **DB seed status:** Confirm seed data inserted (row count from each table)
- [ ] **Env check:** `.env` has correct Neon connection string, no hardcoded URLs

---

## Notes for Leader

- **This checklist is for YOU to verify** — use it to sign off on demo readiness
- **Each criterion is binary:** PASS or FAIL — no partial credit
- **If any FAIL:** identify which team member owns that piece, reassign, and re-verify
- **Once all PASS:** demo is ready to show to stakeholders
- **Timeline:** Expect 15–20 min to verify all 5 criteria

---

## Reviewer Sign-Off

| Field | Value |
|-------|-------|
| Reviewer | [Leader name] |
| Date Verified | [Date] |
| Verdict | READY / NOT READY |
| Blockers | [List or "None"] |
| Next Action | [Demo scheduled / Reassign to team] |

