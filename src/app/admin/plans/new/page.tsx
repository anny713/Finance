'use client';

import { PlanForm } from '@/components/admin/plan-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createPlanAction } from '@/actions/plans';
import { useRouter } from 'next/navigation';
import type { Plan } from '@/types';

export default function NewPlanPage() {
  const router = useRouter();

  const handleSubmit = async (planData: Omit<Plan, 'id'>) => {
    // In a real app, ensure this action runs on server or calls API
    // For now, it will use the mocked localStorage via the action.
    const newPlan = await createPlanAction(planData);
    if (newPlan) {
      router.push('/admin/plans'); // Redirect to plans list after creation
    }
    // Error handling is done via toast in PlanForm
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create New Plan</CardTitle>
        <CardDescription>Fill in the details for the new financial plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <PlanForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
