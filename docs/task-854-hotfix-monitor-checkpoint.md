# Task 854 — Hotfix monitor: db/homepage readiness before CMS slices

## Status
**2 hotfix tasks (db compat exports + homepage SQL read path) not visible on active board page 1.**
- Search for "hotfix db compat exports homepage SQL read path" returned only this checkpoint task (T-854).
- Tasks may not be dispatched yet or on page 2+.

## Most recent completed batch (reference)
- T-831/T-830/T-833/T-832 (tiny batch): all 4/4 completed
- No failures in latest batch

## Readiness for Homepage Composer / Navigation / Promos vertical slices
**Not yet ready.** Missing:
1. **DB compat exports hotfix** — needed before any SQL read path works
2. **Homepage SQL read path hotfix** — needed before Homepage Composer can read real data
3. **Auth MVP** — still not dispatched/visible

## 3 next steps
1. **Verify hotfix tasks dispatched** — check page 2+ or confirm with leader
2. **After both hotfixes complete, dispatch Homepage Composer vertical slice** — start with read-only admin view
3. **Keep tiny batch momentum** — don't idle waiting for hotfixes; next tiny batch can continue with T-821 candidate paths
