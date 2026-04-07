# Admin Template Integration Plan — world.nol.com rebuild

## Mục tiêu

Tài liệu này chốt một plan tích hợp **cực thực dụng** để tận dụng backend/admin template vừa upload như một **admin shell** cho dự án `world.nol.com` rebuild dùng **Next.js App Router + Neon + Vercel**, thay vì bê nguyên template dashboard vào codebase.

Mục tiêu là:
- code nhanh ở bước sau,
- giữ public site và admin trong **cùng app** nhưng tách boundary rõ,
- tái sử dụng phần layout/navigation/auth shell hữu ích của template,
- bỏ sớm các phần demo/dashboard không phục vụ CMS nội bộ.

---

## 1) Kết luận ngắn gọn

Template backend này phù hợp nhất nếu dùng như:

- **admin UI shell** cho khu vực `/admin/*`
- cung cấp sẵn:
  - protected layout
  - auth pages
  - sidebar/header/page container
  - navigation tree pattern
  - middleware/auth gate

Không nên dùng template như một “starter app toàn phần” cho toàn bộ site vì:
- public site hiện tại đã có cấu trúc `[lang]` khá rõ,
- template đang thiên về dashboard SaaS demo,
- nếu merge thẳng sẽ kéo theo nhiều theme/config/module thừa.

**Khuyến nghị:** lấy **kiến trúc route group + auth shell + side nav system** từ template, rồi map lại thành **CMS nội bộ cho content, navigation, promo, media, locale**.

---

## 2) Những gì đã thấy ở template Ecme/backend template

## 2.1 Xương sống hiện có của template

Template có các phần đáng dùng:

- `src/app/(auth-pages)`
  - sign-in, sign-up, forgot-password, reset-password
- `src/app/(protected-pages)`
  - layout protected riêng
  - demo page `/home`
- `src/middleware.ts`
  - gate route public/auth/protected bằng NextAuth
- `src/auth.ts` + `configs/auth.config.ts`
  - auth wiring
- `components/layouts/PostLoginLayout/*`
  - layout sau đăng nhập
- `components/template/*`
  - `SideNav`, `Header`, `PageContainer`, `MobileNav`, `UserProfileDropdown`
- `configs/navigation.config/index.ts`
  - menu tree config
- `configs/routes.config/*`
  - route meta / authority mapping

## 2.2 Điểm mạnh thực sự

Template này mạnh ở phần **application shell** chứ chưa mạnh ở domain CMS.

Có sẵn:
- pattern route group sạch,
- auth flow đủ để thay credential thật sau này,
- sidebar tree cho menu đa cấp,
- page container/layout variant,
- theme/navigation provider.

Thiếu hoặc chưa phù hợp trực tiếp với world.nol.com:
- content models cho homepage CMS,
- media workflow thực tế,
- publish/revalidate workflow,
- locale-aware content editing cho site đa ngôn ngữ,
- module quản lý section-based homepage.

Nói ngắn: **template cho khung admin rất ổn, nhưng business modules phải tự dựng theo dự án.**

---

## 3) Đối chiếu với codebase world.nol.com hiện tại

Project hiện tại đã có hướng public site rõ:

- `src/app/layout.tsx`: root layout tối giản
- `src/app/[lang]/layout.tsx`: public shell với `SiteHeader` + `SiteFooter`
- `src/app/[lang]/page.tsx`: homepage theo locale
- UI đang bám content sections:
  - featured tickets
  - top picks
  - editorial
  - travel guides

Ngoài ra tài liệu nội bộ đã chốt hướng backend:
- App Router + Neon + Vercel
- admin nội bộ trong cùng app
- CMS nhẹ, DB-driven, multilingual, revalidation-based

Vì vậy hướng hợp nhất hợp lý là:

- **giữ nguyên public site tree hiện tại làm nhánh public**
- **thêm nhánh `/admin` protected riêng**
- **không để admin layout can thiệp vào `[lang]` public layout**

---

## 4) Route tree đề xuất cho cùng app

## 4.1 Route tree cấp cao

Đề xuất refactor App Router theo route groups như sau:

