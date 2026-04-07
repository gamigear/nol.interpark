# Task 52 — Checkpoint sau batch scaffold để chuẩn bị nối persistence thật

## Scope review
Đã review targeted các vùng thay đổi mới nhất liên quan đến:
- adapter foundation cho homepage
- admin scaffolds usable
- public route tree mới
- locale cleanup ở homepage/public chrome
- các summary gần nhất (`task-39`, `task-41`, `task-46`, `task-47`)

## Kết luận ngắn cho lead
Repo hiện **đã tiến tới mức “sẵn sàng có điều kiện” để bắt đầu nối persistence thật cho homepage/admin composition layer**, nhưng **chưa sẵn sàng để nối DB/auth full-stack ngay lập tức**.

Nói dễ hiểu:
- **Ready vừa đủ** cho bước nối persistence ở lớp homepage adapter + module composition data.
- **Chưa ready** cho việc nhảy thẳng sang auth thật, publish/revalidate thật, hay mở rộng persistence đồng loạt cho toàn bộ CMS.

---

## Phần nào đã sẵn sàng để nối persistence thật

### 1) Homepage adapter foundation đã có code thật và đủ làm điểm cắm đầu tiên
Đây là thay đổi quan trọng nhất ở checkpoint này.

Files:
- `src/lib/server/homepage/adapter.ts`
- `src/lib/server/homepage/index.ts`

Những gì đã có:
- kiểu source rõ ràng:
  - `HomePageAdapterSource`
  - `HomePageBlockInput`
  - `HomePageAdapterOptions`
  - `HomePageAdapterResult`
- mapper chính:
  - `mapHomepageSourceToHomePageData()`
- helper gom source records:
  - `createHomepageAdapterSource()`
- fallback adapter result:
  - `getHomepageMockAdapterResult()`
- xử lý renderability cơ bản cho block:
  - chỉ lấy `published` / `scheduled`
  - tôn trọng `enabled`
  - tôn trọng `publishStartAt` / `publishEndAt`
- mapping item theo từng section card family:
  - ticket
  - product
  - content

### Đánh giá
Đây là **điểm cắm persistence thật tốt nhất hiện tại** vì:
- public UI chưa cần đổi props ngay
- low-level schema placeholders đã có sẵn (`PageRecord`, `ContentBlockRecord`, localization/item records)
- có thể nối repository/query -> adapter -> `HomePageData` theo đúng roadmap đã khuyến nghị từ task 41

### Mức sẵn sàng
**READY có điều kiện**
- đủ tốt để bắt đầu nối repository/query layer cho homepage
- chưa đủ để gọi là runtime production-ready

---

### 2) Admin composition modules đã vượt khỏi mức placeholder route trống
Files chính:
- `src/components/admin/dashboard/admin-cms-modules.ts`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
- `src/app/(admin-protected)/admin/homepage/page.tsx`
- `src/app/(admin-protected)/admin/navigation/page.tsx`
- `src/app/(admin-protected)/admin/promos/page.tsx`

Những gì đã có:
- 3 route canonical đều tồn tại thật
- mỗi route đã dùng cùng một scaffold module pattern
- đã có typed module view model cho:
  - homepage
  - navigation
  - promos
- scaffold đã trình bày rõ các vùng:
  - summary stats
  - list inventory
  - editor boundary
  - workflow states
  - recent activity

### Đánh giá
Admin chưa có CRUD thật, nhưng đã có:
- structure route ổn định
- module boundary khá rõ
- typed mock/view-model đủ để biết persistence nên cắm vào đâu trước

### Mức sẵn sàng
**READY cho persistence ở mức module data hydration**
- có thể thay mock module data bằng repository-backed module view model dần dần
- chưa ready cho server actions/auth-driven mutations thật

---

### 3) Public route tree đã rõ hơn, giúp persistence có đích render cụ thể
Các route mới đã có:
- `src/app/(public)/[lang]/tickets/page.tsx`
- `src/app/(public)/[lang]/top-picks/page.tsx`
- `src/app/(public)/[lang]/guides/page.tsx`
- cùng homepage route chính `src/app/(public)/[lang]/page.tsx`

### Đánh giá
Đây là lợi thế lớn cho giai đoạn nối persistence vì:
- không còn chỉ có một homepage route mơ hồ
- đã có các thin listing routes để verify cùng một content source/view-model theo nhiều entry points
- route tree App Router đang đủ rõ để chuyển từ mock -> adapter-backed data từng phần

### Mức sẵn sàng
**READY ở mức render target**
- tức là đã có chỗ để bơm data thật
- nhưng data source hiện tại vẫn là mock

---

