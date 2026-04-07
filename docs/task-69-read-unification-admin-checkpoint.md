# Task 69 — Checkpoint readiness cho DB/query read, public unification và admin read-side

## Scope review
Checkpoint này review targeted batch mới nhất quanh 4 trục:
- DB/query read readiness cho homepage
- public route data unification
- admin read/write coherence
- auth/provider boundary readiness

Nguồn chính đã rà:
- `src/lib/server/homepage/source.ts`
- `src/lib/server/homepage/repository.ts`
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/adapter.ts`
- `src/lib/server/admin-cms-workflow-validation.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/lib/server/admin-cms-persistence.ts`
- `src/lib/admin-auth.ts`
- `src/lib/admin-session.ts`
- `src/app/(public)/[lang]/page.tsx`
- `src/app/(public)/[lang]/tickets/page.tsx`
- `src/app/(public)/[lang]/top-picks/page.tsx`
- `src/app/(public)/[lang]/guides/page.tsx`
- `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- `docs/task-65-db-backed-persistence-like-checkpoint.md`

---

## Kết luận ngắn cho lead
So với checkpoint task 65, repo hiện đã tiến thêm một nấc rõ ràng ở cả 3 vùng:

1. **homepage DB/query read path** sạch hơn về layering nhờ tách `source.ts` khỏi `repository.ts`;
2. **admin workflow** đã tiến từ validation/action sang mức có **mock persistence outcome** với record/history/publication snapshot;
3. **auth/session boundary** vẫn chủ yếu là seam cleanup, chưa thành trust boundary thật.

Chốt ngắn gọn:

**Read path đã rất gần mức có thể thay source mock bằng DB/query thật mà ít đụng UI; admin workflow đã bắt đầu có coherence kiểu persistence, nhưng auth/provider boundary vẫn là điểm chặn rõ nhất trước khi cho write thật.**

---

## 1) Homepage DB/query read readiness — checkpoint mới

### Điều mới đáng chú ý nhất
Có thêm:
- `src/lib/server/homepage/source.ts`

Giờ layering của read path rõ hơn thành:

`source.ts -> repository.ts -> query.ts -> adapter.ts -> UI`

### `source.ts` giúp gì
- tách riêng khái niệm **seed source** khỏi repository
- có `HomepageSeedSource`
- có `HomepageSeedSnapshot`
- có `readHomepageSeed(locale)`

### `repository.ts` giờ sạch hơn ở điểm nào
- không còn tự kéo mock data trực tiếp nữa
- đọc seed qua `readHomepageSeed(locale)`
- diagnostics reason cũng sạch hơn:
  - `mock-seed`
  - `db-like-records-from-seed`
- `createDbLikeHomepageRecordSet()` đặt tên rõ hơn `createDbLikeHomepageSeed()` trước đây

### Ý nghĩa kỹ thuật
Đây là cải tiến đáng tiền vì bây giờ ta đã có 3 lớp tách biệt hơn:
1. **seed/source layer**
2. **record/repository layer**
3. **query/view-model orchestration layer**

Tức là khi thay source mock bằng DB/query thật, vùng cần đổi chủ yếu sẽ nằm ở:
- `source.ts` hoặc repository implementation,
không cần xé nát query/UI.

### Đánh giá readiness
**READY NOW cho bước nối DB/query read thật ở source/repository layer.**

### Mức tự tin
Đây là phần **gần production-shaped nhất** trong toàn bộ roadmap hiện tại, dù source vẫn còn là seed/mock.

---

## 2) Public route data unification — checkpoint mới

### Trạng thái hiện tại
- Homepage route chính: đã dùng `getHomepageViewModel()` qua `query.ts`
- Listing/detail routes:
  - `tickets`
  - `top-picks`
  - `guides`
  - `stories/[slug]`
  vẫn đang dùng `getHomePageData()` trực tiếp từ mock

### Điều tốt hơn so với trước
- public routes có empty-state/fallback handling tốt hơn
- route shells ổn hơn
- không sợ UI vỡ khi collection rỗng hay slug không khớp

### Nhưng unification vẫn chưa xảy ra
Hiện public surface đang dùng **hai data language song song**:
- homepage: read-backed shape
- listing/detail: mock-only shape

### Ý nghĩa kỹ thuật
Đây là điểm rất đáng để lead theo dõi vì nếu kéo dài:
- behavior giữa routes sẽ khó nhất quán
- debugging freshness/fallback/source sẽ khó chịu
- read path mới sẽ bị chứng minh nửa vời

### Đánh giá readiness
**READY NOW cho bước unify public routes sang cùng read/query boundary.**

### Thứ tự nên làm
1. tickets
2. top-picks
3. guides
4. story detail sau cùng

Vì story detail còn cần quy ước sourcing riêng cho slug/content lookup, không nên nhảy vào đầu tiên.

---

## 3) Admin read/write coherence — checkpoint mới

### Điều mới quan trọng
File mới:
- `src/lib/server/admin-cms-persistence.ts`

### Điều này thay đổi gì so với checkpoint trước
Trước đây admin workflow mới dừng ở:
- validation
- server action
- revalidation placeholder

Giờ đã có thêm **mock persistence semantics**:
- `AdminCmsPersistenceRecordSnapshot`
- `AdminCmsPersistenceHistoryEntry`
- `AdminCmsPersistenceOutcome`
- `persistAdminCmsWorkflowMock()`
- publication summary:
  - previousStatus
  - nextStatus
  - requiresReview
  - revalidationTargets
- changed fields
- write summary
- history entries

