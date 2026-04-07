# Task 1092 — Demo import source-to-schema mapping (homepage / navigation / promos)

## Chốt nhanh
Demo import nhanh nên coi **website gốc -> normalized import records -> schema hiện có**. Không cần mở rộng schema lớn. Core dùng đủ:
- `page`
- `page_localization`
- `content_block`
- `content_block_localization`
- `content_block_item`

Schema MVP chỉ cần **thêm convention rõ ràng** cho `blockType`, `key`, `itemType`, và `overrideJson` shape. Nếu cần footer sạch hơn, thêm **block key convention** trước, chưa cần bảng mới.

---

## 1) Source -> entity mapping cho demo

### A. Homepage root / basic metadata
**Source content từ site gốc**
- homepage title/hero heading
- hero subcopy
- canonical path
- SEO title/description cơ bản nếu scrape được
- locale

**Map vào**
- `page`
  - `pageType = 'home'`
  - `slug = 'home'`
  - `status = 'published'`
  - `visibility = 'public'`
- `page_localization`
  - `pageId`
  - `localeCode`
  - `title` = homepage internal/public title
  - `seoTitle`
  - `seoDescription`
  - `canonicalPath` = `/{locale}`

**Note**
- `heroTitle` / `heroDescription` chưa có field riêng ở `page_localization`, nên với demo nên lấy từ **hero block localization** thay vì cố nhét vào page.

---

### B. Homepage hero
**Source content**
- hero headline
- hero supporting text
- optional CTA

**Map vào**
- `content_block`
  - `blockType = 'hero'`
  - `key = 'home-hero'`
  - `pageId = homepage page.id`
  - `displayOrder = 1`
- `content_block_localization`
  - `blockId`
  - `localeCode`
  - `title` = hero headline
  - `subtitle` = hero supporting text
  - `ctaLabel` / `ctaHref` nếu có
- `content_block_item`
  - **không bắt buộc** cho demo hero static

**Nếu hero có image/slide**
- tạm lưu trong `content_block.settingsJson`:
  - `image`
  - `mobileImage`
  - `theme`
- Nếu nhiều slide thật sự cần demo mới, mỗi slide có thể là `itemType='promo'` hoặc `itemType='manual_link'` với overrideJson; nhưng demo đầu tiên không cần.

---

### C. Homepage shelves / sections
Các section public hiện có trong code:
- featured tickets
- top picks
- editorial
- travel guides

**Source content mỗi section**
- title
- description
- CTA label/href
- list card items

**Map vào**
- `content_block`
  - `featuredTickets` -> `blockType = 'featured_catalog'`, `key = 'featured-tickets'`
  - `topPicks` -> `blockType = 'featured_catalog'`, `key = 'top-picks'`
  - `editorial` -> `blockType = 'editorial_grid'`, `key = 'editorial'`
  - `travelGuides` -> `blockType = 'travel_guides'`, `key = 'travel-guides'`
- `content_block_localization`
  - `title`
  - `subtitle` = section description
  - `ctaLabel`
  - `ctaHref`
- `content_block_item`
  - `displayOrder`
  - `itemType`
  - `itemId`
  - `overrideJson`

**ItemType đề xuất cho demo import**
- ticket-like cards -> `catalog_item`
- product/activity cards -> `catalog_item`
- editorial/travel guide cards -> `article`
- nếu chưa có source tables thật -> vẫn import được bằng `itemId` synthetic + `overrideJson`

**overrideJson shape tối thiểu cho demo**
- featured tickets:
  - `title`
  - `subtitle`
  - `href`
  - `image`
  - `badge` (optional)
- top picks:
  - `title`
  - `description`
  - `href`
  - `image`
  - `category` hoặc nhét vào `subtitle/description`
- editorial / travel guides:
  - `title`
  - `description` hoặc `excerpt`
  - `eyebrow` (optional)
  - `href`
  - `image`

**Import shortcut cho demo**
- Không cần chờ bảng `ticket_content/product_content/article_content`
- Import shelf items trực tiếp dưới `content_block_item.overrideJson`
- `itemId` chỉ cần stable synthetic key từ source slug/url

---

### D. Navigation (header / secondary / locale links nếu có)
Schema hiện tại đủ, vì navigation adapter đang đọc `nav_highlight` + item override.

**Source content**
- main header links
- secondary/header utility links
- optional badges
- target (`_self` / `_blank`)

**Map vào**
- `content_block`
  - primary header -> `blockType = 'nav_highlight'`, `key = 'header-primary'`
  - secondary header -> `blockType = 'nav_highlight'`, `key = 'header-secondary'`
  - locale switcher (nếu demo cần) -> `blockType = 'nav_highlight'`, `key = 'header-locales'`
- `content_block_localization`
  - `title` optional, chủ yếu để admin label block
  - `ctaLabel` / `ctaHref` optional
- `content_block_item`
  - `itemType = 'manual_link'`
  - `itemId` = stable slug/key
  - `overrideJson`:
    - `label`
    - `href`
    - `target`
    - `badge`

**Note thực dụng**
- Adapter hiện tại lấy **nav block đầu làm primary**, phần còn lại thành secondary. Vì vậy import demo nên **sắp order đúng**:
  1. `header-primary`
  2. `header-secondary`
  3. `header-locales` (nếu cần)

---

### E. Promos / banner strip
**Source content**
- promo headline
- subheadline
- CTA label/href
- theme/style
- placement theo homepage

