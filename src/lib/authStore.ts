import type { User } from '@/types';

const USERS_KEY = 'financeFlow_users';
const CURRENT_USER_KEY = 'financeFlow_currentUser';

// Ensure this code only runs on the client
const isClient = typeof window !== 'undefined';

export const getStoredUsers = (): User[] => {
  if (!isClient) return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const storeUsers = (users: User[]): void => {
  if (!isClient) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredCurrentUser = (): User | null => {
  if (!isClient) return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const storeCurrentUser = (user: User | null): void => {
  if (!isClient) return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
