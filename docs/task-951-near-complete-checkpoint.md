# Task 951 — Near-complete checkpoint after 942–946

## 1) Phần usable/thật nhất hiện tại
- **Homepage vertical slice** là phần usable nhất: đã có read-path thật hơn, save loop gần hoàn chỉnh, và public-visible update đã tiến gần mức chứng minh được.
- **Navigation** đang là domain gần kế tiếp nếu cần kéo lên ngang Homepage.
- **Public-side shared/support layer** đã khá usable để làm pass cuối thay vì còn ở mức foundation thô.

## 2) 3 lỗ hổng còn lại lớn nhất
1. **Homepage stabilization cuối vòng**: cần chắc hoàn toàn save → revalidate → public visible → feedback không bị lệch ở edge cases.
2. **Navigation/Promos parity**: 2 domain này vẫn chưa đồng đều chuẩn “usable thật” như Homepage.
3. **Public consistency pass cuối**: cần gom nốt vài route/helper để public-facing slice nhìn liền mạch, ít dấu vết fallback/micro-pass hơn.

## 3) 3 batch nhỏ practical nên mở tiếp ngay
1. **Homepage final stabilization batch**
2. **Navigation/Promos parity batch**
3. **Public consistency final-pass batch**
