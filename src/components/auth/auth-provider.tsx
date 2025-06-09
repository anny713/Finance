
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password_DoNotStore: string) => Promise<boolean>;
  signup: (email: string, password_DoNotStore: string) => Promise<boolean>; // Kept for type consistency, but not used
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'anjali'; // Changed from ADMIN_EMAIL
const ADMIN_PASSWORD = '123';
const ADMIN_NAME = 'Anjali';
const ADMIN_ID = 'admin_user_anjali_001';
const ADMIN_EMAIL_INTERNAL = 'admin@finance.flow'; // Internal email for the user object

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    if (username.toLowerCase() === ADMIN_USERNAME && password_DoNotStore === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_EMAIL_INTERNAL, // Use internal email for consistency in User object
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

    setIsLoading(false);
    return false;
  }, []);

  const signup = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
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
