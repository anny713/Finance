
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LayoutGrid, Sparkles, UserPlus, ClipboardList, Shield, BrainCircuit } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import React from 'react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
            Smart Financial Planning, Simplified
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover personalized investment plans, get AI-powered advice, and take control of your financial future with confidence.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/plans">Explore Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">User Benefits of Our Platform</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BrainCircuit className="h-10 w-10 text-primary" />}
            title="Personalized Recommendations"
            description="Get AI-powered investment advice tailored to your income and financial goals."
          />
          <FeatureCard
            icon={<LayoutGrid className="h-10 w-10 text-primary" />}
            title="Wide Choice of Plans"
            description="Explore a diverse range of financial plans including investments, insurance, and loans."
          />
           <FeatureCard
            icon={<CheckCircle className="h-10 w-10 text-primary" />}
            title="Easy Application Process"
            description="Apply for any plan quickly and securely with our streamlined, user-friendly process."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure & Transparent"
            description="Your data is protected with industry-standard security, ensuring a safe experience."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-12 bg-card rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">User Easy Steps</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StepCard
            step="1"
            title="Add Your Details"
            description="Create your profile by adding your name, mobile, and income information to get personalized services."
            icon={<UserPlus className="h-16 w-16 text-primary" />}
          />
          <StepCard
            step="2"
            title="Select a Plan"
            description="Browse our diverse range of investment, insurance, and loan plans to find the one that fits you."
            icon={<ClipboardList className="h-16 w-16 text-primary" />}
          />
          <StepCard
            step="3"
            title="Apply With One Click"
            description="Easily apply for your chosen plan with your saved details. It's fast, simple, and secure."
            icon={<CheckCircle className="h-16 w-16 text-accent" />}
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
    <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow rounded-lg">
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
  icon: React.ReactNode;
}

function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <div className="flex flex-col items-center p-4">
       <div className="w-full h-40 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-3">
        {step}
      </div>
      <h3 className="text-xl font-semibold mb-2 font-headline">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
