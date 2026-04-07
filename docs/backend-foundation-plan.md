# Backend Foundation Plan — world.nol.com rebuild

## Mục tiêu

Thiết kế backend foundation thực dụng cho giai đoạn rebuild `world.nol.com` trên stack **Next.js App Router + Neon PostgreSQL + Vercel**, sao cho:

- Có thể implement song song với phần UI ngay từ MVP homepage.
- Ưu tiên tốc độ đọc dữ liệu public, đơn giản hóa editorial workflow ban đầu.
- Dễ mở rộng dần sang detail pages, listing pages, search, campaign, commerce flow và analytics sâu hơn.
- Phù hợp môi trường serverless của Vercel và đặc tính PostgreSQL trên Neon.

Phạm vi bản thiết kế này tập trung vào foundation backend, không đi sâu vào code implementation chi tiết.

---

## 1) Kiến trúc backend đề xuất cho App Router

## 1.1 Kiến trúc tổng thể

Đề xuất dùng mô hình **Next.js App Router làm BFF + admin surface**, kết hợp PostgreSQL làm source of truth chính.

```txt
Admin users
  -> Admin UI (Next.js App Router)
  -> Server Actions / protected Route Handlers
  -> Domain services
  -> PostgreSQL (Neon)
  -> Blob/object storage for media

Public site visitors
  -> Next.js App Router pages
  -> Server Components fetch qua domain query layer
  -> PostgreSQL read models / cached queries
```

### Vai trò của từng lớp

1. **App Router (public web)**
   - Render homepage và các route public bằng Server Components.
   - Lấy dữ liệu qua query layer nội bộ, hạn chế gọi REST vòng vo trong cùng app.
   - Dùng cache/revalidate để tối ưu TTFB.

2. **Admin surface trong cùng Next.js app**
   - `/admin/*` là khu vực vận hành nội dung nội bộ.
   - Form submit qua **Server Actions** cho CRUD đơn giản, upload metadata, publish/unpublish.
   - Route Handlers dùng cho API nội bộ cần upload callback, bulk ops, preview data, webhook.

3. **Domain services / data access layer**
   - Tách rõ phần business logic khỏi UI layer.
   - Gồm các module như `home-service`, `content-service`, `navigation-service`, `promo-service`, `locale-service`, `media-service`.
   - Đây là nơi normalize data cho frontend.

4. **Neon PostgreSQL**
   - Lưu toàn bộ dữ liệu canonical: content model, localization, navigation, promos, audit căn bản, admin metadata.
   - Có thể tách thêm read model/materialized view về sau nếu homepage query phức tạp.

5. **Media storage**
   - Không lưu binary lớn trực tiếp trong Postgres.
   - Chỉ lưu metadata file trong DB; file thật để ở Vercel Blob / S3-compatible storage / Cloudinary tùy quyết định sau.

## 1.2 Nguyên tắc kiến trúc

- **Server-first**: phần lớn public data được lấy trực tiếp trong Server Components.
- **BFF nội bộ**: public page không nhất thiết phải gọi API route nếu cùng app có thể query trực tiếp.
- **Schema thiên về editorial CMS nhẹ**: đủ cho homepage + nhiều loại section động.
- **Locale-aware ngay từ đầu**: mọi entity hiển thị public cần có chiến lược localization rõ ràng.
- **Publish-state rõ ràng**: draft / scheduled / published / archived để UI và admin đồng bộ.
- **Additive migrations**: rollout an toàn cho Neon + Vercel, tránh breaking schema changes.

## 1.3 Ranh giới nên dùng Server Actions vs Route Handlers

### Dùng Server Actions cho:
- CRUD form-based trong admin.
- Update thứ nhỏ, đơn record, ít consumer ngoài Next.js.
- Publish/unpublish, reorder block, save draft.

### Dùng Route Handlers cho:
- Public JSON endpoints nếu cần cho mobile app / re-use cross-surface.
- Webhook revalidation.
- Upload signing / upload completion callbacks.
- Admin bulk actions hoặc data import/export.
- Tracking ingestion endpoint cơ bản.

