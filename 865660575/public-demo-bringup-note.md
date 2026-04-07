# world.nol public-only demo bring-up note

## App cần gì để mở public lên cho người xem
- [ ] `DATABASE_URL` có giá trị thật
- [ ] `DATABASE_PROVIDER` / `DATABASE_SSL_MODE` đúng với DB host
- [ ] `NEXT_PUBLIC_APP_URL` đúng URL demo
- [ ] `NEXT_PUBLIC_DEFAULT_LOCALE` đúng
- [ ] `NEXT_PUBLIC_SUPPORTED_LOCALES` khớp locale public đang seed thật
- [ ] DB đã có tối thiểu:
  - homepage page + blocks
  - navigation blocks/items
  - ít nhất 1 promo published

## Check nhanh trước khi demo
1. [ ] Mở `/en`
2. [ ] Nếu có locale phụ thì mở thêm locale đó (`/ar` nếu đang dùng en/ar)
3. [ ] Nhìn homepage xem có đủ:
   - hero
   - header nav
   - footer
   - ít nhất 1 shelf có item thật
   - promo (nếu đã seed promo)
4. [ ] Click 1 link nav sang `/en/tickets` hoặc `/en/top-picks`

## Dấu hiệu đang rơi vào fallback chứ không phải data thật
- [ ] Header/footer nhìn như fallback copy mặc định, không phản ánh nav/footer seed
- [ ] Homepage vẫn lên nhưng nội dung quá generic/seed-like
- [ ] Promo không hiện dù DB đáng ra có promo published
- [ ] Locale phụ mở được nhưng nội dung không khớp locale seed
- [ ] Public vẫn lên ngay cả khi biết chắc homepage/nav/promos DB rows đang thiếu

## Rule chốt nhanh
- Nếu `/en` lên + header/footer/homepage shelves/promo phản ánh đúng seed thật => đủ để mở public demo
- Nếu UI chỉ sống nhờ fallback => chưa coi là public demo thật sự sẵn sàng
