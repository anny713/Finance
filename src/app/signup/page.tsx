'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const { signup, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/profile'); // Redirect to profile to complete details
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
      // Effect hook will handle redirection
    } else {
      setErrorMessage("User with this email already exists or an error occurred.");
      toast({
        title: "Signup Failed",
        description: "User with this email already exists or an error occurred.",
        variant: "destructive",
      });
    }
  };
  
  if (authLoading || user) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">Loading...</div>;
  }

  return (
    <AuthForm mode="signup" onSubmit={handleSignup} errorMessage={errorMessage} />
  );
}
