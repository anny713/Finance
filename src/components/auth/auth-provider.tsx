
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  signup: (email: string, password_DoNotStore: string) => Promise<boolean>; // Kept for type consistency, but not used
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@finance.flow';
const ADMIN_PASSWORD = '123'; // Updated password
const ADMIN_NAME = 'Anjali';
const ADMIN_ID = 'admin_user_anjali_001';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    if (email.toLowerCase() === ADMIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        isAdmin: true,
      };
      setUser(adminUser);
      storeCurrentUser(adminUser);

      let users = getStoredUsers();
      const adminIndex = users.findIndex(u => u.id === adminUser.id);
      if (adminIndex > -1) {
        users[adminIndex] = adminUser;
      } else {
        users.push(adminUser);
      }
      storeUsers(users);

      setIsLoading(false);
      return true;
    }

    // Since signup is removed and only admin login is intended,
    // we can effectively disable non-admin login by always returning false here.
    setIsLoading(false);
    return false;
  }, []);

  // Signup is effectively disabled as per previous requests.
  // This function will not be called from UI but kept for type consistency.
  const signup = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    // In an admin-only app, new signups are not allowed.
    console.warn("Signup attempt blocked in admin-only mode.");
    setIsLoading(false);
    return false; 
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storeCurrentUser(null);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      // Prevent isAdmin from being changed via profile update for security
      const { isAdmin, ...restOfUpdateData } = updatedUserData;
      const newUserData = { ...prevUser, ...restOfUpdateData };
      
      if (prevUser.id === ADMIN_ID) {
        newUserData.isAdmin = true;
      } else if (isAdmin !== undefined && prevUser.id !== ADMIN_ID) {
        console.warn("Attempt to modify isAdmin flag for non-admin user blocked.");
      }

      storeCurrentUser(newUserData);
      
      let users = getStoredUsers();
      users = users.map(u => u.id === newUserData.id ? newUserData : u);
      storeUsers(users);

      return newUserData;
    });
  }, []);


  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
