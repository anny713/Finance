
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_LOGIN_EMAIL = 'admin@finance.flow';
const ADMIN_PASSWORD = '123';
const ADMIN_NAME = 'Anjali';
const ADMIN_ID = 'admin_user_anjali_001';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for an existing session
    const localUser = getStoredCurrentUser();
    if (localUser) {
      // If user found in local storage, fetch their latest profile from Firestore
      setIsLoading(true);
      const userDocRef = doc(db, 'users', localUser.id);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const firestoreUser = { id: docSnap.id, ...docSnap.data() } as User;
          // Merge with localUser to ensure isAdmin is correctly set from initial admin definition
          const fullUser = { ...firestoreUser, isAdmin: localUser.isAdmin, email: localUser.email };
          setUser(fullUser);
          storeCurrentUser(fullUser); // Update local storage with fresh data
        } else {
          // User in local storage but not in Firestore (e.g. deleted from DB)
          // Treat as logged out
          setUser(null);
          storeCurrentUser(null);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching user from Firestore on initial load:", error);
        // If error fetching, rely on local storage or log out
        setUser(localUser); // Or setUser(null); storeCurrentUser(null);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    if (email.toLowerCase() === ADMIN_LOGIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      let adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_LOGIN_EMAIL,
        name: ADMIN_NAME, // Default name
        isAdmin: true,
      };

      try {
        const userDocRef = doc(db, 'users', ADMIN_ID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          adminUser = {
            ...adminUser, // Base admin details
            name: firestoreData.name || ADMIN_NAME, // Use Firestore name or default
            mobile: firestoreData.mobile || undefined,
            // Ensure email and isAdmin are not overwritten by Firestore if they shouldn't be
            email: ADMIN_LOGIN_EMAIL,
            isAdmin: true,
          };
        } else {
          // Admin document doesn't exist, create it with default details
          // This part is optional, admin profile could be pre-created in Firestore
          await setDoc(userDocRef, { 
            email: ADMIN_LOGIN_EMAIL, 
            name: ADMIN_NAME, 
            isAdmin: true, 
            createdAt: serverTimestamp() 
          });
          // adminUser already has the correct default values
        }
        
        setUser(adminUser);
        storeCurrentUser(adminUser);
        setIsLoading(false);
        router.push('/admin');
        return true;

      } catch (error) {
        console.error("Error during admin login with Firestore:", error);
        setIsLoading(false);
        return false;
      }
    }
    
    setIsLoading(false);
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    storeCurrentUser(null);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback(async (updatedProfileData: Partial<User>) => {
    if (!user) {
      console.error("No user logged in to update.");
      return;
    }
    setIsLoading(true);
    const userDocRef = doc(db, 'users', user.id);
    
    // Prepare data for Firestore, ensuring not to save undefined fields that might clear existing ones unintentionally
    // unless explicitly set to null or a new value.
    const dataToSave: Partial<User> = {};
    if (updatedProfileData.name !== undefined) dataToSave.name = updatedProfileData.name;
    if (updatedProfileData.mobile !== undefined) dataToSave.mobile = updatedProfileData.mobile;
    // Income is not for admin
    // if (updatedProfileData.income !== undefined && !user.isAdmin) dataToSave.income = updatedProfileData.income;
    
    try {
      await updateDoc(userDocRef, { ...dataToSave, updatedAt: serverTimestamp() });
      const updatedUser = { ...user, ...dataToSave };
      setUser(updatedUser);
      storeCurrentUser(updatedUser); // Update local storage as well
      console.log("User profile updated in Firestore and locally.");
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
      // Potentially revert local state or notify user
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
