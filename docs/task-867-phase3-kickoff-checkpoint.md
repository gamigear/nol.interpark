# Task 867 — Phase-3 kickoff readiness checkpoint

## Foundation status (verified from board)
| Foundation | Task | Status | Owner |
|---|---|---|---|
| Auth salvage | T-850: finalize minimal real sign-in | **completed** | open-2 (CodeMate) |
| Homepage read A | T-865: wire sql reader injection point | **completed** | open-1 (DevMate) |
| Homepage read B | T-863: repository fallback wiring | **completed** | go-4 (DevMate) |
| DB hotfix compat exports | — | **not found on active board page 1** | — |

## What's usable now
1. **Auth**: minimal real sign-in + guard wiring done (T-850)
2. **Homepage read path**: SQL reader injection + repository fallback wiring done (T-865, T-863)
3. **Tiny batch momentum**: T-831/T-830/T-833/T-832/T-859/T-860/T-858/T-862 all completed

## What's NOT yet confirmed
- **DB compat exports hotfix** — not found on active board page 1; may be on page 2+ or not dispatched
- **End-to-end homepage read path verification** — micro-slices done but not yet tested against real DB

## 3 next practical steps toward Homepage Composer / Navigation / Promos
1. **Verify DB compat exports** — confirm dispatched/complete; if not, dispatch immediately
2. **Dispatch Homepage Composer read-only vertical slice** — start with admin read view using wired SQL reader + repository fallback; this is the smallest test of the full stack
3. **Retry phase-3 map (T-869 failed)** — re-dispatch with same scope: exact vertical slice plan for composer/navigation/promos
