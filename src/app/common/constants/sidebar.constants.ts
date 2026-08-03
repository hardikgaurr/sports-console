export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'MAIN',
    items: [
      {
        label: 'Sports',
        route: '/sports',
        icon: 'sports.svg',
      },
      {
        label: 'Users',
        route: '/users',
        icon: 'users.svg',
      },
      {
        label: 'Registrations',
        route: '/registrations',
        icon: 'registrations.svg',
      },
      {
        label: 'Reporting',
        route: '/reporting',
        icon: 'reporting.svg',
      },
      {
        label: 'Verifications',
        route: '/verifications',
        icon: 'verifications.svg',
      },
    ],
  },
];
