# Admin Information Architecture MVP — world.nol.com CMS

Mục tiêu của tài liệu này là chốt **information architecture (IA) + UX flow** cho admin CMS nội bộ của `world.nol.com` rebuild, bám theo hướng backend foundation đã thống nhất: **Next.js App Router + protected admin surface + DB-driven content model**.

Phạm vi tập trung vào:
- tree menu/sidebar cho admin MVP
- route naming đề xuất
- nhiệm vụ từng màn hình
- luồng thao tác cơ bản của editor/admin

Không đi sâu vào code implementation hay backend architecture rộng hơn mức cần cho IA.

---

## 1) Nguyên tắc IA cho admin MVP

## 1.1 Mục tiêu chính

Admin CMS này phải giải được 4 việc thực tế nhất cho team nội dung:

1. **Quản lý homepage nhanh** mà không làm đổi UI public.
2. **Quản lý item/content nguồn** để section không bị hard-code.
3. **Cho phép publish/schedule/reorder** các block và item quan trọng.
4. **Dễ học, dễ dùng cho editor nội bộ**, không biến thành page builder quá nặng.

## 1.2 Nguyên tắc tổ chức menu

- Ưu tiên theo **job-to-be-done** thay vì theo bảng DB.
- Tách rõ:
  - **composition layer**: homepage sections, navigation, promo
  - **content source layer**: listings/items, editorial content, media
  - **governance layer**: locales, users/admins, settings
- Các route admin nên nằm dưới một namespace nhất quán: **`/admin/*`**
- Với App Router, admin thuộc **protected area**, dùng layout/sidebar chung.

## 1.3 Vai trò sử dụng chính

### Editor
- sửa homepage
- chọn item cho section
- chỉnh nav/promo/basic editorial content
- publish/schedule nội dung

### Admin / Super admin
- làm mọi việc của editor
- quản lý locale, media policy, users/admins, system settings
- xử lý quyền, cấu hình global

---

## 2) Tree menu/sidebar đề xuất

## 2.1 Sidebar cấp 1

```txt
Dashboard
Homepage
Listings & Items
Editorial
Navigation
Promos & Banners
Locales
Media
Users & Admins
Settings
```

Đây là cấu trúc đủ gọn cho MVP nhưng vẫn bao hết nghiệp vụ đã xác định.

---

## 2.2 Tree menu chi tiết

```txt
/admin
├─ /dashboard
├─ /homepage
│  ├─ /overview
│  ├─ /pages
│  ├─ /pages/[locale]
│  ├─ /sections
│  ├─ /sections/hero
│  ├─ /sections/tickets
│  ├─ /sections/products
│  ├─ /sections/content
│  ├─ /sections/promos
│  └─ /preview
├─ /listings
│  ├─ /items
│  ├─ /items/new
│  ├─ /items/[id]
│  ├─ /items/[id]/edit
│  ├─ /tickets
│  ├─ /products
│  ├─ /categories
│  └─ /tags
├─ /editorial
│  ├─ /articles
│  ├─ /articles/new
│  ├─ /articles/[id]
│  ├─ /articles/[id]/edit
│  ├─ /guides
│  └─ /collections
├─ /navigation
│  ├─ /menus
│  ├─ /menus/header
│  ├─ /menus/footer
│  ├─ /menus/[menuKey]
│  └─ /links
├─ /promos
│  ├─ /banners
│  ├─ /campaigns
│  ├─ /placements
│  └─ /banners/[id]
├─ /locales
│  ├─ /languages
│  ├─ /translations
│  ├─ /translations/missing
│  └─ /fallbacks
├─ /media
│  ├─ /library
│  ├─ /uploads
│  ├─ /folders
│  ├─ /assets/[id]
│  └─ /usage
├─ /users
│  ├─ /admins
│  ├─ /admins/new
│  ├─ /admins/[id]
│  ├─ /roles
│  └─ /activity
└─ /settings
   ├─ /general
   ├─ /homepage
   ├─ /seo
   ├─ /revalidation
   └─ /integrations
```

---

## 3) Route naming convention đề xuất

## 3.1 Quy ước chung

- Dùng danh từ số nhiều cho khu vực quản lý danh sách: `/articles`, `/items`, `/banners`
- Dùng route con rõ nghĩa cho hành động:
  - `new`
  - `[id]`
  - `[id]/edit`
