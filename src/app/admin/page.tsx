
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, ListChecks, ArrowRight, Loader2 } from 'lucide-react';
import { getPlansAction, getApplicationsAction } from '@/actions/plans';
import { useEffect, useState } from 'react';
import type { Plan, Application } from '@/types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [plansData, applicationsData] = await Promise.all([
        getPlansAction(),
        getApplicationsAction()
      ]);
      setPlans(plansData);
      setApplications(applicationsData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const pendingApplicationsCount = applications.filter(app => app.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        {user && user.name && (
          <p className="text-lg text-muted-foreground mt-1">
            Welcome back, {user.name}!
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Plans"
            value={plans.length.toString()}
            description="Number of financial plans available."
            icon={<FileText className="text-primary" />}
          />
          <StatCard
            title="Total Applications"
            value={applications.length.toString()}
            description="All applications received from users."
            icon={<ListChecks className="text-primary" />}
          />
          <StatCard
            title="Pending Applications"
            value={pendingApplicationsCount.toString()}
            description="Applications that require review."
            icon={<ListChecks className="text-amber-500" />}
            highlight={pendingApplicationsCount > 0}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="text-primary" />
              Manage Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create, view, and manage financial plans available to users.</p>
            <Button asChild>
              <Link href="/admin/plans">Go to Plans <ArrowRight className="ml-2" /></Link>
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
            <Button asChild>
              <Link href="/admin/applications">Go to Applications <ArrowRight className="ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function StatCard({ title, value, description, icon, highlight }: StatCardProps) {
  return (
    <Card className={highlight ? "border-amber-500" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
