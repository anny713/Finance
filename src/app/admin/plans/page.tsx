'use client';

import { useEffect, useState } from 'react';
import type { Plan } from '@/types';
import { getPlansAction } from '@/actions/plans';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { getIconComponent } from '@/lib/icons'; // We'll create this utility

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      setIsLoading(true);
      // Mocked action will use localStorage
      const fetchedPlans = await getPlansAction();
      setPlans(fetchedPlans);
      setIsLoading(false);
    }
    fetchPlans();
  }, []);

  const handleDeletePlan = (planId: string) => {
    // TODO: Implement delete plan action
    console.log("Delete plan:", planId);
    alert("Delete functionality not implemented in this mock.");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Plans</h1>
        <Button asChild>
          <Link href="/admin/plans/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Plan
          </Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <p className="text-muted-foreground">No plans found. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const IconComponent = plan.iconName ? getIconComponent(plan.iconName) : null;
            return (
              <Card key={plan.id} className="shadow-md flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                    {plan.title}
                  </CardTitle>
                  <CardDescription>{plan.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{plan.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  {/* <Button variant="outline" size="sm" disabled>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)} disabled>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button> */}
                  <p className="text-xs text-muted-foreground">Edit/Delete actions TBD</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
