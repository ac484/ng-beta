'use client';

import type { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsUpDown, Menu, Package2, User, Workflow, LayoutDashboard, Settings } from 'lucide-react';
import type { View, Role } from '@/app/page';

interface HeaderProps {
  userRole: Role;
  onRoleChange: (role: Role) => void;
  onAddPartner: () => void;
}

export const Header: FC<HeaderProps> = ({ userRole, onRoleChange, onAddPartner }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <a
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">PartnerVerse</span>
                </a>
                <a href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </a>
                <a href="#" className="flex items-center gap-4 px-2.5 text-foreground">
                  <User className="h-5 w-5" />
                  Partners
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Workflow className="h-5 w-5" />
                  Workflows
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </a>
              </nav>
            </SheetContent>
          </Sheet>
      <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="avatar user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{userRole}</span>
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={userRole} onValueChange={(value) => onRoleChange(value as Role)}>
              <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Manager">Manager</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Viewer">Viewer</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