---

## 2) Domain model cấp cao

## 2.1 Các domain chính cho MVP và mở rộng

### A. Home content composition
Dùng để định nghĩa homepage gồm những section nào, thứ tự ra sao, mỗi section trỏ tới nội dung gì.

Ví dụ:
- Hero banner
- Featured tickets
- Top picks products
- Editorial block
- Travel guides block
- Promo strip

### B. Catalog / merchandisable items
Cho các object kiểu “tickets”, “products”, “activities”, “experiences”.

MVP homepage chưa cần full booking engine, nhưng nên có model đủ để:
- hiển thị card,
- nhóm theo section,
- gắn badge/promo,
- mở rộng sang PDP/listing sau này.

### C. Editorial / travel content
Dùng cho bài viết, guide, curation, thematic editorial content.

### D. Navigation & menu
Quản lý header nav, footer nav, secondary links, locale-specific menu labels/URLs.

### E. Banner / promo / campaign
Quản lý các strip, campaign card, CTA banner, seasonal promotions.

### F. Localization
Quản lý ngôn ngữ, bản dịch field-level hoặc entity-level, fallback logic và slug theo locale.

### G. Media & assets
Quản lý ảnh, alt text, focal point, dimensions, ownership, usage tracking cơ bản.

### H. Auth / admin / permissions
Quản lý người vận hành nội dung, vai trò, phiên đăng nhập, audit log cơ bản.

### I. Basic tracking
Ghi nhận page view / click events cơ bản cho homepage blocks, promo và card CTR.

## 2.2 Aggregate đề xuất

Nếu nhìn theo aggregate/business root, có thể gom như sau:

- `HomePage` / `HomeVersion`
- `ContentBlock`
- `CatalogItem`
- `Article`
- `NavigationMenu`
- `PromoCampaign`
- `MediaAsset`
- `Locale`
- `AdminUser`
- `TrackingEvent`

Mỗi aggregate nên có lifecycle riêng nhưng liên kết được bằng relation tables.

---

## 3) Danh sách bảng / entities cốt lõi

Phần này ưu tiên thực dụng: đủ cho MVP homepage nhưng không quá cứng để mở rộng sau.

## 3.1 Core governance tables

### `locales`
Danh sách locale hệ thống hỗ trợ.

Field gợi ý:
- `id`
- `code` (`en`, `ar`, `ko`, ...)
- `name`
- `direction` (`ltr` / `rtl`)
- `is_default`
- `is_active`

### `admin_users`
Tài khoản vận hành nội dung.

Field gợi ý:
- `id`
- `email`
- `name`
- `avatar_url`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

### `admin_roles`
Vai trò như `super_admin`, `editor`, `translator`, `analyst`.

### `admin_user_roles`
Join table user-role nhiều-nhiều.

### `audit_logs`
Lưu action quan trọng trong admin.

Field gợi ý:
- `id`
- `actor_user_id`
- `entity_type`
- `entity_id`
- `action`
- `payload_json`
- `created_at`

## 3.2 Content composition tables

### `pages`
Định nghĩa page logic cấp cao, ví dụ homepage theo locale/site area.

Field gợi ý:
- `id`
- `page_type` (`home`, `landing`, `guide_index`, ...)
- `slug`
- `status`
- `visibility`
- `published_at`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

### `page_localizations`
Field dịch cho page.

Field gợi ý:
- `id`
- `page_id`
- `locale_id`
- `title`
- `seo_title`
- `seo_description`
- `canonical_path`

### `content_blocks`
Block composition trong một page.

Field gợi ý:
- `id`
- `page_id`
- `block_type` (`hero`, `featured_catalog`, `editorial_grid`, `promo_banner`, `travel_guides`, `nav_highlight`)
- `key`
- `status`
- `display_order`
- `variant`
- `settings_json`
- `visibility_rules_json`
- `published_at`
- `created_at`
- `updated_at`

### `content_block_localizations`
Text dịch của block.

Field gợi ý:
- `id`
- `block_id`
- `locale_id`
- `title`
- `subtitle`
- `eyebrow`
- `cta_label`
- `cta_href`

