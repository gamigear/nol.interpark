# Task 57 — Checkpoint readiness cập nhật cho phase sâu hơn

## Scope review
Checkpoint này tập trung review targeted batch mới nhất quanh 4 vùng:
- homepage persistence read-path
- admin validation / write-boundary placeholder
- auth boundary readiness
- public fallback polish / route-tree expansion

Nguồn đối chiếu chính:
- `src/lib/server/homepage/query.ts`
- `src/lib/server/homepage/adapter.ts`
- `src/lib/server/admin-cms-workflow.ts`
- `src/components/admin/dashboard/admin-cms-modules.ts`
- `src/app/(public)/[lang]/page.tsx`
- `src/app/(public)/[lang]/tickets/page.tsx`
- `src/app/(public)/[lang]/top-picks/page.tsx`
- `src/app/(public)/[lang]/guides/page.tsx`
- `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- `src/types/home.ts`
- `docs/task-50-locale-strategy-clarification.md`
- `docs/task-52-persistence-readiness-checkpoint.md`

---

## Kết luận ngắn cho lead
So với checkpoint task 52, repo hiện đã tiến thêm **một nấc đáng kể ở read-path và write-boundary**:
- homepage route chính đã đi qua `query.ts` + adapter boundary thật,
- admin side đã có server-action placeholder cho workflow/revalidation,
- public route tree đã rõ hơn với listing/detail scaffolds.

Vì vậy, checkpoint mới là:

- **Homepage persistence read-path:** gần mức **READY để nối DB-backed source thật**
- **Admin validation / workflow boundary:** **READY cho placeholder validation + action wiring**, nhưng **chưa ready cho write persistence thật**
- **Auth boundary:** **chưa ready**
- **Public fallback polish:** **đã tốt hơn rõ rệt**, nhưng vẫn còn split source giữa homepage route và listing/detail routes

Nếu cần một câu chốt:

**Giờ đã có thể tiến sang DB-backed read-path thật cho homepage/query layer; nhưng vẫn chưa nên đẩy write persistence/auth integration thật vì read path chưa phủ hết public routes và trust boundary vẫn còn mock.**

---

## 1) Homepage persistence read-path — readiness cập nhật

### Điều mới đã có thật
File quan trọng nhất:
- `src/lib/server/homepage/query.ts`

Homepage route chính `src/app/(public)/[lang]/page.tsx` giờ đã:
- không còn đọc mock trực tiếp nữa
- gọi `getHomepageViewModel(lang)` từ `@/lib/server/homepage`
- khai báo `revalidate = 300`

Trong `query.ts` hiện đã có:
- `HomepageViewModelResult`
- `getHomepageViewModel(locale)`
- `getHomepageData(locale)`
- diagnostics:
  - `usedFallback`
  - `dbConfigured`
  - `adapterPath: 'mock-only' | 'adapter-fallback'`
- entry point rõ cho read path
- fallback strategy rõ ràng khi DB chưa sẵn

### Ý nghĩa kỹ thuật
Đây là bước rất quan trọng vì read-path đã có hình dạng chuẩn hơn:

`route -> query.ts -> adapter -> HomePageData -> UI`

Nó không còn chỉ là “có adapter mà chưa ai dùng”, mà đã bắt đầu đi vào public route chính thật.

### Nhưng vẫn còn giới hạn
`loadHomepageAdapterSource()` hiện vẫn chỉ trả về source placeholder:
- `page: undefined`
- `blocks: []`
- `blockLocalizations: []`
- `blockItems: []`
- chỉ tạo `pageLocalization` fallback

Tức là:
- adapter path **đã được dùng thật**,
- nhưng **DB-backed source chưa được nối thật**.

### Đánh giá readiness
**READY cho bước nối persistence read source thật vào homepage query layer.**

Cụ thể, bước tiếp theo có thể làm an toàn là:
1. viết repository/query read thật cho page + localizations + blocks + items
2. thay implementation bên trong `loadHomepageAdapterSource()`
3. giữ nguyên public UI contract hiện tại

### Mức chắc chắn
Đây là phần **sẵn sàng nhất toàn repo hiện tại** để chạm DB thật.

---

## 2) Admin validation / workflow boundary — readiness cập nhật

### Điều mới đã có thật
File mới quan trọng:
- `src/lib/server/admin-cms-workflow.ts`

Ngoài ra `admin-cms-modules.ts` hiện đã có thêm:
- `AdminCmsWorkflowAction`
- `submissionPresets`
- labels/status helpers rõ hơn

`admin-cms-workflow.ts` hiện có:
- server action thật (`'use server'`)
- parse form data
- normalize action -> nextStatus
- `revalidatePath()` cho route module và dashboard
- workflow state/result shape rõ ràng
- placeholder response có timestamp, message, detail, revalidatedPaths

### Ý nghĩa kỹ thuật
Đây là dấu hiệu rất tốt vì write-boundary không còn chỉ nằm trong copy/UI nữa.
Nó đã có:
- action entry point ở server
- status transition shape
- module route mapping
- đường đi revalidation placeholder

Tức là team đã bắt đầu chạm vào “hình dạng thật” của workflow write path, dù chưa có persistence.

### Nhưng vẫn còn giới hạn
- chưa có auth/role enforcement thật
- chưa có DB mutation thật
- chưa có validation domain-level thật ngoài parse/coerce cơ bản
- chưa có audit storage thật
- vẫn còn `placeholder: true`

### Đánh giá readiness
**READY cho validation shell + workflow wiring**, nhưng **NOT READY cho write persistence thật**.

Đây là boundary tốt để tiếp tục theo hướng:
- giữ server action shape
- thêm validation rules rõ hơn
- nối repository sau khi auth boundary đủ đáng tin

Nhưng chưa nên đẩy thành:
- publish thật
- schedule thật
- archive thật có side effects thật

---

## 3) Auth boundary — readiness cập nhật

### Trạng thái hiện tại
Dù write-boundary đã đẹp hơn, auth side vẫn chưa đổi bản chất:
- protected layout vẫn dựa vào mock session validation
- sign-in chưa nối auth provider thật
- chưa thấy trust boundary đầy đủ cho role-based mutations

### Vì sao đây vẫn là nút chặn chính cho write integration
Khi có DB mutation thật, những câu hỏi này phải có câu trả lời chắc:
- ai được publish?
- ai được archive?
- ai được thao tác theo locale/module nào?
- audit trail gắn user nào?

Hiện repo chưa đủ để trả lời các câu đó bằng code runtime thật.

### Đánh giá readiness
**NOT READY** cho auth-coupled write integration.

### Hệ quả thực tế
Có thể tiếp tục phát triển:
- read path
- validation shell
- workflow scaffolding

Nhưng chưa nên chuyển sang:
- mutation thật
- publish thật
- role-based persistence writes

---

## 4) Public fallback polish / route-tree expansion — readiness cập nhật

### Điều mới đã có thật
Public route tree đã mở rộng thêm:
- `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- shared layout pieces:
  - `public-breadcrumbs.tsx`
  - `public-page-hero.tsx`
  - `public-page-section.tsx`
  - `story-body-scaffold.tsx`

