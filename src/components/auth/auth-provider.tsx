
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  signup: (email: string, password_DoNotStore: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@finance.flow';
const ADMIN_PASSWORD = '12345678';
const ADMIN_NAME = 'Anjali';
const ADMIN_ID = 'admin_user_anjali_001';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredCurrentUser();
    // isAdmin flag should be correctly set in currentUser if they are admin
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);

    // Admin Check First
    if (email.toLowerCase() === ADMIN_EMAIL && password_DoNotStore === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        isAdmin: true,
      };
      setUser(adminUser);
      storeCurrentUser(adminUser);

      // Ensure this admin user is in the main users list for consistency
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

    // Regular user login
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()); // Simplified: In real app, check hashed password

    if (foundUser) {
      // Ensure non-admin users are explicitly not admin
      const regularUser = { ...foundUser, isAdmin: false };
      setUser(regularUser);
      storeCurrentUser(regularUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const signup = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    let users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      return false; // User already exists
    }
    const newUser: User = { 
      id: Date.now().toString(), 
      email: email, // Store email as is, comparison can be case-insensitive
      isAdmin: false // New users are never admin by default
    };
    
    users = [...users, newUser];
    storeUsers(users);
    setUser(newUser);
    storeCurrentUser(newUser);
    setIsLoading(false);
    return true;
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
      
      // If the current user is the admin, ensure their isAdmin status is preserved
      if (prevUser.id === ADMIN_ID) {
        newUserData.isAdmin = true;
      } else if (isAdmin !== undefined && prevUser.id !== ADMIN_ID) {
        // Log or handle attempt to change isAdmin for non-admin user if necessary
        console.warn("Attempt to modify isAdmin flag for non-admin user blocked.");
      }


      storeCurrentUser(newUserData);
      
      // also update in the main users list
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
