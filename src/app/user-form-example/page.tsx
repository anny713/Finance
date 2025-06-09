
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User as UserIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createUserAction } from '@/actions/users';
import { UserProfileFormSchema, type UserProfileFormInput } from '@/lib/schemas';

export default function UserFormExamplePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserProfileFormInput>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      income: '' as unknown as number, // Initialize with empty string for controlled input
      terms: false,
    },
  });

  async function onSubmit(values: UserProfileFormInput) {
    setIsLoading(true);
    const result = await createUserAction(values);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.user) {
      toast({
        title: 'Profile Created!',
        description: `User profile for ${result.user.name} has been saved.`,
      });
      form.reset(); // Reset form on successful submission
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            User Profile
          </CardTitle>
          <CardDescription>Manage your user profile information.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} className="bg-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your annual income" 
                        {...field} 
                        value={field.value === undefined || field.value === null ? '' : field.value} // Ensure value is not undefined
                        onChange={event => {
                          const value = event.target.value;
                          if (value === '') {
                            field.onChange(undefined); // Or handle as needed for Zod schema (e.g. '' or specific number)
                          } else {
                            field.onChange(+value);
                          }
                        }} 
                        className="bg-input" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions
                      </FormLabel>
                      <FormDescription>
                        You must accept our terms and conditions to proceed.
                      </FormDescription>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
