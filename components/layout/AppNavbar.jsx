'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, LayoutDashboard, Brain, Trophy, FolderOpen } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Launchpad', href: '/', icon: LayoutDashboard },
  { name: 'Missions', href: '/missions', icon: Trophy }, // Changed icon from Rocket to Trophy
  { name: 'Comms', href: '/feed', icon: FolderOpen }, // Changed icon from Radio to FolderOpen
  { name: 'Vault', href: '/vault', icon: Terminal }, // Changed icon from Lock to Terminal
  { name: 'Inventory', href: '/inventory', icon: Brain }, // Changed icon from Box to Brain
];

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <Brain className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">BrainBox</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors text-sm font-medium font-mono
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile menu link placeholder - could build a hamburger menu later */}
        <div className="md:hidden text-muted-foreground text-xs font-mono">
          [MENU]
        </div>
      </div>
    </nav>
  );
}
