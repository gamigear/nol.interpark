# Task 41 — Execution Summary cho các batch tiếp theo

## Nguồn tổng hợp
- `docs/task-36-progress-summary.md`
- `docs/task-36-mock-content-audit.md`
- `docs/phase-5a-discovery-summary.md`
- `docs/task-37-architecture-docs-vs-code-summary.md`
- `docs/admin-ia-mvp.md`
- `docs/homepage-content-model.md`
- `docs/env-db-foundation-phase-2.md`

## Kết luận điều hướng thực thi
Repo hiện có **foundation tốt nhưng còn rời lớp**:
- đã có protected admin shell, env/db/auth placeholders, public homepage skeleton, typed mock UI contracts;
- nhưng chưa có **một đường nối thống nhất** từ DB/CMS contract -> view model -> admin flows -> public homepage runtime.

Vì vậy, batch tiếp theo không nên lao vào dựng nhiều màn admin cùng lúc. Thứ tự an toàn nhất là:
1. **chốt canonical contract + route naming**,
2. **dựng adapter/view-model layer**,
3. **chuẩn hóa locale baseline**,
4. **mới build các admin routes/flows ưu tiên**,
5. **sau đó mới nối DB/query thật + publish/revalidate**.

Nếu làm ngược, team rất dễ rơi vào cảnh viết UI/admin hai lần hoặc phải migrate route/data contract giữa chừng.

---

## Thứ tự ưu tiên kỹ thuật đề xuất

### Ưu tiên 1 — Chốt canonical decisions trước khi code sâu
#### Cần chốt ngay
1. **Admin route canonical**
   - Chọn 1 trong 2 hướng:
     - theo docs IA: `/admin/homepage`, `/admin/navigation`, `/admin/promos`, `/admin/locales`
     - hoặc giữ route tạm `content/*`
   - Khuyến nghị: **bám docs IA làm canonical** để tránh drift dài hạn.

2. **Data contract canonical**
   - Chọn 1 trong 2 hướng:
     - `section-specific models` như `homepage`, `hero_section`, `ticket_showcase_section`, ...
     - hoặc `generic page/content-block abstraction` như `PageRecord` + `ContentBlockRecord`
   - Khuyến nghị thực tế: **giữ generic DB foundation ở low-level nhưng chốt một view-model contract rõ ở upper layer**. Tức là không để public/admin UI phụ thuộc trực tiếp raw block records.

3. **Locale baseline canonical**
   - Đồng bộ 1 bộ locale giữa `.env.example`, mock data, header/footer copy, layout direction, homepage contracts.
   - Hiện đang lệch `en,ko` vs `en,ar`; nếu không chốt sớm thì mọi flow publish/translation sẽ bị méo.

#### Vì sao ưu tiên 1 đứng đầu
- Route naming ảnh hưởng sidebar, links, breadcrumbs, file tree App Router.
- Data contract ảnh hưởng mapper, admin form payload, public rendering, publish/revalidate.
- Locale baseline ảnh hưởng content records, fallback, translation completeness, UI RTL/LTR.

=> Đây là tầng “đổ móng”. Làm sau sẽ tốn công đập lại.

---

### Ưu tiên 2 — Dựng adapter/view-model layer giữa mock/CMS và UI
Đây là bước bản lề nhất.

#### Mục tiêu
Tạo ranh giới rõ từ source data -> UI contract, ví dụ:
- `getHomepageViewModel(locale)`
- `mapContentBlocksToHomePageViewModel()`
- hoặc adapter riêng cho `header`, `footer`, `homepage sections`, `promo`

#### Vì sao cần làm trước admin screens usable
Hiện public homepage đang dùng `src/types/home.ts` + `src/lib/mocks/home-data.ts` khá sạch ở UI layer. Điều thiếu không phải UI component, mà là **adapter chính thức** để:
- từ mock -> view model hôm nay,
- từ DB/CMS -> view model ngày mai,
- không phải đổi lại props của toàn bộ homepage sections/card sau này.

