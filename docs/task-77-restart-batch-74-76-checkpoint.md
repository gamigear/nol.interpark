# Task 77 — Checkpoint hẹp cho batch restart 74–76

## Mục tiêu
Theo dõi nhanh batch restart 74–76 trên task board để xác định:
- task nào thực sự active
- task nào đã completed hay chưa
- có dấu hiệu stale/out-of-sync không

## Snapshot tại thời điểm review
Nguồn kiểm tra chính:
- `team_tasks(action="list", status="active")`
- task metadata / progress step hiện có trên board

### Các task trong batch restart đang thấy trên board
1. **T-074-44a8**
   - Subject: `Khởi động lại 1: Chốt hẹp db-query seam homepage cho nhất quán và sẵn sàng cắm DB thật`
   - Owner: `gia-dinh`
   - Status: `in_progress`
   - Progress: `20%`
   - Progress step: đang rà hẹp `src/lib/server/homepage/db-query.ts`, `repository.ts` và exports để chốt nhánh db-query seam.

2. **T-075-0389**
   - Subject: `Khởi động lại 2: Chốt hẹp public-content seam và wiring route listing/detail`
   - Owner: `nha-hoan`
   - Status: `in_progress`
   - Progress: `15%`
   - Progress step: đang rà `src/lib/server/public-content.ts` và 4 route listing/detail để chốt route nào đã chuyển sang seam chung.

3. **T-076-c6f4**
   - Subject: `Khởi động lại 3: Chốt hẹp admin read-side summary source cho 3 module canonical`
   - Owner: `no-tai`
   - Status: `in_progress`
   - Progress: `12%`
   - Progress step: đang chốt server read-model summary source cho `/admin/homepage`, `/admin/navigation`, `/admin/promos`.

## Task checkpoint hiện tại
4. **T-077-34e2**
   - Subject: `Khởi động lại 4: Checkpoint hẹp cho batch restart 74–76 và phát hiện stale/out-of-sync`
   - Owner: `hau-gai`
   - Status: `in_progress`
   - Progress: checkpoint review đang chạy bình thường.

---

## Kết luận ngắn về trạng thái hệ thống task ở batch restart

### 1) Cả 3 task restart 74–76 đều đang thực sự active
Dấu hiệu:
- đều xuất hiện trong `team_tasks(... status="active")`
- đều có `status = in_progress`
- đều có `progress_percent` > 0
- mỗi task đều có `progress_step` riêng, mô tả công việc cụ thể và bám đúng scope hẹp đã giao

=> Không có dấu hiệu task được tạo ra nhưng chưa thật sự chạy.

### 2) Chưa thấy task nào completed trong batch restart 74–76 tại thời điểm review
- Danh sách active hiện vẫn chứa đủ T-074, T-075, T-076
- Không thấy event complete cho ba task này trong snapshot task board vừa kiểm tra

=> Batch restart vẫn đang ở giữa vòng chạy, chưa có task con nào chốt xong tại thời điểm checkpoint này.

### 3) Chưa thấy dấu hiệu stale rõ ràng
Những dấu hiệu tích cực:
- progress step của 3 task khá cụ thể, không phải kiểu generic/đứng yên
- mỗi task đều có một scope riêng rõ ràng:
  - T-074: db-query seam
  - T-075: public-content seam + listing/detail wiring
  - T-076: admin read-side summary source
- phân chia này ăn khớp với mục tiêu restart, tức batch mới đang chạy đúng hướng thay vì lặp lại audit cũ quá rộng

=> Tại thời điểm review, **chưa có dấu hiệu stale rõ ràng**.

### 4) Chưa thấy dấu hiệu out-of-sync rõ ràng giữa 74–76 trên task board
Hiện ba task đang bám đúng ba nhánh kỹ thuật tách biệt nhưng liên quan logic với nhau:
- db-query seam
- public-content seam
- admin read-side source

Điều này hợp lý với mục tiêu restart sau khi audit phát hiện lệch trạng thái ở batch 70–73.

=> Trên góc nhìn task board, batch restart 74–76 đang **sync tốt hơn** và có vẻ được chia lại đúng scope hơn so với batch trước.

---

## Điểm cần theo dõi tiếp
Dù chưa thấy stale/out-of-sync lúc này, vẫn có 2 thứ nên theo dõi ở checkpoint kế tiếp:

1. **T-075 và T-074 có hội tụ runtime thật hay không**
   - nếu T-074 chốt seam đẹp nhưng T-075 không rollout route runtime kịp, rất dễ quay lại trạng thái “có hạ tầng nhưng chưa dùng thật”.

2. **T-076 có dùng chung read language với nhánh public/read hay không**
   - nếu admin read-side source đi theo shape khác hẳn T-074/T-075, batch restart có thể lại lệch ở vòng sau dù hiện tại task board trông vẫn ổn.

---

## Kết luận chốt
**Batch restart 74–76 hiện đang active thật, chưa có task nào completed tại thời điểm review, và chưa thấy dấu hiệu stale/out-of-sync rõ ràng trên task board.**

Nói ngắn gọn:
- **T-074 active**
- **T-075 active**
- **T-076 active**
- **chưa thấy stale rõ**
- **chưa thấy out-of-sync rõ trên board**
- nhưng nên checkpoint lại sau khi 1 trong 3 task bắt đầu complete để xem output có còn hội tụ đúng một hướng kỹ thuật không
