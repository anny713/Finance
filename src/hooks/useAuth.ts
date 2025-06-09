
import { useContext } from 'react';
import { AuthContext, type AuthContextType as ProviderAuthContextType } from '@/components/auth/auth-provider';

// Remove signup from the context type exposed by the hook
export type AuthContextType = Omit<ProviderAuthContextType, 'signup'>;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Exclude signup from the returned context
  const { signup, ...rest } = context as any; // Cast to any to handle potential signup existence
  return rest as AuthContextType;
};
