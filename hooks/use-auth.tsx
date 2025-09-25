'use client';

// Authentication hooks using useContext

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, RegisterRequest } from '@/types';
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
  logout: () => Promise<void>;
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

// Helper functions for localStorage operations
const getUserFromStorage = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const setUserInStorage = (user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

const isTokenValid = (): boolean => {
  if (typeof window === 'undefined') return false;
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (!tokenExpiry) return false;
  return Date.now() < parseInt(tokenExpiry);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokens = apiClient.getTokens();
        const user = getUserFromStorage();

        if (tokens?.accessToken && user && isTokenValid()) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });        } else if (tokens?.refreshToken) {
          // Try to refresh the token
          try {
            const tokenResponse = await apiClient.refreshToken(tokens.refreshToken);
            apiClient.setAuthTokens(tokenResponse);
            
            // Create AuthUser from refresh response
            const authUser: AuthUser = {
              id: tokenResponse.userId,
              username: tokenResponse.email.split('@')[0], // Fallback username
              email: tokenResponse.email,
              token: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              expiresAt: new Date(tokenResponse.accessTokenExpiration),
            };
            
            setUserInStorage(authUser);
            dispatch({ type: 'AUTH_SUCCESS', payload: authUser });
          } catch (error) {
            // Refresh failed, clear auth data
            apiClient.clearAuth();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          // No valid tokens, clear auth data
          apiClient.clearAuth();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        // Error during initialization, clear auth data
        apiClient.clearAuth();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const tokenResponse = await apiClient.login({
        email: credentials.email,
        password: credentials.password,
      });
      
      // Store tokens
      apiClient.setAuthTokens(tokenResponse);
      
      // Create AuthUser from token response
      const authUser: AuthUser = {
        id: tokenResponse.userId,
        username: tokenResponse.email.split('@')[0], // Use email prefix as username fallback
        email: tokenResponse.email,
        token: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresAt: new Date(tokenResponse.accessTokenExpiration),
      };
      
      setUserInStorage(authUser);
      dispatch({ type: 'AUTH_SUCCESS', payload: authUser });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const tokenResponse = await apiClient.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        acceptTerms: userData.acceptTerms,
      });
      
      // Store tokens
      apiClient.setAuthTokens(tokenResponse);
      
      // Create AuthUser from token response
      const authUser: AuthUser = {
        id: tokenResponse.userId,
        username: userData.username,
        email: tokenResponse.email,
        token: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        expiresAt: new Date(tokenResponse.accessTokenExpiration),
      };
      
      setUserInStorage(authUser);
      dispatch({ type: 'AUTH_SUCCESS', payload: authUser });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call backend logout endpoint
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local auth data
      apiClient.clearAuth();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      const existingUser = getUserFromStorage();
      
      if (existingUser) {
        const updatedUser: AuthUser = {
          ...existingUser,
          id: currentUser.userId,
          email: currentUser.email,
        };
        
        setUserInStorage(updatedUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
      }
    } catch (error) {
      // If refresh fails, logout the user
      await logout();
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
