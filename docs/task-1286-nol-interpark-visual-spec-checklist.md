# Task 1286 — Visual-spec checklist cho clone nol.interpark.com

## 1) Typography scale
- **Hero/section title:** đậm, lớn, ưu tiên hierarchy rất rõ; section heading phải nhìn “editorial + commerce” chứ không phải dashboard text.
- **Card title:** 2 line clamp là mặc định cho tour/ticket cards; weight trung bình-đậm, không quá mảnh.
- **Meta text:** địa điểm, ngày, thời lượng, airline, shopping/no-shopping… là lớp chữ phụ nhỏ hơn 1 bậc rõ rệt.
- **Price text:** số tiền là điểm nhấn mạnh nhất trong card commerce; phải có contrast cao hơn meta.
- **Badge/label:** kiểu “단독판매”, category chips như “친구연인”, “가족”, “아이” cần nhỏ nhưng nổi bật, có visual treatment riêng.

## 2) Spacing rhythm
- Section spacing phải **thoáng và đều**: title block → content grid/list có khoảng cách ổn định.
- Card internal spacing nên theo nhịp: **badge/category → title → meta lines → price/action**.
- Giữa các line meta nên sát vừa đủ để đọc nhanh như listing commerce, không giãn kiểu editorial dài.
- Gutter ngang của list/carousel phải đều; không để item đầu/cuối bị dính container.

## 3) Card / list patterns
### Tour cards
- Có **label đối tượng** ở đầu card (`친구연인`, `가족`, `아이`...)
- Title dài, cần clamp 2 dòng
- Meta nhiều lớp: thời lượng / điểm khởi hành / hãng / shopping/no-shopping
- Price luôn nằm gần cuối card và phải nhìn ra ngay
- Nhóm card thiên **deal/commerce** hơn content, nên density cao nhưng vẫn sạch

### Ticket ranking cards
- Ảnh poster dọc là anchor chính
- Title + venue + date range theo thứ tự cố định
- Badge như `단독판매` phải tách ra thành accent nhỏ, không lẫn vào body text
- Ranking/list feel cần nhanh, dễ lướt hơn card commerce tour

## 4) Section shells
- Mỗi section cần có:
  - title
  - subcopy/description ngắn
  - CTA kiểu “홈 바로가기”, “더보기”, “전체보기”
- CTA ở section shell nên nhìn như **text link mạnh**, không phải button to nặng
- Shell của “투어 특가” và “티켓 랭킹” phải cùng hệ thống nhưng khác flavor nhẹ theo domain

## 5) CTA styles
- CTA section-level: text link rõ, thường nằm ở header/footer section
- CTA card-level: ưu tiên toàn card clickable thay vì nhiều nút phụ
- Price zone không nên tranh chấp visual với CTA; CTA phải hỗ trợ decision, không áp đảo giá

## 6) Header / footer behavior
- Header cần feel như **portal thương mại lớn**: brand rõ, nhóm điều hướng chính, vào domain nhanh
- Footer tối thiểu phải có đủ cảm giác “site lớn hoàn chỉnh”, không bị cụt trang
- Navigation spacing/hover states cần gọn, dứt khoát, không fancy quá mức

## 7) Color feel
- Nền sáng, sạch; accent màu dùng có chủ đích ở:
  - giá
  - badge độc quyền
  - CTA/link
  - category chips
- Không nên over-colorful; cảm giác tổng thể là **commerce portal polished**
- Contrast giữa text chính / meta / muted text phải rõ để list dày vẫn dễ scan

## 8) Empty / loading assumptions
- Loading nên skeleton theo đúng shape card/list chứ không dùng spinner chung chung
- Empty state nếu có cần cực ngắn, practical, không phá layout shell
- Với ranking/deal sections, empty state phải giữ được section header + CTA context để trang không sụp nhịp

## 9) Pixel-accuracy priorities
### P0 — bắt buộc giống
- Hierarchy title/meta/price
- Card density + clamp lines
- Poster ratio của ticket cards
- CTA/link placement ở section shell
- Badge/category treatment

### P1 — nên giống sát
- Khoảng cách các dòng meta
- Shadow/border/radius
- Hover subtle states
- Gutter giữa item và section padding

### P2 — để sau nếu thiếu thời gian
- Motion rất nhẹ khi hover/scroll
- Tiny visual nuance giữa domain tour vs ticket

## 10) Kết luận ngắn cho team frontend
Muốn clone nhìn giống thật, đừng chỉ copy layout. Phải giữ đúng **hierarchy scan** của site gốc:
- user lướt section title
- thấy ngay card title
- đọc meta cực nhanh
- chốt bằng giá/badge/CTA

Nếu hierarchy này đúng, UI sẽ ra “nol.interpark feel” nhanh hơn rất nhiều ✨
