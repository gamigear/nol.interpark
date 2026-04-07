# Task #1120: Demo-Showable vs Staging-Ready Verdict

**Date:** 2026-04-06  
**Purpose:** Clear split between "demo showable" (internal proof) and "staging-ready" (production-like)  
**Audience:** Leader — use this to know which gate to pass before each milestone  

---

## Two Verdict Levels

### 🎬 LEVEL 1: DEMO-SHOWABLE
**What it means:** Internal demo works, proves rebuild is functional. Safe to show to stakeholders/client.  
**Who verifies:** Team lead (internal gate)  
**Timeline:** ~1–2 weeks into rebuild  
**Risk:** Low — demo environment, controlled audience  

**Checklist (All must PASS):**
- [ ] Public homepage renders with real DB data (no mock)
- [ ] Navigation & promos load from database
- [ ] Admin sign-in works (valid credentials accepted)
- [ ] Admin can edit content and changes reflect on public page
- [ ] Database-backed content displays correctly (all fields, localization fallback)
- [ ] No console errors on public or admin pages
- [ ] Seed data inserted (at least 3 catalog items, navigation, promos)

**NOT required:**
- ❌ Multi-user admin management
- ❌ RBAC (role-based access control)
- ❌ Media upload UI
- ❌ Performance tuning / CDN caching
- ❌ Mobile responsiveness polish
- ❌ Accessibility compliance
- ❌ Production database backup strategy
- ❌ Load testing / stress testing

**Verdict:** ✅ DEMO-SHOWABLE

---

### 🚀 LEVEL 2: STAGING-READY
**What it means:** Production-like environment, safe to deploy to staging. Ready for extended testing, client acceptance, and pre-production validation.  
**Who verifies:** Tech lead + QA (external gate)  
**Timeline:** ~3–4 weeks into rebuild  
**Risk:** Medium — staging mirrors production, but not live yet  

**Checklist (All must PASS, includes DEMO-SHOWABLE + additional):**

**From DEMO-SHOWABLE:**
- [ ] All 7 demo-showable criteria PASS

**Additional for Staging:**
- [ ] Database schema finalized (no breaking migrations expected)
- [ ] Neon PostgreSQL connection stable (no connection pool issues)
- [ ] Admin auth flow hardened (password hashing, session timeout, CSRF protection)
- [ ] At least 2 content edit forms implemented (not just 1)
- [ ] Publish/cache revalidation works reliably (no stale content)
- [ ] Error handling in place (404, 500 pages render correctly)
- [ ] Environment variables properly configured (no hardcoded secrets)
- [ ] Database backups automated (Neon branch or snapshot strategy)
- [ ] Logging/monitoring in place (can track errors in staging)
- [ ] No console errors or warnings on public or admin pages
- [ ] Performance acceptable (homepage loads < 3s, admin pages < 2s)
- [ ] Mobile layout functional (not polished, but usable)
- [ ] Locale switching works without errors (if multi-locale)

**NOT required:**
- ❌ Full RBAC or multi-user admin
- ❌ Media upload UI
- ❌ Advanced CMS features (page builder, workflow approval)
- ❌ Accessibility compliance (WCAG)
- ❌ Load testing / stress testing
- ❌ CDN caching tuning
- ❌ SEO optimization (meta tags, sitemap, robots.txt)

**Verdict:** ✅ STAGING-READY

---

## Decision Tree for Leader

```
Is demo working internally?
├─ YES → Check DEMO-SHOWABLE checklist
│  ├─ All PASS? → ✅ DEMO-SHOWABLE (show to client/stakeholders)
│  └─ Any FAIL? → Fix blocker, re-verify
│
└─ NO → Fix core issues (homepage, auth, DB connection)

Is demo-showable + production-like?
├─ YES → Check STAGING-READY checklist
│  ├─ All PASS? → ✅ STAGING-READY (deploy to staging)
│  └─ Any FAIL? → Fix blocker, re-verify
│
└─ NO → Harden auth, add error handling, optimize performance
```

---

## Quick Reference

| Aspect | Demo-Showable | Staging-Ready |
|--------|---------------|---------------|
| **Data** | Real DB data | Real DB data + backups |
| **Auth** | Basic sign-in | Hardened (hashing, timeout, CSRF) |
| **Content** | 1+ edit form | 2+ edit forms |
| **Performance** | Not measured | < 3s homepage, < 2s admin |
| **Error Handling** | Basic | 404, 500 pages, logging |
| **Mobile** | Not required | Functional (not polished) |
| **Audience** | Internal team | Client + extended testing |
| **Risk** | Low | Medium |
| **Next Step** | Show to stakeholders | Deploy to staging |

---

## Verdict Sign-Off Template

### For DEMO-SHOWABLE
```
VERDICT: ✅ DEMO-SHOWABLE

Date: [Date]
Verified by: [Lead name]
Blockers: None / [List]
Next: Schedule client demo
```

### For STAGING-READY
```
VERDICT: ✅ STAGING-READY

Date: [Date]
Verified by: [Tech lead + QA]
Blockers: None / [List]
Next: Deploy to staging environment
```

---

## Notes

- **Demo-Showable** = "Does it work?" (internal proof)
- **Staging-Ready** = "Is it production-like?" (external validation)
- Don't skip demo-showable → go straight to staging-ready
- If staging-ready fails, identify which demo-showable criterion regressed
- Once staging-ready, next phase: production hardening (SEO, accessibility, load testing)

