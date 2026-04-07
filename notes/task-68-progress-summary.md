# Task 68 working summary

## Goal
Hydrate admin read-side cho 3 module canonical (Homepage / Navigation / Promos) bằng summary source/read model rõ hơn để admin read/write bắt đầu dùng cùng một ngữ cảnh dữ liệu hơn.

## What was wrong before
- Admin pages/scaffolds render trực tiếp từ `adminCmsModules` hard-coded ở UI layer.
- Write-side đã có validation + persistence-like outcome, nhưng read-side chưa tận dụng abstraction tương ứng.
- UI vẫn thiên về scaffold tĩnh, chưa có server-side summary source riêng.

## Changes implemented

### 1) New server-side read model layer
Created:
- `src/lib/server/admin-cms-read-models.ts`

What it does:
- tạo `AdminCmsModuleSummary`
- tạo `AdminCmsModuleReadModel`
- expose:
  - `getAdminCmsModuleSummary(moduleKey)`
  - `getAdminCmsModuleReadModel(moduleKey)`
  - `getAdminCmsReadModels()`
- dùng `persistAdminCmsWorkflowMock()` + seeded validated payloads để synthesize read-side summary source gần với write-side hơn
- summary hiện gồm:
  - status breakdown
  - latest save summary
  - latest changed fields
  - latest savedAt
  - latest revision
  - latest recordId

### 2) Split workflow client from scaffold
Created:
- `src/components/admin/layout/admin-cms-workflow-client.tsx`

Reason:
- giữ `AdminCmsScaffold` leaner cho server-rendered read model usage
- workflow form/action state ở client component riêng

### 3) Admin scaffold now consumes read summary
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- scaffold giờ nhận `{ module, summary }`
- thêm `AdminCmsReadSummary` block để render server-side read model summary source
- workflow action area dùng `AdminCmsWorkflowClient`
- read-side section tách rõ hơn khỏi write-side feedback

### 4) Canonical admin pages now read from server-side read model
Updated:
- `src/app/(admin-protected)/admin/homepage/page.tsx`
- `src/app/(admin-protected)/admin/navigation/page.tsx`
- `src/app/(admin-protected)/admin/promos/page.tsx`

Changes:
- bỏ đọc trực tiếp `adminCmsModules` trong page
- dùng `getAdminCmsModuleReadModel(moduleKey)` để lấy `{ module, summary }`
- truyền `summary` xuống scaffold
- topbar/meta copy đã phản ánh read model source rõ hơn

## What is now true after this task
- Admin read-side đã có server-side summary source riêng.
- Canonical pages không còn chỉ bám UI hard-coded trực tiếp như trước.
- Read-side và write-side bắt đầu chia sẻ ngữ cảnh dữ liệu hơn thông qua mock persistence/read model abstraction.
- Scaffold render được summary về latest save/revision/status breakdown thay vì chỉ placeholder text tĩnh.

## What remains mock / placeholder
- Read model hiện vẫn được synthesize từ seeded mock validated payloads + mock persistence outcome, chưa lấy từ DB thật.
- Chưa có hydration từ Neon/Postgres.
- Chưa có shared repository thật giữa read/write sides.
- Workflow client vẫn hiển thị latest submit result tại runtime client-side, chưa merge thật với server read model state sau postback beyond revalidation placeholder.

## Files changed in this task
- `src/lib/server/admin-cms-read-models.ts` (new)
- `src/components/admin/layout/admin-cms-workflow-client.tsx` (new)
- `src/components/admin/layout/admin-cms-scaffold.tsx` (updated)
- `src/app/(admin-protected)/admin/homepage/page.tsx` (updated)
- `src/app/(admin-protected)/admin/navigation/page.tsx` (updated)
- `src/app/(admin-protected)/admin/promos/page.tsx` (updated)
