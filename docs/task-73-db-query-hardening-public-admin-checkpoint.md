# Task 73 — Checkpoint cho db-query hardening, public read unification và admin coherence

## Scope review
Checkpoint này review targeted batch mới nhất quanh 4 trục:
- homepage db-query seam hardening
- public read unification
- admin read/write coherence
- auth/provider boundary readiness

Nguồn chính đã rà:
- `src/lib/server/homepage/db-query.ts`
- `src/lib/server/homepage/source.ts`
- `src/lib/server/homepage/repository.ts`
- `src/lib/server/homepage/query.ts`
- `src/lib/server/public-content.ts`
- `src/lib/server/admin-cms-read-models.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/lib/server/admin-cms-persistence.ts`
- `src/components/admin/layout/admin-cms-workflow-client.tsx`
- `src/app/(public)/[lang]/page.tsx`
- `src/app/(public)/[lang]/tickets/page.tsx`
- `src/app/(public)/[lang]/top-picks/page.tsx`
- `src/app/(public)/[lang]/guides/page.tsx`
- `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- `docs/task-69-read-unification-admin-checkpoint.md`

---

## Kết luận ngắn cho lead
So với checkpoint task 69, repo hiện đã tiến thêm một nấc rất đáng kể ở mặt **seam hardening** và **coherence modeling**:

1. read path không chỉ gần DB-backed nữa, mà đã có **db-query seam riêng** để thay query thật sau này;
2. public unification không còn chỉ là “ý định”, mà đã có **shared read helper** riêng cho listing/detail use cases;
3. admin side không còn chỉ có persistence-like outcome, mà đã bắt đầu có **read model** và **client workflow surface** để nối state/UI gần hơn.

Nếu chốt một câu:

**Read/query layer giờ đã khá chín về kiến trúc để cắm DB thật; public unification đã có hạ tầng nhưng chưa rollout vào routes; admin coherence đã tiến rõ ở modeling/UI, nhưng write/auth thật vẫn chưa tới điểm mở khóa.**

---

## 1) Homepage db-query seam hardening — checkpoint mới

### Điều mới quan trọng nhất
File mới:
- `src/lib/server/homepage/db-query.ts`

Đây là bước hardening rất đáng giá vì bây giờ read stack đã có thêm một lớp riêng:

`db-query.ts -> source.ts / repository.ts -> query.ts -> adapter.ts -> UI`

### `db-query.ts` hiện đã có gì
- `HomepageDbQueryContext`
- `HomepageDbQueryRawResult`
- `HomepageDbQueryResult`
- `HomepageDbQueryReader`
- `createHomepageDbQueryContext()`
- `createHomepageDbQueryReader()`
- `executeHomepageDbQuery()`
- `readHomepageDbQuery()`

### Ý nghĩa kỹ thuật
Lớp này cực kỳ hữu ích vì:
- đã tách khái niệm “query DB” khỏi repository seed/source logic
- có contract raw result riêng
- có context riêng cho client/intent/connection availability
- đã chừa chỗ cho query runtime thật mà không phá adapter/UI

Hiện `readHomepageDbQuery()` vẫn trả DB-like record set tổng hợp, nhưng kiến trúc đã đủ rõ để sau này chỉ cần thay implementation bên trong `executeHomepageDbQuery()` hoặc reader là được.

### Đánh giá readiness
**READY NOW cho bước cắm query DB thật ở seam `db-query.ts`.**

### Mức chắc chắn
Đây là phần **gần source/runtime thật nhất trong toàn repo hiện tại**.

---

## 2) Public read unification — checkpoint mới

### Điều mới đã có
File mới:
- `src/lib/server/public-content.ts`

Nó hiện đã cung cấp:
- `getPublicListingViewModel(locale, kind)`
- `getPublicStoryDetailViewModel(locale, slug)`
- diagnostics chung cho public read path
- mapping từ homepage view model -> listing/detail view model

### Ý nghĩa kỹ thuật
Đây là bước rất tốt vì public unification giờ không còn là “hãy dùng homepage data chung về sau”, mà đã có một **shared read API** thật để:
- tickets listing dùng lại source chung
- top-picks listing dùng lại source chung
- guides listing dùng lại source chung
- story detail có source/detail view model riêng

### Nhưng rollout chưa xảy ra
Các route runtime hiện vẫn chưa dùng helper này:
- `tickets/page.tsx` vẫn đọc `getHomePageData()`
- `top-picks/page.tsx` vẫn đọc `getHomePageData()`
- `guides/page.tsx` vẫn đọc `getHomePageData()`
- `stories/[slug]/page.tsx` vẫn đọc `getHomePageData()`

Tức là public unification đã có **infrastructure**, nhưng chưa có **runtime adoption**.

### Đánh giá readiness
**READY NOW cho rollout public route unification.**

### Kết luận cho lead
Không cần nghĩ thêm về kiến trúc cho public unification nhiều nữa. Việc còn lại chủ yếu là đổi các route runtime sang tiêu thụ lớp `public-content.ts` theo đúng thứ tự ưu tiên.

---

## 3) Admin read/write coherence — checkpoint mới

### Điều mới quan trọng
Hai file đáng chú ý:
- `src/lib/server/admin-cms-read-models.ts`
- `src/components/admin/layout/admin-cms-workflow-client.tsx`

### `admin-cms-read-models.ts` đang làm gì
- tạo `AdminCmsModuleSummary`
- tạo `AdminCmsModuleReadModel`
- map từ `adminCmsModules` + `persistAdminCmsWorkflowMock()` -> read summary
- đã bắt đầu gom:
  - status breakdown
  - latest save summary
  - latest changed fields
  - latest savedAt
  - latest revision
  - latest recordId

### `admin-cms-workflow-client.tsx` đang làm gì
- dùng `useActionState()` với `runAdminCmsWorkflowAction`
- render form workflow client thật
- hiển thị `fieldErrors`, `issues`, `placeholder state`, `nextStatus`
- hiển thị persistence snapshot feedback như:
  - recordId
  - revision
  - savedAt
  - savedBy
  - changedFields

### Ý nghĩa kỹ thuật
Đây là bước cực kỳ quan trọng cho coherence vì giờ admin không chỉ có:
- view model mock ở server,
- persistence outcome mock ở server,

mà còn có:
- **client workflow surface** dùng cùng state/result shape,
- **read model** bắt đầu tiêu thụ persistence-like outcome.

Tức là coherence giữa:
- module shell
- workflow action
- persistence-like result
- UI feedback
đã rõ hơn trước khá nhiều.

### Nhưng vẫn chưa hoàn chỉnh
- read model vẫn dựa trên mock seeds/outcomes
- module screens chưa chắc đã hydrate hoàn toàn từ `admin-cms-read-models.ts`
- chưa có write result thật từ DB
- chưa có concurrency/revision policy thật
- chưa có actor-aware persistence thật

### Đánh giá readiness
**READY NOW cho bước nối admin read-side thật và chuẩn hóa contract giữa read model / workflow result / persistence snapshot.**

### Nhưng chưa ready cho gì
- write persistence thật
- publish/archive side effects thật
- actor-aware audit thật

---

## 4) Auth/provider boundary — checkpoint mới

### Trạng thái hiện tại
Dù các phần khác tiến nhiều, auth/provider boundary vẫn chủ yếu đứng yên ở tầng seam cleanup:
- cookie validation vẫn mock-centered
- non-mock mode vẫn chỉ coi cookie không rỗng là có session
- actor/session model sạch hơn nhưng chưa có provider-backed truth

### Ý nghĩa
Điểm này càng ngày càng trở thành **nút chặn duy nhất nổi bật** khi các phần read-side/admin coherence đã chín dần.

### Đánh giá readiness
**READY cho tiếp tục chuẩn hóa seam**

**NOT READY cho provider-backed mutation/auth integration thật**

### Kết luận cho lead
Nếu read-side và admin coherence tiếp tục tiến nhanh, thì auth/provider boundary sẽ trở thành nơi “nợ kỹ thuật chiến lược” rõ nhất cần giải sau đó.

---

## READY / NOT READY checkpoint mới

### READY NOW
1. **Cắm query DB thật vào `homepage/db-query.ts`**
2. **Giữ homepage route chính làm runtime proof đầu tiên cho source read thật**
3. **Rollout `public-content.ts` vào tickets/top-picks/guides**
4. **Bắt đầu dùng `admin-cms-read-models.ts` làm nguồn read-side nhất quán hơn cho admin module summaries**
5. **Chuẩn hóa contract giữa validated payload -> persistence outcome -> client workflow feedback**

### READY SOON
1. **Story detail route chuyển sang `getPublicStoryDetailViewModel()` sau khi listing routes ổn**
2. **Hydrate admin module shells từ read model thay vì mock module data rải rác**
3. **Đưa actor metadata vào persistence-like outcome/read model shape để chuẩn bị audit thật**

### NOT READY YET
1. **Provider-backed auth/session thật**
2. **Write persistence thật cho admin workflows**
3. **Role-based mutation enforcement thật**
4. **Audit/history thật đáng tin**
5. **Coi public/admin đã unified cùng một source of truth runtime hoàn chỉnh**

---

## Rủi ro nếu đẩy sai thứ tự

### Rủi ro 1 — Có hạ tầng unification nhưng không rollout sớm
Nếu `public-content.ts` nằm đó quá lâu mà routes vẫn mock-only:
- team sẽ có thêm một lớp abstraction đúng nhưng không được dùng
- dễ lặp lại tình trạng “kiến trúc tốt nhưng runtime path chưa đổi”

### Rủi ro 2 — Cắm write persistence trước khi read model admin đủ chắc
`admin-cms-read-models.ts` vừa xuất hiện, nghĩa là coherence đang hình thành. Nếu write đi trước read-side coherence, UI admin rất dễ bị lệch khỏi persistence result.

### Rủi ro 3 — Nhìn thấy `db-query.ts` rồi tưởng DB integration có thể kéo theo auth/write luôn
`db-query.ts` làm read side chín hơn, nhưng không giải quyết được provider trust boundary. Hai chuyện này đừng nhập làm một.

### Rủi ro 4 — Story detail là route khó hơn tưởng tượng
Story detail không chỉ là listing route khác tên; nó cần lookup theo slug/content identity. Nếu rollout unification không có thứ tự, chỗ này dễ làm team khựng nhịp.

---

## Recommendation chốt
Thứ tự đẹp nhất sau checkpoint này là:

1. **Cắm DB/query thật vào `db-query.ts`**
2. **Verify homepage route chính qua read source thật**
3. **Rollout `public-content.ts` vào tickets/top-picks/guides**
4. **Sau đó mới đổi story detail sang shared public read path**
5. **Hydrate admin read-side qua `admin-cms-read-models.ts`**
6. **Chỉ sau khi read-side/admin coherence đủ chắc mới quay lại bàn write persistence thật và provider/auth**

---

## Kết luận cuối
**Repo hiện đã rất gần điểm có thể coi là “read-runtime-shaped” cho homepage/public, và admin coherence cũng đang bắt đầu có hình hài tốt hơn ở cả server lẫn client.**

Nhưng cũng phải nói thật:

**provider/auth boundary vẫn là cái phanh tay lớn nhất trước khi bật write thật.**

Một câu chốt gọn:

**Read/query hardening: chín rồi, nên rollout tiếp ngay. Public unification: có hạ tầng, cần dùng thật. Admin coherence: đang vào guồng. Auth/provider thật: vẫn chưa đến lúc bung lụa đâu 😅**
