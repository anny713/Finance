'use server';

import type { Plan, Application, User, PlanCategory } from '@/types';
import { getStoredPlans, storePlans, getStoredApplications, storeApplications } from '@/lib/dataStore'; // These are client-side, so this won't work directly in server actions.
// For server actions, we'd typically use a database.
// This file will simulate server-side logic but acknowledge limitations with direct localStorage use.
// In a real app, these functions would interact with a DB.

// Mocking database operations. In a real scenario, direct localStorage access from server actions is not possible.
// We'll assume these functions are called in contexts where localStorage is polyfilled or they represent API calls.

export async function createPlanAction(planData: Omit<Plan, 'id'>): Promise<Plan> {
  // This is a conceptual server action. Direct localStorage use here is illustrative.
  // In a real app, this would write to a database.
  console.log("Server Action: createPlanAction called. This would normally interact with a DB.");
  
  // The following localStorage logic would actually run client-side if this code was imported there,
  // or fail server-side without a polyfill. It's here to represent the *intent* of data persistence.
  const plans = getStoredPlans(); // conceptual: fetch from DB
  const newPlan: Plan = { ...planData, id: Date.now().toString() };
  const updatedPlans = [...plans, newPlan];
  storePlans(updatedPlans); // conceptual: save to DB
  return newPlan;
}

export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called.");
  const plans = getStoredPlans(); // conceptual: fetch from DB
  if (category) {
    return plans.filter(plan => plan.category === category);
  }
  return plans;
}

export async function getPlanByIdAction(id: string): Promise<Plan | undefined> {
  console.log("Server Action: getPlanByIdAction called.");
  const plans = getStoredPlans(); // conceptual: fetch from DB
  return plans.find(plan => plan.id === id);
}

export async function applyForPlanAction(planId: string, user: User): Promise<Application | { error: string }> {
  console.log("Server Action: applyForPlanAction called.");
  if (!user || !user.id || !user.name || !user.mobile || typeof user.income !== 'number') {
    return { error: "User profile is incomplete. Please update your name, mobile, and income." };
  }

  const plan = await getPlanByIdAction(planId);
  if (!plan) {
    return { error: "Plan not found." };
  }

  const applications = getStoredApplications(); // conceptual: fetch from DB
  const newApplication: Application = {
    id: Date.now().toString(),
    userId: user.id,
    planId: plan.id,
    userName: user.name,
    userMobile: user.mobile,
    userIncome: user.income,
    planTitle: plan.title,
    planCategory: plan.category,
    appliedAt: new Date().toISOString(),
    status: 'PENDING',
  };
  const updatedApplications = [...applications, newApplication];
  storeApplications(updatedApplications); // conceptual: save to DB
  return newApplication;
}

export async function getApplicationsAction(): Promise<Application[]> {
  console.log("Server Action: getApplicationsAction called.");
  return getStoredApplications(); // conceptual: fetch from DB
}