### `content_block_items`
Liên kết block với entity được hiển thị trong block.

Field gợi ý:
- `id`
- `block_id`
- `item_type` (`catalog_item`, `article`, `promo`, `manual_link`)
- `item_id`
- `display_order`
- `override_json`

> Đây là bảng quan trọng để homepage có thể compose động mà không cần hardcode section data vào code.

## 3.3 Catalog / ticket / product tables

### `catalog_items`
Source chung cho ticket/product/activity/experience.

Field gợi ý:
- `id`
- `item_kind` (`ticket`, `product`, `activity`, `destination_pass`, `experience`)
- `status`
- `slug`
- `primary_media_id`
- `default_badge`
- `inventory_mode` (future use)
- `price_from_amount` (nullable)
- `price_currency` (nullable)
- `rating_value` (nullable)
- `rating_count` (nullable)
- `starts_at` (nullable)
- `ends_at` (nullable)
- `venue_name` (nullable)
- `city_code` (nullable)
- `country_code` (nullable)
- `created_at`
- `updated_at`

### `catalog_item_localizations`
Field hiển thị theo locale.

Field gợi ý:
- `id`
- `catalog_item_id`
- `locale_id`
- `title`
- `short_title`
- `subtitle`
- `summary`
- `slug_localized` (nullable)
- `seo_title`
- `seo_description`

### `catalog_item_tags`
Tag gắn item như `k-pop`, `busan`, `birthday`, `family`.

### `tags`
Danh mục tag chung tái sử dụng.

## 3.4 Editorial / travel content tables

### `articles`
Bài viết hoặc guide.

Field gợi ý:
- `id`
- `article_type` (`editorial`, `travel_guide`, `listicle`, `campaign_story`)
- `status`
- `slug`
- `hero_media_id`
- `author_name`
- `published_at`
- `reading_time_minutes`
- `created_at`
- `updated_at`

### `article_localizations`
Nội dung theo locale.

Field gợi ý:
- `id`
- `article_id`
- `locale_id`
- `title`
- `excerpt`
- `body_richtext_json`
- `seo_title`
- `seo_description`
- `slug_localized` (nullable)

### `article_related_items`
Liên kết article với catalog item nếu guide muốn giới thiệu sản phẩm/ticket.

Field gợi ý:
- `article_id`
- `catalog_item_id`
- `relation_type`
- `display_order`

## 3.5 Navigation tables

### `navigation_menus`
Ví dụ `header_main`, `footer_primary`, `footer_legal`, `mobile_menu`.

Field gợi ý:
- `id`
- `menu_key`
- `status`
- `created_at`
- `updated_at`

### `navigation_menu_localizations`
Thông tin dịch theo locale nếu menu có title.

### `navigation_items`
Các item trong menu.

Field gợi ý:
- `id`
- `menu_id`
- `parent_item_id` (nullable)
- `item_type` (`internal`, `external`, `article`, `catalog`, `page`)
- `target_entity_id` (nullable)
- `target_entity_type` (nullable)
- `href`
- `display_order`
- `opens_in_new_tab`
- `is_highlighted`
- `icon_key` (nullable)
- `visibility_rules_json`

### `navigation_item_localizations`
- `id`
- `navigation_item_id`
- `locale_id`
- `label`
- `description`

## 3.6 Promo / banner tables

### `promos`
Đại diện cho promo banner/campaign card.

Field gợi ý:
- `id`
- `promo_type` (`banner`, `strip`, `campaign_card`, `hero_slide`)
- `status`
- `start_at`
- `end_at`
- `priority`
- `media_id`
- `background_color`
- `tracking_key`
- `created_at`
- `updated_at`

### `promo_localizations`
- `id`
- `promo_id`
- `locale_id`
- `title`
- `subtitle`
- `cta_label`
- `cta_href`
- `alt_text`

### `promo_placements`
Nơi promo được hiển thị.

Field gợi ý:
- `id`
- `promo_id`
- `placement_key` (`home_hero`, `home_mid_strip`, `sidebar_future`)
- `page_id` (nullable)
- `display_order`

