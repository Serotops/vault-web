// Authentication utility functions

import { AuthUser } from '@/types';

export const authUtils = {
  // Token management
  getTokenFromStorage: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  },

  setTokenInStorage: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth-token', token);
  },

  removeTokenFromStorage: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
  },

  // User data management
  getUserFromStorage: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('auth-user');
    return userData ? JSON.parse(userData) : null;
  },

  setUserInStorage: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth-user', JSON.stringify(user));
  },

  removeUserFromStorage: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth-user');
  },

  // Token validation
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Password validation
  validatePassword: (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Email validation
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Username validation
  validateUsername: (username: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
    
    if (/^[0-9]/.test(username)) {
      errors.push('Username cannot start with a number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Clear all auth data
  clearAuthData: (): void => {
    authUtils.removeTokenFromStorage();
    authUtils.removeUserFromStorage();
  },
};
