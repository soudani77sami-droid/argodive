'use client';

import { Menu, Bell, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type HeaderProps = { onMenuClick: () => void };

export function WebHeader({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden text-ocean" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <Waves className="h-5 w-5 text-ocean hidden sm:block" />

      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm">
        <Input
          placeholder="Search operations..."
          className="h-8 border-none bg-muted shadow-none text-sm"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ocean text-[10px] font-bold text-white">
            5
          </span>
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-7 w-7 rounded-full bg-ocean flex items-center justify-center text-white text-xs font-medium">
            JD
          </div>
          <span className="hidden sm:block text-sm font-medium">John Diver</span>
        </div>
      </div>
    </header>
  );
}