Các listing routes `tickets`, `top-picks`, `guides` cũng đã được polish hơn bằng:
- breadcrumb
- hero chung
- section framing chung
- note cards / intro layer rõ hơn

### Ý nghĩa kỹ thuật
Public app không còn chỉ là homepage skeleton nữa.
Nó đã có:
- route tree rõ ràng hơn
- reusable shells rõ ràng hơn
- chỗ để verify content source/view-model trên nhiều route kiểu khác nhau

### Nhưng vẫn còn split source
Hiện source data đang bị tách:
- homepage route chính -> `getHomepageViewModel()` qua query/adapter
- listing/detail routes -> vẫn gọi `getHomePageData(lang)` trực tiếp từ mock

Tức là public app đang ở trạng thái:
- **homepage read path bắt đầu thật hơn**
- **listing/detail vẫn mock-only**

### Đánh giá readiness
**READY cho bước unify read-path kế tiếp**, nhưng **chưa READY để coi public surface đã đồng nhất data layer**.

### Nên làm tiếp gì
Sau homepage route chính, bước tự nhiên nhất là:
1. chuyển tickets/top-picks/guides sang đọc từ cùng query/view-model boundary
2. sau đó mới tính story/detail sourcing sâu hơn

---

## 5) Locale strategy — readiness cập nhật

### Điều mới đã rõ hơn
`src/types/home.ts` và doc task 50 giờ đã làm rõ split có chủ đích giữa:
- app/runtime locales: `en,ko`
- homepage/public content locales: `en,ar`

