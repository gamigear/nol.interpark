# world.nol build / verify / deploy checklist (post-demo batch)

Checklist ngắn, file-first, dùng ngay cho team build/deploy sau batch demo wiring.

## 1) Chạy gì trước build

### Env / runtime bắt buộc
Kiểm tra theo `.env.example`:
- [ ] `DATABASE_URL`
- [ ] `DATABASE_DIRECT_URL`
- [ ] `DATABASE_PROVIDER`
- [ ] `DATABASE_SSL_MODE`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_DEFAULT_LOCALE`
- [ ] `NEXT_PUBLIC_SUPPORTED_LOCALES`
- [ ] `ADMIN_AUTH_MODE`
- [ ] `ADMIN_BOOTSTRAP_EMAIL`
- [ ] `ADMIN_BOOTSTRAP_NAME`
- [ ] `ADMIN_BOOTSTRAP_ROLE`
- [ ] `ADMIN_SESSION_SECRET` (**critical cho production/demo host**)
- [ ] `ADMIN_SESSION_COOKIE_SECURE` đúng với môi trường deploy

### Data / DB tối thiểu
- [ ] Homepage page + localizations có thật trong DB
- [ ] Homepage blocks có thật: hero, featured tickets, top picks, editorial, travel guides
- [ ] Navigation blocks/items có thật cho shell public
- [ ] Ít nhất 1 promo published
- [ ] Admin bootstrap/demo credential usable

## 2) File critical phải rà trước khi build

### Build/runtime config
- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `next.config.mjs`
- [ ] `.env.example`

### DB/runtime layer
- [ ] `src/lib/server/db/config.ts`
- [ ] `src/lib/server/db/driver.ts`
- [ ] `src/lib/server/env/index.ts`

### Public shell + homepage critical path
- [ ] `src/app/(public)/[lang]/layout.tsx`
- [ ] `src/app/(public)/[lang]/page.tsx`
- [ ] `src/components/layout/site-header.tsx`
- [ ] `src/components/layout/site-footer.tsx`
- [ ] `src/lib/server/navigation/query.ts`
- [ ] `src/lib/server/navigation/repository-db.ts`
- [ ] `src/lib/server/homepage/query.ts`
- [ ] `src/lib/server/homepage/repository.ts`
- [ ] `src/lib/server/homepage/repository-db.ts`
- [ ] `src/lib/server/promos/query.ts`
- [ ] `src/lib/server/promos/repository-db.ts`

### Admin auth critical path
- [ ] `src/lib/server/auth/config.ts`
- [ ] `src/lib/server/auth/session.ts`
- [ ] `src/lib/server/auth/actions.ts`
- [ ] `src/lib/server/auth/seed.ts`
- [ ] `src/app/(admin-auth)/admin/sign-in/*`
- [ ] `src/app/(admin-protected)/admin/*`

## 3) Build / verify sequence

### Step A — static verification
Do trước khi build:
- [ ] Confirm không còn file read-path nào bị hỏng syntax sau batch wiring
- [ ] Confirm import/type names khớp ở homepage/navigation/promos/auth layers
- [ ] Confirm env keys production-ready

### Step B — build
Chạy:
- [ ] `npm run build`

Nếu có lint gate nội bộ thì chạy thêm:
- [ ] `npm run lint`

> Hiện `package.json` **không có** `typecheck`, `test`, `seed`, `migrate` script. Team build/deploy phải biết điều này để không giả định pipeline đã cover hết.

### Step C — route smoke verify sau build
Ưu tiên:
- [ ] `/en`
- [ ] `/ar` (nếu demo locale có dùng)
- [ ] `/admin/sign-in`
- [ ] `/admin`

Nếu pass rồi kiểm thêm:
- [ ] `/en/tickets`
- [ ] `/en/top-picks`

### Step D — functional verify ngắn
- [ ] Homepage load không 500
- [ ] Header/footer render được
- [ ] Ít nhất 1 section homepage có data thật + image load được
- [ ] Promo render được hoặc fail-safe sạch (không crash)
- [ ] Admin sign-in thành công
- [ ] Save 1 content rồi refresh public homepage thấy đổi theo

## 4) Blocker kỹ thuật có khả năng còn sót trước build

### Blocker A — strict TS có thể fail vì lỗi nhỏ
- `tsconfig.json` đang `strict: true`
- Chỉ cần 1 import/type sai là build fail toàn bộ

### Blocker B — homepage có thể “trông chạy được” nhưng đang fallback synthetic
File liên quan:
- `src/lib/server/homepage/repository.ts`
- `src/lib/server/homepage/query.ts`

Rủi ro:
- Build pass nhưng demo/public vẫn đang ăn fallback synthetic thay vì DB thật

Cần verify:
- [ ] homepage data thật tồn tại trong DB
- [ ] không chỉ đang sống nhờ fallback

### Blocker C — public shell có fallback nên dễ che lỗi seed navigation
File liên quan:
- `src/lib/server/navigation/query.ts`
- `src/app/(public)/[lang]/layout.tsx`

Rủi ro:
- Header/footer vẫn hiện được nhờ fallback shell, khiến team tưởng nav DB đã OK

Cần verify:
- [ ] nav DB seed thật có mặt
- [ ] shell không chỉ fallback

### Blocker D — admin auth production env
File liên quan:
- `src/lib/server/auth/config.ts`
- `src/lib/server/auth/session.ts`

Rủi ro:
- thiếu `ADMIN_SESSION_SECRET` => production/demo host fail auth flow

### Blocker E — scripts/tooling còn thiếu
- Không có script riêng cho:
  - typecheck
  - test
  - migrate
  - seed
- Team deploy phải tự kiểm soát bước DB/schema/seed ngoài npm scripts hiện tại

## 5) Pass condition để chuyển deploy/review
Chỉ nên chuyển sang deploy/review khi đủ:
- [ ] `npm run build` pass
- [ ] homepage `/en` pass smoke check
- [ ] header/footer render đúng
- [ ] promos query không crash
- [ ] admin sign-in pass
- [ ] edit/publish -> public refresh pass
- [ ] xác nhận homepage/nav không chỉ đang fallback data

## 6) Nếu cần “minimum build gate” cực ngắn
1. [ ] Điền env thật
2. [ ] Xác nhận DB đã có homepage/nav/promo seed
3. [ ] `npm run build`
4. [ ] Mở `/en`
5. [ ] Mở `/admin/sign-in`
6. [ ] Edit 1 content và refresh homepage

Nếu 6 bước này pass thì có thể chuyển sang review/deploy demo build.
