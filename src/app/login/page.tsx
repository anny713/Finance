
'use client';

import { useState, useEffect, Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        // Redirect based on role
        router.push(user.isAdmin ? '/admin' : '/profile'); 
      }
    }
  }, [user, authLoading, router, searchParams]);

  const handleLogin = async (email: string, password_DoNotStore: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const success = await login(email, password_DoNotStore);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Redirecting...",
      });
      // Effect hook will handle redirection.
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password provided.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  
  // Show a loader while auth state is resolving or if user object is present (indicating a redirect is imminent)
  if (authLoading || user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 dark py-12 px-4">
      <AuthForm onSubmit={handleLogin} errorMessage={errorMessage} isLoading={isSubmitting} />
      <Button asChild variant="outline" className="mt-8 bg-transparent dark:text-slate-300 dark:border-slate-700 hover:dark:bg-slate-800">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> Go to Home page
        </Link>
      </Button>
    </div>
  );
}
