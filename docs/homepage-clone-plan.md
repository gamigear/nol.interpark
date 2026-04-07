# Homepage Clone Plan — world.nol.com

Mục tiêu: clone homepage theo đúng bố cục và cảm giác UI của world.nol.com bằng Next.js App Router, ưu tiên component hóa rõ ràng để dev bám layout nhanh và dễ tinh chỉnh pixel-perfect.

## 1) Section list theo thứ tự đề xuất

1. **Header / Global Nav**
   - Logo, locale/language, menu chính, CTA/phần điều hướng phụ.
2. **Hero / Key Visual**
   - Hero banner lớn đầu trang.
   - Có thể là slider hoặc static hero tùy dữ liệu thực tế.
3. **This Week’s Top Tickets**
   - Section ticket nổi bật.
   - Dạng carousel/grid ngang với nhiều item.
4. **K-POP Fans Top Picks**
   - Section product/travel/activity nổi bật.
   - Dùng card thiên về ảnh và title.
5. **Promo / Seasonal Banner Strip**
   - Ví dụ block kiểu “HAPPY BIRTHDAY 🥳”.
   - Có thể là full-width promo divider.
6. **Top Things to Do in Busan**
   - Section curated products/destinations.
   - Có thể dùng cùng họ ProductCard.
7. **K-Food You Can’t Miss 😋**
   - Section editorial/content.
   - Card có image + title + subtitle + count.
8. **Travel Guides**
   - Section editorial/content thứ hai.
   - Cùng họ ContentCard, khác data source.
9. **Footer**
   - Footer điều hướng, legal, social/link phụ.

> Ghi chú: nếu lúc inspect chi tiết thấy homepage có thêm banner chen giữa hoặc split-layout section, vẫn nên giữ skeleton trên vì đây là khung hợp lý để clone và mapping component.

## 2) Mapping section -> component

| Section | Component đề xuất | Ghi chú |
|---|---|---|
| Header / Global Nav | `HomeHeader` | Shared layout component |
| Hero / Key Visual | `HeroSection` | Có thể tách `HeroCarousel` nếu có auto slide |
| This Week’s Top Tickets | `TicketShowcaseSection` | Render list `TicketCard` |
| K-POP Fans Top Picks | `ProductShowcaseSection` | Render list `ProductCard` |
| Promo / Seasonal Banner Strip | `PromoBannerSection` | Banner đơn hoặc đôi |
| Top Things to Do in Busan | `ProductCuratedSection` | Có thể reuse `ProductShowcaseSection` với props khác |
| K-Food You Can’t Miss 😋 | `ContentShowcaseSection` | Render list `ContentCard` |
| Travel Guides | `ContentGuideSection` | Reuse `ContentShowcaseSection` |
| Footer | `HomeFooter` | Shared layout component |

### Cây component gợi ý

```txt
app/(marketing)/page.tsx
└─ HomePage
   ├─ HomeHeader
   ├─ HeroSection
   ├─ TicketShowcaseSection
   │  └─ TicketCard[]
   ├─ ProductShowcaseSection
   │  └─ ProductCard[]
   ├─ PromoBannerSection
   ├─ ProductCuratedSection
   │  └─ ProductCard[]
   ├─ ContentShowcaseSection
   │  └─ ContentCard[]
   ├─ ContentGuideSection
   │  └─ ContentCard[]
   └─ HomeFooter
```

## 3) Mapping 3 họ card chính

## 3.1 TicketCard

**Dùng cho:** This Week’s Top Tickets  
**Nội dung chính:** poster, title, date range, venue

### Data shape tối thiểu

```ts
type TicketCardData = {
  id: string
  href: string
  image: string
  title: string
  dateText: string
  venue: string
}
```

### UI mapping

- `image`: poster ratio dọc, ưu tiên cover
- `title`: 2 line clamp
- `dateText`: text phụ
- `venue`: text phụ cấp 2
- Toàn card clickable

### Component đề xuất

- `TicketCard`
- `TicketCardImage`
- `TicketCardBody`
- `TicketCardMeta`

---

## 3.2 ProductCard

**Dùng cho:** K-POP Fans Top Picks, Top Things to Do in Busan  
**Nội dung chính:** image, title, optional badge/label, optional subtitle/price

### Data shape tối thiểu

```ts
type ProductCardData = {
  id: string
  href: string
  image: string
  title: string
  eyebrow?: string
  subtitle?: string
  badge?: string
}
```

### UI mapping

- `image`: ratio gần vuông hoặc landscape nhẹ, theo site gốc
- `badge`: text khuyến mãi / tag nổi bật
- `title`: 2 line clamp
- `subtitle`: optional, 1–2 line clamp
- Hover ưu tiên zoom ảnh nhẹ + shadow/translate rất nhỏ

