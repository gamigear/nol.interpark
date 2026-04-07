# Task 76 working summary

## Scope
Chốt hẹp server read-model summary source cho 3 module canonical:
- `/admin/homepage`
- `/admin/navigation`
- `/admin/promos`

Mục tiêu: scaffold nhận dữ liệu read-side từ server layer rõ ràng hơn, thay vì dựa quá trực tiếp vào UI config cứng.

## Read-side flow hiện tại
1. Page canonical gọi `getAdminCmsModuleReadModel(moduleKey)` từ `src/lib/server/admin-cms-read-models.ts`
2. Server layer trả về:
   - `module`
   - `summary`
3. `AdminCmsScaffold` nhận `module + summary`
4. `summary` được render ở block `Server summary source`
5. Workflow write-path vẫn nằm ở `AdminCmsWorkflowClient` riêng, không trộn trực tiếp vào contract read-side

## Changes implemented

### 1) Narrowed server summary contract
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Changes:
- thu gọn `AdminCmsModuleSummary` về contract hẹp hơn, tập trung vào read-side summary source:
  - `key`
  - `title`
  - `updatedAt`
  - `statusBreakdown`
  - `summaryItems`
- thêm `AdminCmsModuleSummaryItem`
- bỏ việc đẩy quá nhiều publication/history/persistence arrays vào read summary contract của task hẹp này
- vẫn giữ việc derive summary từ server layer thay vì UI layer

### 2) Scaffold now consumes the narrowed server summary contract
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- thay block read-side bằng `Server read summary`
- render `summary.updatedAt`
- render `summary.summaryItems`
- giữ rõ separation:
  - server read summary source
  - client workflow actions
- scaffold tiếp tục nhận `module + summary` từ server layer

## What is true after this task
- 3 page canonical đã đọc summary source từ server layer rõ ràng hơn.
- Scaffold không còn cần hiểu chi tiết persistence-like internals để render read summary.
- Read-side contract đã hẹp lại, dễ theo dõi và đúng mục tiêu task hơn.
- UI config cứng vẫn còn tồn tại ở mức module definitions, nhưng page/scaffold hiện phụ thuộc vào read-model server contract rõ ràng hơn trước.

## Still mock / placeholder
- Chưa có DB/Neon thật.
- Summary vẫn đang derive từ mock server-side seed/outcome, chưa lấy từ persistence thật.
- Write-path client vẫn là placeholder workflow client riêng.

## Files changed
- `src/lib/server/admin-cms-read-models.ts`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
