# Task 114 — Homepage support contracts wiring verification

## Scope
Batch này chỉ chốt nốt wiring/import-export cho cụm support contracts hẹp quanh homepage layer:
- `src/lib/server/homepage/contracts.ts`
- `src/lib/server/homepage/repository.ts`
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/index.ts`

Không đụng `db-query.ts`.

## Đã kiểm tra
- grep lại toàn bộ usage của:
  - `HOMEPAGE_REVALIDATE_SECONDS`
  - `HOMEPAGE_PERSISTENCE_REASONS`
  - `HOMEPAGE_READ_SOURCES`
  - `HomepagePersistenceReason`
  - `HomepageReadDiagnostics`
  - `HomepageReadSourceKind`
  - `HomepageViewModelDiagnostics`
- đọc lại 4 file scope hẹp sau refactor trước để xác minh wiring thực tế

## Kết luận wiring hiện tại

### 1) `contracts.ts` đã trở thành chỗ gom shared support contracts thật sự
Hiện file này đang giữ và export:
- `HOMEPAGE_REVALIDATE_SECONDS`
- `HOMEPAGE_PERSISTENCE_REASONS`
- `HOMEPAGE_READ_SOURCES`
- `HomepagePersistenceReason`
- `HomepageReadSourceKind`
- `HomepageReadDiagnostics`
- `HomepageRepositorySnapshot`

=> Đây là cụm support contracts nhỏ nhưng đã đủ rõ để `query.ts` và `repository.ts` cùng dựa vào.

### 2) `repository.ts` đã nối sang shared contracts
Đã xác minh:
- `HomepagePersistenceSnapshot` đang build từ `HomepageRepositorySnapshot<...>`
- mock repository dùng `HOMEPAGE_READ_SOURCES.mockPersistence`
- mock diagnostics dùng `HOMEPAGE_PERSISTENCE_REASONS.mockSeed`
- db-like repository dùng `HOMEPAGE_READ_SOURCES.dbLikeRecords`
- db-like diagnostics dùng `HOMEPAGE_PERSISTENCE_REASONS.dbLikeRecordsFromSeed`
- db-query repository branch dùng `HOMEPAGE_PERSISTENCE_REASONS.dbQueryPlaceholder`

=> phần duplication string literals ở repository support layer đã được giảm đúng scope.

### 3) `query.ts` đã nối sang shared contracts
Đã xác minh:
- `HOMEPAGE_REVALIDATE_SECONDS` không còn hard-code local
- `HomepagePersistenceReason` và `HomepageReadSourceKind` được import từ `contracts.ts`
- `HomepageViewModelDiagnostics` đã được tách ra thành type riêng thay vì để inline object type

=> query layer đã dùng support contracts chung thay vì tự giữ literal union riêng.

### 4) `index.ts` đã export cụm contracts và diagnostics mới
Đã xác minh:
- `index.ts` export lại toàn bộ cụm từ `contracts.ts`
- `index.ts` export thêm `HomepageViewModelDiagnostics` từ `query.ts`

=> consumer ngoài homepage layer có thể lấy support contracts qua entrypoint `@/lib/server/homepage` thay vì phải chọc vào file con.

## Những gì còn thấy nhưng chấp nhận được trong batch này
- `index.ts` hiện export `HomepageReadSourceKind` từ cả `contracts.ts` và `repository.ts`.
  - Đây không làm sai behavior vì `repository.ts` đã dùng cùng type source từ `contracts.ts`.
  - Mình không ép dọn tiếp ở batch này để giữ scope nhỏ, tránh tạo thay đổi không cần thiết khi wiring hiện đã ổn.
- `db-query.ts` chưa dùng cụm contracts mới và cũng không bị đụng tới, đúng theo phạm vi an toàn của task.

## Scope nhỏ đã được chốt xong trong batch này
Scope được coi là hoàn tất:
- xác minh và chốt wiring/import-export cho shared support contracts giữa `contracts.ts`, `repository.ts`, `query.ts`, `index.ts`
- xác nhận cụm constants/types sau đã được nối vào layer hiện tại:
  - `HOMEPAGE_REVALIDATE_SECONDS`
  - `HOMEPAGE_PERSISTENCE_REASONS`
  - `HOMEPAGE_READ_SOURCES`
  - `HomepagePersistenceReason`
  - `HomepageReadSourceKind`
  - `HomepageReadDiagnostics`
  - `HomepageRepositorySnapshot`
  - `HomepageViewModelDiagnostics`

## File thay đổi trong batch này
- `docs/task-114-homepage-support-contracts-verification.md`

## Kết luận ngắn
Nhánh homepage support contracts giờ đã đủ sạch ở scope hẹp này:
- contracts chung đã có nơi ở rõ
- repository/query đã nối vào cùng một cụm support contracts
- entrypoint `index.ts` đã export cụm đó ra ngoài
- không cần động tới `db-query.ts` để đạt được mục tiêu batch hiện tại
