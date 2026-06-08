import {
  LayoutDashboard,
  Fish,
  Grid3X3,
  Network,
  ClipboardCheck,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Species', href: '/species', icon: Fish },
  { title: 'Cages', href: '/cages', icon: Grid3X3 },
  { title: 'Nets', href: '/nets', icon: Network },
  { title: 'Inspections', href: '/inspections', icon: ClipboardCheck },
  { title: 'Fish Transfers', href: '/transfers', icon: ArrowLeftRight },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Alerts', href: '/alerts', icon: Bell, badge: 3 },
  { title: 'Settings', href: '/settings', icon: Settings },
];
