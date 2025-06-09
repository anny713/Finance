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
  updateCurrentUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getStoredCurrentUser();
    // Simulate admin user for demo
    if (currentUser && currentUser.email === 'admin@example.com') {
      currentUser.isAdmin = true;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email); // Simplified: In real app, check hashed password

    if (foundUser) {
      // Simulate admin for demo
      if (foundUser.email === 'admin@example.com') {
        foundUser.isAdmin = true;
      }
      setUser(foundUser);
      storeCurrentUser(foundUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, []);

  const signup = useCallback(async (email: string, password_DoNotStore: string): Promise<boolean> => {
    setIsLoading(true);
    let users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      setIsLoading(false);
      return false; // User already exists
    }
    const newUser: User = { id: Date.now().toString(), email };
     // Simulate admin for demo
    if (newUser.email === 'admin@example.com') {
      newUser.isAdmin = true;
    }
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
      const newUserData = { ...prevUser, ...updatedUserData };
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
