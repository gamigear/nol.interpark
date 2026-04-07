# Task 92 working summary

## Goal
Chuẩn hóa thêm interface/state shape chung mà workflow client và scaffold cùng tiêu thụ.

## What was mismatched before
- Read-side scaffold dùng `summary.summaryItems`
- Workflow client dùng raw `AdminCmsPersistenceSummaryFragment`
- Dù semantics đã gần nhau, hai phía vẫn render qua 2 shape khác nhau

## Changes implemented

### 1) Normalized shared item interface
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Changes:
- đổi tên/chuẩn hóa item interface thành:
  - `AdminCmsSummaryLineItem`
- thêm helper chung:
  - `toAdminCmsSummaryItems(summary: AdminCmsPersistenceSummaryFragment)`
- read-model summary bây giờ dùng chính helper này để tạo `summaryItems`

### 2) Workflow client now consumes the same normalized item shape
Updated:
- `src/components/admin/layout/admin-cms-workflow-client.tsx`

Changes:
- import `toAdminCmsSummaryItems` + `AdminCmsSummaryLineItem`
- thêm `AdminCmsSummaryItemsCard`
- `AdminCmsSharedSummaryCard` bây giờ không render raw fragment nữa,
  mà convert `state.sharedSummary` -> normalized summary items qua `toAdminCmsSummaryItems()`

## What is more consistent now
- Read-side scaffold and workflow client now share the same normalized item shape:
  - label
  - value
  - helper
- Shared summary contract is no longer only common at server semantics level; it is also normalized into a reusable UI-facing item shape.
- This reduces duplication of rendering semantics across canonical modules.

## Files changed
- `src/lib/server/admin-cms-read-models.ts`
- `src/components/admin/layout/admin-cms-workflow-client.tsx`
