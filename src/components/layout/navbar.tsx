'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, Home, LayoutGrid, UserCircle2, LogOut, LogIn, ShieldCheck, Menu, LineChart, Shield, Landmark, Car, GraduationCap, Coins, HandCoins, Building2, Tractor, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { NavItem } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/', label: 'Home Page', icon: Home },
    { href: '/plans?category=INVESTMENT', label: 'Investment', icon: LineChart },
    { href: '/plans?category=INSURANCE', label: 'Insurance', icon: Shield },
    { 
      href: '/plans?category=LOAN', 
      label: 'Loan Section', 
      icon: Landmark,
      children: [
        { href: '/plans?loanType=Home', label: 'Home Loan', icon: Landmark },
        { href: '/plans?loanType=Car', label: 'Car Loan', icon: Car },
        { href: '/plans?loanType=Education', label: 'Education Loan', icon: GraduationCap },
        { href: '/plans?loanType=Gold', label: 'Gold Loan', icon: Coins },
        { href: '/plans?loanType=Personal', label: 'Personal Loan', icon: HandCoins },
        { href: '/plans?loanType=Business', label: 'Business Loan', icon: Building2 },
        { href: '/plans?loanType=Agriculture', label: 'Agriculture Loan', icon: Tractor },
      ]
    },
    { href: '/login', label: 'Admin Login', icon: LogIn, loggedOutOnly: true },
 ];

  const getFilteredNavItems = () => {
    if (isLoading) return [];
    return navItems.filter(item => {
      if (item.adminOnly && (!user || !user.isAdmin)) return false;
      if (item.loggedOutOnly && user) return false;
      return true;
    });
  };

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary px-2',
                pathname.includes(item.href) ? 'text-primary' : 'text-foreground/80'
              )}>
              {item.icon && <item.icon className="h-4 w-4 hidden sm:inline-block" />}
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.children.map(child => (
              <DropdownMenuItem key={child.href} asChild>
                <Link href={child.href} className="flex items-center gap-2">
                  {child.icon && <child.icon className="h-4 w-4" />}
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
          pathname === item.href ? 'text-primary' : 'text-foreground/80'
        )}
      >
        {item.icon && <item.icon className="h-4 w-4 hidden sm:inline-block" />}
        {item.label}
      </Link>
    );
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Briefcase className="h-7 w-7" />
            <span className="text-xl font-headline font-bold">Finance Flow</span>
          </Link>
        </div>
        <div className="hidden items-center gap-2 sm:gap-4 md:flex">
          {getFilteredNavItems().map((item) => renderNavItem(item))}
          {user && (
            <>
              {user.isAdmin && (
                 <Link
                    href="/admin"
                    className={cn(
                        'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                        pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/80'
                    )}
                    >
                    <ShieldCheck className="h-4 w-4 hidden sm:inline-block" />
                    Admin
                </Link>
              )}
              <Link
                href="/profile"
                className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                    pathname === '/profile' ? 'text-primary' : 'text-foreground/80'
                )}
                >
                <UserCircle2 className="h-4 w-4 hidden sm:inline-block" />
                Profile
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-foreground hover:text-primary"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <Button
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            variant="ghost"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-sm flex flex-col items-start p-4 space-y-4 md:hidden z-50">
            {getFilteredNavItems().map((item) => (
              item.children ? (
                <div key={item.label} className="w-full">
                  <span className='flex items-center gap-2 text-lg font-medium text-foreground/80'>
                    {item.icon && <item.icon className="h-5 w-5" />} {item.label}
                  </span>
                  <div className="flex flex-col pl-6 mt-2 space-y-3">
                     {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn('flex items-center gap-2 text-md font-medium transition-colors hover:text-primary', pathname === child.href ? 'text-primary' : 'text-foreground')}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                           {child.icon && <child.icon className="h-5 w-5" />} {child.label}
                        </Link>
                     ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-foreground'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-5 w-5" />} {item.label}
                </Link>
              )
            ))}
             {user && (
                <>
                {user.isAdmin && (
                    <Link
                        href="/admin"
                        className={cn(
                            'flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary',
                            pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        >
                        <ShieldCheck className="h-5 w-5" />
                        Admin
                    </Link>
                )}
                <Link
                    href="/profile"
                    className={cn(
                        'flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary',
                        pathname === '/profile' ? 'text-primary' : 'text-foreground'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    <UserCircle2 className="h-5 w-5" />
                    Profile
                </Link>
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary w-full justify-start p-0"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
                </>
             )}
          </div>
        )}
      </nav>
    </header>
  );
}
