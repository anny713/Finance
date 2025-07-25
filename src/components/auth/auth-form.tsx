
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (email: string, password_DoNotStore: string) => Promise<void>;
  errorMessage?: string | null;
  isLoading: boolean;
}

export function AuthForm({ onSubmit, errorMessage, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(email, password);
  };

  const pageTitle = 'Admin Login';
  const buttonText = 'Login';

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
            <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        {/* No alternative actions needed for admin-only login */}
      </CardFooter>
    </Card>
  );
}
