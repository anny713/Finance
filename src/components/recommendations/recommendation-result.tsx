import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface RecommendationResultProps {
  recommendation?: string;
  error?: string;
}

export function RecommendationResult({ recommendation, error }: RecommendationResultProps) {
  if (error) {
    return (
      <Card className="mt-8 border-destructive bg-destructive/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive font-headline">
            <AlertCircle />
            Error Generating Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendation) {
    return null; // Don't render if there's no recommendation or error yet
  }

  return (
    <Card className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10 shadow-xl border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline text-2xl">
          <CheckCircle2 />
          Your Personalized Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{recommendation}</p>
      </CardContent>
    </Card>
  );
}
