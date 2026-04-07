# Homepage Content Model — world.nol.com

Mục tiêu: thiết kế content model và CMS operations cho homepage world.nol.com rebuild bằng Next.js App Router, để editor/admin quản trị được nội dung mà vẫn giữ UI giống site hiện tại.

## 1) Nguyên tắc model cho homepage

- **Tách 3 lớp dữ liệu**:
  1. `page config`: cấu hình toàn trang homepage
  2. `section config`: title, CTA, visibility, ordering, source mode
  3. `content entities`: ticket, product, article, promo banner, nav item, footer link
- **UI clone nhưng data không hard-code trong component**.
- **Mỗi section hỗ trợ 2 mode**:
  - `manual`: editor tự chọn item
  - `dynamic`: lấy theo query/rule (tag, region, category, popularity, newest...)
- **Locale-aware**: text hiển thị cần hỗ trợ theo locale; entity có thể dùng bản dịch hoặc field override theo locale.
- **Publish-safe**: mọi block quan trọng cần draft/published/scheduled.

---

## 2) Homepage model tổng thể

## 2.1 `homepage`

Một record cho mỗi locale hoặc market homepage.

### Field list

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `slug` | string | ✓ | ví dụ `home-en`, `home-jp` |
| `locale` | string | ✓ | `en`, `ja`, `ko`, ... |
| `status` | enum | ✓ | `draft`, `published`, `scheduled`, `archived` |
| `title` | string | ✓ | nội bộ cho admin |
| `seoTitle` | string |  | metadata |
| `seoDescription` | string |  | metadata |
| `heroSectionId` | string |  | tham chiếu section hero |
| `headerConfigId` | string | ✓ | tham chiếu header config |
| `footerConfigId` | string | ✓ | tham chiếu footer config |
| `sections` | array | ✓ | danh sách section theo thứ tự render |
| `publishedAt` | datetime |  | phục vụ publish/schedule |
| `updatedAt` | datetime | ✓ | audit |
| `updatedBy` | string | ✓ | audit |

### `sections[]`

```ts
type HomepageSectionRef = {
  id: string
  sectionType:
    | 'hero'
    | 'ticket_showcase'
    | 'product_showcase'
    | 'promo_banner'
    | 'content_showcase'
    | 'footer_cta'
  sectionId: string
  order: number
  enabled: boolean
}
```

> MVP nên lưu `sections[]` trực tiếp trong `homepage` để editor reorder nhanh, chưa cần page-builder quá nặng.

---

## 3) Content model theo từng section homepage

## 3.1 Header / Global Nav

### Model: `header_config`

Dùng chung cho homepage và các route public khác nếu cần.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `locale` | string | ✓ | locale config |
| `logoImage` | asset | ✓ | logo chính |
| `logoHref` | string | ✓ | thường về homepage |
| `primaryNavItems` | array<nav_item> | ✓ | menu chính |
| `secondaryNavItems` | array<nav_item> |  | menu phụ |
| `localeOptions` | array<locale_option> | ✓ | switch ngôn ngữ |
| `ctaLabel` | string |  | nếu có CTA |
| `ctaHref` | string |  | |
| `announcementText` | string |  | optional top notice |
| `announcementHref` | string |  | |
| `enabled` | boolean | ✓ | |

### Nested types

```ts
type NavItem = {
  id: string
  label: string
  href: string
  target?: '_self' | '_blank'
  icon?: string
  badge?: string
  visible: boolean
  order: number
}

type LocaleOption = {
  code: string
  label: string
  href: string
  isDefault?: boolean
}
```

### Component mapping

- `header_config` -> `HomeHeader`
- `primaryNavItems` / `secondaryNavItems` -> nav groups
- `localeOptions` -> locale switcher

### Admin operations

- Reorder nav item
- Hide/show item
- Update locale link mapping
- Edit CTA / announcement độc lập với homepage body

---

## 3.2 Hero / Key Visual

