
import type { Plan, Application, PlanCategory } from '@/types';

const PLANS_KEY = 'financeFlow_plans';
// const APPLICATIONS_KEY = 'financeFlow_applications'; // No longer used for applications

const isClient = typeof window !== 'undefined';

const initialPlans: Plan[] = [
  {
    id: 'plan1',
    title: 'Growth Investment Plan',
    category: 'INVESTMENT',
    description: 'A high-growth potential investment plan suitable for long-term investors.',
    details: 'Minimum investment: $1000. Expected returns: 12-15% p.a. Lock-in period: 3 years.',
    iconName: 'LineChart',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'plan2',
    title: 'Comprehensive Health Insurance',
    category: 'INSURANCE',
    description: 'Full coverage health insurance for you and your family.',
    details: 'Covers hospitalization, pre and post-hospitalization expenses. Cashless facility available.',
    iconName: 'Shield',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'plan3',
    title: 'Secure Fixed Deposit',
    category: 'FD',
    description: 'Guaranteed returns with our secure fixed deposit scheme.',
    details: 'Interest rates up to 7.5% p.a. Flexible tenure options from 6 months to 5 years.',
    iconName: 'PiggyBank',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'plan4',
    title: 'Easy Home Loan',
    category: 'LOAN',
    description: 'Get quick and easy home loans with attractive interest rates.',
    details: 'Loan amounts up to 80% of property value. Repayment tenure up to 20 years.',
    iconName: 'Landmark',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];


export const getStoredPlans = (): Plan[] => {
  if (!isClient) return []; // Should ideally return a default or handle server-side if needed
  const plansStr = localStorage.getItem(PLANS_KEY);
  if (plansStr) {
    try {
      return JSON.parse(plansStr);
    } catch (e) {
        console.error("Error parsing plans from localStorage", e);
        // Fallback to initial plans if parsing fails
        localStorage.setItem(PLANS_KEY, JSON.stringify(initialPlans));
        return initialPlans;
    }
  }
  // Initialize with default plans if nothing is stored
  localStorage.setItem(PLANS_KEY, JSON.stringify(initialPlans));
  return initialPlans;
};

export const storePlans = (plans: Plan[]): void => {
  if (!isClient) return;
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
};

// Functions getStoredApplications and storeApplications are removed as applications are now handled by Firestore.
// export const getStoredApplications = (): Application[] => {
//   if (!isClient) return [];
//   const applications = localStorage.getItem(APPLICATIONS_KEY);
//   return applications ? JSON.parse(applications) : [];
// };

// export const storeApplications = (applications: Application[]): void => {
//   if (!isClient) return;
//   localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
// };