```txt
src/app/
  layout.tsx

  (public)/
    [lang]/
      layout.tsx
      page.tsx
      guides/
      tickets/
      products/

  (admin-auth)/
    admin/
      sign-in/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx

  (admin-protected)/
    admin/
      layout.tsx
      page.tsx                      -> redirect /admin/dashboard
      dashboard/page.tsx

      content/
        page.tsx                    -> content overview
        home/page.tsx               -> homepage composer
        pages/page.tsx              -> future pages
        navigation/page.tsx         -> header/footer/menu
        promos/page.tsx             -> campaign/promo manager

      catalog/
        page.tsx                    -> list all catalog items
        tickets/page.tsx
        products/page.tsx
        categories/page.tsx         -> optional later
        tags/page.tsx               -> optional later

      editorial/
        page.tsx
        articles/page.tsx
        guides/page.tsx

      media/
        page.tsx                    -> media library

      localization/
        page.tsx                    -> locale overview / translation completeness

      settings/
        page.tsx
        admins/page.tsx             -> later
        roles/page.tsx              -> later
        audit/page.tsx              -> later

  api/
    admin/
    public/
    auth/
```

## 4.2 Vì sao nên dùng `/admin/*` thay vì giữ nguyên `(protected-pages)/home`

Vì `/admin` rõ ràng hơn ở cả 3 mặt:

1. **URL semantics**
   - người dùng nội bộ nhìn là biết đây là admin surface
2. **middleware/rbac**
   - dễ guard theo prefix `/admin`
3. **deploy/debug**
   - rõ ranh giới giữa public traffic và internal operations

`/home` kiểu template demo nên bỏ.

---

## 5) Mapping layout từ Ecme sang CMS nội bộ

## 5.1 Mapping tổng thể

### A. Root layout hiện tại

**Giữ** `src/app/layout.tsx` của project hiện tại làm global root.

Vai trò:
- load global CSS,
- inject providers tối thiểu,
- không ôm logic admin-specific nếu chưa cần.

### B. Public layout

**Giữ** `src/app/[lang]/layout.tsx` cho public site.

Vai trò:
- `SiteHeader`
- `SiteFooter`
- dir/lang handling

Không nên trộn shell admin vào đây.

### C. Admin protected layout

Tạo `src/app/(admin-protected)/admin/layout.tsx` và map từ template như sau:

- dùng ý tưởng của `PostLoginLayout`
- nhưng **rút gọn** chỉ còn 1 biến thể layout chính
- ưu tiên `CollapsibleSide` hoặc `StackedSide`

**Khuyến nghị:** chọn **CollapsibleSide** làm layout mặc định cho CMS.

Lý do:
- hợp tác vụ vận hành nội dung hơn dashboard nhiều panel,
- sidebar một cột dễ hiểu hơn stacked side hai tầng,
- code nhẹ hơn, ít cognitive load cho editor.

### D. Admin auth layout

Map `src/app/(auth-pages)` của template thành:

```txt
src/app/(admin-auth)/admin/sign-in/page.tsx
src/app/(admin-auth)/admin/forgot-password/page.tsx
src/app/(admin-auth)/admin/reset-password/page.tsx
```

Với world.nol.com, giai đoạn đầu có thể giữ:
- sign-in
- forgot password
- reset password

Có thể **bỏ sign-up public** nếu đây là hệ thống nội bộ do admin tạo tài khoản.

---

## 5.2 Mapping component shell chi tiết

| Từ template Ecme | Vai trò mới trong CMS | Ghi chú |
|---|---|---|
| `PostLoginLayout` | `AdminLayoutShell` | Giữ pattern, rút gọn variant |
| `CollapsibleSide` | layout mặc định admin | Nên dùng ngay |
| `Header` | `AdminTopbar` | Giữ structure, thay action contents |
| `SideNav` | `AdminSidebar` | Giữ engine, thay menu tree |
| `PageContainer` | `AdminPageContainer` | Dùng tiếp cho page title/breadcrumb/action bar |
| `MobileNav` | mobile sidebar admin | Dùng nếu team cần responsive admin |
| `UserProfileDropdown` | tài khoản admin | Dùng lại nhưng giản lược item |
| `NavigationProvider` | provider cho admin nav | Dùng nếu không quá nặng |
| `ThemeProvider` | chỉ giữ nếu thực sự cần dark mode/config | Có thể giản lược mạnh |
| `AuthProvider` | session provider | Dùng nếu auth stack giữ NextAuth |

---

## 6) Module nào nên dùng ngay

## 6.1 Nên dùng ngay

### 1. Route group pattern
Dùng ngay.

