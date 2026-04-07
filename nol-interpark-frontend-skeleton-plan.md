# nol.interpark clone — frontend implementation skeleton plan

## Goal
Clone nhanh UI `https://nol.interpark.com/` với mock data trước, ưu tiên:
- giống layout/spacing/chrome thật
- section/card reusable
- dễ thay mock bằng real data sau này
- giữ code đủ sạch để mở rộng

---

## 1) Recommended stack
- **Next.js App Router**
- **React + TypeScript**
- **Tailwind CSS** cho speed clone
- optional: **clsx/cva** cho variant management

Lý do:
- clone UI nhanh nhất nếu dùng App Router + server components cho page shell
- Tailwind hợp với phase pixel-ish clone hơn viết CSS thủ công dài dòng

---

## 2) App structure đề xuất
```txt
src/
  app/
    (public)/
      page.tsx
      layout.tsx
      globals.css
  components/
    chrome/
      site-header.tsx
      site-footer.tsx
      top-banner.tsx
      bottom-nav-mobile.tsx
    sections/
      hero-carousel-section.tsx
      category-grid-section.tsx
      ranking-section.tsx
      promo-banner-section.tsx
      curated-grid-section.tsx
      brand-strip-section.tsx
      section-shell.tsx
      section-header.tsx
    cards/
      event-card.tsx
      ranking-card.tsx
      category-card.tsx
      promo-card.tsx
      brand-card.tsx
    primitives/
      icon.tsx
      chip.tsx
      badge.tsx
      price-text.tsx
      carousel-controls.tsx
      container.tsx
    layout/
      responsive-image.tsx
      horizontal-scroller.tsx
  data/
    home.mock.ts
    categories.mock.ts
    ranking.mock.ts
    promos.mock.ts
  types/
    home.ts
    section.ts
    cards.ts
  lib/
    format.ts
    constants.ts
    image.ts
```

Nếu muốn clone rất nhanh ở phase đầu thì giữ chỉ 1 route homepage trước:
- `/` = full homepage clone

---

## 3) Page composition gợi ý
`app/(public)/page.tsx` chỉ nên compose data + section:

```tsx
<SiteHeader />
<TopBanner />
<HeroCarouselSection />
<CategoryGridSection />
<RankingSection />
<PromoBannerSection />
<CuratedGridSection />
<BrandStripSection />
<SiteFooter />
<BottomNavMobile />
```

Rule:
- page file mỏng
- mọi spacing/section wrapper nằm ở `SectionShell`
- card UI tách riêng để tái sử dụng

---

## 4) Component breakdown practical

### Chrome / shell
- `SiteHeader`
  - logo
  - search affordance
  - top nav tabs
  - utility icons/buttons
- `TopBanner`
  - dismissible visual strip nếu homepage thật có
- `SiteFooter`
  - footer links / legal / app download / sns
- `BottomNavMobile`
  - mobile sticky bottom nav nếu UI gốc có

### Section primitives
- `SectionShell`
  - max-width container
  - section padding
  - background/tone variant
- `SectionHeader`
  - title
  - subtitle
  - “more” link
  - optional tabs/chips

### Content sections
- `HeroCarouselSection`
  - main visual slides
  - CTA
  - dots/arrows
- `CategoryGridSection`
  - icon + label grid
- `RankingSection`
  - ranking tabs + ranking cards
- `PromoBannerSection`
  - wide promo strip or stacked banners
- `CuratedGridSection`
  - recommendation/event cards
- `BrandStripSection`
  - logos or brand pills row

### Card layer
- `EventCard`
  - poster
  - title
  - venue/date/price
  - badge
- `RankingCard`
  - rank number
  - poster
  - meta
- `CategoryCard`
  - icon/image + label
- `PromoCard`
  - background image + headline + CTA
- `BrandCard`
  - logo / label / background chip

Rule quan trọng:
- section quyết định layout
- card chỉ lo render item
- tránh nhét ranking logic vào card

---

## 5) Mock data shape đề xuất

### Home page view model
```ts
export type HomePageData = {
  hero: HeroSlide[]
  categories: CategoryItem[]
  rankingSections: RankingBlock[]
  promoBanners: PromoBanner[]
  curatedSections: CuratedBlock[]
  brands: BrandItem[]
}
```

### Hero
```ts
export type HeroSlide = {
  id: string
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  href?: string
  ctaLabel?: string
  badge?: string
}
```

### Category
```ts
export type CategoryItem = {
  id: string
  label: string
  icon?: string
  image?: string
  href: string
}
```

### Ranking block
```ts
export type RankingBlock = {
  id: string
  title: string
  tabs?: { id: string; label: string }[]
  items: RankingItem[]
}

export type RankingItem = {
  id: string
  rank: number
  title: string
  image: string
  meta?: string
  href: string
  badge?: string
}
```

