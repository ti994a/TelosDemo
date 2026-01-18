/**
 * TypeScript type definitions for API responses.
 */

/**
 * Standard API success response.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  count?: number; // For list responses
}

/**
 * Standard API error response.
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  field?: string; // For validation errors
  resourceId?: string; // For not found errors
}

/**
 * Union type for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
