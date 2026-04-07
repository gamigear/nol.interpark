# Task 88 working summary

## Goal
Áp shared admin summary contract sâu hơn vào 3 module canonical để giảm shape/helper text lặp giữa server/UI.

## What changed

### 1) Workflow client now consumes the shared summary contract directly
Updated:
- `src/components/admin/layout/admin-cms-workflow-client.tsx`

Changes:
- thêm `AdminCmsSharedSummaryCard`
- card này render trực tiếp từ `state.sharedSummary`
- workflow feedback không còn phải dựng lại thủ công nhiều phần record/revision/publication/history/revalidation/changed-fields như trước

### 2) Scaffold text clarified the shared contract usage
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- phần mô tả workflow action section nay nói rõ workflow client cũng đang render shared admin summary contract từ server layer
- read-side và latest workflow feedback vì vậy cùng bám vào một normalized summary shape hơn

## Shared usage improved here
- Read-side summary:
  - dùng `summaryItems` derive từ shared contract ở server read-model layer
- Workflow latest feedback:
  - dùng `state.sharedSummary` trực tiếp từ workflow output server layer
- Cả hai phía giờ đều render cùng semantics normalized hơn thay vì mỗi bên tự dựng helper text riêng

## Files changed
- `src/components/admin/layout/admin-cms-workflow-client.tsx`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
