'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PlanCategory } from "@/types";

interface PlanCategoriesTabsProps {
  currentCategory: PlanCategory | 'ALL';
  onCategoryChange: (category: PlanCategory | 'ALL') => void;
}

const categories: (PlanCategory | 'ALL')[] = ['ALL', 'INVESTMENT', 'INSURANCE', 'FD', 'LOAN'];

export function PlanCategoriesTabs({ currentCategory, onCategoryChange }: PlanCategoriesTabsProps) {
  return (
    <Tabs value={currentCategory} onValueChange={(value) => onCategoryChange(value as PlanCategory | 'ALL')} className="mb-8">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-transparent p-0">
        {categories.map(category => (
          <TabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted transition-colors py-2 px-4 rounded-md text-sm"
          >
            {category === 'ALL' ? 'All Plans' : category.charAt(0) + category.slice(1).toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
