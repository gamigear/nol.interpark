# world.nol public demo run order

## 1) Mở route nào trước
1. [ ] Mở `/en`
2. [ ] Nếu locale phụ đã seed ổn, mở thêm locale đó (`/ar` nếu đang dùng en/ar)

## 2) Nói gì / chỉ gì ngay trên homepage
- [ ] Chỉ hero + homepage shelves đang lên
- [ ] Chỉ header nav và footer đang render
- [ ] Nếu có promo published thì chỉ promo banner ngay trên homepage

## 3) Click flow ngắn sau homepage
1. [ ] Click từ header sang `/en/tickets`
2. [ ] Quay lại homepage
3. [ ] Click sang `/en/top-picks`
4. [ ] Nếu mọi thứ ổn, mới click thêm `/en/guides`
5. [ ] Story detail chỉ mở khi biết slug demo đang có data hợp lệ

## 4) Chỗ nên tránh nếu đang fallback/mock
- [ ] Tránh locale phụ nếu nội dung chưa seed đúng locale đó
- [ ] Tránh story detail nếu vẫn đang chỉ là placeholder model
- [ ] Tránh đi sâu vào guides/tickets/top-picks nếu các static support blocks còn quá lộ
- [ ] Tránh nói header/footer là DB-backed nếu nhìn ra fallback copy mặc định
- [ ] Tránh promo section nếu DB chưa có promo published thật

## 5) Rule chốt nhanh khi trình diễn
- Nếu homepage `/en` nhìn đúng, header/footer ổn, có ít nhất 1 shelf thật và click tickets/top-picks không vỡ => đủ cho public demo flow
- Nếu thấy dấu hiệu fallback rõ (copy generic, promo mất, locale lệch, content seed-like) => giữ demo ở homepage + 1 route tốt nhất, không đi rộng thêm

## 6) Tiny operator cue
- [ ] Nếu chỉ còn 1 route public đủ ổn định, ưu tiên `/en/tickets` làm route backup thay vì thử story detail
- [ ] Nếu promo chưa có, gọi rõ đây là homepage/read-shell demo trước, không giới thiệu promo như phần đã ready
- [ ] Nếu header/footer nhìn fallback nhưng tickets shell ổn, vẫn có thể demo click flow ngắn rồi quay lại homepage để tránh lộ mismatch sâu hơn

## 7) Demo fallback script (nói ngắn gọn khi cần xoay sở)
- [ ] Nếu homepage ổn nhưng route phụ chưa chắc: nói “Hôm nay mình ưu tiên walkthrough homepage + 1 route public ổn định nhất để chốt content direction.”
- [ ] Nếu locale phụ chưa sạch: nói “Bản demo này đang tập trung xác nhận flow tiếng Anh trước, locale phụ sẽ follow sau khi seed xong.”
- [ ] Nếu promo chưa có data: nói “Promo block đã có đường dữ liệu, nhưng bản demo này đang ưu tiên homepage sections và navigation/render flow.”
- [ ] Nếu story detail chưa an toàn: nói “Story detail đang ở phase kiểm chứng content integrity, nên mình giữ demo ở listing/shelf level để tránh noise không cần thiết.”
