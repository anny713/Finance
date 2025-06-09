
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
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
    const currentUser = getStoredCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    if (email.toLowerCase() === ADMIN_LOGIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_LOGIN_EMAIL,
        name: ADMIN_NAME,
        isAdmin: true,
      };
      setUser(adminUser);
      storeCurrentUser(adminUser);
      // Ensure admin user exists in the general users list for consistency if needed elsewhere
      let users = getStoredUsers();
      const adminIndex = users.findIndex(u => u.id === adminUser.id);
      if (adminIndex > -1) {
        users[adminIndex] = { ...users[adminIndex], ...adminUser, password_INTERNAL_USE_ONLY: ADMIN_PASSWORD };
      } else {
        users.push({ ...adminUser, password_INTERNAL_USE_ONLY: ADMIN_PASSWORD });
      }
      storeUsers(users);
      setIsLoading(false);
      router.push('/admin');
      return true;
    }
    
    // No regular user login
    setIsLoading(false);
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    storeCurrentUser(null);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const newUserData: User = { ...prevUser, ...updatedUserData };

      // Ensure admin properties are correctly maintained
      if (prevUser.id === ADMIN_ID) {
        newUserData.isAdmin = true; 
        delete newUserData.income; // Admins don't have income
      } else {
        // This case should ideally not be hit if only admin can log in
        newUserData.isAdmin = false; 
      }
      
      storeCurrentUser(newUserData);
      
      // Update the user in the general users list
      let users = getStoredUsers();
      users = users.map(u => {
        if (u.id === newUserData.id) {
          const existingStoredUser = users.find(usr => usr.id === newUserData.id);
          const password_INTERNAL_USE_ONLY = existingStoredUser?.password_INTERNAL_USE_ONLY;
          // For admin, ensure password is the hardcoded one
          const finalPassword = newUserData.id === ADMIN_ID ? ADMIN_PASSWORD : password_INTERNAL_USE_ONLY;
          return { ...newUserData, password_INTERNAL_USE_ONLY: finalPassword };
        }
        return u;
      });
      storeUsers(users);

      return newUserData;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
