import type {
  InterparkBrandItem,
  InterparkCategoryItem,
  InterparkCuratedBlock,
  InterparkHeroSlide,
  InterparkHomePageData,
  InterparkPromoBanner,
  InterparkRankingBlock,
} from '@/types/interpark';

const hero: InterparkHeroSlide[] = [
  {
    id: 'hero-concert-festival',
    title: '오늘의 공연과 전시를 한 번에',
    subtitle: 'NOL 인터파크 메인 히어로 구조를 빠르게 복제하기 위한 메인 비주얼 mock.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    href: '#hero-concert-festival',
    ctaLabel: '자세히 보기',
    badge: 'MAIN',
  },
  {
    id: 'hero-musical-week',
    title: '뮤지컬 · 콘서트 · 스포츠를 빠르게 탐색',
    subtitle: '히어로 슬라이드/배너/CTA 구조를 검증하기 위한 서브 mock slide.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
    href: '#hero-musical-week',
    ctaLabel: '예매 오픈 보기',
    badge: 'HOT',
  },
];

const categories: InterparkCategoryItem[] = [
  { id: 'cat-musical', label: '뮤지컬', href: '#category-musical' },
  { id: 'cat-concert', label: '콘서트', href: '#category-concert' },
  { id: 'cat-play', label: '연극', href: '#category-play' },
  { id: 'cat-classic', label: '클래식', href: '#category-classic' },
  { id: 'cat-exhibition', label: '전시/행사', href: '#category-exhibition' },
  { id: 'cat-sports', label: '스포츠', href: '#category-sports' },
  { id: 'cat-kids', label: '아동/가족', href: '#category-kids' },
  { id: 'cat-tour', label: '투어', href: '#category-tour' },
];

const rankingSections: InterparkRankingBlock[] = [
  {
    id: 'ranking-musical',
    title: '실시간 랭킹',
    tabs: [
      { id: 'tab-musical', label: '뮤지컬', href: '#ranking-musical' },
      { id: 'tab-concert', label: '콘서트', href: '#ranking-concert' },
      { id: 'tab-sports', label: '스포츠', href: '#ranking-sports' },
    ],
    items: [
      {
        id: 'rank-1',
        rank: 1,
        title: '브로드웨이 히트 뮤지컬 내한',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
        href: '#rank-1',
        meta: '서울 · 이번 주 인기',
        badge: 'HOT',
      },
      {
        id: 'rank-2',
        rank: 2,
        title: '오케스트라 스페셜 라이브',
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
        href: '#rank-2',
        meta: '예매 오픈',
      },
      {
        id: 'rank-3',
        rank: 3,
        title: '주말 스포츠 빅매치',
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80',
        href: '#rank-3',
        meta: '관람 포인트',
      },
    ],
  },
];

const promoBanners: InterparkPromoBanner[] = [
  {
    id: 'promo-membership-week',
    headline: '이번 주 회원 전용 할인',
    subheadline: '배너/프로모 슬롯 clone을 위한 wide banner mock data.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    href: '#promo-membership-week',
    ctaLabel: '혜택 보기',
    theme: 'dark',
  },
];

const curatedSections: InterparkCuratedBlock[] = [
  {
    id: 'curated-hot-now',
    title: '지금 많이 보는 공연',
    subtitle: '카드 그리드/section shell clone용 큐레이션 블록.',
    moreLabel: '전체 보기',
    moreHref: '#curated-hot-now',
    items: [
      {
        id: 'event-1',
        title: '도심 야외 재즈 페스티벌',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
        href: '#event-1',
        venue: '서울숲 야외무대',
        dateText: '2026.05.18 - 2026.05.20',
        priceText: '₩59,000부터',
        badge: '추천',
        ratio: 'poster',
      },
      {
        id: 'event-2',
        title: '오리지널 내한 콘서트 나이트',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
        href: '#event-2',
        venue: 'KSPO DOME',
        dateText: '2026.06.02',
        priceText: '₩88,000부터',
        ratio: 'poster',
      },
      {
        id: 'event-3',
        title: '가족과 함께 보는 체험 전시',
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80',
        href: '#event-3',
        venue: '코엑스 특별관',
        dateText: '상시 운영',
        priceText: '₩22,000부터',
        ratio: 'poster',
      },
    ],
  },
  {
    id: 'curated-weekly-picks',
    title: '이번 주 추천 기획전',
    subtitle: '프로모 카드/큐레이션 섹션 재사용 검증용 mock.',
    moreLabel: '더 보기',
    moreHref: '#curated-weekly-picks',
    items: [
      {
        id: 'event-4',
        title: '한정 수량 얼리버드 공연전',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
        href: '#event-4',
        venue: '기획전 전용',
        dateText: '이번 주 한정',
        priceText: '₩39,000부터',
        badge: 'LIMITED',
        ratio: 'wide',
      },
      {
        id: 'event-5',
        title: '주말 데이트 추천 라인업',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
        href: '#event-5',
        venue: '서울/부산',
        dateText: '큐레이션 모음',
        priceText: '₩45,000부터',
        ratio: 'wide',
      },
    ],
  },
];

const brands: InterparkBrandItem[] = [
  { id: 'brand-musical', label: 'MUSICAL', href: '#brand-musical' },
  { id: 'brand-concert', label: 'CONCERT', href: '#brand-concert' },
  { id: 'brand-sports', label: 'SPORTS', href: '#brand-sports' },
  { id: 'brand-kids', label: 'KIDS', href: '#brand-kids' },
  { id: 'brand-exhibition', label: 'EXHIBITION', href: '#brand-exhibition' },
];

export const interparkHomeMockData: InterparkHomePageData = {
  hero,
  categories,
  rankingSections,
  promoBanners,
  curatedSections,
  brands,
};
