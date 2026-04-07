# Task 84 working summary

## Goal
Làm rõ contract chung ở server layer giữa admin read summary và persistence-like workflow outputs cho 3 module canonical.

## Shared contract clarified
Created/clarified in persistence layer:
- `AdminCmsPersistenceSummaryFragment`

Fields:
- `recordId`
- `latestStatus`
- `revisionLabel`
- `publicationLabel`
- `revalidationLabel`
- `latestHistoryLabel`
- `changedFieldsLabel`
- `updatedAt`

## Where it is now used

### 1) Persistence outcome
Updated:
- `src/lib/server/admin-cms-persistence.ts`

`AdminCmsPersistenceOutcome` now includes:
- `summary: AdminCmsPersistenceSummaryFragment`

So persistence-like write outputs expose one normalized shared summary fragment.

### 2) Read summary
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Read-side summary items now derive from `outcome.summary` instead of rebuilding the same semantics ad hoc.
This keeps read summary contract compact while clearly sourced from the shared persistence summary fragment.

### 3) Workflow output state
Updated:
- `src/lib/server/admin-cms-workflow.ts`

Workflow state now includes:
- `sharedSummary?: AdminCmsPersistenceSummaryFragment`

So workflow outputs and read-side summary now point at the same normalized server-side summary shape.

## Why this improves coherence
- Read-side no longer reconstructs publication/history helper text independently.
- Workflow output no longer hides the normalized summary fragment inside persistence outcome only.
- One small summary contract is now available to both read-model building and workflow result output.

## Files changed
- `src/lib/server/admin-cms-persistence.ts`
- `src/lib/server/admin-cms-read-models.ts`
- `src/lib/server/admin-cms-workflow.ts`
