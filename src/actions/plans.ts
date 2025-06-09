
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
  where,
  Timestamp
} from 'firebase/firestore';

export async function createPlanAction(planData: Omit<Plan, 'id'>): Promise<Plan> {
  console.log("Server Action: createPlanAction called - saving to Firestore.");
  try {
    const plansCollectionRef = collection(db, 'plans');
    // Add a server timestamp for when the plan was created, if desired
    const planToSave = { ...planData, createdAt: serverTimestamp() };
    const docRef = await addDoc(plansCollectionRef, planToSave);
    
    // Construct the plan object to return, including the Firestore-generated ID
    // and resolving createdAt (if needed, or just return what was saved)
    const newPlan: Plan = { 
      ...planData, 
      id: docRef.id,
      // Note: 'createdAt' will be a Firestore Timestamp object in the database.
      // For simplicity, we don't fetch it back here, but it's saved.
    };
    console.log("Plan created in Firestore with ID:", docRef.id);
    return newPlan;
  } catch (e) {
    console.error("Error creating plan in Firestore:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while creating the plan.";
    // Re-throw or return an error object, depending on desired error handling
    throw new Error(`Failed to create plan: ${errorMessage}`);
  }
}

async function seedInitialPlans() {
  console.log("Attempting to seed initial plans...");
  const plansCollectionRef = collection(db, 'plans');
  // Check if plans already exist to avoid re-seeding (optional, can be more robust)
  const existingPlansSnapshot = await getDocs(query(plansCollectionRef)); // Limiting to 1 for check
  if (existingPlansSnapshot.empty) {
    console.log("No existing plans found in Firestore. Seeding initial plans...");
    const batchPromises: Promise<void>[] = [];
    initialPlans.forEach(plan => {
      const planDocRef = doc(db, 'plans', plan.id); // Use predefined ID for seeding
      batchPromises.push(setDoc(planDocRef, { ...plan, createdAt: serverTimestamp() }));
    });
    await Promise.all(batchPromises);
    console.log(`${initialPlans.length} initial plans seeded successfully.`);
  } else {
    console.log("Plans collection is not empty. Skipping seeding.");
  }
}


export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called - fetching from Firestore.");
  
  // Attempt to seed initial plans if the collection is empty
  await seedInitialPlans().catch(err => console.error("Error during seeding:", err));

  try {
    let plansQuery = query(collection(db, 'plans'), orderBy('createdAt', 'desc')); // Order by creation time
    
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
        // createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date(0).toISOString(), // If needed
      } as Plan);
    });
    console.log(`Fetched ${plans.length} plans.`);
    return plans;
  } catch (e) {
    console.error("Error fetching plans from Firestore:", e);
    return []; // Return empty array on error
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
        // createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : undefined, // If needed
      };
      console.log("Plan found:", plan);
      return plan;
    } else {
      console.log(`No plan found with ID: ${id}`);
      return undefined;
    }
  } catch (e) {
    console.error(`Error fetching plan by ID ${id} from Firestore:`, e);
    return undefined; // Return undefined on error
  }
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
    
    const newApplication: Application = {
      id: docRef.id,
      ...newApplicationData,
      // Firestore Timestamps are objects; convert to ISO string for client consistency if needed
      // For this structure, appliedAt is expected as string by Application type.
      // Firestore handles serverTimestamp(), so we'll approximate for the return object.
      // The actual value in DB will be correct.
      appliedAt: new Date().toISOString(), // Placeholder; Firestore timestamp will be accurate.
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
      // Ensure appliedAt is converted from Firestore Timestamp to ISO string
      let appliedAtISO = new Date(0).toISOString(); // Default for safety
      if (data.appliedAt && typeof data.appliedAt.toDate === 'function') {
        appliedAtISO = (data.appliedAt as Timestamp).toDate().toISOString();
      } else if (data.appliedAt) {
        // If it's already a string or number, try to parse it (less ideal)
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
    return []; // Return empty array on error
  }
}
