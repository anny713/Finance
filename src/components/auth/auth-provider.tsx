
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
    const localUser = getStoredCurrentUser();
    if (localUser) {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', localUser.id);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const firestoreUser = { id: docSnap.id, ...docSnap.data() } as User;
          const fullUser = { ...firestoreUser, isAdmin: localUser.isAdmin, email: localUser.email };
          setUser(fullUser);
          storeCurrentUser(fullUser);
        } else {
          setUser(null);
          storeCurrentUser(null);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching user from Firestore on initial load:", error);
        setUser(localUser);
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
        name: ADMIN_NAME,
        isAdmin: true,
      };

      try {
        const userDocRef = doc(db, 'users', ADMIN_ID);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          adminUser = {
            ...adminUser,
            name: firestoreData.name || ADMIN_NAME,
            mobile: firestoreData.mobile || undefined,
            email: ADMIN_LOGIN_EMAIL,
            isAdmin: true,
          };
        } else {
          await setDoc(userDocRef, { 
            email: ADMIN_LOGIN_EMAIL, 
            name: ADMIN_NAME, 
            isAdmin: true, 
            createdAt: serverTimestamp() 
          });
        }
        
        setUser(adminUser);
        storeCurrentUser(adminUser);
        router.push('/admin');
        return true;

      } catch (error) {
        console.error("Error during admin login with Firestore:", error);
        return false;
      } finally {
        setIsLoading(false);
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
    setIsLoading(true); // AuthContext's global loading state
    const userDocRef = doc(db, 'users', user.id);
    
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
      if (error instanceof Error) {
          throw new Error(`Failed to update profile: ${error.message}`);
      }
      throw new Error("Failed to update profile due to an unexpected error.");
    } finally {
      setIsLoading(false); // AuthContext's global loading state
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
