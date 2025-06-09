'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePlus, ListChecks, Users } from 'lucide-react'; // Assuming Users might be for managing users later

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 font-headline">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FilePlus className="text-primary" />
              Manage Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create, view, and manage financial plans available to users.</p>
            <Button asChild className="w-full">
              <Link href="/admin/plans">Go to Plans</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ListChecks className="text-primary" />
              View Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Review applications submitted by users for various plans.</p>
            <Button asChild className="w-full">
              <Link href="/admin/applications">Go to Applications</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Add more admin cards here as features grow, e.g., User Management */}
      </div>
    </div>
  );
}
