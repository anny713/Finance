
'use client';

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { getStoredUsers, storeUsers, getStoredCurrentUser, storeCurrentUser } from '@/lib/authStore';
import { useRouter }
from 'next/navigation';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password_DoNotStore: string) => Promise<boolean>;
  signup: (email: string, password_DoNotStore: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_LOGIN_EMAIL = 'admin@finance.flow';
const ADMIN_PASSWORD = '123'; // As per earlier request
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

    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password_INTERNAL_USE_ONLY === password_DoNotStore && !u.isAdmin
    );

    if (foundUser) {
      const { password_INTERNAL_USE_ONLY, ...userToStore } = foundUser;
      setUser(userToStore);
      storeCurrentUser(userToStore);
      setIsLoading(false);
      // Redirect to profile if essential info is missing, otherwise to plans
      if (!userToStore.name || !userToStore.mobile || typeof userToStore.income !== 'number') {
        router.push('/profile');
      } else {
        router.push('/plans');
      }
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
      return false; 
    }

    const newUser: User & { password_INTERNAL_USE_ONLY: string } = {
      id: `user_${Date.now().toString()}_${Math.random().toString(36).substring(2, 7)}`,
      email: email.toLowerCase(),
      isAdmin: false,
      // Name, mobile, income will be set in profile
      password_INTERNAL_USE_ONLY: password_DoNotStore,
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
      
      const newUserData: User = { ...prevUser, ...updatedUserData };

      if (prevUser.id === ADMIN_ID) {
        newUserData.isAdmin = true; 
        delete newUserData.income; // Ensure admin cannot have income
      } else {
        newUserData.isAdmin = false; // Ensure regular users are not admins
        // Income is handled by updatedUserData
      }
      
      storeCurrentUser(newUserData);
      
      let users = getStoredUsers();
      users = users.map(u => {
        if (u.id === newUserData.id) {
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
