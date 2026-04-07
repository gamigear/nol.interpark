# Task 47 — Review tổng lực code state thật sau khi gỡ rate limit

## Nguồn kiểm chứng
- Code tree hiện tại trong `src/app`, `src/components`, `src/lib`, `src/types`
- `docs/task-36-progress-summary.md`
- `docs/task-36-mock-content-audit.md`
- `docs/task-37-architecture-docs-vs-code-summary.md`
- `docs/task-39-locale-boundary-cleanup.md`
- `docs/task-41-execution-summary.md`
- `docs/phase-5a-discovery-summary.md`
- `docs/admin-ia-mvp.md`
- `docs/homepage-content-model.md`
- `.env.example`

## Kết luận chắc chắn
Sau khi quota/rate limit được gỡ và có thể rà lại repo kỹ hơn, có thể chốt chắc như sau:

1. **Admin canonical routes đã có code thật hơn batch trước**
   - Đã xuất hiện các route thật:
     - `src/app/(admin-protected)/admin/homepage/page.tsx`
     - `src/app/(admin-protected)/admin/navigation/page.tsx`
     - `src/app/(admin-protected)/admin/promos/page.tsx`
   - `src/components/admin/layout/admin-navigation.ts` hiện đã trỏ tới:
     - `/admin/homepage`
     - `/admin/navigation`
     - `/admin/promos`
   - Đây là thay đổi thực tế quan trọng so với các batch bị rate limit trước đó, khi repo mới chỉ có dashboard/auth và nav còn trỏ `content/*`.

2. **Nhưng 3 route admin mới này vẫn mới ở mức placeholder route hợp lệ, chưa phải flow CMS thật**
   - Mỗi page mới hiện chỉ render `AdminTopbar` + `AdminPage` + `AdminPlaceholderCard`
   - Nội dung copy cũng tự xác nhận đây là “placeholder route tối thiểu” để wire IA canonical.
   - Chưa có list/editor/form, chưa có CRUD, chưa có save draft/publish thật.

3. **Homepage public vẫn mock-driven, chưa chuyển sang runtime CMS/DB-driven**
   - `src/app/(public)/[lang]/page.tsx` vẫn gọi `getHomePageData(lang)` từ `src/lib/mocks/home-data.ts`
   - Public page vẫn render hero đơn giản + 4 section:
     - featured tickets
     - top picks
     - editorial
     - travel guides
   - Chưa có adapter/view-model runtime, chưa có query layer, chưa có revalidation flow, chưa có section order/enable driven by page config.

4. **Locale mock boundary đã được dọn sạch hơn so với batch trước**
   - `src/types/home.ts` giờ đã có:
     - `HOME_PAGE_LOCALES`
     - `DEFAULT_HOME_PAGE_LOCALE`
     - `isHomePageLocale()`
     - `resolveHomePageLocale()`
   - `src/lib/mocks/home-data.ts` đã dùng `resolveHomePageLocale(lang)` thay vì fallback hardcoded cục bộ.
   - Nghĩa là boundary locale ở lớp homepage mock đã rõ hơn thật.

