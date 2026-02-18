import { createContext } from 'react';
import type { User } from '@/types/auth_types';

export interface AuthContextType {
  authUser: User | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
