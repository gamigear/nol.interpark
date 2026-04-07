# Task 961 — Public-finish checkpoint

## 1) Public area gần hoàn thiện nhất
- **Homepage + các listing/detail public shells** là phần gần hoàn thiện nhất hiện tại: đã có nhiều pass micro-slice, shared chrome/empty-state/helper tốt hơn và hướng read-path rõ hơn so với các vùng khác.

## 2) 3 lỗ hổng public còn lại lớn nhất
1. **Homepage public visible loop chưa chốt sạch**: cần chắc save/revalidate/public update nhìn thấy ngay và ổn định ở edge cases.
2. **Các route public chưa đồng đều hoàn toàn về data path**: một số route vẫn cần kéo hẳn sang shared read/render path để bớt cảm giác nửa thật nửa mock.
3. **Public consistency pass cuối**: copy/empty-state/section/header semantics vẫn cần một lượt chốt cuối để nhìn liền mạch hơn.

## 3) 3 batch nhỏ practical nên mở ngay
1. **Homepage public stabilization batch** — chốt save → revalidate → public visible update cho homepage.
2. **Public shared-read rollout batch** — ưu tiên kéo nốt `tickets` / `top-picks` / `guides` về cùng read helper/path rõ ràng.
3. **Public consistency final-pass batch** — chốt một lượt rất hẹp quanh empty-state/copy/section-header semantics để public nhìn đồng đều hơn.
