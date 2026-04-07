# Task 36 — Progress Summary (mock data & content contracts)

## Đã xác minh
- Homepage public route hiện dùng mock data trực tiếp từ `src/lib/mocks/home-data.ts`.
- Entry point là `src/app/(public)/[lang]/page.tsx`:
  - gọi `getHomePageData(lang)`
  - render lần lượt `FeaturedTicketsSection`, `TopPicksSection`, `EditorialSection`, `TravelGuidesSection`
- Typed contract UI hiện tại tập trung ở `src/types/home.ts`:
  - `Locale = 'en' | 'ar'`
  - `TicketItem`
  - `ProductItem`
  - `ContentItem`
  - `HomeSection<T>`
  - `HomePageData`
- `src/lib/mocks/home-data.ts` đang là nguồn mock duy nhất cho homepage/public sections đã nối vào route.
- Các section components consume đúng typed props:
  - `featured-tickets-section.tsx` -> `HomeSection<TicketItem>`
  - `top-picks-section.tsx` -> `HomeSection<ProductItem>`
  - `editorial-section.tsx` -> `HomeSection<ContentItem>`
  - `travel-guides-section.tsx` -> `HomeSection<ContentItem>`
- Các card components map trực tiếp field từ các item types trên:
  - `TicketCard`: `title`, `subtitle`, `priceLabel`, `badge`, `image`, `href`
  - `ProductCard`: `title`, `category`, `description`, `priceLabel`, `image`, `href`
  - `ContentCard`: `title`, `excerpt`, `eyebrow`, `image`, `href`

## Nhận định tạm thời
- Boundary mock -> UI hiện tại khá rõ ở lớp component, vì toàn bộ homepage render qua `HomePageData` typed.
- Nhưng boundary mock -> CMS/DB chưa rõ ràng:
  - tên section trong UI là `featuredTickets`, `topPicks`, `editorial`, `travelGuides`
  - trong schema/content-model lại thiên về `featured_catalog`, `travel_guides`, `editorial_grid`, `content_showcase`, ...
- `src/lib/server/db/schema-types.ts` đã có typed nền cho CMS/content block (`BlockType`, `ContentBlockRecord`, `ContentBlockLocalizationRecord`, `ContentBlockItemRecord`) nhưng chưa có mapper nào nối các record này sang `HomePageData`.
- `docs/homepage-content-model.md` mô tả hướng đúng: cần một server-side mapper/view-model layer, không để UI đọc raw CMS records.

## Các điểm cần rà thêm
- Có nên tách helper normalize mock locale / homepage view model để boundary rõ hơn không.
- Có file nào khác trong public layer đang dùng contract gần giống homepage nhưng chưa import từ `src/types/home.ts` không.
- Có thể dọn naming an toàn ở mock layer mà không ảnh hưởng route hiện tại hay không.
