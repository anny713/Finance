'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password_DoNotStore: string) => Promise<void>;
  errorMessage?: string | null;
}

export function AuthForm({ mode, onSubmit, errorMessage }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      setPasswordsMatchError(true);
      return;
    }
    setPasswordsMatchError(false);
    setIsLoading(true);
    await onSubmit(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Log in to access your Finance Flow account.' : 'Sign up to start managing your finances with Finance Flow.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input"
              />
            </div>
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-input"
                />
                {passwordsMatchError && <p className="text-sm text-destructive">Passwords do not match.</p>}
              </div>
            )}
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Link href={mode === 'login' ? '/signup' : '/login'} className="font-medium text-primary hover:underline">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
