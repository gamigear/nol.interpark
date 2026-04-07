# Task 1175 — Workspace blocker checkpoint

- Hiện đang tắc ở **workspace/source tree mismatch**: task board nói một cây file, nhưng khi triển khai public code tasks thì nguồn thực tế không khớp hoàn toàn, nên dễ sửa nhầm hoặc verify nhầm.
- Để mở khóa nhanh nhất, cần user/leader cung cấp **đúng 1 thứ**: **xác nhận workspace/repo canonical đang dùng cho public code tasks là cây nào** (nguồn thật để toàn team cùng bám).
- Khi chưa có xác nhận này, các public code tasks tiếp tục có nguy cơ “board complete nhưng code không chắc nằm đúng tree”.
- Trong lúc chờ, lane vẫn chạy được là: **coordination/checkpoint**, **planning/inventory**, và các **micro-task rất hẹp chỉ đọc board/results**.
- Các task public code nên tạm giữ ở mức cực hẹp hoặc chờ xác nhận canonical tree trước khi mở rộng thêm.
- Decision: **xin xác nhận canonical workspace/source tree trước**, rồi mới tiếp tục đẩy public code batches rộng hơn.
