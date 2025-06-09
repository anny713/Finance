'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface RecommendationFormProps {
  initialIncome?: number;
  onSubmit: (income: number) => Promise<void>;
  isLoading: boolean;
}

export function RecommendationForm({ initialIncome, onSubmit, isLoading }: RecommendationFormProps) {
  const [income, setIncome] = useState<string>(initialIncome?.toString() || '');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      // Basic validation, more can be added
      alert('Please enter a valid positive income.');
      return;
    }
    await onSubmit(incomeValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="income" className="text-lg">Your Annual Income ($)</Label>
        <Input
          id="income"
          type="number"
          placeholder="e.g., 50000"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
          min="1"
          className="bg-input text-base py-3 px-4"
        />
         <p className="text-xs text-muted-foreground">Enter your annual income to get personalized investment advice.</p>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Get Recommendation
      </Button>
    </form>
  );
}
