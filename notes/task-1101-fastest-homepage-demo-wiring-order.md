# world.nol fastest homepage demo wiring order

Mục tiêu: thứ tự file/route nên nối **để homepage demo lên nhanh nhất**. Ưu tiên theo chuỗi nhìn thấy ngay trên public homepage: **nav/shell -> homepage hero/sections -> promos**.

## Phase 0 — confirm blockers trước khi đụng UI

1. `src/lib/server/homepage/adapter.ts`
   - Confirm `topPicks` đang map từ `nav_highlight` có đúng semantics không.
2. `src/lib/server/navigation/repository-db.ts`
   - Confirm block type navigation không đụng sai với homepage top-picks.
3. `src/lib/server/promos/repository-db.ts`
   - Verify/fix syntax + encoding trước khi dùng cho demo.

> Nếu 3 file này chưa rõ, implement UI wiring rất dễ nối nhầm data.

## Phase 1 — nav/shell trước (đụng ít nhưng tăng độ “thật” mạnh nhất)

### 1. Public layout injection point
1. `src/app/(public)/[lang]/layout.tsx`
   - Nâng thành nơi fetch/inject data cho chrome public.
   - Đây là entry point cho header/footer thật.

### 2. Navigation read path
2. `src/lib/server/navigation/repository-db.ts`
   - Locale filter + read đúng block/item cho public nav.
3. `src/lib/server/navigation/adapter.ts`
   - Map thành shape header dùng được ngay.
4. `src/lib/server/navigation/*` (thêm public query function nếu cần)
   - Tạo read function sạch để layout/header gọi trực tiếp.

### 3. Header/footer render
5. `src/components/layout/site-header.tsx`
   - Bỏ labels/href static, render từ query data thật.
6. `src/components/layout/site-footer.tsx`
   - Bỏ sentence static, render footer/config thật hoặc tối thiểu text thật.

> Sau phase này: mở homepage đã thấy shell “thật” hơn ngay cả khi phần thân page chưa sạch hoàn toàn.

## Phase 2 — homepage hero + core sections

### 4. Homepage read correctness
7. `src/lib/server/homepage/repository-db.ts`
   - Verify homepage SQL trả đúng page/block/localization cho locale demo.
8. `src/lib/server/homepage/repository.ts`
   - Đảm bảo không silent-fallback sang synthetic khi đang demo data thật.
9. `src/lib/server/homepage/query.ts`
   - Dùng diagnostics để check homepage đang ra DB data thật.

### 5. Homepage route cleanup
10. `src/app/(public)/[lang]/page.tsx`
   - Dọn hero eyebrow placeholder.
   - Bỏ 2 explainer sections static.
   - Bỏ/đổi final CTA static.
   - Giữ page càng gần “render data sections thật” càng tốt.

### 6. Homepage section renderers
11. `src/components/sections/featured-tickets-section.tsx`
12. `src/components/sections/top-picks-section.tsx`
13. `src/components/sections/editorial-section.tsx`
14. `src/components/sections/travel-guides-section.tsx`
15. `src/components/sections/section-header.tsx`

Mục tiêu ở nhóm file này:
- bỏ kicker/meta/empty-state quá placeholder,
- ưu tiên render title/description/items/cta từ data thật,
- tránh copy nội bộ kiểu scaffold/demo.

> Sau phase này: homepage body đã đủ usable để demo “public homepage renders with real DB data”.

## Phase 3 — promos nối sau cùng nhưng vẫn trong homepage path

### 7. Promos data seam
16. `src/lib/server/promos/repository-db.ts`
   - Fix integrity + locale filter.
17. `src/lib/server/promos/query.ts`
   - Safe fallback/no-throw cho public homepage.
18. `src/lib/server/promos/adapter.ts`
   - Confirm mapper đúng headline/subheadline/cta/theme cho banner demo.

### 8. Homepage promo render
19. `src/components/sections/promo-banner-section.tsx`
   - Render copy/kicker sạch hơn từ data.
20. `src/app/(public)/[lang]/page.tsx`
   - Quyết định rõ: không có promo thật thì ẩn slot hay hiện fallback demo-safe.

> Sau phase này: homepage demo có nav thật + content sections thật + promo thật.

## Fastest implement order (short version)

Nếu cần order cực ngắn để giao dev làm ngay:

1. `src/app/(public)/[lang]/layout.tsx`
2. `src/lib/server/navigation/repository-db.ts`
3. `src/lib/server/navigation/adapter.ts`
4. `src/components/layout/site-header.tsx`
5. `src/components/layout/site-footer.tsx`
6. `src/lib/server/homepage/repository-db.ts`
7. `src/lib/server/homepage/repository.ts`
8. `src/app/(public)/[lang]/page.tsx`
9. `src/components/sections/featured-tickets-section.tsx`
10. `src/components/sections/top-picks-section.tsx`
11. `src/components/sections/editorial-section.tsx`
12. `src/components/sections/travel-guides-section.tsx`
13. `src/lib/server/promos/repository-db.ts`
14. `src/lib/server/promos/query.ts`
15. `src/lib/server/promos/adapter.ts`
16. `src/components/sections/promo-banner-section.tsx`
17. `src/app/(public)/[lang]/page.tsx` (pass cuối để chốt promo slot behavior)

## What NOT to do before homepage demo is stable
- Chưa cần ưu tiên:
  - `src/app/(public)/[lang]/tickets/page.tsx`
  - `src/app/(public)/[lang]/top-picks/page.tsx`
  - `src/app/(public)/[lang]/guides/page.tsx`
  - `src/app/(public)/[lang]/stories/[slug]/page.tsx`
  - deep cleanup trong `src/lib/server/public-content.ts`
- Các route này để sau, vì không chặn homepage demo nhanh nhất.

## Decision rule cho implement lead
- Nếu chỉ có **1 ngày**: làm hết **Phase 1 + Phase 2** trước.
- Nếu còn thêm thời gian: làm tiếp **Phase 3 promos**.
- Chỉ quay sang listing/detail routes sau khi homepage public + nav + promo pass demo acceptance.
