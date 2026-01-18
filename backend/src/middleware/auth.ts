import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { UnauthorizedError } from '../utils/errors';

/**
 * Authentication middleware for Express.
 * Verifies JWT token and attaches user info to request object.
 */

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT tokens.
 * Expects token in Authorization header as "Bearer <token>".
 * Attaches decoded user info to req.user for use in route handlers.
 * 
 * @throws {UnauthorizedError} If token is missing, invalid, or expired
 * 
 * @example
 * // Protect a route with authentication
 * router.get('/tickets', authenticate, ticketController.getAllTickets);
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided. Please include Authorization header with Bearer token.');
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token and get user info
    const decoded = verifyToken(token);

    // Attach user info to request object
    // This makes user info available in all subsequent middleware and route handlers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
}
