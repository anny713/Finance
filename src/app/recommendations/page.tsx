'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RecommendationForm } from '@/components/recommendations/recommendation-form';
import { RecommendationResult } from '@/components/recommendations/recommendation-result';
import { getInvestmentRecommendationAction } from '@/actions/recommendations';
import type { InvestmentRecommendationOutput } from '@/ai/flows/investment-recommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RecommendationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [recommendation, setRecommendation] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/recommendations');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (income: number) => {
    setIsLoading(true);
    setError(undefined);
    setRecommendation(undefined);

    const result = await getInvestmentRecommendationAction({ income });
    
    if ('error' in result) {
      setError(result.error);
      toast({ title: "Recommendation Error", description: result.error, variant: "destructive" });
    } else {
      setRecommendation((result as InvestmentRecommendationOutput).recommendation);
      toast({ title: "Recommendation Generated!", description: "Here's your personalized advice.", className: "bg-accent text-accent-foreground"});
    }
    setIsLoading(false);
  };

  if (authLoading || (!user && !isLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Ensure user is not null before accessing user.income
  const initialIncome = user ? user.income : undefined;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Investment Advisor
          </CardTitle>
          <CardDescription className="text-base">
            Get personalized investment recommendations based on your income. Our AI-powered tool helps you make smarter financial decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <RecommendationForm initialIncome={initialIncome} onSubmit={handleSubmit} isLoading={isLoading} />
          {(recommendation || error) && <RecommendationResult recommendation={recommendation} error={error} />}
        </CardContent>
      </Card>
    </div>
  );
}