- Dùng route theo feature thay vì trộn query-string làm cấu trúc chính.
- Với object cấu hình đơn lẻ theo key/locale, có thể dùng:
  - `/homepage/pages/[locale]`
  - `/navigation/menus/header`
  - `/settings/homepage`

## 3.2 Gợi ý phân lớp App Router

```txt
src/app/(protected-pages)/admin/
  layout.tsx
  dashboard/page.tsx
  homepage/... 
  listings/...
  editorial/...
  navigation/...
  promos/...
  locales/...
  media/...
  users/...
  settings/...
```

### Gợi ý layout nội bộ
- `admin/layout.tsx`: shell chung, sidebar, topbar, breadcrumbs
- `admin/homepage/layout.tsx`: tab phụ cho homepage
- `admin/listings/layout.tsx`: tab phụ cho items/tickets/products/tags

Cách này hợp với template backend đang có protected route group và action-based server layer.

---

## 4) Mô tả từng khu vực admin

## 4.1 Dashboard

### Route
- `/admin/dashboard`

### Mục tiêu
Trang vào đầu tiên cho editor/admin để nắm nhanh tình trạng hệ thống nội dung.

### Nội dung nên có
- homepage nào đang published theo locale
- section nào đang disabled hoặc scheduled
- promo/banner sắp hết hạn
- item/article mới cập nhật gần đây
- translation missing count
- media upload gần đây
- activity feed cơ bản

### Tác vụ chính
- vào nhanh màn cần sửa
- phát hiện block lỗi / thiếu nội dung / hết lịch campaign
- xem card tóm tắt trạng thái publish

### UX note
Dashboard chỉ nên là **operational dashboard nhẹ**, không biến thành analytics nặng ở MVP.

---

## 4.2 Homepage

Homepage là khu vực quan trọng nhất của CMS MVP, nên tách rõ hơn các khu khác.

### Route đề xuất
- `/admin/homepage/overview`
- `/admin/homepage/pages`
- `/admin/homepage/pages/[locale]`
- `/admin/homepage/sections`
- `/admin/homepage/sections/hero`
- `/admin/homepage/sections/tickets`
- `/admin/homepage/sections/products`
- `/admin/homepage/sections/content`
- `/admin/homepage/sections/promos`
- `/admin/homepage/preview`

### 4.2.1 `/admin/homepage/overview`

#### Nhiệm vụ
- hiển thị homepage theo từng locale đang ở trạng thái nào
- cho editor thấy section order hiện tại
- vào nhanh từng màn chỉnh sửa section

#### Nội dung chính
- locale switcher
- danh sách section hiện có theo thứ tự render
- trạng thái từng section: draft/published/scheduled/disabled
- shortcut: edit, preview, duplicate config, publish

### 4.2.2 `/admin/homepage/pages`

#### Nhiệm vụ
- quản lý record homepage theo locale/market
- tạo homepage config mới cho locale mới nếu cần

#### Nội dung chính
- list homepage pages
- locale
- status
- updated by / updated at
- actions: view, edit, publish, unpublish

### 4.2.3 `/admin/homepage/pages/[locale]`

#### Nhiệm vụ
Đây là màn **homepage composer** cho MVP.

#### Nên có
- section list theo thứ tự
- kéo thả reorder section
- bật/tắt section
- chỉnh title/CTA nhanh với section hỗ trợ inline editing
- vào section detail/editor
- publish homepage theo locale
- preview draft

#### Loại section cần hiển thị rõ
- Hero
- Ticket showcase
- Product showcase
- Content showcase / travel guides
- Promo banner / CTA strip
- Header/Footer references

### 4.2.4 `/admin/homepage/sections/*`

Mỗi loại section có list/editor riêng để tránh homepage composer bị quá tải.

#### `/admin/homepage/sections/hero`
Quản lý hero block, slide, campaign time, desktop/mobile image.

#### `/admin/homepage/sections/tickets`
Quản lý ticket showcase section, source mode manual/dynamic, pin order, max items, sort.

#### `/admin/homepage/sections/products`
Quản lý product showcase, top picks, region/category/tag rules.

#### `/admin/homepage/sections/content`
Quản lý editorial/travel guide block, item pinning, content rule, CTA.

#### `/admin/homepage/sections/promos`
Quản lý promo strip/banner section đặt giữa homepage.

### 4.2.5 `/admin/homepage/preview`

