# Task 864 — Homepage retry micro-slice monitor checkpoint

## Retry micro-slices status
| Task | Subject | Owner | Status |
|---|---|---|---|
| T-865 | retry A: wire sql reader injection point | open-1 (DevMate) | **completed** |
| T-863 | retry B: repository fallback wiring only | go-4 (DevMate) | **completed** |

## Previous attempts (reference)
| Task | Subject | Owner | Status |
|---|---|---|---|
| T-857 | hotfix retry A: db-query real SQL reader | go-3 (CodePilot) | **failed** |
| T-856 | hotfix retry B: repository fallback wiring | go-4 (DevMate) | **failed** |

## Homepage read path readiness
**Partially usable.** Both retry micro-slices completed:
- T-865: SQL reader injection point wired
- T-863: Repository fallback wiring completed (fixed missing import bug from previous attempt)

## Missing step before CMS vertical slices
**1 step remaining:** Verify the wired SQL reader + repository fallback actually work end-to-end (test homepage read path with real DB or confirmed fallback). Once verified, Homepage Composer read-only admin view can be dispatched.
