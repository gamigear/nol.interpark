# Neon Schema MVP — world.nol.com

## Mục tiêu

Thiết kế schema MVP cho **Neon PostgreSQL** đủ chi tiết để có thể bắt đầu code data layer ngay cho `world.nol.com rebuild`, ưu tiên 3 nhu cầu trước mắt:

- render homepage bằng dữ liệu thật
- quản lý content/editorial cơ bản
- có admin input flow tối thiểu trong cùng app Next.js

Phạm vi bản này tập trung vào schema spec thực dụng, không generate migration code. Thiết kế bám theo stack đã chốt: **Next.js App Router + Neon PostgreSQL + Vercel**.

---

## 1) Danh sách bảng cốt lõi đề xuất cho MVP

Nhóm bảng được chia theo 7 cụm:

1. governance / admin
2. locale / localization
3. page composition
4. catalog content
5. editorial content
6. navigation / promo
7. media

### 1.1 Governance / admin

- `admin_users`
- `admin_roles`
- `admin_user_roles`
- `audit_logs`

### 1.2 Locale / localization

- `locales`

### 1.3 Page composition

- `pages`
- `page_localizations`
- `content_blocks`
- `content_block_localizations`
- `content_block_items`

### 1.4 Catalog content

- `catalog_items`
- `catalog_item_localizations`
- `tags`
- `catalog_item_tags`

### 1.5 Editorial content

- `articles`
- `article_localizations`
- `article_related_items`

### 1.6 Navigation / promo

- `navigation_menus`
- `navigation_menu_localizations`
- `navigation_items`
- `navigation_item_localizations`
- `promos`
- `promo_localizations`
- `promo_placements`

### 1.7 Media

- `media_assets`
- `media_asset_localizations`
- `media_usages`

---

## 2) Column chính của từng bảng

Kiểu dữ liệu ghi ở mức gợi ý PostgreSQL thực dụng. Team có thể translate sang Drizzle schema hoặc SQL migration sau đó.

## 2.1 `locales`

Mục đích: danh sách locale được hệ thống hỗ trợ.

| column | type | notes |
|---|---|---|
| id | uuid pk | default gen_random_uuid() |
| code | varchar(10) unique | ví dụ `en`, `ko`, `vi`, `ar` |
| name | varchar(100) | tên hiển thị |
| direction | varchar(3) | `ltr` / `rtl` |
| is_default | boolean | chỉ 1 locale mặc định |
| is_active | boolean | locale có đang dùng không |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 2.2 `admin_users`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| email | citext unique | nên unique case-insensitive |
| name | varchar(150) | |
| avatar_url | text nullable | |
| status | varchar(30) | `active`, `invited`, `disabled` |
| last_login_at | timestamptz nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.3 `admin_roles`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| key | varchar(50) unique | `super_admin`, `editor`, `translator` |
| name | varchar(100) | |
| created_at | timestamptz | |

## 2.4 `admin_user_roles`

| column | type | notes |
|---|---|---|
| user_id | uuid fk | -> `admin_users.id` |
| role_id | uuid fk | -> `admin_roles.id` |
| assigned_at | timestamptz | |

Khóa chính nên là composite `(user_id, role_id)`.

## 2.5 `audit_logs`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| actor_user_id | uuid fk nullable | -> `admin_users.id` |
| entity_type | varchar(50) | `page`, `block`, `catalog_item`, ... |
| entity_id | uuid | id entity bị tác động |
| action | varchar(50) | `create`, `update`, `publish`, `archive` |
| payload_json | jsonb | snapshot ngắn hoặc diff |
| created_at | timestamptz | |

## 2.6 `pages`

