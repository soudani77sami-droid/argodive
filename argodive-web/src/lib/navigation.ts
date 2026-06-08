import {
  LayoutDashboard,
  Grid3X3,
  ClipboardCheck,
  ArrowLeftRight,
  Image,
  BarChart3,
  PieChart,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Cages', href: '/cages', icon: Grid3X3 },
  { title: 'Inspections', href: '/inspections', icon: ClipboardCheck },
  { title: 'Fish Transfers', href: '/transfers', icon: ArrowLeftRight },
  { title: 'Photos', href: '/photos', icon: Image },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Statistics', href: '/statistics', icon: PieChart },
];