## 3.7 Media tables

### `media_assets`
Metadata của asset.

Field gợi ý:
- `id`
- `storage_provider`
- `storage_key`
- `public_url`
- `mime_type`
- `width`
- `height`
- `size_bytes`
- `alt_fallback`
- `focal_x`
- `focal_y`
- `uploaded_by`
- `created_at`

### `media_asset_localizations`
Alt text / caption theo locale.

Field gợi ý:
- `id`
- `media_asset_id`
- `locale_id`
- `alt_text`
- `caption`

### `media_usages`
Track asset đang được dùng ở đâu để tránh xóa nhầm.

Field gợi ý:
- `id`
- `media_asset_id`
- `entity_type`
- `entity_id`
- `field_name`

## 3.8 Tracking tables

### `page_view_events`
Cho analytics đơn giản tự quản lý.

Field gợi ý:
- `id`
- `occurred_at`
- `session_id`
- `locale_code`
- `page_type`
- `path`
- `referrer`
- `utm_json`
- `user_agent_hash`

### `click_events`
Track click promo/card/menu.

Field gợi ý:
- `id`
- `occurred_at`
- `session_id`
- `surface` (`home`, `nav`, `promo`)
- `component_key`
- `entity_type`
- `entity_id`
- `locale_code`
- `path`

> Với Vercel, có thể bắt đầu bằng provider analytics ngoài cho pageview tổng quát, còn DB chỉ lưu click events chiến lược nếu thực sự cần.

---

## 4) Quan hệ dữ liệu cốt lõi

## 4.1 Quan hệ homepage composition

- `pages 1 - n content_blocks`
- `content_blocks 1 - n content_block_localizations`
- `content_blocks 1 - n content_block_items`
- `content_block_items -> catalog_items | articles | promos | manual links`

Ý nghĩa:
- Homepage không gắn trực tiếp với query code cứng.
- Admin có thể reorder section và item trong section bằng DB.

## 4.2 Quan hệ localization

- `locales 1 - n *localizations`
- Mỗi entity public quan trọng (`pages`, `content_blocks`, `catalog_items`, `articles`, `promos`, `navigation_items`, `media_assets`) đều có bảng localization riêng.

Đề xuất:
- Có unique constraint kiểu `(entity_id, locale_id)` cho từng bảng localization.
- Có fallback về default locale nếu bản dịch chưa đủ.

## 4.3 Quan hệ catalog / editorial

- `catalog_items n - n tags`
- `articles n - n catalog_items` qua `article_related_items`
- `content_blocks n - n items` qua `content_block_items`

Điều này giúp:
- Một `catalog_item` vừa xuất hiện ở homepage, vừa nằm trong article recommendation, vừa nằm trong promo landing sau này.

## 4.4 Quan hệ navigation

- `navigation_menus 1 - n navigation_items`
- `navigation_items self-reference` qua `parent_item_id` để hỗ trợ submenu.
- `navigation_items` có thể trỏ tới entity nội bộ hoặc external href.

## 4.5 Quan hệ media

- `media_assets 1 - n media_asset_localizations`
- `media_assets 1 - n media_usages`
- Nhiều entity (`catalog_items`, `articles`, `promos`) có thể tham chiếu `media_assets`.

## 4.6 Quan hệ admin / governance

- `admin_users n - n admin_roles`
- `admin_users 1 - n audit_logs`

---

## 5) Chiến lược CMS / admin nhập liệu

## 5.1 Định hướng practical cho giai đoạn đầu

Thay vì tích hợp headless CMS ngoài ngay từ đầu, nên bắt đầu bằng **admin nội bộ tối giản trong chính Next.js app**.

Lý do:
- Stack gọn, ít moving parts.
- Chủ động data model theo nhu cầu clone site.
- Đồng bộ chặt với App Router, auth, preview và revalidation.
- Tránh phải bẻ schema để fit CMS bên thứ ba quá sớm.

## 5.2 Các màn hình admin tối thiểu cho MVP

