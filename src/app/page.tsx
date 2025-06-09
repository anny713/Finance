import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart2, Shield, LandmarkIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
            Welcome to <span className="text-primary">Finance Flow</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted partner for smart financial planning. Explore investment plans, insurance, loans, and get AI-powered recommendations.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/plans">Explore Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">Why Choose Finance Flow?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BarChart2 className="h-10 w-10 text-primary" />}
            title="Diverse Plans"
            description="Explore a wide range of investment, insurance, FD, and loan options tailored to your needs."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure & Reliable"
            description="Your financial data is safe with us. We prioritize trust and security in all our services."
          />
          <FeatureCard
            icon={<LandmarkIcon className="h-10 w-10 text-primary" />}
            title="Easy Applications"
            description="Apply for plans with a simple, one-click process using your saved profile information."
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-primary" />}
            title="AI Recommendations"
            description="Get personalized investment advice powered by our intelligent recommendation engine."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-12 bg-card rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">Simple Steps to Financial Success</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StepCard
            step="1"
            title="Create Your Profile"
            description="Sign up and tell us about your financial standing. It's quick and easy."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="profile creation"
          />
          <StepCard
            step="2"
            title="Explore & Apply"
            description="Browse through curated financial plans and apply for those that suit you."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="financial plans"
          />
          <StepCard
            step="3"
            title="Get AI Advice"
            description="Leverage our AI tool for smart investment recommendations based on your income."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="AI advisor"
          />
        </div>
      </section>
      
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 font-headline">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  );
}

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  aiHint: string;
}

function StepCard({ step, title, description, imageUrl, aiHint }: StepCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden shadow-md">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" data-ai-hint={aiHint} />
      </div>
      <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-3">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2 font-headline">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
