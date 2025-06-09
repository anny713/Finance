
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlanForm } from '@/components/admin/plan-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlanByIdAction, updatePlanAction } from '@/actions/plans';
import type { Plan } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId as string; // Ensure planId is a string
  const { toast } = useToast();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (planId) {
      setIsLoading(true);
      getPlanByIdAction(planId)
        .then(fetchedPlan => {
          if (fetchedPlan) {
            setPlan(fetchedPlan);
          } else {
            setError('Plan not found.');
          }
        })
        .catch(err => {
          console.error("Error fetching plan:", err);
          setError('Failed to load plan data.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [planId]);

  const handleSubmit = async (planData: Omit<Plan, 'id'>) => {
    if (!planId) return;

    // The PlanForm returns Omit<Plan, 'id'>.
    // updatePlanAction expects Partial<Omit<Plan, 'id'>> but here we pass the full object.
    const result = await updatePlanAction(planId, planData); 
    
    if ('error' in result) {
       toast({
        title: "Update Failed",
        description: result.error,
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } else {
      // toast is handled by PlanForm on successful submission via its own onSubmit prop.
      // The PlanForm itself will show a success toast.
      router.push('/admin/plans'); // Redirect to plans list after update
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading plan details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
     return ( // Should ideally not be reached if error state handles 'plan not found'
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p>Plan could not be loaded.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Edit Plan: {plan.title}</CardTitle>
        <CardDescription>Modify the details for this financial plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <PlanForm initialData={plan} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}

    