'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { ContactSubmission } from '@/types';

export type ContactFormInput = Omit<ContactSubmission, 'id' | 'createdAt'>;

export async function submitContactFormAction(
  formData: ContactFormInput
): Promise<{ success: boolean; error?: string }> {
  console.log("Server Action: submitContactFormAction called.");

  // Basic server-side validation
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return { success: false, error: 'All fields are required.' };
  }

  try {
    const submissionsCollectionRef = collection(db, 'contactSubmissions');
    
    const submissionData = {
      ...formData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(submissionsCollectionRef, submissionData);
    
    console.log("Contact form submission saved to Firestore with ID:", docRef.id);
    return { success: true };

  } catch (e) {
    console.error("Error submitting contact form to Firestore:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { success: false, error: `Failed to send message: ${errorMessage}` };
  }
}
