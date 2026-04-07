# Task 1149 — Public footer completion and parity

## Files touched
1. `src/lib/server/navigation/query.ts`
2. `src/components/layout/site-footer.tsx`

---

## Footer parts completed

### 1) Footer groups structure
Hoàn thiện public footer để hỗ trợ rõ các nhóm:
- explore
- info/about
- support
- social
- legal

Thay đổi chính:
- thêm `kind` vào `PublicShellFooterGroup`
- footer groups từ DB giờ được suy luận `kind` từ `footer-*` key convention
- render có thể phân biệt legal row với các group chính

### 2) Footer ordering/parity behavior
Hoàn thiện ordering cho footer groups theo key convention thay vì phụ thuộc hoàn toàn vào raw block order.

Ưu tiên hiện tại:
1. explore
2. info/about
3. support
4. social
5. legal

Điều này giúp footer public ổn định hơn nếu importer/DB có nhiều `footer-*` blocks.

### 3) Localized fallback footer
Fallback footer trước đó quá mỏng, chỉ có 1 group `Explore`.

Đã mở rộng fallback usable hơn cho cả `en` và `ar` với các nhóm:
- `Explore`
- `Support`
- `Legal`

Fallback labels hiện đã localized.

### 4) Footer note / legal note behavior
`footer-legal` hiện tiếp tục được dùng làm nguồn cho `footerNote`:
- ưu tiên `subtitle`
- fallback sang `title`

Điều này giữ behavior cũ nhưng rõ ràng hơn trong shell logic.

### 5) Public footer rendering
`SiteFooter` đã được hoàn thiện theo layout/parity hợp lý hơn:
- cột trái: brand + brand subtitle + note
- cột phải: footer groups chính
- hàng dưới riêng cho legal links

Kết quả:
- footer đọc rõ hơn
- gần với kỳ vọng public footer hơn mức shell tối giản trước đó
- legal links không lẫn với support/info groups

---

## Practical parity outcome
Footer public hiện đã đạt mức parity hợp lý cho demo:
- có grouping rõ ràng
- có legal/support/info behavior rõ hơn
- có localized fallback usable
- có ordering ổn định theo convention
- có render structure giống footer public thực thụ hơn thay vì note + list đơn giản

---

## Remaining limitations
- Chưa có schema/footer read-path riêng; vẫn dựa trên `nav_highlight` + `footer-*` conventions
- Footer richness vẫn chưa full source-site parity (social/legal/support depth còn phụ thuộc data import)
- Styling hiện vẫn pragmatic, chưa phải pixel-perfect source clone

=> Nhưng trong scope public demo, footer đã đủ complete và ổn định hơn đáng kể.
