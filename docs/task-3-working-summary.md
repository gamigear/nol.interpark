# Task 3 working summary

Đã rà soát cấu trúc homepage skeleton trong team workspace và xác định hướng polish UI foundation.

## Những gì đã học được
- Project dùng Next.js App Router với `src/app/[lang]/page.tsx` cho homepage đa ngôn ngữ.
- `globals.css` đã có foundation cơ bản: token màu, container, hero, cards, carousel, header/footer, responsive breakpoints.
- `site-header.tsx` hiện khá tối giản: chỉ có brand text và nav links, chưa có action area/commerce feel rõ.
- Các section (`featured-tickets`, `top-picks`, `editorial`, `travel-guides`) đều dùng chung `SectionShell` + `SectionHeader`.
- Các card (`ticket-card`, `product-card`, `content-card`) đang thống nhất ở mức cơ bản nhưng còn thiếu hierarchy mạnh hơn, line clamp, spacing tinh chỉnh, surface treatment.
- `HorizontalCarousel` đã có nút prev/next và track scroll ngang; có thể polish thêm UI controls và spacing.
- `CardImage` hiện chỉ render ảnh đơn giản; `CardMeta` đang lọc item rỗng và render list metadata.
- Có utility `cn()` đơn giản trong `src/lib/utils/cn.ts`.

## Kế hoạch edit
1. Nâng cấp `globals.css` để có reset/foundation tốt hơn: body background/foreground, section spacing, card hover, utility classes, clamp.
2. Refactor `site-header.tsx` để có layout giống commerce/content homepage hơn: logo block, nav, actions.
3. Đồng bộ lại section shell/header, carousel, image/meta và card components để tạo visual consistency tốt hơn.
4. Giữ nguyên logic render/mock data, không thêm package mới.