### Model: `hero_section`

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `internalName` | string | ✓ | tên admin |
| `variant` | enum | ✓ | `single`, `carousel` |
| `headline` | string |  | optional nếu text overlay |
| `subheadline` | string |  | |
| `slides` | array<hero_slide> | ✓ | 1 hoặc nhiều slide |
| `autoplay` | boolean |  | dùng khi carousel |
| `autoplayMs` | number |  | |
| `enabled` | boolean | ✓ | |
| `publishStartAt` | datetime |  | optional |
| `publishEndAt` | datetime |  | optional |

```ts
type HeroSlide = {
  id: string
  imageDesktop: string
  imageMobile?: string
  alt: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaHref?: string
  theme?: 'light' | 'dark'
  order: number
  visible: boolean
}
```

### Component mapping

- `hero_section` -> `HeroSection`
- `slides[]` -> `HeroCarouselClient` hoặc static hero render

### Admin operations

- Thêm/xóa/reorder slide
- Lên lịch hero campaign theo ngày
- Override mobile image

---

## 3.3 Featured Ticket Block

### Model: `ticket_showcase_section`

Áp dụng cho “This Week’s Top Tickets”.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `internalName` | string | ✓ | |
| `title` | localized string | ✓ | section title |
| `ctaLabel` | string |  | ví dụ `View all` |
| `ctaHref` | string |  | |
| `sourceMode` | enum | ✓ | `manual`, `dynamic` |
| `items` | array<ticket_reference> |  | dùng cho manual |
| `queryRule` | json |  | dùng cho dynamic |
| `maxItems` | number | ✓ | ví dụ 8 hoặc 10 |
| `layout` | enum | ✓ | `carousel`, `grid` |
| `sortMode` | enum | ✓ | `manual`, `date_asc`, `popularity`, `recommended` |
| `enabled` | boolean | ✓ | |
| `publishStartAt` | datetime |  | |
| `publishEndAt` | datetime |  | |

```ts
type TicketReference = {
  ticketId: string
  overrideTitle?: string
  overrideImage?: string
  pinOrder?: number
}
```

### Ticket entity tối thiểu: `ticket_content`

| Field | Type |
|---|---|
| `id` | string |
| `externalId` | string |
| `title` | string |
| `dateText` | string |
| `venue` | string |
| `image` | string |
| `href` | string |
| `status` | enum |
| `startDate` | datetime |
| `endDate` | datetime |
| `tags` | array<string> |
| `popularityScore` | number |
| `locale` | string |

### Component mapping

- `ticket_showcase_section` -> `TicketShowcaseSection`
- resolved ticket items -> `TicketCard[]`

### Admin operations

- Pin ticket thủ công
- Chuyển manual/dynamic
- Set rule kiểu `tag=kpop`, `date>=today`, `market=en`
- Override title/image cho homepage mà không sửa nguồn ticket gốc

---

## 3.4 Product / Top Picks Block

### Model: `product_showcase_section`

Áp dụng cho “K-POP Fans Top Picks”, “Top Things to Do in Busan”.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `internalName` | string | ✓ | |
| `title` | localized string | ✓ | |
| `subtitle` | localized string |  | optional |
| `ctaLabel` | string |  | |
| `ctaHref` | string |  | |
| `sourceMode` | enum | ✓ | `manual`, `dynamic` |
| `items` | array<product_reference> |  | manual |
| `queryRule` | json |  | dynamic |
| `maxItems` | number | ✓ | |
| `sortMode` | enum | ✓ | `manual`, `popular`, `newest`, `recommended` |
| `layout` | enum | ✓ | `carousel`, `grid` |
| `regionFilter` | string |  | ví dụ `busan` |
| `categoryFilter` | string |  | |
| `tagFilter` | array<string> |  | |
| `enabled` | boolean | ✓ | |

```ts
type ProductReference = {
  productId: string
  overrideTitle?: string
  overrideBadge?: string
  overrideImage?: string
  pinOrder?: number
}
```

### Product entity tối thiểu: `product_content`

