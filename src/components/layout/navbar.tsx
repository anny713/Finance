'use client';

import Link from 'next/link';
import { Briefcase, Home, LayoutGrid, UserCircle2, LogOut, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/plans', label: 'Plans', icon: LayoutGrid, loggedInOnly: true },
    { href: '/recommendations', label: 'Recommendations', icon: Sparkles, loggedInOnly: true },
    { href: '/profile', label: 'Profile', icon: UserCircle2, loggedInOnly: true },
    { href: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
    { href: '/login', label: 'Login', icon: LogIn, loggedOutOnly: true },
    { href: '/signup', label: 'Sign Up', loggedOutOnly: true },
  ];

  const getFilteredNavItems = () => {
    if (isLoading) return [];
    return navItems.filter(item => {
      if (item.adminOnly && (!user || !user.isAdmin)) return false;
      if (item.loggedInOnly && !user) return false;
      if (item.loggedOutOnly && user) return false;
      return true;
    });
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Briefcase className="h-7 w-7" />
          <span className="text-xl font-headline font-bold">Finance Flow</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {getFilteredNavItems().map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/80",
                "flex items-center gap-1"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 hidden sm:inline-block" />}
              {item.label}
            </Link>
          ))}
          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="text-foreground/80 hover:text-primary">
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
