# Task 105 — Checkpoint batch 102–104 và ghi nhận #99/#100/#101 là dead branches

## Mục tiêu
Theo dõi nhanh batch 102–104 và đồng thời ghi rõ trong checkpoint rằng:
- batch mới đang chạy ra sao
- #99 / #100 / #101 được coi là **dead/stalled branches** theo rule điều phối mới: **10 phút không nhúc nhích thì coi là treo**
- batch mới sạch hiện **không phụ thuộc** các nhánh dead đó

## Snapshot tại thời điểm review
Nguồn kiểm tra chính:
- `team_tasks(action="list", status="active")`
- trạng thái / progress / progress_step hiện có trên board

### Các task trong batch 102–104 đang thấy trên board
1. **T-102-294d**
   - Subject: `Batch mới sau treo 1: Thống nhất thêm shared UI contracts cho public routes ngoài homepage`
   - Owner: `nha-hoan`
   - Status: `in_progress`
   - Progress: `10%`
   - Progress step: đang rà `public-route-frame`, `public-route-chrome`, `public-meta-list` và 4 route public ngoài homepage để thống nhất thêm UI contracts/props mà không đổi UI.

2. **T-103-c052**
   - Subject: `Batch mới sau treo 2: Gom rõ hơn server-side helper/contract cho admin summary semantics`
   - Owner: `no-tai`
   - Status: `in_progress`
   - Progress: `12%`
   - Progress step: đang gom rõ server-side helper/contract cho admin summary semantics để giảm knowledge phân tán giữa persistence/read-model/workflow side.

3. **T-104-11f1**
   - Subject: `Batch mới sau treo 3: Chốt một scope nhỏ và sạch cho homepage support contracts/types`
   - Owner: `cu-li`
   - Status: `in_progress`
   - Progress: `15%`
   - Progress step: đang chốt shared support contracts giữa `query.ts` và `repository.ts` của homepage layer, tránh đụng vào các nhánh treo cũ.

## Task checkpoint hiện tại
4. **T-105-fc85**
   - Subject: `Batch mới sau treo 4: Checkpoint batch 102–104 và đánh dấu #99/#100/#101 là dead branches`
   - Owner: `hau-gai`
   - Status: `in_progress`

---

## Ghi nhận riêng về #99 / #100 / #101

Theo rule điều phối mới của lead/user:
> **Task nào 10 phút không nhúc nhích thì coi là treo / dead branch**

Tại thời điểm checkpoint này, cần ghi rõ:
- **T-099-85ac** = dead/stalled branch trong điều phối
- **T-100-1a31** = dead/stalled branch trong điều phối
- **T-101-170d** = dead/stalled branch trong điều phối

### Lý do ghi nhận như dead branches
- Chúng vẫn còn xuất hiện trên board active snapshot,
- nhưng theo rule điều phối mới, trạng thái active cũ không còn đủ để coi là nhánh sống nếu đã quá ngưỡng 10 phút không có nhúc nhích hữu ích.
- Batch 102–104 được mở ra như một **batch mới sạch**, không phụ thuộc 99/100/101.

### Cách hiểu đúng ở checkpoint này
- Đây là **kết luận điều phối**, không phải khẳng định kỹ thuật rằng output của #99/#100/#101 vô giá trị tuyệt đối.
- Nhưng ở góc nhìn vận hành batch, cần coi chúng là **dead/stalled branches** và **không dùng làm trục phụ thuộc cho batch mới**.

---

## Kết luận ngắn về batch 102–104

### 1) Batch 102–104 hiện đang active đúng và progress khớp scope
Dấu hiệu:
- T-102, T-103, T-104 đều nằm trong danh sách active
- cả 3 đều có `status = in_progress`
- cả 3 đều có progress > 0
- progress step của từng task bám đúng scope đã giao

=> Chưa thấy dấu hiệu batch mới này bị lệch task/progress trên board tại thời điểm review.

### 2) Batch mới sạch đang đi đúng tinh thần “không phụ thuộc nhánh treo”
Ba nhánh hiện tại được tách scope khá rõ:
- public shared UI contracts
- admin summary semantics server-side
- homepage support contracts/types nhỏ và sạch

Đặc biệt ở T-104 còn ghi rất rõ là **tránh đụng vào các nhánh treo cũ**.

=> Điều này khớp với rule điều phối mới và là tín hiệu tốt cho lead/user.

### 3) Chưa thấy stale/out-of-sync rõ ràng ở batch 102–104
Hiện chưa thấy các dấu hiệu xấu như:
- task trùng scope mạnh
- progress step mơ hồ
- batch mới vẫn lén phụ thuộc ngầm vào nhánh cũ đã bị coi là dead
- trạng thái board tự mâu thuẫn ở ba task mới

=> Tại thời điểm checkpoint này, **batch 102–104 đang sync ổn**.

---

## Readiness nhìn từ batch này

### Điều tích cực
- task system đang phản ánh đúng ý đồ điều phối mới: bỏ nhánh cũ bị treo, mở batch mới sạch
- ba task 102–104 đang giữ nhịp ổn và có scope rõ
- checkpoint riêng giúp tách rất rõ:
  - nhánh nào đang chạy được
  - nhánh nào đã bị coi là dead branch

### Điều cần theo dõi tiếp
Ở checkpoint tiếp theo nên nhìn kỹ:
1. **T-102/T-103/T-104 có tiếp tục tiến đều hay không**
2. **Có ai vô tình quay lại dựa vào output của #99/#100/#101 như dependency ngầm không**
3. **Một trong 102–104 có complete sớm và kéo được batch mới sang trạng thái đáng tin hơn không**

---

## Kết luận chốt
**Batch 102–104 hiện đang active đúng, progress khớp với scope, và chưa thấy dấu hiệu lệch rõ trên board. Đồng thời #99/#100/#101 cần được xem là dead/stalled branches theo rule 10 phút không nhúc nhích, và batch mới sạch hiện không nên phụ thuộc vào chúng.**

Nói ngắn gọn:
- **T-102 active, progress khớp**
- **T-103 active, progress khớp**
- **T-104 active, progress khớp**
- **#99 / #100 / #101 = dead/stalled branches theo rule điều phối mới**
- **batch 102–104 hiện giữ nhịp ổn và đang clean hơn về dependency**
