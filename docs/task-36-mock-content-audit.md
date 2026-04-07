# Task 36 — Mock Data & Content Contracts Audit

## Scope audited

Đã rà các file đang chi phối homepage/public sections hiện tại:

### Public route & layout
- `src/app/(public)/[lang]/page.tsx`
- `src/app/(public)/[lang]/layout.tsx`
- `src/app/layout.tsx`

### Homepage section components
- `src/components/sections/featured-tickets-section.tsx`
- `src/components/sections/top-picks-section.tsx`
- `src/components/sections/editorial-section.tsx`
- `src/components/sections/travel-guides-section.tsx`
- `src/components/sections/section-header.tsx`
- `src/components/sections/section-shell.tsx`

### Cards / shared presentation
- `src/components/cards/ticket-card.tsx`
- `src/components/cards/product-card.tsx`
- `src/components/cards/content-card.tsx`
- `src/components/shared/card-image.tsx`
- `src/components/shared/card-meta.tsx`
- `src/components/interactive/horizontal-carousel.tsx`

### Mock/content contracts
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`

### Related content-model / infra references
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/lib/server/db/schema-types.ts`
- `src/lib/server/env/constants.ts`
- `src/lib/server/env/index.ts`
- `.env.example`
- `docs/homepage-content-model.md`

---

## Kết luận chắc chắn

### 1) Homepage/public sections hiện tại đang dùng mock data ở đâu?

Có, và chỉ thấy **một mock source đang thực sự được public homepage dùng trực tiếp**:

- `src/lib/mocks/home-data.ts`

Luồng hiện tại:
1. `src/app/(public)/[lang]/page.tsx` gọi `getHomePageData(lang)`
2. nhận về `HomePageData`
3. truyền từng nhánh dữ liệu vào 4 section:
   - `data.featuredTickets`
   - `data.topPicks`
   - `data.editorial`
   - `data.travelGuides`

Không thấy route public homepage nào khác đang fetch DB/CMS records cho 4 section này.

### 2) Shape contract hiện tại là gì?

Contract typed tập trung ở `src/types/home.ts`:

- `TicketItem`
  - `id`, `title`, `subtitle?`, `priceLabel?`, `badge?`, `image`, `href`
- `ProductItem`
  - `id`, `title`, `category?`, `priceLabel?`, `description?`, `image`, `href`
- `ContentItem`
  - `id`, `title`, `excerpt?`, `eyebrow?`, `image`, `href`
- `HomeSection<T>`
  - `id`, `title`, `description?`, `ctaLabel?`, `ctaHref?`, `items`
- `HomePageData`
  - `heroTitle`, `heroDescription`
  - `featuredTickets: HomeSection<TicketItem>`
  - `topPicks: HomeSection<ProductItem>`
  - `editorial: HomeSection<ContentItem>`
  - `travelGuides: HomeSection<ContentItem>`

Đây là contract **đủ rõ và đang được dùng thống nhất** ở lớp UI.

### 3) Section nào dùng shape nào?

- `FeaturedTicketsSection` → `HomeSection<TicketItem>`
- `TopPicksSection` → `HomeSection<ProductItem>`
- `EditorialSection` → `HomeSection<ContentItem>`
- `TravelGuidesSection` → `HomeSection<ContentItem>`

Cards tương ứng:
- `TicketCard` dùng `TicketItem`
- `ProductCard` dùng `ProductItem`
- `ContentCard` dùng `ContentItem`

=> Nghĩa là public content layer hiện tại đã có **UI contract khá sạch**, không có chuyện component đọc raw JSON vô định hình.

---

## Những điểm typed đã rõ

### Typed rõ và nhất quán
- Homepage route trả về `HomePageData`
- 4 public sections nhận props có generic type rõ ràng
- Card-level field usage khớp với item types đang khai báo
- `src/lib/mocks/home-data.ts` được gắn `Record<HomePageLocale, HomePageData>` nên structure của mock đang được type-check ở mức shape tổng

### Typed chưa rõ / chưa nối tới public layer
- `src/lib/server/db/schema-types.ts` đã có typed records cho:
  - `BlockType`
  - `ContentBlockRecord`
  - `ContentBlockLocalizationRecord`
  - `ContentBlockItemRecord`
- Nhưng **chưa có mapper/adapter** nào từ các CMS/DB records này sang `HomePageData`
- Tức là typed contract ở DB layer và typed contract ở UI layer **đang tách rời**, chưa có content boundary rõ bằng code

---

## Mismatch / khoảng trống quan trọng phát hiện được

### A. Locale boundary đang lệch

