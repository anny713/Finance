
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>; // Changed username to email
  signup: (email: string, password_DoNotStore: string) => Promise<boolean>; // Re-enabled
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_LOGIN_EMAIL = 'admin@finance.flow'; // Changed from ADMIN_USERNAME
const ADMIN_PASSWORD = '123';
const ADMIN_NAME = 'Anjali';
const ADMIN_ID = 'admin_user_anjali_001';

// WARNING: Storing passwords directly in localStorage is insecure and for prototype purposes ONLY.
// In a real application, passwords must be hashed and verified securely on a server.

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

    // Admin login check
    if (email.toLowerCase() === ADMIN_LOGIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_LOGIN_EMAIL,
        name: ADMIN_NAME,
        isAdmin: true,
        // Admin does not have an income field
      };
      setUser(adminUser);
      storeCurrentUser(adminUser);

      // Ensure admin user exists in the main user list or add them
      let users = getStoredUsers();
      const adminIndex = users.findIndex(u => u.id === adminUser.id);
      if (adminIndex > -1) {
        users[adminIndex] = { ...adminUser, password_INTERNAL_USE_ONLY: ADMIN_PASSWORD };
      } else {
        users.push({ ...adminUser, password_INTERNAL_USE_ONLY: ADMIN_PASSWORD });
      }
      storeUsers(users);

      setIsLoading(false);
      router.push('/admin');
      return true;
    }

    // Regular user login check
    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password_INTERNAL_USE_ONLY === password_DoNotStore && !u.isAdmin
    );

    if (foundUser) {
      const { password_INTERNAL_USE_ONLY, ...userToStore } = foundUser;
      setUser(userToStore);
      storeCurrentUser(userToStore);
      setIsLoading(false);
      router.push(userToStore.name && userToStore.mobile && typeof userToStore.income === 'number' ? '/plans' : '/profile'); // Redirect based on profile completion
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, [router]);

  const signup = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    let users = getStoredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      setIsLoading(false);
      return false; // User already exists
    }

    const newUser: User & { password_INTERNAL_USE_ONLY: string } = {
      id: `user_${Date.now().toString()}_${Math.random().toString(36).substring(2, 7)}`,
      email: email.toLowerCase(),
      isAdmin: false,
      // Name, mobile, income will be set in profile
      password_INTERNAL_USE_ONLY: password_DoNotStore, // Storing password for prototype login
    };
    
    users.push(newUser);
    storeUsers(users);

    const { password_INTERNAL_USE_ONLY, ...userToStore } = newUser;
    setUser(userToStore);
    storeCurrentUser(userToStore);
    
    setIsLoading(false);
    router.push('/profile'); // Redirect to profile page after signup
    return true;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    storeCurrentUser(null);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const { isAdmin: newIsAdminFlag, income: newIncome, ...restOfUpdateData } = updatedUserData;
      
      let newUserData: User = { ...prevUser, ...restOfUpdateData };

      if (prevUser.id === ADMIN_ID) { // Admin specific logic
        newUserData.isAdmin = true; 
        if (newUserData.hasOwnProperty('income')) {
           delete newUserData.income;
        }
      } else { // Regular user logic
        if (newIncome !== undefined) {
          newUserData.income = newIncome;
        }
        // Ensure non-admin cannot set isAdmin flag
        if (newIsAdminFlag !== undefined && newIsAdminFlag !== prevUser.isAdmin) {
          newUserData.isAdmin = prevUser.isAdmin; // Revert
        } else if (newIsAdminFlag === undefined) {
          newUserData.isAdmin = false; // Default for non-admin if not specified
        }
      }
      
      storeCurrentUser(newUserData);
      
      let users = getStoredUsers();
      users = users.map(u => {
        if (u.id === newUserData.id) {
          // Retrieve stored password to keep it if user has one
          const existingStoredUser = users.find(usr => usr.id === newUserData.id);
          const password_INTERNAL_USE_ONLY = existingStoredUser?.password_INTERNAL_USE_ONLY;
          return { ...newUserData, password_INTERNAL_USE_ONLY };
        }
        return u;
      });
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