MVP nên bắt đầu với mỗi page là một logical page như homepage.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| page_type | varchar(50) | `home`, `landing`, `guide_index` |
| slug | varchar(200) | slug canonical nội bộ |
| status | varchar(30) | `draft`, `published`, `archived` |
| visibility | varchar(30) | `public`, `private_preview` |
| published_at | timestamptz nullable | |
| created_by | uuid fk nullable | -> `admin_users.id` |
| updated_by | uuid fk nullable | -> `admin_users.id` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.7 `page_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| page_id | uuid fk | -> `pages.id` |
| locale_id | uuid fk | -> `locales.id` |
| title | varchar(255) | |
| seo_title | varchar(255) nullable | |
| seo_description | text nullable | |
| canonical_path | varchar(255) | ví dụ `/en`, `/ko` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.8 `content_blocks`

Mỗi block là một section trong page.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| page_id | uuid fk | -> `pages.id` |
| block_type | varchar(50) | `hero`, `featured_catalog`, `editorial_grid`, `promo_banner` |
| key | varchar(100) | key ổn định cho frontend mapping |
| status | varchar(30) | `draft`, `published`, `archived` |
| display_order | integer | thứ tự trong page |
| variant | varchar(50) nullable | style variant UI |
| settings_json | jsonb | config không cần chuẩn hóa sớm |
| visibility_rules_json | jsonb nullable | future use |
| published_at | timestamptz nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.9 `content_block_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| block_id | uuid fk | -> `content_blocks.id` |
| locale_id | uuid fk | -> `locales.id` |
| eyebrow | varchar(150) nullable | |
| title | varchar(255) nullable | |
| subtitle | text nullable | |
| cta_label | varchar(100) nullable | |
| cta_href | varchar(255) nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.10 `content_block_items`

Bảng compose item vào từng block. MVP chấp nhận kiểu polymorphic mềm.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| block_id | uuid fk | -> `content_blocks.id` |
| item_type | varchar(30) | `catalog_item`, `article`, `promo`, `manual_link` |
| item_id | uuid nullable | id entity tương ứng; nullable nếu manual link |
| display_order | integer | |
| override_json | jsonb nullable | override title/image/cta nếu cần |
| created_at | timestamptz | |
| updated_at | timestamptz | |

> Ghi chú: `item_id` không thể gắn FK cứng tới nhiều bảng cùng lúc. MVP nên enforce ở service layer theo `item_type`.

## 2.11 `catalog_items`

Nguồn dữ liệu chung cho ticket/product/activity/experience card.

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| item_kind | varchar(30) | `ticket`, `product`, `activity`, `experience` |
| status | varchar(30) | `draft`, `published`, `archived` |
| slug | varchar(200) | slug mặc định |
| primary_media_id | uuid fk nullable | -> `media_assets.id` |
| default_badge | varchar(80) nullable | |
| price_from_amount | numeric(12,2) nullable | |
| price_currency | char(3) nullable | ISO currency |
| rating_value | numeric(3,2) nullable | |
| rating_count | integer nullable | |
| starts_at | timestamptz nullable | |
| ends_at | timestamptz nullable | |
| venue_name | varchar(150) nullable | |
| city_code | varchar(20) nullable | |
| country_code | varchar(2) nullable | ISO country |
| published_at | timestamptz nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.12 `catalog_item_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| catalog_item_id | uuid fk | -> `catalog_items.id` |
| locale_id | uuid fk | -> `locales.id` |
| title | varchar(255) | |
| short_title | varchar(150) nullable | |
| subtitle | varchar(255) nullable | |
| summary | text nullable | |
| slug_localized | varchar(200) nullable | nếu muốn route locale-specific |
| seo_title | varchar(255) nullable | |
| seo_description | text nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.13 `tags`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| key | varchar(80) unique | ví dụ `k-pop`, `family`, `seoul` |
| name | varchar(120) | name internal hoặc default |
| created_at | timestamptz | |

## 2.14 `catalog_item_tags`

| column | type | notes |
|---|---|---|
| catalog_item_id | uuid fk | -> `catalog_items.id` |
| tag_id | uuid fk | -> `tags.id` |
| created_at | timestamptz | |

Khóa chính composite `(catalog_item_id, tag_id)`.

## 2.15 `articles`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| article_type | varchar(30) | `editorial`, `travel_guide`, `listicle`, `campaign_story` |
| status | varchar(30) | `draft`, `published`, `archived` |
| slug | varchar(200) | slug default |
| hero_media_id | uuid fk nullable | -> `media_assets.id` |
| author_name | varchar(120) nullable | |
| reading_time_minutes | integer nullable | |
| published_at | timestamptz nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.16 `article_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| article_id | uuid fk | -> `articles.id` |
| locale_id | uuid fk | -> `locales.id` |
| title | varchar(255) | |
| excerpt | text nullable | |
| body_richtext_json | jsonb nullable | MVP có thể lưu rich text JSON |
| slug_localized | varchar(200) nullable | |
| seo_title | varchar(255) nullable | |
| seo_description | text nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.17 `article_related_items`

