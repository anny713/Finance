
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
const ADMIN_NAME = 'Anjali'; // Default name if not found in Firestore for the admin
const ADMIN_ID = 'RpFANN3bnoeaMdnGBZJJZKyDndt2'; // Updated to the provided UID

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const localUser = getStoredCurrentUser();
    if (localUser) {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', localUser.id);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          let validatedUser: User | null = null;

          if (localUser.id === ADMIN_ID) { // Admin user rehydration
            if (firestoreData.isAdmin === true) {
              validatedUser = {
                id: docSnap.id,
                email: localUser.email, // Use email from localStorage as it was the login identifier
                name: firestoreData.name || ADMIN_NAME,
                mobile: firestoreData.mobile,
                isAdmin: true,
              };
            } else {
              console.warn("Admin session rehydration failed: Firestore record indicates not an admin or isAdmin field missing for UID:", localUser.id);
            }
          } else { 
             validatedUser = { 
                id: docSnap.id, 
                email: localUser.email, 
                name: firestoreData.name,
                mobile: firestoreData.mobile,
                income: firestoreData.income,
                isAdmin: firestoreData.isAdmin || false, 
              };
          }

          if (validatedUser) {
            setUser(validatedUser);
            storeCurrentUser(validatedUser);
          } else {
            setUser(null);
            storeCurrentUser(null);
          }
        } else {
          console.warn(`User ${localUser.id} found in localStorage but not in Firestore. Logging out.`);
          setUser(null);
          storeCurrentUser(null);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching user from Firestore on initial load:", error);
        setUser(null);
        storeCurrentUser(null);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    if (email.toLowerCase() === ADMIN_LOGIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      let adminUserToSet: User | null = null;
      try {
        const userDocRef = doc(db, 'users', ADMIN_ID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          if (firestoreData.isAdmin === true) {
            adminUserToSet = {
              id: ADMIN_ID,
              email: ADMIN_LOGIN_EMAIL,
              name: firestoreData.name || ADMIN_NAME,
              mobile: firestoreData.mobile || undefined,
              isAdmin: true,
            };
          } else {
            console.warn(`Admin login attempt for ${ADMIN_LOGIN_EMAIL} (UID: ${ADMIN_ID}) failed: Firestore record does not have isAdmin: true.`);
            setIsLoading(false);
            return false;
          }
        } else {
          adminUserToSet = {
            id: ADMIN_ID,
            email: ADMIN_LOGIN_EMAIL,
            name: ADMIN_NAME,
            isAdmin: true,
          };
          await setDoc(userDocRef, { 
            email: adminUserToSet.email, 
            name: adminUserToSet.name, 
            isAdmin: adminUserToSet.isAdmin, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp() 
          });
          console.log(`Admin user ${ADMIN_ID} (email: ${adminUserToSet.email}) created in Firestore.`);
        }
        
        if (adminUserToSet) {
            setUser(adminUserToSet);
            storeCurrentUser(adminUserToSet);
            router.push('/admin');
            setIsLoading(false);
            return true;
        }
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
      throw new Error("No user logged in to update.");
    }
    setIsLoading(true); 
    const userDocRef = doc(db, 'users', user.id);
    
    const dataToSave: Partial<Omit<User, 'id' | 'email' | 'isAdmin'>> & { updatedAt?: any } = {};
    if (updatedProfileData.name !== undefined) dataToSave.name = updatedProfileData.name;
    if (updatedProfileData.mobile !== undefined) dataToSave.mobile = updatedProfileData.mobile;
    
    dataToSave.updatedAt = serverTimestamp();
    
    try {
      await updateDoc(userDocRef, dataToSave);
      const updatedUser = { ...user, ...dataToSave }; 
      setUser(updatedUser);
      storeCurrentUser(updatedUser); 
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
