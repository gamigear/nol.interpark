# Task 930 — Completion roadmap checkpoint

## 1) Phần usable thật nhất hiện tại
- **Public/admin micro-slice pattern đã usable thật ở mức nhỏ**: nhiều batch one-file gần đây đã complete thật (admin dashboard placeholder cue, admin navigation cue, public tickets/top-picks/guides cue, shared/project cue).
- **Homepage read-path foundation đã usable một phần**: wiring cho `getHomepageViewModel()` + SQL reader injection + repository fallback đã được chốt ở các checkpoint trước.
- **Auth salvage tối thiểu đã usable ở mức guard/sign-in foundation**: đủ để không còn hoàn toàn mock mù như đầu project.

## 2) 3 lỗ hổng lớn nhất còn lại để nói là “xong hoàn toàn”
1. **Chưa có 1 vertical slice end-to-end thật cho Homepage Composer → save → public visible update**
2. **Navigation/Promos vẫn chưa được kéo tới mức save/use-case/read-side/public-visible đồng bộ và đáng tin**
3. **Task system/board còn nhiễu mạnh bởi failed batches cũ**, làm điều phối và xác minh completion thật dễ bị lệch

## 3) Thứ tự xử lý practical nhất
1. **Chốt Homepage vertical slice end-to-end trước**: admin read/save/revalidate → public homepage thấy đổi ngay
2. **Kéo Navigation thành vertical slice thứ hai**: admin edit → header/footer public đổi ngay
3. **Dọn board + chỉ giữ batch nhỏ verify được** rồi mới đẩy Promos end-to-end, tránh tiếp tục tích lũy complete ảo / failed noise
