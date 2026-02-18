import React from 'react';
import type { ReactNode } from 'react';
import { useAuthUser } from '../hooks/useAuth';
import { AuthContext, type AuthContextType } from './authContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    data: authUser,
    isLoading,
    isError,
    error,
  } = useAuthUser();

  const value: AuthContextType = {
    authUser: authUser ?? null,
    isLoading,
    isError,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
