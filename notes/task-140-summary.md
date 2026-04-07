# Task 140 working summary

## Goal
Chốt thêm một refinement nhỏ quanh admin shared summary helper/render semantics.

## Refinement completed
### Added typed row-to-view mapping for shared summary rows
Updated:
- `src/components/admin/layout/admin-cms-shared-summary-view.tsx`

Added:
- `AdminCmsSummaryRowViewSpec`
- `createAdminCmsSummaryRowViewSpec(key)`
- `AdminCmsSharedSummaryRow`

## What it does
- Mỗi shared summary row giờ không còn bị render như cùng một loại text thuần nữa
- Row render semantics được map theo `AdminCmsSummaryRowSemanticKey`
- Hiện mapping hỗ trợ:
  - `latest-record`
  - `latest-status`
  - `revalidation-targets`
  - `changed-fields`

Per-row semantics now control:
- `valueClassName`
- `helperPrefix`

## Why this helps
Before:
- item rows đã có semantic key typed ở server layer
- nhưng shared summary view vẫn render tất cả rows bằng cùng một template khá flat

Now:
- typed semantic key đã được kéo sang helper render layer
- read/workflow/shared summary view đồng đều hơn không chỉ ở data contract mà cả ở row presentation semantics

## Files changed
- `src/components/admin/layout/admin-cms-shared-summary-view.tsx`
