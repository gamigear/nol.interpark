# Task 1100 — Shortest import strategy from source site into demo content layer

## Chốt một câu
**Ngắn nhất và an toàn nhất:** làm **one-shot importer** theo flow

`source site -> extracted JSON snapshot -> normalized demo payload -> upsert vào page/page_localization/content_block/content_block_localization/content_block_item`

Không sync realtime, không mở schema mới, không normalize sâu sang ticket/product/article ở phase demo.

---

## Strategy usable ngay

### 1) Chọn import mode: snapshot, không crawler phức tạp
Làm importer kiểu **snapshot pull một lần / rerun thủ công** cho homepage demo.

**Vì sao đây là đường ngắn nhất:**
- Demo chỉ cần data đủ thật để trình diễn, không cần hệ ingest dài hạn.
- Codebase hiện tại đã đọc được từ content block layer/admin form layer.
- Snapshot dễ kiểm tra, rerun được, rollback được.
- Tránh complexity của scheduler, diff sync, queue, entity reconciliation.

**Không làm ở phase demo:**
- cron sync từ source site
- HTML crawl toàn site nhiều tầng
- normalize đầy đủ sang catalog/article source tables
- media ingestion pipeline riêng

---

### 2) Import pipeline tối thiểu: 2 phase
Nên tách rất nhẹ thành 2 phase, nhưng vẫn là **một command/use-case**.

#### Phase A — Extract + normalize
Input:
- homepage source HTML/JSON từ world.nol.com
- optional subpages nếu cần nav/footer rõ hơn

Output:
- một file/object JSON chuẩn hóa theo demo payload, ví dụ:
  - `page`
  - `pageLocalization`
  - `blocks[]`
  - `blockLocalizations[]`
  - `blockItems[]`

Mục tiêu phase này:
- bóc được đúng các slice cần demo:
  - hero
  - featured tickets
  - top picks
  - editorial
  - travel guides
  - header primary/secondary
  - promo strip
  - footer links
- gán luôn synthetic ids, keys, display order, itemType, overrideJson

#### Phase B — Persist/upsert
Input:
- normalized payload từ phase A

Output:
- DB/content layer demo đã usable ngay cho public/admin read path

Mục tiêu phase này:
- upsert page/page_localization
- replace-or-upsert blocks theo `pageId + key`
- replace-or-upsert block localizations theo `blockId + locale`
- replace block items theo `blockId` để rerun idempotent

**Lý do tách 2 phase dù muốn ít bước:**
- debug nhanh khi extract sai
- có thể chụp payload review trước khi write DB
- ít rủi ro hơn so với scrape xong write thẳng DB không quan sát được

---

## Đề xuất import path cụ thể cho build task sau

### Option nên chọn: script/importer nội bộ chạy thủ công
Flow:
1. Fetch source homepage
2. Parse các slice cần demo
3. Build normalized payload theo schema/content conventions
4. Ghi payload ra file JSON snapshot để inspect
5. Upsert payload vào DB demo content layer
6. Rerun nếu cần refresh

**Đây là option nên làm.**

### Vì sao không nên làm cách khác

#### Không nên: nhập tay qua admin UI
- ít code hơn trước mắt nhưng rất chậm
- dễ lệch data với site gốc
- khó rerun/reset demo
- không scale cho nhiều locale/shelves

#### Không nên: đổ thẳng raw scraped HTML vào DB
- read layer hiện tại không dùng raw HTML
- khó debug
- khó ổn định field shape

#### Không nên: dựng source entities đầy đủ trước
- sạch về kiến trúc nhưng dài đường
- phát sinh schema/model/query mới
- không hợp mục tiêu demo nhanh

---

## Persistence strategy ngắn nhất

### 1) Upsert root page trước
Tạo/ghi đè:
- `page(id=home-{locale})`
- `page_localization(pageId, localeCode)`

### 2) Upsert blocks theo key convention
Tạo các block chính:
- `home-hero`
- `featured-tickets`
- `top-picks`
- `editorial`
- `travel-guides`
- `header-primary`
- `header-secondary`
- `home-promo-strip-1`
- `footer-*`

