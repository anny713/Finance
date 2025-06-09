
import type { User } from '@/types';

const USERS_KEY = 'financeFlow_users';
const CURRENT_USER_KEY = 'financeFlow_currentUser';

// Ensure this code only runs on the client
const isClient = typeof window !== 'undefined';

// Add a type for stored user which includes the plaintext password (for prototype only)
type StoredUser = User & { password_INTERNAL_USE_ONLY?: string };

export const getStoredUsers = (): StoredUser[] => {
  if (!isClient) return [];
  const usersStr = localStorage.getItem(USERS_KEY);
  if (usersStr) {
    try {
      const users = JSON.parse(usersStr);
      // Ensure all users have an id, default isAdmin to false if not present
      return users.map((u: any) => ({
        ...u,
        id: u.id || `generated_${Math.random().toString(36).substring(2, 9)}`, // ensure id exists
        isAdmin: u.isAdmin === undefined ? false : u.isAdmin,
      }));
    } catch (e) {
      console.error("Error parsing users from localStorage", e);
      return [];
    }
  }
  return [];
};

export const storeUsers = (users: StoredUser[]): void => {
  if (!isClient) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredCurrentUser = (): User | null => {
  if (!isClient) return null;
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Ensure the stored current user doesn't contain the password field
      const { password_INTERNAL_USE_ONLY, ...userToReturn } = user;
      return {
        ...userToReturn,
        isAdmin: userToReturn.isAdmin === undefined ? false : userToReturn.isAdmin,
      };
    } catch (e) {
      console.error("Error parsing current user from localStorage", e);
      return null;
    }
  }
  return null;
};

export const storeCurrentUser = (user: User | null): void => {
  if (!isClient) return;
  if (user) {
    // Ensure we don't store the internal password field directly in currentUser
    const { password_INTERNAL_USE_ONLY, ...userToStore } = user as StoredUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
