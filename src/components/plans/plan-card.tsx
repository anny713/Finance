
'use client';

import Image from 'next/image';
import type { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconComponent } from '@/lib/icons';
import { ApplyPlanDialog } from './apply-plan-dialog'; // Import the new dialog

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const IconComponent = plan.iconName ? getIconComponent(plan.iconName) : getIconComponent('HelpCircle');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col overflow-hidden rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <IconComponent className="h-6 w-6 text-primary" />
            {plan.title}
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{plan.category}</span>
        </div>
        <CardDescription className="mt-1 text-sm line-clamp-3 h-[3.75rem]">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {plan.details && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Details:</h4>
            <p className="text-xs text-muted-foreground line-clamp-4">{plan.details}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <ApplyPlanDialog plan={plan}>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Apply Now
          </Button>
        </ApplyPlanDialog>
      </CardFooter>
    </Card>
  );
}
