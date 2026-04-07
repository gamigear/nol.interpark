# Task 109 — Checkpoint batch 106–108 và tách rõ luồng chính khỏi task treo cũ

## Mục tiêu
Theo dõi nhanh batch 106–108 và ghi rõ trên checkpoint/team board rằng:
- đây là luồng chính hiện tại đang chạy
- các task treo cũ không còn thuộc luồng chính
- batch mới đang giữ nhịp ra sao ở góc nhìn task system

## Snapshot tại thời điểm review
Nguồn kiểm tra chính:
- `team_tasks(action="list", status="active")`
- trạng thái / progress / progress_step hiện có trên board

### Các task trong batch 106–108 đang thấy trên board
1. **T-106-b72d**
   - Subject: `Batch mới tiếp 1: Chốt 4 public routes sang shared frame contract đầy đủ hơn`
   - Owner: `nha-hoan`
   - Status: `in_progress`
   - Progress: `10%`
   - Progress step: đang chốt 4 public routes ngoài homepage sang shared `PublicRouteFrame` contract cho cả populated và empty case.

2. **T-107-b313**
   - Subject: `Batch mới tiếp 2: Chốt một helper/contract chung cho admin read-side và workflow-side`
   - Owner: `no-tai`
   - Status: `in_progress`
   - Progress: `12%`
   - Progress step: đang chốt một helper/contract chung ở server layer để cả read-model assembly và workflow-side cùng consume.

3. **T-108-ad95**
   - Subject: `Batch mới tiếp 3: Hoàn tất wiring/import-export cho một cụm homepage contracts cụ thể`
   - Owner: `cu-li`
   - Status: `in_progress`
   - Progress: `16%`
   - Progress step: đang hoàn tất wiring/import-export cho cụm homepage support contracts quanh `contracts.ts`, tránh đụng `db-query.ts`.

## Task checkpoint hiện tại
4. **T-109-e5b1**
   - Subject: `Batch mới tiếp 4: Checkpoint batch 106–108 và tách rõ luồng chính khỏi task treo cũ`
   - Owner: `hau-gai`
   - Status: `in_progress`

---

## Ghi nhận rõ về luồng chính và các task treo cũ

### Luồng chính hiện tại
Ở góc nhìn điều phối hiện tại, **batch 106–108 là luồng chính đang sống**.

Dấu hiệu:
- 3 task đều active thật
- đều có progress > 0
- progress step cụ thể, scope rõ
- batch được mở sạch sau khi các checkpoint trước đã xác định nhóm task treo cũ không còn đáng tin như trục điều phối chính

### Các task treo cũ không còn thuộc luồng chính
Theo các checkpoint trước đã chốt rõ:
- **#90** = dead/stalled branch
- **#99** = dead/stalled branch
- **#100** = dead/stalled branch
- **#101** = dead/stalled branch

Checkpoint này nhắc lại rõ một lần nữa ở góc nhìn điều phối:
> các task treo cũ trên **không còn thuộc luồng chính hiện tại** và **không nên được xem là dependency điều phối cho batch 106–108**.

---

## Kết luận ngắn về task/progress của batch 106–108

### 1) Task/progress hiện khớp nhau tốt
Dấu hiệu:
- cả T-106, T-107, T-108 đều nằm trong danh sách active
- cả 3 đều có `status = in_progress`
- cả 3 đều có progress > 0
- progress step bám khá sát scope đã giao:
  - T-106 = shared frame contract cho 4 public routes
  - T-107 = helper/contract chung cho admin read-side + workflow-side
  - T-108 = wiring/import-export cho homepage contracts

=> Chưa thấy dấu hiệu board báo active nhưng task không có chuyển động cụ thể.

### 2) Batch 106–108 đang khá sạch về mặt điều phối
Ba nhánh hiện tại chia thành 3 việc nhỏ nhưng có liên hệ tốt:
- public route frame contract
- admin read/workflow contract chung
- homepage contracts wiring/import-export

Đây là kiểu chia nhịp hợp lý vì:
- scope đủ nhỏ
- tránh phụ thuộc trực tiếp vào các nhánh cũ bị coi là treo
- vẫn đẩy được luồng chính tiến lên từng bước

### 3) Chưa thấy stale/out-of-sync rõ ràng trong batch 106–108
Hiện chưa thấy các dấu hiệu xấu như:
- progress step quá mơ hồ
- scope trùng lặp mạnh
- task active/completed mâu thuẫn nhau
- một nhánh mới lại vô tình quay về phụ thuộc task treo cũ

=> Tại thời điểm checkpoint này, **batch 106–108 đang sync ổn**.

---

## Readiness nhìn từ batch này

### Điều tích cực
- luồng chính hiện tại đã được tách khá rõ khỏi các nhánh treo cũ
- task system vẫn phản ánh đúng batch nào là batch sống
- 3 task 106–108 đang giữ nhịp tốt và có scope rõ ràng
- checkpoint này giúp giảm rủi ro “task treo cũ vẫn bị hiểu nhầm là luồng chính”

### Điều cần theo dõi tiếp
Ở checkpoint kế tiếp nên nhìn kỹ:
1. **T-106/T-107/T-108 có tiếp tục nhích đều không**
2. **Có nhánh nào trong 106–108 vô tình quay lại consume logic/output từ #90/#99/#100/#101 như dependency ngầm không**
3. **Một trong 106–108 có complete sớm để xác nhận luồng chính mới đang thật sự tạo ra output tin cậy hơn không**

---

## Kết luận chốt
**Batch 106–108 hiện là luồng chính đang sống, progress khớp với scope và chưa thấy dấu hiệu lệch rõ trên board. Đồng thời các task treo cũ #90/#99/#100/#101 không còn thuộc luồng chính hiện tại.**

Nói ngắn gọn:
- **T-106 active, progress khớp**
- **T-107 active, progress khớp**
- **T-108 active, progress khớp**
- **luồng chính hiện tại = batch 106–108**
- **#90 / #99 / #100 / #101 không còn thuộc luồng chính**
- **batch mới hiện giữ nhịp ổn và khá sạch về điều phối**