### 4) Locale cleanup ở homepage/public chrome đã đủ sạch để tránh đâm thẳng vào fallback rác
Files liên quan:
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`
- `src/app/(public)/[lang]/layout.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`

Đã có:
- `HOME_PAGE_LOCALES`
- `DEFAULT_HOME_PAGE_LOCALE`
- `resolveHomePageLocale()`
- public chrome locale helpers / RTL helpers
- header/footer/layout dùng helper chung thay vì hardcode rời rạc

### Đánh giá
Chưa giải quyết xong locale toàn app, nhưng riêng boundary homepage/public chrome đã đủ rõ để adapter và persistence bước đầu không bị mơ hồ.

### Mức sẵn sàng
**READY có giới hạn**
- an toàn cho bước nối persistence homepage trong phạm vi locale mock/public chrome hiện tại
- chưa an toàn để mở rộng locale full-app mà không chốt strategy chung

---

## Phần nào vẫn đang mock / fallback

### 1) Public homepage và listing routes vẫn đang đọc mock data trực tiếp
Hiện các route public vẫn dùng:
- `getHomePageData(lang)`
- từ `src/lib/mocks/home-data.ts`

Điều này đúng với:
- homepage
- tickets listing
- top-picks listing
- guides listing

### Ý nghĩa
- adapter foundation đã có, nhưng **chưa được route public tiêu thụ thật**
- persistence chưa đi vào runtime path nào đang render cho người dùng

### Trạng thái
**NOT READY để coi là persistence-integrated**

---

### 2) Admin scaffolds vẫn dùng typed mock module view models
`admin-cms-modules.ts` hiện đang cung cấp data mô phỏng cho:
- inventory
- summary stats
- editor fields
- workflow
- recent activity

### Ý nghĩa
- scaffold tốt cho UX direction
- nhưng data chưa đến từ DB/query/service thật
- chưa có mutation boundary thật

### Trạng thái
**READY cho read-side hydration sau này, NOT READY cho write-side persistence thật**

---

### 3) Auth/session vẫn mock
- protected layout vẫn đi qua mock session validation
- sign-in chưa nối auth provider thật

### Ý nghĩa
Nếu đẩy persistence write flow quá sớm khi auth chưa thật:
- role checks sẽ không đáng tin
- mutation path có thể phải viết lại khi auth thật vào sau

### Trạng thái
**NOT READY cho auth-coupled persistence**

---

### 4) DB layer vẫn là typed foundation, chưa phải query runtime hoàn chỉnh
Đúng là có:
- `src/lib/server/db/*`
- `schema-types.ts`

Nhưng vẫn chưa thấy rõ:
- repository/query thật cho homepage/navigation/promos
- migration/runtime schema code thật
- persistence driver wiring hoàn chỉnh ở app flow

### Trạng thái
**READY cho bắt đầu build repository layer, chưa READY cho gọi là DB-integrated feature hoàn chỉnh**

---

## Rủi ro nếu đẩy DB/auth quá sớm

### Rủi ro 1 — Cắm DB vào admin scaffold trước khi chốt read/write boundaries
Scaffold admin hiện hợp với việc hydrate data trước, chưa hợp để nhét mutation thật ngay.

Nếu nhảy thẳng vào write persistence:
- rất dễ bind form/mutation vào mock-shaped view model
- sau đó phải tách lại read model vs write payload model

### Rủi ro 2 — Dùng adapter chưa được route public tiêu thụ làm “xong data layer”
Adapter đã có, nhưng nếu public routes chưa dùng nó thì persistence vẫn chưa đi vào flow render chính.

Nguy cơ:
- repo có data layer mới nhưng UI production path vẫn chạy mock
- team tưởng đã nối xong, thực ra chưa chạm surface thật

### Rủi ro 3 — Locale mismatch toàn app vẫn còn
Hiện vẫn có khoảng cách giữa:
- env defaults `en,ko`
- homepage/public chrome coverage `en,ar`

Nếu nối persistence quá sớm mà không khóa scope locale:
- query/filter theo locale rất dễ đi sai baseline
- translation/publish logic sẽ bị nửa thật nửa giả

### Rủi ro 4 — Auth chưa thật mà đã làm publish/revalidate thật
Publish/revalidate là lớp cần audit trail và quyền hạn tương đối nghiêm.

Nếu làm sớm khi auth/session vẫn mock:
- dễ phải refactor action layer lần nữa
- dễ thiếu trust boundary cho thao tác publish

---

## Checkpoint ready / not-ready rõ ràng

### READY NOW
1. **Nối repository/query -> homepage adapter -> `HomePageData`**
2. **Hydrate admin composition scaffolds từ data source thật theo kiểu read-only trước**
3. **Thay mock fallback dần dần ở public homepage/listing routes bằng adapter-backed data**
4. **Giữ scope persistence ban đầu trong 3 module composition chính:** homepage, navigation, promos

### NOT READY YET
1. **Auth thật + role-based mutation đầy đủ**
2. **Publish/revalidate production-grade**
3. **Persistence write flows sâu cho toàn bộ CMS**
4. **Locale-wide persistence strategy cho toàn app khi baseline locale chưa chốt hẳn**
5. **Mở rộng sâu sang catalog/editorial/media/localization trước khi homepage composition path dùng data thật**

---

## Khuyến nghị bước kế tiếp
Nếu cần đi tiếp ngay sau checkpoint này, thứ tự đẹp nhất theo mình là:

1. tạo repository/query read layer cho homepage blocks/page/localizations/items
2. nối repository đó vào `createHomepageAdapterSource()` + `mapHomepageSourceToHomePageData()`
3. chuyển homepage public route chính sang dùng adapter result
4. sau đó chuyển các thin listing routes sang cùng source/adapter boundary
5. cuối cùng mới hydrate admin scaffolds bằng source thật ở chế độ read-only

### Vì sao thứ tự này hợp lý
- public runtime sẽ là nơi chứng minh persistence đã thật sự được nối
- adapter có thể được verify bằng UI hiện có mà không cần đập component
- admin scaffolds lúc đó sẽ dựa trên cùng data language với public surface
- giảm mạnh nguy cơ viết hai lần

---

## Kết luận chốt
**Repo hiện đã sẵn sàng ở mức checkpoint để bắt đầu nối persistence thật cho homepage composition read path, nhưng chưa sẵn sàng để nối full persistence/auth workflow end-to-end.**

Nói gọn một câu:

**Có thể bắt đầu nối data thật vào adapter và public homepage ngay bây giờ; chưa nên đẩy write flows, auth thật và publish/revalidate thật trước khi read path + locale scope được khóa chắc.**