### A. Dashboard nhẹ
- Nội dung gần đây cập nhật
- Block đang published ở homepage
- Cảnh báo translation thiếu / promo sắp hết hạn

### B. Homepage composer
- Xem danh sách `content_blocks`
- Reorder block
- Bật/tắt block
- Chọn item cho block
- Override title/cta theo locale

### C. Catalog manager
- CRUD `catalog_items`
- Chọn loại item
- Upload/chọn ảnh
- Điền title/summary/date/venue/badge
- Gắn tags

### D. Editorial manager
- CRUD `articles`
- Soạn excerpt + body
- Gắn ảnh đại diện
- Liên kết related catalog items

### E. Promo manager
- CRUD banner/promo
- Chọn placement
- Cấu hình thời gian hiệu lực
- CTA / tracking key

### F. Navigation manager
- Chỉnh header/footer menu
- Reorder items
- Nested items nếu cần

### G. Localization helper
- Tab theo locale
- Hiển thị field nào chưa dịch
- Cho phép fallback hiển thị rõ ràng

### H. Media library
- Upload asset
- Xem kích thước/tỉ lệ
- Gắn alt text theo locale
- Hiển thị asset đang được dùng ở đâu

## 5.3 Workflow editorial đề xuất

### Lifecycle cơ bản
- `draft`
- `scheduled`
- `published`
- `archived`

### Quy trình đơn giản
1. Editor tạo hoặc cập nhật nội dung ở default locale.
2. Translator bổ sung localization.
3. Reviewer hoặc editor publish.
4. Hệ thống trigger revalidate route liên quan.

## 5.4 Preview strategy

Nên có preview mode cho admin:
- Xem homepage với content draft.
- So sánh locale theo route preview.
- Không cần public JSON endpoint riêng cho preview nếu App Router render được bằng cookie/session preview.

## 5.5 Tại sao chưa nên dùng CMS ngoài ngay lập tức

Nếu MVP tập trung rebuild nhanh homepage và kiến trúc custom domain khá đặc thù, nội bộ custom admin thường hợp lý hơn vì:
- data model section-based và multilingual khá riêng,
- homepage composition cần relation linh hoạt,
- team đang code song song frontend/backend trong cùng repo.

Về sau, nếu editorial scale lớn, có thể đánh giá migrate một phần sang CMS ngoài hoặc giữ Postgres-first làm content hub.

---

## 6) Đề xuất route handler / API / server action

## 6.1 Public data access strategy

### Ưu tiên 1: query trực tiếp trong Server Components
Ví dụ homepage:
- `src/app/[lang]/page.tsx`
- gọi `getHomePageData({ locale })`
- service layer query DB và trả về normalized view model

Ưu điểm:
- ít hop mạng hơn,
- type-safe và dễ cache theo segment,
- hợp với Next.js App Router.

### Ưu tiên 2: thêm route handlers khi cần external consumer
Ví dụ:
- mobile app,
- edge middleware cần JSON,
- preview tools,
- public feeds.

## 6.2 Public endpoints đề xuất

### `GET /api/public/home?locale=en`
Trả về normalized homepage payload.

Use case:
- app ngoài web,
- test snapshot data,
- debug nhanh.

### `GET /api/public/navigation?locale=en&menu=header_main`
Trả về menu đã localize.

### `GET /api/public/promos?placement=home_mid_strip&locale=en`
Nếu cần render async riêng cho promo.

> Tuy nhiên với web chính cùng app, không bắt buộc dùng các endpoint này ở MVP.

## 6.3 Admin routes / server actions đề xuất

### Server Actions
Phù hợp cho admin forms:
- `savePageBlockAction`
- `reorderPageBlocksAction`
- `saveCatalogItemAction`
- `saveArticleAction`
- `savePromoAction`
- `saveNavigationMenuAction`
- `publishEntityAction`
- `archiveEntityAction`
- `upsertLocalizationAction`

