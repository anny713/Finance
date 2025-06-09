
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Info } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  // useEffect(() => { // Optional: redirect immediately
  //   router.push('/login');
  // }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 dark py-12 px-4">
      <Card className="w-full max-w-md dark:bg-slate-800/80 dark:border-slate-700 shadow-xl p-4 md:p-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Info className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl font-bold text-primary dark:text-primary">
            Signup Unavailable
          </CardTitle>
          <CardDescription className="dark:text-slate-300 mt-2">
            User registration is currently not available for this application.
            Only administrators can log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground dark:text-slate-400">
            If you are an administrator, please proceed to the login page.
          </p>
        </CardContent>
        <div className="mt-6 flex flex-col gap-4">
            <Button asChild variant="outline" className="bg-transparent dark:text-slate-300 dark:border-slate-700 hover:dark:bg-slate-700">
                <Link href="/login">
                Go to Admin Login
                </Link>
            </Button>
            <Button asChild variant="ghost" className="dark:text-slate-400 hover:dark:text-slate-200">
                <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Home page
                </Link>
            </Button>
        </div>
      </Card>
    </div>
  );
}
