
'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Plan, PlanCategory } from '@/types';
import { getPlansAction } from '@/actions/plans';
import { PlanCard } from '@/components/plans/plan-card';
import { PlanCategoriesTabs } from '@/components/plans/plan-categories-tabs';
// import { useAuth } from '@/hooks/useAuth'; // No longer needed for page access control
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PlansPage() {
  return <PlansContent />;
}

function LoadingPlans() {
  return (
    // Adjusted loader to be a simple spinner without min-height
    // The surrounding content will handle layout
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
function PlansContent() {
  // const { user, isLoading: authLoading } = useAuth(); // No longer needed for page access control
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<PlanCategory | 'ALL'>(
    (searchParams.get('category') as PlanCategory | 'ALL') || 'ALL'
  );
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // useEffect(() => { // Removed: Users no longer need to be logged in to see this page
  //   if (!authLoading && !user) {
  //     router.push('/login?redirect=/plans');
  //   }
  // }, [user, authLoading, router]);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    const fetchedPlans = await getPlansAction();
    setAllPlans(fetchedPlans);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    let plansToFilter = allPlans;
    if (currentCategory !== 'ALL') {
      plansToFilter = plansToFilter.filter(plan => plan.category === currentCategory);
    }
    if (searchTerm) {
      plansToFilter = plansToFilter.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlans(plansToFilter);
    
    const params = new URLSearchParams();
    if (currentCategory !== 'ALL') params.set('category', currentCategory);
    if (searchTerm) params.set('search', searchTerm);
    router.replace(`/plans?${params.toString()}`, { scroll: false });

  }, [currentCategory, searchTerm, allPlans, router]);


  const handleCategoryChange = (category: PlanCategory | 'ALL') => {
    setCurrentCategory(category);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Suspense fallback={<LoadingPlans />}>
      <div>
        <h1 className="text-3xl font-bold mb-4 font-headline text-center">Explore Our Financial Plans</h1>
        <p className="text-muted-foreground text-center mb-8">
          Find the perfect plan to meet your financial goals. Apply with a single click!
        </p>
        
        <div className="mb-8 sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search plans by title or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-input"
            />
          </div>
        </div>

        <PlanCategoriesTabs currentCategory={currentCategory} onCategoryChange={handleCategoryChange} />

        {isLoading && filteredPlans.length === 0 ? ( // Show loader when filtering or initial load
           <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : filteredPlans.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No plans match your criteria. Try adjusting your search or category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {filteredPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
