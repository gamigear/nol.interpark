# Task 1279 — Board checkpoint on R1-R4 batch shape

- **R1-R4 micro-batch shape rõ ràng sạch hơn** các batch failed trước: scope hẹp 1-file, chia theo lane cụ thể (CMS/admin, secondary-admin, public, shared) nên dễ dispatch, dễ verify và ít overreach hơn.
- So với các retry/ultra-short/next/practical batches cũ bị fail hàng loạt, **R1-R4 đã cho thấy pattern tốt hơn**: nhiều task complete thật trên board thay vì fail đồng loạt ngay sau dispatch.
- **Recurring blocker signal từ board metadata**: các batch lớn hơn hoặc mô tả mơ hồ thường fail nhiều hơn; task nhỏ nhưng không kèm exact file-path/result discipline cũng làm checkpoint yếu đi dù board báo complete.
- Một blocker phụ lặp lại là **dispatch/quota noise**: nhiều task cũ fail dày đặc, gây nhiễu board và làm khó phân biệt batch sống với batch chết.
- Kết luận điều phối: **giữ format micro-batch kiểu R1-R4**, tiếp tục ép scope 1-file + exact file path + concise verified result; đồng thời nên dọn bớt failed tasks cũ trên board để giảm nhiễu cho các batch sau.
