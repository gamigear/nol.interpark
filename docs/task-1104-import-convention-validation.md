# Task 1104 — Source-import convention validation against wired homepage/nav paths

## Files touched
1. `src/lib/server/navigation/adapter.ts`
2. `src/lib/server/promos/adapter.ts`
3. `src/lib/server/homepage/adapter.ts`

---

## What was validated
Rà consistency giữa import conventions đã chốt ở task 1092 và read-path/adapters hiện đang wired cho:
- homepage content blocks
- navigation blocks
- promo blocks

Trọng tâm kiểm tra:
- `blockType`
- `key`
- `displayOrder`
- `itemType`
- `overrideJson` field aliases

---

## Mismatch đã phát hiện và đã xử lý

### 1) Navigation adapter phụ thuộc thứ tự mảng, không phụ thuộc `displayOrder`
**Vấn đề**
- `mapNavigationSnapshotToViewModel()` lấy nav block đầu tiên làm primary.
- Nhưng trước patch, block array không được sort theo `displayOrder`.
- Kết quả: importer có thể import đúng `displayOrder` nhưng nếu query trả mảng lệch thứ tự, `header-secondary` có thể bị render thành primary.

**Đã xử lý**
- sort `navBlocks` theo `displayOrder`
- sort `blockItems` theo `displayOrder`

**Tác động**
- Import conventions `header-primary` / `header-secondary` bây giờ ổn định hơn với data thực tế.

---

### 2) Promos adapter phụ thuộc thứ tự mảng, không phụ thuộc `displayOrder`
**Vấn đề**
- `mapPromosSnapshotToViewModel()` lấy promo block đầu tiên làm block chính cho MVP.
- Trước patch không sort blocks/items, nên homepage có thể hiện nhầm promo khi importer ghi nhiều promo blocks.

**Đã xử lý**
- sort promo blocks theo `displayOrder`
- sort promo items theo `displayOrder`

**Tác động**
- Convention `home-promo-strip-*` / placement ordering nay khớp hơn với importer logic.

---

### 3) Homepage adapter chưa tolerant đủ với field aliases từ importer conventions
**Vấn đề**
Import doc task 1092 cho phép các shape thực dụng:
- top picks có thể dùng `description` **hoặc** `subtitle`
- editorial / travel guides có thể dùng `excerpt`, `summary`, hoặc `description`

Trước patch:
- product chỉ đọc `description`
- content chỉ đọc `excerpt` hoặc `summary`

=> importer hoàn toàn hợp lệ theo convention doc nhưng UI có thể rơi vào text rỗng.

**Đã xử lý**
- `mapProductItemRecord()` fallback `subtitle` nếu thiếu `description`
- `mapContentItemRecord()` fallback thêm `description` nếu thiếu `excerpt`/`summary`

**Tác động**
- importer demo linh hoạt hơn, ít lệch UI do alias field nhỏ.

---

## Mismatch còn lại nhưng chưa cần patch lớn

### A. Hero image/settings chưa được read vào homepage hero UI
**Hiện trạng**
- import convention cho phép để hero image/theme trong `settingsJson`
- homepage adapter hiện mới đọc hero text (`title/subtitle`), chưa đọc image/theme

**Ảnh hưởng**
- không làm gãy demo content text
- nhưng hero visual sẽ chưa tận dụng import settings nếu build task sau mong chờ ảnh/theme từ DB

**Khuyến nghị**
- chỉ patch khi demo thực sự cần hero image từ DB; còn không giữ nguyên để tránh mở scope.

---

### B. Footer vẫn là convention-based, chưa có read-path riêng
**Hiện trạng**
- import strategy dùng `nav_highlight` + `footer-*`
- code hiện tại chưa có footer adapter chuyên biệt tương ứng

**Ảnh hưởng**
- không chặn demo homepage/nav/promos chính
- nhưng footer demo data sẽ phụ thuộc implementation task sau nếu muốn render từ DB thật

**Khuyến nghị**
- giữ convention `footer-*` trong importer/doc
- chỉ làm footer read-path nếu footer được đưa vào demo scope thật

---

### C. Navigation adapter chưa phân biệt theo `key`, chỉ dựa vào sorted block order
**Hiện trạng**
- sau patch đã an toàn hơn nhờ sort theo `displayOrder`
- nhưng vẫn chưa explicit kiểu: `header-primary` luôn primary, `header-secondary` luôn secondary

**Ảnh hưởng**
- đủ cho demo nếu importer tuân thủ order
- vẫn có risk nhẹ nếu ai import sai order nhưng đúng key

**Khuyến nghị**
- phase hiện tại chấp nhận được
- nếu muốn cứng hơn, build task sau có thể ưu tiên match theo `key` trước rồi fallback order

---

## Kết luận
Validation cho thấy conventions import từ task 1092 nhìn chung **khớp với wired homepage/navigation/promos paths**, nhưng có 3 điểm lệch nhỏ có thể làm demo hiển thị sai thứ tự hoặc rỗng text. Các điểm đó đã được xử lý bằng patch cực nhỏ trong adapter layer, không đổi schema và không mở rộng read-path lớn.

### Trạng thái sau xử lý
- nav import order: ổn hơn
- promo import order: ổn hơn
- homepage item text aliases: tolerant hơn

### Risk còn lại
- hero visual settings chưa wired
- footer vẫn convention-only
- nav primary/secondary vẫn dựa vào order trước, chưa hard-bind theo key

=> Với patch hiện tại, import demo theo conventions đã chốt sẽ ít khả năng lệch hiển thị hơn đáng kể.
