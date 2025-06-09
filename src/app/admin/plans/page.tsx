
'use client';

import { useEffect, useState } from 'react';
import type { Plan } from '@/types';
import { getPlansAction, deletePlanAction } from '@/actions/plans';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { getIconComponent } from '@/lib/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of plan being deleted
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPlans() {
      setIsLoading(true);
      const fetchedPlans = await getPlansAction();
      setPlans(fetchedPlans);
      setIsLoading(false);
    }
    fetchPlans();
  }, []);

  const handleDeletePlan = async (planId: string) => {
    setIsDeleting(planId);
    const result = await deletePlanAction(planId);
    setIsDeleting(null);

    if (result.success) {
      toast({
        title: "Plan Deleted",
        description: `Plan ID ${planId} has been successfully deleted.`,
        className: "bg-accent text-accent-foreground",
        icon: <CheckCircle className="h-4 w-4" />,
      });
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    } else {
      toast({
        title: "Deletion Failed",
        description: result.error || "Could not delete plan. Please try again.",
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/plans/edit/${plan.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={isDeleting === plan.id}>
                        {isDeleting === plan.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the plan
                          "{plan.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePlan(plan.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

    