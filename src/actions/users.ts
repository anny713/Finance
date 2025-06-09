
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import type { User } from '@/types';
import { UserProfileFormSchema, type UserProfileFormInput } from '@/lib/schemas';

interface CreateUserResult {
  user?: Pick<User, 'id' | 'email' | 'name' | 'income'>; 
  error?: string;
  isExisting?: boolean;
}

export async function createUserAction(data: UserProfileFormInput): Promise<CreateUserResult> {
  try {
    const validatedData = UserProfileFormSchema.parse(data);

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", validatedData.email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { error: "A user with this email address already exists.", isExisting: true };
    }

    const newUserDoc = {
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      income: validatedData.income,
      isAdmin: false, 
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // mobile is not collected by this form
    };

    const docRef = await addDoc(collection(db, 'users'), newUserDoc);
    
    return { 
      user: { 
        id: docRef.id, 
        email: newUserDoc.email,
        name: newUserDoc.name,
        income: newUserDoc.income,
      } 
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      // Return the first validation error
      return { error: e.errors[0]?.message || "Validation failed." };
    }
    console.error("Error creating user profile in Firestore:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: `Failed to create user profile: ${errorMessage}` };
  }
}
