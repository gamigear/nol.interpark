# Task 855 — Homepage hotfix retry monitor checkpoint

## Retry micro-slices status
| Task | Subject | Owner | Status |
|---|---|---|---|
| T-857 | retry A: db-query real SQL reader | go-3 | **failed** |
| retry B | homepage SQL read path | — | **not found on page 1** |

## Findings
- **T-857 failed** — exact reason unknown from board (likely LLM error or dispatch issue, similar to prior #835 HTTP 429)
- Retry B not visible on active board page 1 — may not be dispatched or on page 2+

## Homepage read path readiness
**Not usable yet.** Both hotfix retries need to succeed before SQL read path works.

## Blocker for CMS/Homepage vertical slices
- Cannot open Homepage Composer / Navigation / Promos vertical slices until:
  1. DB compat exports hotfix succeeds
  2. Homepage SQL read path hotfix succeeds (both retry A and B)

## 3 next steps
1. **Retry T-857** — if 429 rate limit, wait cooldown then re-dispatch
2. **Verify retry B dispatched** — check page 2+ or confirm with leader
3. **Keep tiny batch momentum** — continue with T-821 candidate paths while hotfixes retry
