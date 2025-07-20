
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Plan, User } from '@/types';
import { getPlanByIdAction, applyForPlanAction, type PlanApplicationClientInput } from '@/actions/plans';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [income, setIncome] = useState('');

  useEffect(() => {
    if (planId) {
      getPlanByIdAction(planId)
        .then(fetchedPlan => {
          if (fetchedPlan) {
            setPlan(fetchedPlan);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [planId]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || '');
      setIncome(user.income?.toString() || '');
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const incomeValue = parseFloat(income);
      if (isNaN(incomeValue) || incomeValue <= 0) {
        toast({ title: 'Validation Error', description: 'Please enter a valid positive income.', variant: 'destructive' });
        return;
      }
      if (!name.trim() || !mobile.trim()) {
        toast({ title: 'Validation Error', description: 'Name and mobile number are required.', variant: 'destructive' });
        return;
      }

      const applicationDetails: PlanApplicationClientInput = {
        name,
        mobile,
        income: incomeValue,
        userId: user?.id,
      };

      const result = await applyForPlanAction(planId, applicationDetails);

      if ('error' in result) {
        toast({ title: 'Application Failed', description: result.error, variant: 'destructive' });
      } else {
        toast({
          title: 'Application Submitted!',
          description: `Your application for "${plan?.title}" has been received.`,
          className: 'bg-accent text-accent-foreground',
        });
        router.push('/plans');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading plan details...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-bold">Plan Not Found</h2>
        <p className="text-muted-foreground">The plan you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/plans">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/plans">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Plans
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Apply for: {plan.title}</CardTitle>
          <CardDescription>
            Please confirm or provide your details below to apply for this plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income ($)</Label>
              <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
