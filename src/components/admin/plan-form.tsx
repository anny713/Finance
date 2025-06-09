'use client';

import { useState, type FormEvent, useEffect } from 'react';
import type { Plan, PlanCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PlanFormProps {
  initialData?: Plan;
  onSubmit: (planData: Omit<Plan, 'id'> | Plan) => Promise<void>;
}

const planCategories: PlanCategory[] = ['INVESTMENT', 'INSURANCE', 'FD', 'LOAN'];
const iconOptions = ['LineChart', 'Shield', 'PiggyBank', 'Landmark', 'TrendingUp', 'Activity', 'DollarSign', 'CreditCard', 'HeartHandshake', 'FileText'];


export function PlanForm({ initialData, onSubmit }: PlanFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PlanCategory | ''>('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [iconName, setIconName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setDetails(initialData.details || '');
      setIconName(initialData.iconName || '');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!category) {
      toast({ title: "Validation Error", description: "Please select a category.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    
    const planData = {
      title,
      category: category as PlanCategory, // Cast as it's validated
      description,
      details,
      iconName,
      imageUrl,
    };

    try {
      if (initialData?.id) {
        await onSubmit({ ...planData, id: initialData.id });
      } else {
        await onSubmit(planData);
      }
      toast({
        title: initialData ? 'Plan Updated' : 'Plan Created',
        description: `The plan "${title}" has been successfully ${initialData ? 'updated' : 'created'}.`,
      });
      // Optionally reset form or redirect
      if (!initialData) {
        setTitle(''); setCategory(''); setDescription(''); setDetails(''); setIconName(''); setImageUrl('');
      }
    } catch (error) {
      toast({
        title: initialData ? 'Update Failed' : 'Creation Failed',
        description: `Could not ${initialData ? 'update' : 'create'} plan. Please try again. Error: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Plan Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as PlanCategory)}>
            <SelectTrigger id="category" className="bg-input">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {planCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="bg-input min-h-[100px]" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="details">Additional Details (optional)</Label>
        <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="bg-input min-h-[80px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="iconName">Icon Name (Lucide Icon, optional)</Label>
           <Select value={iconName} onValueChange={(value) => setIconName(value)}>
            <SelectTrigger id="iconName" className="bg-input">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (optional, e.g., https://placehold.co/600x400.png)</Label>
          <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="bg-input" placeholder="https://placehold.co/600x400.png" />
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? 'Update Plan' : 'Create Plan'}
      </Button>
    </form>
  );
}
