/**
 * Custom error classes for different error scenarios.
 * These errors are caught by the error handler middleware and
 * converted to appropriate HTTP responses.
 */

/**
 * ValidationError - Thrown when input validation fails.
 * Results in 400 Bad Request response.
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * NotFoundError - Thrown when a requested resource doesn't exist.
 * Results in 404 Not Found response.
 */
export class NotFoundError extends Error {
  constructor(message: string, public resourceId?: string) {
    super(message);
    this.name = 'NotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * UnauthorizedError - Thrown when authentication fails or token is invalid.
 * Results in 401 Unauthorized response.
 */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    Error.captureStackTrace(this, this.constructor);
  }
}
