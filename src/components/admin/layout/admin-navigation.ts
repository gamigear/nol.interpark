export type AdminNavItem = {
  title: string;
  href: string;
  description?: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavigation: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
        description: 'Operational snapshot and quick entry points.',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Homepage Composer',
        href: '/admin/homepage',
        description: 'Manage hero and homepage sections.',
      },
      {
        title: 'Navigation',
        href: '/admin/navigation',
        description: 'Header, footer, and menu structure.',
      },
      {
        title: 'Promos',
        href: '/admin/promos',
        description: 'Campaigns, banners, and placements.',
      },
    ],
  },
  {
    title: 'Catalog',
    items: [
      {
        title: 'Tickets',
        href: '/admin/catalog/tickets',
        description: 'Ticket-focused listings and curation.',
      },
      {
        title: 'Products',
        href: '/admin/catalog/products',
        description: 'Products, experiences, and top picks.',
      },
    ],
  },
  {
    title: 'Editorial',
    items: [
      {
        title: 'Articles',
        href: '/admin/editorial/articles',
        description: 'Editorial stories and curation.',
      },
      {
        title: 'Travel Guides',
        href: '/admin/editorial/guides',
        description: 'Guide content and destination coverage.',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Media Library',
        href: '/admin/media',
        description: 'Assets, usage, and localized alt text.',
      },
      {
        title: 'Localization',
        href: '/admin/localization',
        description: 'Locales and translation completeness.',
      },
      {
        title: 'Audit Log',
        href: '/admin/settings/audit',
        description: 'System activity and publishing history.',
      },
    ],
  },
];