### Ý nghĩa kỹ thuật
Đây là bước rất quan trọng vì admin flow không còn chỉ “giả lập submit” nữa.
Nó đã bắt đầu mô phỏng được các thứ persistence thật thường cần:
- record snapshot
- revision-ish number
- write summary
- publication semantics
- history entries

Nói vui chút: trước đây là “bấm nút cho vui”, giờ bắt đầu giống “bấm nút có biên bản” 😄

### Nhưng coherence read/write vẫn chưa hoàn chỉnh
Hiện vẫn còn thiếu:
- admin read-side chưa lấy data thật từ cùng source với public
- persistence outcome vẫn mock-generated, không phải DB write result thật
- chưa có sự nối chặt giữa:
  - module view models
  - validated payload
  - stored records thật
- chưa có concurrent revision policy thật

### Đánh giá readiness
**READY cho bước thiết kế coherence giữa admin read-side và write payload/persistence result.**

Cụ thể có thể làm tiếp an toàn:
- hydrate admin module data từ source records thật
- map record snapshot -> module view model
- chuẩn hóa field names giữa read model / write payload / persistence outcome

### Chưa ready cho gì
- write persistence thật
- publish/archive side effects thật
- audit/history thật trong DB

---

## 4) Auth/provider boundary — checkpoint mới

### Điều gì đã tốt hơn
- naming sạch hơn
- session/actor seam rõ hơn
- redirect constants rõ hơn
- mock session materializer tách ra riêng

### Nhưng vấn đề lớn vẫn y nguyên
Hiện boundary này vẫn chưa đáng tin để chống lưng cho mutation thật:
- chưa có provider session validation thật
- actor fallback vẫn từ bootstrap env/config
- chưa có actor id/request-bound identity chắc chắn
- chưa có permission enforcement thật
- chưa có provider/source provenance đáng tin cho audit

### Một điểm còn lạ cần lead lưu ý
`AdminActor`/`AdminActorMetadata` trong `admin-session.ts` có shape tham vọng hơn, nhưng phần materialization thực tế vẫn còn rất mock. Tức là cấu trúc thì đang “mời gọi tương lai”, nhưng dữ liệu runtime thật vẫn chưa theo kịp.

### Đánh giá readiness
**READY cho seam replacement preparation**

**NOT READY cho provider-backed writes / role-based persistence / audit trust**

---

## READY / NOT READY checkpoint mới

### READY NOW
1. **Thay source mock/seed bằng DB/query read thật ở `source.ts` / `repository.ts`**
2. **Verify homepage route chính với source read thật + fallback an toàn**
3. **Bắt đầu unify public listing routes vào cùng query/read boundary**
4. **Bắt đầu hydrate admin read-side từ source records thật**
5. **Chuẩn hóa coherence giữa validated payload -> persistence outcome -> module read model**

### READY SOON
1. **Story detail route chuyển sang read-backed source sau khi listing routes đã ổn**
2. **Coherence check giữa admin module stats/list items và persistence snapshots**
3. **Bổ sung actor metadata propagation ở workflow result/persistence outcome**

### NOT READY YET
1. **Provider-backed auth/session thật**
2. **Write persistence thật cho admin workflows**
3. **Role-based mutation enforcement thật**
4. **Audit/history thật đáng tin**
5. **Coi public/admin đã unified hoàn chỉnh cùng một source of truth**

---

## Rủi ro nếu đẩy sai thứ tự

### Rủi ro 1 — Cắm write persistence thật khi admin read-side còn mock
Nếu write path bắt đầu dùng data thật nhưng module screens vẫn mock-heavy:
- operator sẽ nhìn một đằng, submit một nẻo
- coherence giữa UI và persistence outcome sẽ rất dễ lệch

### Rủi ro 2 — Unify story/detail quá sớm trước listing routes
Story detail cần logic lookup/content identity riêng.
Nếu nhảy thẳng vào story trước, team dễ mất nhịp vì bài toán đó khác listing-level nhiều hơn.

### Rủi ro 3 — Đánh giá quá cao auth seam cleanup
Boundary auth hiện sạch hơn thật, nhưng “sạch” không đồng nghĩa với “đáng tin cho mutation”. Nếu hiểu nhầm điểm này, team rất dễ đẩy write/auth integration trước khi có foundation thật.

### Rủi ro 4 — Có persistence outcome mock rồi tưởng write semantics đã chốt
`admin-cms-persistence.ts` rất hữu ích để nghĩ về shape. Nhưng nếu chưa khóa domain contract bằng records/query thật, shape này vẫn có thể cần chỉnh lại khi nối DB/auth thật.

---

## Recommendation chốt
Thứ tự đẹp nhất từ checkpoint này là:

1. **Nối DB/query read thật vào `source.ts` / `repository.ts`**
2. **Verify homepage route chính qua source read thật**
3. **Unify tickets/top-picks/guides sang cùng read path**
4. **Hydrate admin module read-side từ source records thật**
5. **Chỉ sau khi read coherence ổn mới cân nhắc write persistence thật**
6. **Provider/auth boundary để sau khi read-side + admin coherence đã đủ chắc**

---

## Kết luận cuối
**Repo hiện đã tiến tới ngưỡng rất gần DB/query read thật, và bắt đầu có coherence tốt hơn giữa admin workflow và persistence-like semantics.**

Nhưng phải nói thật là:

**điểm chặn lớn nhất vẫn là auth/provider boundary và việc public/admin chưa cùng dùng hoàn toàn một source of truth.**

Một câu chốt gọn:

**Read/query thật: đã chín gần tới mức nên làm ngay. Admin coherence: đủ tốt để bắt đầu nối read-side thật. Auth/provider write thật: vẫn chưa tới mùa thu hoạch đâu 😅**
