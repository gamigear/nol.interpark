# world.nol public demo wiring checklist

Mục tiêu: chỉ ra **file-level implementation targets** để thay public demo từ placeholder/mock sang data thật từ website gốc/CMS foundation. Không sửa code trong note này.

## 1) Homepage public route

### `src/app/(public)/[lang]/page.tsx`
- [ ] Thay hero eyebrow `world.nol.com clone skeleton` bằng field/query thật hoặc bỏ hẳn nếu hero chỉ cần title/description từ homepage view model.
- [ ] Xóa hoặc data-drive 2 khối static explainer:
  - `CMS-powered sections`
  - `New here? / Where to start on world.nol`
- [ ] Xóa hoặc data-drive final CTA block `Ready to explore?`.
- [ ] Quyết định fallback promo slot hiện tại (`Promotions will appear here`) có giữ cho demo hay phải ẩn hoàn toàn khi không có promo thật.
- [ ] Nếu demo cần giống site gốc hơn, homepage route chỉ nên render những sections có data thật từ query thay vì các khối giải thích nội bộ.

## 2) Homepage section renderers còn text/static metadata

### `src/components/sections/featured-tickets-section.tsx`
- [ ] Thay `kicker="Book now"` bằng data thật hoặc locale-aware config.
- [ ] Thay PublicMetaList labels/static values:
  - `Items`
  - `Route`
  - `Shelf = Homepage featured rail`
- [ ] Thay empty-state copy hardcoded bằng content/query-driven fallback phù hợp demo.

### `src/components/sections/top-picks-section.tsx`
- [ ] Thay `kicker="Curated offers"` bằng data thật hoặc config.
- [ ] Thay static meta labels + `Shelf = Homepage curated picks`.
- [ ] Thay empty-state static copy.

### `src/components/sections/editorial-section.tsx`
- [ ] Thay `kicker="Inspiration"`.
- [ ] Thay static meta labels + `Shelf = Homepage editorial rail`.
- [ ] Thay empty-state static copy.

### `src/components/sections/travel-guides-section.tsx`
- [ ] Thay `kicker="Plan ahead"`.
- [ ] Thay static meta labels + `Shelf = Homepage planning guides`.
- [ ] Thay empty-state static copy.

### `src/components/sections/promo-banner-section.tsx`
- [ ] Thay `kicker="Promotions"` bằng localized/data-driven value nếu cần demo giống site gốc.
- [ ] Kiểm tra title/description precedence đang lấy `promo.title || firstItem.headline`; confirm đúng shape dữ liệu demo.

### `src/components/sections/section-header.tsx`
- [ ] Nếu dùng data thật nhiều locale, cân nhắc nhận fully-rendered text thay vì hardcoded CTA/arrow assumptions từ caller.

## 3) Public listing/detail route shells

Các route dưới đây đã có query seam nhưng vẫn bị phủ nhiều static explanatory content. Để demo “data thật”, nên dọn hoặc thay bằng CMS/site-origin content.

### `src/app/(public)/[lang]/tickets/page.tsx`
- [ ] Xóa/data-drive 3 khối static:
  - `Booking tips`
  - `Before checkout`
  - `Planning your visit?`
- [ ] Kiểm tra CTA labels cuối trang có nên lấy từ data/navigation thật.

### `src/app/(public)/[lang]/top-picks/page.tsx`
- [ ] Xóa/data-drive 4 khối static:
  - `Pro tips`
  - `Selection guidance`
  - `Why top picks`
  - final CTA `Curated for you`

### `src/app/(public)/[lang]/guides/page.tsx`
- [ ] Xóa/data-drive toàn bộ static support blocks:
  - `Guide types`
  - `Planning reassurance`
  - `Before you go`
  - CTA `Need help planning?`
  - `How to use guides`

### `src/app/(public)/[lang]/stories/[slug]/page.tsx`
- [ ] Xóa/data-drive toàn bộ static blocks cuối page:
  - `Who this is for`
  - `Reading tips`
  - `About this story`
  - `Quick note`
  - final CTA `Continue exploring`
