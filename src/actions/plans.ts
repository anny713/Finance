
'use server';

import type { Plan, Application, PlanCategory } from '@/types';
import { getStoredPlans, storePlans }_MODIFIED_ from '@/lib/dataStore';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc as getFirestoreDoc } from 'firebase/firestore';

export async function createPlanAction(planData: Omit<Plan, 'id'>): Promise<Plan> {
  console.log("Server Action: createPlanAction called.");
  // This action still uses localStorage for plans as per current scope.
  // If plans also need to move to Firestore, this would need updating.
  const plans = getStoredPlans();
  const newPlan: Plan = { ...planData, id: Date.now().toString() }; // Consider Firestore auto-ID for plans if they move
  const updatedPlans = [...plans, newPlan];
  storePlans(updatedPlans);
  return newPlan;
}

export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called.");
  // This action still uses localStorage for plans.
  return getStoredPlans().filter(plan => !category || plan.category === category);
}

export async function getPlanByIdAction(id: string): Promise<Plan | undefined> {
  console.log("Server Action: getPlanByIdAction called.");
  // This action still uses localStorage for plans.
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

  // Fetch plan details (still from localStorage for now, but in a full Firestore app, this might come from Firestore too)
  const plan = await getPlanByIdAction(planId);
  if (!plan) {
    return { error: "Plan not found." };
  }

  try {
    const applicationsCollectionRef = collection(db, 'planApplications');
    const newApplicationData = {
      applicantName: applicationDetails.name,
      applicantMobile: applicationDetails.mobile,
      applicantIncome: applicationDetails.income,
      planId: plan.id,
      planTitle: plan.title,
      planCategory: plan.category,
      appliedAt: serverTimestamp(), // Use Firestore server timestamp
      status: 'PENDING',
      userId: applicationDetails.userId || null, // Store null if undefined
    };

    const docRef = await addDoc(applicationsCollectionRef, newApplicationData);
    
    // To return the full Application object, we fetch it back or construct it
    // For simplicity, we'll construct it, assuming serverTimestamp will be resolved correctly by Firestore.
    // A more robust way might involve fetching the doc after write if precise timestamp is needed immediately.
    const newApplication: Application = {
      id: docRef.id,
      ...newApplicationData,
      appliedAt: new Date().toISOString(), // Placeholder, Firestore handles the actual timestamp
    };
    
    console.log("Application submitted to Firestore with ID:", docRef.id);
    return newApplication;

  } catch (e) {
    console.error("Error submitting application to Firestore:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while submitting your application.";
    return { error: `Failed to submit application: ${errorMessage}` };
  }
}

export async function getApplicationsAction(): Promise<Application[]> {
  console.log("Server Action: getApplicationsAction called - fetching from Firestore.");
  try {
    const applicationsCollectionRef = collection(db, 'planApplications');
    const q = query(applicationsCollectionRef, orderBy('appliedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      applications.push({
        id: doc.id,
        applicantName: data.applicantName,
        applicantMobile: data.applicantMobile,
        applicantIncome: data.applicantIncome,
        planId: data.planId,
        planTitle: data.planTitle,
        planCategory: data.planCategory,
        // Firestore Timestamps need to be converted to ISO strings
        appliedAt: data.appliedAt?.toDate ? data.appliedAt.toDate().toISOString() : new Date(0).toISOString(),
        status: data.status,
        userId: data.userId,
      } as Application);
    });
    return applications;
  } catch (e) {
    console.error("Error fetching applications from Firestore:", e);
    return []; // Return empty array on error
  }
}