Lợi ích:
- public/admin tách sạch trong cùng app,
- layout nesting rõ,
- dễ scale.

### 2. Middleware auth gate
Dùng ngay nhưng sửa logic để ưu tiên `/admin`.

Mục tiêu mới:
- public routes: `[lang]/*`
- auth routes: `/admin/sign-in`, `/admin/forgot-password`, `/admin/reset-password`
- protected routes: `/admin/*`

### 3. `PostLoginLayout` pattern
Dùng ngay nhưng rút gọn.

Không cần giữ đủ 6 layout mode.
Chỉ giữ 1 mode chính:
- `collapsible-side`

### 4. `SideNav`
Dùng ngay.

Vì đây là phần template làm ổn nhất cho admin CMS:
- menu tree,
- collapse,
- authority-based rendering,
- active route detection.

### 5. `Header`
Dùng ngay.

Chỉ cần thay nội dung header thành:
- breadcrumb
- quick actions
- preview button
- publish actions ở page cụ thể
- user dropdown

### 6. `PageContainer`
Dùng ngay.

Rất hợp để dựng nhanh các màn hình list/edit/manager trong admin.

### 7. NextAuth wiring pattern
Dùng làm nền.

Nhưng credential/OAuth demo phải thay bằng auth thật của dự án.

---

## 6.2 Nên dùng sau hoặc cân nhắc

### 1. `StackedSideNav`
Chỉ nên cân nhắc nếu admin về sau có quá nhiều module.

Hiện tại chưa cần vì CMS đầu tiên sẽ chủ yếu:
- content
- catalog
- editorial
- media
- localization
- settings

Một sidebar thường là đủ.

### 2. Theme configurator
Có thể để internal dev-only hoặc bỏ hẳn.

CMS nội bộ không cần cho editor đổi layout/theme kiểu demo.

### 3. Locale provider của template
Chỉ giữ nếu team muốn tái sử dụng phần i18n shell của template.

Nếu public site đã có logic locale riêng, admin nên chỉ dùng **locale selector domain-level** trong CMS thay vì kéo nguyên hệ thống i18n template vào.

---

## 6.3 Nên bỏ sớm

### 1. Demo dashboard `/home`
Bỏ.

### 2. Menu mẫu
Bỏ toàn bộ menu `singleMenuItem`, `collapseMenu`, `groupMenu` demo.

### 3. `sign-up` public route
Bỏ cho giai đoạn đầu nếu không có self-registration.

### 4. Các theme/layout variants không dùng
Bỏ hoặc không import:
- `StackedSide`
- `TopBarClassic`
- `FrameLessSide`
- `ContentOverlay`
- `Blank`

Nếu giữ hết thì codebase sẽ bị “nặng đầu” vô ích.

### 5. Search/notification demo nếu chưa có dữ liệu thật
Bỏ khỏi topbar admin ở MVP.

### 6. Các mock/service demo của template
Bỏ:
- mock auth data
- fake API services
- placeholder content

Admin CMS nên nối thẳng vào domain services thật của dự án.

---

## 7) Sidebar/menu đề xuất cho website content management

## 7.1 Nguyên tắc tổ chức menu

Sidebar admin nên bám **công việc vận hành nội dung**, không bám entity DB thô.

Editor thường nghĩ theo nhóm việc:
- chỉnh homepage
- chỉnh menu/header/footer
- chỉnh promo
- chỉnh tickets/products
- chỉnh bài viết
- quản lý media
- kiểm tra bản dịch

Không nên ngay từ đầu để menu kiểu quá kỹ thuật như:
- pages
- content_blocks
- content_block_items
- navigation_items
- promo_placements

Những thứ đó nên ẩn sau từng màn hình domain.

---

## 7.2 Cấu trúc sidebar khuyến nghị

```txt
Dashboard

Content
  Homepage Composer
  Pages
  Navigation
  Promos

Catalog
  Tickets
  Products
  Tags        (optional later)

Editorial
  Articles
  Travel Guides

Media
  Library

Localization
  Locales
  Translation Status

Settings
  Admin Users    (later)
  Roles          (later)
  Audit Log      (later)
```

## 7.3 Menu tree dạng config đề xuất

