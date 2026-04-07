# Task 938 — Gap checkpoint toward near-complete

## 3 lỗ hổng còn lại lớn nhất
1. **Homepage vertical slice vẫn chưa khép kín thật**: admin save → persistence/use-case → revalidate → public homepage visible update chưa được chứng minh trọn vòng.
2. **Navigation/Promos chưa có vertical slice end-to-end đồng đều**: có các mảnh read/write/use-case nhưng chưa đủ chắc ở mức admin edit → public visible → stable feedback.
3. **Public render/data support còn phân tán**: một số route/public helpers vẫn cần thống nhất nốt để tránh “nửa DB-backed, nửa mock/polish”.

## 3 batch nhỏ practical nên mở ngay
1. **Homepage E2E save batch**: chốt đúng một flow “edit hero/title ở admin → save → revalidate → thấy đổi trên public homepage”.
2. **Navigation visible update batch**: chốt đúng một flow “edit nav item/label → save → thấy đổi ở public header/footer”.
3. **Public support cleanup batch**: gom nốt 1-2 route/helper còn lệch để tất cả public slice chính đi cùng read/render path rõ ràng hơn.
