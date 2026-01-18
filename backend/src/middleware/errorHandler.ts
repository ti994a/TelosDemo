import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/errors';

/**
 * Global error handling middleware for Express.
 * Catches all errors thrown in route handlers and middleware,
 * and sends appropriate HTTP responses.
 * 
 * IMPORTANT: This must be registered AFTER all routes in app.ts
 */

/**
 * Error handler middleware.
 * Converts custom error types to appropriate HTTP status codes and responses.
 * 
 * @param error - Error object thrown by application code
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function (unused but required by Express)
 * 
 * @example
 * // In app.ts, register this LAST:
 * app.use('/api/tickets', ticketRoutes);
 * app.use('/api/auth', authRoutes);
 * app.use(errorHandler); // Must be last!
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging (in production, use proper logging service)
  console.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle ValidationError (400 Bad Request)
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.message,
      field: error.field, // Include field name if available
    });
    return;
  }

  // Handle NotFoundError (404 Not Found)
  if (error instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: error.message,
      resourceId: error.resourceId, // Include resource ID if available
    });
    return;
  }

  // Handle UnauthorizedError (401 Unauthorized)
  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message,
    });
    return;
  }

  // Handle all other errors (500 Internal Server Error)
  // In production, don't expose internal error details to clients
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred. Please try again later.'
        : error.message,
  });
}