```ts
const adminNavigation = [
  {
    key: 'dashboard',
    path: '/admin/dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    type: 'item',
  },
  {
    key: 'content',
    path: '',
    title: 'Content',
    icon: 'content',
    type: 'collapse',
    subMenu: [
      { key: 'content.home', path: '/admin/content/home', title: 'Homepage Composer', type: 'item' },
      { key: 'content.pages', path: '/admin/content/pages', title: 'Pages', type: 'item' },
      { key: 'content.navigation', path: '/admin/content/navigation', title: 'Navigation', type: 'item' },
      { key: 'content.promos', path: '/admin/content/promos', title: 'Promos', type: 'item' },
    ],
  },
  {
    key: 'catalog',
    path: '',
    title: 'Catalog',
    icon: 'catalog',
    type: 'collapse',
    subMenu: [
      { key: 'catalog.tickets', path: '/admin/catalog/tickets', title: 'Tickets', type: 'item' },
      { key: 'catalog.products', path: '/admin/catalog/products', title: 'Products', type: 'item' },
    ],
  },
  {
    key: 'editorial',
    path: '',
    title: 'Editorial',
    icon: 'editorial',
    type: 'collapse',
    subMenu: [
      { key: 'editorial.articles', path: '/admin/editorial/articles', title: 'Articles', type: 'item' },
      { key: 'editorial.guides', path: '/admin/editorial/guides', title: 'Travel Guides', type: 'item' },
    ],
  },
  {
    key: 'media',
    path: '/admin/media',
    title: 'Media Library',
    icon: 'media',
    type: 'item',
  },
  {
    key: 'localization',
    path: '/admin/localization',
    title: 'Localization',
    icon: 'localization',
    type: 'item',
  },
  {
    key: 'settings',
    path: '',
    title: 'Settings',
    icon: 'settings',
    type: 'collapse',
    subMenu: [
      { key: 'settings.admins', path: '/admin/settings/admins', title: 'Admin Users', type: 'item' },
      { key: 'settings.audit', path: '/admin/settings/audit', title: 'Audit Log', type: 'item' },
    ],
  },
]
```

---

## 8) Route-to-domain mapping cụ thể cho CMS nội bộ

## 8.1 Dashboard

### `/admin/dashboard`
Mục tiêu:
- nhìn nhanh trạng thái vận hành nội dung
- không biến thành BI dashboard nặng

Widget nên có:
- homepage locale nào đang published
- block nào sắp hết campaign/promo
- bản dịch còn thiếu
- item draft gần đây
- media mới upload

**Không cần** nhồi chart demo từ template.

---

## 8.2 Homepage Composer

### `/admin/content/home`
Đây nên là màn hình quan trọng nhất ở giai đoạn đầu.

Chức năng:
- chọn locale
- xem thứ tự các section homepage
- bật/tắt section
- reorder section
- edit title/subtitle/CTA từng section
- đổi source manual/dynamic
- pin item cho section
- preview publish window

Mapping sang data model đã có:
- `pages`
- `content_blocks`
- `content_block_items`
- localizations

Đây chính là nơi template Ecme chỉ cung cấp shell, còn business UI phải làm riêng.

---

## 8.3 Navigation manager

### `/admin/content/navigation`
Chức năng:
- quản lý header nav
- footer nav
- mobile menu
- reorder items
- nested items
- locale labels
- external/internal link target

Mapping sang data model:
- `navigation_menus`
- `navigation_items`
- `navigation_item_localizations`

---

## 8.4 Promo manager

### `/admin/content/promos`
Chức năng:
- tạo banner/promo/campaign card
- set placement
- set start/end time
- CTA/href
- image + localized text

Mapping:
- `promos`
- `promo_localizations`
- `promo_placements`

---

## 8.5 Catalog manager

### `/admin/catalog/tickets`
### `/admin/catalog/products`

Chức năng:
- list/search/filter item
- edit status, slug, badge, media
- localized title/summary
- tag/category assignment
- publish/archive

Mapping:
- `catalog_items`
- `catalog_item_localizations`
- tags

Khuyến nghị practical:
- cùng 1 service layer, tách UI theo tab hoặc route con.

---

## 8.6 Editorial manager

### `/admin/editorial/articles`
### `/admin/editorial/guides`

Chức năng:
- CRUD article/guide
- excerpt/body
- hero image
- related items
- localized content

Mapping:
- `articles`
- `article_localizations`
- `article_related_items`

---

## 8.7 Media library

### `/admin/media`

