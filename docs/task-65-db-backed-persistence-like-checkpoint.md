# Task 65 — Checkpoint cho giai đoạn tiến sát DB-backed và persistence-like flows

## Scope review
Checkpoint này review targeted batch mới nhất quanh 4 trục:
- homepage read-path tiến sát DB-backed thật
- admin workflow tiến sát persistence-like flows
- actor/auth boundary readiness
- public fallback polish và mức độ unify data path

Nguồn chính đã rà:
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/repository.ts`
- `src/lib/server/homepage/adapter.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/lib/server/admin-cms-workflow-validation.ts`
- `src/lib/admin-auth.ts`
- `src/lib/admin-session.ts`
- `docs/task-55-auth-session-boundary-cleanup.md`
- `src/app/(public)/[lang]/page.tsx`
- `src/app/(public)/[lang]/tickets/page.tsx`
- `src/app/(public)/[lang]/top-picks/page.tsx`
- `src/app/(public)/[lang]/guides/page.tsx`
- `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- `src/components/layout/public-empty-state.tsx`
- `docs/task-57-deeper-phase-readiness-checkpoint.md`

---

## Kết luận ngắn cho lead
Repo hiện đã tiến thêm một bước nữa so với checkpoint task 57:
- **homepage read-path** không chỉ có query + adapter nữa, mà đã có **repository abstraction** rõ ràng;
- **admin workflow** không chỉ có action placeholder nữa, mà đã có **validation layer module-specific** và `fieldErrors/issues` đủ giống persistence-like flow hơn;
- **auth/session boundary** đã sạch hơn về naming và seam, nhưng vẫn mới ở mức mock actor/session;
- **public fallback polish** tốt hơn, nhưng data path vẫn chưa thống nhất giữa homepage và các listing/detail routes.

Nếu chốt một câu:

**Read-backed homepage path đã tiến sát mức có thể xem như “DB-backed-ready by shape”; admin workflow đã đủ giống persistence-like flow để tiếp tục harden validation, nhưng auth actor boundary vẫn chưa đủ đáng tin để bật write persistence thật.**

---

## 1) Homepage read-path — mức tiến sát DB-backed hiện tại

### Điều mới quan trọng nhất
File mới:
- `src/lib/server/homepage/repository.ts`

Đây là thay đổi lớn vì giờ read-path đã có chuỗi rõ ràng hơn:

`route -> query.ts -> repository.ts -> adapter.ts -> HomePageData -> UI`

Không còn là query tự dựng source placeholder một cách cục bộ nữa.

### `repository.ts` hiện đã có gì
- `HomepageReadRepository`
- `readHomepagePersistence(locale)`
- `createHomepageReadRepository()`
- `createMockHomepageRepository()`
- `createDbLikeHomepageRepository()`
- `HomepagePersistenceSnapshot`
- `HomepageReadSourceKind = 'mock-persistence' | 'db-like-records'`
- `createDbLikeHomepageSeed()` để dựng snapshot mang shape gần DB records thật

### Ý nghĩa kỹ thuật
Đây chưa phải query DB thật, nhưng đã rất gần DB-backed shape vì:
- source trả về page/pageLocalization/blocks/blockLocalizations/blockItems thật theo record shape
- adapter đã tiêu thụ đúng những record đó
- query layer chỉ còn làm orchestration + diagnostics

Nói cách khác: **shape của persistence read đã khá giống thật**, chỉ thiếu driver/query implementation thật ở đáy.

### `query.ts` hiện tốt hơn checkpoint trước ở điểm nào
- dùng `readHomepagePersistence(locale)` thay vì tự fallback nội bộ
- diagnostics rõ hơn:
  - `repositorySource`
  - `persistenceReason`
  - `dbConfigured`
  - `adapterPath: 'repository-adapter'`
- `adapterPath` giờ ổn định hơn, đỡ mùi tạm bợ hơn checkpoint trước

### Đánh giá readiness
**READY NOW cho bước thay `db-like-records` bằng repository/query DB thật.**

### Nhưng chưa phải “done”
Hiện `createDbLikeHomepageRepository()` vẫn seed từ mock data, tức là:
- read-path shape đã đúng,
- nhưng source thực tế vẫn chưa phải database query thật.

