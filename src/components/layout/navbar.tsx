
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Briefcase, Home, LayoutGrid, UserCircle2, LogOut, LogIn, ShieldCheck, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names
import { usePathname } from 'next/navigation'; // Assuming you are using next/navigation for pathname
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook
import type { NavItem } from '@/types'; // Assuming you have a NavItem type

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/', label: 'Home Page', icon: Home },
    { href: '/plans', label: 'Plans', icon: LayoutGrid },
    { href: '/login', label: 'Admin Login', icon: LogIn, loggedOutOnly: true },
 ];

  const getFilteredNavItems = () => {
    if (isLoading) return [];
    return navItems.filter(item => {
      if (item.adminOnly && (!user || !user.isAdmin)) return false;
      if (item.href === '/profile' && !user) return false;

      if (item.loggedInOnly && !user) return false; // Generic loggedInOnly check
      if (item.loggedOutOnly && user) return false;
      return true;
    });
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
        {/* Placeholder for navigation links */}
 <div className="hidden items-center gap-2 sm:gap-4 md:flex">
          {' '}
          {/* Hide on mobile */}
          {getFilteredNavItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                // Explicitly set text color for visibility
                pathname === item.href ? 'text-primary' : 'text-foreground',
                pathname === item.href ? 'text-primary' : 'text-foreground/80'
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 hidden sm:inline-block" />}{' '}
              {item.label}
            </Link>
          ))}
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

 {/* Hamburger menu for mobile - Placed at the end of the nav bar on mobile */}
 <div className="md:hidden flex items-center"> {/* Use flex to align button */}
 <Button
 aria-label="Toggle navigation"
 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
 variant="ghost" // Use ghost variant for a cleaner look
 size="icon"
 >
 <Menu className="h-6 w-6" />
            </Button>
          </div>



        {/* Mobile Navigation Menu */}{' '}
        {/* Toggle visibility based on isMobileMenuOpen */}{' '}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-sm flex flex-col items-start p-4 space-y-4 md:hidden z-50">
            {getFilteredNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on item click
              >
                {item.icon && <item.icon className="h-5 w-5" />} {item.label}
              </Link>
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