| Field | Type |
|---|---|
| `id` | string |
| `externalId` | string |
| `title` | string |
| `subtitle` | string |
| `badge` | string |
| `image` | string |
| `href` | string |
| `category` | string |
| `region` | string |
| `tags` | array<string> |
| `popularityScore` | number |
| `status` | enum |
| `locale` | string |

### Component mapping

- `product_showcase_section` -> `ProductShowcaseSection` hoặc `ProductCuratedSection`
- resolved products -> `ProductCard[]`

### Admin operations

- Tạo block top picks theo campaign/tag
- Tạo block theo region (Busan, Seoul...)
- Override badge promo riêng cho homepage

---

## 3.5 Promo / Seasonal Banner Strip

### Model: `promo_banner_section`

Dùng cho block kiểu “HAPPY BIRTHDAY 🥳” hoặc campaign chen giữa homepage.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `internalName` | string | ✓ | |
| `variant` | enum | ✓ | `text_only`, `image_banner`, `split_banner` |
| `headline` | localized string | ✓ | |
| `subheadline` | localized string |  | |
| `desktopImage` | asset |  | nếu có |
| `mobileImage` | asset |  | |
| `ctaLabel` | string |  | |
| `ctaHref` | string |  | |
| `theme` | enum |  | `light`, `dark`, `brand`, `seasonal` |
| `publishStartAt` | datetime |  | campaign schedule |
| `publishEndAt` | datetime |  | |
| `enabled` | boolean | ✓ | |

### Component mapping

- `promo_banner_section` -> `PromoBannerSection`

### Admin operations

- Đặt lịch banner theo chiến dịch
- Bật/tắt nhanh mà không cần deploy

---

## 3.6 Editorial / Content Blocks

### Model: `content_showcase_section`

Áp dụng cho “K-Food You Can’t Miss 😋”, “Travel Guides”.

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `internalName` | string | ✓ | |
| `title` | localized string | ✓ | |
| `ctaLabel` | string |  | |
| `ctaHref` | string |  | |
| `sourceMode` | enum | ✓ | `manual`, `dynamic` |
| `items` | array<article_reference> |  | manual |
| `queryRule` | json |  | dynamic |
| `maxItems` | number | ✓ | |
| `sortMode` | enum | ✓ | `manual`, `popular`, `newest`, `editor_pick` |
| `tagFilter` | array<string> |  | |
| `regionFilter` | string |  | |
| `layout` | enum | ✓ | `grid`, `carousel` |
| `enabled` | boolean | ✓ | |

```ts
type ArticleReference = {
  articleId: string
  overrideTitle?: string
  overrideSummary?: string
  overrideImage?: string
  pinOrder?: number
}
```

### Article entity tối thiểu: `article_content`

| Field | Type |
|---|---|
| `id` | string |
| `title` | string |
| `summary` | string |
| `heroImage` | string |
| `thumbnailImage` | string |
| `href` | string |
| `region` | string |
| `tags` | array<string> |
| `viewCount` | number |
| `popularityScore` | number |
| `status` | enum |
| `publishedAt` | datetime |
| `locale` | string |

### Component mapping

- `content_showcase_section` -> `ContentShowcaseSection` / `ContentGuideSection`
- resolved article items -> `ContentCard[]`

### Admin operations

- Chọn tay article hero cho campaign
- Tự động lấy theo tag như `k-food`, `travel-guide`
- Pin vài bài đầu, phần còn lại fill từ dynamic query

---

## 3.7 Footer / CTA / Legal

### Model: `footer_config`

| Field | Type | Required | Ghi chú |
|---|---|---:|---|
| `id` | string | ✓ | UUID |
| `locale` | string | ✓ | |
| `columns` | array<footer_column> | ✓ | link groups |
| `socialLinks` | array<link_item> |  | |
| `appLinks` | array<link_item> |  | app store / play store |
| `legalText` | localized rich text |  | |
| `copyrightText` | string | ✓ | |
| `bottomLinks` | array<link_item> |  | terms/privacy |
| `enabled` | boolean | ✓ | |

```ts
type FooterColumn = {
  id: string
  title: string
  links: LinkItem[]
  order: number
}

type LinkItem = {
  id: string
  label: string
  href: string
  target?: '_self' | '_blank'
  visible: boolean
  order: number
}
```

