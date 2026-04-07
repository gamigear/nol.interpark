# world.nol public env / runtime checklist

Checklist ngắn để public query/data path chạy đúng.

## 1) Env bắt buộc cho public

### Bắt buộc thật sự
- [ ] `DATABASE_URL` — pooled runtime connection cho public server queries
- [ ] `DATABASE_PROVIDER` — phải khớp loại DB thực tế (`neon` / `postgresql` / `rds`)
- [ ] `DATABASE_SSL_MODE` — phải hợp với DB host/runtime
- [ ] `NEXT_PUBLIC_APP_URL` — đúng base URL deploy
- [ ] `NEXT_PUBLIC_DEFAULT_LOCALE` — phải khớp locale mặc định public
- [ ] `NEXT_PUBLIC_SUPPORTED_LOCALES` — phải khớp locale public đang seed thật

### Nên có để tránh runtime mơ hồ
- [ ] `DATABASE_DIRECT_URL` — không bắt buộc cho public request path, nhưng nên có cho tooling/verify/migration
- [ ] `DATABASE_BRANCH` — để biết đang trỏ đúng branch DB demo/prod nào
- [ ] `VERCEL_ENV` / `VERCEL_PROJECT_PRODUCTION_URL` — hữu ích cho deploy verify

## 2) Runtime assumptions dễ fail

### A. Thiếu `DATABASE_URL`
Kết quả:
- public DB queries không có runtime connection
- homepage/navigation/promos có thể rơi về fallback hoặc fail tùy path

### B. Locale env không khớp data thật
Rủi ro rõ nhất:
- `.env.example` hiện `NEXT_PUBLIC_SUPPORTED_LOCALES=en,ko`
- nhưng public/content hiện đang chạy chủ yếu với `en` + `ar`

Kết quả:
- route locale lệch
- query localization không khớp seed
- public shell/homepage/promos lấy sai locale hoặc fallback

### C. Homepage/nav/promos thiếu DB rows nhưng UI vẫn “trông như chạy”
Do current runtime có fallback:
- homepage có synthetic/db-like fallback
- public shell có fallback nav/footer
- promos query fail thì homepage vẫn render không promo

Kết quả:
- dễ tưởng public OK dù chưa dùng data thật

### D. `DATABASE_PROVIDER` / `DATABASE_SSL_MODE` sai
Kết quả:
- driver config lệch
- connect fail theo môi trường host/serverless

## 3) Public critical runtime paths

Các path public hiện phụ thuộc trực tiếp vào runtime env + DB:
- [ ] `src/app/(public)/[lang]/layout.tsx`
- [ ] `src/lib/server/navigation/query.ts`
- [ ] `src/lib/server/navigation/repository-db.ts`
- [ ] `src/app/(public)/[lang]/page.tsx`
- [ ] `src/lib/server/homepage/repository.ts`
- [ ] `src/lib/server/homepage/repository-db.ts`
- [ ] `src/lib/server/promos/query.ts`
- [ ] `src/lib/server/promos/repository-db.ts`
- [ ] `src/lib/server/db/config.ts`
- [ ] `src/lib/server/db/driver.ts`
- [ ] `src/lib/server/env/index.ts`

## 4) Verify tối thiểu theo thứ tự

### Step 1 — env sanity
- [ ] `DATABASE_URL` có giá trị thật
- [ ] `DATABASE_PROVIDER` đúng
- [ ] `NEXT_PUBLIC_DEFAULT_LOCALE` đúng
- [ ] `NEXT_PUBLIC_SUPPORTED_LOCALES` đúng với locale public seed

### Step 2 — DB content sanity
- [ ] homepage page + localized blocks có trong DB
- [ ] nav blocks/items có trong DB
- [ ] ít nhất 1 promo published có trong DB

### Step 3 — route verify
- [ ] mở `/en`
- [ ] mở locale phụ (`/ar` nếu public seed là en/ar)

### Step 4 — pass signs
- [ ] homepage load không 500
- [ ] header/footer không chỉ hiện fallback mặc định
- [ ] hero/sections homepage ra data thật
- [ ] promo render nếu có promo published
- [ ] không lòi placeholder/fallback obvious ngoài ý muốn

## 5) Decision rule cho public board
- Nếu thiếu `DATABASE_URL` hoặc locale env lệch seed => **chưa đủ điều kiện chạy public đúng**
- Nếu homepage/nav/promos chỉ hiện nhờ fallback => **chưa coi là public-ready**
- Chỉ xem là pass khi `/en` (và locale phụ nếu có) render được bằng DB-backed data thật, không chỉ bằng fallback path