#### Nhiệm vụ
- preview homepage draft theo locale
- xem section scheduled có sẽ hiện đúng không
- kiểm tra UI trước khi publish

#### UX note
MVP chỉ cần preview theo route riêng hoặc preview state trong protected area; chưa cần hệ thống visual diff phức tạp.

---

## 4.3 Listings & Items

Khu này là **nguồn dữ liệu cho TicketCard/ProductCard** và các block homepage liên quan.

### Route đề xuất
- `/admin/listings/items`
- `/admin/listings/items/new`
- `/admin/listings/items/[id]`
- `/admin/listings/items/[id]/edit`
- `/admin/listings/tickets`
- `/admin/listings/products`
- `/admin/listings/categories`
- `/admin/listings/tags`

### 4.3.1 `/admin/listings/items`

#### Nhiệm vụ
- list toàn bộ catalog item nguồn
- filter theo kind/status/locale/tag/region
- bulk action cơ bản

#### Bảng nên có cột
- title
- kind (`ticket`, `product`, ...)
- locale/default locale
- status
- tags / region / category
- updated at
- used in homepage? yes/no

### 4.3.2 `/admin/listings/items/[id]`

#### Nhiệm vụ
- xem chi tiết item
- xem item đang được block nào sử dụng
- xem media chính và metadata cơ bản

### 4.3.3 `/admin/listings/items/[id]/edit`

#### Nhiệm vụ
- sửa title, subtitle, image, href, badge, venue/date nếu là ticket
- gắn tags/category/region
- chỉnh publish status

### 4.3.4 `/admin/listings/tickets`

#### Nhiệm vụ
- shortcut list riêng cho ticket-focused data
- tiện cho editor curate “This Week’s Top Tickets”

### 4.3.5 `/admin/listings/products`

#### Nhiệm vụ
- shortcut list riêng cho product/activity/experience
- tiện curate “Top Picks” và regional blocks

### 4.3.6 `/admin/listings/categories` + `/admin/listings/tags`

#### Nhiệm vụ
- quản trị taxonomy cơ bản phục vụ dynamic rules
- giữ naming nhất quán cho filter section

---

## 4.4 Editorial

Khu này phục vụ **ContentCard / travel guides / article-driven blocks**.

### Route đề xuất
- `/admin/editorial/articles`
- `/admin/editorial/articles/new`
- `/admin/editorial/articles/[id]`
- `/admin/editorial/articles/[id]/edit`
- `/admin/editorial/guides`
- `/admin/editorial/collections`

### 4.4.1 `/admin/editorial/articles`

#### Nhiệm vụ
- list toàn bộ article/editorial content
- filter theo article type, locale, status, tags

### 4.4.2 `/admin/editorial/articles/[id]/edit`

#### Nhiệm vụ
- sửa title, excerpt, hero image, summary
- gắn tag/region
- liên kết related listing item nếu cần
- publish/schedule article

### 4.4.3 `/admin/editorial/guides`

#### Nhiệm vụ
- view chuyên cho travel guide content
- thuận tiện curate homepage block kiểu “Travel Guides”

### 4.4.4 `/admin/editorial/collections`

#### Nhiệm vụ
- gom article thành collection/curation logic nhẹ nếu MVP cần
- hữu ích khi homepage muốn lấy manual set nội dung theo mùa/chủ đề

---

## 4.5 Navigation

Khu quản trị header/footer/menu điều hướng.

### Route đề xuất
- `/admin/navigation/menus`
- `/admin/navigation/menus/header`
- `/admin/navigation/menus/footer`
- `/admin/navigation/menus/[menuKey]`
- `/admin/navigation/links`

### 4.5.1 `/admin/navigation/menus`

#### Nhiệm vụ
- list toàn bộ menu khả dụng
- trạng thái theo locale hoặc shared/global

### 4.5.2 `/admin/navigation/menus/header`

#### Nhiệm vụ
- quản lý header main nav
- locale switch items
- CTA/announcement nếu có

#### UX nên có
- reorder item
- hide/show
- nested item nếu thật sự cần
- preview header tree

### 4.5.3 `/admin/navigation/menus/footer`

#### Nhiệm vụ
- quản lý footer columns, legal links, app links, social links

### 4.5.4 `/admin/navigation/links`

#### Nhiệm vụ
- màn hỗ trợ search toàn bộ link object đang dùng
- kiểm tra broken/duplicate/internal-external nhanh ở mức MVP nhẹ

