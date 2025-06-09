
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User as UserIcon } from 'lucide-react'; // Renamed to avoid conflict if User type is imported

export default function UserFormExamplePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            User Form Example
          </CardTitle>
          <CardDescription>This page demonstrates various form elements.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="example-name">Full Name</Label>
              <Input id="example-name" placeholder="Enter your full name" className="bg-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example-email">Email Address</Label>
              <Input id="example-email" type="email" placeholder="Enter your email" className="bg-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example-preference">Preference</Label>
              <Select>
                <SelectTrigger id="example-preference" className="bg-input">
                  <SelectValue placeholder="Select a preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="example-terms" />
              <Label htmlFor="example-terms" className="text-sm font-normal cursor-pointer">
                I agree to the terms and conditions
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
              Submit Example Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
