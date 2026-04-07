# Task 1140 — Public demo parity target

## Chốt target
Public demo **không nhắm full source-site parity**.
Target đúng là:

> **Strong parity on demo-critical backbone, approximate parity on presentation-rich/long-tail slices.**

Tức là bản rebuild phải làm người xem nhận ra đúng “cùng homepage/public experience family” với world.nol, nhưng không cần clone toàn bộ độ dày module hay campaign richness của site gốc.

---

## 1) Slice cần bám sát cho public demo
Đây là các phần nên coi là **must-match enough**.

### A. Homepage backbone / section lineup
Cần giữ đúng backbone theo site gốc ở mức demo:
- header/nav shell
- hero presence
- This Week’s Top Tickets
- K-POP Fans Top Picks
- promo/banner strip
- product/region shelf kiểu Busan
- editorial/K-food style shelf
- Travel Guides
- footer shell

**Target:**
- đúng thứ tự/hierarchy lớn
- đúng family của từng shelf
- đúng cảm giác “homepage composition” của source

### B. Content family + card semantics
Các shelf phải hiển thị đúng loại nội dung:
- ticket shelf trông và đọc như ticket shelf
- product/activity shelf trông như curated merch/product shelf
- editorial/travel guide shelf trông như article/content shelf
- promo strip trông như marketing interruption hợp lý

**Target:**
- không lẫn type
- title/meta/image/CTA bám logic source
- source-backed content đọc lên hợp lý khi show demo

### C. Navigation/footer data wiring
Cần chứng minh public shell đã nối được vào content layer:
- header primary links usable
- secondary action(s) usable
- footer groups/links usable
- fallback/DB-backed behavior ổn định

**Target:**
- shell hoạt động thật
- không vỡ order
- không lộ mismatch rõ kiểu secondary lên primary, footer link sai nhóm, promo sai order

### D. Demo-visible ordering/parity correctness
Những gì importer đẩy vào thì public phải ra đúng:
- block order
- item order
- promo order
- text field mapping đủ đúng để không bị rỗng/nhầm loại

**Target:**
- parity ở mức data/render correctness quan trọng hơn pixel-perfect

---

## 2) Slice chỉ cần gần đúng cho demo
Đây là các phần **không cần source-faithful hoàn toàn** ở phase demo.

### A. Hero richness
Site gốc có hero/campaign carousel giàu visual hơn nhiều.

**Demo target:**
- có hero rõ ràng
- copy/hierarchy đúng vai trò
- không cần clone full carousel/campaign system

### B. Header chrome richness
Site gốc có account/utilities/polish phong phú hơn.

**Demo target:**
- brand đúng hướng
- primary nav + action area usable
- không cần đầy đủ mọi affordance/account chrome như source

### C. Footer depth
Site gốc có footer IA sâu hơn.

**Demo target:**
- có footer shell + vài nhóm link hợp lý
- không cần parity đầy đủ legal/social/info architecture sâu

### D. Extra homepage modules / seasonal shelves
Site gốc dày hơn nhiều với:
- concert/week modules
- seasonal cafes/festivals
- K-beauty/fan-tour/location shelves
- nhiều promo/editorial blocks hơn

**Demo target:**
- chỉ cần subset cốt lõi
- không cần full module inventory của source site

### E. Pixel-perfect polish
Typography, density, micro-spacing, hover, transitions có thể chưa khớp tuyệt đối.

**Demo target:**
- sạch, ổn, nhất quán
- không cần “đặt cạnh source mà khó phân biệt”

---

## 3) Lệch chấp nhận được
Các lệch này **chấp nhận được** nếu demo framing đúng.

### Acceptable deviations
- hero static thay vì carousel/campaign slider
- chỉ có 1 promo strip thay vì nhiều seasonal promo modules
- subset homepage shelves thay vì full production homepage
- header đơn giản hơn source
- footer đơn giản hơn source
- chưa đủ account/locale/campaign affordances của source
- visual polish chưa pixel-perfect

### Không nên lệch
- sai backbone section order
- sai content family giữa các shelf
- nav/promo/item order bị lệch do import/read mismatch
- card data rỗng/sai field làm shelf nhìn giả hoặc gãy
- shell links không usable

---

## 4) Demo framing nên dùng
Nên mô tả public demo là:
- **public vertical slice**
- **source-backed homepage composition demo**
- **CMS/content-layer parity on core homepage slices**

Không nên mô tả là:
- full source-site parity
- pixel-complete world.nol clone
- production-complete homepage replacement

---

## 5) One-line acceptance rule
Public demo đạt target nếu:

> Người xem nhìn vào thấy đúng backbone của world.nol homepage, các shelf chính đọc đúng loại content từ source-backed layer, nav/footer/promo hoạt động đúng, và các simplification còn lại không phá narrative demo.

---

## Bottom line
**Parity target cho public demo = “đúng xương sống, đúng dữ liệu cốt lõi, đúng thứ tự; chấp nhận đơn giản hóa phần hero/chrome/module richness”.**

Đây là target thực dụng nhất: đủ thuyết phục cho demo, không tự trói team vào full homepage clone trước khi public layer thật sự trưởng thành.
