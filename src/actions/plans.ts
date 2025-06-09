
'use server';

import type { Plan, Application, PlanCategory } from '@/types';
import { initialPlans } from '@/lib/dataStore'; // Import initialPlans for seeding
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  getDoc as getFirestoreDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

export async function createPlanAction(planData: Omit<Plan, 'id'>): Promise<Plan | { error: string }> {
  console.log("Server Action: createPlanAction called - saving to Firestore.");
  try {
    const plansCollectionRef = collection(db, 'plans');
    const planToSave = { ...planData, createdAt: serverTimestamp() };
    const docRef = await addDoc(plansCollectionRef, planToSave);
    
    const newPlan: Plan = { 
      ...planData, 
      id: docRef.id,
      // createdAt will be a Firestore Timestamp object. We'll fetch it if needed on read.
    };
    console.log("Plan created in Firestore with ID:", docRef.id);
    return newPlan;
  } catch (e) {
    console.error("Error creating plan in Firestore:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while creating the plan.";
    return { error: `Failed to create plan: ${errorMessage}` };
  }
}

export async function updatePlanAction(planId: string, planData: Partial<Omit<Plan, 'id'>>): Promise<Plan | { error: string }> {
  console.log(`Server Action: updatePlanAction called for ID: ${planId}`);
  try {
    const planDocRef = doc(db, 'plans', planId);
    const planToUpdate = { ...planData, updatedAt: serverTimestamp() }; // Add/update an 'updatedAt' timestamp
    await updateDoc(planDocRef, planToUpdate);

    // Fetch the updated document to return it, or construct it if certain fields aren't changing
    const updatedDocSnap = await getFirestoreDoc(planDocRef);
    if (!updatedDocSnap.exists()) {
      return { error: "Failed to retrieve updated plan." };
    }
    const updatedPlanData = updatedDocSnap.data();
    const planToReturn: Plan = {
        id: updatedDocSnap.id,
        title: updatedPlanData.title,
        category: updatedPlanData.category,
        description: updatedPlanData.description,
        details: updatedPlanData.details,
        iconName: updatedPlanData.iconName,
        imageUrl: updatedPlanData.imageUrl,
        // createdAt: updatedPlanData.createdAt?.toDate ? updatedPlanData.createdAt.toDate().toISOString() : undefined,
        // updatedAt: updatedPlanData.updatedAt?.toDate ? updatedPlanData.updatedAt.toDate().toISOString() : undefined,
    };
    console.log("Plan updated in Firestore:", planId);
    return planToReturn;
  } catch (e) {
    console.error(`Error updating plan ${planId} in Firestore:`, e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while updating the plan.";
    return { error: `Failed to update plan: ${errorMessage}` };
  }
}

export async function deletePlanAction(planId: string): Promise<{ success: boolean; error?: string }> {
  console.log(`Server Action: deletePlanAction called for ID: ${planId}`);
  try {
    const planDocRef = doc(db, 'plans', planId);
    await deleteDoc(planDocRef);
    console.log("Plan deleted from Firestore:", planId);
    return { success: true };
  } catch (e) {
    console.error(`Error deleting plan ${planId} from Firestore:`, e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while deleting the plan.";
    return { success: false, error: `Failed to delete plan: ${errorMessage}` };
  }
}


async function seedInitialPlans() {
  console.log("Attempting to seed initial plans...");
  const plansCollectionRef = collection(db, 'plans');
  const existingPlansSnapshot = await getDocs(query(plansCollectionRef));
  
  if (existingPlansSnapshot.empty) {
    console.log("No existing plans found in Firestore. Seeding initial plans...");
    const batch = writeBatch(db);
    initialPlans.forEach(plan => {
      const planDocRef = doc(db, 'plans', plan.id); // Use predefined ID for seeding
      batch.set(planDocRef, { ...plan, createdAt: serverTimestamp() });
    });
    await batch.commit();
    console.log(`${initialPlans.length} initial plans seeded successfully.`);
  } else {
    console.log("Plans collection is not empty. Skipping seeding.");
  }
}


export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called - fetching from Firestore.");
  
  await seedInitialPlans().catch(err => console.error("Error during seeding:", err));

  try {
    let plansQuery = query(collection(db, 'plans'), orderBy('createdAt', 'desc')); 
    
    if (category) {
      plansQuery = query(collection(db, 'plans'), where('category', '==', category), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(plansQuery);
    
    const plans: Plan[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      plans.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        description: data.description,
        details: data.details,
        iconName: data.iconName,
        imageUrl: data.imageUrl,
        // createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(0).toISOString(), 
      } as Plan);
    });
    console.log(`Fetched ${plans.length} plans.`);
    return plans;
  } catch (e) {
    console.error("Error fetching plans from Firestore:", e);
    return []; 
  }
}

export async function getPlanByIdAction(id: string): Promise<Plan | undefined> {
  console.log(`Server Action: getPlanByIdAction called for ID: ${id} - fetching from Firestore.`);
  try {
    const planDocRef = doc(db, 'plans', id);
    const docSnap = await getFirestoreDoc(planDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const plan: Plan = {
        id: docSnap.id,
        title: data.title,
        category: data.category,
        description: data.description,
        details: data.details,
        iconName: data.iconName,
        imageUrl: data.imageUrl,
        // createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : undefined, 
      };
      console.log("Plan found:", plan);
      return plan;
    } else {
      console.log(`No plan found with ID: ${id}`);
      return undefined;
    }
  } catch (e) {
    console.error(`Error fetching plan by ID ${id} from Firestore:`, e);
    return undefined; 
  }
}

export interface PlanApplicationClientInput {
  name: string;
  mobile: string;
  income: number;
  userId?: string; 
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

  try {
    const applicationsCollectionRef = collection(db, 'planApplications');
    const newApplicationData = {
      applicantName: applicationDetails.name,
      applicantMobile: applicationDetails.mobile,
      applicantIncome: applicationDetails.income,
      planId: plan.id,
      planTitle: plan.title,
      planCategory: plan.category,
      appliedAt: serverTimestamp(), 
      status: 'PENDING',
      userId: applicationDetails.userId || null,
    };

    const docRef = await addDoc(applicationsCollectionRef, newApplicationData);
    
    // Construct application to return, handling potential timestamp conversion for appliedAt
    const createdDocSnap = await getFirestoreDoc(docRef); // Fetch to get server timestamp
    if (!createdDocSnap.exists()) {
        return { error: "Failed to create application and retrieve details." };
    }
    const createdData = createdDocSnap.data();
    const appliedAt = createdData.appliedAt instanceof Timestamp ? createdData.appliedAt.toDate().toISOString() : new Date().toISOString();


    const newApplication: Application = {
      id: docRef.id,
      applicantName: createdData.applicantName,
      applicantMobile: createdData.applicantMobile,
      applicantIncome: createdData.applicantIncome,
      planId: createdData.planId,
      planTitle: createdData.planTitle,
      planCategory: createdData.planCategory,
      appliedAt: appliedAt,
      status: createdData.status,
      userId: createdData.userId,
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
      let appliedAtISO = new Date(0).toISOString(); 
      if (data.appliedAt && typeof data.appliedAt.toDate === 'function') {
        appliedAtISO = (data.appliedAt as Timestamp).toDate().toISOString();
      } else if (data.appliedAt) {
        appliedAtISO = new Date(data.appliedAt).toISOString();
      }

      applications.push({
        id: doc.id,
        applicantName: data.applicantName,
        applicantMobile: data.applicantMobile,
        applicantIncome: data.applicantIncome,
        planId: data.planId,
        planTitle: data.planTitle,
        planCategory: data.planCategory,
        appliedAt: appliedAtISO,
        status: data.status,
        userId: data.userId,
      } as Application);
    });
    console.log(`Fetched ${applications.length} applications.`);
    return applications;
  } catch (e) {
    console.error("Error fetching applications from Firestore:", e);
    return []; 
  }
}

