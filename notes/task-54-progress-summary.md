# Task 54 working summary

## Goal
Thêm validation boundary và typed payloads cho admin workflow của 3 module canonical:
- `/admin/homepage`
- `/admin/navigation`
- `/admin/promos`

## What was wrong before
- `src/lib/server/admin-cms-workflow.ts` parse `FormData` theo kiểu ép kiểu mềm, chưa có runtime validation boundary thật.
- Workflow UI đã có submit path nhưng error state/message còn generic.
- Typed workflow concepts đã có ở `admin-cms-modules.ts`, nhưng chưa được nâng thành validated payload contract cho write-path mock.

## Changes implemented

### 1) Dedicated validation boundary
Created:
- `src/lib/server/admin-cms-workflow-validation.ts`

Added:
- `AdminCmsWorkflowPayload`
- `AdminCmsWorkflowValidationIssue`
- `AdminCmsWorkflowValidationResult`
- runtime guards cho module/action/status
- allowed transition mapping
- next-status inference
- selection validation
- note validation theo action context
- helper `formatAdminCmsWorkflowIssues`

Validation rules now include:
- moduleKey phải thuộc `homepage | navigation | promos`
- action phải thuộc `save_draft | schedule | publish | archive`
- nextStatus phải khớp transition hợp lệ của action
- selection không được rỗng và không quá dài
- note bắt buộc, có min/max length
- schedule/archive yêu cầu note có ngữ cảnh timing/retirement rõ hơn

### 2) Typed payload/state in workflow server action
Updated:
- `src/lib/server/admin-cms-workflow.ts`

Changes:
- bỏ parse mềm cũ, thay bằng `validateAdminCmsWorkflowFormData()`
- `AdminCmsWorkflowState` giờ có thêm:
  - `issues`
  - `fieldErrors`
  - `payload`
- revalidation chỉ chạy khi validation pass
- invalid payload trả về message/detail rõ hơn thay vì silent coercion

### 3) UI now surfaces field-level validation and validated payload state
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- workflow form hiển thị field-level errors cho:
  - selection
  - note
- hiển thị summary block nếu validation fail
- feedback area hiển thị trạng thái validated submit / validation required
- nếu validation pass thì show validated payload snapshot
- copy mô tả workflow action section đã đổi để phản ánh write-path mock nghiêm chỉnh hơn

## What is now true after this task
- Admin workflow đã có runtime validation boundary thật ở server layer.
- Write-path mock không còn nhận payload tùy tiện bằng type-cast mềm.
- Payload sau submit có shape typed rõ ràng.
- Transition action -> nextStatus đã được guard.
- UI phản hồi rõ hơn khi payload fail validation.
- Khi pass validation, UI có thể hiển thị payload đã được accept.

## What remains placeholder
- Chưa persist DB/Neon thật.
- Chưa có zod package/runtime schema thật (repo không thấy dependency rõ ràng, nên dùng typed guards nội bộ để tránh giả định package có sẵn).
- Chưa có mutation records thật.
- Chưa có audit log/actor tracking thật.
- Chưa có scheduler thật cho scheduled releases.

## Files changed in this task
- `src/lib/server/admin-cms-workflow-validation.ts` (new)
- `src/lib/server/admin-cms-workflow.ts` (updated)
- `src/components/admin/layout/admin-cms-scaffold.tsx` (updated)
