# Task 1144 — Public regression / smoke summary

## Scope
Regression/smoke summary cho full public flow:
- homepage
- nav
- footer
- promos
- tickets
- top-picks
- guides
- story detail

## Environment note
Không chạy được full runtime build tại chỗ vì workspace hiện thiếu executable dependency:
- `npm run build` -> `sh: next: not found`

Vì vậy kết luận dưới đây là **static/code-path smoke + prior verification context**, không phải browser runtime proof hoàn chỉnh trong môi trường hiện tại.

---

## 1) Homepage
**Status:** PASS (code-path smoke)

### Why pass
- `src/app/(public)/[lang]/page.tsx` hiện render chain gọn:
  - hero
  - optional promo
  - featured tickets
  - top picks
  - editorial
  - travel guides
- Không còn các explanatory placeholder block lớn như trước.
- Homepage query path đã được xác minh ở các pass trước là DB-backed + safe fallback.

### Caveat
- Nếu DB thiếu data, homepage vẫn có thể lên nhờ fallback/synthetic path.

---

## 2) Nav
**Status:** PASS (code-path smoke)

### Why pass
- `src/app/(public)/[lang]/layout.tsx` đã dùng `getPublicShellData(lang)`.
- `src/lib/server/navigation/query.ts` có locale-aware read + safe fallback shell.
- Task 1114 đã xác minh mismatch localization của navigation repository đã được vá.

### Caveat
- Nav vẫn có fallback shell, nên runtime thật cần phân biệt DB-backed với fallback-backed.

---

## 3) Footer
**Status:** PASS with caveat

### Why pass
- Footer hiện đọc từ `shell.footerGroups` + `shell.footerNote`.
- Có fallback note/group khi DB navigation/footer chưa đủ.

### Caveat
- Readout file vẫn có dấu `[REDACTED]` ở vài JSX spots trong tool output, nên compile/runtime chưa được chứng minh tại chỗ.
- Logic-level thì path ổn; build thật vẫn cần xác nhận.

---

## 4) Promos
**Status:** PASS (code-path smoke)

### Why pass
- `src/lib/server/promos/repository-db.ts` hiện sạch syntax trong readout và đã locale-aware.
- `src/lib/server/promos/query.ts` có `try/catch`, fail-safe về `undefined`.
- Homepage chỉ render promo section khi có promo data.

### Caveat
- Nếu DB thiếu promo published thì homepage sẽ omit promo section, không crash.

---

## 5) Tickets route
**Status:** PASS with content-placeholder caveat

### Why pass
- `src/app/(public)/[lang]/tickets/page.tsx` dùng `getPublicListingViewModel(lang, 'tickets')`.
- Route shell, breadcrumbs, section header, cards, empty-state đều đã nối qua public content seam.

### Caveat
- Vẫn còn nhiều static support blocks:
  - `Booking tips`
  - `Before checkout`
  - final CTA block
- Nên pass về flow, chưa sạch hoàn toàn về content realism.

---

## 6) Top-picks route
**Status:** PASS with content-placeholder caveat

### Why pass
- Dùng `getPublicListingViewModel(lang, 'top-picks')`.
- Route flow và card rendering path ổn theo public seam.

### Caveat
- Vẫn còn static blocks:
  - `Pro tips`
  - `Selection guidance`
  - `Why top picks`
  - final CTA block

---

## 7) Guides route
**Status:** PASS with content-placeholder caveat

### Why pass
- Dùng `getPublicListingViewModel(lang, 'guides')`.
- Flow và card rendering path ổn.

### Caveat
- Vẫn còn khá nhiều static support content:
  - `Guide types`
  - `Planning reassurance`
  - `Before you go`
  - `Need help planning?`
  - `How to use guides`

---

## 8) Story detail
**Status:** PASS with notable model caveat

### Why pass
- Route `src/app/(public)/[lang]/stories/[slug]/page.tsx` đã nối `getPublicStoryDetailViewModel(lang, slug)`.
- Hero, overview section, related section, empty-state path đều có.

### Caveat
- Story detail hiện vẫn là placeholder architecture:
  - lookup story từ homepage editorial items
  - related stories lấy từ travel guides slice
  - còn nhiều static support blocks cuối page
  - body vẫn chỉ scaffold intro, chưa phải article model thật

---

## Tiny issues worth flagging (không vá trong pass này)
1. `npm run build` không chạy được trong workspace hiện tại do thiếu `next` binary/deps cài sẵn.
2. Một số file readout qua tool còn hiện `[REDACTED]` trong JSX/type positions; cần xác nhận lại bằng build thật để chắc không có syntax artifact.
3. Full public flow nhìn chung pass về code-path, nhưng tickets/top-picks/guides/story-detail vẫn còn static support content nên chưa phải clean content-final state.

---

## Final summary
### Overall public flow status
- **Homepage:** PASS
- **Nav:** PASS
- **Footer:** PASS with caveat
- **Promos:** PASS
- **Tickets:** PASS with placeholder-content caveat
- **Top-picks:** PASS with placeholder-content caveat
- **Guides:** PASS with placeholder-content caveat
- **Story detail:** PASS with model/content caveat

### Overall judgment
**PASS for regression/code-path smoke**, nhưng **chưa có full runtime build proof trong workspace hiện tại** vì environment thiếu dependency executable (`next`).

Nếu cần chốt release/demo confidence cao hơn, bước tiếp theo bắt buộc là:
1. cài dependencies đúng môi trường,
2. chạy `npm run build`,
3. smoke lại `/en` + listing routes + story detail trong runtime thật.
