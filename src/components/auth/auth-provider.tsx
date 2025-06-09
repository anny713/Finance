
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db, auth as firebaseAuth } from '@/lib/firebase'; // Import Firebase Auth instance
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin UID will now come from Firebase Auth, not hardcoded.
// The email palanjali945@gmail.com must be created in Firebase Authentication
// and its corresponding Firestore document must have isAdmin: true.

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in via Firebase Auth
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || firestoreData.email, // Prefer Firebase Auth email
              name: firestoreData.name,
              mobile: firestoreData.mobile,
              income: firestoreData.income,
              isAdmin: firestoreData.isAdmin === true, // Critical check
            };
            setUser(appUser);
            storeCurrentUser(appUser); // Cache for quick non-sensitive UI updates
          } else {
            // No Firestore record for this Firebase Auth user.
            // For an admin app, this user isn't an admin.
            // For a general app, you might create a default profile here.
            console.warn(`No Firestore document for UID: ${firebaseUser.uid}. User needs an admin profile.`);
            // Create a basic profile if palanjali945@gmail.com is logging in and has no profile
            // This is a one-time setup convenience for the specified admin email.
            // In a real multi-user system, this might be handled differently or during a separate signup flow.
            if (firebaseUser.email?.toLowerCase() === 'palanjali945@gmail.com') {
                const adminProfile: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: 'Anjali P (Admin)', // Default admin name
                    isAdmin: true, // Crucially set isAdmin to true
                    // @ts-ignore
                    createdAt: serverTimestamp(),
                    // @ts-ignore
                    updatedAt: serverTimestamp(),
                };
                await setDoc(userDocRef, adminProfile);
                setUser(adminProfile);
                storeCurrentUser(adminProfile);
                console.log(`Admin profile created in Firestore for UID: ${firebaseUser.uid}`);
            } else {
                setUser(null); // Not an admin
                storeCurrentUser(null);
                await signOut(firebaseAuth); // Sign them out of Firebase Auth if no valid profile
            }
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore for Firebase Auth user:", error);
          setUser(null);
          storeCurrentUser(null);
          await signOut(firebaseAuth); // Sign out on error
        }
      } else {
        // User is signed out
        setUser(null);
        storeCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password_DoNotStore);
      const firebaseUser = userCredential.user;

      // After Firebase Auth login, fetch Firestore data to confirm admin status
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists() && docSnap.data().isAdmin === true) {
        const firestoreData = docSnap.data();
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || firestoreData.email,
          name: firestoreData.name,
          mobile: firestoreData.mobile,
          income: firestoreData.income,
          isAdmin: true,
        };
        setUser(appUser);
        storeCurrentUser(appUser);
        router.push(appUser.isAdmin ? '/admin' : '/'); // Redirect admin to admin page
        setIsLoading(false);
        return true;
      } else {
         // User exists in Firebase Auth but not in Firestore as admin
        // or the palanjali945@gmail.com special case for first login
        if (firebaseUser.email?.toLowerCase() === 'palanjali945@gmail.com' && !docSnap.exists()) {
            const adminProfileData = {
                email: firebaseUser.email,
                name: 'Anjali P (Admin Setup)',
                isAdmin: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, adminProfileData);
            const appUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                name: adminProfileData.name,
                income: undefined, // Or a default value
                isAdmin: true,
            };
            setUser(appUser);
            storeCurrentUser(appUser);
            router.push('/admin');
            setIsLoading(false);
            return true;
        }

        console.warn(`User ${email} (UID: ${firebaseUser.uid}) logged in via Firebase Auth, but not an admin in Firestore or profile missing.`);
        await signOut(firebaseAuth); // Sign them out as they are not a recognized admin
        setUser(null);
        storeCurrentUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Firebase Auth Login Error:", error);
      setUser(null);
      storeCurrentUser(null);
      setIsLoading(false);
      return false;
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      // onAuthStateChanged will handle setting user to null and clearing local storage
      router.push('/login');
    } catch (error) {
      console.error("Firebase Auth Logout Error:", error);
    } finally {
      setIsLoading(false); // isLoading might be set to false by onAuthStateChanged too
    }
  }, [router]);

  const updateCurrentUser = useCallback(async (updatedProfileData: Partial<User>) => {
    if (!user || !user.id) { // user.id will be Firebase UID
      console.error("No user logged in to update.");
      throw new Error("No user logged in to update.");
    }
    setIsLoading(true); 
    const userDocRef = doc(db, 'users', user.id);
    
    const dataToSave: Partial<Omit<User, 'id' | 'email' | 'isAdmin'>> & { updatedAt?: any } = {};
    if (updatedProfileData.name !== undefined) dataToSave.name = updatedProfileData.name;
    if (updatedProfileData.mobile !== undefined) dataToSave.mobile = updatedProfileData.mobile;
    if (updatedProfileData.income !== undefined && !user.isAdmin) dataToSave.income = updatedProfileData.income;
    
    dataToSave.updatedAt = serverTimestamp();
    
    try {
      await updateDoc(userDocRef, dataToSave);
      // Fetch the updated document to ensure consistency, or merge optimistically
      const updatedDocSnap = await getDoc(userDocRef);
      if (updatedDocSnap.exists()) {
          const firestoreData = updatedDocSnap.data();
          const updatedUser: User = {
            ...user, // keep existing id, email, isAdmin from auth state
            name: firestoreData.name,
            mobile: firestoreData.mobile,
            income: firestoreData.income,
          };
          setUser(updatedUser);
          storeCurrentUser(updatedUser); 
      }
      console.log("User profile updated in Firestore and locally.");
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      if (error instanceof Error) {
          throw new Error(`Failed to update profile: ${error.message}`);
      }
      throw new Error("Failed to update profile due to an unexpected error.");
    } finally {
      setIsLoading(false); 
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
