# Task 1090 — Inventory demo-ready cho homepage/public shell từ source site

## Mục tiêu demo
Có một public-facing demo đủ thuyết phục, bám site gốc ở các lát cắt nhìn thấy ngay: navigation, homepage sections, promos, footer và các route public được homepage dẫn tới.

## Inventory demo-ready

### 1) Navigation / Header — Ưu tiên P0
**Cần có:**
- brand/logo text
- primary nav labels + href
- secondary actions/CTA nếu có
- locale/lang path handling

**Field cần lấy:**
- `label`
- `href`
- `order`
- optional `target`
- optional `group/placement`

**Rủi ro nếu thiếu:**
- demo nhìn rời rạc ngay từ trên cùng trang
- user không cảm nhận được site structure và flow điều hướng

---

### 2) Hero / Homepage opening state — Ưu tiên P0
**Cần có:**
- hero title/headline
- hero description/subcopy
- hero visual nếu site gốc có banner/key visual riêng trong runtime thực tế
- eyebrow/section intro nếu có

**Field cần lấy:**
- `title`
- `description`
- optional `imageDesktop`
- optional `imageMobile`
- optional `ctaLabel`
- optional `ctaHref`

**Rủi ro nếu thiếu:**
- homepage demo nhìn như skeleton/text-only
- mất “first impression” của site gốc

---

### 3) Homepage section inventory — Ưu tiên P0
Từ source site hiện thấy các section public chính:
1. **This Week’s Top Tickets**
2. **K-POP Fans Top Picks**
3. **This Week's Concert / editorial cluster**
4. **Top Things to Do in Busan**
5. **K-Food You Can’t Miss 😋**
6. **Travel Guides**

**Field cần lấy cho mỗi section:**
- `sectionTitle`
- `sectionHref` hoặc more-link target
- `order`
- `sectionType`
- `items[]`

**Field cần lấy cho từng item card:**
- `title`
- `href`
- `image`
- optional `subtitle` / `summary`
- optional `dateText`
- optional `venue`
- optional `metric/viewCount`

**Rủi ro nếu thiếu:**
- demo chỉ có 1–2 block lẻ, không ra cảm giác “NOL World homepage thật”
- không chứng minh được khả năng compose nhiều content families trên một homepage

---

### 4) Promos / merchandising / campaign blocks — Ưu tiên P1
Từ source site hiện thấy nhiều dấu hiệu promo/merchandising nằm trong:
- top picks / fan package style items
- editorial cards kiểu “Special Deal”, “Exclusive Perks”
- campaign-oriented product cards

**Cần có ở mức MVP demo:**
- ít nhất 1 promo-like strip/card/rail rõ ràng
- hoặc 1 merchandising cluster được gắn nhãn rõ như promo/special deal/exclusive perk

**Field cần lấy:**
- `headline`
- optional `subheadline`
- `image`
- `ctaLabel`
- `ctaHref`
- optional `placementKey`
- optional `theme`

**Rủi ro nếu thiếu:**
- homepage sẽ giống content listing thuần, thiếu lớp thương mại/campaign
- khó demo phần “Promos” trong CMS/domain model

---

### 5) Footer / bottom navigation — Ưu tiên P1
Source fetch hiện chưa lộ footer detail rõ, nhưng demo thuyết phục vẫn cần footer tối thiểu.

**Cần có:**
- brand/footer note
- nhóm link cơ bản
- legal/support/app/social nếu source thật có thể lấy sau

**Field cần lấy:**
- `groupTitle`
- `links[] { label, href }`
- optional `legalText`
- optional `socialLinks[]`

**Rủi ro nếu thiếu:**
- trang nhìn như cắt cụt, không có “end cap” hoàn chỉnh
- demo khó thuyết phục ở cảm giác sản phẩm thật

---

### 6) Route public quan trọng được homepage dẫn tới — Ưu tiên P0/P1
Từ source site/homepage hiện có thể xác nhận các route public quan trọng sau:
- **Tickets listing**: `/en/ticket?with-header=`
- **Ticket detail/product pages**: `/en/ticket/places/.../products/...`
- **Top picks / products listing**: `/en/tna/categories/all/products`
- **Content article/detail**: `/en/content/articles/...`
- **Region guides**: `/en/regions/.../guides`
- **Filtered region/tag guides**: `/en/regions/.../guides?tag-id=...`

**Mức demo tối thiểu nên có:**
- homepage
- tickets listing
- top picks/products listing
- 1 content/article detail route
- guides listing

**Rủi ro nếu thiếu:**
- homepage card click không dẫn tới đâu thuyết phục
- demo chỉ là landing page tĩnh, không phải website có flow thật

---

## Ưu tiên triển khai ngắn gọn
### P0 — Phải có để demo thuyết phục
- Header/nav
- Hero opening state
- 6 homepage sections chính với card data thật hoặc seed sát site gốc
- 3 route public tối thiểu: tickets, top picks, guides/article

### P1 — Nên có ngay sau P0
- Promo-like block rõ ràng
- Footer có cấu trúc hơn
- Article/detail experience rõ hơn cho cluster editorial/concert/guides

### P2 — Có thể để sau nếu kẹt thời gian
- filter/query params thật cho guides/products
- richer footer/social/legal
- locale variants ngoài `en`

## Kết luận ngắn cho team implement
Nếu chỉ chọn đúng vài lát cắt để demo thuyết phục nhanh, nên ưu tiên:
1. **Homepage đủ 6 section chính như source site**
2. **Tickets + Top Picks + Guides/Article routes click được**
3. **Header/nav + 1 promo/merchandising block + footer tối thiểu**

Chỉ cần chốt được 3 cụm này bằng data sát source site là demo đã “ra sản phẩm” hơn rất nhiều, thay vì chỉ là skeleton đẹp nhưng rỗng ruột 😅
