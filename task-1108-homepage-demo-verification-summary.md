# Task 1108 — Homepage demo verification pass

## Verification scope
Public homepage demo path after DB-backed wiring.
Checked paths/components:
- `src/app/(public)/[lang]/page.tsx`
- `src/lib/server/homepage/*`
- `src/lib/server/promos/*`
- core homepage sections render chain

## Files touched during this verification
### Modified
- `src/lib/server/homepage/repository.ts`

### Why changed
Trong verification pass, phát hiện fallback/synthetic path vẫn tạo block `top-picks` bằng:
- `blockType = 'nav_highlight'`

Trong khi homepage adapter mới đã chuyển `topPicks` sang:
- `blockType = 'featured_catalog'`
- preferred key `top-picks` / `home-top-picks`

Nếu để nguyên, khi homepage đi vào fallback/db-like synthetic path thì `topPicks` có thể bị lệch semantic với adapter và không phản ánh logic mới đã dùng cho real DB-backed read.

Đã sửa:
- `src/lib/server/homepage/repository.ts`
- synthetic `top-picks` block type: `nav_highlight` → `featured_catalog`

---

## Verification result
## STATUS: PASS WITH ENV-LIMITED RUNTIME CHECK

### Ý nghĩa của kết luận này
- **Pass về code-path / logic consistency**: homepage demo path hiện nhất quán và có fallback an toàn.
- **Không xác nhận được full runtime build bằng local command** do environment hiện tại thiếu executable/deps:
  - `npm run build` → `sh: next: not found`
  - `npx tsc --noEmit` không dùng được compiler project trong môi trường này

Tức là:
- không thấy blocker code-level mới trong phạm vi homepage demo path sau khi rà
- đã fix 1 blocker logic thật trong fallback path
- phần “runtime command verification” bị giới hạn bởi environment, không phải lỗi repo đã xác nhận được

---

## Slice-by-slice status
### 1) Hero
**Status:** OK

**Source behavior:**
- Ưu tiên `hero` block localization title/subtitle
- fallback sang `pageLocalization`
- fallback cuối sang seed/home mock data

**Assessment:**
- Render path rõ ràng
- Không có điểm crash thấy được trong current code
- Hero luôn có nội dung usable ngay cả khi DB chưa đủ

---

### 2) Promo slot
**Status:** OK (safe fallback)

**Source behavior:**
- Query promo blocks từ DB qua `fetchPromoBlocks(locale, 'runtime')`
- localization có locale filter
- `getPromosViewModel()` bọc `try/catch` và return `undefined` nếu lỗi
- homepage route chỉ render promo section khi có promo

**Assessment:**
- Promo path không còn làm crash homepage nếu DB lỗi/trống
- repository-db mới đã sạch syntax/encoding
- Đây là fallback behavior đúng cho demo run

---

### 3) Featured tickets
**Status:** OK

**Source behavior:**
- map từ `featured_catalog`
- ưu tiên key `featured-tickets` / `home-featured-tickets`
- item fields lấy từ `overrideJson`
- fallback seed nếu block chưa có hoặc items trống

**Assessment:**
- Logic consistent
- render path rõ ràng
- usable cho demo

---

### 4) Top picks
**Status:** OK after blocker fix chain review

**Source behavior:**
- adapter mới map `topPicks` từ `featured_catalog`
- ưu tiên key `top-picks` / `home-top-picks`
- không còn dùng `nav_highlight`

**Verification finding:**
- fallback synthetic repository trước đó vẫn dùng `nav_highlight`
- đã vá thành `featured_catalog`

**Assessment:**
- Đây là blocker logic quan trọng nhất trong pass này
- Sau fix, top picks path đã nhất quán giữa:
  - adapter
  - synthetic/db-like fallback
  - expected source-to-schema mapping

---

### 5) Editorial
**Status:** OK

**Source behavior:**
- map từ `editorial_grid`
- ưu tiên key `editorial` / `home-editorial`
- fallback seed an toàn

**Assessment:**
- Không thấy blocker code-level
- render path ổn

---

### 6) Travel guides
**Status:** OK

**Source behavior:**
- map từ `travel_guides`
- ưu tiên key `travel-guides` / `home-travel-guides`
- fallback seed an toàn

**Assessment:**
- Không thấy blocker code-level
- render path ổn

---

## Homepage route render status
### `src/app/(public)/[lang]/page.tsx`
**Status:** OK

Current homepage render tree đã sạch hơn cho demo:
- hero
- promo section (optional)
- featured tickets
- top picks
- editorial
- travel guides
- 1 lightweight empty-state chỉ khi promo vắng và core catalog slices không có items

**Assessment:**
- Không còn các khối explanatory/internal placeholder lớn như trước
- Hợp lý cho demo path

---

## Important blockers found/fixed in this pass
### Fixed
1. **Synthetic fallback mismatch for top picks**
   - file: `src/lib/server/homepage/repository.ts`
   - fix: `nav_highlight` → `featured_catalog`

### Not a repo blocker, but environment limitation
1. **Cannot run full local build command in current environment**
   - `next` executable unavailable locally
   - project TypeScript compiler not resolvable via current `npx tsc` path

---

## Final judgment
### Homepage demo path: PASS
with note:
- pass dựa trên code-path verification + consistency review + blocker fix
- runtime CLI verification bị hạn chế bởi environment hiện tại, không phải blocker repo đã xác nhận

### Slices currently rendering OK
- Hero
- Promo slot (or safe omission)
- Featured tickets
- Top picks
- Editorial
- Travel guides

### Fallback behavior currently acceptable for demo
- DB missing/trống → homepage vẫn render bằng fallback seed/db-like records
- promo query lỗi → promo section bị bỏ qua, homepage không crash
- section thiếu items → section-level empty state vẫn usable
