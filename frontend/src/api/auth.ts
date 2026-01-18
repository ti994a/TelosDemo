import { get, post, setAuthToken, clearAuthToken } from './client';
import { LoginCredentials, LoginResponse, User } from '../types/auth';

/**
 * API functions for authentication operations.
 */

/**
 * Logs in a user and stores the authentication token.
 * 
 * @param credentials - Email and password
 * @returns Login response with token and user info
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/auth/login', credentials);
  
  // Store token in localStorage for subsequent requests
  setAuthToken(response.token);
  
  return response;
}

/**
 * Logs out the current user by removing the authentication token.
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint (optional with JWT)
    await post<void>('/auth/logout');
  } finally {
    // Always clear token from localStorage
    clearAuthToken();
  }
}

/**
 * Gets the current authenticated user's information.
 * 
 * @returns Current user
 */
export async function getCurrentUser(): Promise<User> {
  return get<User>('/auth/me');
}

/**
 * Registers a new user (support agent).
 * 
 * @param email - User's email
 * @param password - User's password
 * @param name - User's display name
 * @returns Created user
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<User> {
  return post<User>('/auth/register', { email, password, name });
}