### Kết luận cho lead
Đây là khu vực **gần DB-backed nhất toàn repo hiện tại**. Nếu cần đẩy tiếp theo roadmap, đây là chỗ đáng chạm DB thật đầu tiên.

---

## 2) Admin workflow — mức tiến sát persistence-like flow hiện tại

### Điều mới quan trọng
File mới:
- `src/lib/server/admin-cms-workflow-validation.ts`

Cùng với `src/lib/server/admin-cms-workflow.ts`, giờ admin flow đã có 2 tầng rõ hơn:
1. **validation layer**
2. **server action layer**

### `admin-cms-workflow-validation.ts` hiện đã có gì
- `AdminCmsWorkflowPayload`
- `AdminCmsModuleSpecificPayload`
- `AdminCmsWorkflowValidatedPayload`
- `AdminCmsWorkflowValidationIssue`
- `validateAdminCmsWorkflowFormData(formData)`
- `formatAdminCmsWorkflowIssues()`
- module-specific validation cho:
  - homepage
  - navigation
  - promos
- action/status transition rules
- note validation
- selection mapping / placement / CTA / locale / schedule-window validation

### `admin-cms-workflow.ts` hiện đã tốt hơn ở điểm nào
- không còn chỉ parse/coerce cơ bản
- có `issues`, `fieldErrors`, `payload`, `validatedPayload`
- validation fail trả về shape gần form-state runtime hơn
- success path vẫn revalidate placeholder nhưng đã có validated detail message

### Ý nghĩa kỹ thuật
Đây là bước rất đáng giá vì workflow bây giờ đã có mùi của “persistence-like flow” thật:
- có domain-ish validation
- có field-level error mapping
- có normalized payload
- có path revalidation
- có module-specific semantics

### Đánh giá readiness
**READY cho hardening tiếp theo của workflow boundary**

Cụ thể, có thể làm tiếp an toàn:
- nối read-side checks thật hơn
- tăng validation rules
- chuẩn bị payload contract cho repository write layer

### Nhưng vẫn chưa ready cho persistence write thật
Vì còn thiếu:
- auth/actor trust boundary thật
- DB mutation thật
- audit persistence thật
- optimistic/real failure handling thật
- conflict/concurrency policy

### Kết luận cho lead
**Admin workflow đã đủ gần persistence-like flow để tiếp tục tiến sâu thêm ở validation + payload design, nhưng chưa đủ an toàn để bật write persistence thật.**

---

## 3) Actor/Auth boundary — cái gì đã tốt hơn, cái gì vẫn thiếu

### Điều đã tốt hơn
Theo cleanup task 55 và code hiện tại:
- `ADMIN_MOCK_SESSION_VALUE`
- `ADMIN_AUTH_REDIRECTS`
- `isValidAdminSessionValue()`
- `AdminActor`
- `AdminSession`
- `buildMockAdminSession()`
- `requireAdminSession()` đi qua `getAdminSession()`

### Ý nghĩa
Boundary giờ sạch hơn ở chỗ:
- session vs actor đã tách khái niệm rõ hơn
- cookie reading / validation / mock materialization có seam thay thế tốt hơn
- naming không còn gây hiểu nhầm nhiều như trước

### Nhưng vẫn thiếu gì
Auth boundary vẫn còn thiếu nền tảng để gắn persistence write thật:
- không có provider-backed validation
- non-mock mode hiện chỉ coi “cookie không rỗng” là present
- actor vẫn là bootstrap fallback từ env/config
- chưa có request-bound identity đáng tin
- chưa có role/permission enforcement runtime thật
- chưa có audit actor thật cho mutation/publish

### Đánh giá readiness
**READY cho auth seam cleanup / replacement preparation**

**NOT READY cho auth-coupled persistence writes**

### Kết luận cho lead
Auth boundary giờ “sạch để thay thế”, chứ chưa “sẵn để tin”. Đây là khác biệt rất quan trọng.

---

## 4) Public fallback polish — đã tốt hơn, nhưng data path vẫn chưa unify

### Điều mới đã có
- `PublicEmptyState`
- `PublicMetaList`
- listing/detail routes có handling empty state rõ hơn
- story detail có `hasStory`, empty shell, related-reading empty handling
- routes public có UX fallback tử tế hơn khi chưa có data

