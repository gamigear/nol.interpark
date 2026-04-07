import {
  DEFAULT_HOME_PAGE_LOCALE,
  resolveHomePageLocale,
  type AppRuntimeLocale,
  type HomePageData,
  type HomePageLocale,
} from '@/types/home';

const homeDataByLocale: Record<HomePageLocale, HomePageData> = {
  en: {
    heroTitle: 'Discover Dubai with one smart travel homepage',
    heroDescription:
      'Starter content structure for a world.nol.com-inspired landing page with tickets, curated picks, stories, and travel guides.',
    featuredTickets: {
      id: 'featured-tickets',
      title: 'Featured Tickets',
      description: 'Priority booking cards for attractions, passes, and transport experiences.',
      ctaLabel: 'View all tickets',
      ctaHref: '#featured-tickets',
      items: [
        {
          id: 'ticket-1',
          title: 'Museum of the Future',
          subtitle: 'Fast-track entry',
          priceLabel: 'From AED 149',
          badge: 'Best seller',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'ticket-2',
          title: 'Burj Khalifa At The Top',
          subtitle: 'Sunset slots available',
          priceLabel: 'From AED 179',
          badge: 'Popular',
          image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'ticket-3',
          title: 'Dubai Frame',
          subtitle: 'Anytime admission',
          priceLabel: 'From AED 52',
          badge: 'Family friendly',
          image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    topPicks: {
      id: 'top-picks',
      title: 'Top Picks',
      description: 'Flexible card grid for merchandising hero products and bundles.',
      ctaLabel: 'Explore picks',
      ctaHref: '#top-picks',
      items: [
        {
          id: 'product-1',
          title: 'Dubai Unlimited Pass',
          category: 'City pass',
          description: 'One pass template card to group multi-attraction offers.',
          priceLabel: 'From AED 499',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'product-2',
          title: 'Desert Safari Bundle',
          category: 'Adventure',
          description: 'Good placeholder for experience-led merchandising blocks.',
          priceLabel: 'From AED 229',
          image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'product-3',
          title: 'Dubai Metro Day Access',
          category: 'Transport',
          description: 'Represents utility-first products mixed into the homepage.',
          priceLabel: 'From AED 20',
          image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    editorial: {
      id: 'editorial',
      title: 'Editorial',
      description: 'Story-driven content shelf for featured articles and seasonal highlights.',
      ctaLabel: 'Read stories',
      ctaHref: '#editorial',
      items: [
        {
          id: 'story-1',
          title: 'A first-timer guide to navigating Dubai',
          excerpt: 'Use this block for long-form editorial curation and travel inspiration.',
          eyebrow: 'City stories',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'story-2',
          title: 'Where to go after sunset in Downtown Dubai',
          excerpt: 'Supports magazine-like cards with text emphasis.',
          eyebrow: 'Nightlife',
          image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'story-3',
          title: '3-day itinerary for culture, food, and views',
          excerpt: 'Reusable content rail for future CMS integration.',
          eyebrow: 'Itinerary',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    travelGuides: {
      id: 'travel-guides',
      title: 'Travel Guides',
      description: 'Structured destination helper cards for planning and discovery.',
      ctaLabel: 'See guides',
      ctaHref: '#travel-guides',
      items: [
        {
          id: 'guide-1',
          title: 'How to use public transport in Dubai',
          excerpt: 'A placeholder guide card ready for route planning content.',
          eyebrow: 'Transport guide',
          image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'guide-2',
          title: 'Best neighborhoods for visitors',
          excerpt: 'Use this section to expand into geo-specific planning content.',
          eyebrow: 'Neighborhoods',
          image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'guide-3',
          title: 'What to book before you arrive',
          excerpt: 'Designed for practical evergreen guidance blocks.',
          eyebrow: 'Planning tips',
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
  },
  ar: {
    heroTitle: 'اكتشف دبي من خلال صفحة سفر ذكية واحدة',
    heroDescription:
      'هيكل أولي مستوحى من world.nol.com لعرض التذاكر، الترشيحات، القصص، وأدلة السفر.',
    featuredTickets: {
      id: 'featured-tickets',
      title: 'التذاكر المميزة',
      description: 'بطاقات مبدئية للتذاكر والأنشطة وتجارب التنقل.',
      ctaLabel: 'عرض كل التذاكر',
      ctaHref: '#featured-tickets',
      items: [
        {
          id: 'ticket-ar-1',
          title: 'متحف المستقبل',
          subtitle: 'دخول سريع',
          priceLabel: 'ابتداءً من 149 درهم',
          badge: 'الأكثر مبيعاً',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'ticket-ar-2',
          title: 'برج خليفة - القمة',
          subtitle: 'مواعيد الغروب متاحة',
          priceLabel: 'ابتداءً من 179 درهم',
          badge: 'شائع',
          image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'ticket-ar-3',
          title: 'برواز دبي',
          subtitle: 'دخول مرن',
          priceLabel: 'ابتداءً من 52 درهم',
          badge: 'مناسب للعائلة',
          image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    topPicks: {
      id: 'top-picks',
      title: 'اختياراتنا',
      description: 'شبكة بطاقات قابلة للتوسعة لمنتجات وعروض رئيسية.',
      ctaLabel: 'استكشف الاختيارات',
      ctaHref: '#top-picks',
      items: [
        {
          id: 'product-ar-1',
          title: 'بطاقة دبي غير المحدودة',
          category: 'بطاقة مدينة',
          description: 'بطاقة مبدئية لعرض العروض متعددة الوجهات.',
          priceLabel: 'ابتداءً من 499 درهم',
          image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'product-ar-2',
          title: 'باقة سفاري الصحراء',
          category: 'مغامرات',
          description: 'مثال على بطاقات التجارب المميزة في الواجهة الرئيسية.',
          priceLabel: 'ابتداءً من 229 درهم',
          image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'product-ar-3',
          title: 'استخدام مترو دبي ليوم كامل',
          category: 'تنقل',
          description: 'عنصر تمهيدي لدمج المنتجات العملية مع المحتوى.',
          priceLabel: 'ابتداءً من 20 درهم',
          image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    editorial: {
      id: 'editorial',
      title: 'التحرير',
      description: 'رف قصصي للمقالات والمحتوى الموسمي.',
      ctaLabel: 'اقرأ القصص',
      ctaHref: '#editorial',
      items: [
        {
          id: 'story-ar-1',
          title: 'دليل المرة الأولى للتنقل في دبي',
          excerpt: 'مكان مناسب لبناء محتوى تحريري طويل لاحقاً.',
          eyebrow: 'قصص المدينة',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'story-ar-2',
          title: 'إلى أين تذهب بعد الغروب في وسط دبي',
          excerpt: 'يدعم بطاقات أقرب للمجلة مع تركيز أكبر على النص.',
          eyebrow: 'الحياة الليلية',
          image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'story-ar-3',
          title: 'برنامج 3 أيام للثقافة والطعام والإطلالات',
          excerpt: 'قابل لإعادة الاستخدام مع CMS لاحقاً.',
          eyebrow: 'برنامج الرحلة',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
    travelGuides: {
      id: 'travel-guides',
      title: 'أدلة السفر',
      description: 'بطاقات مساعدة منظمة للتخطيط والاستكشاف.',
      ctaLabel: 'عرض الأدلة',
      ctaHref: '#travel-guides',
      items: [
        {
          id: 'guide-ar-1',
          title: 'كيفية استخدام النقل العام في دبي',
          excerpt: 'بطاقة مبدئية لمحتوى التخطيط والتنقل.',
          eyebrow: 'دليل التنقل',
          image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'guide-ar-2',
          title: 'أفضل الأحياء للزوار',
          excerpt: 'يسهل توسيعه إلى محتوى جغرافي مفصل.',
          eyebrow: 'الأحياء',
          image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
        {
          id: 'guide-ar-3',
          title: 'ما الذي يجب حجزه قبل الوصول',
          excerpt: 'مناسب للمحتوى الإرشادي العملي طويل الأمد.',
          eyebrow: 'نصائح التخطيط',
          image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
          href: '#',
        },
      ],
    },
  },
};

const storyHrefByIndex = [
  'dubai-first-timer-guide',
  'downtown-dubai-after-sunset',
  'dubai-3-day-itinerary',
] as const;

function buildPublicLocaleHref(locale: AppRuntimeLocale, segment: string) {
  return `/${locale}/${segment}`;
}

export function getHomePageData(lang: string): HomePageData {
  const routeLocale: AppRuntimeLocale = lang;
  const locale = resolveHomePageLocale(lang);
  const baseData = homeDataByLocale[locale];

  return {
    ...baseData,
    featuredTickets: {
      ...baseData.featuredTickets,
      ctaHref: buildPublicLocaleHref(routeLocale, 'tickets'),
      items: baseData.featuredTickets.items.map((item) => ({
        ...item,
        href: buildPublicLocaleHref(routeLocale, 'tickets'),
      })),
    },
    topPicks: {
      ...baseData.topPicks,
      ctaHref: buildPublicLocaleHref(routeLocale, 'top-picks'),
      items: baseData.topPicks.items.map((item) => ({
        ...item,
        href: buildPublicLocaleHref(routeLocale, 'top-picks'),
      })),
    },
    editorial: {
      ...baseData.editorial,
      ctaHref: buildPublicLocaleHref(routeLocale, 'stories/dubai-first-timer-guide'),
      items: baseData.editorial.items.map((item, index) => ({
        ...item,
        href: buildPublicLocaleHref(routeLocale, `stories/${storyHrefByIndex[index] ?? storyHrefByIndex[0]}`),
      })),
    },
    travelGuides: {
      ...baseData.travelGuides,
      ctaHref: buildPublicLocaleHref(routeLocale, 'guides'),
      items: baseData.travelGuides.items.map((item) => ({
        ...item,
        href: buildPublicLocaleHref(routeLocale, 'guides'),
      })),
    },
  };
}
