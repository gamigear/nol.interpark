# Task 921 — Next wave leverage checkpoint

1. **Hoàn tất 1 route public dùng shared read path thật**: ưu tiên `tickets` trước, để có một route ngoài homepage không còn đọc mock mà chạy cùng data source với homepage.
2. **Homepage save → public visible loop**: nối save action của homepage admin với revalidate + success feedback thật để thay đổi từ admin nhìn thấy ngay ở public.
3. **Navigation save → header/footer update**: sau homepage, đẩy một micro-task để admin chỉnh navigation xong thấy public header/footer đổi ngay, tạo visible slice thứ hai ngoài homepage content.
