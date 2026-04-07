# Task 48 working summary

## Goal
Thêm server-action placeholders và draft/publish workflow skeleton cho 3 module admin canonical:
- `/admin/homepage`
- `/admin/navigation`
- `/admin/promos`

## What was already there
- 3 route canonical đã được wire thật và render `AdminCmsScaffold`.
- UI mới dừng ở mức typed mock/view-model scaffold, chưa có submission path thật.

## Changes implemented in this task

### 1) Typed workflow/action foundation
Updated:
- `src/components/admin/dashboard/admin-cms-modules.ts`

Added:
- `AdminCmsWorkflowAction`
- `AdminCmsWorkflowStep`
- `AdminCmsSubmissionPreset`
- status helper exports (`toAdminCmsStatusTone`, `makeAdminCmsStatus`)
- `adminCmsWorkflowActionLabels`
- `submissionPresets` for each module

Per module now has explicit placeholder actions such as:
- save draft
- schedule
- publish
- archive (where relevant)

### 2) Server action placeholder
Created:
- `src/lib/server/admin-cms-workflow.ts`

Contains:
- `runAdminCmsWorkflowAction`
- `initialAdminCmsWorkflowState`
- typed payload parsing from `FormData`
- placeholder success response shape with:
  - module key
  - action
  - next status
  - message/detail
  - revalidated paths
  - timestamp

Important:
- This is still placeholder logic only.
- It intentionally does **not** persist to DB.
- It does call `revalidatePath()` for the canonical module route and `/admin/dashboard` so the submission path feels like a real App Router mutation boundary.

### 3) Client-side workflow UI bound to server action
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- converted scaffold component file to client component (`'use client'`)
- added `useActionState()` integration with `runAdminCmsWorkflowAction`
- added workflow form with:
  - target item selector
  - operator note textarea
  - action buttons / submission presets
  - workflow feedback area with returned state
- retained existing stats/list/editor/workflow/activity sections

This makes each admin module feel more alive:
- operator can submit placeholder draft/schedule/publish/archive actions
- route returns visible feedback with next status + message + timestamp

### 4) Route topbar metadata updated
Updated:
- `src/app/(admin-protected)/admin/homepage/page.tsx`
- `src/app/(admin-protected)/admin/navigation/page.tsx`
- `src/app/(admin-protected)/admin/promos/page.tsx`

Adjusted `metaChips` to explicitly reflect the new state:
- server action placeholder
- draft/publish flow
- scheduling shell / placement boundary / validation boundary depending on module

### 5) Styling for workflow UI
Updated:
- `src/app/globals.css`

Added styles for:
- workflow form grid
- field controls (select / textarea)
- workflow preset buttons grid
- workflow feedback card

## What is now true after this task
- 3 canonical admin modules now have a real form submission path.
- There is a real Next.js server action placeholder behind the workflow UI.
- Admin can simulate draft/schedule/publish/archive transitions.
- UI now surfaces action result feedback and next status.
- Revalidation boundaries are explicit for module routes and dashboard.

## What is still placeholder / not production-ready
- No DB persistence yet.
- No real validation library / schema parsing yet.
- No auth/audit linkage beyond current protected shell.
- No real publish scheduling engine.
- No mutation of actual records yet; statuses shown are still mock/view-model driven.

## Files changed in this task
- `src/components/admin/dashboard/admin-cms-modules.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
- `src/app/(admin-protected)/admin/homepage/page.tsx`
- `src/app/(admin-protected)/admin/navigation/page.tsx`
- `src/app/(admin-protected)/admin/promos/page.tsx`
- `src/app/globals.css`