### Component mapping

- `footer_config` -> `HomeFooter`

### Admin operations

- Quản lý legal link không cần deploy
- Reorder column/link
- Locale-specific legal copy

---

## 4) Mapping model sang component hiện tại

| Model | Component | Mapping chính |
|---|---|---|
| `homepage` | `HomePage` | quyết định section order + enabled state |
| `header_config` | `HomeHeader` | nav, locale switch, CTA |
| `hero_section` | `HeroSection` | hero static/carousel |
| `ticket_showcase_section` | `TicketShowcaseSection` | title, CTA, list `TicketCard` |
| `product_showcase_section` | `ProductShowcaseSection` / `ProductCuratedSection` | title, CTA, list `ProductCard` |
| `promo_banner_section` | `PromoBannerSection` | promo strip/banner |
| `content_showcase_section` | `ContentShowcaseSection` / `ContentGuideSection` | title, CTA, list `ContentCard` |
| `footer_config` | `HomeFooter` | footer columns, legal, social |

### Mapping layer nên có

Tạo một lớp mapper phía server để normalize dữ liệu CMS sang props UI:

```ts
type HomePageViewModel = {
  header: HeaderViewModel
  hero?: HeroViewModel
  sections: Array<
    | TicketShowcaseViewModel
    | ProductShowcaseViewModel
    | PromoBannerViewModel
    | ContentShowcaseViewModel
  >
  footer: FooterViewModel
}
```

**Không để component đọc trực tiếp raw CMS records**.  
Lợi ích: dễ đổi CMS, dễ cache, dễ fallback khi field thiếu.

---

## 5) CMS strategy pragmatic cho MVP

## 5.1 Đề xuất chính: **DB-driven + lightweight custom admin + JSON seed fallback**

Đây là hướng cân bằng nhất cho MVP.

### Vì sao hợp lý

- Homepage có nhiều block curated, không nên hard-code.
- Nhưng chưa cần headless CMS nặng nếu team muốn ship nhanh.
- Có thể giữ schema đơn giản, admin vừa đủ cho editor nội bộ.
- JSON seed giúp bootstrap dữ liệu ban đầu và local dev dễ hơn.

### Cấu hình MVP đề xuất

1. **Database là source of truth**
   - Lưu `homepage`, `header_config`, `footer_config`, các section config.
   - Các entity `ticket/product/article` có thể sync từ nguồn khác hoặc nhập seed ban đầu.

2. **Custom admin nhẹ**
   - Route nội bộ kiểu `/admin/homepage`.
   - Form-based CRUD cho:
     - header/footer config
     - section config
     - manual selection/pinning
     - enable/disable, order, publish window
   - Chưa cần block editor tự do kiểu drag-drop page builder full power.

3. **JSON seed**
   - Seed file cho local/staging.
   - Dùng để import homepage mẫu hoặc reset content nhanh.

4. **Hybrid sourcing cho entity**
   - Ticket/product/article có thể đến từ DB mirror hoặc external sync job.
   - Homepage section chỉ tham chiếu entity + override field nhỏ.

### Không nên cho MVP

- Headless CMS enterprise quá nặng
- Rich page builder tự do hoàn toàn
- Quá nhiều nested polymorphic block khó maintain

---

## 5.2 Admin UX nên có cho MVP

### Homepage editor screen
- Chọn locale homepage
- Danh sách section theo thứ tự
- Toggle enable/disable section
- Reorder section
- Click vào section để edit config
- Preview trạng thái publish/schedule

### Section editor screen
- Edit title / CTA
- Chọn `manual` hoặc `dynamic`
- Nếu manual: search + pin item
- Nếu dynamic: chọn rule cơ bản
  - tag
  - region
  - category
  - sort mode
  - max items
- Preview list item sẽ render

### Publish controls
- Save draft
- Publish now
- Schedule publish window
- Unpublish

---

## 6) Publish state, schedule, ordering/sorting

## 6.1 Publish state