---

## 4.6 Promos & Banners

Khu này quản lý campaign strip, banner chèn giữa homepage, hero promo nếu dùng chung model.

### Route đề xuất
- `/admin/promos/banners`
- `/admin/promos/campaigns`
- `/admin/promos/placements`
- `/admin/promos/banners/[id]`

### 4.6.1 `/admin/promos/banners`

#### Nhiệm vụ
- list banner/promo object
- filter theo active/scheduled/expired
- publish window management

### 4.6.2 `/admin/promos/banners/[id]`

#### Nhiệm vụ
- chỉnh headline/subheadline/image/CTA/theme
- set start/end time
- assign placement

### 4.6.3 `/admin/promos/campaigns`

#### Nhiệm vụ
- view theo chiến dịch để gom nhiều banner/promos cùng theme
- hữu ích nếu homepage có seasonal campaign

### 4.6.4 `/admin/promos/placements`

#### Nhiệm vụ
- xem placement key nào đang có asset chạy
- ví dụ: `home_hero`, `home_mid_strip`, `home_footer_cta`

---

## 4.7 Locales

Khu hỗ trợ i18n operations cho editor/admin.

### Route đề xuất
- `/admin/locales/languages`
- `/admin/locales/translations`
- `/admin/locales/translations/missing`
- `/admin/locales/fallbacks`

### 4.7.1 `/admin/locales/languages`

#### Nhiệm vụ
- quản lý danh sách locale active
- default locale
- ltr/rtl nếu có

### 4.7.2 `/admin/locales/translations`

#### Nhiệm vụ
- tra cứu nội dung theo locale
- vào nhanh field translation của page/block/item/article

### 4.7.3 `/admin/locales/translations/missing`

#### Nhiệm vụ
- highlight nội dung thiếu dịch
- giúp editor biết homepage locale nào chưa sẵn sàng publish

### 4.7.4 `/admin/locales/fallbacks`

#### Nhiệm vụ
- định nghĩa logic fallback hiển thị
- ví dụ locale chưa đủ translation thì fallback từ `en`

---

## 4.8 Media

Media là thư viện asset dùng chung cho homepage, listing, article, promo.

### Route đề xuất
- `/admin/media/library`
- `/admin/media/uploads`
- `/admin/media/folders`
- `/admin/media/assets/[id]`
- `/admin/media/usage`

### 4.8.1 `/admin/media/library`

#### Nhiệm vụ
- xem toàn bộ asset
- search/filter theo type, dimension, uploader, usage

### 4.8.2 `/admin/media/uploads`

#### Nhiệm vụ
- upload ảnh mới
- kiểm tra size, ratio, alt text cơ bản

### 4.8.3 `/admin/media/assets/[id]`

#### Nhiệm vụ
- xem metadata chi tiết
- dimensions, mime type, localized alt text, focal point
- xem asset đang được dùng ở đâu

### 4.8.4 `/admin/media/usage`

#### Nhiệm vụ
- tra ngược asset usage trước khi thay/xóa
- rất hữu ích để tránh làm gãy homepage đang chạy

---

## 4.9 Users & Admins

Khu vận hành người dùng nội bộ.

### Route đề xuất
- `/admin/users/admins`
- `/admin/users/admins/new`
- `/admin/users/admins/[id]`
- `/admin/users/roles`
- `/admin/users/activity`

### 4.9.1 `/admin/users/admins`

#### Nhiệm vụ
- list tài khoản admin/editor
- trạng thái active/inactive
- last login

### 4.9.2 `/admin/users/admins/[id]`

#### Nhiệm vụ
- xem/sửa profile cơ bản
- gán role
- revoke access nếu cần

### 4.9.3 `/admin/users/roles`

#### Nhiệm vụ
- quản lý role cơ bản cho MVP:
  - `super_admin`
  - `editor`
  - `translator`
  - `analyst` (optional nếu có dashboard nhẹ)

### 4.9.4 `/admin/users/activity`

#### Nhiệm vụ
- audit trail nhẹ
- ai vừa sửa homepage, article, banner, menu

---

## 4.10 Settings

Settings giữ các cấu hình global, không lẫn với content records.

### Route đề xuất
- `/admin/settings/general`
- `/admin/settings/homepage`
- `/admin/settings/seo`
- `/admin/settings/revalidation`
- `/admin/settings/integrations`

