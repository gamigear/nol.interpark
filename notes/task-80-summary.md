# Task 80 working summary

## Goal
Gắn read-side summary source sát hơn với persistence-like outcomes/history cho 3 module canonical, nhưng vẫn giữ contract gọn.

## What changed

### 1) Read summary now derives more directly from persistence-like outcome context
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Changes:
- vẫn giữ contract gọn của `AdminCmsModuleSummary`:
  - `key`
  - `title`
  - `updatedAt`
  - `statusBreakdown`
  - `summaryItems`
- nhưng `summaryItems` giờ không chỉ là latest record/status/changed fields đơn giản nữa
- summary source nay derive thêm trực tiếp từ persistence-like outcome:
  - publication transition context
  - revalidation targets
  - latest history event
- nghĩa là read-side đã bám sát hơn vào:
  - `outcome.publication`
  - `outcome.history`
  - `outcome.record`

### 2) Scaffold stays simple and only renders the normalized summary contract
No broad contract expansion.
Read-side vẫn gọn: scaffold chỉ cần render `summary.summaryItems` + `statusBreakdown`.

## Read/write coherence improved at these points
- Read summary helper text giờ phản ánh trực tiếp publication outcome từ write-side abstraction
- Read summary có latest history event từ persistence-like history
- Read summary vẫn không cần biết toàn bộ persistence internals, chỉ dùng contract server-normalized

## Current read-side flow
1. Canonical page gọi `getAdminCmsModuleReadModel(moduleKey)`
2. Server read-model layer tạo `summary`
3. `summary` được derive từ persistence-like outcome mock
4. Scaffold render `summary` mà không bám trực tiếp persistence internals

## Still mock
- Chưa có DB thật
- Persistence-like outcome vẫn là mock
- History vẫn được synthesize từ mock write seeds

## Files changed
- `src/lib/server/admin-cms-read-models.ts`
