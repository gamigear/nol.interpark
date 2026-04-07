# Task 37 — Đối chiếu docs kiến trúc với code state hiện tại

## Phạm vi đã rà
- `docs/admin-ia-mvp.md`
- `docs/homepage-content-model.md`
- `docs/env-db-foundation-phase-2.md`
- `docs/homepage-clone-plan.md`
- `docs/phase-5a-discovery-summary.md`
- `docs/task-3-working-summary.md`
- `tmp/task-14-progress-summary.md`
- Code tree thực tế trong `src/app`, `src/components/admin`, `src/lib/server`, `src/lib/mocks`, `src/types`

## Summary ngắn: phần docs đang phản ánh ĐÚNG code state

### 1) Admin protected foundation: docs phản ánh khá đúng
- Docs nói admin dùng **Next.js App Router + protected area + shared layout**.
- Code thực tế đã có:
  - `src/app/(admin-protected)/admin/layout.tsx`
  - `src/app/(admin-protected)/admin/page.tsx` redirect về `/admin/dashboard`
  - `src/app/(admin-protected)/admin/dashboard/page.tsx`
  - `src/components/admin/layout/admin-shell.tsx`
- Kết luận: phần foundation protected admin surface đã có thật, không còn là ý tưởng trên giấy.

### 2) Env / DB foundation phase 2: docs khớp tốt với code hiện tại
- Docs mô tả cụm `src/lib/server/env`, `src/lib/server/db`, `src/lib/server/auth`.
- Code thực tế đã có đúng các vùng này:
  - `src/lib/server/env/index.ts`, `constants.ts`
  - `src/lib/server/db/config.ts`, `index.ts`, `schema-types.ts`, `types.ts`
  - `src/lib/server/auth/config.ts`
- `.env.example` cũng đang bám naming đã chốt trong doc (app runtime, database, admin auth, media, revalidate).
- Kết luận: tài liệu `env-db-foundation-phase-2.md` hiện **khớp khá sát** với state repo.

### 3) Homepage public skeleton: clone plan phản ánh đúng ở mức layout hướng đi
- Docs clone plan mô tả homepage public theo App Router, component hóa section/card và ưu tiên server-first.
- Code thực tế đã có các mảnh foundation phù hợp hướng này:
  - route public đa ngôn ngữ: `src/app/(public)/[lang]/page.tsx`
  - layout public với `SiteHeader` + `SiteFooter`: `src/app/(public)/[lang]/layout.tsx`
  - card/section components: `src/components/cards/*`, `src/components/sections/*`, `src/components/layout/*`
- Kết luận: docs clone plan đúng ở mức **skeleton kiến trúc UI**, dù implementation mới là bản rút gọn.

### 4) Docs về content model đã phản ánh đúng hướng DB-driven tương lai
- `homepage-content-model.md` nói homepage nên tách page config / section config / content entities và có mapping layer.
- Code thật chưa implement đầy đủ, nhưng đã có dấu hiệu chuẩn bị contract ở `src/lib/server/db/schema-types.ts` với:
  - `PageRecord`
  - `PageLocalizationRecord`
  - `ContentBlockRecord`
  - `ContentBlockLocalizationRecord`
  - `ContentBlockItemRecord`
- Kết luận: doc này **đúng hướng kiến trúc mục tiêu**, và repo đã có typed placeholder bám theo tư duy đó.

## Summary ngắn: phần docs đang LỆCH hoặc CHƯA được implement

### 1) Lệch IA/route naming ở admin
**Docs IA canonical:**
- `/admin/homepage/*`
- `/admin/navigation/*`
- `/admin/promos/*`
- `/admin/locales/*`

**Code thực tế hiện tại:**
- navigation đang trỏ tới:
  - `/admin/content/home`
  - `/admin/content/navigation`
  - `/admin/content/promos`
  - `/admin/localization`
  - `/admin/media`
- File: `src/components/admin/layout/admin-navigation.ts`

**Đánh giá:**
- Đây là mismatch rõ nhất giữa docs IA và code state hiện tại.
- Docs `phase-5a-discovery-summary.md` và `tmp/task-14-progress-summary.md` đã nhận ra lệch này; nghĩa là summary nội bộ đang đúng, nhưng doc IA gốc chưa phản ánh “state đang tạm dùng route alias/tạm”.

### 2) Route/module CMS chính trong docs chưa tồn tại ở repo
Docs admin IA kỳ vọng nhiều route/module thật cho:
- Homepage Composer
- Navigation manager
- Promos manager
- Catalog tickets/products
- Editorial articles/guides
- Media / Locales / Settings

Code thực tế hiện chỉ xác nhận có:
- auth routes `/admin/sign-in`, `/admin/forgot-password`, `/admin/reset-password`
- protected admin layout
- dashboard placeholder

Chưa thấy route page thật cho:
- `/admin/content/home` hoặc `/admin/homepage/*`
- `/admin/content/navigation` hoặc `/admin/navigation/*`
- `/admin/content/promos` hoặc `/admin/promos/*`
- `/admin/catalog/*`
- `/admin/editorial/*`
- `/admin/media`
- `/admin/localization`
- `/admin/settings/audit`

**Đánh giá:** docs IA đang mô tả mục tiêu/đích đến, không phải current implementation.

