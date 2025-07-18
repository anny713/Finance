
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
  writeBatch,
  collectionGroup
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
      const planDocRef = doc(collection(db, 'plans'));
      const planData = { ...plan, id: planDocRef.id, createdAt: serverTimestamp() };
      batch.set(planDocRef, planData);
    });
    await batch.commit();
    console.log(`${initialPlans.length} initial plans seeded successfully.`);
  } else {
    console.log("Plans collection is not empty. Skipping seeding.");
  }
}


export async function getPlansAction(category?: PlanCategory): Promise<Plan[]> {
  console.log("Server Action: getPlansAction called - fetching from Firestore.");
  
  // No need to await seed here every time, let's make it more efficient
  const plansCollectionRef = collection(db, 'plans');
  const existingPlansSnapshot = await getDocs(query(plansCollectionRef, where('title', '!=', '')));
  if (existingPlansSnapshot.empty) {
    await seedInitialPlans();
  }

  try {
    let plansQuery;
    if (category) {
      plansQuery = query(plansCollectionRef, where('category', '==', category), orderBy('title', 'asc'));
    } else {
      plansQuery = query(plansCollectionRef, orderBy('title', 'asc')); 
    }

    const querySnapshot = await getDocs(plansQuery);
    
    if (querySnapshot.empty && !existingPlansSnapshot.empty) {
      // This case might happen right after seeding, let's re-fetch
      const freshSnapshot = await getDocs(query(plansCollectionRef, orderBy('title', 'asc')));
       const plans: Plan[] = freshSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Plan));
       console.log(`Fetched ${plans.length} plans on retry.`);
      return plans;
    }
    
    const plans: Plan[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Plan));

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
    // We will now write to a top-level 'applications' collection for admin querying
    const applicationsCollectionRef = collection(db, 'applications');
    
    const newApplicationData = {
      applicantName: applicationDetails.name,
      applicantMobile: applicationDetails.mobile,
      applicantIncome: applicationDetails.income,
      planId: plan.id,
      planTitle: plan.title,
      planCategory: plan.category,
      appliedAt: serverTimestamp(), 
      status: 'PENDING',
      userId: applicationDetails.userId || null, // Capture userId if available
    };

    const docRef = await addDoc(applicationsCollectionRef, newApplicationData);
    
    const createdDocSnap = await getFirestoreDoc(docRef);
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
    
    // If user is logged in, also add a copy to their own subcollection
    if (applicationDetails.userId) {
        const userApplicationsRef = collection(db, 'users', applicationDetails.userId, 'applications');
        await addDoc(userApplicationsRef, newApplicationData);
        console.log(`Application copy saved for user ${applicationDetails.userId}`);
    }

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
    // Fetch from the top-level 'applications' collection for the admin view
    const applicationsCollectionRef = collection(db, 'applications');
    const q = query(applicationsCollectionRef, orderBy('appliedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const appliedAt = data.appliedAt instanceof Timestamp ? data.appliedAt.toDate().toISOString() : new Date().toISOString();

      applications.push({
        id: doc.id,
        applicantName: data.applicantName,
        applicantMobile: data.applicantMobile,
        applicantIncome: data.applicantIncome,
        planId: data.planId,
        planTitle: data.planTitle,
        planCategory: data.planCategory,
        appliedAt: appliedAt,
        status: data.status,
        userId: data.userId,
      } as Application);
    });
    console.log(`Fetched ${applications.length} applications from top-level collection.`);
    return applications;
  } catch (e) {
    console.error("Error fetching applications from Firestore:", e);
    return []; 
  }
}

export async function updateApplicationStatusAction(applicationId: string, newStatus: 'APPROVED' | 'REJECTED'): Promise<Application | { error: string }> {
  console.log(`Server Action: updateApplicationStatusAction called for ID: ${applicationId}, new status: ${newStatus}`);
  try {
    // Update the document in the top-level collection
    const applicationDocRef = doc(db, 'applications', applicationId);
    await updateDoc(applicationDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    const updatedDocSnap = await getFirestoreDoc(applicationDocRef);
    if (!updatedDocSnap.exists()) {
      return { error: "Failed to retrieve updated application." };
    }
    const data = updatedDocSnap.data();
    const appliedAt = data.appliedAt instanceof Timestamp ? data.appliedAt.toDate().toISOString() : new Date().toISOString();
    
    const updatedApplication: Application = {
      id: updatedDocSnap.id,
      applicantName: data.applicantName,
      applicantMobile: data.applicantMobile,
      applicantIncome: data.applicantIncome,
      planId: data.planId,
      planTitle: data.planTitle,
      planCategory: data.planCategory,
      appliedAt: appliedAt,
      status: data.status,
      userId: data.userId,
    };

    // If there's a userId, try to update the user's copy as well
    if (data.userId) {
        const userAppQuery = query(collection(db, `users/${data.userId}/applications`), where("planId", "==", data.planId), where("applicantName", "==", data.applicantName));
        const userAppSnapshot = await getDocs(userAppQuery);
        userAppSnapshot.forEach(async (docToUpdate) => {
            await updateDoc(docToUpdate.ref, { status: newStatus, updatedAt: serverTimestamp() });
            console.log(`Updated user-side application status for ${docToUpdate.id}`);
        });
    }

    console.log(`Application ${applicationId} status updated to ${newStatus}.`);
    return updatedApplication;
  } catch (e) {
    console.error(`Error updating application status for ${applicationId}:`, e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `Failed to update application status: ${errorMessage}` };
  }
}