- [ ] Thay `StoryBodyScaffold intro={story?.excerpt ?? 'Placeholder editorial intro.'}` bằng body/content field thật nếu demo cần article thật.

## 4) Public content server seam

### `src/lib/server/public-content.ts`
- [ ] Thay hardcoded English labels trong breadcrumbs/meta/heroes:
  - `Home`
  - `Source`
  - `Status`
  - listing eyebrows/descriptions
  - story detail headings/descriptions
- [ ] Tách route shell chrome text khỏi code nếu demo cần locale/content thật.
- [ ] Story detail đang lookup bằng:
  - `editorial.items.find(item.href.endsWith('/slug'))`
  - đây chỉ là placeholder; cần dedicated story query hoặc canonical slug mapping thật.
- [ ] `relatedStories` đang lấy từ `travelGuides.items.slice(0, 3)`; cần query related editorial thật hoặc curated relation thật.
- [ ] `getPublicListingViewModel()` hiện reuse homepage sections cho tickets/top-picks/guides; nếu demo cần data đầy đủ theo route, phải tách collections thay vì chỉ mirror homepage shelves.

## 5) Public chrome / route shell components

### `src/components/layout/public-page-hero.tsx`
- [ ] Nếu demo đa locale, ensure `eyebrow`, `title`, `description`, `note`, meta đều lấy từ query/content thay vì hardcoded upstream text.

### `src/components/layout/public-route-frame.tsx`
- [ ] Empty eyebrow mặc định `Ready when content arrives` là internal placeholder; đổi/ẩn cho demo.

### `src/components/layout/public-empty-state.tsx`
- [ ] Mặc định `Coming soon` không phù hợp demo data thật; chỉ dùng khi có explicit content.

## 6) Public layout shell: header/footer

### `src/app/(public)/[lang]/layout.tsx`
- [ ] Hiện chỉ truyền `lang` vào `SiteHeader`/`SiteFooter`; cần nâng thành async server layout nếu header/footer phải fetch navigation/promos/footer config thật.
- [ ] Đây là điểm nối chuẩn để inject navigation/footer query cho toàn public surface.

### `src/components/layout/site-header.tsx`
- [ ] Thay toàn bộ labels static EN/AR bằng navigation data thật:
  - tickets, picks, stories, guides
  - subtitle
  - sign in / plan trip
- [ ] Thay `navHref` hardcoded builders bằng href từ navigation query thật.
- [ ] Kết nối với `src/lib/server/navigation/*` thay vì static object.
- [ ] Nếu website gốc có nhiều nhóm nav, cần map primary/secondary/actions từ view model thay vì fixed 4 links.

### `src/components/layout/site-footer.tsx`
- [ ] Thay static descriptive copy bằng footer data thật hoặc tối thiểu config thật.
- [ ] Nếu source site có legal/footer nav/social, component này cần fetch/render from data model thay vì 1 sentence.

## 7) Navigation server seam

### `src/lib/server/navigation/repository-db.ts`
- [ ] Xác nhận `nav_highlight` có thực sự là block type dành cho navigation public hay đang đụng với homepage top-picks.
- [ ] Nếu dùng cho demo, cần locale filter cho `content_block_localizations` tương tự homepage path.

### `src/lib/server/navigation/adapter.ts`
- [ ] Hiện map đơn giản từ item.overrideJson -> label/href/badge.
- [ ] Cần confirm shape dữ liệu thật từ website gốc/CMS (`label`, `href`, `target`, `badge`) đủ chưa.
- [ ] Nếu navigation cần subtitle/action groups/brand data, adapter hiện chưa đủ.

### `src/lib/server/navigation/*`
- [ ] Thiếu public query/use-case riêng để header dùng trực tiếp; hiện mới có repository + admin-read.
- [ ] Cần thêm public-facing read function/view model nếu muốn layout/header dùng data thật sạch sẽ.

## 8) Promos server seam

### `src/lib/server/promos/query.ts`
- [ ] Thêm safe fallback/no-throw strategy cho public demo nếu promo query lỗi.
- [ ] Query hiện không locale-aware ở API level, chỉ pass locale vào adapter.

