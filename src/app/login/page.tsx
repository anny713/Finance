
'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(user.isAdmin ? '/admin' : '/admin'); 
    }
  }, [user, authLoading, router]);

  const handleLogin = async (username: string, password_DoNotStore: string) => { // Changed email to username
    setErrorMessage(null);
    const success = await login(username, password_DoNotStore); // Pass username
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to Finance Flow Admin Panel!",
      });
    } else {
      setErrorMessage("Invalid username or password. Please try again."); // Updated error message
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.", // Updated error message
        variant: "destructive",
      });
    }
  };
  
  if (authLoading || user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 dark py-12 px-4">
      <AuthForm mode="login" onSubmit={handleLogin} errorMessage={errorMessage} />
      <Button asChild variant="outline" className="mt-8 bg-transparent dark:text-slate-300 dark:border-slate-700 hover:dark:bg-slate-800">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> Go to Home page
        </Link>
      </Button>
    </div>
  );
}
