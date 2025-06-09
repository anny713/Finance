
import type { Plan } from '@/types';

// const PLANS_KEY = 'financeFlow_plans'; // Removed, plans are now in Firestore

// Initial plans data, will be used to seed Firestore if the 'plans' collection is empty.
export const initialPlans: Plan[] = [
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

// getStoredPlans and storePlans are removed as plans are now managed in Firestore via server actions.
// Applications are also managed via Firestore (kept for reference of what was removed).
// const APPLICATIONS_KEY = 'financeFlow_applications';
// const isClient = typeof window !== 'undefined';
// export const getStoredApplications = (): Application[] => {
//   if (!isClient) return [];
//   const applications = localStorage.getItem(APPLICATIONS_KEY);
//   return applications ? JSON.parse(applications) : [];
// };

// export const storeApplications = (applications: Application[]): void => {
//   if (!isClient) return;
//   localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
// };
