# Task 1097 — Homepage core data wiring from source-backed DB content

## Scope delivered
Implement wiring tối thiểu nhưng thật cho homepage public route để hero + core shelves + promo slot đọc từ DB/content-block foundation hiện tại, fallback an toàn khi dữ liệu chưa đủ.

## Files changed

### 1) `src/lib/server/homepage/adapter.ts`
**Changed heavily**
- Sửa homepage section selection để bám **block key conventions** thay vì chỉ block type mù.
- `topPicks` **không còn dùng `nav_highlight`** nữa.
- `topPicks` giờ ưu tiên:
  - `blockType = 'featured_catalog'`
  - key `top-picks` hoặc `home-top-picks`
- `featuredTickets` ưu tiên key `featured-tickets` hoặc `home-featured-tickets`
- `editorial` ưu tiên key `editorial` / `home-editorial`
- `travelGuides` ưu tiên key `travel-guides` / `home-travel-guides`
- Nếu không có preferred key thì mới fallback về block đầu tiên cùng `blockType`.
- Hero title/description ưu tiên lấy từ **hero block localization** rồi mới fallback page localization / seed.

**Why this matters**
- Loại bỏ conflict semantics giữa homepage top-picks và navigation module.
- Homepage shelves giờ có thể đọc đúng data import từ source site theo convention đã chốt ở task 1092.

---

### 2) `src/lib/server/promos/repository-db.ts`
**Rewritten**
- Sửa file bị **corrupt syntax/encoding** nên trước đó promo path không đáng tin.
- Đổi function signature thành `fetchPromoBlocks(locale, intent)`.
- Thêm locale filter cho `content_block_localizations`:
  - `where block_id = any(...) and locale_code = resolvedLocale`
- Giữ block/items query đơn giản và usable cho promo MVP.

**Why this matters**
- Promo slot trên homepage giờ có read path DB-backed usable thật.
- Không còn risk fail chỉ vì file repository-db hỏng syntax.

---

### 3) `src/lib/server/promos/query.ts`
**Hardened**
- Dùng `fetchPromoBlocks(locale, 'runtime')` thay vì call cũ thiếu locale.
- Bọc toàn bộ bằng `try/catch`.
- Nếu promo query lỗi thì return `undefined` thay vì làm homepage vỡ.

**Why this matters**
- Homepage demo chạy ổn định hơn.
- Promo là enhancement slot, không nên làm sập toàn homepage nếu DB/promo data chưa sẵn.

---

### 4) `src/app/(public)/[lang]/page.tsx`
**Cleaned up / simplified**
- Bỏ các khối internal/explanatory placeholder lớn:
  - `world.nol.com clone skeleton`
  - `CMS-powered sections`
  - `New here?`
  - `Ready to explore?`
- Homepage public giờ chỉ còn:
  - hero
  - promo slot (nếu có)
  - featured tickets
  - top picks
  - editorial
  - travel guides
  - 1 empty-state nhẹ chỉ xuất hiện khi homepage gần như chưa có data usable

**Why this matters**
- Homepage nhìn giống public product hơn, bớt cảm giác internal scaffold/demo note.
- Route render tập trung vào content thật thay vì text giải thích hệ thống.

---

## What now reads real DB-backed content
Khi DB có dữ liệu đúng convention/content blocks, các slice sau sẽ đọc **thật từ DB** qua homepage/promos repository:

### Homepage hero
- Source path:
  - `pages`
  - `page_localizations`
  - `content_blocks (hero)`
  - `content_block_localizations`
- Priority:
  - hero block localization title/subtitle
  - fallback page localization
  - fallback seed

### Featured tickets shelf
- Source path:
  - `content_blocks` with `blockType='featured_catalog'`
  - preferred key `featured-tickets` / `home-featured-tickets`
  - `content_block_items.overrideJson`
- Item fields read from DB:
  - `title`
  - `subtitle`
  - `priceLabel`
  - `badge`
  - `image`
  - `href`

### Top picks shelf
- Source path:
  - `content_blocks` with `blockType='featured_catalog'`
  - preferred key `top-picks` / `home-top-picks`
  - `content_block_items.overrideJson`
- Item fields read from DB:
  - `title`
  - `category`
  - `priceLabel`
  - `description`
  - `image`
  - `href`

### Editorial shelf
- Source path:
  - `content_blocks` with `blockType='editorial_grid'`
  - preferred key `editorial` / `home-editorial`
- Item fields read from DB:
  - `title`
  - `excerpt` / `summary`
  - `eyebrow`
  - `image`
  - `href`

### Travel guides shelf
- Source path:
  - `content_blocks` with `blockType='travel_guides'`
  - preferred key `travel-guides` / `home-travel-guides`
- Item fields read from DB:
  - `title`
  - `excerpt` / `summary`
  - `eyebrow`
  - `image`
  - `href`

### Promo slot
- Source path:
  - `content_blocks` with `blockType='promo_banner'`
  - locale-specific `content_block_localizations`
  - `content_block_items.overrideJson`
- Fields read from DB:
  - block title/description/cta
  - item `headline`
  - `subheadline`
  - `ctaLabel`
  - `ctaHref`
  - `theme`

---

## Fallback behavior still intentionally kept
Để demo không gãy nếu DB/import chưa đầy đủ:
- Homepage repository vẫn có fallback seed path hiện có.
- Promo query trả `undefined` nếu query lỗi.
- Homepage page vẫn render được ngay cả khi promo không có.
- Nếu section block có nhưng items trống, section component giữ empty-state nhẹ.

Tức là:
- **DB có data đúng → render data thật**
- **DB thiếu/hỏng một phần → không crash, fallback hợp lý**

---

## Important semantic fix
### Fixed high-risk mismatch
Trước patch:
- homepage `topPicks` đang map từ `nav_highlight`
- navigation module cũng dùng `nav_highlight`
- nguy cơ kéo nhầm data giữa homepage shelf và header navigation là rất cao

Sau patch:
- homepage `topPicks` tách về `featured_catalog` + preferred key `top-picks`
- navigation giữ semantic riêng

Đây là thay đổi quan trọng nhất của task này.

---

## Current status of homepage slices
### Working as real DB-backed slices now
- Hero
- Featured tickets
- Top picks
- Editorial
- Travel guides
- Promo banner slot

### Still not handled in this task
- Header/navigation public chrome
- Footer
- Story detail dedicated real query by slug
- Tickets/top-picks/guides listing routes beyond homepage shelf reuse
- Rich locale/content text cleanup inside section components/meta labels

---

## Short conclusion
Task này đã đưa homepage public từ trạng thái “có seam nhưng còn lẫn placeholder + promo path lỗi + topPicks map sai semantic” sang trạng thái usable hơn cho demo:
- homepage core shelves đã có **DB-backed selection logic rõ ràng**
- promo slot đã có **repository/query usable thật**
- public homepage render đã được **dọn sạch phần lớn internal placeholder blocks**
- và semantic clash lớn nhất (`topPicks` vs `navigation`) đã được gỡ.
