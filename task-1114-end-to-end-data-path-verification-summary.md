# Task 1114 — End-to-end data-path verification after import-demo batch

## Scope
Verification pass cho các đường dữ liệu public chính sau import batch:
- homepage
- navigation
- promos
- footer/basic public shell

Mục tiêu: xác nhận chúng bám conventions mới (`blockType`, `key`, locale/fallback behavior), và vá mismatch nhỏ nếu có.

---

## Files touched
### Modified
1. `src/lib/server/navigation/repository-db.ts`
2. `src/lib/server/navigation/query.ts`
3. `src/lib/server/navigation/admin-form.ts`
4. `src/lib/server/navigation/admin-read.ts`

---

## What was wrong
### Real mismatch found
Navigation/public shell path đang có một lỗi data-path thật:
- `getPublicShellData(lang)` là locale-aware ở level route/layout
- nhưng repository `fetchNavigationBlocks()` trước đó lại lấy **mọi localization rows** cho các `nav_highlight` blocks
- hệ quả: header/footer có thể ăn nhầm localization row từ import batch, đặc biệt khi có cả `en` + locale khác trong cùng block set

Nói ngắn: public shell muốn locale-specific render, nhưng repository lại trả blob localization không constrained theo locale.

Đây là mismatch thật, không phải cosmetic.

---

## Fixes applied
### 1) `src/lib/server/navigation/repository-db.ts`
Đã mở rộng repository để hỗ trợ cả 2 mode:
- **legacy/admin-compatible**: gọi với `intent` như cũ
- **locale-aware public shell**: gọi với `locale + intent`

Behavior mới:
- nếu có locale hợp lệ (`en` / `ar`) thì query `content_block_localizations` theo:
  - locale requested
  - plus fallback `en`
- nếu không truyền locale thì giữ behavior cũ cho admin/read paths

Điểm chính:
- public shell giờ có localization set sạch hơn, đúng với import conventions mới
- admin path không bị phá backward compatibility

---

### 2) `src/lib/server/navigation/query.ts`
Đã đổi public shell read path từ:
- `fetchNavigationBlocks('runtime')`

sang:
- `fetchNavigationBlocks(resolvedLocale, 'runtime')`

Tức là header/footer shell giờ thực sự fetch theo locale route hiện tại.

---

### 3) `src/lib/server/navigation/admin-form.ts`
Đã update admin form read path để:
- nếu locale là public chrome locale → dùng locale-aware fetch
- nếu locale không phải public chrome locale → normalize qua `resolveHomePageLocale(locale)`
- vẫn giữ intent runtime/tooling như cũ

Điều này làm admin navigation editor đọc localization nhất quán hơn với conventions import-demo hiện tại.

---

### 4) `src/lib/server/navigation/admin-read.ts`
Đã update admin summary read path theo cùng nguyên tắc locale-aware/backward-compatible.

Ngoài ra còn giữ compatibility với signature cũ kiểu:
- `getNavigationAdminSummary('runtime')`

và hỗ trợ style mới:
- `getNavigationAdminSummary('en', 'runtime')`

---

## Data-path status by surface
## 1) Homepage
**Status: PASS**

### Current behavior
- Hero + core sections dùng homepage repository/adapter theo conventions mới
- `topPicks` đã tách khỏi navigation semantics trước đó
- fallback seed/db-like path vẫn usable

### Notes
- homepage core data-path hiện không thấy mismatch mới trong pass này
- vẫn có fallback khi DB/import chưa đủ, nhưng đó là intentional

### Still fallback when
- không có homepage page/block phù hợp trong DB
- query DB lỗi
- section block có nhưng thiếu items usable

---

## 2) Navigation / Header
**Status: PASS AFTER FIX**

### Before fix
- locale route không đảm bảo locale-specific localization cho header data
- có risk render sai label/title/subtitle khi import batch chứa nhiều locale rows

### After fix
- public shell fetch navigation theo locale thật
- fallback `en` rõ ràng
- header brand / nav labels / secondary actions nhất quán hơn với import conventions

### Still fallback when
- không có `header-primary` / `header-secondary` usable
- shell mapper không tìm ra đủ groups/notes → sẽ fallback shell data

---

## 3) Promos
**Status: PASS**

### Current behavior
- promo repository đã locale-aware ở localization query
- promo query có safe fallback `undefined`
- homepage chỉ render promo section khi có data usable

### Still fallback when
- không có promo block published
- DB lỗi/query lỗi → promo slot bị omit an toàn

---

## 4) Footer / basic shell
**Status: PASS AFTER FIX**

### Current behavior
- footer groups lấy từ `nav_highlight` blocks key `footer-*`
- footer legal/note đọc từ `footer-legal`
- brand/title/subtitle có thể lấy từ `header-brand`
- locale-specific localization giờ đã được constrain tốt hơn qua navigation repository mới

### Still fallback when
- không có footer groups usable
- không có footer note/legal row usable
- shell mapper không tìm ra đủ shell data → dùng fallback shell

---

## What is still intentionally fallback-driven
Những phần dưới đây **chưa phải fail**, mà là fallback behavior đang tồn tại hợp lý cho demo/import phase:

1. **Public shell fallback data**
   - nếu navigation/footer import chưa đủ block keys (`header-primary`, `header-secondary`, `footer-*`, `footer-legal`) thì shell vẫn dùng fallback copy/nav

2. **Homepage fallback seed/db-like records**
   - nếu import homepage chưa đầy đủ hoặc DB query fail

3. **Promo omission fallback**
   - không có promo usable thì homepage không crash, chỉ không render promo section

---

## Final judgment
## DATA-PATH STATUS: PASS

### Why pass
- homepage path nhất quán với conventions mới
- promo path locale-aware + safe fallback
- navigation/header/footer shell mismatch quan trọng nhất đã được phát hiện và vá
- admin navigation read paths cũng được sync lại để tránh behavior lệch giữa admin/public

### Important nuance
Pass ở đây nghĩa là:
- code/data-path hiện **nhất quán hơn với import conventions mới**
- các fallback còn lại là **intentional** và không phải blocker code-level

Không có blocker code mới nào còn sót thấy được trong 4 surface đã rà.

---

## Short conclusion
Mismatch đáng kể duy nhất trong pass này là navigation shell chưa locale-aware ở repository layer, khiến header/footer có nguy cơ render sai localization sau import batch. Đã vá tận gốc ở repository + public shell query, và kéo admin read/form path theo cùng convention để tránh lệch behavior. Sau fix này, homepage/navigation/promos/footer-basic shell đều ở trạng thái pass; phần còn fallback chủ yếu là fallback dữ liệu chứ không còn là mismatch code-path nguy hiểm.
