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
        label: 'Restricted Devices',
        route: '/restricted-devices',
        icon: 'restricted-devices.svg',
      },
      {
        label: 'Restricted Words',
        route: '/restricted-words',
        icon: 'restricted-words.svg',
      },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      {
        label: 'Verifications',
        route: '/verifications',
        icon: 'verifications.svg',
      },
      {
        label: 'Videos',
        route: '/videos',
        icon: 'videos.svg',
      },
      {
        label: 'Athlete Blog Requests',
        route: '/blogs',
        icon: 'athlete-blog.svg',
      },
      {
        label: 'Referrals',
        route: '/referrals',
        icon: 'referrals.svg',
      },
    ],
  },
];
