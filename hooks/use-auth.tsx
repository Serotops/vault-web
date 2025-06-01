'use client';

// Authentication hooks using useContext

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';
import { authUtils } from '@/lib/auth-utils';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authUtils.getTokenFromStorage();
      const user = authUtils.getUserFromStorage();

      if (token && user && !authUtils.isTokenExpired(token)) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        authUtils.clearAuthData();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiClient.post<AuthUser>('/auth/login', credentials);
      
      if (response.success && response.data) {
        authUtils.setTokenInStorage(response.data.token);
        authUtils.setUserInStorage(response.data);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiClient.post<AuthUser>('/auth/register', userData);
      
      if (response.success && response.data) {
        authUtils.setTokenInStorage(response.data.token);
        authUtils.setUserInStorage(response.data);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = (): void => {
    authUtils.clearAuthData();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.get<AuthUser>('/auth/me');
      
      if (response.success && response.data) {
        authUtils.setUserInStorage(response.data);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      }
    } catch (error) {
      // If refresh fails, logout the user
      logout();
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
