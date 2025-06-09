import type { LucideIcon } from 'lucide-react';

export type User = {
  id: string;
  email: string;
  name?: string;
  mobile?: string;
  income?: number;
  isAdmin?: boolean;
};

export type PlanCategory = 'INVESTMENT' | 'INSURANCE' | 'FD' | 'LOAN';

export type Plan = {
  id: string;
  title: string;
  category: PlanCategory;
  description: string;
  details?: string; // Additional details or how to apply
  iconName?: string; // Name of lucide-icon
  imageUrl?: string; // Optional image for the plan
  // Fields from prompt: application links (covered by apply button), 
  // other fields can be in description or details
};

export type Application = {
  id: string;
  userId: string;
  planId: string;
  userName: string;
  userMobile: string;
  userIncome: number;
  planTitle: string;
  planCategory: PlanCategory;
  appliedAt: string; // ISO date string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  adminOnly?: boolean;
  loggedInOnly?: boolean;
  loggedOutOnly?: boolean;
};
