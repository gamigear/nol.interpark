# Phase 2 — Env & DB foundation standardization

Tài liệu này chốt các quyết định phase 2 để team có thể nối Neon/Vercel/admin auth vào code thật ở phase tiếp theo mà không phải sửa lại naming hoặc structure thêm lần nữa.

## 1. Env naming đã chuẩn hóa

File nguồn: `.env.example`

### App/runtime
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DEFAULT_LOCALE`
- `NEXT_PUBLIC_SUPPORTED_LOCALES`

### Neon/PostgreSQL
- `DATABASE_URL` — ưu tiên pooled connection cho runtime serverless
- `DATABASE_DIRECT_URL` — direct connection cho migration/tooling
- `DATABASE_PROVIDER`
- `DATABASE_BRANCH`
- `DATABASE_SSL_MODE`

### Admin auth
- `ADMIN_AUTH_MODE`
- `ADMIN_SESSION_COOKIE_NAME`
- `ADMIN_SESSION_COOKIE_SECURE`
- `ADMIN_SESSION_TTL_SECONDS`
- `ADMIN_SESSION_SECRET`
- `ADMIN_ALLOWED_EMAIL_DOMAINS`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_NAME`
- `ADMIN_BOOTSTRAP_ROLE`
- `AUTH_TRUST_HOST`
- `AUTH_URL`
- `AUTH_SECRET`

### Vercel/media/internal ops
- `VERCEL_ENV`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_GIT_COMMIT_REF`
- `MEDIA_STORAGE_PROVIDER`
- `BLOB_READ_WRITE_TOKEN`
- `REVALIDATE_SECRET`

## 2. Cấu trúc code đã thêm

```txt
src/lib/server/
  auth/
    config.ts
  db/
    config.ts
    index.ts
    schema-types.ts
    types.ts
  env/
    constants.ts
    index.ts
```

## 3. Ý nghĩa từng cụm

### `server/env`
- gom tên biến môi trường vào một chỗ
- parse string/boolean/number/csv có fallback rõ ràng
- chỉ cho phép gọi ở server runtime

### `server/db`
- chuẩn hóa khái niệm `intent`:
  - `runtime` -> pooled
  - `migration` -> direct
  - `tooling` -> direct
- chưa bind driver thật, nhưng đã có typed placeholder để phase sau gắn `pg`, `postgres.js`, Neon driver hoặc Drizzle
- expose health snapshot để debug cấu hình sớm

### `server/auth`
- gom cấu hình admin auth từ env
- cho phép lớp mock hiện tại lấy cookie name/bootstrap user từ config thay vì hardcode
- chừa chỗ cho phase sau nối credentials/external auth

## 4. Typed placeholders đã chốt

### DB
- `DatabaseConfig`
- `DatabaseHealthSnapshot`
- `DatabaseClientPlaceholder`
- `DatabaseConnectionIntent`
- `DatabaseConnectionMode`
- `DatabaseDriverAdapter`

### Schema shape
Trong `schema-types.ts` đã thêm các record/type nền bám theo tài liệu `neon-schema-mvp.md` cho:
- locale
- admin user
- page
- page localization
- content block
- content block localization
- content block item

Các type này chưa phải ORM schema, nhưng đủ để service/repository layer phase sau code theo contract ổn định hơn thay vì bám mock UI shape.

## 5. Những gì vẫn còn thiếu để nối DB thật

1. Chọn/gắn driver thực tế (`pg`, `postgres.js`, Neon serverless, hoặc Drizzle)
2. Thêm `package.json` + `tsconfig.json` nếu repo chưa có
3. Viết schema code / migration code thật
4. Tạo repository/query layer thật cho homepage, navigation, promo, admin auth
5. Thay mock session validation bằng auth provider hoặc credentials flow thật
6. Nối revalidation hooks sau publish/update trong admin

## 6. Quy ước sử dụng ở phase sau

- Public/server component queries: ưu tiên `DATABASE_URL`
- Migration/tooling/admin scripts cần session ổn định: dùng `DATABASE_DIRECT_URL`
- Không đọc `process.env` rải rác trong business code; đi qua `getServerEnv()` hoặc config modules
- Không hardcode cookie/admin bootstrap defaults ngoài auth config module