### Ý nghĩa kỹ thuật
Điểm này rất quan trọng vì trước đây nó giống mismatch “bị quên”, còn giờ nó đã thành strategy tạm thời được gọi tên rõ ràng.

Khi đi vào DB-backed read path, điều này giúp tránh nhầm giữa:
- route locale
- resolved content locale

### Nhưng vẫn là rủi ro nếu đẩy sâu quá nhanh
Nếu nối write/auth/publish quá sớm khi split locale này chưa được khóa chắc ở toàn app:
- query theo locale dễ bị nửa runtime nửa content
- validation/publish theo locale dễ bị lệch kỳ vọng

### Đánh giá readiness
**READY đủ cho homepage read-path scoped integration**

**NOT READY cho locale-wide DB/auth integration toàn app**

---

## Ready / Not Ready cập nhật

### READY NOW
1. **Nối DB-backed source thật vào `loadHomepageAdapterSource()`**
2. **Giữ homepage public route chính làm nơi verify persistence read-path đầu tiên**
3. **Tiếp tục hoàn thiện admin workflow shell ở mức validation/revalidate placeholder**
4. **Unify public listing routes sang cùng read boundary sau homepage**
5. **Dùng diagnostics hiện có trong `query.ts` để quan sát fallback path khi bắt đầu chạm DB**

### READY SOON, NHƯNG CHƯA NGAY
1. **Hydrate admin modules bằng read-side data thật**
2. **Bổ sung validation sâu hơn cho admin workflow actions**
3. **Tách rõ read model vs write payload model cho admin modules**

### NOT READY YET
1. **Auth-driven mutation thật**
2. **Publish/schedule/archive thật có persistence side effects**
3. **Role-based admin integration thật**
4. **Locale-wide persistence strategy toàn app**
5. **Coi public app là đã fully unified data layer**

---

## Rủi ro nếu đẩy phase sâu hơn quá sớm

### Rủi ro 1 — Tưởng homepage read-path đã xong vì route chính đã qua query
Đúng là route chính đã qua query/adapter, nhưng source DB vẫn rỗng.
Nếu chưa nối source thật mà đã chuyển focus sang write/auth thì sẽ có cảm giác “kiến trúc đẹp nhưng chưa chạm data thật”.

### Rủi ro 2 — Dùng admin workflow placeholder như thể đã sẵn sàng cho mutation thật
Server action đã có, nhưng chưa có auth trust boundary.
Nếu đẩy write thật quá nhanh, xác suất refactor lại workflow layer là rất cao.

### Rủi ro 3 — Public route tree bị lệch data language
Nếu homepage route dùng query/view-model còn listing/detail routes vẫn mock-only quá lâu:
- behavior cross-route sẽ khó nhất quán
- debug fallback/data freshness sẽ khó chịu

### Rủi ro 4 — Locale split bị “nuốt tạm” thay vì được kiểm soát chủ động
Hiện split locale là có chủ đích và đang được tài liệu hóa. Nếu team quên mất điều đó khi nối DB/auth, lỗi sẽ rất khó đọc vì không phải lỗi syntax, mà là lỗi assumption.

---

## Recommendation chốt cho bước tiếp theo
Thứ tự đẹp nhất bây giờ theo checkpoint mới này là:

1. **Nối source DB/read thật vào `loadHomepageAdapterSource()`**
2. **Verify homepage route chính chạy qua data thật với fallback an toàn**
3. **Đưa tickets/top-picks/guides sang cùng read boundary**
4. **Sau đó hydrate admin modules bằng read-side data thật**
5. **Chỉ khi đó mới bàn tiếp auth boundary + write persistence thật**

---

## Kết luận chốt
**Checkpoint mới cho thấy repo đã vượt khỏi mức “chuẩn bị nối persistence”, và đang ở mức “có thể bắt đầu nối DB-backed read-path thật ngay ở homepage query layer”.**

Nhưng đồng thời cũng rất rõ rằng:

**admin write/auth integration vẫn chưa đủ trust boundary để làm thật, và public surface vẫn chưa dùng chung một data path hoàn chỉnh.**

Một câu gọn nhất:

**Read-path thật: gần ready và nên làm ngay. Write/auth thật: chưa ready, đừng nóng vội kẻo lại tự tạo thêm vòng refactor 😅**