### Ý nghĩa kỹ thuật
Điều này giúp khi bắt đầu cắm source read thật:
- UI không sụp nếu collection rỗng
- route-tree có behavior fallback tử tế hơn
- dễ verify các trạng thái “có data / không có data / slug miss / collection rỗng”

### Nhưng vẫn còn split source
Hiện tại:
- homepage route chính dùng `getHomepageViewModel()` qua repository/query/adapter
- tickets/top-picks/guides/story detail vẫn dùng `getHomePageData(lang)` từ mock trực tiếp

### Đánh giá readiness
**READY cho bước unify read-backed path kế tiếp**

Nhưng **chưa READY để gọi public surface là consistent data layer**.

### Kết luận cho lead
Public shell đã đủ tốt để chịu data thật, nhưng data sourcing vẫn chưa đồng bộ.

---

## READY / NOT READY checkpoint mới

### READY NOW
1. **Thay `createDbLikeHomepageRepository()` bằng repository/query DB thật**
2. **Giữ homepage route chính làm integration target đầu tiên cho read-backed runtime**
3. **Tiếp tục harden admin workflow validation và payload contract**
4. **Dùng public empty states để kiểm chứng các trạng thái data rỗng/miss sau khi nối source thật**
5. **Chuẩn bị hydrate read-side cho admin modules từ source records thật**

### READY SOON
1. **Unify tickets/top-picks/guides/story detail sang cùng read boundary**
2. **Tách read model vs write payload model rõ hơn cho admin workflows**
3. **Bắt đầu audit how actor info should travel into workflow state/result**

### NOT READY YET
1. **Write persistence thật cho admin workflows**
2. **Publish/schedule/archive side effects thật**
3. **Role-based mutation enforcement thật**
4. **Auth-backed actor trust boundary thật**
5. **Coi app đã fully DB-backed/read-backed đồng nhất trên toàn public surface**

---

## Rủi ro nếu đẩy quá sớm

### Rủi ro 1 — Thấy repository abstraction rồi tưởng DB integration đã xong
`repository.ts` hiện rất đẹp, nhưng source vẫn là mock/db-like seed.
Nếu chuyển focus quá sớm sang write/auth, team sẽ có cảm giác “mọi thứ gần xong” trong khi source thật chưa vào.

### Rủi ro 2 — Gắn write persistence vào workflow khi actor boundary chưa đáng tin
Validation layer đã mạnh hơn nhiều, nhưng actor/auth vẫn mock.
Nếu mutation thật vào lúc này, audit/permission sau đó gần như chắc phải refactor lại.

### Rủi ro 3 — Public routes không đồng bộ data path quá lâu
Homepage route chính ngày càng thật hơn, còn listing/detail vẫn mock-only.
Khoảng chênh này nếu kéo dài sẽ làm debug behavior cross-route rất mệt.

### Rủi ro 4 — Validation rules đi trước repository/domain rules quá xa
Nếu tiếp tục đẩy validation UI/server action mà chưa sớm khóa domain contract cho persistence write, có thể dẫn tới chuyện validation một kiểu nhưng repository tương lai lại cần một kiểu khác.

---

## Recommendation chốt
Thứ tự đẹp nhất từ checkpoint này là:

1. **Nối DB/query thật vào `createHomepageReadRepository()` / `readHomepagePersistence()`**
2. **Verify homepage route chính bằng source read thật + fallback an toàn**
3. **Unify các listing/detail routes sang cùng read path**
4. **Hydrate admin modules bằng read-side data thật**
5. **Chỉ sau khi actor/auth boundary đáng tin hơn mới cân nhắc write persistence thật**

---

## Kết luận cuối
**Repo hiện đã tiến rất sát ngưỡng DB-backed ở read side, và admin workflow đã có hình dạng persistence-like khá rõ.**

Nhưng đồng thời cũng phải nói thẳng là:

**actor/auth boundary vẫn chưa đủ mạnh để bật write persistence thật một cách an toàn.**

Một câu ngắn gọn nhất:

**Read-backed thật: rất gần, nên làm ngay. Persistence write/auth thật: vẫn chưa tới điểm chín, đừng hấp tấp kẻo tự mời refactor vào nhà 😅**
