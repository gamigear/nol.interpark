# Task 1147 — Public board 13: complete navigation and header rendering on public

## Scope delivered
Hoàn thiện navigation/header ở public, tập trung vào:
- labels
- hrefs
- ordering
- render behavior
- giảm hardcode mơ hồ
- bám đúng data path thật từ shell query

---

## Files touched
### Modified
1. `src/lib/server/navigation/query.ts`
2. `src/components/layout/site-header.tsx`

### Reviewed in this pass
3. `src/lib/server/navigation/repository-db.ts`
4. `src/app/(public)/[lang]/layout.tsx`

---

## Main problems addressed
### 1) Header action selection was still too brittle
Dù đã tốt hơn trước, header vẫn còn hơi mơ hồ ở chỗ:
- sign-in và primary CTA phụ thuộc khá nhiều vào expected ids
- nếu import batch đổi nhẹ labels/ids hoặc thứ tự, render behavior vẫn có thể chọn sai action

### 2) Navigation/footer grouping logic was still missing some shell semantics
Ở `src/lib/server/navigation/query.ts`:
- footer group kind/title/order chưa có helper rõ ràng
- fallback title/order cho footer groups còn mơ hồ
- data model chưa thật sự “finished” ở layer mapping

### 3) Brand/home href vẫn còn phụ thuộc ngầm vào imported nav shape
Brand link không nên bị ảnh hưởng bởi primary nav data ngẫu nhiên. Nó nên trỏ thẳng về locale root.

---

## Changes made
## 1) `src/lib/server/navigation/query.ts`
Đã hoàn thiện mapper layer cho shell navigation/footer.

### Added helpers
- `inferFooterGroupKind(key)`
- `footerGroupRank(key)`
- `fallbackFooterGroupTitle(kind, locale, key)`

### What these do
- suy ra `kind` từ block key như:
  - `footer-support`
  - `footer-legal`
  - `footer-social`
  - `footer-info`
- sắp xếp footer groups ổn định theo thứ tự semantic:
  - explore
  - info
  - support
  - social
  - legal
- cấp fallback title rõ ràng theo locale nếu localization title thiếu

### Also confirmed/used
- `mapLinks()` sort theo `displayOrder`
- locale-aware shell fetch vẫn đi qua `fetchNavigationBlocks(resolvedLocale, 'runtime')`
- fallback shell data vẫn hoạt động an toàn

**Impact:**
- navigation/footer shell mapping giờ bớt mơ hồ
- footer groups có type/order/title rõ hơn
- public render ổn định hơn với import batch khác nhau

---

## 2) `src/components/layout/site-header.tsx`
Đã làm header render behavior semantic hơn.

### Changes
- `signInLink` giờ resolve theo thứ tự:
  1. `id === 'sign-in'`
  2. heuristic match id/label: `sign|login|account`
  3. fallback `secondaryLinks[0]`

- `primaryAction` giờ resolve theo thứ tự:
  1. `id === 'plan-trip'`
  2. heuristic match id/label: `plan|book|ticket`
  3. secondary link khác signIn
  4. fallback `primaryLinks[0]`

- `homeHref` được chốt về:
  - `/${resolvedLang}`
  thay vì phụ thuộc shape của imported primary link

### Why this matters
- Header không còn quá phụ thuộc vào array position hoặc exact imported ids duy nhất.
- Import batch đổi nhẹ labels/keys vẫn có khả năng render đúng intent tốt hơn.
- Brand link luôn về đúng locale homepage.

**Impact:**
- header actions ổn định hơn
- labels/hrefs/render behavior bám semantic hơn
- giảm hardcode mơ hồ còn sót trong public header

---

## Public navigation/header parts now completed
### Header brand render
- label/subtitle lấy từ shell data path
- fallback copy nếu thiếu
- brand href luôn về locale root đúng

### Primary navigation render
- lấy từ `shell.primary`
- data path thật từ `getPublicShellData(lang)`
- order ổn định theo `displayOrder`
- href/target/badge qua item override mapping

### Secondary header actions
- lấy từ `shell.secondary`
- resolve semantic tốt hơn theo id + heuristic
- fallback an toàn nếu import chưa chuẩn hoàn toàn

### Locale-aware fetch path
- public layout gọi `getPublicShellData(lang)`
- shell query gọi navigation repository theo locale
- repository giữ locale fallback `en`

### Footer-adjacent navigation semantics
- footer groups giờ có semantic kind rõ hơn
- order/title fallback rõ hơn ở mapping layer
- không còn kiểu render footer groups mơ hồ theo thứ tự block thô

---

## What still remains fallback by design
Các phần sau vẫn là fallback có chủ đích, không phải main data path:
- fallback brand/subtitle copy
- fallback sign-in / plan-trip labels
- fallback shell nav khi import thiếu `header-primary` hoặc `header-secondary`
- fallback footer group titles khi localization title chưa có

Tức là:
- render path chính = DB-backed shell query
- fallback chỉ là guardrail

---

## Final status
## STATUS: PASS

### Why pass
- public header/navigation render đi qua data path thật
- order được siết ổn định hơn
- action resolution ở header semantic hơn, bớt brittle
- brand href không còn phụ thuộc nhầm imported nav item
- footer/navigation shell semantics ở query layer đã sạch hơn

---

## Short conclusion
Board 13 đã hoàn thiện phần navigation/header ở public theo hướng thực dụng: render path thật qua shell query vẫn được giữ nguyên, nhưng mapper và header resolution đã được làm chặt hơn để labels/hrefs/order/render behavior không còn phụ thuộc mơ hồ vào thứ tự import hoặc ids quá cứng. Phần hardcode còn lại chủ yếu là fallback guardrail, không còn là source chính của public header/navigation nữa.