#### Output mong đợi
- Một `HomePageViewModel` hoặc contract tương đương
- Mapping rõ:
  - block type nào -> section key nào
  - locale resolution/fallback thế nào
  - publish/schedule/enabled xử lý ở đâu
- Chưa cần DB thật vẫn làm được bằng mock + placeholder records

#### Dependency
- Phụ thuộc vào quyết định ở ưu tiên 1
- Là nền cho ưu tiên 3, 4, 5

---

### Ưu tiên 3 — Chuẩn hóa locale & content boundary
Sau khi có contract/adapter, cần chốt luôn locale behavior.

#### Việc nên làm
- Đồng bộ `NEXT_PUBLIC_SUPPORTED_LOCALES` với dataset/content hiện có
- Chốt default locale thật
- Chốt locale nào có RTL
- Tách rõ:
  - locale config/runtime env
  - localized content fields
  - translation missing logic

#### Vì sao phải đứng trước admin flow sâu
Docs IA có module `Locales`, docs content model lại locale-aware toàn hệ thống. Nếu locale còn lệch, các màn:
- homepage pages theo locale,
- navigation header/footer theo locale,
- translation missing,
- preview/publish theo locale
sẽ phải sửa ngược lại sau.

---

### Ưu tiên 4 — Dựng admin routes usable cho 3 module composition layer
Sau khi contract + adapter + locale đã rõ, mới nên dựng các flow admin đầu tiên.

#### Thứ tự trong admin layer
1. **Homepage Composer**
2. **Navigation manager**
3. **Promos manager**

#### Lý do thứ tự này hợp lý
- Đây là 3 module được docs IA và phase-5a xác nhận là ưu tiên mạnh nhất.
- Chúng là **composition layer** trực tiếp chi phối homepage output.
- Editor value xuất hiện nhanh nhất ở đây, chưa cần full CRUD cho catalog/editorial ngay.

#### Mức implement nên có ở batch đầu
- route tree canonical thật trong App Router
- page shell usable thay vì chỉ placeholder
- typed form state/payload
- save draft / publish action placeholders
- preview/revalidate hooks stub

#### Chưa nên làm quá sâu lúc này
- workflow approvals
- drag-drop page builder nặng
- dashboard analytics
- taxonomy quản trị sâu

---

### Ưu tiên 5 — Nối DB/query/repository thật cho homepage/navigation/promos
Khi UI contract và admin flow cơ bản đã ổn, lúc này mới đáng nối DB runtime thật.

#### Việc nên làm
- chọn driver/ORM thực tế
- viết schema/migration code thật
- repository/query cho:
  - homepage
  - header/footer/navigation
  - promo placements
  - content block items
- dùng `DATABASE_URL` cho runtime query, `DATABASE_DIRECT_URL` cho migration/tooling

#### Vì sao để sau adapter/admin skeleton
- Nếu nối DB quá sớm khi contract chưa chốt, schema/query dễ bị lệch mục tiêu UI/UX.
- Repo hiện còn thiếu package/tooling root; dựng hết DB plumbing trước khi clear contract sẽ dễ sa vào “code nhiều nhưng chưa render được flow usable”.

---

### Ưu tiên 6 — Publish/revalidate/auth thật
Đây là lớp hoàn thiện để hệ thống chạy được như CMS đúng nghĩa.

#### Bao gồm
- thay mock session validation bằng auth thật
- publish now / schedule / unpublish
- tag-based revalidation
- preview state
- audit/history cơ bản

#### Dependency
- Cần route/admin forms ổn
- Cần data source/query thật
- Cần locale + contract đã chốt

---

## Dependency map ngắn

### 1) Route naming -> Admin tree -> UX docs consistency
Nếu chưa chốt route canonical, mọi việc sau đều có nguy cơ rename/refactor lại.

### 2) Data contract -> Adapter -> Public homepage + Admin forms
Adapter là cầu nối giữa low-level records và UI contract. Không có nó thì public/admin sẽ mỗi bên tự hiểu data một kiểu.

