import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextValue } from '../types/auth';
import * as authApi from '../api/auth';
import { clearAuthToken } from '../api/client';

/**
 * Authentication context for managing user session globally.
 * Provides login, logout, and user state to all components.
 */

// Create context with undefined default (will be provided by AuthProvider)
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Props for AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps the app and provides authentication state.
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if user is already logged in (token in localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      // Token exists, fetch current user info
      setToken(storedToken);
      
      authApi
        .getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          // Token is invalid or expired, clear it
          console.error('Failed to fetch current user:', error);
          clearAuthToken();
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // No token, user is not logged in
      setIsLoading(false);
    }
  }, []);

  /**
   * Logs in a user with email and password.
   * Stores token and user info in state.
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await authApi.login(credentials);
    setToken(response.token);
    setUser(response.user);
  };

  /**
   * Logs out the current user.
   * Clears token and user info from state and localStorage.
   */
  const logout = (): void => {
    authApi.logout().catch((error) => {
      // Ignore logout API errors (token might already be invalid)
      console.error('Logout API error:', error);
    });
    
    setToken(null);
    setUser(null);
    clearAuthToken();
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context.
 * Must be used within AuthProvider.
 * 
 * @returns Authentication context value
 * @throws Error if used outside AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *   // ...
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
