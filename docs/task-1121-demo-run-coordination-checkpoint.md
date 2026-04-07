# Task 1121 — Demo run coordination checkpoint

## Ưu tiên hiện tại
- **Ưu tiên 1: Homepage / public visible loop** — đây vẫn là phần có leverage demo lớn nhất; nếu public homepage + listing/detail nhìn ổn và click-through không gãy thì demo có thể show được ngay.
- **Ưu tiên 2: Build/data parity** — cần chắc source/read path và public routing đang bám cùng một tree/source thật, tránh mismatch giữa board và repo khi bước vào demo/staging.
- **Ưu tiên 3: Admin parity** — admin đã có nhiều micro-slices hữu ích, nhưng chỉ nên tiếp tục ở mức hỗ trợ demo/read-only hoặc save-feedback tối thiểu, không mở thêm nhánh lớn nếu chưa cần.

## Cần xử lý trước để nhanh nhất tới showable-demo rồi staging-ready
1. **Khóa canonical source tree / build target thật**
2. **Chốt Homepage + 1–2 public routes trọng yếu (tickets / top-picks / guides / story) ở mức showable-end-to-end**
3. **Sau đó mới chạy demo-run/staging smoke thay vì tiếp tục nở thêm micro-batches phân tán**
