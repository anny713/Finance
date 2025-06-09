
'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home }
from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  const { signup, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/profile'); // Redirect to profile to complete details after signup
    }
  }, [user, authLoading, router]);

  const handleSignup = async (email: string, password_DoNotStore: string) => {
    setErrorMessage(null);
    const success = await signup(email, password_DoNotStore);
    if (success) {
      toast({
        title: "Signup Successful",
        description: "Welcome to Finance Flow! Please complete your profile.",
      });
      // Effect hook will handle redirection to /profile
    } else {
      setErrorMessage("User with this email already exists or an error occurred.");
      toast({
        title: "Signup Failed",
        description: "User with this email already exists or an error occurred.",
        variant: "destructive",
      });
    }
  };
  
  if (authLoading || user) { // Show loader if auth is processing or user is already logged in (being redirected)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 dark py-12 px-4">
      <AuthForm mode="signup" onSubmit={handleSignup} errorMessage={errorMessage} />
       <Button asChild variant="outline" className="mt-8 bg-transparent dark:text-slate-300 dark:border-slate-700 hover:dark:bg-slate-800">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> Go to Home page
        </Link>
      </Button>
    </div>
  );
}