### 4.10.1 `/admin/settings/general`

#### Nhiệm vụ
- site name nội bộ
- default locale
- timezone admin/campaign

### 4.10.2 `/admin/settings/homepage`

#### Nhiệm vụ
- cấu hình homepage-level defaults
- số item mặc định của section nếu editor không nhập
- feature flags nhẹ cho homepage

### 4.10.3 `/admin/settings/seo`

#### Nhiệm vụ
- default metadata templates
- robots/canonical defaults ở mức config nếu cần

### 4.10.4 `/admin/settings/revalidation`

#### Nhiệm vụ
- xem trạng thái cache/revalidate hooks
- manual trigger revalidate cho homepage/nav/promo nếu cần cho admin

### 4.10.5 `/admin/settings/integrations`

#### Nhiệm vụ
- chỗ gom cấu hình tích hợp nội bộ mức MVP
- media provider info, webhook status, import source references

---

## 5) Screen patterns nên thống nhất cho toàn admin

## 5.1 Pattern màn danh sách (list/index)

Áp dụng cho items, articles, banners, admins, media.

### Cấu trúc đề xuất
- page title + count
- filter bar
- search
- status tabs
- data table hoặc card list
- bulk actions cơ bản
- row actions: view, edit, publish, archive

### Lợi ích
- editor học một lần, dùng được nhiều khu
- giảm cognitive load

## 5.2 Pattern màn chi tiết (detail)

Áp dụng cho item/article/banner/admin/media asset.

### Cấu trúc đề xuất
- summary panel bên phải hoặc top
- main content tabs:
  - General
  - Localization
  - Media
  - Usage / Relations
  - Publish

## 5.3 Pattern màn editor/form

### Thành phần nên có
- sticky action bar: Save draft / Publish / Schedule / Archive
- field grouping rõ ràng
- validation inline
- preview link
- last updated info

### UX note
MVP không cần autosave phức tạp; **save draft rõ ràng** là đủ và an toàn hơn.

---

## 6) Basic UX flow cho editor/admin

## 6.1 Flow: cập nhật homepage section thủ công

### Mục tiêu
Editor muốn đổi nội dung section “This Week’s Top Tickets”.

### Luồng
1. Vào `/admin/homepage/pages/en`
2. Chọn section `Ticket showcase`
3. Mở editor hoặc vào `/admin/homepage/sections/tickets`
4. Chọn block cần sửa
5. Chuyển `sourceMode = manual` nếu cần
6. Search item từ `/listings/items`
7. Pin/reorder item
8. Save draft
9. Preview homepage
10. Publish now

### Kết quả mong muốn
- editor không cần đụng code
- thay section nhanh
- thấy ngay thứ tự card sẽ render

---

## 6.2 Flow: tạo product block theo region

### Mục tiêu
Tạo block “Top Things to Do in Busan”.

### Luồng
1. Vào `/admin/homepage/sections/products`
2. Create new section hoặc duplicate section cũ
3. Nhập title/subtitle/CTA
4. Chọn `sourceMode = dynamic`
5. Chọn rule: `region = busan`, `kind = product`, `sort = popular`
6. Set `maxItems`
7. Save draft
8. Gắn section vào `/admin/homepage/pages/en`
9. Sắp lại thứ tự section
10. Preview và publish

---

## 6.3 Flow: cập nhật nav/header

### Mục tiêu
Editor muốn đổi menu header và locale links.

### Luồng
1. Vào `/admin/navigation/menus/header`
2. Reorder item
3. Hide/show item cũ
4. Edit label/href
5. Cập nhật locale switch links nếu cần
6. Save draft
7. Preview header trong homepage preview
8. Publish/revalidate

---

## 6.4 Flow: chạy promo banner theo lịch

### Mục tiêu
Admin lên banner seasonal campaign.

### Luồng
1. Vào `/admin/promos/banners`
2. Create banner mới
3. Upload/chọn image từ media library
4. Nhập headline/subheadline/CTA
5. Chọn placement
6. Set `start_at` và `end_at`
7. Save as scheduled
8. Preview
9. Hệ thống tự active theo giờ hoặc admin publish sớm nếu cần

---

## 6.5 Flow: bổ sung article cho travel guide block