### 3) Homepage clone plan đầy đủ hơn code state hiện tại khá nhiều
Docs clone plan kỳ vọng homepage có thứ tự gần như:
1. Header
2. Hero
3. Tickets
4. Top picks
5. Promo banner
6. Curated products khác
7. Editorial content
8. Travel guides
9. Footer

Code thực tế ở `src/app/(public)/[lang]/page.tsx` chỉ render:
- hero đơn giản
- `FeaturedTicketsSection`
- `TopPicksSection`
- `EditorialSection`
- `TravelGuidesSection`

Header/footer đang nằm ở layout chứ không phải thiếu hoàn toàn, nhưng **chưa có**:
- promo section
- curated product section thứ 2 kiểu “Top Things to Do in Busan”
- hero model theo carousel/static config thật
- section ordering driven by CMS/page config

**Đánh giá:** docs clone plan hiện mô tả target UI rộng hơn implementation khá xa.

### 4) Homepage content model chưa được nối vào runtime thật
Docs content model kỳ vọng:
- homepage theo locale
- section references + enabled/order
- manual/dynamic source mode
- header/footer config riêng
- mapper server-side từ CMS -> UI view model

Code hiện tại lại đang dùng:
- mock data cứng trong `src/lib/mocks/home-data.ts`
- type UI đơn giản trong `src/types/home.ts`
- render trực tiếp từ mock data ở page public

Điểm lệch cụ thể:
- chưa có DB query/service layer cho homepage
- chưa có mapper `HomePageViewModel`
- chưa có publish/schedule logic cho section
- chưa có `manual`/`dynamic` source mode trong runtime
- chưa có header/footer config DB-driven

### 5) Schema-types hiện tại chưa khớp hoàn toàn naming/model chi tiết trong docs homepage-content-model
Docs homepage content model dùng naming cụ thể như:
- `homepage`
- `header_config`
- `footer_config`
- `hero_section`
- `ticket_showcase_section`
- `product_showcase_section`
- `promo_banner_section`
- `content_showcase_section`

Trong code `schema-types.ts`, repo hiện mới dừng ở abstraction tổng quát hơn:
- `PageRecord`
- `ContentBlockRecord`
- `ContentBlockLocalizationRecord`
- `ContentBlockItemRecord`
- `BlockType` gồm `hero`, `featured_catalog`, `editorial_grid`, `promo_banner`, `travel_guides`, `nav_highlight`

**Đánh giá:**
- Không sai kiến trúc, nhưng **lệch mức abstraction** so với doc.
- Doc đang thiên về model tách riêng từng loại section; code lại nghiêng về block generic sớm hơn.
- Đây là điểm cần theo dõi vì ảnh hưởng data contract và admin UX sau này.

### 6) Locale/support docs có lệch nhỏ với state hiện tại
- `.env.example` đang để `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
- public mock/type hiện hỗ trợ `en | ar`
- `LangLayout` cũng đang xử lý RTL cho `ar`

**Đánh giá:**
- Đây là mismatch nhỏ nhưng đáng ghi nhận: env/sample và mock homepage chưa cùng một bộ locale.

## Mismatch nhỏ đã sửa
Chưa sửa trực tiếp docs gốc để tránh tự ý đổi tài liệu kiến trúc nền khi chưa có quyết định chung.

Thay vào đó đã tạo file summary này để lead/team review trước. Đây là cách an toàn hơn vì các lệch hiện tại không chỉ là typo, mà liên quan định hướng route/data-contract.

## Danh sách lệch quan trọng cần theo dõi
1. **Admin route canonical vs route tạm hiện tại**
   - Docs: `/admin/homepage`, `/admin/navigation`, `/admin/promos`, `/admin/locales`
   - Code: `/admin/content/home`, `/admin/content/navigation`, `/admin/content/promos`, `/admin/localization`

2. **Docs IA mô tả module CMS đã sẵn sàng hơn thực tế**
   - Thực tế mới có dashboard/auth/protected shell; phần lớn module chỉ mới là nav target hoặc placeholder.

3. **Homepage hiện còn mock-driven, chưa DB-driven**
   - Chưa có service/query/mapper/revalidate flow bám content model doc.

4. **Clone plan chưa khớp độ đầy đủ của homepage hiện tại**
   - Thiếu promo section, curated product block thứ 2, scheduling/composer-driven order.

5. **Data contract level chưa chốt giữa docs và code**
   - Docs thiên về bảng/model riêng từng section.
   - Code foundation hiện nghiêng về generic page/content-block abstraction.

6. **Locale baseline đang không nhất quán giữa env sample và mock/public layer**
   - Env sample: `en,ko`
   - Mock/type/layout: `en,ar`

## Khuyến nghị ngắn cho bước tiếp theo
- Nếu team muốn bám IA docs làm canonical: nên đổi `admin-navigation.ts` và route tree phase tới sang `/admin/homepage`, `/admin/navigation`, `/admin/promos`, `/admin/locales`.
- Nếu team muốn giữ route `content/*`: cần cập nhật lại docs IA/summary để tránh lệch lâu dài.
- Trước khi build CMS thật, nên chốt luôn một trong hai hướng data contract:
  1. **section-specific tables/models** như docs homepage-content-model, hoặc
  2. **generic page/content-block contract** như `schema-types.ts` hiện tại.
- Nên đồng bộ lại locale baseline trong `.env.example`, mock data và type public để tránh drift từ sớm.
