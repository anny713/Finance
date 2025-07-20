'use client';

import { useState, type FormEvent, useEffect } from 'react';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => Promise<void>; // Changed to Promise<void>
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [name, setName] = useState(user.name || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [income, setIncome] = useState<string>(user.income?.toString() || '');
  const [isLoading, setIsLoading] = useState(false); // This is for the button's loading state
  const { toast } = useToast();

  useEffect(() => {
    setName(user.name || '');
    setMobile(user.mobile || '');
    if (!user.isAdmin) {
      setIncome(user.income?.toString() || '');
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true); // Start button loading
    
    const updatedUser: Partial<User> = {
      name,
      mobile,
    };

    if (!user.isAdmin) {
      const incomeValue = parseFloat(income);
      updatedUser.income = isNaN(incomeValue) ? undefined : incomeValue;
    }

    try {
      await onUpdate(updatedUser); // Await the async operation
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Could not update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false); // Stop button loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email} disabled className="bg-muted/50" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          type="tel"
          placeholder="Your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="bg-input"
        />
      </div>
      {!user.isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="income">Annual Income ($)</Label>
          <Input
            id="income"
            type="number"
            placeholder="Your annual income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="bg-input"
          />
        </div>
      )}
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Profile
      </Button>
    </form>
  );
}
