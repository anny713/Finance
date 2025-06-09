
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (emailOrUsername: string, password_DoNotStore: string) => Promise<void>;
  errorMessage?: string | null;
}

export function AuthForm({ mode, onSubmit, errorMessage }: AuthFormProps) {
  const [identifier, setIdentifier] = useState(''); // Can be email or username for login, email for signup
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await onSubmit(identifier, password);
    setIsLoading(false);
  };

  const isLoginPage = mode === 'login';
  const pageTitle = isLoginPage ? 'Admin Panel / User Login' : 'Create an Account';
  const identifierLabel = isLoginPage ? 'Email or Username' : 'Email';
  const identifierPlaceholder = isLoginPage ? 'Enter your email or username' : 'Enter your email';
  const identifierType = isLoginPage ? 'text' : 'email'; // username can be text, email for signup
  const buttonText = isLoginPage ? 'Login' : 'Sign Up';

  return (
    <Card className="w-full max-w-md dark:bg-transparent dark:border-none dark:shadow-none shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl font-bold text-primary dark:text-primary">
          FinanceFlow
        </CardTitle>
        <CardDescription className="dark:text-slate-400">
          {pageTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="dark:text-slate-300">{identifierLabel}</Label>
            <Input
              id="identifier"
              type={identifierType}
              placeholder={identifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="bg-input dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-slate-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700"
            />
          </div>
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center pt-6 text-sm">
        {isLoginPage ? (
          <p className="text-muted-foreground dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline dark:text-primary">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline dark:text-primary">
              Log in
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