### Route Handlers
Phù hợp cho nghiệp vụ kỹ thuật hơn:
- `POST /api/admin/media/upload-url`
- `POST /api/admin/media/complete`
- `POST /api/admin/revalidate`
- `POST /api/admin/import/catalog`
- `GET /api/admin/preview/home`
- `POST /api/track/click`

## 6.4 Gợi ý domain services

Tổ chức service layer kiểu:

```txt
src/server/
  db/
  services/
    home-service.ts
    catalog-service.ts
    article-service.ts
    promo-service.ts
    navigation-service.ts
    locale-service.ts
    media-service.ts
    tracking-service.ts
  repositories/
  auth/
```

### `home-service`
- lấy page + blocks + items theo locale
- merge fallback locale
- normalize ra payload UI-friendly cho homepage sections

### `catalog-service`
- CRUD items
- query featured items theo tag/selection
- validate publish completeness

### `article-service`
- CRUD article
- lấy related items
- render editorial block data

### `navigation-service`
- build tree menu theo locale
- áp dụng visibility rules

### `promo-service`
- resolve promo active theo placement và thời gian

### `tracking-service`
- ingest click/pageview events với guard chống spam cơ bản

## 6.5 Normalized homepage payload đề xuất

Dù dữ liệu trong DB khá quan hệ, output cho frontend nên normalized và ổn định.

Ví dụ shape cấp cao:

```ts
{
  locale: "en",
  page: {
    title: "...",
    seo: { ... }
  },
  navigation: { header: [...], footer: [...] },
  hero: {...},
  sections: [
    {
      key: "featured-tickets",
      type: "featured_catalog",
      title: "This Week's Top Tickets",
      items: [...]
    },
    {
      key: "travel-guides",
      type: "editorial_grid",
      title: "Travel Guides",
      items: [...]
    }
  ],
  promos: [...]
}
```

Mục tiêu là frontend không cần biết chi tiết schema sâu phía DB.

---

## 7) Quyết định tối ưu tốc độ và bảo mật trên Vercel / Neon

## 7.1 Tối ưu hiệu năng

### A. Server-rendered data với cache có kiểm soát
- Dùng App Router fetch/query trong server.
- Cache homepage theo locale bằng `revalidate` hoặc tag-based revalidation.
- Revalidate khi admin publish thay vì disable cache toàn bộ.

### B. Tạo read model đơn giản cho homepage nếu query quá sâu
Ban đầu có thể join trực tiếp. Nếu lớn dần:
- tạo query chuyên dụng,
- hoặc materialized/read table cho homepage payload composition.

### C. Chỉ chọn field cần thiết
Homepage cần payload gọn:
- không query body article đầy đủ nếu chỉ cần title/excerpt/image,
- không query media metadata thừa cho block card.

### D. Dùng connection đúng kiểu cho Neon
- Runtime serverless trên Vercel nên ưu tiên **pooled connection string** cho app queries thông thường.
- Direct connection chỉ dùng cho migration hoặc tooling cần session ổn định.

### E. Indexing sớm cho path truy vấn chính
Nên có index cho:
- `content_blocks(page_id, status, display_order)`
- `content_block_items(block_id, display_order)`
- `*_localizations(entity_id, locale_id)` unique/index
- `promos(status, start_at, end_at)`
- `navigation_items(menu_id, parent_item_id, display_order)`
- `catalog_items(status, item_kind)`
- `articles(status, article_type, published_at)`

### F. Tránh N+1 ở service layer
- Query theo batch.
- Map localizations theo entity IDs hàng loạt.
- Lấy media metadata theo batch IDs.

## 7.2 Tối ưu bảo mật

### A. Tách rõ public và admin surface
- `/admin/*` bắt buộc auth.
- Middleware hoặc server-side guard kiểm tra session + role.

### B. Role-based access control cơ bản
- `editor`: CRUD content cơ bản
- `translator`: sửa localization
- `analyst`: xem tracking
- `super_admin`: full quyền

### C. Secrets và env vars
- Lưu DB credentials trong Vercel env vars.
- Không expose admin secrets ra client.
- Tách biến cho pooled URL và direct URL.