Mock homepage hiện support rõ:
- `en`
- `ar`

Nhưng env defaults lại đang là:
- `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
- `DEFAULT_SUPPORTED_LOCALES = ['en', 'ko']`

Trong khi:
- `src/components/layout/site-header.tsx` chỉ có copy `en/ar`
- `src/components/layout/site-footer.tsx` chỉ có copy `en/ar`
- `src/lib/mocks/home-data.ts` chỉ có data `en/ar`

Runtime hiện tại không nổ vì code fallback về English, nhưng về contract thì đây là **một mismatch thật sự** giữa runtime locale config và mock public content coverage.

### B. Naming UI vs CMS model chưa khớp 1-1

UI hiện dùng naming:
- `featuredTickets`
- `topPicks`
- `editorial`
- `travelGuides`

Trong schema/content-model docs lại thiên về:
- `featured_catalog`
- `editorial_grid`
- `travel_guides`
- `content_showcase`
- `featured_catalog` / `nav_highlight`

Điều này không sai, nhưng cho thấy **chưa có lớp adapter để normalize naming** giữa CMS blocks và homepage view model.

### C. Section metadata chưa đi qua shared content-view abstraction

Hiện `featuredTickets`, `topPicks`, `editorial`, `travelGuides` đều bọc bởi `HomeSection<T>`, khá ổn.
Nhưng chưa có một type kiểu `HomePageSectionKey`, `HomePageViewModel`, hay mapper contract để mô tả rõ:
- source này là mock only
- source kia là CMS-resolved
- section key nào map sang block type nào

---

## Sửa an toàn đã thực hiện

Đã dọn nhỏ để làm rõ mock/content boundary mà không đổi render logic:

### 1) `src/types/home.ts`
Thêm:
- `HOME_PAGE_LOCALES = ['en', 'ar'] as const`
- `HomePageLocale = (typeof HOME_PAGE_LOCALES)[number]`

### 2) `src/lib/mocks/home-data.ts`
Refactor nhẹ:
- đổi `Record<Locale, HomePageData>` thành `Record<HomePageLocale, HomePageData>`
- thêm `DEFAULT_HOME_PAGE_LOCALE: HomePageLocale = 'en'`
- bỏ cast `(lang as Locale)` trong `getHomePageData()`
- fallback rõ ràng hơn:
  - `lang === 'ar' ? homeDataByLocale.ar : homeDataByLocale[DEFAULT_HOME_PAGE_LOCALE]`

### Vì sao change này đáng làm
- Làm rõ rằng **homepage mock dataset có phạm vi locale riêng**
- Giảm cast mơ hồ ở boundary function
- Không đổi public API của `getHomePageData(lang: string)`
- Không ảnh hưởng render hiện tại

---

## Đánh giá tổng thể

### Trạng thái hiện tại: ổn ở UI mock contract, chưa ổn ở CMS boundary

Nếu chỉ xét homepage skeleton hiện tại thì contract đang **đủ sạch để tiếp tục phát triển UI**:
- typed props rõ
- mock shape nhất quán
- route consumption đơn giản, dễ hiểu

Nhưng nếu xét theo mục tiêu rebuild/CMS thì còn thiếu phần quan trọng nhất:
- **adapter layer từ DB/CMS block records -> `HomePageData` hoặc một `HomePageViewModel` mới**

Chính adapter này mới là ranh giới content contract thật sự cho public homepage. Hiện giờ ranh giới đó vẫn đang nằm trong docs nhiều hơn là trong code.

---

## Khuyến nghị kế tiếp cho team lead

1. **Giữ `src/types/home.ts` như UI/view-model contract tạm thời**
   - không để public components đọc raw `ContentBlockRecord`

2. **Tạo mapper server-side** ở bước sau, ví dụ:
   - `src/lib/home/map-homepage-record-to-view-model.ts`
   - hoặc `src/lib/home/get-homepage-view-model.ts`

3. **Chốt locale strategy sớm**
   - hoặc mock/homepage layer support `ko`
   - hoặc env defaults đổi tạm về `en,ar`
   - ít nhất cần thống nhất giữa env, header/footer copy, và mock homepage dataset

4. **Nếu sau này nối CMS blocks**, nên có mapping explicit như:
   - `featured_catalog -> featuredTickets`
   - `editorial_grid -> editorial`
   - `travel_guides -> travelGuides`

---

## File đã sửa
- `src/types/home.ts`
- `src/lib/mocks/home-data.ts`

## File đã tạo
- `docs/task-36-progress-summary.md`
- `docs/task-36-mock-content-audit.md`
