'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (!user.isAdmin) {
        router.push('/'); // Or an "access denied" page
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64">
        <h2 className="text-xl font-semibold mb-4 font-headline">Admin Menu</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">Dashboard</Link>
          <Link href="/admin/plans" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">Manage Plans</Link>
          <Link href="/admin/applications" className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">View Applications</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