| column | type | notes |
|---|---|---|
| article_id | uuid fk | -> `articles.id` |
| catalog_item_id | uuid fk | -> `catalog_items.id` |
| relation_type | varchar(30) | `featured`, `recommended`, `mentioned` |
| display_order | integer | |
| created_at | timestamptz | |

Khóa chính có thể là `(article_id, catalog_item_id, relation_type)` hoặc thêm `id uuid` nếu muốn mềm hơn.

## 2.18 `navigation_menus`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| menu_key | varchar(80) unique | `header_main`, `footer_primary` |
| status | varchar(30) | `draft`, `published` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.19 `navigation_menu_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| menu_id | uuid fk | -> `navigation_menus.id` |
| locale_id | uuid fk | -> `locales.id` |
| title | varchar(150) nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.20 `navigation_items`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| menu_id | uuid fk | -> `navigation_menus.id` |
| parent_item_id | uuid fk nullable | self-reference `navigation_items.id` |
| item_type | varchar(20) | `internal`, `external`, `article`, `catalog`, `page` |
| target_entity_type | varchar(30) nullable | |
| target_entity_id | uuid nullable | |
| href | varchar(255) nullable | external/manual href |
| display_order | integer | |
| opens_in_new_tab | boolean | |
| is_highlighted | boolean | |
| icon_key | varchar(80) nullable | |
| visibility_rules_json | jsonb nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.21 `navigation_item_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| navigation_item_id | uuid fk | -> `navigation_items.id` |
| locale_id | uuid fk | -> `locales.id` |
| label | varchar(150) | |
| description | varchar(255) nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.22 `promos`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| promo_type | varchar(30) | `banner`, `strip`, `campaign_card`, `hero_slide` |
| status | varchar(30) | `draft`, `scheduled`, `published`, `archived` |
| start_at | timestamptz nullable | |
| end_at | timestamptz nullable | |
| priority | integer | dùng resolve nhiều promo cùng placement |
| media_id | uuid fk nullable | -> `media_assets.id` |
| background_color | varchar(20) nullable | |
| tracking_key | varchar(100) nullable | |
| published_at | timestamptz nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.23 `promo_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| promo_id | uuid fk | -> `promos.id` |
| locale_id | uuid fk | -> `locales.id` |
| title | varchar(255) nullable | |
| subtitle | text nullable | |
| cta_label | varchar(100) nullable | |
| cta_href | varchar(255) nullable | |
| alt_text | varchar(255) nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.24 `promo_placements`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| promo_id | uuid fk | -> `promos.id` |
| placement_key | varchar(80) | `home_hero`, `home_mid_strip` |
| page_id | uuid fk nullable | -> `pages.id` |
| display_order | integer | |
| created_at | timestamptz | |

## 2.25 `media_assets`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| storage_provider | varchar(30) | `vercel_blob`, `s3`, `cloudinary` |
| storage_key | text | key/path trong storage |
| public_url | text | |
| mime_type | varchar(100) | |
| width | integer nullable | |
| height | integer nullable | |
| size_bytes | bigint nullable | |
| alt_fallback | varchar(255) nullable | |
| focal_x | numeric(5,2) nullable | 0-100 |
| focal_y | numeric(5,2) nullable | 0-100 |
| uploaded_by | uuid fk nullable | -> `admin_users.id` |
| created_at | timestamptz | |

## 2.26 `media_asset_localizations`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| media_asset_id | uuid fk | -> `media_assets.id` |
| locale_id | uuid fk | -> `locales.id` |
| alt_text | varchar(255) nullable | |
| caption | text nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## 2.27 `media_usages`

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| media_asset_id | uuid fk | -> `media_assets.id` |
| entity_type | varchar(30) | `catalog_item`, `article`, `promo`, `page_block` |
| entity_id | uuid | |
| field_name | varchar(80) | `hero_media_id`, `primary_media_id`, ... |
| created_at | timestamptz | |

---

## 3) Quan hệ khóa ngoại cốt lõi

## 3.1 Quan hệ admin / governance

- `admin_user_roles.user_id -> admin_users.id`
- `admin_user_roles.role_id -> admin_roles.id`
- `audit_logs.actor_user_id -> admin_users.id`
- `pages.created_by -> admin_users.id`
- `pages.updated_by -> admin_users.id`
- `media_assets.uploaded_by -> admin_users.id`

## 3.2 Quan hệ localization

- `page_localizations.page_id -> pages.id`
- `page_localizations.locale_id -> locales.id`
- `content_block_localizations.block_id -> content_blocks.id`
- `content_block_localizations.locale_id -> locales.id`
- `catalog_item_localizations.catalog_item_id -> catalog_items.id`
- `catalog_item_localizations.locale_id -> locales.id`
- `article_localizations.article_id -> articles.id`
- `article_localizations.locale_id -> locales.id`
- `navigation_menu_localizations.menu_id -> navigation_menus.id`
- `navigation_menu_localizations.locale_id -> locales.id`
- `navigation_item_localizations.navigation_item_id -> navigation_items.id`
- `navigation_item_localizations.locale_id -> locales.id`
- `promo_localizations.promo_id -> promos.id`
- `promo_localizations.locale_id -> locales.id`
- `media_asset_localizations.media_asset_id -> media_assets.id`
- `media_asset_localizations.locale_id -> locales.id`

## 3.3 Quan hệ page composition

- `content_blocks.page_id -> pages.id`
- `content_block_items.block_id -> content_blocks.id`
- `promo_placements.page_id -> pages.id` (nullable)

## 3.4 Quan hệ catalog / editorial

- `catalog_items.primary_media_id -> media_assets.id`
- `catalog_item_tags.catalog_item_id -> catalog_items.id`
- `catalog_item_tags.tag_id -> tags.id`
- `articles.hero_media_id -> media_assets.id`
- `article_related_items.article_id -> articles.id`
- `article_related_items.catalog_item_id -> catalog_items.id`

## 3.5 Quan hệ navigation

- `navigation_items.menu_id -> navigation_menus.id`
- `navigation_items.parent_item_id -> navigation_items.id`

## 3.6 Quan hệ promo / media

- `promos.media_id -> media_assets.id`
- `promo_placements.promo_id -> promos.id`
- `media_usages.media_asset_id -> media_assets.id`

### Ghi chú quan trọng về `content_block_items`

Đây là điểm duy nhất schema MVP chủ động **không dùng FK cứng** cho `item_id` vì cần hỗ trợ nhiều kiểu entity.

Khuyến nghị MVP:
- enforce bằng validation ở service layer / admin form
- chỉ cho phép các `item_type` đã whitelist
- query layer resolve theo batch từng loại (`catalog_item`, `article`, `promo`)

Nếu sau này cần chặt hơn, có thể tách thành:
- `content_block_catalog_items`
- `content_block_article_items`
- `content_block_promo_items`

---

## 4) Chỉ mục / index nên có

MVP nên index theo query shape thật của homepage và admin list view, tránh index quá tay.

## 4.1 Unique constraints bắt buộc

- `locales(code)` unique
- `admin_users(email)` unique
- `admin_roles(key)` unique
- `navigation_menus(menu_key)` unique
- `tags(key)` unique
- `admin_user_roles(user_id, role_id)` primary/unique
- `catalog_item_tags(catalog_item_id, tag_id)` primary/unique
- `page_localizations(page_id, locale_id)` unique
- `content_block_localizations(block_id, locale_id)` unique
- `catalog_item_localizations(catalog_item_id, locale_id)` unique
- `article_localizations(article_id, locale_id)` unique
- `navigation_menu_localizations(menu_id, locale_id)` unique
- `navigation_item_localizations(navigation_item_id, locale_id)` unique
- `promo_localizations(promo_id, locale_id)` unique
- `media_asset_localizations(media_asset_id, locale_id)` unique

## 4.2 Index cho homepage query

- `pages(page_type, status)`
- `content_blocks(page_id, status, display_order)`
- `content_block_items(block_id, display_order)`
- `promos(status, start_at, end_at)`
- `promo_placements(placement_key, page_id, display_order)`

## 4.3 Index cho catalog / article query

- `catalog_items(status, item_kind, published_at desc)`
- `catalog_items(primary_media_id)`
- `articles(status, article_type, published_at desc)`
- `articles(hero_media_id)`
- `article_related_items(article_id, display_order)`
- `catalog_item_tags(tag_id, catalog_item_id)`

## 4.4 Index cho navigation

- `navigation_items(menu_id, parent_item_id, display_order)`
- `navigation_items(target_entity_type, target_entity_id)`

## 4.5 Index cho localization lookup

Ngoài unique composite, có thể thêm index phụ nếu team query nhiều theo locale:

- `page_localizations(locale_id)`
- `content_block_localizations(locale_id)`
- `catalog_item_localizations(locale_id)`
- `article_localizations(locale_id)`
- `navigation_item_localizations(locale_id)`
- `promo_localizations(locale_id)`

## 4.6 Index cho admin / audit

- `audit_logs(entity_type, entity_id, created_at desc)`
- `audit_logs(actor_user_id, created_at desc)`
- `media_usages(media_asset_id)`
- `media_usages(entity_type, entity_id)`

---

## 5) Chiến lược localization

## 5.1 Chọn mô hình: base table + localization table

MVP nên dùng chiến lược:

- bảng base chứa dữ liệu canonical, không phụ thuộc locale
- bảng `*_localizations` chứa text/SEO/path theo locale

Lý do:
- tránh duplicate record toàn entity cho mỗi ngôn ngữ
- dễ publish cùng một object ở nhiều locale
- hợp với homepage composition và admin workflow
- dễ fallback về default locale nếu bản dịch chưa đủ

## 5.2 Phân tách field nào nên localize

### Localize
- title
- subtitle
- summary / excerpt
- SEO title / description
- CTA label
- alt text / caption
- localized slug nếu cần route riêng theo ngôn ngữ

### Không cần localize ở base table
- status
- display order
- media relation
- date/time logic
- pricing chuẩn
- tracking key
- structural type / variant

## 5.3 Fallback strategy

Đề xuất thứ tự fallback khi render public page:

1. lấy localization theo locale requested
2. nếu thiếu, fallback về locale mặc định (`locales.is_default = true`)
3. nếu vẫn thiếu field critical, entity không được đưa vào payload published

Ví dụ:
- block có thể vẫn render nếu thiếu subtitle nhưng có title
- catalog item không nên render public nếu thiếu title ở locale requested và locale default

## 5.4 Canonical path và localized slug

- `pages.canonical_path` nằm ở `page_localizations`
- `catalog_items.slug` và `articles.slug` là slug default internal
- `slug_localized` nullable để hỗ trợ route locale-specific về sau

MVP chưa bắt buộc dùng localized slug cho mọi entity, nhưng nên chuẩn bị sẵn column để không phải migration sớm.

---

## 6) Publish state / versioning tối thiểu

## 6.1 Publish state đề xuất

Để MVP gọn mà vẫn đủ vận hành, dùng state machine tối thiểu:

- `draft`
- `scheduled` (chỉ cần cho promo và future content nếu muốn)
- `published`
- `archived`

Áp dụng:
- `pages`
- `content_blocks`
- `catalog_items`
- `articles`
- `promos`
- `navigation_menus`

Nếu muốn giữ cực gọn ở phase đầu, `navigation_menus` có thể chỉ dùng `draft/published`.

## 6.2 Publish rule cho public rendering

Một entity được query vào public payload khi:

- `status = 'published'`
- `published_at is not null` nếu bảng có column này
- với promo: nằm trong khoảng `start_at/end_at` nếu có khai báo
- có đủ localization tối thiểu cho locale requested hoặc locale default

## 6.3 Versioning tối thiểu cho MVP

MVP **không cần** dựng hệ thống revision table đầy đủ ngay.

Thay vào đó:
- giữ 1 row active hiện tại cho mỗi entity
- log mutation quan trọng vào `audit_logs`
- dùng `updated_at`, `updated_by`, `published_at` để truy vết cơ bản

Đây là mức vừa đủ để ship nhanh.

## 6.4 Khi nào cần nâng cấp versioning

Sau MVP, nếu editorial workflow phức tạp hơn, cân nhắc thêm:
- `page_revisions`
- `content_block_revisions`
- `article_revisions`
- snapshot JSON của homepage payload

Nhưng hiện tại chưa cần, vì sẽ tăng đáng kể độ phức tạp mutation và preview.

---

## 7) Seed plan để homepage render được dữ liệu thật

Mục tiêu seed là sau khi implement query layer, homepage có thể lên dữ liệu thật thay cho mock data.

## 7.1 Seed thứ tự đề xuất

### Bước 1: locale

Seed `locales`:
- `en` — default, active
- `ko` — active
- có thể thêm `vi` hoặc `ar` sau nếu cần

### Bước 2: admin tối thiểu

Seed:
- 1 `super_admin`
- 1 `editor`
- mapping qua `admin_roles` + `admin_user_roles`

### Bước 3: media assets

Seed khoảng:
- 6–10 ảnh card catalog
- 3–4 ảnh article/guide
- 2–3 ảnh promo/banner

Mỗi asset nên có:
- `public_url`
- dimension thật
- alt fallback cơ bản

### Bước 4: homepage page record

Seed `pages`:
- 1 row `page_type = 'home'`, `slug = 'home'`, `status = 'published'`

Seed `page_localizations`:
- `/en`
- `/ko`
- title + SEO tối thiểu

### Bước 5: homepage blocks

Seed `content_blocks` cho homepage, ví dụ:
- `hero-main`
- `featured-tickets`
- `top-experiences`
- `travel-guides`
- `mid-page-promo`

Mỗi block có:
- `key`
- `block_type`
- `display_order`
- `status = 'published'`
- `settings_json` tối thiểu nếu cần số item hoặc style variant

Seed `content_block_localizations` cho `en` và `ko`.

### Bước 6: catalog items

Seed 8–12 `catalog_items` đủ để lấp các section card.

Ví dụ nhóm dữ liệu:
- concert tickets
- attraction passes
- city experiences
- seasonal events

Mỗi item cần tối thiểu:
- `item_kind`
- `status = 'published'`
- `primary_media_id`
- `price_from_amount`
- `price_currency`
- `venue_name` / `city_code`
- `published_at`

Seed `catalog_item_localizations` cho ít nhất locale default `en`, và 3–5 item có thêm `ko` để test fallback mixed.

### Bước 7: articles

Seed 3–4 `articles` loại:
- `travel_guide`
- `editorial`

Mỗi article nên có:
- hero image
- title / excerpt
- body JSON ngắn
- published state

### Bước 8: block-item composition

Seed `content_block_items`:
- hero block -> 1 promo hoặc 1 manual item tùy UI
- featured tickets -> 4–6 `catalog_item`
- top experiences -> 4–6 `catalog_item`
- travel guides -> 3–4 `article`
- promo block -> 1 `promo`

### Bước 9: navigation

Seed `navigation_menus`:
- `header_main`
- `footer_primary`

Seed `navigation_items` cho:
- Tickets
- Experiences
- Travel Guides
- Promotions
- Contact / About

### Bước 10: promos

Seed 2–3 `promos`:
- 1 hero slide
- 1 mid-page strip
- 1 campaign card dự phòng

Kèm `promo_localizations` và `promo_placements`.

## 7.2 Seed completeness rule

Homepage chỉ cần query ổn nếu có tối thiểu:
- 1 homepage page published
- 4–5 content blocks published
- 8 item cards published
- 3 article cards published
- 1 menu header
- 1 promo active
- media đầy đủ cho mọi card nhìn thấy trên trang

## 7.3 Seed output shape nên phục vụ query layer

Sau seed, service `getHomePageData(locale)` nên assemble được:

- page metadata
- ordered blocks
- localized block headings
- resolved block items theo type
- navigation header/footer
- active promos theo placement

Nghĩa là seed không chỉ “có data”, mà phải cover đúng các join/query thật mà homepage sẽ dùng.

---

## 8) Quyết định triển khai thực chiến cho Neon / Vercel

## 8.1 Connection strategy

- App runtime trên Vercel nên dùng **pooled connection string** cho query thường
- Direct connection chỉ nên dùng cho migration / admin tooling cần session ổn định

## 8.2 Schema rollout strategy

- Ưu tiên migration additive
- Chưa làm destructive change sớm
- Tạo index sau khi có bảng cốt lõi nếu cần chia migration để giảm rủi ro

## 8.3 Query strategy cho homepage

MVP chưa cần materialized view.

Nên bắt đầu bằng:
- query `pages` + `page_localizations`
- query `content_blocks` + `content_block_localizations`
- query `content_block_items`
- batch resolve `catalog_items`, `articles`, `promos`
- batch load media và localization tương ứng

Khi traffic hoặc query depth tăng, mới cân nhắc read model riêng.

---

## 9) Scope tối thiểu đủ để code ngay sau tài liệu này

Nếu team muốn bắt tay vào code ngay, mình đề xuất triển khai theo thứ tự:

1. tạo schema cho `locales`, `pages`, `page_localizations`
2. tạo `content_blocks`, `content_block_localizations`, `content_block_items`
3. tạo `media_assets`, `catalog_items`, `catalog_item_localizations`
4. tạo `articles`, `article_localizations`
5. tạo `navigation_*`, `promos_*`
6. seed dữ liệu homepage tối thiểu
7. viết query `getHomePageData(locale)`
8. sau đó mới nối admin CRUD screens

---

## 10) Kết luận

Schema MVP đề xuất ở trên đủ để:

- render homepage thật bằng dữ liệu từ Neon
- quản lý nội dung homepage theo kiểu section/block động
- lưu catalog cards, article cards, menu, promo và media
- hỗ trợ localization theo hướng bền vững
- có publish state tối thiểu để admin vận hành
- giữ cấu trúc đủ gọn để implement nhanh trong App Router + Vercel

Điểm thực dụng nhất của bản MVP này là:
- **chuẩn hóa những gì cần chuẩn hóa**: pages, blocks, items, localization, media
- **giữ mềm những gì chưa cần đóng cứng**: `content_block_items.item_type/item_id`, `settings_json`, `override_json`
- **đủ chi tiết để code ngay**, nhưng chưa kéo team vào complexity của revisioning hoặc CMS quá nặng.
