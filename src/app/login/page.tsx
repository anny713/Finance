'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(user.isAdmin ? '/admin' : '/plans');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (email: string, password_DoNotStore: string) => {
    setErrorMessage(null);
    const success = await login(email, password_DoNotStore);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to Finance Flow!",
      });
      // Effect hook will handle redirection
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (authLoading || user) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">Loading...</div>; // Or a proper loading spinner
  }

  return (
    <AuthForm mode="login" onSubmit={handleLogin} errorMessage={errorMessage} />
  );
}
