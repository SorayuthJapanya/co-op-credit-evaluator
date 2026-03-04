import type { IUser } from '@/types/auth_types';
import { createContext } from 'react';

export interface AuthContextType {
  authUser: IUser | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
