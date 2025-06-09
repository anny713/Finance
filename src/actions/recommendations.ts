'use server';

import { investmentRecommendation, type InvestmentRecommendationInput, type InvestmentRecommendationOutput } from '@/ai/flows/investment-recommendation';

export async function getInvestmentRecommendationAction(
  input: InvestmentRecommendationInput
): Promise<InvestmentRecommendationOutput | { error: string }> {
  try {
    if (typeof input.income !== 'number' || input.income <= 0) {
      return { error: 'Valid income must be provided.' };
    }
    const recommendation = await investmentRecommendation(input);
    return recommendation;
  } catch (e) {
    console.error("Error getting investment recommendation:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `Failed to get recommendation: ${errorMessage}` };
  }
}