Áp dụng cho homepage và section quan trọng:

```ts
type PublishStatus = 'draft' | 'published' | 'scheduled' | 'archived'
```

### Quy tắc gợi ý
- `homepage.status` quyết định page bản nào active theo locale.
- `section.enabled = false` thì không render dù homepage published.
- Nếu `publishStartAt/publishEndAt` lệch khỏi hiện tại thì section coi như inactive.

## 6.2 Ordering

- Homepage order: lưu tại `homepage.sections[].order`
- Item order trong section manual: lưu `pinOrder`
- Nav/footer order: lưu tại từng item

## 6.3 Sorting

- `manual`: theo `pinOrder`
- `dynamic`: theo `sortMode`
- Hỗ trợ hybrid tốt nhất cho homepage:
  - pin 2–3 item đầu
  - phần còn lại auto-fill theo rule

---

## 7) Cache / revalidate đề xuất

Nguyên tắc: homepage là trang marketing/content-driven, nên **cache có chủ đích** thay vì fully dynamic.

## 7.1 Nên cache gì

### Homepage view model
- Cache theo locale: `home:en`, `home:ja`, ...
- Dùng server fetch + tag-based revalidation

### Section data đã normalize
- Ticket showcase resolved items
- Product showcase resolved items
- Content showcase resolved items

### Header/Footer config
- Cache riêng vì ít đổi nhưng dùng nhiều trang

## 7.2 Revalidate strategy

### Khuyến nghị MVP
- `revalidate` theo thời gian cho homepage: **300s–900s** nếu không có webhook CMS hoàn chỉnh
- Kết hợp **tag-based revalidation** khi admin publish/update

Ví dụ tag:
- `homepage:{locale}`
- `header:{locale}`
- `footer:{locale}`
- `section:{sectionId}`
- `ticket-content`
- `product-content`
- `article-content`

### Trigger revalidation khi nào
- publish/unpublish homepage
- đổi thứ tự section
- sửa title/CTA/visibility
- đổi manual pin list
- update hero/promo schedule
- sync entity ticket/product/article ảnh hưởng section dynamic

## 7.3 Dynamic vs static note

- Homepage route nên là **server-rendered with revalidation**, không cần client fetch sau mount.
- Các carousel client chỉ nhận props từ server.
- Không nên để homepage phụ thuộc live browser fetch cho content chính.

---

## 8) Schema gợi ý tối thiểu cho MVP

```txt
homepage
header_config
footer_config
hero_section
ticket_showcase_section
product_showcase_section
promo_banner_section
content_showcase_section
ticket_content
product_content
article_content
```

Nếu muốn gọn hơn nữa cho MVP, có thể dùng:
- `homepage_section` chung + `section_payload` JSON theo type

Nhưng cách đó chỉ nên dùng nếu team cần ship siêu nhanh. Về maintainability, **tách bảng/model theo section type vẫn sạch hơn**.

---

## 9) Đề xuất chốt cho team

### Nên làm ngay
- Dùng `homepage` làm page-level config theo locale
- Tách riêng `header_config`, `footer_config`, `hero_section`, `ticket_showcase_section`, `product_showcase_section`, `promo_banner_section`, `content_showcase_section`
- Dùng custom admin nhẹ để editor quản lý order, visibility, title, CTA, manual pin, dynamic rules
- Build một lớp mapper server-side từ CMS model -> UI view model
- Dùng cache revalidate theo tag khi publish/update

### Không cần làm ngay
- Page builder tự do
- Workflow approval phức tạp nhiều tầng
- Personalization real-time cho homepage
- CMS vendor nặng nếu chưa có nhu cầu đa team/đa site lớn

Kết luận: với homepage world.nol.com, hướng **DB-driven + custom admin nhẹ + hybrid manual/dynamic sections + tag-based revalidation** là pragmatic nhất cho MVP. Nó đủ linh hoạt cho editor vận hành campaign/section hàng ngày, nhưng vẫn giữ codebase Next.js sạch, dễ kiểm soát và bám UI clone chính xác.