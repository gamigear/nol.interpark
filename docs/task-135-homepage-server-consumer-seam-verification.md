# Task 135 — Homepage server-to-consumer seam verification

## Scope
Batch này chỉ verify và chốt nốt refinement đã làm quanh homepage seam giữa server layer và consumer public-content, trong phạm vi hẹp:
- `src/lib/server/homepage/contracts.ts`
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/index.ts`
- `src/lib/server/public-content.ts`

Không đụng `db-query.ts`.

## Những gì đã verify

### 1) `query.ts` đã tái dùng shared diagnostics/contracts
Đã xác nhận:
- `query.ts` import `HOMEPAGE_ADAPTER_PATHS` từ `contracts.ts`
- `query.ts` import `HomepageViewModelDiagnostics` từ `contracts.ts`
- `HomepageViewModelResult` đang dùng `diagnostics: HomepageViewModelDiagnostics`
- literal cứng `adapterPath: 'repository-adapter'` đã được thay bằng:
  - `HOMEPAGE_ADAPTER_PATHS.repositoryAdapter`

=> nghĩa là query layer không còn tự giữ shape diagnostics riêng hoặc hard-code adapter path string ở seam này nữa.

### 2) `contracts.ts` là source of truth cho diagnostics seam
Đã xác nhận `contracts.ts` hiện giữ:
- `HOMEPAGE_ADAPTER_PATHS`
- `HomepageAdapterPath`
- `HomepageReadDiagnostics`
- `HomepageViewModelDiagnostics`

`HomepageViewModelDiagnostics` cũng đã được model đúng hơn theo hướng:
- kế thừa `HomepageReadDiagnostics`
- thêm `usedFallback`
- thêm `repositorySource`
- thêm `adapterPath: HomepageAdapterPath`

=> diagnostics shape ở seam server -> consumer đã có chỗ định nghĩa thống nhất.

### 3) `index.ts` đã export đúng seam contracts mới
Đã xác nhận `index.ts` hiện export:
- `HOMEPAGE_ADAPTER_PATHS`
- `HomepageAdapterPath`
- `HomepageViewModelDiagnostics`
- cùng các contracts/support types liên quan khác từ `contracts.ts`

Đồng thời `HomepageViewModelDiagnostics` không còn được export lại từ `query.ts`.

=> consumer ngoài homepage layer có thể lấy seam contracts từ entrypoint chung `@/lib/server/homepage` thay vì phải chọc vào file con.

### 4) `public-content.ts` consumer side vẫn khớp seam mới
Đã xác nhận:
- `public-content.ts` đang lấy:
  - `getHomepageViewModel`
  - `HomepageViewModelResult`
  từ `@/lib/server/homepage`
- `PublicReadDiagnostics` vẫn được model bằng:
  - `HomepageViewModelResult['diagnostics'] & { publicReadPath: 'homepage-view-model' }`

=> consumer không bị vỡ khi diagnostics type được gom về `contracts.ts`, vì nó đang phụ thuộc vào result contract public của homepage layer.

## Grep verification đã làm
Đã grep lại các điểm dùng quanh seam:
- `HomepageViewModelDiagnostics`
- `HOMEPAGE_ADAPTER_PATHS`
- `HomepageAdapterPath`
- `adapterPath`
- `publicReadPath`

Kết quả verify chính:
- `HomepageViewModelDiagnostics` còn xuất hiện ở:
  - `contracts.ts` (source of truth)
  - `query.ts` (import để dùng)
  - `index.ts` (re-export từ contracts)
- `adapterPath` literal trong `query.ts` đã được thay bằng shared constant
- consumer public-content không cần chỉnh thêm để dùng seam mới

## Cleanup thêm có cần không?
Trong scope batch này: **không cần**.

Lý do:
- wiring server-to-consumer seam đã nhất quán ở phạm vi mục tiêu
- exports đã đi qua entrypoint `index.ts`
- public-content consumer vẫn dùng contract công khai ổn định
- không cần mở rộng scope sang `db-query.ts` hoặc thay đổi behavior read path hiện tại

## Files changed in this batch
- `docs/task-135-homepage-server-consumer-seam-verification.md`

## Kết luận ngắn
Refinement từ batch trước đã được verify và chốt sạch trong batch này:
- `query.ts` đã tái dùng `HomepageViewModelDiagnostics` + `HOMEPAGE_ADAPTER_PATHS` từ `contracts.ts`
- `contracts.ts` là nơi giữ diagnostics seam thống nhất
- `index.ts` đã export đúng contracts mới
- `public-content.ts` vẫn khớp với seam server-to-consumer hiện tại mà không cần sửa thêm