### `src/lib/server/promos/repository-db.ts`
- [ ] Verify/fix file syntax trước demo — bản đọc hiện có dấu hiệu corrupted characters.
- [ ] Thêm locale filter cho `content_block_localizations`.
- [ ] Xác nhận promo selection rule: hiện lấy toàn bộ published promo blocks rồi adapter chỉ dùng block đầu tiên.

### `src/lib/server/promos/adapter.ts`
- [ ] Confirm mapping fields đủ cho source site:
  - headline
  - subheadline
  - ctaLabel
  - ctaHref
  - theme
- [ ] Nếu homepage demo cần nhiều promo slots/slides, current first-block-first-item mapper chưa đủ.

## 9) Homepage server seam: demo-read correctness

### `src/lib/server/homepage/repository-db.ts`
- [ ] SQL path đã có thật, nhưng cần verify source DB chứa đúng homepage page + locale rows cho demo.

### `src/lib/server/homepage/repository.ts`
- [ ] Hiện có safe fallback synthetic nếu DB không có data/lỗi.
- [ ] Cho demo “data thật”, cần biết khi nào đang fallback để tránh vô tình trình diễn seed data thay vì site-origin data.
- [ ] Nên surface diagnostics rõ hơn hoặc add demo guard/checklist trước run.

### `src/lib/server/homepage/query.ts`
- [ ] `diagnostics.usedFallback` đã có; tận dụng để audit demo readiness.

### `src/lib/server/homepage/adapter.ts`
- [ ] `topPicks` đang map từ block type `nav_highlight`.
- [ ] Đây là điểm cần confirm gấp vì có thể conflict với navigation module.
- [ ] Nếu top picks của website gốc không phải `nav_highlight`, adapter/query sẽ phải remap trước demo.

## 10) High-risk mismatch cần confirm trước khi wire demo

### Block type overlap
- [ ] `nav_highlight` đang được dùng ở 2 chỗ:
  - homepage `topPicks`
  - navigation module
- [ ] Phải xác nhận đây là intentional hay là tạm thời/foundation shortcut.
- [ ] Nếu không tách, rất dễ kéo nhầm data vào header hoặc top-picks shelf.

### Story model thiếu dedicated source
- [ ] Public story detail hiện không có query riêng cho story by slug.
- [ ] Nếu demo cần “data thật từ website gốc”, đây là gap lớn nhất sau header/footer.

### Promos repo integrity
- [ ] `src/lib/server/promos/repository-db.ts` cần check syntax/encoding ngay; bản đọc hiện không đáng tin để demo.

## 11) Thứ tự wiring đề xuất cho demo

1. **Header/footer**
   - `src/app/(public)/[lang]/layout.tsx`
   - `src/components/layout/site-header.tsx`
   - `src/components/layout/site-footer.tsx`
   - `src/lib/server/navigation/*`

2. **Homepage cleanup để bỏ dấu hiệu placeholder**
   - `src/app/(public)/[lang]/page.tsx`
   - `src/components/sections/*`

3. **Promos hardening**
   - `src/lib/server/promos/repository-db.ts`
   - `src/lib/server/promos/query.ts`
   - `src/lib/server/promos/adapter.ts`

4. **Listing/detail public shell cleanup**
   - `tickets/page.tsx`
   - `top-picks/page.tsx`
   - `guides/page.tsx`
   - `stories/[slug]/page.tsx`
   - `src/lib/server/public-content.ts`

5. **Confirm homepage/top-picks/navigation block semantics**
   - `src/lib/server/homepage/adapter.ts`
   - `src/lib/server/navigation/repository-db.ts`
   - source CMS data shape

## Short conclusion
Public app hiện **đã có server query seam thật cho homepage/promos**, nhưng demo vẫn chưa “data thật” vì:
- header/footer còn static,
- route shells còn nhiều placeholder copy,
- story detail chưa có content source thật,
- promos cần hardening,
- navigation chưa nối vào public chrome,
- và `nav_highlight` có khả năng conflict semantics.