### Curated content / product cards
```ts
export type CuratedBlock = {
  id: string
  title: string
  subtitle?: string
  moreHref?: string
  items: EventCardItem[]
}

export type EventCardItem = {
  id: string
  title: string
  image: string
  href: string
  venue?: string
  dateText?: string
  priceText?: string
  badge?: string
}
```

### Promo
```ts
export type PromoBanner = {
  id: string
  headline: string
  subheadline?: string
  image: string
  mobileImage?: string
  href?: string
  ctaLabel?: string
  theme?: 'light' | 'dark' | 'accent'
}
```

### Brand/logo strip
```ts
export type BrandItem = {
  id: string
  label: string
  logo?: string
  href?: string
}
```

---

## 6) Reusable implementation rules

### Reuse by data contract, not by page-specific hacks
Ví dụ:
- `SectionHeader` dùng cho ranking, curated, brands
- `HorizontalScroller` dùng cho mobile overflow nhiều section
- `ResponsiveImage` dùng cho hero/card/promo

### Keep variants shallow
Đừng tạo 20 variant sớm.
Chỉ cần:
- section tone: `default | subtle | dark`
- card size: `sm | md | lg`
- image ratio: `poster | square | wide`

---

## 7) Asset/image strategy

### Phase 1 — fastest clone
- dùng mock image URLs hoặc static files trong `public/mock/`
- đặt tên rõ:
```txt
public/mock/hero/
public/mock/categories/
public/mock/ranking/
public/mock/promos/
public/mock/brands/
```

### Image component strategy
- bọc `next/image` bằng `ResponsiveImage`
- props nên có:
  - `src`
  - `alt`
  - `ratio`
  - `priority`
  - `sizes`

### Practical note
Nếu đang clone chính xác UI từ screenshot/site:
- tải asset local cho hero/promo chính để UI ổn định
- card thumbnails có thể dùng remote placeholder trước

---

## 8) Responsive notes

### Breakpoints tối thiểu
- **mobile**: 360–767
- **tablet**: 768–1023
- **desktop**: 1024+
- **wide desktop**: 1280+

### Responsive rules
- header desktop ≠ header mobile → tách layout rõ, đừng cố 1 markup cho mọi breakpoint nếu quá rối
- section card grids:
  - mobile: horizontal scroller hoặc 2-col compact
  - desktop: fixed grid/rail
- hero:
  - mobile nên có image riêng hoặc crop riêng
- footer:
  - mobile accordion/simple stack
  - desktop multi-column

### Important clone note
Thứ làm UI clone giống thật nhất thường là:
- spacing rhythm
- image ratio
- typography hierarchy
- border radius + shadows
- background section changes

Không phải số lượng component.

---

## 9) CSS/token baseline
Nên chốt token sớm:
- container width
- section vertical spacing
- card radius
- shadow style
- neutral gray scale
- primary accent color
- font scale for hero / section / card title

Ví dụ:
- `--container: 1200px`
- `--radius-card: 16px`
- `--section-gap: 56px`
- `--hero-title-size: clamp(28px, 4vw, 52px)`

Nếu dùng Tailwind:
- extend spacing, colors, radius trong theme
- đừng hardcode random class values ở mọi component

---

## 10) Build order khuyến nghị
### Batch 1 — shell + hero
1. `layout.tsx`
2. `SiteHeader`
3. `HeroCarouselSection`
4. base tokens / container / responsive image

### Batch 2 — core home sections
5. `CategoryGridSection`
6. `RankingSection`
7. `EventCard` / `RankingCard`
8. `PromoBannerSection`

### Batch 3 — polish
9. `BrandStripSection`
10. `SiteFooter`
11. mobile bottom nav
12. hover states / skeleton polish / spacing tune

---

## 11) Practical rule for accurate clone
Nếu mục tiêu là **clone chính xác UI**:
- chụp screenshot từng zone
- implement theo zone, không theo page toàn cục
- mỗi zone có 1 mock contract riêng
- chỉ abstract sau khi có ít nhất 2 chỗ dùng giống nhau

Nói thẳng: clone nhanh thì đừng over-engineer từ đầu.
Nhưng vẫn nên giữ:
- page mỏng
- section riêng
- card riêng
- mock data typed

---

## 12) Short recommended skeleton
Nếu cần bản cực ngắn để bắt đầu ngay:
- `page.tsx` compose 6 sections
- `chrome/` cho header/footer
- `sections/` cho từng rail/banner/grid
- `cards/` cho reusable item cards
- `data/home.mock.ts` làm single source mock ban đầu
- `types/home.ts` chứa all section/item contracts
- `layout/responsive-image.tsx` + `layout/horizontal-scroller.tsx` là 2 helper đáng làm sớm nhất

## Final recommendation
Skeleton tốt nhất để clone nhanh mà không bẩn code:
- **Next.js + Tailwind + typed mock view model**
- **section-based page composition**
- **card-first reuse**
- **local/static asset strategy for hero/promo**
- **mobile/desktop layout split rõ ở header + key sections**

Đừng làm backend sớm. Chốt homepage clone giống trước đã.