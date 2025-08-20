'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutDashboard, Settings, User, Workflow, Package2 } from 'lucide-react';
import type { View } from '@/app/page';

interface AppSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const AppSidebar: FC<AppSidebarProps> = ({ currentView, onNavigate }) => {
    const navItems = [
        { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { view: 'partners', icon: User, label: 'Partners' },
        { view: 'workflows', icon: Workflow, label: 'Workflows' },
    ] as const;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">PartnerVerse</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.view}>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => onNavigate(item.view)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                            currentView === item.view
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
           ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
};
