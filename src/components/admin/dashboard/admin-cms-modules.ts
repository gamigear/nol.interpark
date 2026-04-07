import type { PublishStatus } from '@/lib/server/db/schema-types';

export type AdminCmsModuleKey = 'homepage' | 'navigation' | 'promos';
export type AdminCmsWorkflowAction = 'save_draft' | 'schedule' | 'publish' | 'archive';

export type AdminCmsAction = {
  label: string;
  href?: string;
  tone?: 'primary' | 'secondary' | 'ghost';
};

export type AdminCmsStatusTone = 'draft' | 'scheduled' | 'published' | 'archived' | 'neutral';

export type AdminCmsStatus = {
  label: string;
  tone: AdminCmsStatusTone;
};

export type AdminCmsListItem = {
  id: string;
  title: string;
  description: string;
  locale?: string;
  owner?: string;
  updatedAt: string;
  status: AdminCmsStatus;
};

export type AdminCmsField = {
  label: string;
  value: string;
  helper?: string;
};

export type AdminCmsActivity = {
  title: string;
  detail: string;
};

export type AdminCmsWorkflowStep = {
  label: string;
  detail: string;
};

export type AdminCmsSubmissionPreset = {
  label: string;
  action: AdminCmsWorkflowAction;
  nextStatus: PublishStatus;
  submitLabel: string;
  note: string;
};

export type AdminCmsModuleViewModel = {
  key: AdminCmsModuleKey;
  title: string;
  eyebrow: string;
  description: string;
  primaryAction: AdminCmsAction;
  secondaryAction?: AdminCmsAction;
  summaryStats: Array<{ label: string; value: string; helper: string }>;
  listTitle: string;
  listDescription: string;
  listItems: AdminCmsListItem[];
  editorTitle: string;
  editorDescription: string;
  fields: AdminCmsField[];
  workflowTitle: string;
  workflowDescription: string;
  workflowStatuses: AdminCmsWorkflowStep[];
  submissionPresets: AdminCmsSubmissionPreset[];
  recentActivity: AdminCmsActivity[];
};

export function toAdminCmsStatusTone(status: PublishStatus): AdminCmsStatusTone {
  switch (status) {
    case 'draft':
      return 'draft';
    case 'scheduled':
      return 'scheduled';
    case 'published':
      return 'published';
    case 'archived':
      return 'archived';
    default:
      return 'neutral';
  }
}

export function makeAdminCmsStatus(status: PublishStatus): AdminCmsStatus {
  return {
    label: status[0].toUpperCase() + status.slice(1),
    tone: toAdminCmsStatusTone(status),
  };
}

export const adminCmsWorkflowActionLabels: Record<AdminCmsWorkflowAction, string> = {
  save_draft: 'Save draft',
  schedule: 'Schedule',
  publish: 'Publish',
  archive: 'Archive',
};

