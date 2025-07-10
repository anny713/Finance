
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth as firebaseAuth } from '@/lib/firebase';
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          const appUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || firestoreData.email,
            name: firestoreData.name,
            mobile: firestoreData.mobile,
            income: firestoreData.income,
            isAdmin: firestoreData.isAdmin === true,
          };
          setUser(appUser);
          storeCurrentUser(appUser);
        } else {
          // This logic creates an admin profile on the very first login for the designated admin email.
          // In a real-world scenario, you might have a separate admin creation script.
          if (firebaseUser.email?.toLowerCase() === 'palanjali945@gmail.com') {
              const adminProfile: User = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: 'Admin User',
                  isAdmin: true,
              };
              await setDoc(userDocRef, { ...adminProfile, createdAt: serverTimestamp() });
              setUser(adminProfile);
              storeCurrentUser(adminProfile);
              console.log(`Admin profile created in Firestore for UID: ${firebaseUser.uid}`);
          } else {
              // This is a regular user without a Firestore document yet.
              // For this app, non-admins don't need immediate Firestore docs upon login.
              const regularUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                isAdmin: false,
              };
              setUser(regularUser);
              storeCurrentUser(regularUser);
          }
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        setUser(null);
        storeCurrentUser(null);
      }
    } else {
      setUser(null);
      storeCurrentUser(null);
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
    return () => unsubscribe();
  }, [handleUser]);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password_DoNotStore);
      // onAuthStateChanged will handle setting user state and redirection via its own effect.
      // We just need to wait for it to complete. The state update will trigger redirection where needed.
      return true;
    } catch (error) {
      console.error("Firebase Auth Login Error:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      // onAuthStateChanged will handle setting user to null.
      router.push('/login');
    } catch (error) {
      console.error("Firebase Auth Logout Error:", error);
    } finally {
      // The onAuthStateChanged listener will set loading to false.
    }
  }, [router]);

  const updateCurrentUser = useCallback(async (updatedProfileData: Partial<User>) => {
    if (!user || !user.id) {
      throw new Error("No user logged in to update.");
    }
    setIsLoading(true); 
    const userDocRef = doc(db, 'users', user.id);
    
    const dataToSave: Partial<User> & { updatedAt?: any } = { ...updatedProfileData };
    delete dataToSave.id; // Don't try to write id field
    delete dataToSave.email; // Don't try to write email field
    delete dataToSave.isAdmin; // Don't allow changing admin status from client
    
    dataToSave.updatedAt = serverTimestamp();
    
    try {
      await updateDoc(userDocRef, dataToSave);
      const updatedUser: User = { ...user, ...dataToSave };
      setUser(updatedUser);
      storeCurrentUser(updatedUser);
      console.log("User profile updated.");
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : "Unexpected error"}`);
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