### D. CSRF / mutation safety
Với Server Actions và admin form:
- kiểm tra auth server-side mọi mutation,
- validate input bằng schema runtime,
- log audit cho hành động publish/archive/xóa.

### E. Input validation
Mọi payload admin/API nên validate ở server bằng schema rõ ràng để tránh data bẩn.

### F. Upload security
- Dùng signed upload URL.
- Validate mime type, size, dimensions sau upload completion.
- Không cho client ghi thẳng metadata tùy ý vào DB.

### G. Tracking endpoint hardening
- Rate limit cơ bản.
- Không lưu PII nhạy cảm không cần thiết.
- Hash hoặc rút gọn user-agent/session identifiers nếu chỉ cần analytics tổng quát.

## 7.3 Vận hành an toàn với Neon

- Dùng migration additive trước, cleanup sau.
- Tận dụng Neon branches cho preview/testing schema change.
- Giữ schema backward compatible trong giai đoạn frontend/backend song song.
- Theo dõi query chậm ở các payload homepage chính trước khi mở rộng sang nhiều listing pages.

---

## 8) Lộ trình implement đề xuất

## Phase 1 — Foundation cho homepage MVP
Ưu tiên làm ngay:
- Auth admin cơ bản
- `locales`
- `pages`, `content_blocks`, `content_block_items`
- `catalog_items` + localizations
- `articles` + localizations
- `navigation_menus`, `navigation_items`
- `promos`
- `media_assets`
- `getHomePageData(locale)`
- Admin screens tối thiểu cho homepage composer, catalog, editorial, promo, nav

Kết quả:
- Homepage không còn phụ thuộc mock data.
- Có thể nhập nội dung qua admin.

## Phase 2 — Ổn định workflow editorial
- publish workflow tốt hơn
- preview mode
- audit logs
- translation completeness checks
- click tracking cho homepage blocks

## Phase 3 — Mở rộng product/content surface
- detail pages cho article/catalog item
- listing pages theo tag/destination
- search/filter
- campaign landing pages
- SEO metadata nâng cao

## Phase 4 — Chuẩn hóa scale
- read models/materialized views nếu cần
- analytics pipeline tốt hơn
- asset workflow nâng cao
- scheduling/publishing automation

---

## 9) Các quyết định thực dụng nên chốt sớm

1. **Storage provider cho media**
   - Vercel Blob, S3-compatible hay Cloudinary?
   - Ảnh hưởng trực tiếp tới upload flow và image optimization.

2. **Auth provider cho admin**
   - Custom credentials, magic link, hay auth service ngoài?
   - MVP nên chọn giải pháp ít friction nhưng an toàn.

3. **Chiến lược localization**
   - Dịch toàn bộ field-level trong bảng riêng như đề xuất, hay entity-per-locale?
   - Với case này mình nghiêng về bảng localization riêng vì linh hoạt hơn.

4. **Homepage composition mức nào là động**
   - Cho phép editor tự thêm/xóa loại block hay chỉ reorder những block predefined?
   - MVP nên cho predefined block types + dynamic item selection để giảm độ phức tạp.

5. **Tracking dùng nội bộ hay provider ngoài**
   - Nếu chỉ cần cơ bản, có thể dùng provider ngoài cho pageview và DB cho click chiến lược.

---

## 10) Kết luận

Backend foundation phù hợp nhất cho giai đoạn rebuild hiện tại là:

- **Postgres-first content platform nhẹ** trong Neon,
- **Next.js App Router** đóng vai trò vừa public app vừa admin app,
- **Server Components + internal query layer** cho public data,
- **Server Actions + protected Route Handlers** cho admin operations,
- **Schema composition-based + localization-aware** để homepage được cấu hình động,
- **Cache/revalidation đúng chỗ** để tối ưu tốc độ trên Vercel,
- **RBAC, validation, audit và media metadata** để giữ hệ thống an toàn và vận hành được.

Thiết kế này đủ gọn để bắt đầu code ngay, nhưng vẫn có đường mở rộng tốt cho article detail, listing pages, promo campaigns, analytics và workflow editorial chuyên nghiệp hơn về sau.
