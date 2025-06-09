
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
            Welcome to <span className="text-primary">Finance Flow Admin</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage financial plans, user applications, and platform settings through the Admin Dashboard.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/admin">Go to Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">Admin Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BarChart2 className="h-10 w-10 text-primary" />}
            title="Plan Management"
            description="Create, view, and manage investment, insurance, FD, and loan options."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure & Reliable"
            description="Built with security in mind to protect platform data and operations."
          />
          <FeatureCard
            icon={<LandmarkIcon className="h-10 w-10 text-primary" />}
            title="Application Review"
            description="Oversee and manage applications submitted for various financial plans."
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-primary" />}
            title="AI Insights"
            description="Leverage AI-powered recommendations for financial planning insights."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-12 bg-card rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">Admin Workflow</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StepCard
            step="1"
            title="Secure Admin Access"
            description="Log in with your administrator credentials to manage the platform."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="secure login"
          />
          <StepCard
            step="2"
            title="Manage Plans & Applications"
            description="Oversee financial plans and review user applications through the dashboard."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="dashboard management"
          />
          <StepCard
            step="3"
            title="Utilize AI Tools"
            description="Access AI-driven insights for investment recommendations and analysis."
            imageUrl="https://placehold.co/600x400.png"
            aiHint="AI analytics"
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
