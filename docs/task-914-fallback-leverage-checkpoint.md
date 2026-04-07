# Task 914 — Fallback leverage checkpoint under quota pressure

1. **Homepage save → public revalidate ngay**: ưu tiên micro-task nối save action của Homepage Composer với `revalidatePath` để admin sửa hero/title thấy đổi ngay trên public homepage.
2. **Đổi từng route public sang shared read helper**: tách nhỏ theo thứ tự `tickets` → `top-picks` → `guides`, mỗi task chỉ đổi đúng 1 route sang `getPublicListingViewModel()` để visible slice lan từ homepage ra listing pages.
3. **Navigation save → header/footer visible update**: sau homepage, đẩy micro-task cho navigation save để chỉnh admin xong thấy header/footer public đổi ngay, chứng minh pattern admin→public reusable cho domain thứ hai.