### Component đề xuất

- `ProductCard`
- `ProductCardImage`
- `ProductCardBadge`
- `ProductCardBody`

---

## 3.3 ContentCard

**Dùng cho:** K-Food You Can’t Miss 😋, Travel Guides  
**Nội dung chính:** image, title, description ngắn, view count / popularity

### Data shape tối thiểu

```ts
type ContentCardData = {
  id: string
  href: string
  image: string
  title: string
  summary?: string
  metricText?: string
}
```

### UI mapping

- `image`: ratio vuông hoặc gần vuông
- `title`: 1–2 line clamp
- `summary`: 2 line clamp
- `metricText`: số view / popularity text nhỏ phía dưới
- Card thiên editorial nên spacing text cần thoáng hơn ProductCard

### Component đề xuất

- `ContentCard`
- `ContentCardImage`
- `ContentCardBody`
- `ContentCardMetric`

## 4) Checklist clone pixel-perfect

### Typography
- Match đúng font family, font weight, line-height.
- So khớp size giữa: section title, card title, meta text, footer text.
- Kiểm tra letter spacing nếu heading all caps hoặc mixed-case.

### Spacing
- Đo đúng khoảng cách:
  - section-to-section
  - title-to-list
  - image-to-text
  - text block internal spacing
- Giữ consistent gutter desktop/tablet/mobile.

### Image ratio
- Chốt ratio riêng cho từng card family.
- Không để ảnh nhảy chiều cao giữa item cùng hàng.
- Dùng `object-cover` + wrapper ratio cố định.

### Line clamp
- `TicketCard.title`: 2 lines
- `ProductCard.title`: 2 lines
- `ContentCard.title`: 1–2 lines
- `ContentCard.summary`: 2 lines
- Test trường hợp title dài và ngôn ngữ mixed Latin/Korean.

### Responsive
- Desktop: ưu tiên giống số cột / card width gốc.
- Tablet: giảm số cột nhưng giữ hierarchy rõ.
- Mobile: kiểm tra swipe carousel hoặc stacked list.
- Không để title wrap phá chiều cao card quá mạnh.

### Hover states
- Kiểm tra hover cho:
  - card image zoom nhẹ
  - card shadow/border
  - section link / CTA
  - nav item
- Animation ngắn, mượt, không quá phô.

## 5) Gợi ý server/client boundary

Nguyên tắc: **Server Component mặc định**, chỉ đẩy xuống Client khi cần slider, viewport logic, interaction state, hoặc event tracking gắn browser API.

| Component lớn | Boundary đề xuất | Lý do |
|---|---|---|
| `HomePage` | Server | Compose data + render skeleton chính |
| `HomeHeader` | Server | Nav tĩnh/server-driven; chỉ tách client nếu có mobile menu phức tạp |
| `HeroSection` | Server hoặc hybrid | Nếu hero static thì server; nếu slider/autoplay thì tách `HeroCarouselClient` |
| `TicketShowcaseSection` | Server | Fetch/render list trên server |
| `TicketCard` | Server | Pure presentational |
| `ProductShowcaseSection` | Server | Fetch/render list trên server |
| `ProductCard` | Server | Pure presentational |
| `PromoBannerSection` | Server | Banner tĩnh hoặc CMS-driven |
| `ProductCuratedSection` | Server | Pure listing section |
| `ContentShowcaseSection` | Server | Editorial list không cần client state |
| `ContentGuideSection` | Server | Tương tự trên |
| `ContentCard` | Server | Pure presentational |
| `Carousel controls / slider shell` | Client | Cần state, gesture, autoplay |
| `Mobile menu drawer` | Client | Cần toggle state và DOM interaction |

### Boundary pattern đề xuất

```txt
Server section
└─ Client shell (chỉ khi cần slider/interaction)
   └─ Server-rendered card data passed as props
```

Ví dụ:
- `TicketShowcaseSection` là server component.
- Nếu cần kéo ngang / snap / autoplay thì section render `TicketCarouselClient`.
- `TicketCarouselClient` chỉ nhận normalized card data, không tự fetch nếu chưa cần.

## 6) Implementation notes ngắn cho dev

- Tạo một `SectionHeader` reusable cho title + optional link.
- Normalize data trước khi xuống UI để card component giữ thuần presentational.
- Nếu site gốc dùng carousel, nên tách layer layout và layer interaction riêng để dễ clone UI trước, rồi gắn behavior sau.
- Ưu tiên token hóa spacing/radius/shadow để chỉnh pixel-perfect nhanh toàn trang.
- Khi clone, chụp đối chiếu theo từng section thay vì làm cả trang một lượt.