export async function updateApplicationStatusAction(applicationId: string, newStatus: 'APPROVED' | 'REJECTED'): Promise<Application | { error: string }> {
  console.log(`Server Action: updateApplicationStatusAction called for ID: ${applicationId}, new status: ${newStatus}`);
  try {
    const applicationDocRef = doc(db, 'planApplications', applicationId);
    await updateDoc(applicationDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp() // Add an 'updatedAt' timestamp
    });

    const updatedDocSnap = await getFirestoreDoc(applicationDocRef);
    if (!updatedDocSnap.exists()) {
      return { error: "Failed to retrieve updated application." };
    }
    const data = updatedDocSnap.data();
    let appliedAtISO = new Date(0).toISOString(); 
    if (data.appliedAt && typeof data.appliedAt.toDate === 'function') {
      appliedAtISO = (data.appliedAt as Timestamp).toDate().toISOString();
    } else if (data.appliedAt) {
      appliedAtISO = new Date(data.appliedAt).toISOString();
    }
    
    const updatedApplication: Application = {
      id: updatedDocSnap.id,
      applicantName: data.applicantName,
      applicantMobile: data.applicantMobile,
      applicantIncome: data.applicantIncome,
      planId: data.planId,
      planTitle: data.planTitle,
      planCategory: data.planCategory,
      appliedAt: appliedAtISO,
      status: data.status,
      userId: data.userId,
    };
    console.log(`Application ${applicationId} status updated to ${newStatus}. User would be notified.`);
    return updatedApplication;
  } catch (e) {
    console.error(`Error updating application status for ${applicationId}:`, e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `Failed to update application status: ${errorMessage}` };
  }
}

    