5. **Nhưng locale strategy toàn app vẫn chưa đồng bộ hoàn toàn**
   - `.env.example` vẫn để `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
   - Trong khi homepage mock/public/layout hiện vẫn xoay quanh `en/ar`
   - `src/app/(public)/[lang]/layout.tsx` vẫn chỉ set RTL riêng cho `ar`
   - Tức là mismatch locale toàn app vẫn còn, chỉ là mock boundary đã sạch hơn.

6. **DB/env/auth foundation vẫn là thật, nhưng vẫn ở mức nền/placeholder typed layer**
   - `src/lib/server/env/*`, `src/lib/server/db/*`, `src/lib/server/auth/config.ts` vẫn hiện diện và khớp docs foundation.
   - `schema-types.ts` vẫn là typed placeholder records, chưa phải ORM schema/query runtime thật.
   - Auth protected layout vẫn còn dựa vào mock session validation/fallback admin user.

---

## Cái gì bây giờ đã có code thật

### 1) Protected admin shell thật
- `src/app/(admin-protected)/admin/layout.tsx`
- `src/app/(admin-protected)/admin/page.tsx`
- `src/app/(admin-protected)/admin/dashboard/page.tsx`
- `src/components/admin/layout/admin-shell.tsx`
- `src/lib/admin-session.ts`

### 2) Admin canonical route wiring thật hơn trước
- `src/app/(admin-protected)/admin/homepage/page.tsx`
- `src/app/(admin-protected)/admin/navigation/page.tsx`
- `src/app/(admin-protected)/admin/promos/page.tsx`
- `src/components/admin/layout/admin-navigation.ts` đã trỏ canonical route thật

### 3) Homepage public skeleton thật
- `src/app/(public)/[lang]/layout.tsx`
- `src/app/(public)/[lang]/page.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/sections/*`
- `src/components/cards/*`

### 4) Mock content contract thật hơn trước
- `src/types/home.ts` hiện đã có helper locale/fallback rõ ràng
- `src/lib/mocks/home-data.ts` typed chặt hơn và resolution rõ hơn

### 5) Server foundation thật
- `src/lib/server/env/*`
- `src/lib/server/db/*`
- `src/lib/server/auth/config.ts`
- `.env.example`

---

## Cái gì vẫn còn placeholder

### 1) Homepage / Navigation / Promos admin pages
- Đã có route thật, nhưng mới là placeholder content.
- Chưa có state editor, chưa có form contract, chưa có data fetching, chưa có actions.

### 2) Dashboard admin
- `src/components/admin/dashboard/admin-dashboard-placeholder.tsx` vẫn là placeholder rõ ràng.
- Thậm chí card links trong dashboard vẫn còn trỏ route cũ:
  - `/admin/content/home`
  - `/admin/content/promos`
- Đây là dấu hiệu code state đang ở giai đoạn chuyển tiếp: sidebar đã canonical, dashboard chưa sync theo.

### 3) Public homepage runtime
- Chưa có `getHomepageViewModel(locale)` hay mapper tương đương.
- Chưa có DB query/repository cho homepage.
- Chưa có promo section thực sự, chưa có curated product block thứ 2, chưa có CMS-driven section ordering.

### 4) Auth/runtime integration
- Sign-in/auth flow vẫn chưa nối provider thật.
- Protected session vẫn dựa vào mock session validation.

### 5) DB/query/migrations thật
- Chưa thấy package/tooling/schema runtime thật trong tree đã rà.
- `schema-types.ts` vẫn chỉ là contract nền.

---

## Cái gì đã thay đổi kể từ các batch bị rate limit

### Thay đổi lớn 1 — Admin route canonical đã được wire thật
Trước đây audit xác nhận:
- chưa có `/admin/homepage`
- chưa có `/admin/navigation`
- chưa có `/admin/promos`
- nav đang trỏ `content/*`

Bây giờ verify lại thấy:
- đã có 3 route canonical thật
- nav sidebar đã đổi sang canonical route

=> Đây là thay đổi code state lớn nhất và chắc chắn nhất.

### Thay đổi lớn 2 — Locale boundary ở homepage mock đã được cleanup
Trước đây fallback locale nằm rải rác hơn trong mock data.
Bây giờ đã có helper chung trong `src/types/home.ts` và `home-data.ts` dùng lại helper đó.

=> Đây là thay đổi nhỏ hơn nhưng là thay đổi có thật trong code, không còn chỉ nằm ở summary.

### Thay đổi chưa xảy ra
Dù quota đã thông, vẫn **chưa thấy** các thay đổi lớn sau:
- chưa có adapter/view-model runtime cho homepage
- chưa có DB-driven public homepage
- chưa có CMS list/editor/form usable
- chưa có auth/revalidate thật
- chưa có đồng bộ locale toàn app

---

## Nhận định cập nhật so với summary cũ

### Summary cũ nào cần điều chỉnh
`docs/task-37-architecture-docs-vs-code-summary.md` hiện đã hơi cũ ở 2 điểm:
1. không còn đúng khi nói chưa có route `/admin/homepage`, `/admin/navigation`, `/admin/promos`
2. không còn đúng khi nói nav còn trỏ route tạm `content/*`

Tuy nhiên các nhận định lớn khác trong file đó vẫn còn đúng:
- phần lớn CMS modules chưa usable
- homepage vẫn mock-driven
- data contract/runtime bridge chưa có
- locale toàn app vẫn chưa đồng bộ

---

## Danh sách kiểm chứng chắc chắn

### Đã có code thật
1. protected admin shell
2. auth pages cơ bản
3. dashboard route
4. canonical admin routes cho homepage/navigation/promos
5. canonical sidebar wiring
6. public homepage skeleton
7. typed mock homepage locale helpers
8. env/db/auth typed foundation

### Vẫn placeholder hoặc chưa nối thật
1. homepage/navigation/promos flows sâu
2. dashboard operational links sync hoàn chỉnh
3. DB/runtime adapter layer
4. public homepage CMS-driven runtime
5. auth thật
6. publish/schedule/revalidate thật
7. locale strategy toàn app đồng bộ

---

## Kết luận chốt cho lead
Code state hiện tại **đã tiến thêm một bước rõ rệt** so với batch bị rate limit: phần IA canonical ở admin không còn chỉ nằm trong docs nữa, mà đã có route thật và sidebar thật bám theo.

Nhưng mức tiến triển này vẫn thuộc nhóm **route-wiring/foundation hardening**, chưa phải nhóm **CMS usable implementation**.

Nói ngắn gọn:
- **đã có thật:** canonical admin entry points + locale mock cleanup
- **vẫn chưa có thật:** editor flows, DB-backed homepage runtime, publish/auth/revalidate stack

Nếu cần ưu tiên tiếp sau review này, mình nghiêng rất rõ về việc:
1. sync dashboard khỏi route cũ,
2. dựng adapter/view-model layer cho homepage,
3. rồi mới đào sâu Homepage Composer / Navigation / Promos forms.
