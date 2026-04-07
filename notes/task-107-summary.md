# Task 107 working summary

## Goal
Chốt một helper/contract chung ở server layer để cả read-model assembly và workflow-side cùng consume.

## Deliverable implemented
### Shared helper/contract chosen
- `AdminCmsSharedSummaryContract`
- helper `createAdminCmsSharedSummaryContract(...)`

Defined in:
- `src/lib/server/admin-cms-persistence.ts`

Shape:
- `updatedAt`
- `items`
- `semantics`

## What changed

### 1) Persistence layer now owns the final shared summary contract
Updated:
- `src/lib/server/admin-cms-persistence.ts`

Changes:
- thêm `AdminCmsSummaryLineItem`
- thêm `AdminCmsSharedSummaryContract`
- thêm helper `toAdminCmsSummaryItems(summary)`
- thêm helper `createAdminCmsSharedSummaryContract(summary, semantics)`
- `AdminCmsPersistenceOutcome` nay có `sharedSummary`

=> Tức là persistence-like layer giờ không chỉ trả raw fragment + semantics rời nhau, mà trả luôn contract cuối mà downstream có thể consume trực tiếp.

### 2) Read-model assembly now consumes the shared contract directly
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Changes:
- `AdminCmsModuleSummary` nay giữ `sharedSummary` thay vì tự lưu `summaryItems + semantics` rời
- read-model build trực tiếp từ `outcome.sharedSummary`

### 3) Workflow-side now consumes the same shared contract directly
Updated:
- `src/lib/server/admin-cms-workflow.ts`
- `src/components/admin/layout/admin-cms-workflow-client.tsx`

Changes:
- workflow state nay giữ `sharedSummary?: AdminCmsSharedSummaryContract`
- workflow client render trực tiếp contract này
- không còn cần kết hợp raw fragment + semantics thủ công ở client

### 4) Scaffold/read-side now also renders the same shared contract
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- read-side summary render trực tiếp `summary.sharedSummary`
- copy mô tả đã làm rõ read-side và workflow-side cùng bám một helper/contract server-side duy nhất hơn

## What is clearer now
- Một helper/contract cụ thể đã được cắm vào cả hai phía:
  - read-model assembly
  - workflow-side state/output
- Shared contract cuối không còn bị tách rời thành nhiều lớp mà downstream phải tự ghép.
- Semantics helper đã được gom rõ hơn ở server layer.

## Files changed
- `src/lib/server/admin-cms-persistence.ts`
- `src/lib/server/admin-cms-read-models.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/components/admin/layout/admin-cms-workflow-client.tsx`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