Chức năng:
- upload asset
- browse/search asset
- alt text theo locale
- usage tracking
- pick asset cho content modules

Mapping:
- `media_assets`
- `media_asset_localizations`
- `media_usages`

---

## 8.8 Localization

### `/admin/localization`

Chức năng:
- chọn locale
- xem entity nào thiếu translation
- hiển thị completeness theo module
- filter “draft but untranslated”

Vì world.nol.com là site đa ngôn ngữ, đây là module nên có sớm, không nên để cuối.

---

## 9) Tách public site với protected admin trong cùng app

## 9.1 Boundary kiến trúc

Public site và admin nên dùng **hai layout branch khác nhau**, nhưng chia sẻ:
- root app
- domain services
- db layer
- auth utilities
- shared UI primitives nếu hợp lý

Sơ đồ:

```txt
src/app/
  layout.tsx                     -> global root

  (public)/[lang]/*              -> public marketing/content site
  (admin-auth)/admin/sign-in     -> auth pages
  (admin-protected)/admin/*      -> protected CMS

src/server/
  auth/
  db/
  repositories/
  services/

src/components/
  public/*
  admin/*
  shared/*
```

## 9.2 Thứ không nên làm

- Không dùng chung `SiteHeader/SiteFooter` với admin.
- Không để admin components nằm lẫn với public section components theo kiểu khó phân biệt.
- Không để middleware chặn cả public locale routes chỉ vì copy nguyên logic từ template.

## 9.3 Guard strategy đề xuất

### Public
- `[lang]/*` luôn public
- có thể có preview token/cookie cho preview draft

### Admin auth routes
- `/admin/sign-in`
- `/admin/forgot-password`
- `/admin/reset-password`
- nếu đã signed in thì redirect `/admin/dashboard`

### Admin protected
- `/admin/*`
- yêu cầu session + authority

### API admin
- `/api/admin/*`
- bắt buộc server-side auth check

---

## 9.4 Middleware logic nên đổi như nào

Template hiện đang xác định public/auth route bằng object config. Với world.nol.com nên sửa thành logic rõ hơn:

1. Nếu route bắt đầu bằng `/api/auth` -> skip middleware auth page redirect logic
2. Nếu route bắt đầu bằng `/admin/sign-in` / `/admin/forgot-password` / `/admin/reset-password`
   - signed-in -> redirect `/admin/dashboard`
3. Nếu route bắt đầu bằng `/admin`
   - chưa signed-in -> redirect `/admin/sign-in?redirect=...`
4. Còn lại coi như public

Như vậy `[lang]/*` sẽ không bị ảnh hưởng.

---

## 10) Cấu trúc thư mục nên có sau khi tích hợp

```txt
src/
  app/
    layout.tsx

    (public)/
      [lang]/
        layout.tsx
        page.tsx

    (admin-auth)/
      admin/
        sign-in/page.tsx
        forgot-password/page.tsx
        reset-password/page.tsx

    (admin-protected)/
      admin/
        layout.tsx
        page.tsx
        dashboard/page.tsx
        content/
          home/page.tsx
          navigation/page.tsx
          promos/page.tsx
        catalog/
          tickets/page.tsx
          products/page.tsx
        editorial/
          articles/page.tsx
          guides/page.tsx
        media/page.tsx
        localization/page.tsx
        settings/
          audit/page.tsx

    api/
      admin/
      auth/
      public/

  components/
    admin/
      layout/
      navigation/
      pages/
      forms/
    public/
      layout/
      sections/
      cards/
    shared/

  server/
    auth/
    db/
    repositories/
    services/
      home-service.ts
      navigation-service.ts
      promo-service.ts
      catalog-service.ts
      article-service.ts
      media-service.ts
```

---

## 11) Kế hoạch tích hợp theo bước để code nhanh

## Phase 1 — Extract admin shell

Mục tiêu:
- dựng khung `/admin` chạy được
- chưa cần business screens hoàn chỉnh

Việc làm:
- mang sang các phần shell của template:
  - auth wiring pattern
  - middleware pattern
  - `SideNav`
  - `Header`
  - `PageContainer`
  - `CollapsibleSide`
- đổi route config sang `/admin/*`
- bỏ demo `/home`
- bỏ menu mẫu
- dựng `adminNavigation` mới

Output:
- sign-in page
- admin dashboard placeholder
- sidebar/topbar hoạt động

