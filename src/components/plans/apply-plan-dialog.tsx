
'use client';

import { useState } from 'react';
import type { Plan } from '@/types';
import { PlanApplicationClientInput, applyForPlanAction } from '@/actions/plans';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ApplyPlanDialogProps {
  plan: Plan;
  children: React.ReactNode; // To use as DialogTrigger
}

export function ApplyPlanDialog({ plan, children }: ApplyPlanDialogProps) {
  const { user } = useAuth(); // Get user if logged in, to pass userId
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [income, setIncome] = useState(user?.income?.toString() || '');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsApplying(true);

    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      toast({ title: "Validation Error", description: "Please enter a valid positive income.", variant: "destructive" });
      setIsApplying(false);
      return;
    }
    if (!name.trim() || !mobile.trim()) {
      toast({ title: "Validation Error", description: "Name and mobile number are required.", variant: "destructive" });
      setIsApplying(false);
      return;
    }

    const applicationDetails: PlanApplicationClientInput = {
      name,
      mobile,
      income: incomeValue,
      userId: user?.id, // Pass userId if user is logged in
    };

    const result = await applyForPlanAction(plan.id, applicationDetails);
    setIsApplying(false);

    if ('error' in result) {
      toast({ title: "Application Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Application Submitted!", description: `Your application for "${plan.title}" has been submitted.`, className: "bg-accent text-accent-foreground" });
      setOpen(false); // Close dialog on success
      // Reset form fields if needed, or rely on dialog unmount/remount
      if (!user) { // Reset only if user was not logged in to prefill
          setName('');
          setMobile('');
          setIncome('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for: {plan.title}</DialogTitle>
          <DialogDescription>
            Please provide your details to apply for this plan. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-input" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobile" className="text-right">
              Mobile
            </Label>
            <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="col-span-3 bg-input" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="income" className="text-right">
              Income ($)
            </Label>
            <Input id="income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="col-span-3 bg-input" required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isApplying} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
