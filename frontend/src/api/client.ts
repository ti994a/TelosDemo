import { ApiResponse } from '../types/api';

/**
 * API client for making HTTP requests to the backend.
 * Provides a wrapper around fetch with error handling and authentication.
 */

// Base URL for API requests (configured in vite.config.ts proxy)
const API_BASE_URL = '/api';

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public field?: string,
    public resourceId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Gets the authentication token from localStorage.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Makes an HTTP request to the API.
 * Automatically includes authentication token if available.
 * 
 * @param endpoint - API endpoint (e.g., '/tickets', '/auth/login')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws {ApiError} If request fails or returns error response
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Make request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse JSON response
    const data: ApiResponse<T> = await response.json();

    // Check if response indicates success
    if (!response.ok || !data.success) {
      // Extract error details
      const errorData = data as any;
      throw new ApiError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.field,
        errorData.resourceId
      );
    }

    // Return data from successful response
    return (data as any).data;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError('Network error. Please check your connection.', 0);
    }

    // Handle other errors
    throw new ApiError('An unexpected error occurred', 500);
  }
}

/**
 * Makes a GET request.
 */
export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

/**
 * Makes a POST request.
 */
export async function post<T>(endpoint: string, body?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Makes a PATCH request.
 */
export async function patch<T>(endpoint: string, body?: any): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Makes a DELETE request.
 */
export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

/**
 * Stores authentication token in localStorage.
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

/**
 * Removes authentication token from localStorage.
 */
export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}