**Map vào**
- `content_block`
  - `blockType = 'promo_banner'`
  - `key` theo placement, ví dụ:
    - `home-promo-strip-1`
    - `home-mid-banner`
  - `displayOrder` theo vị trí render
  - `settingsJson.placement` nên có nếu muốn importer/debug rõ hơn
- `content_block_localization`
  - `title` = promo title nội bộ hoặc headline block-level
  - `subtitle`
  - `ctaLabel`
  - `ctaHref`
- `content_block_item`
  - `itemType = 'promo'`
  - `itemId` = stable promo key
  - `overrideJson`:
    - `headline`
    - `subheadline`
    - `ctaLabel`
    - `ctaHref`
    - `theme`

**Note**
- Query/admin hiện tại đã bám shape này rồi. Demo import chỉ cần nhất quán `overrideJson`.
- Nếu chỉ có 1 promo strip trên homepage, 1 block + 1 item là đủ.

---

### F. Footer
Schema chưa có footer read-path riêng, nhưng để demo nhanh không cần tạo bảng mới.

**Phương án pragmatic nhất**
- Dùng `blockType = 'nav_highlight'`
- chia block keys:
  - `footer-column-company`
  - `footer-column-support`
  - `footer-legal`
  - `footer-social`
- mỗi link là `content_block_item(itemType='manual_link')`
- `overrideJson`:
  - `label`
  - `href`
  - `target`
  - `badge` optional

**Nếu cần footer text/copyright**
- để ở `content_block_localization.subtitle`
- hoặc `content_block.settingsJson = { text: '...' }`

=> Cho demo là đủ. Không nên mở `footer_config` table riêng ở phase này.

---

## 2) Mapping matrix cực ngắn để importer dùng ngay

| Source slice | page/page_loc | block | block_loc | block_item |
|---|---|---|---|---|
| Homepage root | `home`, SEO, canonical | - | title/seo/canonical | - |
| Hero | - | `hero`, key `home-hero` | title/subtitle/cta | optional |
| Featured tickets | - | `featured_catalog`, key `featured-tickets` | title/subtitle/cta | `catalog_item` + title/subtitle/href/image/badge |
| Top picks | - | `featured_catalog`, key `top-picks` | title/subtitle/cta | `catalog_item` + title/description/href/image |
| Editorial | - | `editorial_grid`, key `editorial` | title/subtitle/cta | `article` + title/excerpt/href/image/eyebrow |
| Travel guides | - | `travel_guides`, key `travel-guides` | title/subtitle/cta | `article` + title/excerpt/href/image/eyebrow |
| Header nav primary | - | `nav_highlight`, key `header-primary` | optional | `manual_link` + label/href/target/badge |
| Header nav secondary | - | `nav_highlight`, key `header-secondary` | optional | `manual_link` + label/href/target/badge |
| Promo strip | - | `promo_banner`, key by placement | title/subtitle/cta | `promo` + headline/subheadline/cta/theme |
| Footer columns | - | `nav_highlight`, key `footer-*` | title/subtitle optional | `manual_link` + label/href/target |

---

## 3) Synthetic IDs / import rules đề xuất

Để demo import ổn định:
- `page.id`: `home-{locale}`
- `page_localization.id`: `{pageId}-loc-{locale}`
- `block.id`: `{pageId}-{blockKey}`
- `block_localization.id`: `{blockId}-loc-{locale}`
- `block_item.id`: `{blockId}-item-{n}`
- `block_item.itemId`: slug/url-derived stable key, ví dụ `ticket-seoul-pass`, `nav-tickets`, `promo-birthday-2026`

**Block ordering đề xuất homepage**
1. `home-hero`
2. `header-primary` / nav không cần render trong homepage blocks nếu header đọc path riêng
3. `featured-tickets`
4. `top-picks`
5. `home-promo-strip-1`
6. `editorial`
7. `travel-guides`
8. footer blocks nếu render path gom từ nav/footer layer

---

## 4) Gap nhỏ cần bổ sung để demo đỡ đau
Không cần schema mới lớn, chỉ cần quy ước thêm:

### Nên bổ sung ngay
1. **Key conventions**
   - `header-primary`
   - `header-secondary`
   - `footer-*`
   - `featured-tickets`
   - `top-picks`
   - `editorial`
   - `travel-guides`
   - `home-hero`
   - `home-promo-strip-*`

2. **overrideJson conventions** theo itemType
   - `manual_link`: `label/href/target/badge`
   - `promo`: `headline/subheadline/ctaLabel/ctaHref/theme`
   - `catalog_item`: `title/subtitle/description/href/image/badge`
   - `article`: `title/excerpt/eyebrow/href/image`

3. **Optional settingsJson** cho block-level metadata
   - hero image/theme
   - promo placement
   - footer text

### Chưa cần cho demo
- bảng footer riêng
- bảng navigation/menu riêng
- bảng promo campaign riêng
- entity source tables hoàn chỉnh cho ticket/product/article

---

## 5) Recommendation chốt
Để demo nhanh với data thật từ site gốc:
1. Import homepage root vào `page` + `page_localization`.
2. Import từng shelf/nav/promo/footer thành `content_block` theo **block key conventions**.
3. Import card/link/promo rows vào `content_block_item` với **synthetic itemId + overrideJson đầy đủ**.
4. Chưa cần normalize sâu sang catalog/article tables; để phase sau.

Kết luận: **schema hiện tại đã đủ cho demo import homepage/navigation/promos/footer-basic**, miễn là team thống nhất key naming + overrideJson shape. Bổ sung schema chỉ nên ở mức nhẹ: `settingsJson` conventions và footer-by-nav-block convention.
