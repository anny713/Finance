'use client';

import Image from 'next/image';
import type { Plan, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconComponent } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { applyForPlanAction } from '@/actions/plans';
import { useAuth } from '@/hooks/useAuth';
import { useState }ikaimport { Loader2 } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const IconComponent = plan.iconName ? getIconComponent(plan.iconName) : getIconComponent('HelpCircle');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to apply for plans.", variant: "destructive" });
      return;
    }
    if (!user.name || !user.mobile || typeof user.income !== 'number') {
       toast({ title: "Profile Incomplete", description: "Please complete your name, mobile, and income in your profile before applying.", variant: "destructive" });
       return;
    }

    setIsApplying(true);
    const result = await applyForPlanAction(plan.id, user);
    setIsApplying(false);

    if ('error' in result) {
      toast({ title: "Application Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Application Submitted!", description: `Your application for "${plan.title}" has been submitted.`, className: "bg-accent text-accent-foreground" });
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col overflow-hidden rounded-lg">
      {plan.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={plan.imageUrl}
            alt={plan.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${plan.category.toLowerCase()} finance`}
          />
        </div>
      )}
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
        <Button onClick={handleApply} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isApplying}>
          {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