### 3) Replace block items theo block
Đây là điểm quan trọng để importer ngắn và ít bug:
- với mỗi block, **xóa/replace toàn bộ item cũ của block đó rồi insert lại theo snapshot mới**
- không cần merge từng item cho phase demo

**Vì sao nên replace thay vì diff:**
- source site có thể reorder
- importer demo cần deterministic
- ít logic hơn, ít bug hơn

### 4) Idempotent by key
- page stable theo `home-{locale}`
- block stable theo `pageId + key`
- items stable theo order + synthetic `itemId`

=> rerun cùng source sẽ ra cùng kết quả.

---

## Scope import nên giữ thật nhỏ
Chỉ import những gì public code hiện đã dùng hoặc sắp demo:

### Must-have
- homepage hero
- featured tickets
- top picks
- editorial
- travel guides
- header primary links
- secondary nav nếu đang hiện
- promo strip/banner giữa homepage
- footer columns cơ bản
- canonical/seo title/description tối thiểu

### Nice-to-have nếu rất dễ lấy
- locale switch links
- promo theme
- hero image/mobile image
- block subtitle/eyebrow

### Bỏ qua ở phase demo
- deep article bodies
- detailed ticket metadata ngoài card
- category taxonomy chuẩn hóa
- campaign scheduling thật
- image asset ingestion vào media library riêng
- broken-link validation tự động

---

## Dữ liệu nên lưu ở đâu trong repo/process

### 1) Snapshot file để review
Nên lưu 1 normalized JSON snapshot tạm thời trong workspace/team docs hoặc tmp, ví dụ:
- `tmp/demo-import-home-en.json`

Mục đích:
- diff trước/sau import
- debug parser
- review với lead nếu source mapping sai

### 2) Importer nên chạy như tooling/manual command
Không nhét vào request path, không chạy trong admin page submit.

Mục tiêu:
- dev chủ động chạy
- dễ reset DB rồi import lại
- không coupling với UI admin

---

## Recommendation cho implementation task phía sau

### Build task 1 — extractor/normalizer
Viết một importer nhỏ chỉ biết:
- fetch source page
- parse đúng 8–10 slices cần demo
- output normalized payload đúng conventions của task 1092

### Build task 2 — persistence adapter
Viết adapter nhận normalized payload và upsert vào:
- `page`
- `page_localization`
- `content_block`
- `content_block_localization`
- `content_block_item`

### Build task 3 — smoke verify
Sau import:
- mở homepage public
- mở admin homepage/navigation/promos
- confirm data hiện ra đúng

Đây là chuỗi ngắn nhất để có end-to-end demo thật.

---

## Rủi ro ngắn + cách giảm

### Rủi ro 1: source DOM/site thay đổi nhẹ
**Giảm:** parser chỉ target đúng homepage/demo slices, không generic quá.

### Rủi ro 2: shape import không khớp read layer hiện tại
**Giảm:** normalize theo đúng `overrideJson` conventions đã chốt ở task 1092, không tự nghĩ field mới.

### Rủi ro 3: rerun bị duplicate block/item
**Giảm:** upsert bằng stable page/block keys + replace items by block.

### Rủi ro 4: mất thời gian vì normalize sâu quá mức
**Giảm:** store card-level fields trực tiếp trong `overrideJson`, postpone domain tables.

### Rủi ro 5: footer/nav placement lẫn nhau
**Giảm:** chốt key convention ngay từ đầu (`header-*`, `footer-*`, `home-promo-*`).

---

## Chốt recommendation
Nếu mục tiêu là **demo usable nhanh nhất với rủi ro thấp nhất**, hãy làm như sau:

1. **Manual one-shot import**, không sync tự động.
2. **Extract homepage slices cần demo từ source site**.
3. **Normalize ngay về payload bám schema hiện có**.
4. **Upsert trực tiếp vào content layer hiện tại**.
5. **Rerun bằng replace semantics theo block** khi cần refresh.

Nói ngắn gọn: **đừng xây data platform cho demo**. Chỉ cần một importer snapshot-to-content-layer đủ deterministic để public route + admin route đều đọc được ngay.
