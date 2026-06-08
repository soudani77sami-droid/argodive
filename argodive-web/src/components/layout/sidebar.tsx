'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { navItems } from '@/lib/navigation';
import { Waves, X } from 'lucide-react';

type SidebarProps = { open: boolean; onClose: () => void };

export function WebSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-gradient-to-b from-ocean-dark to-ocean text-white transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={onClose}>
            <Waves className="h-5 w-5 text-seafoam" />
            <span>ArgoDive</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-3">
          <p className="text-xs text-white/50 uppercase tracking-wider font-medium">Operations</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/65 hover:bg-white/10 hover:text-white',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/10" />
        <div className="p-4">
          <p className="text-xs text-white/40">ArgoDive v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