export const adminCmsModules: Record<AdminCmsModuleKey, AdminCmsModuleViewModel> = {
  homepage: {
    key: 'homepage',
    title: 'Homepage Composer',
    eyebrow: 'Content module',
    description:
      'Scaffold quản trị cho hero, featured tickets, top picks, editorial và travel guides trên homepage.',
    primaryAction: { label: 'Open composer shell', href: '/admin/homepage' },
    secondaryAction: { label: 'Preview publish flow', tone: 'secondary' },
    summaryStats: [
      { label: 'Sections configured', value: '5', helper: 'Hero, featured tickets, top picks, editorial, guides.' },
      { label: 'Locales in scope', value: '2', helper: 'EN và AR theo home page type foundation.' },
      { label: 'Blocks in draft', value: '3', helper: 'Chờ nối persistence thật ở phase sau.' },
    ],
    listTitle: 'Section inventory',
    listDescription: 'Các section chính trên homepage với trạng thái biên tập và locale coverage.',
    listItems: [
      {
        id: 'hero-en',
        title: 'Hero banner · EN',
        description: 'Headline chính, supporting copy và CTA cho entry hero.',
        locale: 'en',
        owner: 'Editorial',
        updatedAt: 'Updated 2h ago',
        status: makeAdminCmsStatus('draft'),
      },
      {
        id: 'featured-tickets-en',
        title: 'Featured tickets · EN',
        description: 'Grid nổi bật cho ticket-focused curation trên homepage.',
        locale: 'en',
        owner: 'Commerce',
        updatedAt: 'Updated today',
        status: makeAdminCmsStatus('published'),
      },
      {
        id: 'travel-guides-ar',
        title: 'Travel guides · AR',
        description: 'Collection travel guides locale AR đang chờ review nội dung.',
        locale: 'ar',
        owner: 'Localization',
        updatedAt: 'Updated yesterday',
        status: makeAdminCmsStatus('scheduled'),
      },
    ],
    editorTitle: 'Editor boundary',
    editorDescription:
      'Mô phỏng các trường trọng yếu để team nối form thật sau này mà không phá route tree hiện tại.',
    fields: [
      { label: 'Hero title', value: 'Discover the world with curated travel moments', helper: 'Typed theo HomePageData.heroTitle' },
      { label: 'Hero description', value: 'Intro copy cho homepage hero, sẽ được nối locale-specific editor.', helper: 'Tương ứng HomePageData.heroDescription' },
      { label: 'Primary CTA', value: '/tickets', helper: 'Placeholder cho action mapping / preview link.' },
    ],
    workflowTitle: 'Draft and publish workflow',
    workflowDescription: 'Chưa có persistence thật, nhưng state boundaries đã được trình bày rõ cho editor.',
    workflowStatuses: [
      { label: 'Save draft', detail: 'Giữ thay đổi trong module shell, chưa publish ra public surface.' },
      { label: 'Schedule', detail: 'Chuẩn bị nối publish window / time-based release ở phase sau.' },
      { label: 'Publish', detail: 'Placeholder cho action layer sẽ trigger revalidation khi data layer sẵn sàng.' },
    ],
    submissionPresets: [
      {
        label: 'Homepage draft save',
        action: 'save_draft',
        nextStatus: 'draft',
        submitLabel: 'Save homepage draft',
        note: 'Tạo save path cho homepage composition mà chưa đụng persistence.',
      },
      {
        label: 'Homepage scheduled release',
        action: 'schedule',
        nextStatus: 'scheduled',
        submitLabel: 'Schedule homepage release',
        note: 'Giữ future publish intent cho homepage modules.',
      },
      {
        label: 'Homepage publish',
        action: 'publish',
        nextStatus: 'published',
        submitLabel: 'Publish homepage updates',
        note: 'Placeholder cho publish + revalidation flow sau này.',
      },
    ],
    recentActivity: [
      { title: 'Hero copy updated', detail: 'Draft copy mới cho spring campaigns đang chờ review.' },
      { title: 'Top picks reordered', detail: 'Manual ordering sẽ nối drag-and-drop thật ở phase tiếp theo.' },
    ],
  },
  navigation: {
    key: 'navigation',
    title: 'Navigation',
    eyebrow: 'Structure module',
    description:
      'Scaffold quản trị cho global navigation: header, footer, locale switcher và menu group assignments.',
    primaryAction: { label: 'Open navigation shell', href: '/admin/navigation' },
    secondaryAction: { label: 'Review publish states', tone: 'secondary' },
    summaryStats: [
      { label: 'Menus tracked', value: '4', helper: 'Primary, footer, locale shortcuts, utility.' },
      { label: 'Broken links flagged', value: '2', helper: 'Placeholder counters cho QA checks.' },
      { label: 'Locales mapped', value: '2', helper: 'Menu coverage cho EN và AR.' },
    ],
    listTitle: 'Menu groups',
    listDescription: 'Danh sách group điều hướng và trạng thái hiện tại của từng assignment.',
    listItems: [
      {
        id: 'primary-nav',
        title: 'Primary navigation',
        description: 'Header menu chính cho browse journeys, tickets và products.',
        owner: 'Brand team',
        updatedAt: 'Updated 45m ago',
        status: makeAdminCmsStatus('published'),
      },
      {
        id: 'footer-nav',
        title: 'Footer navigation',
        description: 'Footer columns cho support, policy và editorial entry points.',
        owner: 'Operations',
        updatedAt: 'Updated today',
        status: makeAdminCmsStatus('draft'),
      },
      {
        id: 'locale-shortcuts',
        title: 'Locale shortcuts',
        description: 'Shortcut links cho locale-specific landing pages.',
        owner: 'Localization',
        updatedAt: 'Updated yesterday',
        status: makeAdminCmsStatus('scheduled'),
      },
    ],
    editorTitle: 'Assignment preview',
    editorDescription:
      'Hiển thị boundary kiểu form cho menu metadata và assignment logic trước khi nối tree editor thật.',
    fields: [
      { label: 'Menu key', value: 'primary-nav', helper: 'Sẽ trở thành typed payload key cho navigation actions.' },
      { label: 'Placement', value: 'Header / Desktop + Mobile', helper: 'Placeholder cho slot assignment.' },
      { label: 'Fallback locale', value: 'en', helper: 'Dùng khi locale-specific menu chưa sẵn sàng.' },
    ],
    workflowTitle: 'QA and publish checks',
    workflowDescription: 'Module này cần validation mạnh hơn vì ảnh hưởng toàn site navigation.',
    workflowStatuses: [
      { label: 'Validate structure', detail: 'Kiểm tra duplicate href, missing labels và invalid placements.' },
      { label: 'Save draft', detail: 'Giữ menu changes ở draft trước khi thay thế global navigation.' },
      { label: 'Publish', detail: 'Sẽ nối revalidation + audit entry khi backend thật sẵn.' },
    ],
    submissionPresets: [
      {
        label: 'Navigation validation pass',
        action: 'save_draft',
        nextStatus: 'draft',
        submitLabel: 'Save navigation draft',
        note: 'Dùng để freeze thay đổi navigation sau bước QA structure.',
      },
      {
        label: 'Navigation scheduled rollout',
        action: 'schedule',
        nextStatus: 'scheduled',
        submitLabel: 'Schedule navigation rollout',
        note: 'Placeholder cho staged rollout / coordinated release.',
      },
      {
        label: 'Navigation publish',
        action: 'publish',
        nextStatus: 'published',
        submitLabel: 'Publish navigation changes',
        note: 'Sẽ trigger global nav refresh khi backend thật sẵn sàng.',
      },
      {
        label: 'Navigation archive',
        action: 'archive',
        nextStatus: 'archived',
        submitLabel: 'Archive navigation config',
        note: 'Giữ skeleton cho retirement flow và audit log.',
      },
    ],
    recentActivity: [
      { title: 'Footer regrouped', detail: 'Policy links được gom lại để giảm clutter trong footer.' },
      { title: 'Locale switch reviewed', detail: 'Đang chuẩn hóa labels giữa EN và AR.' },
    ],
  },
  promos: {
    key: 'promos',
    title: 'Promos',
    eyebrow: 'Campaign module',
    description:
      'Scaffold quản trị cho promo banners, campaign cards và placement targeting trên surface public.',
    primaryAction: { label: 'Open promos shell', href: '/admin/promos' },
    secondaryAction: { label: 'Review placements', tone: 'secondary' },
    summaryStats: [
      { label: 'Active promos', value: '6', helper: 'Bao gồm hero, strip và campaign cards.' },
      { label: 'Expiring soon', value: '2', helper: 'Placeholder cho scheduling alerts.' },
      { label: 'Placements covered', value: '4', helper: 'Homepage hero, strip, editorial, nav highlight.' },
    ],
    listTitle: 'Campaign inventory',
    listDescription: 'Các promo record tiêu biểu với placement và publish state để operator rà nhanh.',
    listItems: [
      {
        id: 'spring-hero',
        title: 'Spring escape hero',
        description: 'Campaign hero cho seasonal discovery push.',
        owner: 'Growth',
        updatedAt: 'Updated 30m ago',
        status: makeAdminCmsStatus('published'),
      },
      {
        id: 'ramadan-strip-ar',
        title: 'Ramadan strip · AR',
        description: 'Promo strip locale AR với schedule window riêng.',
        locale: 'ar',
        owner: 'Localization',
        updatedAt: 'Updated 3h ago',
        status: makeAdminCmsStatus('scheduled'),
      },
      {
        id: 'partner-campaign-card',
        title: 'Partner campaign card',
        description: 'Card placement cho promo rail trong editorial section.',
        owner: 'Partnerships',
        updatedAt: 'Updated yesterday',
        status: makeAdminCmsStatus('draft'),
      },
    ],
    editorTitle: 'Placement targeting shell',
    editorDescription:
      'Boundary form cho targeting, CTA và schedule info trước khi nối promo editor thật.',
    fields: [
      { label: 'Placement key', value: 'homepage-hero', helper: 'Có thể map về promo_banner / hero_slide block types.' },
      { label: 'CTA target', value: '/campaigns/spring-escape', helper: 'Placeholder cho link validation boundary.' },
      { label: 'Visibility rule', value: 'Locale = en, device = all', helper: 'Sẽ nối rules JSON ở phase data layer.' },
    ],
    workflowTitle: 'Scheduling workflow',
    workflowDescription: 'Promos cần handling rõ cho draft/scheduled/published để tránh bắn nhầm campaign.',
    workflowStatuses: [
      { label: 'Draft', detail: 'Tạo hoặc chỉnh promo mà chưa phát live ra placement.' },
      { label: 'Schedule window', detail: 'Chuẩn bị start/end logic và campaign expiry checks.' },
      { label: 'Publish / archive', detail: 'Placeholder cho activation và retirement flow có audit.' },
    ],
    submissionPresets: [
      {
        label: 'Promo draft save',
        action: 'save_draft',
        nextStatus: 'draft',
        submitLabel: 'Save promo draft',
        note: 'Giữ campaign changes ở draft trước khi publish.',
      },
      {
        label: 'Promo scheduled launch',
        action: 'schedule',
        nextStatus: 'scheduled',
        submitLabel: 'Schedule promo launch',
        note: 'Placeholder cho start/end window và timing review.',
      },
      {
        label: 'Promo publish',
        action: 'publish',
        nextStatus: 'published',
        submitLabel: 'Publish promo changes',
        note: 'Sẽ nối placement activation và revalidation ở phase sau.',
      },
      {
        label: 'Promo archive',
        action: 'archive',
        nextStatus: 'archived',
        submitLabel: 'Archive promo',
        note: 'Skeleton cho retirement flow khi campaign kết thúc.',
      },
    ],
    recentActivity: [
      { title: 'Hero placement reviewed', detail: 'Team growth đã rà lại CTA prominence cho seasonal hero.' },
      { title: 'Promo strip localized', detail: 'AR copy đang chờ final approval trước publish.' },
    ],
  },
};
