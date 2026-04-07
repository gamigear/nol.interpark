# world.nol demo verification runbook

Runbook cực ngắn cho lượt chốt demo cuối. Mục tiêu: xác nhận website demo **đang chạy được với data thật**, không phải mock/fallback ngụy trang.

## A. Chuẩn bị trước khi mở demo

### 1) Seed / import tối thiểu phải có
- [ ] Homepage page + localizations
- [ ] Homepage blocks:
  - hero
  - featured tickets
  - top picks
  - editorial
  - travel guides
- [ ] Navigation blocks/items cho public header
- [ ] Ít nhất 1 promo block published
- [ ] Ít nhất 3 item content/card có image + title
- [ ] Admin bootstrap user / credentials hoạt động

### 2) Runtime / DB check
- [ ] DB schema đã deploy
- [ ] App đang trỏ đúng DB demo
- [ ] Không còn lỗi syntax/file integrity ở read path promos
- [ ] Confirm homepage read path không đang rơi về synthetic/mock ngoài ý muốn

## B. Thứ tự kiểm tra route

### 1) Mở homepage trước
Route:
- [ ] `/en`
- [ ] `/ar` (nếu có locale demo)

Pass nhanh nếu:
- [ ] Homepage load không 500
- [ ] Hero/section titles ra từ DB content thật
- [ ] Header không còn hardcoded giả obvious
- [ ] Ít nhất 1 shelf có item thật + image load được
- [ ] Promo hiện đúng nếu có promo published
- [ ] Không lòi copy placeholder kiểu `clone skeleton`, `Coming soon`, `Ready when content arrives`

### 2) Kiểm tra nav/shell
Từ homepage:
- [ ] Click header links hoạt động đúng
- [ ] Footer render ra content/link thật hoặc text demo thật
- [ ] Locale switch / locale route không vỡ layout

Pass nhanh nếu:
- [ ] Header/footer nhìn là data-driven, không phải object hardcoded
- [ ] Link điều hướng mở đúng route public

### 3) Kiểm tra 1–2 route public phụ (không cần exhaustive)
Ưu tiên:
- [ ] `/en/tickets`
- [ ] `/en/top-picks`

Nếu còn thời gian:
- [ ] `/en/guides`
- [ ] `/en/stories/<slug-demo>`

Pass nhanh nếu:
- [ ] Route load được
- [ ] Không còn khối placeholder quá lộ
- [ ] Card/list data khớp homepage direction

## C. Kiểm tra admin edit → publish → public refresh

### 1) Sign in admin
- [ ] `/admin/sign-in` load được
- [ ] Login bằng credential demo thành công
- [ ] Vào được dashboard

### 2) Sửa 1 content nhỏ, dễ thấy
Ưu tiên sửa 1 trong các field này:
- [ ] promo headline
- [ ] homepage hero title
- [ ] section heading

### 3) Publish / save
- [ ] Save thành công không error
- [ ] Revalidation/cache refresh hoạt động

### 4) Quay lại homepage public
- [ ] Reload homepage
- [ ] Thấy đúng field vừa sửa đổi

Pass nhanh nếu:
- [ ] Có thay đổi nhìn thấy trên public trong 1–2 lần reload
- [ ] Không cần restart app thủ công để thấy content mới

## D. Dấu hiệu PASS để leader chốt demo runnable

Chốt **PASS** nếu đủ cả 5 dấu hiệu này:
- [ ] Homepage render được bằng data DB thật
- [ ] Header navigation render từ data thật
- [ ] Ít nhất 1 promo/banner render từ data thật
- [ ] Admin login được
- [ ] Sửa 1 content trong admin và thấy public homepage đổi theo

## E. Dấu hiệu FAIL phải dừng demo
- [ ] Homepage hiện copy mock/static rõ ràng
- [ ] Header/footer vẫn hardcoded giả
- [ ] Promo query lỗi hoặc không phản ánh DB state
- [ ] Admin save xong nhưng public không đổi
- [ ] Chỉ đang thấy fallback/synthetic data thay vì site-origin/demo seed data

## F. Nếu chỉ còn 5 phút trước demo
Làm đúng 3 việc này:
1. [ ] Mở `/en` và xác nhận homepage + nav + promo đều lên
2. [ ] Login admin, đổi 1 title ngắn
3. [ ] Refresh homepage và xác nhận title mới xuất hiện

Nếu 3 bước này pass, demo vẫn cứu được.