## Phase 2 — Wire auth + RBAC thực tế

Việc làm:
- thay mock credential bằng auth thật
- đưa session check vào `/admin/layout.tsx` hoặc server utilities
- thêm authority cho từng nhóm route:
  - `editor`
  - `translator`
  - `admin`

Output:
- protected admin dùng được thật

## Phase 3 — Build CMS core screens

Ưu tiên màn hình theo thứ tự:
1. `/admin/content/home`
2. `/admin/content/navigation`
3. `/admin/content/promos`
4. `/admin/catalog/tickets`
5. `/admin/catalog/products`
6. `/admin/editorial/articles`
7. `/admin/media`
8. `/admin/localization`

Lý do:
- bám đúng content model và homepage rebuild hiện tại
- giúp public site sớm bỏ mock data

## Phase 4 — Revalidation + preview

Việc làm:
- publish/unpublish flow
- tag-based revalidation
- preview mode cho homepage
- audit log cơ bản

## Phase 5 — Cleanup template debt

Việc làm:
- xóa hẳn phần theme/layout variant không dùng
- dọn icon/config/service demo
- chuẩn hóa naming `admin/*`

---

## 12) Naming và UX recommendation

## 12.1 Đặt tên theo nghiệp vụ, không theo kỹ thuật DB

Ưu tiên tên route/menu như:
- Homepage Composer
- Navigation
- Promos
- Tickets
- Products
- Articles
- Travel Guides
- Media Library
- Localization

Tránh để editor thấy các tên kiểu:
- Content Blocks
- Entity Localization
- Promo Placement
- Media Usage

Mấy tên đó chỉ nên xuất hiện ở code/service layer.

## 12.2 Dashboard nên rất nhẹ

Quan điểm thẳng luôn: template dashboard demo thường dễ làm project đi lạc.

Với world.nol.com, dashboard nội bộ nên chỉ là:
- lối vào nhanh tới các module chính,
- vài trạng thái vận hành,
- không cần charts đẹp mà vô dụng.

## 12.3 Sidebar nên ổn định từ sớm

Đừng đổi sidebar liên tục theo schema backend.
Hãy cố định theo workflow biên tập, vì:
- editor nhớ đường đi nhanh hơn,
- code permissions cũng rõ hơn,
- tài liệu onboarding dễ viết hơn.

---

## 13) Chốt module giữ/bỏ

## Giữ
- route groups
- middleware auth gate
- post-login shell
- side nav
- header
- page container
- user profile dropdown
- auth page structure
- route meta / navigation tree pattern

## Bỏ hoặc không migrate ngay
- demo dashboard `/home`
- demo nav items
- sign-up public
- theme configurator
- multiple layout variants
- search/notification demo
- mock auth/services/data
- bất kỳ dashboard chart/card mẫu nào không phục vụ CMS

---

## 14) Quyết định thực dụng đề xuất

Nếu phải chốt ngắn gọn để bước sau code nhanh, mình đề xuất:

1. **Không merge nguyên template.** Chỉ trích xuất admin shell.
2. **Chuẩn hóa toàn bộ admin dưới `/admin`.**
3. **Giữ public `[lang]` độc lập hoàn toàn.**
4. **Dùng `CollapsibleSide` làm layout admin duy nhất cho MVP.**
5. **Sidebar bám workflow content management, không bám DB schema.**
6. **Ưu tiên code `Homepage Composer`, `Navigation`, `Promos`, `Catalog`, `Editorial`, `Media`, `Localization`.**
7. **Loại bỏ sớm mọi phần demo để tránh template debt.**

---

## 15) Kết luận

Template backend upload lần này **đủ tốt để làm admin foundation**, nhưng chỉ nên dùng như một **bộ khung điều hướng + auth + layout** cho CMS nội bộ của `world.nol.com`.

Cách làm đúng và nhanh là:
- giữ nguyên public site App Router hiện có,
- thêm nhánh `/admin` protected trong cùng app,
- map shell Ecme thành admin CMS gọn,
- dựng menu theo nghiệp vụ content management,
- nối các module vào content model/backend foundation đã chốt trước đó.

Nếu làm theo plan này, bước code tiếp theo sẽ khá thẳng:
- dựng admin shell,
- nối auth,
- tạo 5–8 màn hình CMS chính,
- rồi chuyển homepage từ mock sang DB-driven mà không phải đập lại cấu trúc app.
