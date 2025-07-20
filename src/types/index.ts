
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
  createdAt?: string; // ISO date string, made optional
};

export type Application = {
  id: string; // Application ID
  applicantName: string; 
  applicantMobile: string; 
  applicantIncome: number; 
  planId: string;
  planTitle: string;
  planCategory: PlanCategory;
  appliedAt: string; // ISO date string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId?: string; // Optional: if a user happened to be logged in
};

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  adminOnly?: boolean;
  loggedInOnly?: boolean;
  loggedOutOnly?: boolean;
  children?: NavItem[]; // For dropdown menus
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string; // ISO date string
};
