/**
 * TypeScript type definitions for authentication.
 */

/**
 * Represents a user (support agent).
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Login credentials.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Response from login endpoint.
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Authentication context value.
 */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