### Luồng
1. Vào `/admin/editorial/articles/new`
2. Nhập title/excerpt/image/tag/region
3. Save draft hoặc publish article
4. Vào `/admin/homepage/sections/content`
5. Chọn block “Travel Guides”
6. Pin article thủ công hoặc để dynamic fill theo tag
7. Preview homepage
8. Publish

---

## 6.6 Flow: quản lý locale và translation missing

### Luồng
1. Vào `/admin/locales/translations/missing`
2. Xem danh sách page/block/item/article thiếu dịch
3. Mở entity tương ứng
4. Điền translation field cần thiết
5. Save draft/publish
6. Quay lại check đã hết missing chưa

---

## 6.7 Flow: thay image nhưng tránh làm gãy block đang live

### Luồng
1. Vào `/admin/media/assets/[id]`
2. Kiểm tra `usage`
3. Nếu asset dùng ở nhiều nơi, duplicate asset hoặc upload asset mới
4. Gắn asset mới vào banner/hero/item cụ thể
5. Preview
6. Publish

---

## 7) Quyền truy cập MVP nên map vào IA thế nào

## 7.1 Editor

Có quyền:
- Homepage
- Listings & Items
- Editorial
- Navigation
- Promos
- Media
- xem Locales translation helper

Hạn chế hoặc không có:
- Users & Admins
- Settings nhạy cảm
- một số action xóa vĩnh viễn

## 7.2 Translator

Có quyền:
- Locales
- Editorial translation fields
- Listing/article translation tabs
- có thể xem homepage preview

## 7.3 Super admin

Có toàn quyền, gồm:
- Users & Admins
- Settings
- revalidation trigger
- integrations và locale defaults

---

## 8) IA ưu tiên cho MVP vs nên để phase sau

## 8.1 Cần có ngay trong MVP

- Dashboard nhẹ
- Homepage composer + section editors
- Listings/items manager
- Editorial manager
- Navigation manager
- Promo/banner manager
- Locales basic helper
- Media library cơ bản
- Users/admins cơ bản
- Settings tối thiểu

## 8.2 Chưa cần làm quá sâu ở MVP

- workflow approval nhiều tầng
- analytics dashboard phức tạp
- visual page builder kéo-thả tự do toàn trang
- deep taxonomy management nhiều lớp
- version compare/diff nâng cao
- content calendar hoàn chỉnh

---

## 9) Đề xuất UX chốt cho team

## 9.1 Sidebar nên giữ gọn
Không nên nhét quá nhiều menu con lộ ra cùng lúc. Cấp 1 chỉ nên là 10 mục chính như trên; route con hiển thị bằng tab phụ hoặc secondary nav trong từng module.

## 9.2 Homepage nên là trung tâm
Vì scope rebuild hiện tại xoay quanh homepage, module `Homepage` nên được ưu tiên đầu sidebar, chỉ sau `Dashboard`.

## 9.3 Tách “Listings & Items” với “Editorial” là đúng
Hai loại nội dung này phục vụ hai họ component khác nhau (`TicketCard`/`ProductCard` vs `ContentCard`), editor cũng thường thao tác khác nhau. Tách module sẽ sạch và dễ hiểu hơn.

## 9.4 Navigation và Promos nên độc lập
Đây là hai mảng thay đổi thường xuyên trong vận hành marketing/content. Nếu nhét vào Homepage hết thì màn composer sẽ quá nặng.

## 9.5 Media phải có usage view
Đây là một chi tiết nhỏ nhưng rất đáng tiền. CMS nội bộ thiếu usage tracking thường làm editor thay ảnh rất nguy hiểm.

---

## 10) Kết luận

IA phù hợp nhất cho admin CMS MVP của `world.nol.com` là một **protected admin surface dưới `/admin/*`**, tổ chức theo 10 module chính:

- Dashboard
- Homepage
- Listings & Items
- Editorial
- Navigation
- Promos & Banners
- Locales
- Media
- Users & Admins
- Settings

Trong đó:
- **Homepage** là module trung tâm để compose và publish homepage theo locale
- **Listings/Editorial** là source layer cho card content
- **Navigation/Promos** là composition support layer
- **Locales/Media/Users/Settings** là governance + operations layer

Cấu trúc này đủ gọn để team implement nhanh trong App Router, đủ rõ để editor nội bộ vận hành hằng ngày, và đủ sạch để mở rộng dần sau MVP mà không phải đập lại menu/admin flow từ đầu.