### 3) Locale baseline -> Homepage pages per locale -> Navigation/Footer -> Translation flow
Locale không chỉ là i18n ở header; nó chạm vào page records, preview, publish status, fallback và missing translations.

### 4) Homepage composer phụ thuộc source modules
Các flow docs mô tả như manual/dynamic pinning đòi hỏi:
- listings/products/articles source layer,
- hoặc ít nhất placeholder query contract cho các nguồn đó.

=> Vì vậy batch đầu của Homepage Composer nên ưu tiên:
- section order,
- enable/disable,
- title/CTA,
- route structure,
- save draft/publish placeholder,
trước khi làm search/pin/query cực sâu.

### 5) Publish/revalidate phụ thuộc state model rõ ràng
Nếu chưa định nghĩa rõ `draft/published/scheduled/archived`, enabled flag, publish window, locale-specific page activation thì revalidation rất dễ bắn sai scope.

---

## Rủi ro nếu làm sai thứ tự

### Rủi ro 1 — Build admin screens trước khi chốt contract
Hậu quả:
- form field đặt tên theo một model,
- DB/schema hoặc mapper lại đi theo model khác,
- phải sửa lại toàn bộ payload, validation, page actions.

### Rủi ro 2 — Nối DB quá sớm khi route/IA còn lắc lư
Hậu quả:
- repository/query viết xong nhưng UI path đổi,
- breadcrumbs/nav/action links đổi,
- code flow usable vẫn chưa có dù plumbing đã nặng.

### Rủi ro 3 — Không dựng adapter layer
Hậu quả:
- public homepage đọc raw DB/CMS records trực tiếp,
- admin save shape nào thì public phải hiểu shape đó,
- sau này đổi model hoặc đổi nguồn dữ liệu sẽ rất đau đầu.

### Rủi ro 4 — Locale drift kéo dài
Hậu quả:
- publish theo locale sai,
- fallback khó đoán,
- translation missing không đáng tin,
- header/footer/homepage mỗi nơi hiểu locale list khác nhau.

### Rủi ro 5 — Cố làm full CMS source layer quá sớm
Hậu quả:
- team tản lực sang listings/editorial/media trước khi 3 module composition chính usable,
- homepage CMS vẫn chưa giải được job-to-be-done cốt lõi.

---

## Danh sách ưu tiên rõ ràng cho batch sau

### P0 — Phải chốt ngay
1. Route canonical cho admin (`/admin/homepage`, `/admin/navigation`, `/admin/promos`, `/admin/locales` hay không)
2. Hướng data contract canonical (generic blocks ở low-level + view-model ở upper layer là hướng khuyên dùng)
3. Locale baseline canonical

### P1 — Nên làm ngay sau khi chốt P0
4. Tạo adapter/view-model layer cho homepage
5. Mapping explicit giữa block types / section keys / locale resolution
6. Chuẩn hóa naming summary/docs để không drift thêm

### P2 — Batch implement usable đầu tiên
7. Dựng route tree thật cho Homepage Composer
8. Dựng route tree thật cho Navigation manager
9. Dựng route tree thật cho Promos manager
10. Thêm save draft / publish placeholder + preview/revalidate stub

### P3 — Batch data/runtime
11. Chọn driver/ORM + migration strategy
12. Nối repository/query thật cho homepage/navigation/promos
13. Đưa homepage public từ mock sang `getHomepageViewModel(locale)`

### P4 — Batch completion
14. Auth thật
15. Publish/schedule/revalidate thật
16. Mở rộng sang listings/editorial/locales/media sâu hơn

---

## Recommendation chốt
Nếu phải rút gọn thành một câu duy nhất thì là:

**Đừng build nhiều màn CMS trước; hãy chốt route + contract + locale trước, dựng adapter/view-model layer ngay sau đó, rồi mới implement 3 flow admin composition (Homepage, Navigation, Promos) và cuối cùng mới nối DB/auth/revalidation thật.**

Thứ tự này vừa giảm rewrite, vừa giữ public homepage và admin cùng nói chung một ngôn ngữ dữ liệu — đỡ cảnh “mỗi bên một dialect”, rất mệt luôn 😅
