# Phase 5A discovery summary

## Những gì đã xác nhận
- Team workspace hiện có các thư mục chính: `docs/`, `src/`, `.env.example`.
- Repo trong team workspace không có `package.json` ở root, nên cần bám vào code tree hiện có thay vì giả định dependency setup.
- Admin surface đã có protected App Router shell tại `src/app/(admin-protected)/admin`.
- `src/app/(admin-protected)/admin/layout.tsx` đang gate bằng `requireAdminSession()` rồi render `AdminShell`.
- `src/app/(admin-protected)/admin/page.tsx` redirect về `/admin/dashboard`.
- Dashboard hiện mới là placeholder foundation.

## Điều đã đọc ở admin shell
- `src/components/admin/layout/admin-navigation.ts` đang dùng IA tạm với các route kiểu:
  - `/admin/content/home`
  - `/admin/content/navigation`
  - `/admin/content/promos`
- IA docs lại định hướng route canonical theo module riêng:
  - `/admin/homepage/*`
  - `/admin/navigation/*`
  - `/admin/promos/*`
- Điều này cho thấy Phase 5A có thể cần vừa implement flow usable, vừa chỉnh route wiring/navigation entry để khớp IA tốt hơn.

## Điều đã đọc ở docs
- `docs/admin-ia-mvp.md` xác nhận 3 module cần ưu tiên mạnh ở admin side là:
  - Homepage Composer
  - Navigation
  - Promos & Banners
- Các flow mong đợi gồm:
  - list/editor/form
  - save draft / publish
  - validation inline
  - preview / quick navigation
- `docs/task-3-working-summary.md` chủ yếu là summary homepage public UI, không phải implementation CMS usable.

## Foundation server đã thấy
- `src/lib/server/` có các vùng `auth/`, `db/`, `env/`.
- `src/lib/server/db/` có các file `config.ts`, `index.ts`, `schema-types.ts`, `types.ts`.
- `src/lib/server/env/` có `constants.ts`, `index.ts`.
- Chưa đọc sâu nội dung DB/env ở bước này, nhưng đã xác nhận có foundation Phase 2 để bám vào.

## Khoảng trống hiện tại
- Chưa thấy thư mục route thật cho 3 module tại `src/app/(admin-protected)/admin/homepage`, `navigation`, `promos`.
- Chưa thấy bằng chứng list/editor/forms usable cho 3 module trong những phần đã đọc.
- Cần đọc tiếp các component admin, types và mock/server modules để xác định phần nào đã có từ phase 3.

## Hướng implement tiếp theo
1. Đọc sâu `src/components/admin/*`, `src/lib/server/*`, `src/types/*` liên quan CMS.
2. Xác định contract/types đã có cho homepage/navigation/promos.
3. Tạo route tree usable hơn cho 3 module.
4. Thêm typed payloads + validation boundary + structured server actions/placeholders.
5. Gắn save draft / publish UX cơ bản và update navigation entry.
