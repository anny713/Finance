
'use server';

import type { Plan, Application, User, PlanCategory } from '@/types';
import { getStoredPlans, storePlans, getStoredApplications, storeApplications } from '@/lib/dataStore';

export async function createPlanAction(planData: Omit<Plan, 'id'>): Promise<Plan> {
  console.log("Server Action: createPlanAction called.");
  const plans = getStoredPlans();
  const newPlan: Plan = { ...planData, id: Date.now().toString() };
  const updatedPlans = [...plans, newPlan];
  storePlans(updatedPlans);
  return newPlan;
}

export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called.");
  const plans = getStoredPlans();
  if (category) {
    return plans.filter(plan => plan.category === category);
  }
  return plans;
}

export async function getPlanByIdAction(id: string): Promise<Plan | undefined> {
  console.log("Server Action: getPlanByIdAction called.");
  const plans = getStoredPlans();
  return plans.find(plan => plan.id === id);
}

export interface PlanApplicationClientInput {
  name: string;
  mobile: string;
  income: number;
  userId?: string; // Optional user ID if logged in
}

export async function applyForPlanAction(planId: string, applicationDetails: PlanApplicationClientInput): Promise<Application | { error: string }> {
  console.log("Server Action: applyForPlanAction called.");

  if (!applicationDetails.name || !applicationDetails.mobile || typeof applicationDetails.income !== 'number' || applicationDetails.income <= 0) {
    return { error: "Applicant name, mobile, and a valid income are required." };
  }

  const plan = await getPlanByIdAction(planId);
  if (!plan) {
    return { error: "Plan not found." };
  }

  const applications = getStoredApplications();
  const newApplication: Application = {
    id: Date.now().toString(),
    userId: applicationDetails.userId, // Will be undefined if user is not logged in
    applicantName: applicationDetails.name,
    applicantMobile: applicationDetails.mobile,
    applicantIncome: applicationDetails.income,
    planId: plan.id,
    planTitle: plan.title,
    planCategory: plan.category,
    appliedAt: new Date().toISOString(),
    status: 'PENDING',
  };
  const updatedApplications = [...applications, newApplication];
  storeApplications(updatedApplications);
  return newApplication;
}

export async function getApplicationsAction(): Promise<Application[]> {
  console.log("Server Action: getApplicationsAction called.");
  return getStoredApplications();
}
